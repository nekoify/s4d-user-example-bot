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
      const row = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.SelectMenuBuilder()
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
    let embed = new Discord.EmbedBuilder()
    embed.setColor('ffd1dc');
    embed.setTitle("Commands List")
    embed.setTimestamp()
    embed.setDescription('Please select a option')
    interaction.reply({
      embeds: [embed],
      components: [row]
    });
  },
}
