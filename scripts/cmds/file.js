const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		aliases: ["files"],
		version: "1.0",
		author: "---",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		const permission = ["61567590682406",
    "100073972493628"];
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("⏤͟͟͞͞😇𝙷𝙰𝙷𝙰𝙷𝙰𝙷𝙰 𝙳𝙾𝙽'𝚃 𝙿𝙴𝚁𝙼𝙸𝚂𝚂𝙸𝙾𝙽 𝚃𝙷𝙸𝚂 𝙲𝙼𝙳 𝙾𝙽𝙻𝚈 𝚄𝙴𝚂 𝙰𝙳𝙼𝙸𝙽 𝙹𝙰𝙳𝙸𝙳𒁂", event.threadID, event.messageID);
		}

		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
		}

		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};
