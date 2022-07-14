const fetch = require('cross-fetch')
const Discord = require("discord.js")
const { XMLValidator } = require("fast-xml-parser");
function occurrences(string, subString, allowOverlapping) {

  string += "";
  subString += "";
  if (subString.length <= 0) return (string.length + 1);

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}


module.exports = {
  name: 'submit',
  execute(message, args, client) {
    var author = message.author.id



    if (message.attachments.first()) {
      var file = message.attachments.first().url
      var fileIsXml = occurrences(file, ".xml")
      if (fileIsXml == 1) {
        fetch(file).then(res => res.text()).then(body => {
          var blockCount = 0
          var blockCount = occurrences(body, "<block")
          blockCount = blockCount + occurrences(body, "<shadow")
          const result = XMLValidator.validate(body, {
            allowBooleanAttributes: true
          });
          if (result != true) return message.channel.send("error parsing your XML data please make sure you uploaded the blocks.xml file found in the zip file when downloading your bot")
          if (blockCount < 5) {
            message.reply("There must be atleast 5 blocks in your example")
          } else {
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
            var title, desc
            message.channel.send("Please enter a title for your example")
            collector.on('collect', message => {
              if (author != message.author.id) return
              if (!title) {
                title = message.content
                message.channel.send("Please enter a description for your example")
              } else if (!desc) {
                desc = message.content
                var obj = {
                  name: title,
                  desc: desc,
                  author: `${message.author.username}#${message.author.discriminator}`,
                  sessionID: author,
                  xml: body,
                  count: blockCount,
                  corsBypass: process.env['apiKey']
                }

                fetch('https://469exampletest.jeremygamer13.repl.co/api/upload', {
                  method: 'POST',
                  mode: "cors",
                  headers: {
                    'Content-Type': 'application/json',
                  },

                  body: JSON.stringify(obj),
                }).then(res => res.json()).then(json => {
                  if (json.limitedUntil != null) {
                      message.reply(`Seems like you've hit the rate limit, you can submit again <t:${json.limitedUntil}:R>`)
                  } else if (json.error) {
                    message.reply("Error: " + String(json.error))
                  } else {
                    message.channel.send("Example Uploaded!")
                  }
                  console.log(json)
                })
                collector.stop()

              }

            })
          }

        })
      } else {
        message.channel.send("Please upload a valid XML file")
      }
    } else {
      message.channel.send("Please attach a XML file")
    }
  }
}
