import type {
  CreditNote,
  CreditNoteCreateInput,
  CreditNoteUpdateInput,
} from "../mod.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const creditNote = {
  credit_note: {
    reason: "other",
    invoice_id: "invoice-id",
    credit_amount_cents: 10,
    items: [
      {
        fee_id: "fee-id",
        amount_cents: 5,
      },
    ],
  },
} satisfies CreditNoteCreateInput;

const creditNoteUpdate = {
  credit_note: {
    refund_status: "succeeded",
  },
} satisfies CreditNoteUpdateInput;

const response = {
  "credit_note": {
    "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
    "sequential_id": 1234,
    "billing_entity_code": "default",
    "currency": "EUR",
    "taxes_rate": 0,
    "offset_amount_cents": 0,
    "coupons_adjustment_amount_cents": 0,
    "number": "123456789",
    "lago_invoice_id": "144da83c-c007-4fbb-afcd-b00c07c41ffe",
    "invoice_number": "123456789",
    "issuing_date": "2022-09-14T16:35:31Z",
    "credit_status": "available",
    "refund_status": "pending",
    "reason": "duplicated_charge",
    "description": "description",
    "total_amount_cents": 1220,
    "taxes_amount_cents": 20,
    "sub_total_excluding_taxes_amount_cents": 1000,
    "balance_amount_cents": 20,
    "credit_amount_cents": 20,
    "refund_amount_cents": 20,
    "created_at": "2022-09-14T16:35:31Z",
    "updated_at": "2022-09-14T16:35:31Z",
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
    "items": [
      {
        "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "amount_cents": 1220,
        "amount_currency": "EUR",
        "fee": {
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
        },
      },
    ],
  },
} satisfies CreditNote;

Deno.test("Successfully create a credit note", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/credit_notes",
    clientPath: ["creditNotes", "createCreditNote"],
    inputParams: [creditNote],
    responseObject: response,
    status: 200,
  });
});

Deno.test("Failled create of credit note", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/credit_notes",
    clientPath: ["creditNotes", "createCreditNote"],
    inputParams: [creditNote],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test("Successfully sent credit note update request", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "PUT@/api/v1/credit_notes/credit-note-id",
    clientPath: ["creditNotes", "updateCreditNote"],
    inputParams: ["credit-note-id", creditNoteUpdate],
    responseObject: response,
    status: 200,
  });
});

Deno.test("Failed update of credit note", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "PUT@/api/v1/credit_notes/credit-note-id",
    clientPath: ["creditNotes", "updateCreditNote"],
    inputParams: ["credit-note-id", creditNoteUpdate],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test("Successfully find credit note request", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/credit_notes/id",
    clientPath: ["creditNotes", "findCreditNote"],
    inputParams: ["id"],
    responseObject: response,
    status: 200,
  });
});

Deno.test("Successfully sent find all credit notes request", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/credit_notes",
    clientPath: ["creditNotes", "findAllCreditNotes"],
    inputParams: [],
    responseObject: {
      meta: { current_page: 1, total_pages: 1, total_count: 1 },
      credit_notes: [response.credit_note],
    },
    status: 200,
  });
});

Deno.test("Successfully request invoice download", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/credit_notes/lago_id/download",
    clientPath: ["creditNotes", "downloadCreditNote"],
    inputParams: ["lago_id"],
    responseObject: response,
    status: 200,
  });
});

Deno.test(
  "Successfully sent find all credit notes request with options",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/credit_notes",
      clientPath: ["creditNotes", "findAllCreditNotes"],
      inputParams: [{
        per_page: 2,
        page: 3,
      }],
      responseObject: {
        meta: { current_page: 1, total_pages: 1, total_count: 1 },
        credit_notes: [response.credit_note],
      },
      status: 200,
      urlParams: { page: "3", per_page: "2" },
    });
  },
);
