/**
 * Error class for rate limit (HTTP 429) responses
 */
export class LagoRateLimitError extends Error {
  public readonly limit: number;
  public readonly remaining: number;
  public readonly reset: number; // seconds until window resets
  public readonly retryAfter: number; // milliseconds to wait before retrying

  constructor(
    limit: number,
    remaining: number,
    reset: number,
  ) {
    super(
      `Rate limit exceeded. Limit: ${limit}, Remaining: ${remaining}, Reset in: ${reset}s`,
    );
    this.name = "LagoRateLimitError";
    this.limit = limit;
    this.remaining = remaining;
    this.reset = reset;
    this.retryAfter = reset * 1000; // Convert seconds to milliseconds

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, LagoRateLimitError.prototype);
  }
}
