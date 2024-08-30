import { Context } from "telegraf";
import db from "../db";
import { guessTheWordGames } from "../schema";
import { and, eq } from "drizzle-orm";

class GameGuessTheWord {
  public async start(ctx: Context, word: string) {
    if (ctx.from) {
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
      }
    }
  }
}

export default GameGuessTheWord;
