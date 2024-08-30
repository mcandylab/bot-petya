CREATE TABLE IF NOT EXISTS "players" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"username" text NOT NULL,
	"chat_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "yes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"count" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"username" text NOT NULL,
	"chat_id" bigint NOT NULL
);
