import { assertEquals } from "../dev_deps.ts";
import {
  lagoTest,
  setupMockClient,
  unauthorizedErrorResponse,
} from "./utils.ts";

Deno.test(
  "Successfully sent webhook public key request responds with 2xx and the key as data",
  async (t) => {
    // text/plain body, exercised directly instead of via lagoTest.
    const publicKey = "aGVsbG8=";

    const client = setupMockClient(
      "GET@/api/v1/webhooks/public_key",
      () =>
        new Response(publicKey, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        }),
    );

    await t.step("returns 200 response with the key in data", async () => {
      const response = await client.webhooks.fetchPublicKey();

      assertEquals(response.status, 200);
      assertEquals(response.data, publicKey);
    });
  },
);

Deno.test("Status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "GET@/api/v1/webhooks/public_key",
    clientPath: ["webhooks", "fetchPublicKey"],
    inputParams: [],
    responseObject: unauthorizedErrorResponse,
    status: 422,
  });
});

Deno.test(
  "Successfully sent webhook json public key request responds with 2xx and the key as data",
  async (t) => {
    const responseObject = { webhook: { public_key: "aGVsbG8=" } };

    const client = setupMockClient(
      "GET@/api/v1/webhooks/json_public_key",
      () =>
        new Response(JSON.stringify(responseObject), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );

    await t.step("returns 200 response with the key in data", async () => {
      const response = await client.webhooks.fetchJsonPublicKey();

      assertEquals(response.status, 200);
      assertEquals(response.data.webhook.public_key, "aGVsbG8=");
    });
  },
);

Deno.test("Json public key status code is not 2xx", async (t) => {
  await lagoTest({
    t,
    testType: "error",
    route: "GET@/api/v1/webhooks/json_public_key",
    clientPath: ["webhooks", "fetchJsonPublicKey"],
    inputParams: [],
    responseObject: unauthorizedErrorResponse,
    status: 422,
  });
});
