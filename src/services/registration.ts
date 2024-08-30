import redis from "../redis.js";

const GREETINGS: string[] = [
  "здарова, заебал! Зарегался, значит, ну всё, не расслабляйся!",
  "опа-на, новый в наших рядах! Готовься, ебнуть может в любой момент",
  "опа, новый, бля! Теперь ты наш!",
  "ты точно хочешь быть в этом списке? Напиши 'Да', если согласен, 'Нет', если передумал",
  "здарова, ебать! Теперь ты в нашей банде!",
  "э, красавчик, теперь ты с нами!",
  "опа, новый член! Теперь ты наш!",
  "не ты ли случаем итальянец? В любом случае ты попался, теперь ты в списке зарегистрированных!",
  "сомнительно, но окээээй. Ты в команде!",
  "к тебе вопросов нет, просто лучший, спасибо за регистрацию",
  "ууу, лучше бы ты не регался, буду попускать тебя чаще всего!",
  "кто тебя сюда пустил? в дурку его! Ты в команде!",
];

const redisKey = "greeting_index";

class RegistrationService {
  constructor() {}

  public async execute(): Promise<string> {
    return await this.getNextGreeting();
  }

  private async getNextGreeting(): Promise<string> {
    let index = await redis.get<number>(redisKey);

    if (index === null) {
      index = 0;
    }

    const greeting = GREETINGS[index];

    const nextIndex = (index + 1) % GREETINGS.length;

    await redis.set(redisKey, nextIndex);

    return greeting;
  }
}

export default RegistrationService;
