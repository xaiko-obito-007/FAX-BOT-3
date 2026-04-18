module.exports = {
    config: {
        name: "pi pi pi chupiii 🐿",
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
    if (event.body && event.body.toLowerCase() == "pi pi pi chupiii 🐿") return message.reply("হুম তাবাসসুম বেবি বলো কি বলবে-!!🐿️🙃 ");
}
};
