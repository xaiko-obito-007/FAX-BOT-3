module.exports = {
  config: {
    name: "top",
    version: "2.3",
    author: "S AY EM",
    role: 0,
    shortDescription: {
      en: "Top users leaderboard"
    },
    longDescription: {
      en: "Top richest, exp, group msg count & global msg count users"
    },
    category: "group",
    guide: {
      en: ".top | .top exp | .top count | .top global | .top info"
    }
  },

  onStart: async function ({ api, args, message, event, usersData }) {

    if (args[0] === "info") {
      return message.reply(
`
>📊
𝐓𝐎𝐏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎

• top        - Top Richest Users
• top exp    - Top EXP Users
• top count  - Top Group Chatters
• top global - Top Global Chatters

•𝐀𝐝𝐦𝐢𝐧: S AY EM `
      );
    }

    const allUsers = await usersData.getAll();
    const medals = ["🥇", "🥈", "🥉"];

    function toFancy(str) {
      const map = {
        a:'𝐚',b:'𝐛',c:'𝐜',d:'𝐝',e:'𝐞',f:'𝐟',g:'𝐠',h:'𝐡',
        i:'𝐢',j:'𝐣',k:'𝐤',l:'𝐥',m:'𝐦',n:'𝐧',o:'𝐨',p:'𝐩',
        q:'𝐪',r:'𝐫',s:'𝐬',t:'𝐭',u:'𝐮',v:'𝐯',w:'𝐰',x:'𝐱',
        y:'𝐲',z:'𝐳',
        A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',
        I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏'
      };
      return str.split("").map(c => map[c] || c).join("");
    }

    const get = (obj, path, def = 0) => {
      try {
        return path.split('.').reduce((o, i) => o[i], obj) ?? def;
      } catch {
        return def;
      }
    };

    let sorted = [];
    let title = "";

    // ===== SELECT =====
    if (args[0] === "exp") {
      sorted = allUsers.sort((a, b) => get(b, "exp") - get(a, "exp"));
      title = "🏆 𝐓𝐎𝐏 𝐄𝐗𝐏 𝐔𝐒𝐄𝐑𝐒";
    }
    else if (args[0] === "count") {
      sorted = allUsers
        .map(u => ({
          ...u,
          count: get(u, `data.${event.threadID}.count`)
        }))
        .sort((a, b) => b.count - a.count);
      title = "💬 𝐓𝐎𝐏 𝐆𝐑𝐎𝐔𝐏 𝐂𝐇𝐀𝐓𝐓𝐄𝐑𝐒";
    }
    else if (args[0] === "global") {
      sorted = allUsers.sort((a, b) => get(b, "data.messageCount") - get(a, "data.messageCount"));
      title = "🌍 𝐓𝐎𝐏 𝐆𝐋𝐎𝐁𝐀𝐋 𝐂𝐇𝐀𝐓𝐓𝐄𝐑𝐒";
    }
    else {
      sorted = allUsers.sort((a, b) => get(b, "money") - get(a, "money"));
      title = "💰 𝐓𝐎𝐏 𝐑𝐈𝐂𝐇𝐄𝐒𝐓 𝐔𝐒𝐄𝐑𝐒";
    }

    const topList = sorted.slice(0, 10);

    let msg = `\n${title}\n\n`;

    topList.forEach((user, index) => {
      const medal = medals[index] || `#${index + 1}`;
      const name = user.name || "Unknown";

      let value;
      if (args[0] === "exp") value = get(user, "exp");
      else if (args[0] === "count") value = get(user, `data.${event.threadID}.count`);
      else if (args[0] === "global") value = get(user, "data.messageCount");
      else value = get(user, "money");

      msg += `${medal} ${toFancy(name)} - ${value}\n`;
    });

    return message.reply(msg);
  }
};