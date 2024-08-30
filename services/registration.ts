import { Context } from "telegraf";
import db from "../db.js";
import { players } from "../models.js";
import { and, eq } from "drizzle-orm";

const GREETINGS: string[] = [
  "Здарова, заебал! Зарегался, значит, ну всё, не расслабляйся!",
  "Опа-на, новый в наших рядах! Готовься, ебнуть может в любой момент",
  "Опа, новый, бля! Теперь ты наш!",
  "Тёы точно хочешь быть в этом списке? Напиши 'Да', если согласен, 'Нет', если передумал",
  "Зёдарова, ебать! Теперь ты в нашей банде!",
  "Эё, красавчик, теперь ты с нами!",
  "Опа, новый хуй! Теперь ты наш!",
  "Не ты ли случаем итальянец? В любом случае ты попался, теперь ты в списке зарегистрированных!",
  "Сомнительно, но окээээй. Ты в команде!",
  "К тебе вопросов нет, просто лучший, спасибо за регистрацию",
  "Ууу, лучше бы ты не регался, буду попускать тебя чаще всего!",
  "Кто тебя сюда пустил? в дурку его! Ты в команде!",
  "Оп, оп, опа нихуя, оп, оп, иди сюда на! Приветствуем тебя всей братвой в нашей команде!",
  "Среди нас появился петух! Поприветствуем!",
  "Добро пожаловать, бля, теперь ты с нами!",
  "Ну всё, заебись, ты теперь в списке!",
  "Зарегался? Теперь держись, хуй знает что будет дальше!",
  "Эй, ты теперь в наших рядах, не расслабляйся!",
  "Ну что, новый, теперь ты один из нас!",
  "Теперь ты с нами, ёпта, никаких поблажек!",
  "Зарегистрирован? Ну всё, пиздец тебе!",
  "Приветствуем тебя в нашей тусовке, теперь ты наш!",
  "Ты в списке, так что не вздумай соскочить!",
  "Поздравляю, ты теперь в нашей банде, хули!",
  "Теперь ты один из нас, не ссы, выживешь!",
  "Зарегался? Отлично, теперь готовься к приключениям!",
  "Ну всё, ты в нашей компании, добро пожаловать!",
  "Опа, попался! Теперь ты один из нас!",
  "Ты теперь в нашем списке, надеюсь, готов к этому!",
  "Ну что, братан, теперь ты в нашей команде!",
  "Зарегался? Хуй теперь от нас уйдешь!",
  "Эй, ты в списке, теперь в нашей движухе!",
  "Теперь ты с нами, хули, держись крепче!",
  "Добро пожаловать, новый, готовься к веселухе!",
];

const REGISTERED: string[] = [
  "Ты уже зарегистрирован!",
  "Хули тыкаемся то? зарегистрирован уже",
  "Пиздец, зарегистрирован и снова пытается",
  "Пиздец, долго ещё будешь пытаться снова зарегистрироваться?",
  "Зарегистрирован, ебать, хватит тыкать!",
  "Ты чё, бля, регаться по два раза вздумал?",
  "Зарегистрирован как положено, больше не надо!",
  "Слышь, ты уже в списках, не напрягай меня.",
  "Ну куда ж ты, зарегистрирован уже, отстань!",
  "Ещё раз нажмешь — опять зарегистрирован будешь.",
  "Хватит дурью маяться, ты уже в системе.",
  "Не первый раз вижу, регаться второй раз не надо.",
  "Чё, забыл? Уже зарегался.",
  "Всё, записан, успокойся.",
  "Ты уже зарегался, можешь расслабиться.",
  "Опять ты? Уже в базе, хорош.",
  "Сколько раз говорить? Зарегистрирован ты.",
  "Опять? Да сколько можно? Ты уже с нами.",
  "Ну серьёзно, ты же уже в списке.",
  "Хватит повторяться, ты зарегался ещё раньше.",
  "Зарегистрирован по полной программе, больше не надо.",
  "Ты в списках, ну чё ты снова лезешь?",
  "Ещё раз повторю — зарегистрирован.",
  "Сколько можно, ты уже в базе данных!",
  "Ты уже в базе, блядь, хватит тыкать!",
  "Зарегался, ебать, хватит долбить эту кнопку.",
  "Ты уже зарегистрирован, сука, чего тебе еще надо?",
  "Да ты, бля, уже давно у нас, хватит долбить!",
  "Зарегистрирован, пиздец, хватит тупить.",
  "Ты чё, долбоёб? Уже зареган!",
  "Ты уже, блядь, в системе, что не так?",
  "Ебать, ты уже с нами, хорош тыкать.",
  "Ну всё, пиздец, ты зарегался, отъебись!",
  "Ты уже в базе, нахуй ещё раз тыкать?",
  "Сука, ты уже зареган, хватит доебываться.",
  "Ты чё, охуел? Уже в списке!",
  "Ты в базе, бля, не тупи.",
  "Да ты, блядь, уже у нас, расслабься!",
  "Ебать, ты уже в списках, отъебись!",
  "Ты уже зареган, ебать, сколько раз повторять?",
  "Слышь, ты в базе, завязывай с этим.",
  "Ты уже с нами, ебать, успокойся.",
  "Да ты, блядь, зареган, чего ещё надо?",
  "Сука, ты уже в списке, хорош тыкать.",
  "Я вахуе с тебя конечно, успокойся!",
];

class RegistrationService {
  constructor() {}

  public async execute(ctx: Context): Promise<void> {
    if (ctx.from && ctx.chat && ctx.from.username) {
      const user = await db
        .select()
        .from(players)
        .where(
          and(
            eq(players.user_id, ctx.from.id),
            eq(players.chat_id, ctx.chat.id),
          ),
        );

      if (user.length) {
        const message = await this.getNextMessage(REGISTERED);

        await ctx.reply(message, {
          // @ts-ignore
          reply_to_message_id: ctx.message.message_id,
        });
      } else {
        await db.insert(players).values({
          user_id: ctx.from.id,
          username: ctx.from.username,
          chat_id: ctx.chat.id,
        });

        const message = await this.getNextMessage(GREETINGS);
        await ctx.reply(message, {
          // @ts-ignore
          reply_to_message_id: ctx.message.message_id,
        });
      }
    }
  }

  private async getNextMessage(messages: string[]): Promise<string> {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }
}

export default RegistrationService;
