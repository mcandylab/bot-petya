CREATE TABLE IF NOT EXISTS "guess_the_word_games" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"chat_id" bigint NOT NULL,
	"word" text NOT NULL,
	"mask" text NOT NULL,
	"is_finished" boolean DEFAULT false
);
