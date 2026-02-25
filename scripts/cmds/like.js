const axios = require('axios');

module.exports = {
  config: {
    name: 'like',
    author: 'Rasin',
    cooldown: 2,
    role: 0,
    prefix: false,
    description: 'Get free likes',
    category: 'free fire',
    usage: 'like <uid>'
  },

  onStart: async function ({ args, message }) {
    try {
      if (args.length < 1) {
        return message.reply(`𝐏ʟᴇᴀꜱᴇ 𝐏ʀᴏᴠɪᴅᴇ 𝐀 𝐔ɪᴅ`);
      }

      const uid = args[0];

      if (!/^\d+$/.test(uid)) {
        return message.reply(`𝐈ɴᴠᴀʟɪᴅ 𝐔ɪᴅ! 𝐍ᴜᴍʙᴇʀꜱ 𝐎ɴʟʏ.`);
      }

      const waiting = await message.reply(`𝐏ʀᴏᴄᴇꜱꜱɪɴɢ 𝐘ᴏᴜʀ 𝐑ᴇϙᴜᴇꜱᴛ...`);

      const apiUrl = `https://rasin-hex-likes.vercel.app/dristy/like?uid=${encodeURIComponent(uid)}`;
      const response = await axios.get(apiUrl, { timeout: 30000 });

      message.unsend(waiting.messageID);

      const data = response.data;

      if (!data || !data.status) {
        return message.reply(
          `𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐒ᴇɴᴅ 𝐋ɪᴋᴇꜱ\n\n` +
          `━━━━━━━━━━━━━━━━━━━`
        );
      }

      if (data.likes_added === 0) {
        return message.reply(
          `${data.status}\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n\n` +
          `֎ 𝐍ᴀᴍᴇ: ${data.Nickname || 'Unknown'}\n` +
          `֎ 𝐔ɪᴅ: ${data.UID || uid}\n\n` +
          `❍ 𝐁ᴇꜰᴏʀᴇ 𝐋ɪᴋᴇꜱ: ${data.likes_before}\n` +
          `❍ 𝐀ꜰᴛᴇʀ 𝐋ɪᴋᴇꜱ: ${data.likes_after}\n\n` +
          `━━━━━━━━━━━━━━━━━━━`
        );
      }

      return message.reply(
        `✅ ${data.status}\n\n` +
        `━━━━━━━━━━━━━━━━━━━\n\n` +
        `֎ 𝐍ᴀᴍᴇ: ${data.Nickname || 'Unknown'}\n` +
        `֎ 𝐔ɪᴅ: ${data.UID || uid}\n\n` +
        `❍ 𝐀ᴅᴅᴇᴅ 𝐋ɪᴋᴇꜱ: ${data.likes_added}\n` +
        `❍ 𝐁ᴇꜰᴏʀᴇ 𝐋ɪᴋᴇꜱ: ${data.likes_before}\n` +
        `❍ 𝐀ꜰᴛᴇʀ 𝐋ɪᴋᴇꜱ: ${data.likes_after}`
      );

    } catch (err) {
      return message.reply(
        `𝐀ɴ 𝐄ʀʀᴏʀ 𝐎ᴄᴄᴜʀʀᴇᴅ\n\n` +
        `𝐏ʟᴇᴀꜱᴇ 𝐓ʀʏ 𝐀ɢᴀɪɴ 𝐋ᴀᴛᴇʀ\n` +
        `━━━━━━━━━━━━━━━━━━━`
      );
    }
  }
};
