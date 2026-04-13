import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const specPath = resolve(__dirname, "../docs/exist-api-openapi.yaml");
const outputPath = resolve(__dirname, "../src/types.ts");

await new Promise((resolve, reject) => {
  const child = spawn(
    "npx",
    ["openapi-typescript", specPath, "--output", outputPath],
    {
      stdio: "inherit",
    },
  );
  child.on("error", reject);
  child.on("close", (code) => {
    if (code === 0) {
      resolve(code);
    } else {
      reject(new Error(`openapi-typescript exited with code ${code}`));
    }
  });
});

console.log("Generated src/types.ts");
