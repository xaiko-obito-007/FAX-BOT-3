const os = require("os");
const moment = require("moment");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const { createCanvas } = require("canvas");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "up"],
    version: "5.6",
    author: "S AY EM",
    countDown: 5,
    role: 0,
    shortDescription: "Ultra Premium System Status Image",
  },

  onStart: async function ({ message, event }) {
    try {
      const uptime = process.uptime();
      const h = Math.floor(uptime / 3600);
      const m = Math.floor((uptime % 3600) / 60);
      const s = Math.floor(uptime % 60);

      const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMemGB = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);

      let diskUsage = "Unknown";
      try {
        const diskRaw = execSync("df -h --total | grep total").toString();
        const parts = diskRaw.split(/\s+/);
        diskUsage = `${parts[2]} / ${parts[1]}`;
      } catch (err) {
        diskUsage = "N/A";
      }

      const processMemMB = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

      const canvas = createCanvas(1400, 900);
      const ctx = canvas.getContext("2d");

      const bgGradient = ctx.createLinearGradient(0, 0, 1400, 900);
      bgGradient.addColorStop(0, "#001a4d");
      bgGradient.addColorStop(1, "#002266");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cardGradient = ctx.createLinearGradient(60, 60, 1340, 840);
      cardGradient.addColorStop(0, "#0a2a66");
      cardGradient.addColorStop(1, "#001a4d");
      ctx.fillStyle = cardGradient;
      ctx.roundRect(60, 60, 1280, 780, 25);
      ctx.fill();

      ctx.strokeStyle = "#00c3ff";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00c3ff";
      ctx.shadowBlur = 25;
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px Sans";
      ctx.fillText("𝐒𝐭𝐚𝐭𝐮𝐬", 600, 120);

      ctx.font = "40px Sans";
      const startX = 80;
      let startY = 180;
      const lineGap = 48;

      const infoText = [
        "----------------------",
        `💾 𝐌𝐞𝐦𝐨𝐫𝐲 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:`,
        `  𝐌𝐞𝐦𝐨𝐫𝐲 𝐔𝐬𝐚𝐠𝐞: ${usedMemGB} GB / Total ${totalMemGB} GB`,
        `  𝐑𝐀𝐌 𝐔𝐬𝐚𝐠𝐞: ${usedMemGB} GB / Total ${totalMemGB} GB`,
        "",
        "----------------------",
        `📀 𝐃𝐢𝐬𝐤 𝐒𝐩𝐚𝐜𝐞 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:`,
        `  𝐃𝐢𝐬𝐤 𝐒𝐩𝐚𝐜𝐞 𝐔𝐬𝐚𝐠𝐞: ${diskUsage}`,
        "",
        "----------------------",
        `🤖 𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞: ${h}h ${m}m ${s}s`,
        `⚙ 𝐒𝐞𝐫𝐯𝐞𝐫 𝐔𝐩𝐭𝐢𝐦𝐞: ${os.uptime()}s`,
        `📊 𝐏𝐫𝐨𝐜𝐞𝐬𝐬 𝐌𝐞𝐦𝐨𝐫𝐲 𝐔𝐬𝐚𝐠𝐞: ${processMemMB} MB`,
        "",
        "----------------------",
      ];

      for (let i = 0; i < infoText.length; i++) {
        ctx.fillText(infoText[i], startX, startY + i * lineGap);
      }

      const filePath = path.join(__dirname, "cache", `uptime_${Date.now()}.png`);
      fs.ensureDirSync(path.dirname(filePath));
      fs.writeFileSync(filePath, canvas.toBuffer());

      await message.reply({
        attachment: fs.createReadStream(filePath),
      });

      fs.unlinkSync(filePath);
    } catch (err) {
      console.log(err);
      message.reply("❌ Error generating uptime image");
    }
  },
};
