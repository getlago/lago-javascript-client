// fetchPublicKey (deprecated, text/plain) generates with no `format`, so
// `.data` is never populated. Patches it to `format: "text"` after
// generation. fetchJsonPublicKey is unaffected, it's a normal JSON endpoint.
// Fails loudly (rather than silently) if the generator's output ever
// changes shape.

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
    // Error bodies are always JSON even for text/plain success responses,
    // so parse `r.error` as JSON when `responseFormat` is "text".
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
    // Already patched, or the generator's output changed shape.
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

// Query strings can preserve all int64 cents when callers supply a decimal
// string. Keep number compatibility and leave every response type unchanged.
for (const operation of ["findAllPayments", "findAllCustomerPayments"]) {
  const start = patched.indexOf(`    ${operation}: (`);
  const end = patched.indexOf("      params: RequestParams", start);
  if (start < 0 || end < 0) {
    errors.push(`Missing generated operation: ${operation}`);
    continue;
  }
  let query = patched.slice(start, end);
  for (const bound of ["amount_from", "amount_to"]) {
    const original = `${bound}?: number;`;
    const replacement = `${bound}?: number | string;`;
    // A published spec without payment filters still builds during rollout.
    if (query.includes(original)) query = query.replace(original, replacement);
  }
  patched = patched.slice(0, start) + query + patched.slice(end);
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
