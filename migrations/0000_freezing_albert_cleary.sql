CREATE TABLE IF NOT EXISTS "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"username" text NOT NULL,
	"chat_id" text NOT NULL
);
