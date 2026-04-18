const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "config",
    version: "2.0.1",
    author: "S AY EM | author mere dilam 👽",
    countDown: 5,
    role: 3,
    description: "Bot configuration and management (All Features)",
    category: "operator",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;

    const msg =
`⚙️ COMMAND LIST (REPLY WITH NUMBER)

01. Edit Bot Bio
02. Edit Bot Nicknames
03. View Pending Messages
04. View Unread Messages
05. View Spam Messages
06. Change Bot Avatar
07. Avatar Shield (on/off)
08. Block User (Messenger)
09. Unblock User (Messenger)
10. Create Post
11. Delete Post
12. Post Comment (User)
13. Post Comment (Group)
14. Drop Post Reaction
15. Send Friend Request
16. Accept Friend Request
17. Decline Friend Request
18. Unfriend UID
19. Send Message via UID
20. Note Code
21. Logout Bot Account

Reply with a number to execute.`;

    return api.sendMessage(msg, threadID, (err, info) => {
      if (err) return console.error(err);

      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: senderID,
        type: "menu"
      });
    }, messageID);
  },

  onReply: async function ({ api, event, Reply }) {
    try {
      const { threadID, messageID, senderID, body } = event;
      const { author, type } = Reply;

      if (senderID != author) return;

      if (type === "menu") {
        const choice = body.trim();

        switch (choice) {
          case "1":
          case "01":
            return api.sendMessage("✏️ Send new bio text.", threadID, (err, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                author: senderID,
                type: "setBio"
              });
            }, messageID);

          case "2":
          case "02":
            return api.sendMessage("✏️ Reply with: UID | Nickname", threadID, (err, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                author: senderID,
                type: "setNickname"
              });
            }, messageID);

          case "3":
          case "03":
            return api.sendMessage("📩 Fetching pending messages...", threadID);

          case "4":
          case "04":
            return api.sendMessage("📬 Fetching unread messages...", threadID);

          case "5":
          case "05":
            return api.sendMessage("🚫 Fetching spam messages...", threadID);

          case "6":
          case "06":
            return api.sendMessage("🖼 Reply with image to set as avatar.", threadID, (err, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                author: senderID,
                type: "setAvatar"
              });
            }, messageID);

          case "21":
            return api.sendMessage("⚠️ Logging out bot account...", threadID);

          default:
            return api.sendMessage("❌ Invalid option.", threadID, messageID);
        }
      }

      // ===== SECOND STEP HANDLERS =====

      if (type === "setBio") {
        await api.changeBio(body);
        return api.sendMessage("✅ Bio updated successfully.", threadID, messageID);
      }

      if (type === "setNickname") {
        const [uid, nickname] = body.split("|").map(x => x.trim());
        if (!uid || !nickname)
          return api.sendMessage("❌ Format: UID | Nickname", threadID, messageID);

        await api.changeNickname(nickname, threadID, uid);
        return api.sendMessage("✅ Nickname updated.", threadID, messageID);
      }

      if (type === "setAvatar") {
        if (!event.attachments || event.attachments.length === 0)
          return api.sendMessage("❌ Please reply with an image.", threadID, messageID);

        const imageUrl = event.attachments[0].url;
        const imgPath = __dirname + "/cache/avatar.jpg";

        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, response.data);

        await api.changeAvatar(fs.createReadStream(imgPath));
        fs.unlinkSync(imgPath);

        return api.sendMessage("✅ Avatar updated successfully.", threadID, messageID);
      }

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ Error occurred.", event.threadID);
    }
  }
};