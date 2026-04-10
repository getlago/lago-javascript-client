import { assertEquals } from "../dev_deps.ts";
import {
  Client,
  LagoRateLimitError,
  parseRateLimitHeaders,
  createRateLimitFetch,
} from "../mod.ts";

// Simple fetch mock helper (replaces broken mock_fetch library)
function createMockFetch(handler: (input: RequestInfo | URL, init?: RequestInit) => Response | Promise<Response>): typeof fetch {
  return (input: RequestInfo | URL, init?: RequestInit) => {
    return Promise.resolve(handler(input, init));
  };
}

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
  const mockFetch = createMockFetch(() => {
    return new Response("Rate limited", {
      status: 429,
      headers: {
        "x-ratelimit-limit": "100",
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": "60",
      },
    });
  });

  const rateLimitFetch = createRateLimitFetch(mockFetch, {
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
  let callCount = 0;

  const mockFetch = createMockFetch(() => {
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

  const rateLimitFetch = createRateLimitFetch(mockFetch, {
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
  let callCount = 0;

  const mockFetch = createMockFetch(() => {
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

  const rateLimitFetch = createRateLimitFetch(mockFetch, {
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

Deno.test("createRateLimitFetch uses exponential backoff when reset header missing", async () => {
  let callCount = 0;

  const mockFetch = createMockFetch(() => {
    callCount++;
    if (callCount === 1) {
      // 429 without reset header
      return new Response("Rate limited", {
        status: 429,
        headers: {
          "x-ratelimit-limit": "100",
          "x-ratelimit-remaining": "0",
        },
      });
    }
    return new Response('{"success": true}', { status: 200 });
  });

  const rateLimitFetch = createRateLimitFetch(mockFetch, {
    retryOnRateLimit: true,
    maxRetries: 3,
  });

  const startTime = Date.now();
  const response = await rateLimitFetch("https://example.com/api");
  const elapsed = Date.now() - startTime;

  assertEquals(response.status, 200);
  assertEquals(callCount, 2);
  // Exponential backoff attempt 0: 1000ms * 2^0 = 1000ms + jitter
  assertEquals(elapsed >= 1000, true);
  assertEquals(elapsed < 1500, true); // Should not be as long as the old 60s default
});

Deno.test("createRateLimitFetch passes through non-429 errors", async () => {
  const mockFetch = createMockFetch(() => {
    return new Response("Server error", {
      status: 500,
    });
  });

  const rateLimitFetch = createRateLimitFetch(mockFetch, {
    retryOnRateLimit: true,
  });

  const response = await rateLimitFetch("https://example.com/api");
  assertEquals(response.status, 500);
});

Deno.test("Client with rateLimitRetry config uses rate limit fetch", () => {
  const mockFetch = createMockFetch(() => {
    return new Response('{"customers": []}', { status: 200 });
  });

  const client = Client("test-api-key", {
    baseUrl: "https://api.example.com",
    customFetch: mockFetch,
    rateLimitRetry: {
      retryOnRateLimit: true,
      maxRetries: 3,
    },
  });

  // Verify client was created
  assertEquals(typeof client, "object");
});

Deno.test("createRateLimitFetch includes rate limit headers in success response", async () => {
  const mockFetch = createMockFetch(() => {
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

  const rateLimitFetch = createRateLimitFetch(mockFetch);
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
