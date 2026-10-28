const path = require("node:path");
const { spawn } = require("node:child_process");

process.loadEnvFile(path.resolve(__dirname, "../../.env.local"));

const frontendDir = path.resolve(__dirname, "..");
const nextCli = path.join(frontendDir, "node_modules", "next", "dist", "bin", "next");
const child = spawn(
  process.execPath,
  [nextCli, "dev", "--webpack", ...process.argv.slice(2)],
  { cwd: frontendDir, env: process.env, stdio: "inherit" }
);

child.on("error", (error) => {
  console.error("Could not start Next.js:", error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
