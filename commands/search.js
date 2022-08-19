const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const fetch = require('cross-fetch')
const { XMLValidator } = require("fast-xml-parser");
const Discord = require("discord.js")
const fs = require("fs")
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for a example')
    .addStringOption(option =>
      option.setName('query').setDescription('Search Query').setRequired(true)),

  async execute(interaction, client) {
     var text = interaction.options.getString('query');
    var author = interaction.user.id
      await interaction.deferReply();
        var id = makeid(10)
        var results = []
        fetch("https://469exampletest.jeremygamer13.repl.co/api/examples").then(res => res.json()).then(data => {
            Object.entries(data).forEach((i) => {
                if (i[1][0].toLowerCase().includes(text)) {
                    results.push(i[1])
                }
            })
            var counter = 0
            let embed = new Discord.EmbedBuilder()
            embed.setColor("RANDOM");
            embed.setTimestamp()
            embed.setTitle(`${results.length} Example/s found`)
          if (results.length != 0) { 
               embed.addField('\u200B', `Please choose the number you would like to select`)
          }
            results.forEach(ele => {
                counter++
                embed.addField('\u200B', `${counter}. ${ele[0]}`)
            });

            interaction.editReply({
                embeds: [embed]
            }).then(async() => {
               console.log("1")
                await delay(500)
              try {
                if (results.length != 0) {
                    const collector = new Discord.MessageCollector(interaction.channel, m => m.author.id === interaction.user.id, { time: 100000 });
                collector.on('collect', message => {
                  console.log("2")
                  if (message.author.id != author) return
                  console.log("3")
                 if  (Number(message.content) <= 0) return message.reply("Number can not be under or equal to 0").then(collector.stop())
                   console.log("4")
                  if (isNumeric(message.content) == true) {
                     console.log("5")
                  if (Number(message.content) > results.length) {
                    message.reply("Selected number is higher then the amount of examples found!") 
                      collector.stop()
                  } else {
                    
          
                      console.log("ran")
                    
                    let embed = new Discord.EmbedBuilder()
                    embed.setColor("RANDOM");
                    embed.setTimestamp()
                    embed.setTitle(`${results[Number(message.content) - 1][0]}`)
                    embed.addField('Description', `${results[Number(message.content) - 1][1]}`)
                    embed.addField('Block Count', `${String(results[Number(message.content) - 1][3])}`)
                  embed.addField('ID', `${String(results[Number(message.content) - 1][4])}`)
                    embed.addField('Creator', `${String(results[Number(message.content) - 1][6])}`)
                    embed.addField('Note:', `The following file can be uploaded and opened in Scratch For Discord to see the example`)
                    fetch("https://469exampletest.jeremygamer13.repl.co/api/getExample?xml=true&id=" + results[Number(message.content) - 1][4]).then(res => res.text()).then(data => {
                        fs.writeFile(id + '-example.xml', data, (err) => {
                            if (err) throw err;

                            message.channel.send({
                                embeds: [embed]

                            })

                            message.channel.send({
                                files: [{
                                    attachment: id + '-example.xml',
                                    name: id + '-example.xml'
                                }]
                            }).then(() => {
                                fs.unlinkSync(id + '-example.xml')
                            })
                        })
                    })

                    collector.stop()
                    }
                  } else {
                    message.reply("please enter a valid number next time")
                    collector.stop()
                  }
                })
                }
              } catch (err) {
                console.log(err)
              }
            })

        })
  },
}

// ---------------------------------------------------------
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function isNumeric(str) {
  if (typeof str != "string") return false 
  return !isNaN(str) &&
         !isNaN(parseFloat(str))
}
