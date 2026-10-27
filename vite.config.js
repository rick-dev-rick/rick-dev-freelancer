import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base:
    process.env.GITHUB_PAGES === "true"
      ? `/${(process.env.GITHUB_REPOSITORY || "rick-dev-rick/rick-dev-freelancer").split("/")[1]}/`
      : "/",
  plugins: [react()],
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
});
