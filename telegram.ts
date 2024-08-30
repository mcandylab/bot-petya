import { Telegraf } from "telegraf";
import RegistrationService from "./services/registration.js";

class Bot {
  private bot: Telegraf;
  private registrationService: RegistrationService;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.registrationService = new RegistrationService();
  }

  public async init() {
    this.bot.start((ctx) => {
      ctx.reply("Привет " + ctx.from.first_name + "!");
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
    this.bot.launch().then(() => {});

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }
}

export default Bot;
