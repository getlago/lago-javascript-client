// deno-lint-ignore-file no-explicit-any
import { Api, ApiConfig, HttpResponse } from "./openapi/client.ts";
import { createRateLimitFetch } from "./rate_limit_fetch.ts";
import type { RateLimitFetchConfig } from "./rate_limit_fetch.ts";

export interface LagoClientConfig extends ApiConfig {
  /**
   * Rate limit retry configuration
   */
  rateLimitRetry?: RateLimitFetchConfig;
}

export const Client = (apiKey: string, apiConfig?: LagoClientConfig) => {
  const { rateLimitRetry, ...restConfig } = apiConfig ?? {};

  // Create rate-limit-aware fetch if configured
  const customFetch = rateLimitRetry
    ? createRateLimitFetch(
      (restConfig?.customFetch ?? globalThis.fetch) as typeof fetch,
      rateLimitRetry,
    )
    : restConfig?.customFetch;

  const api = new Api({
    securityWorker: (apiKey) =>
      apiKey ? { headers: { Authorization: `Bearer ${apiKey}` } } : {},
    // Cloudflare Workers doesn't support some options like credentials so need to override default
    baseApiParams: {
      redirect: "follow",
    },
    ...restConfig,
    ...(customFetch && { customFetch }),
  });
  api.setSecurityData(apiKey);
  return api;
};

type ExtractLagoError<E> = E extends (
  ...args: any
) => Promise<HttpResponse<infer T, infer P>> ? P
  : never;

// https://github.com/remix-run/remix/blob/ef26f7671a9619966a6cfa3c39e196d44fbf32cf/packages/remix-server-runtime/responses.ts#L60
function isResponse(value: any): value is Response {
  return (
    value != null &&
    typeof value.status === "number" &&
    typeof value.statusText === "string" &&
    typeof value.headers === "object" &&
    typeof value.body !== "undefined"
  );
}

export async function getLagoError<T>(error: any) {
  if (isResponse(error)) {
    if (!error.bodyUsed) {
      const errorJson = await error.json() as ExtractLagoError<T>;
      return errorJson;
    }
    return (error as HttpResponse<any, any>).error as ExtractLagoError<T>;
  }
  throw new Error(error);
}

// Rate limit exports
export { LagoRateLimitError } from "./rate_limit_error.ts";
export {
  parseRateLimitHeaders,
  parseRateLimitInfo,
  type RateLimitHeaders,
  type RateLimitInfo,
  rateLimitUsagePct,
} from "./rate_limit_headers.ts";
export {
  createRateLimitFetch,
  type RateLimitFetchConfig,
  type RateLimitInfoCallback,
} from "./rate_limit_fetch.ts";
export {
  DEFAULT_RATE_LIMIT_THRESHOLDS,
  loggingRateLimitObserver,
  type LoggingRateLimitObserverOptions,
} from "./logging_rate_limit_observer.ts";

export * from "./openapi/client.ts";
