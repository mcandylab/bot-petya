import { Context, Telegraf } from "telegraf";
import RegistrationService from "./services/registration.js";
import YesService from "./services/yes.js";
import AnecdoticaService from "./services/anecdotica.js";
import GameGuessTheWord from "./services/gameGuessTheWord.js";
import GetRandomWord from "./lib/getRandomWord.js";

class Bot {
  private bot: Telegraf;
  private registrationService: RegistrationService;
  private yesService: YesService;
  private anecdoticaService: AnecdoticaService;
  private gameGuessTheWord: GameGuessTheWord;

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN as string);
    this.registrationService = new RegistrationService();
    this.yesService = new YesService();
    this.anecdoticaService = new AnecdoticaService();
    this.gameGuessTheWord = new GameGuessTheWord();
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
        description: 'Запустить игру: "Поле чудес"',
      },
    ]);

    this.bot.command("register", async (ctx: Context) => {
      await this.registrationService.execute(ctx);
    });

    this.bot.command("joke", async (ctx: Context) => {
      await this.anecdoticaService.execute(ctx);
    });

    this.bot.command("guessword", async (ctx: Context) => {
      const word = GetRandomWord.execute();

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

    // Прослушка сообщений, начинающихся с "буква"
    this.bot.hears(/^буква\s*(.*)/, async (ctx) => {
      const messageText = ctx.message.text.trim();

      // Разделяем текст после "буква"
      const parts = messageText.split(" ");
      const possibleLetter = parts[1]?.trim();

      // Проверяем, есть ли буква и является ли она одиночной
      if (
        possibleLetter &&
        possibleLetter.length === 1 &&
        /^[а-яА-ЯёЁa-zA-Z]$/.test(possibleLetter)
      ) {
        await this.gameGuessTheWord.guessWord(
          ctx,
          possibleLetter.toLowerCase(),
        );
      } else {
        await ctx.reply(
          'Пожалуйста, укажите только одну букву после команды "буква".',
        );
      }
    });

    // Обработка случаев, когда после "буква" ничего нет
    this.bot.hears(/^буква\s*$/, (ctx) => {
      ctx.reply('Пожалуйста, укажите одну букву после команды "буква".');
    });

    // Прослушка сообщений, начинающихся с "слово"
    this.bot.hears(/^слово\s*(.*)/, async (ctx) => {
      const messageText = ctx.message.text.trim();

      // Разделяем текст после "слово"
      const parts = messageText.split(" ");
      const possibleWord = parts[1]?.trim();

      // Проверяем, есть ли слово и оно состоит только из букв
      if (
        possibleWord &&
        /^[а-яА-ЯёЁa-zA-Z]+$/.test(possibleWord) &&
        parts.length === 2
      ) {
        await this.gameGuessTheWord.guessWholeWord(
          ctx,
          possibleWord.toLowerCase(),
        );
      } else {
        await ctx.reply(
          'Пожалуйста, укажите одно слово после команды "слово".',
        );
      }
    });

    // Обработка случаев, когда после "слово" ничего нет
    this.bot.hears(/^слово\s*$/, (ctx) => {
      ctx.reply('Пожалуйста, укажите одно слово после команды "слово".');
    });

    this.bot.launch().then(() => {});

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }
}

export default Bot;
