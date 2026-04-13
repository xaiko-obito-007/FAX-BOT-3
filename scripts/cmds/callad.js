const fs = require("fs");
const path = __dirname + "/cache/callMap.json";

module.exports = {
  config: {
    name: "callad",
    aliases: ["call"],
    version: "2.0",
    author: "S AY EM",
    countDown: 5,
    role: 0,
    shortDescription: "Call admin (2-way)",
    longDescription: "User message goes to admin & admin reply goes back to user",
    category: "admin",
    guide: "{p}call <message>"
  },

  onStart: async function ({ api, event, args, usersData }) {
    const adminUID = "61579498756706";

    const { senderID, threadID, messageID } = event;
    const message = args.join(" ");

    if (!message) {
      return api.sendMessage("⚠️ | Message likho\nExample: call Hello admin", threadID, messageID);
    }

    // file create if not exist
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

    const data = JSON.parse(fs.readFileSync(path));

    try {
      let name = "User";
      try {
        const user = await usersData.get(senderID);
        name = user.name;
      } catch (e) {}

      const msg = `📞 CALL REQUEST

👤 Name: ${name}
🆔 UID: ${senderID}

💬 Message:
${message}

↩️ Reply this message to send back`;

      // admin inbox এ send
      api.sendMessage(msg, adminUID, (err, info) => {
        if (!err) {
          // messageID map save
          data[info.messageID] = senderID;
          fs.writeFileSync(path, JSON.stringify(data, null, 2));
        }
      });

      api.sendMessage("✅ | Message admin er inbox e chole gese.", threadID, messageID);

    } catch (err) {
      console.log(err);
      api.sendMessage("❌ | Message send fail hoise.", threadID, messageID);
    }
  },

  onReply: async function ({ api, event }) {
    const adminUID = "61579498756706";

    const { senderID, messageReply, body } = event;

    // শুধু admin reply handle করবে
    if (senderID != adminUID) return;

    if (!fs.existsSync(path)) return;

    const data = JSON.parse(fs.readFileSync(path));

    const userID = data[messageReply.messageID];

    if (!userID) return;

    try {
      const replyMsg = `📩 ADMIN REPLY:

${body}`;

      api.sendMessage(replyMsg, userID);

    } catch (err) {
      console.log(err);
    }
  }
};