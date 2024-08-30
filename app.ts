import { config } from "dotenv";
config();

import Bot from "./telegram.js";

const bot = new Bot();
bot.init().then(() => {
  bot.run();
});
