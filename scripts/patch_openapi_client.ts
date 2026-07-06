// The deprecated GET /webhooks/public_key endpoint (see webhooks.fetchPublicKey)
// responds with `text/plain`, not JSON. swagger-typescript-api has no mapping
// for that content type, so the generated method comes out with no `format`
// at all, and `.data` is never populated (see openapi/client.ts's
// HttpClient#request: `responseFormat` stays falsy and `r.data` is never
// assigned).
//
// The real fix for new integrations is GET /webhooks/json_public_key
// (see webhooks.fetchJsonPublicKey), which is now documented in the spec and
// needs no patch at all — it generates a normal `format: "json"` method like
// every other endpoint. This script only exists so the deprecated method
// stops silently returning null for anyone still calling it.
//
// Runs right after `generate:openapi` (wired in deno.jsonc) so the fix
// survives regeneration from the live spec. Fails loudly if
// swagger-typescript-api's output for this endpoint ever changes shape,
// instead of silently doing nothing.

const CLIENT_PATH = "./openapi/client.ts";

type TextEndpointPatch = {
  /** Text used to locate the generated request block. Must match exactly one place. */
  match: string;
  /** Replacement including the injected `format: "text",` line. */
  replacement: string;
};

const patches: TextEndpointPatch[] = [
  {
    match: `    fetchPublicKey: (params: RequestParams = {}) =>\n` +
      `      this.request<string, ApiErrorUnauthorized>({\n` +
      `        path: \`/webhooks/public_key\`,\n` +
      `        method: "GET",\n` +
      `        secure: true,\n` +
      `        ...params,\n` +
      `      }),`,
    replacement: `    fetchPublicKey: (params: RequestParams = {}) =>\n` +
      `      this.request<string, ApiErrorUnauthorized>({\n` +
      `        path: \`/webhooks/public_key\`,\n` +
      `        method: "GET",\n` +
      `        secure: true,\n` +
      `        format: "text",\n` +
      `        ...params,\n` +
      `      }),`,
  },
  {
    // `format: "text"` above means a failed request (e.g. 401) also reads
    // its body with `response.text()` instead of `response.json()`, but
    // Lago's error bodies are always JSON regardless of the success
    // content type. Without this, `r.error` would be a raw JSON string
    // instead of a parsed object, unlike every other endpoint in the SDK.
    match: `      const data = !responseFormat\n` +
      `        ? r\n` +
      `        : await response[responseFormat]()\n` +
      `            .then((data) => {\n` +
      `              if (r.ok) {\n` +
      `                r.data = data;\n` +
      `              } else {\n` +
      `                r.error = data;\n` +
      `              }\n` +
      `              return r;\n` +
      `            })\n` +
      `            .catch((e) => {\n` +
      `              r.error = e;\n` +
      `              return r;\n` +
      `            });`,
    replacement: `      const data = !responseFormat\n` +
      `        ? r\n` +
      `        : await response[responseFormat]()\n` +
      `            .then((data) => {\n` +
      `              if (r.ok) {\n` +
      `                r.data = data;\n` +
      `              } else if (responseFormat === "text") {\n` +
      `                try {\n` +
      `                  r.error = JSON.parse(data as unknown as string);\n` +
      `                } catch {\n` +
      `                  r.error = data;\n` +
      `                }\n` +
      `              } else {\n` +
      `                r.error = data;\n` +
      `              }\n` +
      `              return r;\n` +
      `            })\n` +
      `            .catch((e) => {\n` +
      `              r.error = e;\n` +
      `              return r;\n` +
      `            });`,
  },
];

const source = await Deno.readTextFile(CLIENT_PATH);
let patched = source;
const errors: string[] = [];

for (const { match, replacement } of patches) {
  const occurrences = patched.split(match).length - 1;

  if (occurrences === 0) {
    // Either already patched (unlikely, generator always overwrites) or
    // swagger-typescript-api changed how it emits this endpoint.
    if (patched.includes(replacement)) continue;
    errors.push(
      `Could not find expected generated block to patch:\n${match}`,
    );
    continue;
  }

  if (occurrences > 1) {
    errors.push(
      `Expected exactly one match, found ${occurrences} for:\n${match}`,
    );
    continue;
  }

  patched = patched.replace(match, replacement);
}

if (errors.length > 0) {
  console.error("patch_openapi_client.ts failed:\n" + errors.join("\n\n"));
  Deno.exit(1);
}

if (patched !== source) {
  await Deno.writeTextFile(CLIENT_PATH, patched);
  console.log("patch_openapi_client.ts: patched openapi/client.ts");
} else {
  console.log("patch_openapi_client.ts: no changes needed");
}
