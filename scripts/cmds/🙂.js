module.exports = {
 config: {
	 name: "🙂",
	 version: "1.0",
	 author: "Jadid",
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "no prefix",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "🙂") {
 return message.reply({
 body: "     「𝐑 𝐀 𝐉」",
 attachment: await global.utils.getStreamFromURL("https://drive.google.com/uc?id=17knV-m3yAjYayZF4Zh3kXm_Tqw6wOO6_")
 });
 }
 }
}
