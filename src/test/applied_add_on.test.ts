import type { AppliedAddOnInput } from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const appliedAddOn = {
  applied_add_on: {
    external_customer_id: "lago_test_test",
    add_on_code: "add_on_code",
  },
} as const satisfies AppliedAddOnInput;

Deno.test("Successfully sent apply coupon responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/applied_add_ons",
    clientPath: ["appliedAddOns", "applyAddOn"],
    inputParams: [appliedAddOn],
    responseObject: {
      applied_add_on: {
        lago_id: "lago_id",
        lago_add_on_id: "lago_add_on_id",
        add_on_code: "add_on_code",
        external_customer_id: "testtest",
        lago_customer_id: "lago_test_test",
        amount_cents: 123,
        amount_currency: "EUR",
        created_at: "2022-04-29T08:59:51Z",
      },
    },
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/applied_add_ons",
    clientPath: ["appliedAddOns", "applyAddOn"],
    inputParams: [appliedAddOn],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});
