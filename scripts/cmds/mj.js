const axios = require("axios");
const sharp = require("sharp");
const { Readable } = require("stream");

module.exports = {
  config: {
    name: "mj",
    version: "5.1",
    role: 2,
    author: "S AY EM",
    countDown: 60,
    category: "AI"
  },

  onStart: async ({ api, event, args, message }) => {
    if (!args.length) return message.reply("Provide a prompt.");
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const res = await axios.post(
        "https://performing-sara-bind-eat.trycloudflare.com/generate?key=ariyan",
        { prompt: args.join(" ") },
        { timeout: 60000 }
      );

      if (!res.data?.images?.length) return message.reply("Failed.");

      const buffers = await Promise.all(
        res.data.images.slice(0, 4).map(u =>
          axios.get(u, { responseType: "arraybuffer", timeout: 60000 })
            .then(r => Buffer.from(r.data))
        )
      );

      const meta = await sharp(buffers[0]).metadata();
      const w = meta.width || 512;
      const h = meta.height || 512;

      const grid = await sharp({
        create: {
          width: w * 2,
          height: h * 2,
          channels: 3,
          background: "#000"
        }
      })
        .composite([
          { input: buffers[0], left: 0, top: 0 },
          { input: buffers[1], left: w, top: 0 },
          { input: buffers[2], left: 0, top: h },
          { input: buffers[3], left: w, top: h }
        ])
        .jpeg({ quality: 90 })
        .toBuffer();

      api.sendMessage(
        {
          body: "Reply U1/U2/U3/U4",
          attachment: Readable.from(grid)
        },
        event.threadID,
        (err, info) => {
          if (info?.messageID) {
            global.GoatBot.onReply.set(info.messageID, {
              senderID: event.senderID,
              buffers,
              w,
              h
            });
          }
        },
        event.messageID
      );

      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (e) {
      message.reply("Error");
    }
  },

  onReply: async ({ api, event, message }) => {
    const rep = global.GoatBot.onReply.get(event.messageReply?.messageID);
    if (!rep || rep.senderID !== event.senderID) return;

    const map = { U1: 0, U2: 1, U3: 2, U4: 3 };
    const key = event.body.trim().toUpperCase();
    if (!(key in map)) return message.reply("U1/U2/U3/U4");

    try {
      const { buffers, w, h } = rep;

      const up = await sharp(buffers[map[key]])
        .resize(w * 2, h * 2, { kernel: sharp.kernel.nearest })
        .jpeg({ quality: 95 })
        .toBuffer();

      api.sendMessage(
        {
          body: key,
          attachment: Readable.from(up)
        },
        event.threadID,
        null,
        event.messageID
      );

      global.GoatBot.onReply.delete(event.messageReply.messageID);

    } catch {
      message.reply("Fail");
    }
  }
};
