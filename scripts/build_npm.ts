import { build, emptyDir } from "https://deno.land/x/dnt@0.34.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: false,
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
    custom: [
      {
        package: {
          name: "urlpattern-polyfill",
          version: "^6.0.2",
        },
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
    sideEffects: false,
    version: "v0.39.0-beta",
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
    contributors: [
      "Lovro Colic",
      "Jérémy Denquin",
      "Arjun Yelamanchili",
      "Vincent Pochet",
      "Romain Sempé",
    ],
    license: "MIT",
    bugs: {
      "url": "https://github.com/getlago/lago-javascript-client/issues",
    },
    homepage: "https://github.com/getlago/lago-javascript-client#readme",
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
