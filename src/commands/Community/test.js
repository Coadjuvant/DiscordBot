const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge server of role")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Which role to purge")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for purge.")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const reason4Kick = interaction.options.getString("reason");
    const role2Kick = interaction.options.getRole("role");
    if (
      !interaction.member?.permissions?.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      await interaction.editReply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
    } else {
      let kicked = [];
      let guild = interaction.guild;
      guild.members.cache.forEach((member) => {
        if (member.roles.cache.has(role2Kick) && !member.user.bot) {
          kicked.push(member);
          member.kick({
            reason: reason4Kick,
          });
        }
      });
      interaction.editReply({
        content: `Successfully kicked all members with the role "${role2Kick}"`,
        ephemeral: true,
      });
    }
  },
};
