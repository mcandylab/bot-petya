import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  username: text("username").notNull(),
  chat_id: text("chat_id").notNull(),
});
