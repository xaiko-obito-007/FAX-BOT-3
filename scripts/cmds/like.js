const axios = require('axios')
const { getTime } = global.utils

const xhours = 12
const xms = xhours * 60 * 60 * 1000

const auth_thread = "921210833794737"

const x_api = (uid) => `https://dev-rasin-api.onrender.com/like?uid=${encodeURIComponent(uid)}`
const y_api = (uid) => `https://noobs-api.top/dipto/ff-like?uid=${encodeURIComponent(uid)}`

const NOTICE =
  `⚠️ 𝐈𝐦𝐩𝐨𝐫𝐭𝐚𝐧𝐭 𝐍𝐨𝐭𝐢𝐜𝐞\n\n` +
  `━━━━━━━━━━━━━━━━━━━\n` +
  `1️⃣ This command is now a paid feature\n` +
  `2️⃣ Free likes are no longer available\n` +
  `3️⃣ Only authorized members can use this command\n\n` +
  `Contact the bot admin to get access 🫡\n\n\nSorry Everyone 🥲`

module.exports = {
  config: {
    name: 'like',
    author: 'Rasin',
    cooldown: 2,
    role: 0,
    prefix: false,
    description: 'Send Free Fire likes (Paid)',
    category: 'free fire',
    usage: [
      'like <uid>  - Send likes'
    ].join('\n')
  },

  onStart: async function ({ args, message, event, usersData }) {
    const subCmd = args[0]?.toLowerCase();
    const threadID = String(event.threadID);

    const isAdmin = () => {
      const adminList = global.GoatBot?.config?.adminBot || [];
      return adminList.includes(event.senderID);
    };

    const isAuthorized = () => {
      return isAdmin() || threadID === auth_thread;
    };

    if (subCmd === 'ban') {
      if (!isAdmin()) {
        return message.reply(
          `⛔ 𝐀𝐜𝐜𝐞𝐬𝐬 𝐃𝐞𝐧𝐢𝐞𝐝\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `❍ Only bot admins can use this command\n`
        );
      }

      let uid, reason;

      if (event.type === 'message_reply') {
        uid = event.messageReply.senderID;
        reason = args.slice(1).join(' ').trim();
      } else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
        reason = args.slice(1).join(' ').replace(event.mentions[uid], '').trim();
      } else if (args[1] && /^\d+$/.test(args[1])) {
        uid = args[1];
        reason = args.slice(2).join(' ').trim();
      } else {
        return message.reply(
          `❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐒𝐲𝐧𝐭𝐚𝐱\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `𝐔𝐬𝐚𝐠𝐞:\n` +
          `• like ban @tag [reason]\n` +
          `• like ban (reply to msg) [reason]\n`
        );
      }

      if (!uid) return message.reply(`❌ Could not determine user.`);
      if (!reason || reason === '') reason = 'Banned from using like command';
      reason = reason.replace(/\s+/g, ' ');

      const userData = await usersData.get(uid);
      const name = userData.name || 'Unknown';
      const likeBanned = userData.likeBanned || {};

      if (likeBanned.status) {
        return message.reply(
          `⚠️ 𝐔𝐬𝐞𝐫 𝐀𝐥𝐫𝐞𝐚𝐝𝐲 𝐁𝐚𝐧𝐧𝐞𝐝\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `֎ 𝐍𝐚𝐦𝐞: ${name}\n` +
          `❍ 𝐑𝐞𝐚𝐬𝐨𝐧: ${likeBanned.reason}\n` +
          `❍ 𝐃𝐚𝐭𝐞: ${likeBanned.date}\n`
        );
      }

      const time = getTime("DD/MM/YYYY HH:mm:ss");
      await usersData.set(uid, {
        likeBanned: { status: true, reason, date: time }
      });

      return message.reply(
        `✅ 𝐔𝐬𝐞𝐫 𝐁𝐚𝐧𝐧𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲\n\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `֎ 𝐍𝐚𝐦𝐞: ${name}\n` +
        `❍ 𝐑𝐞𝐚𝐬𝐨𝐧: ${reason}\n` +
        `❍ 𝐃𝐚𝐭𝐞: ${time}\n`
      );
    }

    if (subCmd === 'unban') {
      if (!isAdmin()) {
        return message.reply(
          `⛔ 𝐀𝐜𝐜𝐞𝐬𝐬 𝐃𝐞𝐧𝐢𝐞𝐝\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `❍ Only bot admins can use this command.\n`
        );
      }

      let uid;

      if (event.type === 'message_reply') {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args[1] && /^\d+$/.test(args[1])) {
        uid = args[1];
      } else {
        return message.reply(
          `❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐒𝐲𝐧𝐭𝐚𝐱\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `𝐔𝐬𝐚𝐠𝐞:\n` +
          `• like unban @tag\n` +
          `• like unban (reply to msg)\n`
        );
      }

      const userData = await usersData.get(uid);
      const name = userData.name || 'Unknown';
      const likeBanned = userData.likeBanned || {};

      if (!likeBanned.status) {
        return message.reply(
          `⚠️ 𝐔𝐬𝐞𝐫 𝐈𝐬 𝐍𝐨𝐭 𝐁𝐚𝐧𝐧𝐞𝐝\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `֎ 𝐍𝐚𝐦𝐞: ${name}\n`
        );
      }

      await usersData.set(uid, { likeBanned: {} });

      return message.reply(
        `✅ 𝐔𝐬𝐞𝐫 𝐔𝐧𝐛𝐚𝐧𝐧𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲\n\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `֎ 𝐍𝐚𝐦𝐞: ${name}\n` +
        `❍ This user can now use the like command again.\n`
      );
    }

    if (subCmd === 'banlist') {
      if (!isAdmin()) {
        return message.reply(
          `⛔ 𝐀𝐜𝐜𝐞𝐬𝐬 𝐃𝐞𝐧𝐢𝐞𝐝\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `❍ Only bot admins can use this command.\n`
        );
      }

      const allUsers = await usersData.getAll();
      const bannedUsers = allUsers.filter(u => u.likeBanned && u.likeBanned.status === true);

      if (bannedUsers.length === 0) {
        return message.reply(
          `📋 𝗟𝗶𝗸𝗲 𝗕𝗮𝗻 𝗟𝗶𝘀𝘁\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `❍ No banned users found.\n`
        );
      }

      const msg = bannedUsers.map((user, index) =>
        `${index + 1}. ${user.name || 'Unknown'}\n` +
        `   ├ 𝐑𝐞𝐚𝐬𝐨𝐧: ${user.likeBanned.reason || 'No reason'}\n` +
        `   └ 𝐃𝐚𝐭𝐞: ${user.likeBanned.date || 'Unknown'}`
      ).join('\n\n');

      return message.reply(
        `📋 𝗟𝗶𝗸𝗲 𝗕𝗮𝗻 𝗟𝗶𝘀𝘁\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `𝐓𝐨𝐭𝐚𝐥: ${bannedUsers.length} user(s)\n\n` +
        `${msg}`
      );
    }

    try {
      if (!isAuthorized()) {
        return message.reply(NOTICE);
      }

      if (args.length < 1) {
        return message.reply(`❓ 𝐏ʟᴇᴀꜱᴇ 𝐏ʀᴏᴠɪᴅᴇ 𝐀 𝐔ɪᴅ`);
      }

      const ffUID = args[0];

      if (!/^\d+$/.test(ffUID)) {
        return message.reply(`❌ Invalid UID! Numbers only.`);
      }

      const senderData = await usersData.get(event.senderID);

      const likeBanned = senderData.likeBanned || {};
      if (likeBanned.status) {
        return message.reply(
          `🚫 𝐘𝐨𝐮 𝐀𝐫𝐞 𝐁𝐚𝐧𝐧𝐞𝐝\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `❍ 𝐑𝐞𝐚𝐬𝐨𝐧: ${likeBanned.reason}\n` +
          `❍ 𝐁𝐚𝐧𝐧𝐞𝐝 𝐎𝐧: ${likeBanned.date}\n`
        );
      }

      const likeUsage = senderData.likeUsage || {};
      const lastUsed = likeUsage.lastUsed || 0;
      const now = Date.now();
      const elapsed = now - lastUsed;

      if (!isAdmin() && elapsed < xms) {
        const remaining = xms - elapsed;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        return message.reply(
          `❍ 𝐘𝐨𝐮 𝐜𝐚𝐧 𝐨𝐧𝐥𝐲 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐨𝐧𝐜𝐞 𝐞𝐯𝐞𝐫𝐲 ${xhours} 𝐡𝐨𝐮𝐫𝐬.\n` +
          `❍ 𝐓𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐢𝐧: ${hours}𝐡 ${minutes}𝐦 ${seconds}𝐬\n`
        );
      }

      const waiting = await message.reply(`𝐏ʀᴏᴄᴇꜱꜱɪɴɢ 𝐘ᴏᴜʀ 𝐑ᴇϙᴜᴇꜱᴛ`);


      let xData = null, xOk = false, xErr = null;
      try {
        const xRes = await axios.get(x_api(ffUID), { timeout: 30000 });
        xData = xRes.data;
        xOk = !!(xData && xData.status);
        if (!xOk) xErr = xData?.error || 'x_api Failed';
      } catch (e) {
        xErr = e.response?.data?.error || 'y_api Failed';
      }

      
      let yData = null, yOk = false, yErr = null;
      try {
        const yRes = await axios.get(y_api(ffUID), { timeout: 30000 });
        yData = yRes.data;
        yOk = !!(yData && yData.Status === 'Success');
        if (!yOk) yErr = yData?.error || 'API 2 Failed';
      } catch (e) {
        yErr = e.response?.data?.error || 'API 2 Failed';
      }

      message.unsend(waiting.messageID);

    
      if (!xOk && !yOk) {
        return message.reply(
          `❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐓𝐨 𝐒𝐞𝐧𝐝 𝐋𝐢𝐤𝐞𝐬\n\n` +
          `❍ ${xErr}\n`
        );
      }

      const nickname = (xOk ? xData.Nickname : null)
                    || (yOk ? yData.PlayerNickname : null)
                    || 'Unknown';

      const xAdded = xOk ? (xData.likes_added ?? 0) : 0;
      const yAdded = yOk ? (yData.LikesGiven ?? 0) : 0;
      const totalAdded = xAdded + yAdded;
      const beforeLikes = xOk ? (xData.likes_before ?? 0) : (yData?.LikesBeforeProcess ?? 0);
      const afterLikes = yOk ? (yData.LikesAfterProcess ?? 0) : (xData?.likes_after ?? 0);

      if (!isAdmin()) {
        await usersData.set(event.senderID, {
          likeUsage: { lastUsed: now }
        });
      }

      return message.reply(
        `✅ 𝐋𝐢𝐤𝐞𝐬 𝐒𝐞𝐧𝐭 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲\n\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `֎ 𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞: ${nickname}\n` +
        `֎ 𝐔𝐈𝐃: ${ffUID}\n\n` +
        `❍ 𝐁𝐞𝐟𝐨𝐫𝐞 𝐋𝐢𝐤𝐞𝐬: ${beforeLikes}\n` +
        `❍ 𝐀𝐟𝐭𝐞𝐫 𝐋𝐢𝐤𝐞𝐬: ${afterLikes}\n` +
        `❍ 𝐓𝐨𝐭𝐚𝐥 𝐀𝐝𝐝𝐞𝐝: ${totalAdded}\n`
      );

    } catch (err) {
      const apiError = err.response?.data?.error;
      return message.reply(`⚠️ ${apiError || err.message}\n`);
    }
  }
};
