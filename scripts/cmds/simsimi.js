const axios = require("axios");

const API = "https://sayem-baby-apixs.up.railway.app";

const autoTeachGroups = new Set();

// 🔹 all prefix list
const PREFIXES = ["/", "!", ".", "-", "+", "#", ">", "<", "\\"];

module.exports = {
  config: {
    name: "simsimi",
    aliases: ["sim", "simi"],
    version: "1.2",
    author: "S AY EM",
    role: 0,
    shortDescription: "Reply AutoTeach (same user allowed)",
    category: "chat",
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const sub = args[0];

    if (sub === "on") {
      autoTeachGroups.add(threadID);
      return api.sendMessage("💁 AutoTeach ON (reply system)", threadID, messageID);
    }

    if (sub === "off") {
      autoTeachGroups.delete(threadID);
      return api.sendMessage("🙅 AutoTeach OFF", threadID, messageID);
    }

    if (sub === "teach") {
      const text = args.slice(1).join(" ");

      if (!text.includes("=")) {
        return api.sendMessage("⚠ Use: simsimi teach hi = hello", threadID, messageID);
      }

      const [ask, ans] = text.split("=").map(x => x.trim());

      if (!ask || !ans) {
        return api.sendMessage("⚠ Invalid format!", threadID, messageID);
      }

      try {
        await axios.get(`${API}/teach-only`, {
          params: {
            ask,
            ans,
            uid: senderID
          }
        });

        return api.sendMessage("✅ Teach saved", threadID, messageID);
      } catch (e) {
        return api.sendMessage("❌ API error!", threadID, messageID);
      }
    }
  },

  onChat: async function ({ event, api }) {
    const { threadID, senderID, body, messageReply } = event;

    if (!body) return;

    // ❌ AutoTeach OFF
    if (!autoTeachGroups.has(threadID)) return;

    // ❌ prefix ignore
    if (PREFIXES.some(p => body.startsWith(p))) return;

    // ❌ bot er nijer message ignore
    if (senderID === api.getCurrentUserID()) return;

    // ❌ reply na hole ignore
    if (!messageReply || !messageReply.body) return;

    // ❌ bot ke reply dile ignore
    if (messageReply.senderID === api.getCurrentUserID()) return;

    const ask = messageReply.body;
    const ans = body;

    // ❌ short msg ignore
    if (ans.length < 2) return;

    try {
      await axios.get(`${API}/teach-only`, {
        params: {
          ask,
          ans,
          uid: senderID
        }
      });
    } catch (e) {}
  }
};