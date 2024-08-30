import { Context, Telegraf } from "telegraf";
import RegistrationService from "./services/registration.js";
import YesService from "./services/yes.js";

class Bot {
  private bot: Telegraf;
  private registrationService: RegistrationService;
  private yesService: YesService;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.registrationService = new RegistrationService();
    this.yesService = new YesService();
  }

  public async init() {
    this.bot.start((ctx: Context) => {
      ctx.reply("Привет " + ctx.from?.first_name + "!");
    });

    await this.bot.telegram.setMyCommands([
      { command: "start", description: "Начало работы с ботом" },
      { command: "register", description: "Зарегистрироваться в боте" },
    ]);

    this.bot.command("register", async (ctx) => {
      await this.registrationService.execute(ctx);
    });
  }

  public run() {
    this.bot.hears("да", (ctx: Context) => this.yesService.execute(ctx));
    this.bot.hears("ДА", (ctx: Context) => this.yesService.execute(ctx));
    this.bot.hears("Да", (ctx: Context) => this.yesService.execute(ctx));
    this.bot.hears("дА", (ctx: Context) => this.yesService.execute(ctx));

    this.bot.launch().then(() => {});

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }
}

export default Bot;
