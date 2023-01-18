const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Shows all members in the Server"),
  async execute(interaction) {
    // Defer the reply to allow the command to finish executing
    await interaction.deferReply();

    // Check if the command is being used in a guild
    if (!interaction.guild) {
      return interaction.editReply({
        content: "This command can only be used in a server",
      });
    }

    // Get all members in the guild
    const members = interaction.guild.members.cache
      .filter((member) => !member.user.bot)
      .map((member) => member.user.username)
      .join(", ");

    // Edit the reply with the list of members
    await interaction.editReply({
      content: `Here are all the members in the server: ${members}`,
    });
  },
};
