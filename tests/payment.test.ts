import { assertEquals } from "../dev_deps.ts";
import { Client } from "../mod.ts";
import type { Api } from "../mod.ts";
import { createMockFetch } from "./utils.ts";

type PaymentFilters = NonNullable<
  Parameters<Api<unknown>["payments"]["findAllPayments"]>[0]
>;
type CustomerPaymentFilters = NonNullable<
  Parameters<Api<unknown>["customers"]["findAllCustomerPayments"]>[1]
>;

const filters = {
  page: 2,
  per_page: 5,
  external_customer_id: "cust_1",
  invoice_id: "1a901a90-1a90-1a90-1a90-1a901a901a90",
  "payment_status[]": ["succeeded", "failed"],
  "payment_statuses[]": ["pending", "processing"],
  amount_from: "9007199254740993",
  amount_to: "9223372036854775807",
  receipt_number: "Rcpt & +/#1",
  created_at_from: "2026-09-01",
  created_at_to: "2026-09-07",
  "payment_provider_type[]": ["stripe", "gocardless"],
  "payment_method_type[]": ["card", "sepa_debit"],
  currency: "EUR",
  invoice_number: "LAG & +/#2",
  "payment_type[]": ["manual", "provider"],
  "payable_type[]": ["Invoice", "PaymentRequest"],
  search_term: "pi_3 & +/#",
} satisfies PaymentFilters;

const { external_customer_id, ...customerFilters } = filters;
customerFilters satisfies CustomerPaymentFilters;

// These checks fail compilation if generation loses the enum or bigint types.
const invalidStatus: PaymentFilters = {
  // @ts-expect-error Unknown statuses must remain a type error.
  "payment_status[]": ["bogus"],
};
const invalidAmount: PaymentFilters = {
  // @ts-expect-error Bounds accept decimal strings/numbers, not booleans.
  amount_from: true,
};
void invalidStatus;
void invalidAmount;

for (const customerScoped of [false, true]) {
  Deno.test(`Payment filters serialize without losing precision (customer=${customerScoped})`, async () => {
    const route = customerScoped
      ? "GET@/api/v1/customers/cust_1/payments"
      : "GET@/api/v1/payments";
    const { fetch, getRequest, expectedPath } = createMockFetch(
      route,
      () =>
        new Response(JSON.stringify({
          payments: [],
          meta: { current_page: 2, total_pages: 0, total_count: 0 },
        })),
    );
    const client = Client("test-key", { customFetch: fetch });
    const response = customerScoped
      ? await client.customers.findAllCustomerPayments(
        external_customer_id,
        customerFilters,
      )
      : await client.payments.findAllPayments(filters);
    assertEquals(response.data.meta.total_count, 0);
    const request = getRequest()!;
    const url = new URL(request.url);
    assertEquals(url.pathname, expectedPath);
    assertEquals(request.headers.get("Authorization"), "Bearer test-key");
    const expected = customerScoped ? customerFilters : filters;
    for (const [key, value] of Object.entries(expected)) {
      assertEquals(
        url.searchParams.getAll(key),
        (Array.isArray(value) ? value : [value]).map(String),
      );
    }
    assertEquals([...url.searchParams.keys()].length, customerScoped ? 23 : 24);
    assertEquals(url.searchParams.get("amount_from"), "9007199254740993");
    assertEquals(url.searchParams.get("amount_to"), "9223372036854775807");
  });
}

Deno.test("Payment filter numeric zero and existing pagination remain supported", async () => {
  const { fetch, getRequest } = createMockFetch(
    "GET@/api/v1/payments",
    () => new Response("{}"),
  );
  const client = Client("test-key", { customFetch: fetch });
  await client.payments.findAllPayments({
    page: 1,
    per_page: 10,
    amount_from: 0,
    amount_to: 5000000000,
  });
  assertEquals(
    new URL(getRequest()!.url).search,
    "?page=1&per_page=10&amount_from=0&amount_to=5000000000",
  );
});
