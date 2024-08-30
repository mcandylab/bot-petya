import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: "./schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRESQL_HOST || "",
    port: parseInt(process.env.POSTGRESQL_PORT || "5432"),
    user: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DBNAME || "",
    ssl: false,
  },
});
