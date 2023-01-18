const {
  SlashCommandBuilder,
  PermissionsBitField,
  GatewayIntentBits,
} = require("discord.js");

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
    // Defer the reply to allow the command to finish executing
    await interaction.deferReply();

    // Get the reason for the kick and the role to kick from the options
    const reason4Kick = interaction.options.getString("reason");
    const role2Kick = interaction.options.getRole("role");
    const roleId = interaction.options.getRole("role").id;

    // Check if the member has the KickMembers permission
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return await interaction.editReply({
        content: "You don't have permission to use this command.",
        ephemeral: true,
      });
    }

    // Get all members with the role to kick
    const membersToKick = interaction.guild.members.cache.filter((member) => {
      return member.roles.cache.has(roleId);
    });
    console.log(membersToKick);

    // Kick the members with the role, no more than one per second
    let kicked = 0;
    for (let i = 0; i < membersToKick.size; i++) {
      const memberToKick = membersToKick.array()[i];
      await memberToKick.kick({
        reason: reason4Kick,
      });
      kicked++;
      if (kicked % 100 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    console.log(`Kicked ${kicked} members with the role ${role2Kick.name}.`);
    // Edit the reply with the number of members kicked
    await interaction.editReply({
      content: `Kicked ${kicked} members with the role ${role2Kick.name}.`,
      ephemeral: true,
    });
  },
};
