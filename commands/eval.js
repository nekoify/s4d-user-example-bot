const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const fetch = require('cross-fetch')

const Discord = require("discord.js")
const fs = require("fs")
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('eval')
  .addStringOption(option =>
      option.setName('code').setDescription('JS Code').setRequired(true)),

  async execute(interaction, client) {

 var code = interaction.options.getString('code');
      if (interaction.user.id == '416508744097071107') {
        try {
        eval("(async () => {" + code + "})()")
          }
        catch (err) {
         await interaction.reply(String(err))
        
        }

      }
  },
}
