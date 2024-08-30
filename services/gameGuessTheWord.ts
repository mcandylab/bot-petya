import { Context } from "telegraf";

class GameGuessTheWord {
  public async start(ctx: Context, word: string) {
    await ctx.reply(`Выбранное слово: ${word}`);
  }
}

export default GameGuessTheWord;
