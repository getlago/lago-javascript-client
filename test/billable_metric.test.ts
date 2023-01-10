import type { BillableMetric, BillableMetricInput } from "../main.ts";
import { lagoTest, unprocessableErrorResponse } from "./utils.ts";

const billableMetric = {
  billable_metric: {
    name: "name1",
    code: "code1",
    aggregation_type: "sum_agg",
    field_name: "field_name",
    group: {
      key: "country",
      values: ["france", "italy", "spain"],
    },
  },
} satisfies BillableMetricInput;

const response = {
  billable_metric: {
    lago_id: "b7ab2926-1de8-4428-9bcd-779314ac129b",
    name: "name1",
    code: "bm-code",
    description: undefined,
    aggregation_type: "sum_agg",
    field_name: "field_name",
    created_at: "2022-04-29T08:59:51Z",
    group: {
      key: "country",
      values: ["france", "italy", "spain"],
    },
  },
} satisfies BillableMetric;

Deno.test("Successfully sent billable metric responds with 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "POST@/api/v1/billable_metrics",
    clientPath: ["billableMetrics", "createBillableMetric"],
    inputParams: [billableMetric],
    responseObject: response,
    status: 200,
  });
});

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "POST@/api/v1/billable_metrics",
    clientPath: ["billableMetrics", "createBillableMetric"],
    inputParams: [billableMetric],
    responseObject: unprocessableErrorResponse,
    status: 422,
  });
});

Deno.test(
  "Successfully sent billable metric update request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "PUT@/api/v1/billable_metrics/code1",
      clientPath: ["billableMetrics", "updateBillableMetric"],
      inputParams: [
        "code1",
        {
          billable_metric: { name: "new name", field_name: "new_field_name" },
        } satisfies BillableMetricInput,
      ],
      responseObject: response,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent billable metric find request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/billable_metrics/code1",
      clientPath: ["billableMetrics", "findBillableMetric"],
      inputParams: ["code1"],
      responseObject: response,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent billable metric destroy request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "DELETE@/api/v1/billable_metrics/code1",
      clientPath: ["billableMetrics", "destroyBillableMetric"],
      inputParams: ["code1"],
      responseObject: response,
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent billable metric find all request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/billable_metrics/",
      clientPath: ["billableMetrics", "findAllBillableMetrics"],
      inputParams: [],
      responseObject: { billable_metrics: [response.billable_metric] },
      status: 200,
    });
  },
);

Deno.test(
  "Successfully sent billable metric find all request with options responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/billable_metrics/",
      clientPath: ["billableMetrics", "findAllBillableMetrics"],
      inputParams: [{
        per_page: 2,
        page: 3,
      }],
      responseObject: { billable_metrics: [response.billable_metric] },
      status: 200,
      urlParams: { page: "3", per_page: "2" },
    });
  },
);
