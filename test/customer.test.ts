import type { Customer, CustomerInput, CustomerUsage } from "../main.ts";
import {
  lagoTest,
  notFoundErrorResponse,
  unprocessableErrorResponse,
} from "./utils.ts";

const customer = {
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
} as const satisfies Customer;

const customerInput = {
  "customer": {
    "external_id": "886da83c-c007-4fbb-afcd-b00c07c41ffe",
    "name": "John Doe",
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
    "timezone": "Europe/Paris",
    "billing_configuration": {
      "invoice_grace_period": 3,
      "vat_rate": 25,
      "payment_provider": "stripe",
      "provider_customer_id": "123456",
      "sync_with_provider": true,
      "additionalProp1": {},
    },
  },
} as const satisfies CustomerInput;

const customerUsage = {
  "customer_usage": {
    "from_datetime": "2022-09-14T00:00:00Z",
    "to_datetime": "2022-09-14T00:00:00Z",
    "issuing_date": "2022-09-15T00:00:00Z",
    "amount_cents": 1200,
    "amount_currency": "EUR",
    "total_amount_cents": 1400,
    "total_amount_currency": "EUR",
    "vat_amount_cents": 200,
    "vat_amount_currency": "EUR",
    "charges_usage": [
      {
        "units": 3,
        "amount_cents": 1200,
        "amount_currency": "EUR",
        "charge": {
          "lago_id": "278da83c-c007-4fbb-afcd-b00c07c41utg",
          "charge_model": "standard",
        },
        "billable_metric": {
          "lago_id": "278da83c-c007-4fbb-afcd-b00c07c41utg",
          "name": "Example name",
          "code": "code",
          "aggregation_type": "count_agg",
        },
        "groups": [
          {
            "lago_id": "278da83c-c007-4fbb-afcd-b00c07c41utg",
            "key": "key",
            "value": "value",
            "units": 3.5,
            "amount_cents": 1200,
          },
        ],
      },
    ],
  },
} satisfies CustomerUsage;

Deno.test("Successfully sent customer responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/customers",
    clientPath: ["customers", "createCustomer"],
    inputParams: [customerInput],
    responseObject: customer,
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/customers",
    clientPath: ["customers", "createCustomer"],
    inputParams: [customerInput],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test("Current usage responds with a 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/customers/external_customer_id/current_usage",
    clientPath: ["customers", "findCustomerCurrentUsage"],
    inputParams: ["external_customer_id", { external_subscription_id: "123" }],
    responseObject: customerUsage,
    status: 200,
    urlParams: { external_subscription_id: "123" },
  });
});

Deno.test("Current usage responds with other than 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "GET@/api/v1/customers/external_customer_id/current_usage",
    clientPath: ["customers", "findCustomerCurrentUsage"],
    inputParams: ["external_customer_id", { external_subscription_id: "123" }],
    responseObject: notFoundErrorResponse,
    status: 404,
    urlParams: { external_subscription_id: "123" },
  });
});
