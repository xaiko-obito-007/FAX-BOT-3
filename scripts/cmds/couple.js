module.exports = {
  config: {
    name: "couple",
    version: "1.0",
    author: "Not Author",
    countDown: 5,
    role: 0,
    shortDescription: "Couple leaderboard system",
    longDescription: "",
    category: "fun",
    guide: "{pn} [@mention | top | auto | help]"
  },

  onStart: async function ({ message, event, api, args, threadsData }) {

    if (!args[0] || args[0] === "help") {
      return message.reply(
`💑 COUPLE SYSTEM HELP 💑

couple @mention  → Add love score
couple top       → Show leaderboard
couple auto      → Detect your top partner

***_Powered by Sourav Ahmed ⚡_***`
      );
    }

    let coupleData = await threadsData.get(event.threadID, "data.coupleData") || {};

    // =========================
    // ADD LOVE SCORE
    // =========================
    if (event.mentions && Object.keys(event.mentions).length > 0) {

      const user1 = event.senderID;
      const user2 = Object.keys(event.mentions)[0];

      const key = [user1, user2].sort().join("_");

      const loveScore = Math.floor(Math.random() * 101);

      coupleData[key] = {
        users: [user1, user2],
        score: loveScore
      };

      await threadsData.set(event.threadID, coupleData, "data.coupleData");

      const name1 = (await api.getUserInfo(user1))[user1].name;
      const name2 = event.mentions[user2];

      return message.reply(
`💘 New Couple Registered 💘

${name1} ❤️ ${name2}
Love Score: ${loveScore}% 🔥

${loveScore > 80 ? "🔥 Power Couple Alert!" :
loveScore > 50 ? "😍 Cute Couple vibes!" :
"🙂 Friendship level detected!"}

***_Powered by Sourav Ahmed ⚡_***`
      );
    }

    // =========================
    // LEADERBOARD
    // =========================
    if (args[0] === "top") {

      const sorted = Object.values(coupleData)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (!sorted.length)
        return message.reply("😒 এখনো কোনো couple নাই!");

      let text = "👑 TOP COUPLE LEADERBOARD 👑\n\n";

      for (let i = 0; i < sorted.length; i++) {
        const names = await api.getUserInfo(sorted[i].users[0]);
        const name1 = names[sorted[i].users[0]].name;
        const name2 = (await api.getUserInfo(sorted[i].users[1]))[sorted[i].users[1]].name;

        text += `${i + 1}. ${name1} ❤️ ${name2} — ${sorted[i].score}% 🔥\n`;
      }

      return message.reply(
`${text}

***_Powered by Sourav Ahmed ⚡_***`
      );
    }

    // =========================
    // AUTO DETECTOR
    // =========================
    if (args[0] === "auto") {

      const userId = event.senderID;

      const userCouples = Object.values(coupleData)
        .filter(c => c.users.includes(userId))
        .sort((a, b) => b.score - a.score);

      if (!userCouples.length)
        return message.reply("😅 তোর কোনো registered couple নাই!");

      const best = userCouples[0];
      const partner = best.users.find(id => id !== userId);

      const name1 = (await api.getUserInfo(userId))[userId].name;
      const name2 = (await api.getUserInfo(partner))[partner].name;

      return message.reply(
`💑 AUTO COUPLE DETECTOR 💑

Best Match Found 🔍✨

${name1} ❤️ ${name2}
Love Score: ${best.score}% 💕

${best.score > 80 ? "🔥 Destiny Connection!" :
best.score > 50 ? "😍 Strong bond!" :
"🙂 Casual vibes!"}

***_Powered by Sourav Ahmed ⚡_***`
      );
    }

    return message.reply("❌ Invalid option! Type couple help");
  }
};