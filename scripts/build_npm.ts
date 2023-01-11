import { build, emptyDir } from "https://deno.land/x/dnt@0.32.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/main.ts"],
  outDir: "./npm",
  typeCheck: false,
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
    custom: [
      {
        module: "https://cdn.skypack.dev/urlpattern-polyfill",
        globalNames: [
          {
            name: "URLPattern",
            exportName: "URLPattern",
          },
        ],
      },
    ],
  },
  compilerOptions: {
    target: "Latest",
    lib: ["dom", "es2022"],
  },
  package: {
    // package.json properties
    name: "lago-javascript-client",
    version: "v0.19.4-alpha",
    description: "Lago JavaScript API Client",
    repository: {
      "type": "git",
      "url": "git+https://github.com/getlago/lago-javascript-client.git",
    },
    keywords: [
      "Lago",
      "Node",
      "API",
      "Client",
    ],
    author: "Lovro Colic",
    license: "AGPL-3.0",
    bugs: {
      "url": "https://github.com/getlago/lago-javascript-client/issues",
    },
    homepage: "https://github.com/getlago/lago-javascript-client#readme",
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
