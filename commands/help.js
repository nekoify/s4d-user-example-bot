const Discord = require("discord.js")
module.exports = {
  name: 'help',
  execute(message, args, client) {
   const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Select a command')
					.addOptions([
						{
							label: 'Search',
							description: 'Search Command',
							value: 'search',
						},
						{
							label: 'Submit',
							description: 'Submit Command',
							value: 'submit',
						},
					]),
			);
    let embed = new Discord.MessageEmbed()
    embed.setColor('RANDOM');
    embed.setTitle("Commands List")
    embed.setTimestamp()
    embed.setDescription('Please select a option')
    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  },
}
