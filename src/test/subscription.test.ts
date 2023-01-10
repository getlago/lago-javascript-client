import type {
  Subscription,
  SubscriptionCreateInput,
  Subscriptions,
} from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const subscriptionInput = {
  "subscription": {
    "external_customer_id": "12345",
    "plan_code": "example_code",
    "name": "Test name",
    "external_id": "54321",
    "billing_time": "calendar",
    "subscription_at": "2022-08-08T00:00:00Z",
  },
} satisfies SubscriptionCreateInput;

const subscriptionResponse = {
  "subscription": {
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
} satisfies Subscription;

const subscriptionsResponse = {
  subscriptions: [subscriptionResponse.subscription],
} satisfies Subscriptions;

Deno.test("Successfully sent subscription responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/subscriptions",
    clientPath: ["subscriptions", "createSubscription"],
    inputParams: [subscriptionInput],
    responseObject: subscriptionResponse,
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/subscriptions",
    clientPath: ["subscriptions", "createSubscription"],
    inputParams: [subscriptionInput],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test(
  "Successfully sent subscription update request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "PUT@/api/v1/subscriptions/id",
      clientPath: ["subscriptions", "updateSubscription"],
      inputParams: ["id", subscriptionInput],
      responseObject: subscriptionResponse,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent subscription destroy request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "DELETE@/api/v1/subscriptions/id",
      clientPath: ["subscriptions", "destroySubscription"],
      inputParams: ["id"],
      responseObject: subscriptionResponse,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent subscription find all request with options responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/subscriptions/",
      clientPath: ["subscriptions", "findAllSubscriptions"],
      inputParams: [{ external_customer_id: "2" }],
      responseObject: subscriptionsResponse,
      status: 200,
      urlParams: { external_customer_id: "2" },
    });
  },
);
