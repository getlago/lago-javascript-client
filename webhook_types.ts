// User-facing TypeScript types for Lago webhook payloads.
//
// Backed by ./openapi/webhooks.ts, which is auto-generated from the Lago
// OpenAPI 3.1 spec (`webhooks:` key) via `deno task generate:webhooks`.
// This file is hand-written and is safe across regenerations.
//
// The generator output keys events by their snake_case operationId
// (e.g. `alert_triggered`). We re-key here by the dotted `webhook_type`
// literal (e.g. `alert.triggered`) so that the public API matches the
// string customers actually see on the wire.
//
// Note on nested types: the payload types here are produced by
// `openapi-typescript`, while the SDK's component exports (e.g.
// `CustomerObject`, `InvoiceObjectExtended`) are produced by
// `swagger-typescript-api`. The two generators interpret the same schema
// slightly differently for nullable fields, so a value typed as
// `LagoWebhookPayloads['customer.created']['customer']` is not always
// structurally equal to `CustomerObject` from the main SDK exports. Both
// are valid views of the same wire shape; the openapi-typescript view is
// the more accurate one for what actually arrives over the network. If
// you pass webhook objects into helpers typed with SDK components, a
// narrowing cast may be required.

import type { webhooks } from "./openapi/webhooks.ts";

/** Extract the `application/json` body of a webhook's POST request. */
type _PayloadOf<K extends keyof webhooks> = webhooks[K] extends {
  post: { requestBody?: { content: { "application/json": infer P } } };
} ? P
  : never;

/** Extract the `webhook_type` literal (e.g. `"alert.triggered"`) from a payload. */
type _WebhookTypeOf<K extends keyof webhooks> = _PayloadOf<K> extends
  { webhook_type: infer T } ? T extends string ? T : never : never;

/**
 * Map of webhook event name to its typed payload.
 *
 * @example
 * ```ts
 * import type { LagoWebhookPayloads } from "lago-javascript-client";
 *
 * app.post("/webhooks", (req, res) => {
 *   const event = req.body as LagoWebhookPayloads["alert.triggered"];
 *   console.log(event.triggered_alert.external_customer_id);
 * });
 * ```
 */
export type LagoWebhookPayloads = {
  [K in keyof webhooks as _WebhookTypeOf<K>]: _PayloadOf<K>;
};

/**
 * Discriminated union of every webhook payload. Narrow with the `webhook_type`
 * field in a `switch` to get a fully typed branch.
 *
 * @example
 * ```ts
 * import type { LagoWebhookPayload } from "lago-javascript-client";
 *
 * function handle(event: LagoWebhookPayload) {
 *   switch (event.webhook_type) {
 *     case "alert.triggered":
 *       // event is narrowed; event.triggered_alert is fully typed
 *       break;
 *     case "invoice.created":
 *       // event.invoice is fully typed
 *       break;
 *   }
 * }
 * ```
 */
export type LagoWebhookPayload = LagoWebhookPayloads[keyof LagoWebhookPayloads];

/**
 * Union of every `webhook_type` string emitted by Lago, e.g.
 * `"alert.triggered" | "invoice.created" | ...`.
 */
export type LagoWebhookType = keyof LagoWebhookPayloads;

/**
 * Helper to look up a single payload type by its `webhook_type` string.
 *
 * @example
 * ```ts
 * import type { WebhookOf } from "lago-javascript-client";
 * type InvoiceCreated = WebhookOf<"invoice.created">;
 * ```
 */
export type WebhookOf<T extends LagoWebhookType> = LagoWebhookPayloads[T];
