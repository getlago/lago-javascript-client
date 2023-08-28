import type { Coupon, CouponCreateInput } from "../mod.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const coupon = {
  coupon: {
    name: "name1",
    code: "code1",
    expiration: "no_expiration",
    amount_cents: 10000,
    amount_currency: "USD",
  },
} as const satisfies CouponCreateInput;

const response = {
  coupon: {
    lago_id: "b7ab2926-1de8-4428-9bcd-779314ac129b",
    name: "name2",
    code: "coupon_code",
    expiration: "no_expiration",
    amount_cents: 1000,
    amount_currency: "EUR",
    expiration_at: undefined,
    frequency: "once",
    frequency_duration: undefined,
    coupon_type: "fixed_amount",
    percentage_rate: undefined,
    reusable: false,
    created_at: "2022-04-29T08:59:51Z",
  },
} as const satisfies Coupon;

Deno.test("Successfully sent coupon responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/coupons",
    clientPath: ["coupons", "createCoupon"],
    inputParams: [coupon],
    responseObject: response,
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/coupons",
    clientPath: ["coupons", "createCoupon"],
    inputParams: [coupon],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test("Successfully sent coupon update request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "PUT@/api/v1/coupons/code1",
    clientPath: ["coupons", "updateCoupon"],
    inputParams: ["code1", {
      coupon: { name: "new name", code: "new_code" },
    }],
    responseObject: response,
    status: 200,
  });
});

Deno.test("Successfully sent coupon find request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/coupons/code1",
    clientPath: ["coupons", "findCoupon"],
    inputParams: ["code1"],
    responseObject: response,
    status: 200,
  });
});

Deno.test("Successfully sent coupon destroy request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "DELETE@/api/v1/coupons/code1",
    clientPath: ["coupons", "destroyCoupon"],
    inputParams: ["code1"],
    responseObject: response,
    status: 200,
  });
});

Deno.test("Successfully sent coupon find all request responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/coupons",
    clientPath: ["coupons", "findAllCoupons"],
    inputParams: [],
    responseObject: { coupons: [response.coupon] },
    status: 200,
  });
});

Deno.test(
  "Successfully sent coupon find all request with options responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/coupons",
      clientPath: ["coupons", "findAllCoupons"],
      inputParams: [{ page: 3, per_page: 2 }],
      responseObject: { coupons: [response.coupon] },
      status: 200,
      urlParams: { page: "3", per_page: "2" },
    });
  },
);
