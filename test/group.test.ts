import type { Groups } from "../main.ts";
import { lagoTest } from "./utils.ts";

const groupResponse = {
  "groups": [
    {
      "key": "region",
      "value": "EU",
      "lago_id": "183da83c-c007-4fbb-afcd-b00c07c41ffe",
    },
  ],
} satisfies Groups;

Deno.test("Successfully sent find all groups request", async (t) => {
  await lagoTest({
    t,
    testType: "200",
    route: "GET@/api/v1/billable_metrics/code1/groups",
    clientPath: ["billableMetrics", "findAllBillableMetricGroups"],
    inputParams: ["code1"],
    responseObject: groupResponse,
    status: 200,
  });
});

Deno.test(
  "Successfully sent find all groups request with options",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/billable_metrics/code1/groups",
      clientPath: ["billableMetrics", "findAllBillableMetricGroups"],
      inputParams: ["code1", {
        per_page: 2,
        page: 3,
      }],
      responseObject: groupResponse,
      status: 200,
      urlParams: {
        per_page: "2",
        page: "3",
      },
    });
  },
);
