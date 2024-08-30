import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  username: text("username").notNull(),
  chat_id: integer("chat_id").notNull(),
});

export type InsertPlayer = typeof players.$inferInsert;
export type SelectPlayer = typeof players.$inferSelect;
