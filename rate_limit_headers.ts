/**
 * Parses rate limit headers from HTTP responses
 */
export interface RateLimitHeaders {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
}

/**
 * Parsed rate limit headers plus the request context they came from.
 *
 * Delivered to the `onRateLimitInfo` callback after every successful request
 * so callers can build observability around the rate limit (warn at thresholds,
 * emit metrics, etc.).
 */
export interface RateLimitInfo extends RateLimitHeaders {
  /** HTTP method of the call (GET, POST, ...). */
  method: string;
  /** Request URL. */
  url: string;
}

/**
 * Returns the fraction of the rate limit currently used in [0.0, 1.0],
 * or `null` when the headers aren't usable (missing limit, zero limit,
 * missing remaining).
 */
export function rateLimitUsagePct(info: RateLimitHeaders): number | null {
  if (info.limit == null || info.remaining == null || info.limit <= 0) {
    return null;
  }
  return 1 - info.remaining / info.limit;
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
 * Returns a `RateLimitInfo` (headers + request context), or `null` when no
 * `x-ratelimit-*` headers are present (e.g. self-hosted Lago instance with
 * limits disabled). Useful for skipping observability emission entirely when
 * there's nothing to report.
 */
export function parseRateLimitInfo(
  headers: Headers,
  method: string,
  url: string,
): RateLimitInfo | null {
  const parsed = parseRateLimitHeaders(headers);
  if (
    parsed.limit == null && parsed.remaining == null && parsed.reset == null
  ) {
    return null;
  }
  return { ...parsed, method, url };
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
