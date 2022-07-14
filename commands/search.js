const Discord = require("discord.js")
const fetch = require("cross-fetch")
const fs = require("fs")
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
module.exports = {
    name: 'search',
    execute(message, args, client) {
        var text = message.content.replace("()search ", "").toLowerCase()
        var id = makeid(10)
        var results = []
        fetch("https://469exampletest.jeremygamer13.repl.co/api/examples").then(res => res.json()).then(data => {
            Object.entries(data).forEach((i) => {
                if (i[1][0].toLowerCase().includes(text)) {
                    results.push(i[1])
                }
            })
            var counter = 0
            let embed = new Discord.MessageEmbed()
            embed.setColor("RANDOM");
            embed.setTimestamp()
            embed.setTitle(`${results.length} Examples found`)
          if (results.length != 0) { 
               embed.addField('\u200B', `Please choose the number you would like to select`)
          }
            results.forEach(ele => {
                counter++
                embed.addField('\u200B', `${counter}. ${ele[0]}`)
            });

            message.channel.send({
                embeds: [embed]
            }).then(async() => {
                await delay(500)
                if (results.length != 0) {
                    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                collector.on('collect', message => {
                    console.log(results[Number(message.content) - 1])
                    let embed = new Discord.MessageEmbed()
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
                })
                }
              
            })

        })
    },
}

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
