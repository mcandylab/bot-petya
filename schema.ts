import { pgTable, text, bigint, bigserial, boolean } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: bigint("user_id", { mode: "number" }).notNull(),
  username: text("username").notNull(),
  chat_id: bigint("chat_id", { mode: "number" }).notNull(),
});

export const yes = pgTable("yes", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  count: bigint("count", { mode: "number" }).notNull(),
  message: text("message").notNull(),
  user_id: bigint("user_id", { mode: "number" }).notNull(),
  username: text("username").notNull(),
  chat_id: bigint("chat_id", { mode: "number" }).notNull(),
});

export const guessTheWordGames = pgTable("guess_the_word_games", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  chat_id: bigint("chat_id", { mode: "number" }).notNull(),
  word: text("word").notNull(),
  mask: text("mask").notNull(),
  is_finished: boolean("is_finished").default(false),
});
