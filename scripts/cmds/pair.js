const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pair",
    aliases: ["pr"],
    author: "@Ariyan",
    category: "TOOLS"
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const senderData = await usersData.get(event.senderID);
      const senderName = senderData?.name || "User";

      const threadInfo = await api.getThreadInfo(event.threadID);
      const users = threadInfo.userInfo || [];

      const me = users.find(u => u.id == event.senderID);
      if (!me?.gender) {
        return api.sendMessage("⚠️ Could not determine your gender.", event.threadID, event.messageID);
      }

      let candidates = [];
      if (me.gender === "MALE") {
        candidates = users.filter(u => u.gender === "FEMALE" && u.id != event.senderID);
      } else if (me.gender === "FEMALE") {
        candidates = users.filter(u => u.gender === "MALE" && u.id != event.senderID);
      } else {
        return api.sendMessage("⚠️ Your gender is undefined. Cannot find a match.", event.threadID, event.messageID);
      }

      if (!candidates.length) {
        return api.sendMessage("❌ No suitable match found in the group.", event.threadID, event.messageID);
      }

      const match = candidates[Math.floor(Math.random() * candidates.length)];
      const matchName = match.name || "Unknown";

      const canvas = createCanvas(800, 400);
      const ctx = canvas.getContext("2d");

      const [bg, avatar1, avatar2] = await Promise.all([
        loadImage("https://files.catbox.moe/612lh1.jpg"),
        loadImage(`https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`),
        loadImage(`https://graph.facebook.com/${match.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
      ]);

      ctx.drawImage(bg, 0, 0, 800, 400);
      ctx.drawImage(avatar1, 385, 40, 170, 170);
      ctx.drawImage(avatar2, 587, 190, 180, 170);

      const filePath = path.join(__dirname, "pair_output.png");
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filePath, buffer);

      const love = Math.floor(Math.random() * 31) + 70;

      api.sendMessage(
        {
          body: `ㅤ 𝗽𝗲𝗿𝗳𝗲𝗰𝘁 𝗣𝗮𝗶𝗿? 𝗢𝗯𝘃𝗶𝗼𝘂𝘀𝗹𝘆. 
・${senderName} ⁽𝅄 🪕
・${matchName} 🦌 𝅄 ₎
𝔒𝗍𝗁𝖾𝗋𝗌 𝗐𝖺𝗍𝖼𝗁𝗂𝗇𝗀, 𝓦𝖾 𝗐𝗂𝗇𝗇𝗂𝗇𝗀

ㅤㅤ 𝔏𝗈𝗏𝗲 𝖲𝗒𝗇𝗰: ${love}℅`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

    } catch (e) {
      api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
    }
  }
};