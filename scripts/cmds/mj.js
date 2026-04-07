const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "mj",
    version: "1.0",
    author: "Sayem",
    countDown: 20,
    role: 0,
    shortDescription: "Generate AI images (MidJourney Style)",
    longDescription: "Generate 4 AI images using MidJourney API",
    category: "ai",
    guide: "{pn} <prompt>"
  },

  onStart: async function ({ message, args, event }) {
    try {
      const prompt = args.join(" ");

      if (!prompt) {
        return message.reply("❌ Please provide a prompt.\nExample:\nmidjanuary anime boy with sword");
      }

      const waitMsg = await message.reply("⏳ Generating your images...");

      const apiUrl = `https://sayem-online-project.vercel.app/api/ai/midjourney?prompt=${encodeURIComponent(prompt)}`;

      const res = await axios.get(apiUrl);

      if (!res.data || !res.data.images) {
        return message.reply("❌ Failed to generate images!");
      }

      const images = res.data.images;

      let imgPaths = [];

      for (let i = 0; i < images.length && i < 4; i++) {
        const imgUrl = images[i];
        const imgPath = path.join(__dirname, `cache_midjanuary_${i}.jpg`);

        const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer" });

        fs.writeFileSync(imgPath, Buffer.from(imgRes.data));
        imgPaths.push(imgPath);
      }

      await message.reply({
        body: `✅ Generated Images for:\n"${prompt}"`,
        attachment: imgPaths.map(p => fs.createReadStream(p))
      });

      // Cleanup
      imgPaths.forEach(p => fs.unlinkSync(p));

    } catch (error) {
      console.error(error);
      message.reply("❌ Error while generating images!");
    }
  }
};