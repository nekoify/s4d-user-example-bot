const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const fetch = require('cross-fetch')

const Discord = require("discord.js")
const fs = require("fs")
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help menu'),

  async execute(interaction, client) {
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
							label: 'Upload',
							description: 'Upload Command',
							value: 'upload',
						},
					]),
			);
    let embed = new Discord.MessageEmbed()
    embed.setColor('RANDOM');
    embed.setTitle("Commands List")
    embed.setTimestamp()
    embed.setDescription('Please select a option')
    interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
}
