module.exports = {
    config: {
        name: "jadid",
        version: "1.0",
        author: "Jadid", //** original author fb I'd : https://C.E.O.NOBITA.2021 **//
        countDown: 5,
        role: 0,
        shortDescription: "No Prefix",
        longDescription: "No Prefix",
        category: "reply",
    },
onStart: async function(){}, 
onChat: async function({
    event,
    message,
    getLang
}) {
    if (event.body && event.body.toLowerCase() == "jadid") return message.reply("আমাকে বলতে পারেন বস জিসান এর বউ সাদিয়াকে নিয়ে পার্কে গেছে🙂🤐-!!🥀");
}
};
