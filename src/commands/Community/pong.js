const {
  ActionRowBuilder,
  Events,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    // First one is a seceret message that can be dismissed.
    //await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
    // Second one is a message that everyone can see.
    await interaction.reply("Pong!");
    //
    await interaction.followUp("Pong again!");
  },
};
