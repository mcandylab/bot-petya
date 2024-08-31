import { Context } from "telegraf";
import db from "../db.js";
import { guessTheWordGames } from "../schema.js";
import { and, eq } from "drizzle-orm";

class GameGuessTheWord {
  public async start(ctx: Context, word: string) {
    if (ctx.from && ctx.chat) {
      const game = await this.checkStartedGame(ctx);

      if (game) {
        await ctx.reply("Игра уже запущена. Неугаданное слово: " + game.mask);
      } else {
        const mask = Array(word.length).fill("*").join("");
        await db.insert(guessTheWordGames).values({
          chat_id: ctx.chat.id,
          word: word,
          mask: mask,
          is_finished: false,
        });

        await ctx.reply(
          `Игра началась! Загаданное слово: ${mask}. Количество букв: ${word.length}`,
        );
      }
    }
  }

  public async guessWord(ctx: Context, letter: string): Promise<void> {
    if (ctx.from && ctx.chat) {
      const game = await this.checkStartedGame(ctx);

      if (!game) {
        await ctx.reply("Активная игра не найдена. Начните новую игру.");
        return;
      }

      const word = game.word;
      let mask = game.mask;
      let found = false;

      for (let i = 0; i < word.length; i++) {
        if (word[i].toLowerCase() === letter.toLowerCase()) {
          mask = mask.substring(0, i) + word[i] + mask.substring(i + 1);
          found = true;
        }
      }

      if (found) {
        await db
          .update(guessTheWordGames)
          .set({ mask: mask })
          .where(eq(guessTheWordGames.id, game.id));

        if (mask === word) {
          await db
            .update(guessTheWordGames)
            .set({ is_finished: true })
            .where(eq(guessTheWordGames.id, game.id));

          await ctx.reply(`Поздравляем! Вы угадали слово: ${word}`);
        } else {
          await ctx.reply(`Правильно! Обновленное слово: ${mask}`);
        }
      } else {
        await ctx.reply(`Буквы "${letter}" нет в слове.`);
      }
    }
  }

  public async guessWholeWord(
    ctx: Context,
    guessedWord: string,
  ): Promise<void> {
    if (ctx.from && ctx.chat) {
      const game = await this.checkStartedGame(ctx);

      if (!game) {
        await ctx.reply("Активная игра не найдена. Начните новую игру.");
        return;
      }

      const word = game.word;

      if (guessedWord.toLowerCase() === word.toLowerCase()) {
        await db
          .update(guessTheWordGames)
          .set({ mask: word, is_finished: true })
          .where(eq(guessTheWordGames.id, game.id));

        const winner = ctx.from.username
          ? `@${ctx.from.username}`
          : ctx.from.first_name;
        await ctx.reply(`Поздравляем, ${winner}! Угаданное слово: ${word}`);
      } else {
        await ctx.reply(`Слово "${guessedWord}" не совпадает с загаданным.`);
      }
    }
  }

  private async checkStartedGame(ctx: Context) {
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

      return game.length ? game[0] : null;
    }
    return null;
  }
}

export default GameGuessTheWord;
