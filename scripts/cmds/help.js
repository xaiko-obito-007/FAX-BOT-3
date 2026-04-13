const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 𝐒 𝐀𝐘 𝐄𝐌 ]";

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "S AY EM",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += ``;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────❃『  ${category.toUpperCase()}  』`;

          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 2).map((item) => `⭔${item}`);
            msg += `\n│${cmds.join(" ".repeat(Math.max(1, 5 - cmds.join("").length)))}`;
          }

          msg += `\n╰────────────✦`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n\n╭─────❃[ 𝐄𝐧𝐣𝐨𝐲 ]\n│> 𝐓𝐨𝐭𝐚𝐥 𝐜𝐦𝐝𝐬: [${totalCommands}].\n│𝐓𝐲𝐩𝐞: [ ${prefix}𝐡𝐞𝐥𝐩 𝐭𝐨 \n│<𝐜𝐦𝐝> 𝐭𝐨 𝐥𝐞𝐚𝐫𝐧 𝐭𝐡𝐞 𝐮𝐬𝐚𝐠𝐞.]\n╰────────────✦`;
      msg += ``;
      msg += `\n╭─────❃\n│🌟 | [ 𝐒 𝐀𝐘 𝐄𝐌 ]\n│https://www.facebook.com/sayem.ahmmed.404\n╰────────────✦`;

      await message.reply({
        body: msg,
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `
╭── ❖ COMMAND INFO ❖ ───────────────────
│ Command: ${configCommand.name}
│ Version: ${configCommand.version || "1.0"}
│ Author: ${author}
│ Description: ${longDescription}
│ Role: ${roleText}
│ Time per Command: ${configCommand.countDown || 1}s
│ Aliases: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}
╰──────────────────────────────────────

┏━━━ 🌟 USAGE 🌟 ━━━┛
│ ${usage}
┗━━━━━━━━━━━━━━━━━━

✦ Please note: 
- The content inside <XXXXX> can be modified
- The content inside [a|b|c] means you can choose a, b, or c
`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
