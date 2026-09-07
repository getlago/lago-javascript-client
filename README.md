# Lago JavaScript Client

This is a JavaScript wrapper for Lago API. Works in Cloudflare Workers, Deno, and Node.js. Generated from [the Lago OpenAPI document](https://swagger.getlago.com/#/).

[![PyPI version](https://badge.fury.io/js/lago-javascript-client.svg)](https://badge.fury.io/js/lago-javascript-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://spdx.org/licenses/MIT.html)

## Current Releases

| Project            | Release Badge                                                                                       |
|--------------------|-----------------------------------------------------------------------------------------------------|
| **Lago**           | [![Lago Release](https://img.shields.io/github/v/release/getlago/lago)](https://github.com/getlago/lago/releases) |
| **Lago JavaScript Client**     | [![Lago JavaScript Client Release](https://img.shields.io/github/v/release/getlago/lago-javascript-client)](https://github.com/getlago/lago-javascript-client/releases) |

## Installation

For npm users:

```bash
npm install lago-javascript-client
```

```typescript
// npm
import { Client, getLagoError } from 'lago-javascript-client';

// Deno
import { Client, getLagoError } from 'https://deno.land/x/lago/mod.ts';

const lagoClient = Client('__YOUR_API_KEY__');

try {
    const { data } = await lagoClient.billableMetrics.createBillableMetric(billableMetric);
} catch (error) {
    const lagoError = await getLagoError<typeof lagoClient.billableMetrics.createBillableMetric>(error);
}
```

## Compatibility

This SDK uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and natively supported Node.js version >= 18. For other Node versions:

1. Ideally, run Node with the [`--experimental-fetch` flag](https://nodejs.org/docs/latest-v16.x/api/cli.html#--experimental-fetch)

1. Otherwise, polyfill the Fetch API by doing both:

    1. [Patching globalThis](https://github.com/node-fetch/node-fetch#providing-global-access)

    1. [Pass a Fetch instance](https://github.com/node-fetch/node-fetch#loading-and-configuring-the-module) to the Lago client

        ```typescript
        import { Client } from 'lago-javascript-client';
        import fetch from 'node-fetch';

        const lagoClient = Client("api_key", { customFetch: fetch });
        ```

## Usage

Check the [Lago API reference](https://doc.getlago.com/docs/api/intro)

### Error handling

Use the get `getLagoError<>()` utility function to extract the error object and TypeScript type:

```typescript
try {
    const { data } = await lagoClient.billableMetrics.createBillableMetric(billableMetric);
} catch (error) {
    const lagoError = await getLagoError<typeof lagoClient.billableMetrics.createBillableMetric>(error);
}
```

### Webhook payload types

The SDK exposes TypeScript types for every webhook event Lago emits. The types are generated from the OpenAPI spec, so they stay in sync with the API.

Indexed lookup by `webhook_type`:

```typescript
import type { LagoWebhookPayloads } from 'lago-javascript-client';

app.post('/webhooks', (req, res) => {
    const event = req.body as LagoWebhookPayloads['alert.triggered'];
    // event.triggered_alert is fully typed
    console.log(event.triggered_alert.external_customer_id);
    res.sendStatus(200);
});
```

Discriminated union for handlers that cover multiple events:

```typescript
import type { LagoWebhookPayload } from 'lago-javascript-client';

function handle(event: LagoWebhookPayload) {
    switch (event.webhook_type) {
        case 'alert.triggered':
            // event.triggered_alert is typed
            return event.triggered_alert;
        case 'invoice.created':
            // event.invoice is typed
            return event.invoice;
        case 'subscription.terminated':
            return event.subscription;
    }
}
```

A `WebhookOf<T>` helper is also exported for picking a single payload type by name, and `LagoWebhookType` gives the union of all event-type strings.

## Development

Uses [dnt](https://github.com/denoland/dnt) to build and test for Deno and Node.

### Release new version

Change the affected fields in `scripts/build_npm.ts` and commit to GitHub. GitHub Actions will build and deploy to npm.

### Dependencies

Requires [Deno](https://deno.land/) and [Node.js >= 18](https://nodejs.org/en/)

### Generate client from OpenAPI

```bash
deno task generate:openapi
```

### Run tests

```bash
deno task test
```

### Build

```bash
deno task build
```

### Publish to npm

```bash
deno task build
cd npm
npm publish
```

## Documentation

The Lago documentation is available at [doc.getlago.com](https://doc.getlago.com/docs/api/intro).

## Contributing

The contribution documentation is available [here](https://github.com/getlago/lago-javascript-client/blob/main/CONTRIBUTING.md)

## License

Lago JavaScript client is distributed under [MIT license](LICENSE).

## Payment list filters

```ts
const result = await client.payments.findAllPayments({
  "payment_status[]": ["succeeded", "failed"],
  currency: "EUR",
  amount_from: "5000000000",
  amount_to: "9223372036854775807",
  created_at_from: "2026-09-01",
});
const customerResult = await client.customers.findAllCustomerPayments("cust_1", {
  "payment_status[]": ["succeeded"],
  currency: "EUR",
});
```

The generated query types include all payment filters on both endpoints. Array
keys include `[]` and serialize as repeated query parameters. Filters combine
with AND; entries within an array combine with OR. Use decimal strings for cents
above `Number.MAX_SAFE_INTEGER` to preserve exact 64-bit bounds. Numbers remain
supported for smaller bounds, including zero. Date bounds are inclusive in the
organization timezone; receipt and invoice numbers match exactly, ignoring case.
Payment response types are unchanged.

### Generating against a feature spec

Generated `openapi/` and `npm/` files remain ignored. Release generation defaults
to the published spec. To reproduce this feature's CI build before publication:

```sh
LAGO_OPENAPI_PIN=scripts/openapi-pin.json deno task build
deno task typecheck
deno task test
```

The pin records an immutable OpenAPI commit and SHA-256 checksum, consumed by
both generators. For local development, use
`LAGO_OPENAPI_SPEC=../lago-openapi/openapi.yaml deno task build`. Set both variables
to verify a local file against the pin. Update the pin after upstream changes;
release builds can use the published default once the spec PR is merged and
published. The post-generation script adds decimal-string input support only to
payment list amount bounds.
