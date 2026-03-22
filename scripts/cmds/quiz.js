const axios = require("axios");

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "6.5",
    author: "S AY EM",
    countDown: 5,
    role: 0,
    shortDescription: "Timer Quiz",
    category: "game"
  },

  onStart: async function ({ message, event, args, api }) {
    try {
      let time = 25;

      const res = await axios.get("https://sayem-premium-quiz-apixs.onrender.com/quiz");
      const q = res.data;

      const name = await api.getUserInfo(event.senderID);
      const userName = name[event.senderID].name;

      let msg =
`╭──✦ ${q.text}
├‣ 𝗔) ${q.options.a}
├‣ 𝗕) ${q.options.b}
├‣ 𝗖) ${q.options.c}
├‣ 𝗗) ${q.options.d}
╰──────────────────‣
Reply to this message with your answer (a/b/c/d)
⏳ Time: ${time}s
👤 Player: ${userName}`;

      message.reply(msg, (err, info) => {

        const timer = setTimeout(() => {
          if (global.GoatBot.onReply.has(info.messageID)) {
            global.GoatBot.onReply.delete(info.messageID);

            api.unsendMessage(info.messageID);

            message.reply("😛 | Time's up...");
          }
        }, time * 1000);

        global.GoatBot.onReply.set(info.messageID, {
          commandName: "quiz",
          answer: q.answer,
          author: event.senderID,
          messageID: info.messageID,
          timer: timer
        });

      });

    } catch (err) {
      message.reply("❌ Failed to fetch quiz!");
    }
  },

  onReply: async function ({ event, message, Reply, api }) {

    if (event.senderID !== Reply.author) return;

    const ans = event.body.toLowerCase();

    if (!["a", "b", "c", "d"].includes(ans)) return;

    api.unsendMessage(Reply.messageID);

    if (Reply.timer) clearTimeout(Reply.timer);

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    if (ans === Reply.answer) {
      message.reply("😘 | Correct Answer...");
    } else {
      message.reply("🙂 | Wrong...");
    }
  }
};
