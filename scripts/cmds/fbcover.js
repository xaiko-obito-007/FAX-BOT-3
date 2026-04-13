const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const BASE_API = "https://sayem-fbcover-apixs.onrender.com/api/fbcover";

module.exports = {
  config: {
    name: "fbcover",
    aliases: ["cover"],
    version: "2.0",
    author: "S AY EM",
    countDown: 5,
    role: 0,
    category: "image",
    guide: "{pn} v1/v2/.../v10 name - title - location - email - phone"
  },

  onStart: async function ({ message, args, event }) {
    try {

      const styles = ["v1","v2","v3","v4","v5","v6","v7","v8","v9","v10"];
      let style = "v1";

      if (args[0] && styles.includes(args[0].toLowerCase())) {
        style = args.shift().toLowerCase();
      }

      // 🔥 INPUT
      const input = args.join(" ").split("-").map(x => x.trim());

      const name = input[0] || "UNKNOWN";
      const title = input[1] || "CREATOR";
      const location = input[2] || "Bangladesh";
      const email = input[3] || "example@gmail.com";
      const phone = input[4] || "01700000000";
      const uid = event.senderID;

      let apiUrl = `${BASE_API}?name=${encodeURIComponent(name)}&`;

      apiUrl += `title=${encodeURIComponent(title)}&`;
      apiUrl += `location=${encodeURIComponent(location)}&`;
      apiUrl += `email=${encodeURIComponent(email)}&`;
      apiUrl += `phone=${encodeURIComponent(phone)}&`;
      apiUrl += `style=${encodeURIComponent(style)}&`;
      apiUrl += `uid=${encodeURIComponent(uid)}`;

      const imgPath = path.join(__dirname, "cache", `fbcover_${uid}.png`);

      const res = await axios.get(apiUrl, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(imgPath, Buffer.from(res.data, "binary"));

      const msg =
`✅ FB COVER IMAGE GENERATED\n🎨 Style: ${style.toUpperCase()}

👤 Name: ${name}
💼 Title: ${title}
📍 Location: ${location}
📧 Email: ${email}
📞 Phone: ${phone}`;

      await message.reply({
        body: msg,
        attachment: fs.createReadStream(imgPath)
      });

      fs.unlinkSync(imgPath);

    } catch (err) {
      console.log(err);
      message.reply("❌ Error generating cover!");
    }
  }
};