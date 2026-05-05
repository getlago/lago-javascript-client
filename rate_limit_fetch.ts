import { LagoRateLimitError } from "./rate_limit_error.ts";
import {
  parseRateLimitHeaders,
  parseRateLimitInfo,
  type RateLimitInfo,
} from "./rate_limit_headers.ts";

/**
 * Callback invoked after every successful response with parsed rate limit
 * headers. Use this to build observability around the rate limit (warn at
 * thresholds, emit metrics, etc.).
 *
 * Errors thrown by the callback are caught and logged so they cannot break
 * the underlying request flow.
 */
export type RateLimitInfoCallback = (info: RateLimitInfo) => void;

/**
 * Configuration for rate limit fetch behavior
 */
export interface RateLimitFetchConfig {
  /** Maximum number of retries on 429 (default: 3) */
  maxRetries?: number;
  /** Whether to automatically retry on rate limit (default: true) */
  retryOnRateLimit?: boolean;
  /** Maximum delay in milliseconds before a retry (default: 20000) */
  maxRetryDelay?: number;
  /**
   * Optional callback invoked after every successful (non-429) response
   * with parsed rate limit headers. See `RateLimitInfoCallback`.
   */
  onRateLimitInfo?: RateLimitInfoCallback;
}

/**
 * Creates a fetch wrapper that handles rate limiting with automatic retry
 * Compatible with both Node.js fetch and browser fetch APIs
 */
export function createRateLimitFetch(
  baseFetch: typeof fetch,
  config: RateLimitFetchConfig = {},
): typeof fetch {
  const maxRetries = config.maxRetries ?? 3;
  const retryOnRateLimit = config.retryOnRateLimit ?? true;
  const maxRetryDelay = config.maxRetryDelay ?? 20_000;
  const onRateLimitInfo = config.onRateLimitInfo;

  return async function rateLimitFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await baseFetch(input, init);

        // Handle 429 responses
        if (response.status === 429) {
          const headers = parseRateLimitHeaders(response.headers);
          const limit = headers.limit ?? -1;
          const remaining = headers.remaining ?? 0;
          const reset = headers.reset ?? -1;

          const error = new LagoRateLimitError(limit, remaining, reset);

          if (!retryOnRateLimit) {
            throw error;
          }

          if (attempt === maxRetries) {
            throw error; // Max retries reached
          }

          // Wait before retry
          const waitMs = getWaitTime(error, attempt, maxRetryDelay);
          await sleep(waitMs);
          continue; // Retry
        }

        // Success: emit observability info. Non-2xx, non-429 responses are
        // returned as-is without invoking the callback because their headers
        // do not carry useful rate limit context.
        if (onRateLimitInfo && response.ok) {
          emitRateLimitInfo(onRateLimitInfo, response, input, init);
        }
        return response;
      } catch (error) {
        lastError = error;

        if (!(error instanceof LagoRateLimitError)) {
          throw error; // Not a rate limit error, rethrow immediately
        }

        if (attempt === maxRetries) {
          throw error; // Max retries reached
        }

        // Will retry on next iteration
      }
    }

    throw lastError;
  };
}

/**
 * Invoke the configured callback with parsed rate limit info, swallowing any
 * exception so a buggy observer cannot break the request.
 */
function emitRateLimitInfo(
  callback: RateLimitInfoCallback,
  response: Response,
  input: RequestInfo | URL,
  init?: RequestInit,
): void {
  try {
    // Honor the method on a Request input when init.method is undefined
    // (a valid fetch signature: fetch(new Request(url, { method: 'POST' }))).
    const method = (
      init?.method ?? (input instanceof Request ? input.method : "GET")
    ).toUpperCase();
    const url = requestUrl(input);
    const info = parseRateLimitInfo(response.headers, method, url);
    if (info === null) return;
    callback(info);
  } catch (err) {
    // Never let observability break the request flow.
    // deno-lint-ignore no-console
    console.warn("Lago: onRateLimitInfo callback raised:", err);
  }
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  // Request
  return (input as Request).url;
}

/**
 * Calculate wait time before retry
 * Uses the exact reset time from headers if available, otherwise exponential backoff
 */
function getWaitTime(
  error: LagoRateLimitError,
  attempt: number,
  maxRetryDelay: number,
): number {
  let waitMs: number;

  if (error.reset > 0) {
    // Use the exact reset time from the header
    waitMs = error.retryAfter;
  } else {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    waitMs = 1000 * Math.pow(2, attempt);
  }

  // Cap at maxRetryDelay
  waitMs = Math.min(waitMs, maxRetryDelay);

  // Add small jitter to prevent thundering herd (max 100ms)
  const jitter = Math.random() * 100;
  return waitMs + jitter;
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
