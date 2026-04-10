import { LagoRateLimitError } from "./rate_limit_error.ts";
import {
  parseRateLimitHeaders,
  type RateLimitHeaders,
} from "./rate_limit_headers.ts";

/**
 * Configuration for rate limit fetch behavior
 */
export interface RateLimitFetchConfig {
  /** Maximum number of retries on 429 (default: 3) */
  maxRetries?: number;
  /** Whether to automatically retry on rate limit (default: true) */
  retryOnRateLimit?: boolean;
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
          const reset = headers.reset ?? 60;

          const error = new LagoRateLimitError(limit, remaining, reset);

          if (!retryOnRateLimit) {
            throw error;
          }

          if (attempt === maxRetries) {
            throw error; // Max retries reached
          }

          // Wait before retry
          const waitMs = getWaitTime(error, attempt);
          await sleep(waitMs);
          continue; // Retry
        }

        // Success or non-rate-limit error - return the response
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
 * Calculate wait time before retry
 * Uses the exact reset time from headers if available, otherwise exponential backoff
 */
function getWaitTime(error: LagoRateLimitError, attempt: number): number {
  // Use the exact reset time from the header
  let waitMs = error.retryAfter;

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
