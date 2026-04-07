const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mongoose = require("mongoose");

// 🔥 MongoDB URI এখানে বসা
const MONGO_URI = "mongodb+srv://video09:Umm143@sayem50.pqzsqng.mongodb.net/mydbname?retryWrites=true&w=majority";

// connect mongo (once)
if (!global._mongoConnected) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  global._mongoConnected = true;
}

// schema
const userSchema = new mongoose.Schema({
  userID: String,
  threadID: String,
  name: String,
  count: { type: Number, default: 0 }
});

const User = mongoose.models.topmsg || mongoose.model("topmsg", userSchema);

module.exports = {
  config: {
    name: "topmsg",
    version: "2.0",
    role: 0,
    author: "S AY EM (Premium Edit)",
    category: "group"
  },

  onChat: async function ({ event, usersData }) {
    if (!event.senderID || event.isGroup == false) return;

    const name = await usersData.getName(event.senderID);

    await User.findOneAndUpdate(
      { userID: event.senderID },
      {
        $inc: { count: 1 },
        name: name || "Unknown"
      },
      { upsert: true }
    );
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const fontPath = path.join(__dirname, "noto-bengali.ttf");

      if (!fs.existsSync(fontPath)) {
        const fontUrl = "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansBengali/NotoSansBengali-Bold.ttf";
        const response = await axios.get(fontUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(fontPath, Buffer.from(response.data));
      }

      registerFont(fontPath, { family: "BengaliFont" });
      const mainFont = "BengaliFont";

      const members = await User.find({})
        .sort({ count: -1 })
        .limit(10);

      if (!members.length)
        return api.sendMessage("⚠ No message data.", event.threadID);

      const width = 1400;
      const height = 2000;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // 🔥 Premium Gradient BG
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#0f2027");
      bg.addColorStop(0.5, "#203a43");
      bg.addColorStop(1, "#2c5364");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // ✨ Glow Title
      ctx.textAlign = "center";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 40;
      ctx.fillStyle = "#00ffff";
      ctx.font = `75px ${mainFont}`;
      ctx.fillText("🏆 TOP 10 MESSAGE KINGS", width / 2, 120);
      ctx.shadowBlur = 0;

      const maxCount = members[0].count;

      const positions = [
        { x: width / 2, y: 380, size: 150, color: "#FFD700", label: "👑 1ST" },
        { x: width / 2 - 300, y: 440, size: 120, color: "#C0C0C0", label: "🥈 2ND" },
        { x: width / 2 + 300, y: 440, size: 120, color: "#CD7F32", label: "🥉 3RD" }
      ];

      for (let i = 0; i < 3 && i < members.length; i++) {
        const user = members[i];
        const pos = positions[i];

        let avatar = null;
        try {
          const url = await usersData.getAvatarUrl(user.userID);
          avatar = await loadImage(url);
        } catch {}

        if (avatar) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pos.size, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(avatar, pos.x - pos.size, pos.y - pos.size, pos.size * 2, pos.size * 2);
          ctx.restore();
        }

        // 🔥 Neon Border
        ctx.strokeStyle = pos.color;
        ctx.shadowColor = pos.color;
        ctx.shadowBlur = 25;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.size + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = pos.color;
        ctx.font = `40px ${mainFont}`;
        ctx.fillText(pos.label, pos.x, pos.y - pos.size - 40);

        ctx.fillStyle = "#ffffff";
        ctx.font = `34px ${mainFont}`;
        ctx.fillText(user.name || "Unknown", pos.x, pos.y + pos.size + 60);

        ctx.fillStyle = "#00f2ff";
        ctx.font = `30px ${mainFont}`;
        ctx.fillText(user.count + " msgs", pos.x, pos.y + pos.size + 100);
      }

      let y = 750;
      for (let i = 3; i < members.length; i++) {
        const user = members[i];
        const percent = user.count / maxCount;

        // 🧊 Glass Card
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        roundRect(ctx, 120, y - 50, 1160, 110, 30);
        ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = `36px ${mainFont}`;
        ctx.fillText(`#${i + 1}  ${user.name || "Unknown"}`, 200, y);

        ctx.textAlign = "right";
        ctx.fillStyle = "#00f2ff";
        ctx.font = `36px ${mainFont}`;
        ctx.fillText(user.count + " msgs", 1200, y);

        // 🔥 Premium Progress Bar
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        roundRect(ctx, 450, y + 30, 650, 20, 10);
        ctx.fill();

        const grad = ctx.createLinearGradient(450, y + 30, 1100, y + 30);
        grad.addColorStop(0, "#00c6ff");
        grad.addColorStop(1, "#0072ff");

        ctx.fillStyle = grad;
        roundRect(ctx, 450, y + 30, (650 * percent) || 1, 20, 10);
        ctx.fill();

        y += 130;
      }

      function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      const filePath = path.join(__dirname, `top10_${Date.now()}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      return api.sendMessage({
        body: "🔥 Premium Top 10 Leaderboard",
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

    } catch (err) {
      console.log(err);
      api.sendMessage("❌ Error occurred.", event.threadID);
    }
  }
};