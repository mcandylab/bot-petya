import { Context, Telegraf } from "telegraf";
import RegistrationService from "./services/registration.js";
import YesService from "./services/yes.js";
import AnecdoticaService from "./services/anecdotica.js";
import GameGuessTheWord from "./services/gameGuessTheWord.js";
import YandexCloud from "./services/yandexCloud.js";

class Bot {
  private bot: Telegraf;
  private registrationService: RegistrationService;
  private yesService: YesService;
  private anecdoticaService: AnecdoticaService;
  private gameGuessTheWord: GameGuessTheWord;
  private yandexCloud: YandexCloud;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.registrationService = new RegistrationService();
    this.yesService = new YesService();
    this.anecdoticaService = new AnecdoticaService();
    this.gameGuessTheWord = new GameGuessTheWord();
    this.yandexCloud = new YandexCloud();
  }

  public async init() {
    this.bot.start((ctx: Context) => {
      ctx.reply("Привет " + ctx.from?.first_name + "!");
    });

    await this.bot.telegram.setMyCommands([
      { command: "start", description: "Начало работы с ботом" },
      { command: "register", description: "Зарегистрироваться в боте" },
      { command: "joke", description: "Случайный анекдот" },
      {
        command: "guessword",
        description: 'Запустить игру: "Поле чудес". /guessword слово',
      },
    ]);

    this.bot.command("register", async (ctx: Context) => {
      await this.registrationService.execute(ctx);
    });

    this.bot.command("joke", async (ctx: Context) => {
      await this.anecdoticaService.execute(ctx);
    });

    this.bot.command("guessword", async (ctx: Context) => {
      await this.yandexCloud.getIAMtoken();
      const word = await this.yandexCloud.sendMessageToGPT(
        "ты генератор слов для игры 'поле чудес'. Отвечай только сгенерированное слово. Слово должно быть уникальным каждый раз",
        "Сгенерируй случайное слово - существительное в диапазоне от 6 до 24 символов",
      );

      await this.gameGuessTheWord.start(ctx, word.toLowerCase());
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
