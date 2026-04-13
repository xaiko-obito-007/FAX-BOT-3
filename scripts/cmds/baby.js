const axios = require('axios');

const baseApiUrl = async () => {
  const res = await axios.get("https://raw.githubusercontent.com/sayem-dev-xs/sayem-apixs-for-baby/main/baseApiUrl.json");
  return res.data.baby;
};

module.exports.config = {
  name: "baby",
  aliases: ["bby"],
  version: "4.0.0",
  author: "S AY EM",
  countDown: 0,
  role: 0,
  description: "Full Simsimi Control Panel",
  category: "Baby&chat",
  guide: {
    en: `
{pn} hi
{pn} msg <question>
{pn} ans <answer>
{pn} th <q> - <ans>
{pn} rmv <q> - <ans>
{pn} cleanbad
{pn} list
{pn} listall
`
  }
};

module.exports.onStart = async ({ api, event, args }) => {

  const link = `${await baseApiUrl()}`;
  const text = args.join(" ").toLowerCase();

  try {

    if (!args[0]) {
      const ran = ["Bolo baby", "hum bby", "Yes 😃! I'm here", "type .help baby"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    if (args[0] === "msg") {
      const ask = args.slice(1).join(" ");
      if (!ask) return api.sendMessage("⚠ | Give question", event.threadID);

      const res = (await axios.get(`${link}/msg`, { params: { ask } })).data;
      if (res.err) return api.sendMessage(res.err, event.threadID);

      return api.sendMessage(
        `📜 Question: ${res.question}\n\n💬 Answers:\n- ${res.answers.join("\n- ")}`,
        event.threadID
      );
    }

    if (args[0] === "ans") {
      const ans = args.slice(1).join(" ");
      if (!ans) return api.sendMessage("⚠ - Give answer", event.threadID);

      const res = (await axios.get(`${link}/ans2qs`, { params: { ans } })).data;
      if (res.err) return api.sendMessage(res.err, event.threadID);

      return api.sendMessage(
        `🔁 Answer: ${res.answer}\n\n🧠 Questions:\n- ${res.questions.join("\n- ")}`,
        event.threadID
      );
    }

    if (args[0] === "th") {
      const full = args.slice(1).join(" ");
      if (!full.includes("-")) return api.sendMessage("⚠ Use: teach question - answer", event.threadID);

      const [ask, ans] = full.split("-").map(x => x.trim());

      const res = (await axios.get(`${link}/teach-sayem`, {
        params: { ask, ans }
      })).data;

      if (res.err) return api.sendMessage(res.err, event.threadID);

      return api.sendMessage(`😘 Replied Added Successfully-!!\n \nQs: ${ask}\n\nAns: ${ans}`, event.threadID);
    }

    if (args[0] === "rmv") {
      const full = args.slice(1).join(" ");
      if (!full.includes("-")) return api.sendMessage("⚠ Use: rmv question - answer", event.threadID);

      const [ask, ans] = full.split("-").map(x => x.trim());

      const res = (await axios.get(`${link}/teachrmv`, {
        params: { ask, ans }
      })).data;

      if (res.err) return api.sendMessage(res.err, event.threadID);

      return api.sendMessage(
        `🗑 Removed!\nQ: ${res.question}\nRemaining:\n- ${res.remainingAnswers.join("\n- ")}`,
        event.threadID
      );
    }

    if (args[0] === "cleanbad") {

      const res = (await axios.get(`${link}/cleanbad`)).data;

      return api.sendMessage(
        `🧹 Clean Done!\nRemoved: ${res.removed_answers}`,
        event.threadID
      );
    }

    if (args[0] === "list") {

      const res = (await axios.get(`${link}/list-xs`)).data;

      let msg = `📊 Total Q: ${res.total_questions}\n💬 Total Ans: ${res.total_answers}\n\n`;

      res.data.slice(0, 20).forEach(i => {
        msg += `${i.id}. ${i.ask} (${i.answers})\n`;
      });

      return api.sendMessage(msg, event.threadID);
    }

    if (args[0] === "listall") {

      const res = await axios.get(`${link}/list-all`);

      return api.sendMessage(res.data, event.threadID);
    }

    const d = (await axios.get(`${link}/baby-xs`, {
      params: { ask: text }
    })).data;

    return api.sendMessage(d.respond, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "baby",
        type: "reply"
      });
    }, event.messageID);

  } catch (e) {
    console.log(e);
    api.sendMessage("API OFF ❌", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event }) => {

  try {
    const botID = api.getCurrentUserID();
    if (event.senderID == botID) return;

    const body = event.body?.toLowerCase();
    if (!body) return;

    const link = `${await baseApiUrl()}`;

    const a = (await axios.get(`${link}/baby-xs`, {
      params: { ask: body }
    })).data;

    return api.sendMessage(a.respond, event.threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "baby",
        type: "reply"
      });
    }, event.messageID);

  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID);
  }
};

module.exports.onChat = async ({ api, event }) => {

  try {
    const body = event.body?.toLowerCase();
    if (!body) return;

    const botID = api.getCurrentUserID();
    if (event.senderID == botID) return;

    if (
      body === "baby" ||
      body === "bby" ||
      body.startsWith("baby ") ||
      body.startsWith("bby ")
    ) {

      const arr = body.replace(/^\S+\s*/, "");

      const randomReplies = [
        "জানু😛 ডেকেছো?",
        "Yes 😀 I am here",
        "Age boll tor lang koita-??🙂",
        "ডাকলেই চলে আসি 😘"
      ];

      if (!arr) {
        return api.sendMessage(
          randomReplies[Math.floor(Math.random() * randomReplies.length)],
          event.threadID,
          (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "baby",
              type: "reply"
            });
          },
          event.messageID
        );
      }

      const link = `${await baseApiUrl()}`;

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: arr }
      })).data;

      return api.sendMessage(
        a.respond,
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "baby",
            type: "reply"
          });
        },
        event.messageID
      );
    }

  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID);
  }
};