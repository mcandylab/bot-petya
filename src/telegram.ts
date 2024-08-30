import { Telegraf } from "telegraf";

class Bot {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
  }

  public init() {
    this.bot.start((ctx) => {
      ctx.reply("Hello " + ctx.from.first_name + "!");
    });
  }

  public run() {
    this.bot.launch();
  }
}

export default Bot;
