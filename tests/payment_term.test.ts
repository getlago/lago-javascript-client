import { assertEquals } from "../dev_deps.ts";
import type {
  BillingEntityCreateInput,
  CustomerCreateInput,
  InvoiceOneOffCreateInput,
  InvoicePreviewInput,
  PaymentTermObject,
  SubscriptionCreateInput,
  SubscriptionUpdateInput,
  WalletCreateInput,
} from "../mod.ts";
import { lagoTest, setupMockClient } from "./utils.ts";

const netTerm = {
  term_type: "net",
  days: 30,
} as const satisfies PaymentTermObject;

const dayOfMonthTerm = {
  term_type: "day_of_month",
  day_of_month: 15,
  month_offset: 1,
} as const satisfies PaymentTermObject;

const customerWithNetPaymentTermOnly = {
  customer: {
    external_id: "cus_123",
    net_payment_term: 30,
  },
} as const satisfies CustomerCreateInput;

const customerWithPaymentTerm = {
  customer: {
    external_id: "cus_123",
    payment_term: dayOfMonthTerm,
  },
} as const satisfies CustomerCreateInput;

const subscriptionUpdateWithoutPaymentTerm = {
  subscription: {
    name: "Renamed subscription",
  },
} as const satisfies SubscriptionUpdateInput;

const subscriptionUpdateWithPaymentTerm = {
  subscription: {
    name: "Renamed subscription",
    payment_term: netTerm,
  },
} as const satisfies SubscriptionUpdateInput;

const subscriptionCreateWithPaymentTerm = {
  subscription: {
    external_customer_id: "cus_123",
    plan_code: "plan_code",
    external_id: "sub_123",
    payment_term: { term_type: "end_of_month" },
  },
} as const satisfies SubscriptionCreateInput;

const billingEntityWithPaymentTerm = {
  billing_entity: {
    code: "entity_code",
    name: "Entity",
    payment_term: { term_type: "net_end_of_month", days: 10 },
  },
} as const satisfies BillingEntityCreateInput;

const walletWithPaymentTerm = {
  wallet: {
    external_customer_id: "cus_123",
    currency: "EUR",
    rate_amount: "1",
    payment_term: netTerm,
  },
} as const satisfies WalletCreateInput;

const oneOffInvoiceWithPaymentTerm = {
  invoice: {
    external_customer_id: "cus_123",
    currency: "EUR",
    payment_term: { term_type: "due_on_receipt" },
    fees: [{ add_on_code: "setup_fee", unit_amount_cents: 1000 }],
  },
} as const satisfies InvoiceOneOffCreateInput;

const invoicePreviewWithPaymentTerm = {
  customer: { external_id: "cus_123" },
  plan_code: "plan_code",
  payment_term: netTerm,
} as const satisfies InvoicePreviewInput;

async function sentBody(
  send: (
    client: ReturnType<typeof setupMockClient>,
  ) => Promise<unknown>,
  route: Parameters<typeof setupMockClient>[0],
) {
  let body: Record<string, Record<string, unknown>> | undefined;
  const client = setupMockClient(route, async (request) => {
    body = await request.json();
    return new Response("{}", { status: 200 });
  });
  await send(client);
  return body;
}

Deno.test("Customer with only net_payment_term sends no payment_term", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/customers",
    clientPath: ["customers", "createCustomer"],
    inputParams: [customerWithNetPaymentTermOnly],
    responseObject: undefined,
    status: 200,
    expectedBody: customerWithNetPaymentTermOnly,
  });

  const body = await sentBody(
    (client) => client.customers.createCustomer(customerWithNetPaymentTermOnly),
    "POST@/api/v1/customers",
  );
  assertEquals("payment_term" in body!.customer, false);
  assertEquals(body!.customer.net_payment_term, 30);
});

Deno.test("Customer with an undefined payment_term does not send the key", async () => {
  const body = await sentBody(
    (client) =>
      client.customers.createCustomer({
        customer: {
          external_id: "cus_123",
          net_payment_term: 30,
          payment_term: undefined,
        },
      }),
    "POST@/api/v1/customers",
  );
  assertEquals("payment_term" in body!.customer, false);
});

Deno.test("Customer with an explicit null payment_term sends null", async () => {
  const body = await sentBody(
    (client) =>
      client.customers.createCustomer({
        customer: { external_id: "cus_123", payment_term: null },
      }),
    "POST@/api/v1/customers",
  );
  assertEquals(body!.customer.payment_term, null);
  assertEquals("net_payment_term" in body!.customer, false);
});

Deno.test("Customer with a payment_term sends the structured term", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/customers",
    clientPath: ["customers", "createCustomer"],
    inputParams: [customerWithPaymentTerm],
    responseObject: undefined,
    status: 200,
    expectedBody: customerWithPaymentTerm,
  });
});

Deno.test("Subscription update without payment_term sends no payment_term", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "PUT@/api/v1/subscriptions/sub_123",
    clientPath: ["subscriptions", "updateSubscription"],
    inputParams: ["sub_123", subscriptionUpdateWithoutPaymentTerm],
    responseObject: undefined,
    status: 200,
    expectedBody: subscriptionUpdateWithoutPaymentTerm,
  });

  const body = await sentBody(
    (client) =>
      client.subscriptions.updateSubscription(
        "sub_123",
        subscriptionUpdateWithoutPaymentTerm,
      ),
    "PUT@/api/v1/subscriptions/sub_123",
  );
  assertEquals("payment_term" in body!.subscription, false);
});

Deno.test("Subscription update with payment_term sends the structured term", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "PUT@/api/v1/subscriptions/sub_123",
    clientPath: ["subscriptions", "updateSubscription"],
    inputParams: ["sub_123", subscriptionUpdateWithPaymentTerm],
    responseObject: undefined,
    status: 200,
    expectedBody: subscriptionUpdateWithPaymentTerm,
  });
});

Deno.test("Subscription create with payment_term sends the structured term", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/subscriptions",
    clientPath: ["subscriptions", "createSubscription"],
    inputParams: [subscriptionCreateWithPaymentTerm],
    responseObject: undefined,
    status: 200,
    expectedBody: subscriptionCreateWithPaymentTerm,
  });
});

Deno.test("Billing entity create with payment_term sends the structured term", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/billing_entities",
    clientPath: ["billingEntities", "createBillingEntity"],
    inputParams: [billingEntityWithPaymentTerm],
    responseObject: undefined,
    status: 200,
    expectedBody: billingEntityWithPaymentTerm,
  });
});

Deno.test("Wallet create with payment_term sends the structured term", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/wallets",
    clientPath: ["wallets", "createWallet"],
    inputParams: [walletWithPaymentTerm],
    responseObject: undefined,
    status: 200,
    expectedBody: walletWithPaymentTerm,
  });
});

Deno.test("One-off invoice create with payment_term sends the structured term", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/invoices",
    clientPath: ["invoices", "createInvoice"],
    inputParams: [oneOffInvoiceWithPaymentTerm],
    responseObject: undefined,
    status: 200,
    expectedBody: oneOffInvoiceWithPaymentTerm,
  });
});

Deno.test("Invoice preview with payment_term sends it at the top level", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/invoices/preview",
    clientPath: ["invoices", "invoicePreview"],
    inputParams: [invoicePreviewWithPaymentTerm],
    responseObject: undefined,
    status: 200,
    expectedBody: invoicePreviewWithPaymentTerm,
  });
});

Deno.test("Customer response exposes the structured payment_term", async () => {
  const client = setupMockClient("POST@/api/v1/customers", () =>
    new Response(
      JSON.stringify({
        customer: {
          external_id: "cus_123",
          payment_term: dayOfMonthTerm,
          net_payment_term: null,
        },
      }),
      { status: 200 },
    ));

  const { data } = await client.customers.createCustomer(
    customerWithPaymentTerm,
  );

  assertEquals(data.customer.payment_term, dayOfMonthTerm);
  assertEquals(data.customer.net_payment_term, null);
});
