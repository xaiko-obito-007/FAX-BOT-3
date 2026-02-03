const axios = require('axios');

module.exports = {
  config: {
    name: 'ramadan',
    author: 'Rasin',
    cooldown: 5,
    role: 0,
    prefix: false,
    description: 'Ramadan prayer times (Suhoor & Iftar) by city or coordinates',
    category: 'islamic',
    usage: 'ramadan <city> or ramadan <lat,lng>'
  },

  onStart: async function({ event, args, message, api }) {
    try {

      if (args.length < 1) {
        return message.reply(`🕌 Please provide a city name`);
      }

  
      const waiting = await message.reply(`🕋 𝐒ᴇᴀʀᴄʜɪɴɢ 𝐑ᴀᴍᴀᴅᴀɴ 𝐓ɪᴍᴇꜱ...\n`);

      let latitude, longitude, locationLabel;
      const input = args.join(' ');

      const coordMatch = input.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);

      if (coordMatch) {
     
        latitude = parseFloat(coordMatch[1]);
        longitude = parseFloat(coordMatch[2]);
        locationLabel = `${latitude}, ${longitude}`;

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          message.unsend(waiting.messageID);
          return message.reply(
            `❌ 𝐈ɴᴠᴀʟɪᴅ 𝐂ᴏᴏʀᴅɪɴᴀᴛᴇꜱ!\n\n` +
            `━━━━━━━━━━━━━━━━━━━\n\n` +
            `➤ Latitude: -90 to 90\n` +
            `➤ Longitude: -180 to 180\n\n` +
            `━━━━━━━━━━━━━━━━━━━`
          );
        }
      } else {

        const parts = input.split(',').map(p => p.trim());
        const city = parts[0];
        const country = parts[1] || 'Bangladesh';

        locationLabel = `${city}, ${country}`;

 
        const cityUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;

        try {
          const cityResponse = await axios.get(cityUrl, { timeout: 15000 });
          const cityData = cityResponse.data;

          if (cityData.code !== 200) {
            message.unsend(waiting.messageID);
            return message.reply(
              `❌ 𝐂ɪᴛʏ 𝐍ᴏᴛ 𝐅ᴏᴜɴᴅ!\n\n` +
              `━━━━━━━━━━━━━━━━━━━\n\n` +
              `➤ 𝐓ʀʏ: ramadan <City>, <Country>\n` +
              `   e.g: ramadan Dhaka, Bangladesh\n\n` +
              `➤ 𝐎ʀ 𝐔ꜱᴇ 𝐂ᴏᴏʀᴅɪɴᴀᴛᴇꜱ:\n` +
              `   e.g: ramadan 23.8103,90.4125\n\n` +
              `━━━━━━━━━━━━━━━━━━━`
            );
          }


          message.unsend(waiting.messageID);
          return sendRamadanReply(message, cityData.data, locationLabel);

        } catch (err) {
          message.unsend(waiting.messageID);
          return message.reply(
            `❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐅ᴇᴛᴄʜ 𝐓ɪᴍᴇꜱ\n\n` +
            `━━━━━━━━━━━━━━━━━━━\n\n` +
            `𝐏ʟᴇᴀꜱᴇ 𝐓ʀʏ 𝐀ɢᴀɪɴ ᴏʀ 𝐔ꜱᴇ 𝐂ᴏᴏʀᴅɪɴᴀᴛᴇꜱ\n\n` +
            `━━━━━━━━━━━━━━━━━━━`
          );
        }
      }

   
      const apiUrl = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
      const response = await axios.get(apiUrl, { timeout: 15000 });
      const data = response.data;

      if (data.code !== 200) {
        message.unsend(waiting.messageID);
        return message.reply(
          `❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐅ᴇᴛᴄʜ 𝐓ɪᴍᴇꜱ\n\n` +
          `━━━━━━━━━━━━━━━━━━━\n\n` +
          `𝐏ʟᴇᴀꜱᴇ 𝐂ʜᴇᴄᴋ 𝐘ᴏᴜʀ 𝐂ᴏᴏʀᴅɪɴᴀᴛᴇꜱ\n\n` +
          `━━━━━━━━━━━━━━━━━━━`
        );
      }

      message.unsend(waiting.messageID);
      return sendRamadanReply(message, data.data, locationLabel);

    } catch (err) {
      console.error("Ramadan command error:", err);

      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        return message.reply(
          `𝐑ᴇϙᴜᴇꜱᴛ 𝐓ɪᴍᴇᴅ 𝐎ᴜᴛ\n\n` +
          `𝐓ʜᴇ 𝐀ᴘɪ 𝐈ꜱ 𝐓ᴀᴋɪɴɢ 𝐓ᴏᴏ 𝐋ᴏɴɢ. 𝐏ʟᴇᴀꜱᴇ 𝐓ʀʏ 𝐀ɢᴀɪɴ.\n` +
          `━━━━━━━━━━━━━━━━━━━`
        );
      }

      if (err.response) {
        return message.reply(
          `𝐀ᴘɪ 𝐄ʀʀᴏʀ\n\n` +
          `𝐒ᴛᴀᴛᴜꜱ: ${err.response.status}\n` +
          `𝐌ᴇꜱꜱᴀɢᴇ: ${err.response.data?.error || 'Unknown error'}\n` +
          `━━━━━━━━━━━━━━━━━━━`
        );
      }

      return message.reply(
        `𝐀ɴ 𝐔ɴᴇxᴘᴇᴄᴛᴇᴅ 𝐄ʀʀᴏʀ 𝐎ᴄᴄᴜʀʀᴇᴅ\n\n` +
        `𝐏ʟᴇᴀꜱᴇ 𝐓ʀʏ 𝐀ɢᴀɪɴ 𝐋ᴀᴛᴇʀ.\n` +
        `━━━━━━━━━━━━━━━━━━━`
      );
    }
  }
};


function sendRamadanReply(message, data, locationLabel) {
  const timings = data.timings;
  const date = data.date;
  const meta = data.meta;

  const formattedDate = `${date.day} ${date.longMonth} ${date.year}`;
  const hijriDate = `${date.hijri.day} ${date.hijri.longMonth} ${date.hijri.longYear}`;

  let replyText = `🕋 𝐑ᴀᴍᴀᴅᴀɴ 𝐏ʀᴀʏᴇʀ 𝐓ɪᴍᴇꜱ\n\n`;
  replyText += `━━━━━━━━━━━━━━━━━━━\n\n`;
  replyText += `📍 𝐋ᴏᴄᴀᴛɪᴏɴ: ${locationLabel}\n`;
  replyText += `📅 ${formattedDate}\n`;
  replyText += `🕌 ${hijriDate}\n\n`;

  replyText += `━━━━━ 🌙 𝐑ᴀᴍᴀᴅᴀɴ 𝐓ɪᴍᴇꜱ ━━━━━\n\n`;

  replyText += `🌙 𝐒ᴜʜᴏᴏʀ (𝐋ᴀꜱᴛ 𝐄ᴀᴛ): ${timings.Fajr}\n`;
  replyText += `🌅 𝐅ᴀʲʀ (𝐃ᴀᴡɴ):       ${timings.Fajr}\n`;
  replyText += `🌄 𝐒ᴜɴʀɪꜱᴇ:           ${timings.Sunrise}\n`;
  replyText += `☀️ 𝐃ʜᴜʜʀ (𝐍ᴏᴏɴ):     ${timings.Dhuhr}\n`;
  replyText += `🕌 𝐀ꜱʀ:               ${timings.Asr}\n`;
  replyText += `🌆 𝐌ᴀɢʜʀɪᴙ (𝐈ꜰᴛᴀʀ): ${timings.Maghrib}\n`;
  replyText += `🌙 𝐈ꜱʜᴀ:             ${timings.Isha}\n\n`;

  replyText += `━━━━━━━━━━━━━━━━━━━\n`;
  replyText += `📌 𝐍ᴏᴛᴇ: 𝐒ᴜʜᴏᴏʀ ᴇɴᴅꜱ ᴀᴛ 𝐅ᴀʲʀ ᴛɪᴍᴇ\n`;
  replyText += `📌 𝐈ꜰᴛᴀʀ ᴛɪᴍᴇ ᴀᴛ 𝐌ᴀɢʜʀɪᴙ\n\n`;
  replyText += `━━━━━━━━━━━━━━━━━━━\n`;
  replyText += `𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐀ʟ𝐀ᴅʜᴀɴ 𝐀ᴘɪ\n`;
  replyText += `━━━━━━━━━━━━━━━━━━━`;

  return message.reply(replyText);
}
