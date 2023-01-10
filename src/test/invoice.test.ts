import type { Invoice, Invoices } from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const invoiceResponse = {
  "invoice": {
    "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
    "sequential_id": 12345,
    "number": "222345",
    "issuing_date": "2022-09-14T16:35:31Z",
    "invoice_type": "subscription",
    "payment_status": "pending",
    "amount_cents": 1200,
    "amount_currency": "EUR",
    "vat_amount_cents": 20,
    "vat_amount_currency": "EUR",
    "credit_amount_cents": 20,
    "credit_amount_currency": "EUR",
    "total_amount_cents": 1220,
    "total_amount_currency": "EUR",
    "legacy": true,
    "file_url": "https://example.com",
    "customer": {
      "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
      "external_id": "886da83c-c007-4fbb-afcd-b00c07c41ffe",
      "name": "John Doe",
      "sequential_id": 12345,
      "slug": "slug",
      "created_at": "2022-09-14T16:35:31Z",
      "country": "CZ",
      "address_line1": "address1",
      "address_line2": "address2",
      "state": "state1",
      "zipode": "10000",
      "email": "example@example.com",
      "city": "City",
      "url": "https://example.com",
      "phone": "3551234567",
      "lago_url": "https://lago.url",
      "legal_name": "name1",
      "legal_number": "10000",
      "currency": "EUR",
      "timezone": "UTC",
      "applicable_timezone": "UTC",
      "billing_configuration": {
        "invoice_grace_period": 3,
        "vat_rate": 25,
        "payment_provider": "stripe",
        "provider_customer_id": "123456",
        "sync_with_provider": true,
        "additionalProp1": {},
      },
    },
    "subscriptions": [
      {
        "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "external_id": "12345",
        "lago_customer_id": "995da83c-c007-4fbb-afcd-b00c07c41tre",
        "external_customer_id": "54321",
        "name": "Test subscription",
        "plan_code": "plan_code",
        "status": "active",
        "billing_time": "calendar",
        "subscription_at": "2022-09-14T16:35:31Z",
        "started_at": "2022-09-14T16:35:31Z",
        "terminated_at": "2022-09-14T16:35:31Z",
        "canceled_at": "2022-09-14T16:35:31Z",
        "created_at": "2022-09-14T16:35:31Z",
        "previous_plan_code": "previous_code",
        "next_plan_code": "next_code",
        "downgrade_plan_date": "2022-09-14T16:35:31Z",
      },
    ],
    "fees": [
      {
        "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "lago_group_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "amount_cents": 1200,
        "amount_currency": "EUR",
        "vat_amount_cents": 1200,
        "vat_amount_currency": "EUR",
        "units": 2.5,
        "events_count": 5,
        "item": {
          "type": "charge",
          "code": "code",
          "name": "name",
        },
      },
    ],
    "credits": [
      {
        "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "amount_cents": 1200,
        "amount_currency": "EUR",
        "item": {
          "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
          "type": "coupon",
          "code": "code",
          "name": "name",
        },
      },
    ],
  },
} satisfies Invoice;

const invoicesResponse = {
  invoices: [invoiceResponse.invoice],
} satisfies Invoices;

Deno.test(
  "Successfully sent invoice update payment status responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "PUT@/api/v1/invoices/lago_id",
      clientPath: ["invoices", "updateInvoice"],
      inputParams: ["lago_id", {
        invoice: {
          payment_status: "succeeded",
        },
      }],
      responseObject: invoiceResponse,
      status: 200,
    });
  },
);

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "PUT@/api/v1/invoices/lago_id",
    clientPath: ["invoices", "updateInvoice"],
    inputParams: ["lago_id", {
      invoice: {
        payment_status: "succeeded",
      },
    }],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test("Successfully request invoice download responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/invoices/lago_id/download",
    clientPath: ["invoices", "downloadInvoice"],
    inputParams: ["lago_id"],
    responseObject: invoiceResponse,
    status: 200,
  });
});

Deno.test("Successfully sent invoice find request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/invoices/id",
    clientPath: ["invoices", "findInvoice"],
    inputParams: ["id"],
    responseObject: invoiceResponse,
    status: 200,
  });
});

Deno.test(
  "Successfully sent invoice find all request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/invoices/",
      clientPath: ["invoices", "findAllInvoices"],
      inputParams: [],
      responseObject: invoicesResponse,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent invoice find all request with options responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/invoices/",
      clientPath: ["invoices", "findAllInvoices"],
      inputParams: [{ per_page: 2, page: 3 }],
      responseObject: invoicesResponse,
      status: 200,
      urlParams: { per_page: "2", page: "3" },
    });
  },
);
