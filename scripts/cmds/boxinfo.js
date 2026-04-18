const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "groupinfo",
    aliases: ["boxinfo"],
    version: "3.1",
    author: "Ahmed'z Ri'du",
    role: 0,
    shortDescription: "Premium Group Info",
    category: "box chat",
    guide: {
      en: "{p}groupinfo"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      let threadInfo = await api.getThreadInfo(event.threadID);

      let name = threadInfo.threadName || "Unknown";
      let id = threadInfo.threadID;
      let emoji = threadInfo.emoji || "❓";
      let msgCount = threadInfo.messageCount || 0;
      let members = threadInfo.participantIDs.length;
      let adminIDs = threadInfo.adminIDs;
      let adminCount = adminIDs.length;

      // 👉 Approval Status (FIXED)
      let approval;
      if (threadInfo.approvalMode === true) {
        approval = "🟢 ON (Approval Required)";
      } else {
        approval = "🔴 OFF (Anyone Can Join)";
      }

      // 👉 Gender Count
      let male = 0, female = 0, other = 0;
      for (let u of threadInfo.userInfo) {
        if (u.gender === "MALE") male++;
        else if (u.gender === "FEMALE") female++;
        else other++;
      }

      // 👉 Admin List
      let adminList = "";
      for (let i = 0; i < adminIDs.length; i++) {
        let info = await api.getUserInfo(adminIDs[i].id);
        let adminName = info[adminIDs[i].id].name;
        adminList += `   👑 ${adminName}\n`;
      }

      // 👉 Message Design
      let body = 
`╔═══════════════╗
     ✦ 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 ✦
╚═══════════════╝

📛 𝗡𝗮𝗺𝗲: ${name}
🆔 𝗜𝗗: ${id}
😊 𝗘𝗺𝗼𝗷𝗶: ${emoji}
🔐 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹: ${approval}

━━━━━━━━━━━━━━━

👥 𝗧𝗼𝘁𝗮𝗹 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${members}
👨‍🦱 𝗠𝗮𝗹𝗲: ${male}
👩‍🦰 𝗙𝗲𝗺𝗮𝗹𝗲: ${female}
⚧️ 𝗢𝘁𝗵𝗲𝗿: ${other}

━━━━━━━━━━━━━━━

👑 𝗔𝗗𝗠𝗜𝗡𝗦 [${adminCount}]
${adminList}

━━━━━━━━━━━━━━━

💬 𝗧𝗼𝘁𝗮𝗹 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${msgCount}

╭───────────────╮
│  ⚡ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 ⚡
│   𝗔𝗵𝗺𝗲𝗱'𝘇 𝗥𝗶'𝗱𝘂
╰───────────────╯`;

      // 👉 Image path
      const pathImg = __dirname + "/cache/group.png";

      const send = () => {
        api.sendMessage(
          {
            body: body,
            attachment: fs.createReadStream(pathImg)
          },
          event.threadID,
          () => fs.unlinkSync(pathImg),
          event.messageID
        );
      };

      return request(encodeURI(threadInfo.imageSrc))
        .pipe(fs.createWriteStream(pathImg))
        .on("close", send);

    } catch (err) {
      console.log(err);
      return api.sendMessage("❌ Error loading group info", event.threadID);
    }
  }
};
