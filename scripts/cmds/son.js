const fs = require("fs");
const path = __dirname + "/cache/son.json";

// Author Lock
const ORIGINAL_AUTHOR = "DJ RAKIB BHAI";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

module.exports.config = {
  name: "son",
  version: "1.0",
  author: "DJ RAKIB BHAI",
  category: "automation",
  role: 0
};

// ==================== AUTHOR LOCK CHECK ====================
if (module.exports.config.author !== ORIGINAL_AUTHOR) {
  console.log(`❌ [SON COMMAND] Author name changed! Command has been locked.`);
  
  // Disable both functions if author is modified
  module.exports.onStart = async function () {
    return;
  };
  
  module.exports.onChat = async function () {
    return;
  };
  
  module.exports.config.author = "Locked Command";
}
// ===========================================================

module.exports.onStart = async function ({ api, event, args }) {

  const permission = global.GoatBot.config.adminBot || [];

  if (!permission.includes(event.senderID)) {
    return api.sendMessage("❌ | Only bot admin can use this command!", event.threadID, event.messageID);
  }

  let data = JSON.parse(fs.readFileSync(path));

  if (args[0] == "off") {
    delete data[event.threadID];
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Son system বন্ধ করা হয়েছে!", event.threadID);
  }

  if (args[0] == "on") {

    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("❌ একজনকে মেনশন করুন!", event.threadID);

    data[event.threadID] = {
      uid: mention,
      index: 0
    };

    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    return api.sendMessage(`✅ Son system চালু হয়েছে ${event.mentions[mention]} এর জন্য`, event.threadID);
  }

  return api.sendMessage("ব্যবহার:\nson on @user\nson off", event.threadID);
};

module.exports.onChat = async function ({ api, event }) {

  if (!event.body) return;

  let data = JSON.parse(fs.readFileSync(path));

  if (!data[event.threadID]) return;

  const target = data[event.threadID].uid;

  if (event.senderID != target) return;

  const insults = [
    "খাংকির পোলা, তোর মার ভোদা তে গাধার মাল ফালাবো! 😈",
    "আমার জাদিদ বস তোর মা কে চুদে পল্টি মারবো! 😡",
    "তোর মার গুদে ফুল ট্যাবলেট পুশ করবো! 🤡",
    "তোর মার ভোদায় গাধার মতো মাল ফালিয়ে দেবো! জাদিদ বস🔥",
    "তোর মাকে গাধার মতো চুদে বলবো এটা কার মাল? 😂",
    "চুদা খাওয়া তোর মার! 😛",
    "তোর মার গুদে ইনপুট দিয়ে আউটপুট নেবো! 💀"
  ];

  let index = data[event.threadID].index;

  api.sendMessage(
    insults[index % insults.length],
    event.threadID,
    event.messageID
  );

  data[event.threadID].index++;

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};
