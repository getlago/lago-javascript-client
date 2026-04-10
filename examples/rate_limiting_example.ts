/**
 * Example: Using Rate Limiting with Lago Client
 *
 * This example demonstrates how to use the rate limiting features
 * of the Lago JavaScript/TypeScript client.
 */

import { Client, LagoRateLimitError, parseRateLimitHeaders } from "../mod.ts";

/**
 * Example 1: Basic usage with automatic retry
 */
async function example1_BasicRateLimitRetry() {
  console.log("Example 1: Basic rate limit retry\n");

  // Initialize client with rate limit retry enabled
  const client = Client("sk_live_xxx_your_api_key", {
    rateLimitRetry: {
      maxRetries: 3,
      retryOnRateLimit: true,
    },
  });

  try {
    // If this request gets rate limited, it will automatically retry
    // after waiting for the reset time specified in the response headers
    const customers = await client.customers.findCustomers();
    console.log(`Successfully fetched customers`);
  } catch (error) {
    if (error instanceof LagoRateLimitError) {
      console.error(`Rate limit error: ${error.message}`);
      console.error(`Limit: ${error.limit}, Remaining: ${error.remaining}`);
      console.error(`Reset in: ${error.reset}s`);
    } else {
      console.error("Other error:", error);
    }
  }
}

/**
 * Example 2: Manual rate limit handling
 */
async function example2_ManualRateLimitHandling() {
  console.log("\nExample 2: Manual rate limit handling\n");

  // Disable automatic retry to handle rate limits manually
  const client = Client("sk_live_xxx_your_api_key", {
    rateLimitRetry: {
      retryOnRateLimit: false, // Will throw instead of retry
    },
  });

  try {
    const customers = await client.customers.findCustomers();
    console.log("Successfully fetched customers");
  } catch (error) {
    if (error instanceof LagoRateLimitError) {
      // Handle the rate limit error with custom logic
      console.warn(
        `Rate limited. Please retry after ${error.reset} seconds.`
      );

      // You could implement custom retry logic here
      await sleep(error.reset * 1000);
      // Retry the request...
    } else {
      console.error("Other error:", error);
    }
  }
}

/**
 * Example 3: Batch processing with rate limit awareness
 */
async function example3_BatchProcessing() {
  console.log("\nExample 3: Batch processing\n");

  const client = Client("sk_live_xxx_your_api_key", {
    rateLimitRetry: {
      maxRetries: 5,
      retryOnRateLimit: true,
    },
  });

  const customerIds = [
    "cust_001",
    "cust_002",
    "cust_003",
    "cust_004",
    "cust_005",
  ];

  for (const id of customerIds) {
    try {
      const customer = await client.customers.findCustomer(id);
      console.log(
        `Processed customer: ${customer.customer.external_id}`
      );
    } catch (error) {
      if (error instanceof LagoRateLimitError) {
        console.error(
          `Rate limited. Remaining: ${error.remaining}/${error.limit}`
        );
        console.error(
          `Next request possible in ${error.reset}s`
        );

        // Optional: implement exponential backoff or jitter
        // for distributed processing
      } else {
        console.error(`Error processing customer ${id}:`, error);
      }
    }
  }
}

/**
 * Example 4: Inspecting rate limit headers directly
 */
async function example4_InspectRateLimitHeaders() {
  console.log("\nExample 4: Inspect rate limit headers\n");

  // Create a client without automatic retry
  const client = Client("sk_live_xxx_your_api_key", {
    rateLimitRetry: {
      retryOnRateLimit: false,
    },
  });

  try {
    // Make a request - note: this is pseudo-code since we can't
    // directly access Response objects from the Lago API
    // In real usage, you'd need to wrap the client methods

    console.log("This example would typically wrap the fetch layer");
    console.log("to inspect response headers directly");
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Example 5: Advanced configuration with custom retry limits
 */
async function example5_AdvancedConfiguration() {
  console.log("\nExample 5: Advanced configuration\n");

  // Different configs for different use cases
  const configs = {
    // Conservative: Few retries for time-sensitive operations
    conservative: {
      maxRetries: 1,
      retryOnRateLimit: true,
    },

    // Moderate: Default retry behavior
    moderate: {
      maxRetries: 3,
      retryOnRateLimit: true,
    },

    // Aggressive: Many retries for critical operations
    aggressive: {
      maxRetries: 10,
      retryOnRateLimit: true,
    },

    // Manual: No automatic retry
    manual: {
      retryOnRateLimit: false,
    },
  };

  // Use conservative approach for time-sensitive operations
  const timeSensitiveClient = Client(
    "sk_live_xxx_your_api_key",
    {
      rateLimitRetry: configs.conservative,
    }
  );

  // Use aggressive approach for critical batch operations
  const batchClient = Client(
    "sk_live_xxx_your_api_key",
    {
      rateLimitRetry: configs.aggressive,
    }
  );

  console.log("Configured clients with different retry strategies");
  console.log("Conservative (1 retry): time-sensitive operations");
  console.log("Aggressive (10 retries): batch operations");
}

/**
 * Example 6: Error handling best practices
 */
async function example6_ErrorHandlingBestPractices() {
  console.log("\nExample 6: Error handling best practices\n");

  const client = Client("sk_live_xxx_your_api_key", {
    rateLimitRetry: {
      maxRetries: 3,
      retryOnRateLimit: true,
    },
  });

  async function makeApiRequest() {
    try {
      return await client.customers.findCustomers();
    } catch (error) {
      // Handle rate limit errors
      if (error instanceof LagoRateLimitError) {
        console.error("Rate limit exceeded:");
        console.error(`  Limit: ${error.limit} requests per window`);
        console.error(`  Remaining: ${error.remaining}`);
        console.error(`  Reset in: ${error.reset} seconds`);

        // Option 1: Implement exponential backoff
        const backoffMs = Math.pow(2, 3) * 1000; // 8 seconds
        console.log(`Waiting ${backoffMs}ms before retry...`);
        await sleep(backoffMs);

        // Option 2: Notify monitoring/alerting system
        console.log("Alert: Rate limit exhausted - check API quota");

        // Option 3: Gracefully degrade service
        return null; // Return cached data or default value
      }

      // Handle other API errors
      if (error instanceof Error && error.message.includes("Unauthorized")) {
        console.error("Authentication failed - check your API key");
        return null;
      }

      // Handle network errors
      if (error instanceof TypeError) {
        console.error("Network error - check connectivity");
        return null;
      }

      // Unknown error
      throw error;
    }
  }

  const result = await makeApiRequest();
  console.log("Request completed with robust error handling");
}

/**
 * Helper function: sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run all examples
 */
async function runExamples() {
  console.log("========================================");
  console.log("Lago Client Rate Limiting Examples");
  console.log("========================================\n");

  try {
    // Note: These examples are pseudo-code and would require
    // actual API calls to work properly

    console.log("Example code loaded successfully!");
    console.log("\nTo use these examples:");
    console.log(
      "1. Replace 'sk_live_xxx_your_api_key' with your actual API key"
    );
    console.log(
      "2. Uncomment the example you want to run"
    );
    console.log("3. Run the script\n");

    // Uncomment to run examples:
    // await example1_BasicRateLimitRetry();
    // await example2_ManualRateLimitHandling();
    // await example3_BatchProcessing();
    // await example4_InspectRateLimitHeaders();
    // await example5_AdvancedConfiguration();
    // await example6_ErrorHandlingBestPractices();
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Only run examples if this file is executed directly
if (import.meta.main) {
  runExamples();
}

export {
  example1_BasicRateLimitRetry,
  example2_ManualRateLimitHandling,
  example3_BatchProcessing,
  example4_InspectRateLimitHeaders,
  example5_AdvancedConfiguration,
  example6_ErrorHandlingBestPractices,
};
