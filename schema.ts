import { integer, pgTable, text, bigint, bigserial } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: bigint("user_id", { mode: "number" }).notNull(),
  username: text("username").notNull(),
  chat_id: bigint("chat_id", { mode: "number" }).notNull(),
});

export const yes = pgTable("yes", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  count: bigint("count", { mode: "number" }).notNull(),
  user_id: bigint("user_id", { mode: "number" }).notNull(),
  username: text("username").notNull(),
  chat_id: bigint("chat_id", { mode: "number" }).notNull(),
});
