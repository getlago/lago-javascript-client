// deno-lint-ignore-file no-explicit-any
import { Api, ApiConfig, HttpResponse } from "./swagger/client.ts";

export const Client = (apiKey: string, apiConfig?: ApiConfig) => {
  const api = new Api({
    securityWorker: (apiKey) =>
      apiKey ? { headers: { Authorization: `Bearer ${apiKey}` } } : {},
    // Cloudflare Workers doesn't support some options like credentials so need to override default
    baseApiParams: {
      redirect: "follow",
    },
    ...apiConfig,
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

export * from "./swagger/client.ts";
