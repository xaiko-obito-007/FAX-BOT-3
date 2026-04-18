const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { createCanvas, loadImage } = require("canvas");

const MONGO_URI = "mongodb+srv://video09:video404video909@sayem50.pqzsqng.mongodb.net/topgcmongodb+srv://video09:video404video909@sayem50.pqzsqng.mongodb.net/topgc";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const groupSchema = new mongoose.Schema({
  threadID: String,
  count: Number
});

const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

const cachePath = path.join(__dirname, "cache");
if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

// ✅ RETRY IMAGE LOAD (NEW FIX)
async function loadImageRetry(url, retry = 3) {
  for (let i = 0; i < retry; i++) {
    try {
      return await loadImage(url);
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
  throw new Error("Image load failed");
}

// ✅ SAFE THREAD INFO
async function getThreadInfoSafe(api, threadID) {
  try {
    const info = await api.getThreadInfo(threadID);
    return {
      name: info.threadName || "Unknown Group",
      image: info.imageSrc || null
    };
  } catch {
    return {
      name: "Unknown Group",
      image: null
    };
  }
}

// ✅ Rounded box
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

module.exports = {
  config: {
    name: "topgc",
    version: "32.0",
    author: "Sayem X ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Top Groups Ranking (Pro UI)",
    category: "group"
  },

  onChat: async function ({ event }) {
    try {
      if (!event.isGroup) return;

      let data = await Group.findOne({ threadID: event.threadID });

      if (!data) {
        await Group.create({ threadID: event.threadID, count: 1 });
      } else {
        data.count += 1;
        await data.save();
      }

    } catch (e) {
      console.log(e);
    }
  },

  onStart: async function ({ api, event, threadsData }) {
    try {

      const dbData = await Group.find({});
      let countMap = {};
      dbData.forEach(d => countMap[d.threadID] = d.count);

      let allThreads = await threadsData.getAll();
      let groups = allThreads.filter(t => t.isGroup);

      let list = [];

      for (let g of groups) {
        let info = await getThreadInfoSafe(api, g.threadID);

        list.push({
          name: info.name,
          id: g.threadID,
          image: info.image,
          count: countMap[g.threadID] || 0
        });
      }

      list = list.sort((a, b) => b.count - a.count).slice(0, 10);

      const canvas = createCanvas(1000, 1800);
      const ctx = canvas.getContext("2d");

      let bg = ctx.createLinearGradient(0, 0, 0, 1800);
      bg.addColorStop(0, "#0f172a");
      bg.addColorStop(1, "#020617");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 50px sans-serif";
      ctx.fillText("🏆 TOP THREADS/GROUPS", 150, 80);

      ctx.font = "20px sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Ranking #1 - #10", 400, 120);

      let y = 180;

      for (let i = 0; i < list.length; i++) {
        let data = list[i];

        let colors = [
          "#FFD700","#C0C0C0","#CD7F32",
          "#00D1FF","#00FFA3","#A855F7",
          "#A855F7","#A855F7","#A855F7","#A855F7"
        ];

        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(80, y + 55);
        ctx.lineTo(50, y + 55);
        ctx.stroke();

        ctx.shadowColor = colors[i];
        ctx.shadowBlur = 20;

        roundRect(ctx, 80, y, 840, 110, 20);
        ctx.fillStyle = "#1e293b";
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
        ctx.strokeStyle = colors[i];
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(50, y + 55, 25, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(`${i+1}`, 43, y + 60);

        // 🔥 FINAL AVATAR FIX (RETRY)
        let avatar;
        try {
          if (data.image) {
            avatar = await loadImageRetry(data.image);
          } else {
            avatar = await loadImageRetry(`https://graph.facebook.com/${data.id}/picture?width=200&height=200`);
          }
        } catch {
          avatar = await loadImage("https://i.imgur.com/2yaf2wb.png");
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(170, y + 55, 35, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, 135, y + 20, 70, 70);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(170, y + 55, 37, 0, Math.PI * 2);
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 26px sans-serif";

        let name = data.name.length > 30 ? data.name.substring(0, 30) + "..." : data.name;
        ctx.fillText(name, 240, y + 60);

        roundRect(ctx, 720, y + 25, 160, 60, 12);
        ctx.fillStyle = "#020617";
        ctx.fill();
        ctx.strokeStyle = colors[i];
        ctx.stroke();

        let msg = data.count >= 1000 
          ? (data.count/1000).toFixed(2) + "K" 
          : data.count;

        ctx.fillStyle = colors[i];
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(msg, 750, y + 65);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "14px sans-serif";
        ctx.fillText("MESSAGES", 750, y + 45);

        y += 140;
      }

      const imgPath = path.join(cachePath, "topgc_pro.png");
      fs.writeFileSync(imgPath, canvas.toBuffer());

      api.sendMessage({
        body: "🏆 Top 10 Active Groups (Pro UI)",
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

    } catch (e) {
      console.log(e);
      api.sendMessage("❌ Error generating image!", event.threadID);
    }
  }
};