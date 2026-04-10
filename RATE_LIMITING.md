# Rate Limiting Support

The Lago JavaScript/TypeScript client now includes built-in support for handling HTTP 429 (Rate Limit) responses from the Lago API.

## Overview

When the Lago API rate limit is exceeded, it returns:
- HTTP 429 status code
- Response headers with rate limit information:
  - `x-ratelimit-limit`: Maximum requests per window
  - `x-ratelimit-remaining`: Remaining requests in current window
  - `x-ratelimit-reset`: Seconds until the rate limit window resets

The client can automatically retry requests after the rate limit window resets.

## Quick Start

### Enable Rate Limit Retry (Recommended)

To enable automatic retry on rate limit errors:

```typescript
import { Client } from "lago-javascript-client";

const client = Client("your-api-key", {
  rateLimitRetry: {
    maxRetries: 3,
    retryOnRateLimit: true,
  },
});

// Requests will automatically retry on 429 responses
const customers = await client.customers.findCustomers();
```

### Default Configuration

If you enable `rateLimitRetry` without options, defaults are:
- `maxRetries`: 3
- `retryOnRateLimit`: true

```typescript
const client = Client("your-api-key", {
  rateLimitRetry: {}, // Uses defaults
});
```

### Disable Automatic Retry

To throw errors on rate limit instead of retrying:

```typescript
const client = Client("your-api-key", {
  rateLimitRetry: {
    retryOnRateLimit: false,
  },
});

// Will throw LagoRateLimitError on 429
try {
  await client.customers.findCustomers();
} catch (error) {
  if (error instanceof LagoRateLimitError) {
    console.log(`Rate limited. Retry after ${error.reset} seconds`);
  }
}
```

## API Reference

### `LagoRateLimitError`

Error class thrown when a rate limit is encountered.

```typescript
class LagoRateLimitError extends Error {
  limit: number;           // Max requests per window
  remaining: number;       // Remaining requests
  reset: number;          // Seconds until window resets
  retryAfter: number;     // Milliseconds to wait before retry
}
```

**Example:**

```typescript
try {
  await client.customers.findCustomers();
} catch (error) {
  if (error instanceof LagoRateLimitError) {
    console.log(`Limit: ${error.limit}`);
    console.log(`Remaining: ${error.remaining}`);
    console.log(`Reset in: ${error.reset}s`);
    console.log(`Retry after: ${error.retryAfter}ms`);
  }
}
```

### `parseRateLimitHeaders(headers: Headers): RateLimitHeaders`

Manually parse rate limit headers from a response.

```typescript
import { parseRateLimitHeaders } from "lago-javascript-client";

const response = await fetch("https://api.getlago.com/api/v1/customers");
const rateLimits = parseRateLimitHeaders(response.headers);

if (rateLimits.remaining === 0) {
  console.log(`Rate limit will reset in ${rateLimits.reset}s`);
}
```

### `createRateLimitFetch(baseFetch, config): typeof fetch`

Create a custom fetch function with rate limit retry logic.

```typescript
import { createRateLimitFetch } from "lago-javascript-client";

const rateLimitFetch = createRateLimitFetch(globalThis.fetch, {
  maxRetries: 5,
  retryOnRateLimit: true,
});

const response = await rateLimitFetch("https://api.example.com/data");
```

### `RateLimitRetryHandler`

Advanced retry handler for custom use cases.

```typescript
import { RateLimitRetryHandler } from "lago-javascript-client";

const handler = new RateLimitRetryHandler({
  maxRetries: 3,
  retryOnRateLimit: true,
});

const result = await handler.retryWithBackoff(async () => {
  return await myCustomApiCall();
});
```

## Retry Behavior

### Retry Wait Time

When a 429 response is received:

1. **With `x-ratelimit-reset` header**: The client waits exactly that many seconds before retrying
2. **Without header**: The client uses exponential backoff starting at 1 second (1s, 2s, 4s, 8s, etc.)

Both approaches include a small jitter (up to 100ms) to prevent the "thundering herd" problem.

### Example Timeline

```
Request 1: sent → 429 (reset: 60s) → wait 60s
Request 2: sent → 200 OK
```

### Maximum Retries

By default, the client will retry up to 3 times before giving up:

```
Attempt 1: 429
Attempt 2: 429
Attempt 3: 429
Attempt 4: Throws LagoRateLimitError (no more retries)
```

Configure with `maxRetries` option:

```typescript
rateLimitRetry: {
  maxRetries: 5, // Try up to 5 times
}
```

## Configuration Options

### `RateLimitFetchConfig`

```typescript
interface RateLimitFetchConfig {
  /** Maximum number of retries on 429 (default: 3) */
  maxRetries?: number;

  /** Whether to automatically retry on rate limit (default: true) */
  retryOnRateLimit?: boolean;
}
```

### `LagoClientConfig`

```typescript
interface LagoClientConfig extends ApiConfig {
  /**
   * Rate limit retry configuration
   */
  rateLimitRetry?: RateLimitFetchConfig;
}
```

## Examples

### Example 1: Safe API Calls with Rate Limiting

```typescript
import { Client, LagoRateLimitError } from "lago-javascript-client";

const client = Client("sk_live_xxxx", {
  rateLimitRetry: {
    maxRetries: 5,
    retryOnRateLimit: true,
  },
});

async function getCustomer(id: string) {
  try {
    return await client.customers.findCustomer(id);
  } catch (error) {
    if (error instanceof LagoRateLimitError) {
      // This shouldn't happen if retryOnRateLimit is true and maxRetries isn't exceeded
      console.error("Rate limit exceeded after retries:", error.message);
    } else {
      console.error("API error:", error);
    }
  }
}
```

### Example 2: Batch Processing with Rate Limit Awareness

```typescript
async function processCustomers(ids: string[]) {
  const client = Client("sk_live_xxxx", {
    rateLimitRetry: {
      maxRetries: 3,
      retryOnRateLimit: true,
    },
  });

  for (const id of ids) {
    try {
      const customer = await client.customers.findCustomer(id);
      console.log(`Processed: ${customer.customer.external_id}`);
    } catch (error) {
      if (error instanceof LagoRateLimitError) {
        console.log(
          `Rate limited. Limit: ${error.limit}, Remaining: ${error.remaining}`
        );
        // Client will auto-retry, but if maxRetries is exceeded:
        console.log(`Next available request in ${error.reset}s`);
      }
    }
  }
}
```

### Example 3: Custom Retry Logic

```typescript
import { createRateLimitFetch } from "lago-javascript-client";

const customFetch = createRateLimitFetch(globalThis.fetch, {
  maxRetries: 10,
  retryOnRateLimit: true,
});

const client = Client("sk_live_xxxx", {
  customFetch, // Use the custom fetch with rate limit handling
});
```

### Example 4: Rate Limit Header Inspection

```typescript
import { parseRateLimitHeaders } from "lago-javascript-client";

const response = await fetch("https://api.getlago.com/api/v1/customers");
const limits = parseRateLimitHeaders(response.headers);

console.log(`Limit: ${limits.limit} requests per window`);
console.log(`Remaining: ${limits.remaining}`);
console.log(`Reset in: ${limits.reset}s`);

if (limits.remaining === 0) {
  console.warn("Rate limit exhausted!");
}
```

## Implementation Details

### Architecture

The rate limiting implementation consists of:

1. **`LagoRateLimitError`**: Custom error class for 429 responses
2. **`rate_limit_headers.ts`**: Header parsing utilities
3. **`rate_limit_fetch.ts`**: Fetch wrapper with automatic retry logic
4. **`rate_limit_retry.ts`**: Advanced retry handler (extensible for custom use)
5. **Integration in `mod.ts`**: Seamless client integration

### How It Works

1. When the client makes a request, it uses the rate-limit-aware fetch
2. If a 429 response is received:
   - Rate limit headers are parsed
   - A `LagoRateLimitError` is created with retry timing information
   - If `retryOnRateLimit` is true, the client sleeps for the appropriate duration and retries
   - If max retries are exceeded, the error is thrown
3. All other responses (including errors) are passed through unchanged

### No Generated Code Modification

The implementation:
- Does NOT modify the generated OpenAPI client code
- Uses a fetch wrapper to intercept HTTP responses
- Is completely backward compatible
- Works with any ApiConfig options
- Respects existing customFetch implementations

## Troubleshooting

### Requests Still Timing Out

If requests are taking a long time, they might be retrying due to rate limiting:

```typescript
rateLimitRetry: {
  maxRetries: 1, // Reduce retries for faster failure
  retryOnRateLimit: true,
}
```

### Want to Handle Rate Limits Manually

Disable auto-retry and handle errors yourself:

```typescript
const client = Client("sk_live_xxxx", {
  rateLimitRetry: {
    retryOnRateLimit: false,
  },
});

try {
  await client.customers.findCustomer(id);
} catch (error) {
  if (error instanceof LagoRateLimitError) {
    // Handle rate limit with your own logic
  }
}
```

### Rate Limit Headers Not Available

If headers are not being parsed, check that:
1. The server is returning the rate limit headers
2. Your proxy/middleware isn't stripping headers
3. The header names match exactly (lowercase): `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`

## Testing

Rate limiting can be tested using the mock fetch from the test utilities:

```typescript
import { mf } from "../dev_deps.ts";
import { createRateLimitFetch } from "../mod.ts";

const { fetch, mock } = mf.sandbox();

mock("https://example.com/api", () => {
  return new Response("Rate limited", {
    status: 429,
    headers: {
      "x-ratelimit-limit": "100",
      "x-ratelimit-remaining": "0",
      "x-ratelimit-reset": "60",
    },
  });
});

const rateLimitFetch = createRateLimitFetch(fetch, {
  retryOnRateLimit: true,
  maxRetries: 3,
});

const response = await rateLimitFetch("https://example.com/api");
```
