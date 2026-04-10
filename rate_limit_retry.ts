import { LagoRateLimitError } from "./rate_limit_error.ts";
import { parseRateLimitHeaders } from "./rate_limit_headers.ts";

/**
 * Configuration for rate limit retry behavior
 */
export interface RateLimitRetryConfig {
  /** Maximum number of retries on 429 (default: 3) */
  maxRetries?: number;
  /** Whether to automatically retry on rate limit (default: true) */
  retryOnRateLimit?: boolean;
}

/**
 * Retry handler for rate-limited requests
 * Handles 429 responses with automatic retry based on rate limit headers
 */
export class RateLimitRetryHandler {
  private maxRetries: number;
  private retryOnRateLimit: boolean;

  constructor(config: RateLimitRetryConfig = {}) {
    this.maxRetries = config.maxRetries ?? 3;
    this.retryOnRateLimit = config.retryOnRateLimit ?? true;
  }

  /**
   * Handle a response that may have rate limiting
   * Throws LagoRateLimitError on 429, or rethrows if retryOnRateLimit is false
   */
  async handleResponse(response: Response): Promise<Response> {
    if (response.status === 429) {
      const headers = parseRateLimitHeaders(response.headers);

      // Parse rate limit headers to create error
      const limit = headers.limit ?? -1;
      const remaining = headers.remaining ?? 0;
      const reset = headers.reset ?? 60; // Default to 60s if not provided

      if (!this.retryOnRateLimit) {
        throw new LagoRateLimitError(limit, remaining, reset);
      }

      throw new LagoRateLimitError(limit, remaining, reset);
    }

    return response;
  }

  /**
   * Sleep for a specified number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retry a request function with exponential backoff on rate limit
   */
  async retryWithBackoff<T>(
    requestFn: () => Promise<T>,
    isRateLimitError: (error: unknown) => boolean = (e) =>
      e instanceof LagoRateLimitError,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        if (!isRateLimitError(error)) {
          throw error; // Not a rate limit error, rethrow immediately
        }

        if (attempt === this.maxRetries) {
          throw error; // Max retries reached
        }

        // Calculate wait time
        let waitMs: number;
        if (error instanceof LagoRateLimitError) {
          // Use the exact reset time from the header
          waitMs = error.retryAfter;
        } else {
          // Exponential backoff: 1s, 2s, 4s, 8s, etc.
          waitMs = 1000 * Math.pow(2, attempt);
        }

        // Add small jitter to prevent thundering herd
        const jitter = Math.random() * 100;
        await this.sleep(waitMs + jitter);
      }
    }

    throw lastError;
  }
}
