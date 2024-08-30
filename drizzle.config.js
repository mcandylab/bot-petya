import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
config({ path: ".env" });
export default defineConfig({
  schema: "./schema.ts",
  out: "./migrations",
  dialect: "postgresql",
});
//# sourceMappingURL=drizzle.config.js.map
