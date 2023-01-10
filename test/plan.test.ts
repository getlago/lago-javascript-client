import type { Plan, PlanInput, Plans } from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const planInput = {
  "plan": {
    "name": "example name",
    "code": "example_code",
    "interval": "weekly",
    "description": "description",
    "amount_cents": 1200,
    "amount_currency": "EUR",
    "trial_period": 2,
    "pay_in_advance": true,
    "bill_charges_monthly": false,
    "charges": [
      {
        "id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "billable_metric_id": "278da83c-c007-4fbb-afcd-b00c07c41utg",
        "charge_model": "standard",
        "properties": {},
        "group_properties": [
          {
            "group_id": "123456",
            "values": {},
          },
        ],
      },
    ],
  },
} satisfies PlanInput;

const planResponse = {
  "plan": {
    "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
    "name": "example name",
    "created_at": "2022-09-14T16:35:31Z",
    "code": "example_code",
    "interval": "weekly",
    "description": "description",
    "amount_cents": 1200,
    "amount_currency": "EUR",
    "trial_period": 2,
    "pay_in_advance": true,
    "bill_charges_monthly": false,
    "charges": [
      {
        "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
        "lago_billable_metric_id": "278da83c-c007-4fbb-afcd-b00c07c41utg",
        "created_at": "2022-09-14T16:35:31Z",
        "charge_model": "standard",
        "properties": {},
        "group_properties": [
          {
            "group_id": "123456",
            "values": {},
          },
        ],
      },
    ],
  },
} satisfies Plan;

const plansResponse = { plans: [planResponse.plan] } satisfies Plans;

Deno.test("Successfully sent plan responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/plans",
    clientPath: ["plans", "createPlan"],
    inputParams: [planInput],
    responseObject: planResponse,
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/plans",
    clientPath: ["plans", "createPlan"],
    inputParams: [planInput],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test("Successfully sent plan update request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "PUT@/api/v1/plans/code1",
    clientPath: ["plans", "updatePlan"],
    inputParams: ["code1", planInput],
    responseObject: planResponse,
    status: 200,
  });
});

Deno.test("Successfully sent plan find request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/plans/code1",
    clientPath: ["plans", "findPlan"],
    inputParams: ["code1"],
    responseObject: planResponse,
    status: 200,
  });
});

Deno.test("Successfully sent plan destroy request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "DELETE@/api/v1/plans/code1",
    clientPath: ["plans", "destroyPlan"],
    inputParams: ["code1"],
    responseObject: planResponse,
    status: 200,
  });
});

Deno.test("Successfully sent plan find all request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/plans/",
    clientPath: ["plans", "findAllPlans"],
    inputParams: [],
    responseObject: plansResponse,
    status: 200,
  });
});

Deno.test(
  "Successfully sent plan find all request with options responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/plans/",
      clientPath: ["plans", "findAllPlans"],
      inputParams: [{ per_page: 2, page: 3 }],
      responseObject: plansResponse,
      status: 200,
      urlParams: { per_page: "2", page: "3" },
    });
  },
);
