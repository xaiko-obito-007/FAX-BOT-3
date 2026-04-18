const axios = require("axios");

module.exports = {
  config: {
    name: "spy2",
    aliases: ["whoishe", "whoami"],
    version: "4.0",
    role: 0,
    author: "S AY EM (Max Upgrade)",
    description: "Full possible user info",
    category: "information",
    countDown: 5,
  },

  onStart: async function ({ event, message, api }) {
    try {
      let uid;

      // ✅ Reply > Mention > Self
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else {
        uid = event.senderID;
      }

      const userInfo = await api.getUserInfo(uid);
      const info = userInfo[uid];

      if (!info) {
        return message.reply("❌ User info পাওয়া যায়নি!");
      }

      // ✅ Gender fix
      let gender = "Unknown🤷";
      if (info.gender == 1) gender = "Girl🙋‍♀️";
      else if (info.gender == 2) gender = "Boy🙋‍♂️";

      // ✅ Profile & Images
      const profileLink = `https://facebook.com/${uid}`;
      const avatar = `https://graph.facebook.com/${uid}/picture?height=720&width=720`;

      // ⚠️ Cover try (may fail)
      let coverText = "Not available";
      try {
        const coverRes = await axios.get(
          `https://graph.facebook.com/${uid}?fields=cover`,
          { timeout: 5000 }
        );
        if (coverRes.data.cover && coverRes.data.cover.source) {
          coverText = coverRes.data.cover.source;
        }
      } catch (e) {}

      // ✅ Build message (MAX INFO POSSIBLE)
      const msg = `
╭────[ USER INFO MAX ]
├‣ Name: ${info.name || "N/A"}
├‣ UID: ${uid}
├‣ Gender: ${gender}
├‣ Username: ${info.vanity || "None"}
├‣ Profile: ${profileLink}
├‣ Friend with bot: ${info.isFriend ? "Yes✅" : "No❎"}
├‣ Account Type: ${info.type || "Normal User"}
╰‣ Cover: ${coverText}
`;

      return message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(avatar),
      });

    } catch (err) {
      console.log(err);
      return message.reply("❌ Something went wrong!");
    }
  },
};
