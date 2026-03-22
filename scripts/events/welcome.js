const { getTime, drive } = global.utils;
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "8.0",
		author: "S AY EM",
		category: "events"
	},

	langs: {
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			welcomeMessage: "♻️𝚃𝚑𝚊𝚗𝚔 𝚢𝚘𝚞 𝚏𝚘𝚛 𝚒𝚗𝚟𝚒𝚝𝚒𝚗𝚐 𝚖𝚎!🎀\n \n𝙾𝚠𝚗𝚎𝚛: Sayem Ahmmed\n𝚂𝚝𝚊𝚝𝚞𝚜: Islam\n\n𝙿𝚛𝚎𝚏𝚒𝚡: %1\n𝙱𝚊𝚋𝚢𝚄𝚜𝚎: %1help",
			multiple1: "you",
			multiple2: "you guys",
			defaultWelcomeMessage: `𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝚃𝚘 𝙾𝚞𝚛 {boxName}\n\n𝙷𝚎𝚕𝚕𝚘 𝙳𝚎𝚊𝚛 {userName}`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {

				const hours = getTime("HH");
				const { threadID } = event;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;

				// BOT JOIN
				if (dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
					return message.send(getLang("welcomeMessage", prefix));
				}

				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						dataAddedParticipants: []
					};

				// Push new members
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);

				const threadData = await threadsData.get(threadID);
				if (threadData.settings.sendWelcomeMessage == false) return;

				const users = global.temp.welcomeEvent[threadID].dataAddedParticipants;
				const threadName = threadData.threadName;

				// Send all messages in parallel for super fast response
				await Promise.all(users.map(async (user) => {

					const name = user.fullName;

					// ===== TEXT SYSTEM SAME =====
					let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}/g, name)
						.replace(/\{boxName\}/g, threadName)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					// ===== ONLINE IMAGE SEND =====
					const imageUrl = "https://i.ibb.co/nqxjCxNJ/image0.gif";

					await message.send({
						body: welcomeMessage,
						attachment: await global.utils.getStreamFromURL(imageUrl)
					});
				}));

				delete global.temp.welcomeEvent[threadID];
			};
	}
};
