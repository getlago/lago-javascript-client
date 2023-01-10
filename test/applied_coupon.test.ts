import type { AppliedCouponInput, AppliedCoupons } from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const appliedCoupon = {
  applied_coupon: {
    external_customer_id: "externalCustomerId",
    coupon_code: "coupon-code",
  },
} as const satisfies AppliedCouponInput;

Deno.test("Successfully sent apply coupon responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/applied_coupons",
    clientPath: ["appliedCoupons", "applyCoupon"],
    inputParams: [appliedCoupon],
    responseObject: {
      applied_coupon: {
        lago_id: "b7ab2926-1de8-4428-9bcd-779314ac129b",
        lago_coupon_id: "b7ab2926-1de8-4428-9bcd-779314ac129b",
        coupon_code: "coupon-code",
        external_customer_id: "5eb02857-a71e-4ea2-bcf9-57d3a41bc6ba",
        lago_customer_id: "99a6094e-199b-4101-896a-54e927ce7bd7",
        amount_cents: 123,
        amount_currency: "EUR",
        frequency: "once",
        frequency_duration: undefined,
        percentage_rate: undefined,
        expiration_at: "2022-04-29",
        created_at: "2022-04-29T08:59:51Z",
        terminated_at: "2022-04-29T08:59:51Z",
      },
    },
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/applied_coupons",
    clientPath: ["appliedCoupons", "applyCoupon"],
    inputParams: [appliedCoupon],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test(
  "Successfully sent applied coupon find all request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/applied_coupons/",
      clientPath: ["appliedCoupons", "findAllAppliedCoupons"],
      inputParams: [],
      responseObject: {
        applied_coupons: [appliedCoupon.applied_coupon],
      } satisfies AppliedCoupons,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent applied coupon find all request with options responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/applied_coupons/",
      clientPath: ["appliedCoupons", "findAllAppliedCoupons"],
      inputParams: [{
        per_page: 2,
        page: 3,
      }],
      responseObject: {
        applied_coupons: [appliedCoupon.applied_coupon],
      } satisfies AppliedCoupons,
      status: 200,
      urlParams: { page: "3", per_page: "2" },
    });
  },
);
