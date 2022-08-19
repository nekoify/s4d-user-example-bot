const keepAlive = require("./server.js")
const intents = require("./intents.js")
 const { Client, GatewayIntentBits, Partials, Collection, MessageEmbed, InteractionType, EmbedBuilder} = require('discord.js');
 const client = new Client(intents);
const fs = require('fs');

client.login(process.env['token']).catch(console.error)
client.commands = new Collection();
client.aliases = new Collection();
client.interactions = new Collection();

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
};

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

client.on('ready', () =>{
	console.log(`Logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ApplicationCommand) return;
  
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
  
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      const embed = new EmbedBuilder();
        embed.setDescription(`There was a error. Please try again later`)
      .setColor("#2F3136")
      return interaction.reply({
        embeds: [embed]
        });  
    };
});

client.on('interactionCreate', interaction => {
  if (interaction.type === InteractionType.ApplicationCommand) return;
	if (interaction.values[0] == "search") {
    let embed = new MessageEmbed()
    embed.setColor('#ffd1dc');
    embed.setTitle("Search")
    embed.setTimestamp()
    embed.setDescription(`Provides a numbered list of examples that match the query, typing in the number of the example eg. "3" will provide you with infomation and the XML file for the example. The XML file can be opened in Scratch for Discord to view the example. \n \n Cooldown: None`)
  interaction.update({ embeds: [embed] })
  } else if (interaction.values[0] == "upload") {
    let embed = new MessageEmbed()
    embed.setColor('#ffd1dc');
    embed.setTitle("Upload")
    embed.setTimestamp()
    embed.setDescription(`Uploads your example to Scratch for Discord \n \n Note: The blocks.xml file that is needed to upload your example can be found in the zip file that is downloaded for Scratch for Discord. The Title and Description (Prompted after running the command) must be atleast 5 characters long and under 500 characters. There must be atleast 5 blocks in your example \n \n Cooldown: 4 examples can be uploaded per 6hrs`)
  interaction.update({ embeds: [embed] })
  }
}); 

keepAlive()
