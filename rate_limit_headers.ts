/**
 * Parses rate limit headers from HTTP responses
 */
export interface RateLimitHeaders {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
}

/**
 * Extract rate limit information from response headers
 */
export function parseRateLimitHeaders(headers: Headers): RateLimitHeaders {
  return {
    limit: parseHeaderAsNumber(headers, "x-ratelimit-limit"),
    remaining: parseHeaderAsNumber(headers, "x-ratelimit-remaining"),
    reset: parseHeaderAsNumber(headers, "x-ratelimit-reset"),
  };
}

/**
 * Helper to parse a header value as a number
 */
function parseHeaderAsNumber(
  headers: Headers,
  headerName: string,
): number | null {
  const value = headers.get(headerName);
  if (value === null) return null;

  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
}
