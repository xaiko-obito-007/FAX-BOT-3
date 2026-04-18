const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "rio",
    aliases: ["forger"],
    version: "3.0",
    author: "MR-JISAN ⚡",
    cooldowns: 5,
    role: 0,
    shortDescription: "Chat with Anya Forger (AI Voice)",
    longDescription: "Talk with Anya Forger — she replies in Japanese with a cute AI voice 🎙️",
    category: "fun",
    guide: "{p}anya [your text]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, senderID, messageID } = event;
    const cachePath = path.join(__dirname, "cache");
    const audioFile = path.join(cachePath, `anya_${Date.now()}.mp3`);

    try {
      // If no message from user
      if (!args[0]) {
        const userInfo = await api.getUserInfo(senderID);
        const userName = userInfo[senderID]?.firstName || "senpai";
        return api.sendMessage(`🌸 Konichiwa ${userName}! I'm Anya Forger. Let's talk! 💬`, threadID, messageID);
      }

      const userText = args.join(" ");
      api.sendMessage("🧠 Thinking... please wait!", threadID, messageID);

      // Step 1: Translate text (auto → Japanese)
      const translateRes = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&q=${encodeURIComponent(userText)}`
      );
      const japaneseText = translateRes.data?.[0]?.[0]?.[0] || userText;

      // Step 2: Generate voice using VoiceVox
      const voiceRes = await axios.get(
        `https://api.tts.quest/v3/voicevox/synthesis?text=${encodeURIComponent(japaneseText)}&speaker=3`
      );

      const audioURL = voiceRes.data?.mp3StreamingUrl;
      if (!audioURL) throw new Error("Voice generation failed.");

      // Step 3: Download voice file
      const { data: audioData } = await axios.get(audioURL, { responseType: "arraybuffer" });
      await fs.ensureDir(cachePath);
      await fs.writeFile(audioFile, audioData);

      // Step 4: Send reply
      const msg = {
        body: `🎀 ${japaneseText}`,
        attachment: fs.createReadStream(audioFile)
      };
      await api.sendMessage(msg, threadID, () => fs.unlinkSync(audioFile));

    } catch (err) {
      console.error("❌ Anya Error:", err);
      api.sendMessage("⚠️ Oops! Something went wrong, please try again later.", threadID, messageID);
    }
  }
};
