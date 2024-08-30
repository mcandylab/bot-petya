import { config } from "dotenv";
config();

import axios from "axios";
// @ts-ignore
import md5 from "md5";
import { Context } from "telegraf";

class AnecdoticaService {
  private url: string;

  constructor() {
    const pid = process.env.ANECDOTICA_PID;
    const key = process.env.ANECDOTICA_KEY;

    let query =
      "pid=" + pid + "&method=getRandItem&uts=" + Math.trunc(Date.now() / 1000);
    let signature = md5(query + key);
    this.url = "http://anecdotica.ru/api?" + query + "&hash=" + signature;
  }

  public async execute(ctx: Context) {
    axios.get(this.url).then(async ({ data }) => {
      await ctx.reply(data.item.text, { parse_mode: "HTML" });
    });
  }
}

export default AnecdoticaService;
