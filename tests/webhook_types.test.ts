// Type-level tests for the webhook payload types exported from mod.ts.
//
// These assertions run at compile time. The Deno.test() wrappers exist so
// the file is picked up by `deno task test` (which typechecks the file by
// default) and any compile-time failure surfaces as a Deno typecheck error.
// The runtime bodies are deliberately trivial.
//
// Scope: we verify the envelope shape (webhook_type, object_type,
// organization_id), the presence of the nested object on each event, and
// the discriminated-union narrowing. We deliberately do NOT assert
// structural equality between a webhook's nested object and the SDK's
// component types (e.g. `CustomerObject`), because those come from a
// different generator that handles nullability slightly differently. See
// the note in ../webhook_types.ts for details.

import { assertEquals } from "../dev_deps.ts";
import type {
  LagoWebhookPayload,
  LagoWebhookPayloads,
  LagoWebhookType,
  WebhookOf,
} from "../mod.ts";

// ---------------------------------------------------------------------------
// Type-level test helpers
// ---------------------------------------------------------------------------

/** Compiles only when T is `true`. Use to anchor an Equal<> assertion. */
type Expect<T extends true> = T;

/** Strict structural equality (catches optional/readonly differences). */
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

/** Looser check: A is assignable to B. */
type Extends<A, B> = A extends B ? true : false;

// ---------------------------------------------------------------------------
// 1. Indexed lookup keyed by the dotted webhook_type
// ---------------------------------------------------------------------------

Deno.test("LagoWebhookPayloads keys events by dotted webhook_type", () => {
  // Each of these resolves to a concrete payload type; a missing key is a compile error.
  type _Alert = LagoWebhookPayloads["alert.triggered"];
  type _Invoice = LagoWebhookPayloads["invoice.created"];
  type _Customer = LagoWebhookPayloads["customer.created"];
  type _Subscription = LagoWebhookPayloads["subscription.terminated"];
  type _Wallet = LagoWebhookPayloads["wallet.depleted_ongoing_balance"];
  type _Payment = LagoWebhookPayloads["payment.succeeded"];
  type _CreditNote = LagoWebhookPayloads["credit_note.created"];

  assertEquals(true, true);
});

Deno.test("alert.triggered envelope is correctly typed", () => {
  type Payload = LagoWebhookPayloads["alert.triggered"];
  type _C1 = Expect<Equal<Payload["webhook_type"], "alert.triggered">>;
  type _C2 = Expect<Equal<Payload["object_type"], "triggered_alert">>;
  type _C3 = Expect<Extends<Payload["organization_id"], string>>;
  // `triggered_alert` is the nested object; we only check it exists and is non-nullable.
  type _C4 = Expect<Extends<Payload["triggered_alert"], object>>;

  assertEquals(true, true);
});

Deno.test("invoice.created envelope is correctly typed", () => {
  type Payload = LagoWebhookPayloads["invoice.created"];
  type _C1 = Expect<Equal<Payload["webhook_type"], "invoice.created">>;
  type _C2 = Expect<Equal<Payload["object_type"], "invoice">>;
  type _C3 = Expect<Extends<Payload["organization_id"], string>>;
  type _C4 = Expect<Extends<Payload["invoice"], object>>;

  assertEquals(true, true);
});

Deno.test("customer.created envelope is correctly typed", () => {
  type Payload = LagoWebhookPayloads["customer.created"];
  type _C1 = Expect<Equal<Payload["webhook_type"], "customer.created">>;
  type _C2 = Expect<Equal<Payload["object_type"], "customer">>;
  type _C3 = Expect<Extends<Payload["customer"], object>>;

  assertEquals(true, true);
});

Deno.test("subscription.terminated envelope is correctly typed", () => {
  type Payload = LagoWebhookPayloads["subscription.terminated"];
  type _C1 = Expect<Equal<Payload["webhook_type"], "subscription.terminated">>;
  type _C2 = Expect<Equal<Payload["object_type"], "subscription">>;
  type _C3 = Expect<Extends<Payload["subscription"], object>>;

  assertEquals(true, true);
});

Deno.test("wallet.depleted_ongoing_balance envelope is correctly typed", () => {
  type Payload = LagoWebhookPayloads["wallet.depleted_ongoing_balance"];
  type _C1 = Expect<Equal<Payload["webhook_type"], "wallet.depleted_ongoing_balance">>;
  type _C2 = Expect<Equal<Payload["object_type"], "wallet">>;
  type _C3 = Expect<Extends<Payload["wallet"], object>>;

  assertEquals(true, true);
});

// ---------------------------------------------------------------------------
// 2. WebhookOf<T> helper
// ---------------------------------------------------------------------------

Deno.test("WebhookOf<T> matches LagoWebhookPayloads[T]", () => {
  type _C1 = Expect<
    Equal<WebhookOf<"alert.triggered">, LagoWebhookPayloads["alert.triggered"]>
  >;
  type _C2 = Expect<
    Equal<WebhookOf<"invoice.created">, LagoWebhookPayloads["invoice.created"]>
  >;
  type _C3 = Expect<
    Equal<
      WebhookOf<"subscription.terminated">,
      LagoWebhookPayloads["subscription.terminated"]
    >
  >;

  assertEquals(true, true);
});

// ---------------------------------------------------------------------------
// 3. LagoWebhookType union
// ---------------------------------------------------------------------------

Deno.test("LagoWebhookType union contains documented events", () => {
  const _v1: LagoWebhookType = "alert.triggered";
  const _v2: LagoWebhookType = "invoice.created";
  const _v3: LagoWebhookType = "customer.created";
  const _v4: LagoWebhookType = "subscription.terminated";
  const _v5: LagoWebhookType = "wallet.depleted_ongoing_balance";
  const _v6: LagoWebhookType = "payment.succeeded";
  const _v7: LagoWebhookType = "credit_note.created";

  assertEquals(true, true);
});

// ---------------------------------------------------------------------------
// 4. LagoWebhookPayload discriminated-union narrowing
// ---------------------------------------------------------------------------

Deno.test("LagoWebhookPayload narrows correctly via webhook_type", () => {
  function handle(event: LagoWebhookPayload): unknown {
    switch (event.webhook_type) {
      case "alert.triggered":
        // After narrowing, the alert-specific field is accessible.
        return event.triggered_alert;
      case "invoice.created":
        return event.invoice;
      case "customer.created":
        return event.customer;
      case "subscription.terminated":
        return event.subscription;
      default:
        return null;
    }
  }
  // Reference the function so TS does not elide it.
  assertEquals(typeof handle, "function");
});

// ---------------------------------------------------------------------------
// 5. Negative tests — these MUST fail to compile if @ts-expect-error is removed
// ---------------------------------------------------------------------------

Deno.test("Unknown webhook event names are rejected at compile time", () => {
  // @ts-expect-error - "not.a.real.event" is not a key of LagoWebhookPayloads
  type _Bad1 = LagoWebhookPayloads["not.a.real.event"];

  // @ts-expect-error - WebhookOf only accepts LagoWebhookType keys
  type _Bad2 = WebhookOf<"not.a.real.event">;

  // @ts-expect-error - "definitely.not.a.lago.event" is not in the union
  const _bad: LagoWebhookType = "definitely.not.a.lago.event";

  assertEquals(true, true);
});

Deno.test("Narrowed branches reject fields belonging to other events", () => {
  function _check(event: LagoWebhookPayload) {
    if (event.webhook_type === "alert.triggered") {
      // @ts-expect-error - `invoice` is not present on the alert.triggered branch
      const _x = event.invoice;
      return _x;
    }
    if (event.webhook_type === "invoice.created") {
      // @ts-expect-error - `triggered_alert` is not present on the invoice.created branch
      const _y = event.triggered_alert;
      return _y;
    }
  }
  assertEquals(true, true);
});
