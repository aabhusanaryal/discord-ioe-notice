const axios = require("axios");
const cheerio = require("cheerio");
const { Webhook, MessageBuilder } = require("discord-webhook-node");

const url = "https://exam.ioe.edu.np";

const hookUrls = [
  
];
const time = 1; //in minutes
let oldNotices = [{ title: "NULL" }];
let newNotices = [];

const hooks = hookUrls.map((url) => {
  return new Webhook(url);
});

setInterval(() => {
  axios(url).then((res) => {
    html = res.data;
    const $ = cheerio.load(html);
    newNotices = [];
    $("#datatable")
      .find("a")
      .each(function () {
        let notice = $(this);
        newNotices.push({ title: notice.text(), link: notice.attr("href") });
      });
    // If any new notice
    console.log(
      newNotices[0].title,
      oldNotices[0].title,
      newNotices[0].title == oldNotices[0].title
    );
    if (newNotices[0].title != oldNotices[0].title) {
      oldNotices = [...newNotices];
      let latestNotice = newNotices[0];
      const embed = new MessageBuilder()
        .setTitle(`${latestNotice.title}`)
        .setAuthor(
          "IOE Exam Notices",
          "https://exam.ioe.edu.np/Public/Notice/tu-logo.jpg",
          "https://exam.ioe.edu.np"
        )
        .setURL(`${url}${latestNotice.link}`)
        //   .addField("First field", "this is inline", true)
        //   .addField("Second field", "this is not inline")
        .setColor("#C52233")
        //   .setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png")
        .setDescription(`${latestNotice.title}`)
        //   .setImage("https://cdn.discordapp.com/embed/avatars/0.png")
        .setFooter("Bot maintained by Aabhusan Aryal")
        .setTimestamp();
      hooks.forEach((hook) => {
        hook.send(embed);
      });
    }
  });
}, time * 60000);
