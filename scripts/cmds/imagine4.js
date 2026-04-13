const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const http = require("http");
const https = require("https");

const axiosInstance = axios.create({
  timeout: 15000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxContentLength: Infinity,
  maxBodyLength: Infinity
});

module.exports = {
  config: {
    name: "imagen4",
    version: "5.3",
    author: "S AY EM",
    countDown: 10,
    role: 0,
    shortDescription: "Generate AI Image",
    category: "ai",
    guide: {
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    try {
      const startTime = Date.now();

      const prompt = args.join(" ");
      if (!prompt) return message.reply("⚠ Enter prompt!");

      const wait = await message.reply("😘 baby please wait...");

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const apiUrl = `https://sayem-online-project.vercel.app/api/ai/imagen4?prompt=${encodeURIComponent(prompt)}`;

      const res = await axiosInstance({
        url: apiUrl,
        method: "GET",
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Connection": "keep-alive"
        }
      });

      api.setMessageReaction("⚡", event.messageID, () => {}, true);

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(cacheDir, `img_${Date.now()}.png`);
      const writer = fs.createWriteStream(filePath);

      res.data.pipe(writer);

      writer.on("finish", async () => {
        const endTime = Date.now();
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

        await message.reply({
          body: `✅ Done!\n📝 ${prompt}\n⏱️ Time: ${timeTaken}s`,
          attachment: fs.createReadStream(filePath)
        });

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        fs.unlink(filePath).catch(() => {});
        api.unsendMessage(wait.messageID);
      });

      writer.on("error", async () => {
        message.reply("❌ Download failed!");
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        api.unsendMessage(wait.messageID);
      });

    } catch (err) {
      console.error(err);
      message.reply("❌ Error occurred or API too slow!");
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};