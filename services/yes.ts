import { Context } from "telegraf";
import db from "../db.js";
import { yes } from "../models.js";
import { and, eq } from "drizzle-orm";

class YesService {
  public async execute(ctx: Context, message: string): Promise<void> {
    if (ctx.from && ctx.chat && ctx.from.username) {
      const type = message;
      const user = await db
        .select()
        .from(yes)
        .where(
          and(
            eq(yes.user_id, ctx.from.id),
            eq(yes.chat_id, ctx.chat.id),
            eq(yes.message, type),
          ),
        );

      if (user.length) {
        const count = user[0].count + 1;
        message = message + count + ":0";

        await db
          .update(yes)
          .set({ count })
          .where(
            and(
              eq(yes.user_id, ctx.from.id),
              eq(yes.chat_id, ctx.chat.id),
              eq(yes.message, type),
            ),
          );
      } else {
        await db.insert(yes).values({
          count: 1,
          message: type,
          user_id: ctx.from.id,
          username: ctx.from.username,
          chat_id: ctx.chat.id,
        });

        message = message + "1:0";
      }

      await ctx.reply("@" + ctx.from.username + " " + message);
    }
  }
}

export default YesService;
