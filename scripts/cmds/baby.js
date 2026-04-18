const axios = require('axios');

const baseApiUrl = async () => {
  const res = await axios.get("https://raw.githubusercontent.com/sayem-dev-xs/sayem-apixs-for-baby/main/baseApiUrl.json");
  return res.data.baby;
};

module.exports.config = {
  name: "baby",
  aliases: ["bby"],
  version: "0.0.1",
  author: "S AY EM",
  countDown: 0,
  role: 0,
  description: "update simsim api by Sayem",
  category: "CHARTING",
  guide: {
    en: "{pn} [anyMessage] OR\nmsg [YourMessage] OR\nlist OR\nlist all"
  }
};

module.exports.onStart = async ({
  api,
  event,
  args,
  usersData
}) => {

  const link = `${await baseApiUrl()}`;
  const sayem = args.join(" ").toLowerCase();

  try {

    if (!args[0]) {

      const ran = ["Bolo baby", "hum bby", "Yes' i am here", "type .help baby"];

      const msg = await api.sendMessage(
        ran[Math.floor(Math.random() * ran.length)],
        event.threadID,
        event.messageID
      );

      global.sayem ??= {};
      global.sayem.bbyReply ??= {};
      global.sayem.bbyReply[msg.messageID] = true;

      return;
    }

    if (args[0] === 'list') {

      if (args[1] === 'all') {

        const data = (await axios.get(`${link}/list-all`)).data;

        const limit = parseInt(args[2]) || 100;

        const teachers = data.teachers?.slice(0, limit) || [];

        const result = await Promise.all(
          teachers.map(async (item) => {

            const uid = item.uid;
            const value = item.teaches;

            const name = await usersData.getName(uid).catch(() => uid);

            return {
              name,
              value
            };

          })
        );

        result.sort((a, b) => b.value - a.value);

        const output = result
          .map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`)
          .join("\n");

        return api.sendMessage(
          `Total Teach = ${data.total_questions || 0}\n👑 | List of Teachers of baby\n${output}`,
          event.threadID,
          event.messageID
        );

      } else {

        const d = (await axios.get(`${link}/list-xs`)).data;

        return api.sendMessage(
          `❇ | Total Teach = ${d.total_questions || "api off"}\n♻ | Total Response = ${d.total_answers || "api off"}`,
          event.threadID,
          event.messageID
        );

      }

    }

    if (args[0] === 'msg') {

      const fuk = sayem.replace("msg ", "");

      const d = (await axios.get(`${link}/baby-xs`, {
        params: { ask: fuk }
      })).data;

      return api.sendMessage(`Message ${fuk} = ${d.respond}`, event.threadID, event.messageID);
    }

    const d = (await axios.get(`${link}/baby-xs`, {
      params: { ask: sayem }
    })).data;

    const msg = await api.sendMessage(d.respond, event.threadID, event.messageID);

    global.sayem ??= {};
    global.sayem.bbyReply ??= {};
    global.sayem.bbyReply[msg.messageID] = true;

  } catch (e) {

    console.log(e);

    api.sendMessage("Check console for error", event.threadID, event.messageID);

  }
};

module.exports.onChat = async ({
  api,
  event
}) => {

  try {

    const botID = api.getCurrentUserID();

    if (event.senderID == botID) return;

    const body = event.body ? event.body.toLowerCase() : "";
    if (!body) return;

    const link = `${await baseApiUrl()}`;

    if (
      event.messageReply &&
      global.sayem &&
      global.sayem.bbyReply &&
      global.sayem.bbyReply[event.messageReply.messageID]
    ) {

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: body }
      })).data;

      const msg = await api.sendMessage(
        a.respond,
        event.threadID,
        event.messageID
      );

      global.sayem.bbyReply[msg.messageID] = true;

      return;
    }

    if (
      body.startsWith("baby") ||
      body.startsWith("bby") ||
      body.startsWith("bot") ||
      body.startsWith("jan") ||
      body.startsWith("babu") ||
      body.startsWith("janu")
    ) {

      const arr = body.replace(/^\S+\s*/, "");

      const randomReplies = [
        "জানু😛, ডেকেছো আমাকে?",
        "Yes 😀, I am here",
        "What's up?😍",
        "ডাকলেই কিন্তু চলে আছি-!😒"
      ];

      if (!arr) {

        const msg = await api.sendMessage(
          randomReplies[Math.floor(Math.random() * randomReplies.length)],
          event.threadID,
          event.messageID
        );

        global.sayem ??= {};
        global.sayem.bbyReply ??= {};
        global.sayem.bbyReply[msg.messageID] = true;

        return;
      }

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: arr }
      })).data;

      const msg = await api.sendMessage(
        a.respond,
        event.threadID,
        event.messageID
      );

      global.sayem.bbyReply[msg.messageID] = true;

    }

  } catch (err) {

    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);

  }

};
