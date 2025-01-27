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
