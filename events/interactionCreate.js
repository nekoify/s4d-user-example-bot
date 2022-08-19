const { InteractionType } = require("discord.js")
module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
     if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.interactions.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was a error please try again later",
        ephemeral: true,
      });
    }
  }
}
