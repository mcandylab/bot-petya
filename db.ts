import { config } from "dotenv";
config();

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  host: process.env.POSTGRESQL_HOST,
  port: parseInt(process.env.POSTGRESQL_PORT || "5432"),
  user: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DBNAME,
});

await client.connect();
const db = drizzle(client);

export default db;
