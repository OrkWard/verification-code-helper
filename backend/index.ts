import TelegramBot from "node-telegram-bot-api";
import http from "node:http";
import { createClient } from "redis";
import C from "./config.js";

const bot = new TelegramBot(C.BOT_TOKEN, { polling: true });
const REDIS_KEY = "last_netease_veri_code";

const redis = await createClient({ url: C.REDIS_URL })
  .on("error", (err) => console.error(err))
  .connect();

bot.on("channel_post", async (msg) => {
  console.log("[Info] Message get");
  const text = msg.text;

  if (text) {
    const regex = /网易.*(\d{6})/;
    if (regex.test(text)) {
      const code = text.match(regex)![1]!;

      await redis.set(
        REDIS_KEY,
        JSON.stringify({ code, mtime: new Date().getTime() }),
      );

      console.log("写入数据库成功");
    }
  }
});

const lastErrorTime: number[] = [];

bot.on("polling_error", (err) => {
  console.error("polling_error: ", err);
  const now = new Date().getTime();
  if (lastErrorTime[0] && now - lastErrorTime[0] < 10000) {
    lastErrorTime.push(now);
    if (lastErrorTime.length >= 3) {
      process.exit(1);
    }
  } else {
    lastErrorTime.shift();
  }
});

console.log("Telegram bot 已启动");

const httpServer = http.createServer(async (req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  const code = await redis
    .get(REDIS_KEY)
    .then((v) =>
      v ? (JSON.parse(v) as { code: string; mtime: string }) : undefined,
    );
  res.end(
    JSON.stringify({
      code: code?.code ?? "暂时没有收到！",
      mtime: code?.mtime
        ? new Date(code.mtime).toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
          })
        : "暂时没有收到！",
    }),
  );
});

httpServer.listen(8000, "::");
console.log("Http server 已启动");
