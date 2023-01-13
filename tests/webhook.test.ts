import { lagoTest, unauthorizedErrorResponse } from "./utils.ts";

Deno.test(
  "Successfully sent webhook public key request responds with 2xx",
  async (t) => {
    await lagoTest({
      t,
      testType: "200",
      route: "GET@/api/v1/webhooks/public_key/",
      clientPath: ["webhooks", "fetchPublicKey"],
      inputParams: [],
      responseObject: "aGVsbG8=",
      status: 200,
    });
  },
);

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "GET@/api/v1/webhooks/public_key/",
    clientPath: ["webhooks", "fetchPublicKey"],
    inputParams: [],
    responseObject: unauthorizedErrorResponse,
    status: 422,
  });
});
