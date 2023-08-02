import type { AddOn, AddOnCreateInput } from "../mod.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const addOn = {
  add_on: {
    name: "name1",
    code: "code1",
    amount_cents: 10000,
    amount_currency: "USD",
  },
} as const satisfies AddOnCreateInput;

const addOnResponse = {
  add_on: {
    lago_id: "b7ab2926-1de8-4428-9bcd-779314ac129b",
    name: "name2",
    code: "add_on_code",
    amount_cents: 1000,
    amount_currency: "EUR",
    description: "description",
    created_at: "2022-04-29T08:59:51Z",
  },
} as const satisfies AddOn;

Deno.test("Successfully sent add_on responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/add_ons",
    clientPath: ["addOns", "createAddOn"],
    inputParams: [addOn],
    responseObject: addOnResponse,
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/add_ons",
    clientPath: ["addOns", "createAddOn"],
    inputParams: [addOnResponse],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test(
  "Successfully sent add_on update request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "PUT@/api/v1/add_ons/code1",
      clientPath: ["addOns", "updateAddOn"],
      inputParams: ["code1", {
        add_on: { name: "new name", code: "new_code" },
      }],
      responseObject: addOnResponse,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent add_on find request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/add_ons/code1",
      clientPath: ["addOns", "findAddOn"],
      inputParams: ["code1"],
      responseObject: addOnResponse,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent add_on destroy request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "DELETE@/api/v1/add_ons/code1",
      clientPath: ["addOns", "destroyAddOn"],
      inputParams: ["code1"],
      responseObject: addOnResponse,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent add_on find all request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/add_ons",
      clientPath: ["addOns", "findAllAddOns"],
      inputParams: [],
      responseObject: { add_ons: [addOn.add_on] },
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent add_on find all request with options responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/add_ons",
      clientPath: ["addOns", "findAllAddOns"],
      inputParams: [{ page: 3, per_page: 2 }],
      responseObject: { add_ons: [addOn.add_on] },
      status: 200,
      urlParams: { page: "3", per_page: "2" },
    });
  },
);
