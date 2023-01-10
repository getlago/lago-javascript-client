import type { Organization, OrganizationInput } from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const orgInput = {
  "organization": {
    "webhook_url": "https://example.com",
    "country": "CZ",
    "address_line1": "address1",
    "address_line2": "address2",
    "state": "state1",
    "zipode": "10000",
    "email": "example@example.com",
    "city": "City",
    "legal_name": "name1",
    "legal_number": "10000",
    "timezone": "Europe/Paris",
    "billing_configuration": {
      "invoice_footer": "text",
      "vat_rate": 25,
      "invoice_grace_period": 5,
    },
  },
} satisfies OrganizationInput;

const orgResponse = {
  "organization": {
    "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
    "name": "example name",
    "created_at": "2022-09-14T16:35:31Z",
    "webhook_url": "https://example.com",
    "country": "CZ",
    "address_line1": "address1",
    "address_line2": "address2",
    "state": "state1",
    "zipode": "10000",
    "email": "example@example.com",
    "city": "City",
    "legal_name": "name1",
    "legal_number": "10000",
    "timezone": "UTC",
    "billing_configuration": {
      "invoice_footer": "text",
      "vat_rate": 25,
      "invoice_grace_period": 5,
    },
  },
} satisfies Organization;

Deno.test(
  "Successfully sent organization update status responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "PUT@/api/v1/organizations/",
      clientPath: ["organizations", "updateOrganization"],
      inputParams: [orgInput],
      responseObject: orgResponse,
      status: 200,
    });
  },
);

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "PUT@/api/v1/organizations/",
    clientPath: ["organizations", "updateOrganization"],
    inputParams: [orgInput],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});
