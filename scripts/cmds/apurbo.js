module.exports = {
    config: {
        name: "apurbo",
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
    if (event.body && event.body.toLowerCase() == "apurbo") return message.reply("বস অপূর্ব  মনায়েম কে ঠাপ দিতে ব্যস্ত আছে আমাকে বলুন-!!👽🕷️🐸");
}
};
