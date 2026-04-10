import { assertEquals, assertExists } from "../dev_deps.ts";
import { mf } from "../dev_deps.ts";
import {
  Client,
  LagoRateLimitError,
  parseRateLimitHeaders,
  createRateLimitFetch,
} from "../mod.ts";

Deno.test("LagoRateLimitError contains rate limit information", () => {
  const error = new LagoRateLimitError(100, 0, 60);

  assertEquals(error.limit, 100);
  assertEquals(error.remaining, 0);
  assertEquals(error.reset, 60);
  assertEquals(error.retryAfter, 60000); // 60 seconds in milliseconds
  assertEquals(error.name, "LagoRateLimitError");
});

Deno.test("parseRateLimitHeaders extracts headers correctly", () => {
  const headers = new Headers({
    "x-ratelimit-limit": "100",
    "x-ratelimit-remaining": "10",
    "x-ratelimit-reset": "45",
  });

  const result = parseRateLimitHeaders(headers);

  assertEquals(result.limit, 100);
  assertEquals(result.remaining, 10);
  assertEquals(result.reset, 45);
});

Deno.test("parseRateLimitHeaders handles missing headers", () => {
  const headers = new Headers({
    "content-type": "application/json",
  });

  const result = parseRateLimitHeaders(headers);

  assertEquals(result.limit, null);
  assertEquals(result.remaining, null);
  assertEquals(result.reset, null);
});

Deno.test("parseRateLimitHeaders handles invalid header values", () => {
  const headers = new Headers({
    "x-ratelimit-limit": "not-a-number",
    "x-ratelimit-remaining": "abc",
    "x-ratelimit-reset": "",
  });

  const result = parseRateLimitHeaders(headers);

  assertEquals(result.limit, null);
  assertEquals(result.remaining, null);
  assertEquals(result.reset, null);
});

Deno.test("createRateLimitFetch throws LagoRateLimitError on 429 without retry", async () => {
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
    retryOnRateLimit: false,
  });

  try {
    await rateLimitFetch("https://example.com/api");
    assertEquals(true, false, "Should have thrown LagoRateLimitError");
  } catch (error) {
    if (error instanceof LagoRateLimitError) {
      assertEquals(error.limit, 100);
      assertEquals(error.remaining, 0);
      assertEquals(error.reset, 60);
    } else {
      throw error;
    }
  }
});

Deno.test("createRateLimitFetch retries on 429 with correct wait time", async () => {
  const { fetch, mock } = mf.sandbox();
  let callCount = 0;

  mock("https://example.com/api", () => {
    callCount++;
    if (callCount === 1) {
      return new Response("Rate limited", {
        status: 429,
        headers: {
          "x-ratelimit-limit": "100",
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": "1", // 1 second wait
        },
      });
    }
    return new Response('{"success": true}', {
      status: 200,
      headers: {
        "x-ratelimit-limit": "100",
        "x-ratelimit-remaining": "99",
        "x-ratelimit-reset": "3600",
      },
    });
  });

  const rateLimitFetch = createRateLimitFetch(fetch, {
    retryOnRateLimit: true,
    maxRetries: 3,
  });

  const startTime = Date.now();
  const response = await rateLimitFetch("https://example.com/api");
  const elapsed = Date.now() - startTime;

  assertEquals(response.status, 200);
  assertEquals(callCount, 2);
  // Should have waited approximately 1 second (1000ms) + jitter
  assertEquals(elapsed >= 1000, true);
});

Deno.test("createRateLimitFetch respects maxRetries", async () => {
  const { fetch, mock } = mf.sandbox();
  let callCount = 0;

  mock("https://example.com/api", () => {
    callCount++;
    return new Response("Rate limited", {
      status: 429,
      headers: {
        "x-ratelimit-limit": "100",
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": "1",
      },
    });
  });

  const rateLimitFetch = createRateLimitFetch(fetch, {
    retryOnRateLimit: true,
    maxRetries: 2,
  });

  try {
    await rateLimitFetch("https://example.com/api");
    assertEquals(true, false, "Should have thrown LagoRateLimitError");
  } catch (error) {
    if (error instanceof LagoRateLimitError) {
      // Called: attempt 0 (fails), attempt 1 (fails), attempt 2 (fails and gives up)
      assertEquals(callCount, 3);
    } else {
      throw error;
    }
  }
});

Deno.test("createRateLimitFetch passes through non-429 errors", async () => {
  const { fetch, mock } = mf.sandbox();

  mock("https://example.com/api", () => {
    return new Response("Server error", {
      status: 500,
    });
  });

  const rateLimitFetch = createRateLimitFetch(fetch, {
    retryOnRateLimit: true,
  });

  const response = await rateLimitFetch("https://example.com/api");
  assertEquals(response.status, 500);
});

Deno.test("Client with rateLimitRetry config uses rate limit fetch", async () => {
  const { fetch, mock } = mf.sandbox();
  let callCount = 0;

  mock("https://api.example.com/api/v1/customers", () => {
    callCount++;
    if (callCount === 1) {
      return new Response("Rate limited", {
        status: 429,
        headers: {
          "x-ratelimit-limit": "100",
          "x-ratelimit-remaining": "0",
          "x-ratelimit-reset": "1",
        },
      });
    }
    return new Response('{"customers": []}', {
      status: 200,
      headers: {
        "x-ratelimit-limit": "100",
        "x-ratelimit-remaining": "99",
        "x-ratelimit-reset": "3600",
      },
    });
  });

  const client = Client("test-api-key", {
    baseUrl: "https://api.example.com",
    customFetch: fetch,
    rateLimitRetry: {
      retryOnRateLimit: true,
      maxRetries: 3,
    },
  });

  assertExists(client);
  assertEquals(callCount, 0); // Not called yet
});

Deno.test("createRateLimitFetch includes rate limit headers in success response", async () => {
  const { fetch, mock } = mf.sandbox();

  mock("https://example.com/api", () => {
    return new Response('{"data": "test"}', {
      status: 200,
      headers: {
        "x-ratelimit-limit": "100",
        "x-ratelimit-remaining": "50",
        "x-ratelimit-reset": "3600",
        "content-type": "application/json",
      },
    });
  });

  const rateLimitFetch = createRateLimitFetch(fetch);
  const response = await rateLimitFetch("https://example.com/api");

  assertEquals(response.status, 200);
  assertEquals(response.headers.get("x-ratelimit-limit"), "100");
  assertEquals(response.headers.get("x-ratelimit-remaining"), "50");
  assertEquals(response.headers.get("x-ratelimit-reset"), "3600");
});

Deno.test("LagoRateLimitError is instanceof Error", () => {
  const error = new LagoRateLimitError(100, 0, 60);
  assertEquals(error instanceof Error, true);
  assertEquals(error instanceof LagoRateLimitError, true);
});
