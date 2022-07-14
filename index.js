const keepAlive = require("./server.js")

const Discord = require("discord.js")
const fs = require('fs')
const client = new Discord.Client({ intents: new Discord.Intents(32767) })
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', message => {
    var server = String(message.guild.id)
    if (!message.content.startsWith("()") || message.author.bot) return
    const args = message.content.slice("()".length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return
    try {
        client.commands.get(command).execute(message, args, client)
    } catch (err) {
        console.error(err)
        message.reply('there was a error, please try again later')
    }

})

client.on('interactionCreate', interaction => {
	if (interaction.values[0] == "search") {
    let embed = new Discord.MessageEmbed()
    embed.setColor('#ffd1dc');
    embed.setTitle("Search")
    embed.setTimestamp()
    embed.setDescription(`Usage: ()search {query} \n \n Provides a numbered list of examples that match the query, typing in the number of the example eg. "3" will provide you with infomation and the XML file for the example. The XML file can be opened in Scratch for Discord to view the example. \n \n Cooldown: None`)
  interaction.update({ embeds: [embed] })
  } else if (interaction.values[0] == "submit") {
    let embed = new Discord.MessageEmbed()
    embed.setColor('#ffd1dc');
    embed.setTitle("Submit")
    embed.setTimestamp()
    embed.setDescription(`Usage: ()submit <file> \n \n Uploads your example to Scratch for Discord \n \n Note: The blocks.xml file that is needed to upload your example can be found in the zip file that is downloaded for Scratch for Discord. The Title and Description (Prompted after running the command) must be atleast 5 characters long and under 500 characters. There must be atleast 5 blocks in your example \n \n Cooldown: 4 examples can be submited per 6hrs`)
  interaction.update({ embeds: [embed] })
  }
}); 



client.login(process.env['token']).catch(console.error)


for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}





















keepAlive()
