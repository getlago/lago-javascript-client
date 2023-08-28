// deno-lint-ignore-file no-explicit-any ban-types
import { assertEquals } from "../dev_deps.ts";
import { mf } from "../dev_deps.ts";
import { Client, getLagoError } from "../mod.ts";
import type {
  Api,
  ApiErrorNotFound,
  ApiErrorUnauthorized,
  ApiErrorUnprocessableEntity,
  HttpResponse,
} from "../mod.ts";

type ExtractLagoDataOrError<E> = E extends (
  ...args: any
) => Promise<HttpResponse<infer T, infer P>> ? T | P
  : never;

type ExtractLagoInput<I> = I extends (
  ...args: infer P
) => Promise<HttpResponse<infer T, infer U>> ? P
  : never;

type ExtractLagoResponse<E> = E extends (
  ...args: any
) => Promise<infer T> ? T
  : never;

const errorMessage = "Lago Error" as const;

export function setupMockClient(route: string, handler: mf.MatchHandler) {
  const { fetch, mock } = mf.sandbox();

  mock(route, handler);

  return Client("api_key", { customFetch: fetch });
}

export async function lagoTest<
  T extends keyof Api<unknown>,
  U extends keyof Api<unknown>[T],
>(
  {
    t,
    route,
    clientPath,
    inputParams,
    responseObject,
    status,
    testType,
    urlParams,
  }: {
    testType: "error" | "200";
    t: Deno.TestContext;
    route: `${"POST" | "GET" | "PUT" | "DELETE"}@/api/v1/${string}`;
    clientPath: [T, U];
    inputParams: ExtractLagoInput<Api<unknown>[T][U]>;
    responseObject?: ExtractLagoDataOrError<
      Api<unknown>[T][U]
    >;
    status: number;
    urlParams?: Record<string, string>;
  },
) {
  const client = setupMockClient(
    route,
    (_req) => {
      if (urlParams) {
        const urlSearchParams = new URLSearchParams(new URL(_req.url).search);
        Object.entries(urlParams).forEach(([key, value]) => {
          assertEquals(urlSearchParams.get(key), value);
        });
      }
      return new Response(
        responseObject ? JSON.stringify(responseObject) : null,
        { status },
      );
    },
  );

  switch (testType) {
    case "error":
      await t.step("raises an exception", async () => {
        try {
          await (client[clientPath[0]][clientPath[1]] as (Function))(
            ...inputParams,
          ) as ExtractLagoResponse<Api<unknown>[T][U]>;
          // Error if there is no Error
          assertEquals(0, 1);
        } catch (error) {
          const lagoError = await getLagoError<
            typeof client[typeof clientPath[0]][typeof clientPath[1]]
          >(
            error,
          );
          assertEquals(
            (lagoError as ApiErrorUnprocessableEntity).error,
            errorMessage,
          );
        }
      });
      break;

    case "200":
      await t.step("returns 200 response", async () => {
        const response =
          await (client[clientPath[0]][clientPath[1]] as Function)(
            ...inputParams,
          ) as Response;

        assertEquals(response.status, 200);
      });
      break;

    default:
      throw new Error("Test type not found!");
  }
}

export const unprocessableErrorResponse = {
  status: 422,
  error: errorMessage,
  code: "validation_errors",
  error_details: {},
} as const satisfies ApiErrorUnprocessableEntity;

export const notFoundErrorResponse = {
  status: 404,
  error: errorMessage,
  code: "object_not_found",
} as const satisfies ApiErrorNotFound;

export const unauthorizedErrorResponse = {
  status: 401,
  error: errorMessage,
} as const satisfies ApiErrorUnauthorized;
