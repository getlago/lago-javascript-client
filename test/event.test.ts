import type { BatchEventInput, EventInput } from "../main.ts";
import {
  lagoTest,
  notFoundErrorResponse,
  unprocessableErrorResponse,
} from "./utils.ts";

const eventInput = {
  event: {
    transaction_id: "transactionId",
    external_customer_id: "externalCustomerId",
    code: "code",
  },
} as const satisfies (EventInput | BatchEventInput);
// const batchEvent = new BatchEvent({
//   transactionId: "transactionId",
//   externalSubscriptionIds: ["123", "456"],
//   code: "code",
// });

Deno.test("Successfully sent event responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/events",
    clientPath: ["events", "createEvent"],
    inputParams: [eventInput],
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/events",
    clientPath: ["events", "createEvent"],
    inputParams: [eventInput],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test("Successfully sent batch event responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/events/batch",
    clientPath: ["events", "createBatchEvents"],
    inputParams: [eventInput],
    status: 200,
  });
});

Deno.test("Successfully find an event", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/events/transaction_id",
    clientPath: ["events", "findEvent"],
    inputParams: ["transaction_id"],
    status: 200,
  });
});

Deno.test("Error when finding an event", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "GET@/api/v1/events/transaction_id",
    clientPath: ["events", "findEvent"],
    inputParams: ["transaction_id"],
    responseObject: notFoundErrorResponse,
    status: 404,
  });
});
