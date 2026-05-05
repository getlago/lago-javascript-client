import { type RateLimitInfo, rateLimitUsagePct } from "./rate_limit_headers.ts";
import type { RateLimitInfoCallback } from "./rate_limit_fetch.ts";

/**
 * Default usage thresholds (80%, 90%, 95%) at which the observer emits a log.
 */
export const DEFAULT_RATE_LIMIT_THRESHOLDS: readonly number[] = [
  0.8,
  0.9,
  0.95,
];

/**
 * Configuration for the LoggingRateLimitObserver.
 */
export interface LoggingRateLimitObserverOptions {
  /** Usage fractions (0.0 - 1.0) that should produce a log line. */
  thresholds?: readonly number[];
  /**
   * Function used to emit the log line. Defaults to `console.warn`.
   * Useful when injecting a structured logger.
   */
  log?: (message: string) => void;
}

/**
 * Returns a ready-to-use `onRateLimitInfo` callback that logs a warning each
 * time rate limit usage crosses one of the configured thresholds.
 *
 * Example:
 *
 * ```ts
 * import { Client } from "@getlago/lago-javascript-client";
 * import { loggingRateLimitObserver } from "@getlago/lago-javascript-client";
 *
 * const client = Client(apiKey, {
 *   rateLimitRetry: { onRateLimitInfo: loggingRateLimitObserver() },
 * });
 * ```
 */
export function loggingRateLimitObserver(
  options: LoggingRateLimitObserverOptions = {},
): RateLimitInfoCallback {
  const thresholds = [...(options.thresholds ?? DEFAULT_RATE_LIMIT_THRESHOLDS)]
    .sort((a, b) => b - a); // descending
  // deno-lint-ignore no-console
  const log = options.log ?? ((m: string) => console.warn(m));

  return function observe(info: RateLimitInfo): void {
    const pct = rateLimitUsagePct(info);
    if (pct === null) return;

    for (const threshold of thresholds) {
      if (pct >= threshold) {
        log(
          `Lago rate limit at ${
            (pct * 100).toFixed(0)
          }% (limit=${info.limit}, ` +
            `remaining=${info.remaining}, reset=${info.reset}s, ` +
            `${info.method} ${info.url})`,
        );
        return;
      }
    }
  };
}
