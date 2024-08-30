import { Context, Telegraf } from "telegraf";
import RegistrationService from "./services/registration.js";
import YesService from "./services/yes.js";
import AnecdoticaService from "./services/anecdotica.js";

class Bot {
  private bot: Telegraf;
  private registrationService: RegistrationService;
  private yesService: YesService;
  private anecdoticaService: AnecdoticaService;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.registrationService = new RegistrationService();
    this.yesService = new YesService();
    this.anecdoticaService = new AnecdoticaService();
  }

  public async init() {
    this.bot.start((ctx: Context) => {
      ctx.reply("Привет " + ctx.from?.first_name + "!");
    });

    await this.bot.telegram.setMyCommands([
      { command: "start", description: "Начало работы с ботом" },
      { command: "register", description: "Зарегистрироваться в боте" },
    ]);

    this.bot.command("register", async (ctx: Context) => {
      await this.registrationService.execute(ctx);
    });

    this.bot.command("joke", async (ctx: Context) => {
      await this.anecdoticaService.execute(ctx);
    });
  }

  public run() {
    this.bot.hears(/^(да|ДА|Да|дА)$/i, (ctx: Context) =>
      this.yesService.execute(ctx, "пизда! "),
    );

    this.bot.hears(/^(нет|НЕТ|Нет|нЕт|НЕт|нЕТ|НеТ|неТ)$/i, (ctx: Context) =>
      this.yesService.execute(ctx, "пидора ответ! "),
    );

    this.bot.launch().then(() => {});

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }
}

export default Bot;
