import Bot from "./telegram.js";
import { config } from "dotenv";
config();

const bot = new Bot();
bot.init();
bot.run();
