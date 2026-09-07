import type { Invoice, InvoicesPaginated } from "../mod.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const invoiceResponse = {
  "invoice": {
    "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
    "billing_entity_code": "default",
    "currency": "EUR",
    "fees_amount_cents": 1200,
    "coupons_amount_cents": 0,
    "credit_notes_amount_cents": 0,
    "sub_total_excluding_taxes_amount_cents": 1200,
    "sub_total_including_taxes_amount_cents": 1220,
    "prepaid_credit_amount_cents": 0,
    "progressive_billing_credit_amount_cents": 0,
    "version_number": 4,
    "created_at": "2022-09-14T16:35:31Z",
    "updated_at": "2022-09-14T16:35:31Z",
    "number": "222345",
    "issuing_date": "2022-09-14T16:35:31Z",
    "invoice_type": "subscription",
    "status": "finalized",
    "payment_status": "pending",
    "taxes_amount_cents": 20,
    "total_amount_cents": 1220,
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
      "zipcode": "10000",
      "email": "example@example.com",
      "city": "City",
      "url": "https://example.com",
      "phone": "3551234567",
      "legal_name": "name1",
      "legal_number": "10000",
      "currency": "EUR",
      "timezone": "UTC",
      "applicable_timezone": "UTC",
      "billing_configuration": {
        "invoice_grace_period": 3,
        "payment_provider": "stripe",
        "provider_customer_id": "123456",
        "sync_with_provider": true,
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
        "ending_at": null,
        "trial_ended_at": null,
        "current_billing_period_started_at": null,
        "current_billing_period_ending_at": null,
        "on_termination_credit_note": "credit",
        "on_termination_invoice": "generate",
      },
    ],
    "fees": [
      {
        "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "taxes_rate": 0,
        "precise_unit_amount": "480",
        "total_aggregated_units": "2.5",
        "total_amount_cents": 1200,
        "total_amount_currency": "EUR",
        "pay_in_advance": false,
        "invoiceable": true,
        "payment_status": "succeeded",
        "sub_total_excluding_taxes_amount_cents": 1200,
        "sub_total_excluding_taxes_precise_amount_cents": "1200",
        "amount_cents": 1200,
        "amount_currency": "EUR",
        "taxes_amount_cents": 1200,
        "units": "2.5",
        "events_count": 5,
        "item": {
          "type": "charge",
          "lago_item_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
          "item_type": "BillableMetric",
          "code": "code",
          "name": "name",
        },
        "presentation_breakdowns": [
          {
            "presentation_by": {
              "region": "europe",
            },
            "units": "2.0",
          },
        ],
      },
    ],
    "credits": [
      {
        "before_taxes": true,
        "invoice": { "lago_id": "invoice-id", "payment_status": "succeeded" },
        "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "amount_cents": 1200,
        "amount_currency": "EUR",
        "item": {
          "lago_item_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
          "type": "coupon",
          "code": "code",
          "name": "name",
        },
      },
    ],
  },
} satisfies Invoice;

const invoicesResponse = {
  meta: { current_page: 1, total_pages: 1, total_count: 1 },
  invoices: [invoiceResponse.invoice],
} satisfies InvoicesPaginated;

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
      route: "GET@/api/v1/invoices",
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
      route: "GET@/api/v1/invoices",
      clientPath: ["invoices", "findAllInvoices"],
      inputParams: [{ per_page: 2, page: 3 }],
      responseObject: invoicesResponse,
      status: 200,
      urlParams: { per_page: "2", page: "3" },
    });
  },
);

Deno.test(
  "Successfully request invoice refresh responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "PUT@/api/v1/invoices/lagoId/refresh",
      clientPath: ["invoices", "refreshInvoice"],
      inputParams: ["lagoId"],
      responseObject: invoiceResponse,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully request invoice finalize responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "PUT@/api/v1/invoices/lagoId/finalize",
      clientPath: ["invoices", "finalizeInvoice"],
      inputParams: ["lagoId"],
      responseObject: invoiceResponse,
      status: 200,
    });
  },
);
