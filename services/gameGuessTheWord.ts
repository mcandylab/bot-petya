import { Context } from "telegraf";
import db from "../db.js";
import { guessTheWordGames, players } from "../schema.js";
import { and, eq } from "drizzle-orm";

class GameGuessTheWord {
  public async start(ctx: Context, word: string) {
    if (ctx.from && ctx.chat) {
      const game = await db
        .select()
        .from(guessTheWordGames)
        .where(
          and(
            eq(guessTheWordGames.chat_id, ctx.from.id),
            eq(guessTheWordGames.is_finished, false),
          ),
        );

      if (game.length) {
        await ctx.reply(
          "Игра уже запущена. Неугаданное слово: " + game[0].mask,
        );
      } else {
        await db.insert(guessTheWordGames).values({
          chat_id: ctx.chat.id,
          word: word,
          mask: Array(word.length).fill("*").join(""),
          is_finished: false,
        });
      }
    }
  }
}

export default GameGuessTheWord;
