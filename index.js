const Discord = require("discord.js")
const keepAlive = require("./server.js")
const fs = require('fs')
const client = new Discord.Client({ intents: new Discord.Intents(32767) })
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', message => {
    var server = String(message.guild.id)
    if (!message.content.startsWith("^") || message.author.bot) return
    const args = message.content.slice("^".length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return
    try {
        client.commands.get(command).execute(message, args, client)
    } catch (err) {
        console.error(err)
        message.reply('there was a error, please try again later')
    }

})


client.login(process.env.token).catch(console.error)


for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}


keepAlive()
