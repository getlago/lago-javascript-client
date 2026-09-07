// Both generators consume the same spec source. Release builds keep the
// published default; CI can validate a feature against an immutable spec pin.
const target = Deno.args[0];
if (target !== "client" && target !== "webhooks") {
  throw new Error("Usage: generate.ts client|webhooks");
}

const pinPath = Deno.env.get("LAGO_OPENAPI_PIN");
const pin: { url: string; sha256: string } | undefined = pinPath
  ? JSON.parse(await Deno.readTextFile(pinPath))
  : undefined;
const source = Deno.env.get("LAGO_OPENAPI_SPEC") ?? pin?.url ??
  "https://swagger.getlago.com/openapi.yaml";
const bytes = /^https?:\/\//.test(source)
  ? await (async () => {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Spec download failed: ${response.status}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  })()
  : await Deno.readFile(source);
if (pin) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const hash = Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  if (hash !== pin.sha256) throw new Error("OpenAPI spec checksum mismatch");
}

const input = await Deno.makeTempFile({ suffix: ".yaml" });
try {
  await Deno.writeFile(input, bytes);
  const args = target === "client"
    ? [
      "-y",
      "swagger-typescript-api@13.0.2",
      "-p",
      input,
      "--union-enums",
      "-o",
      "./openapi",
      "-n",
      "client.ts",
    ]
    : ["-y", "openapi-typescript@7.13.0", input, "-o", "./openapi/webhooks.ts"];
  const result = await new Deno.Command("npx", { args }).spawn().status;
  if (!result.success) throw new Error(`Generator failed: ${result.code}`);
  if (target === "client") await import("./patch_openapi_client.ts");
} finally {
  await Deno.remove(input);
}
