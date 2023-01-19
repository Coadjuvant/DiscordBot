"use strict";
const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

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
    const kickReason = interaction.options.getString("reason");
    const { id: roleId, name: roleName } = interaction.options.getRole("role");

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
    const membersToKick = interaction.guild.members.cache.filter((member) =>
      member.roles.cache.has(roleId)
    );

    let kicked = 0;
    // Kick the members with the role, no more than one per second
    for (const [, memberToKick] of membersToKick) {
      await memberToKick.kick({
        reason: kickReason,
      });
      kicked++;
      if (kicked % 100 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    console.log(`Kicked ${kicked} members with the role ${roleName}.`);
    // Edit the reply with the number of members kicked
    await interaction.editReply({
      content: `Kicked ${kicked} members with the role ${roleName}.`,
      ephemeral: true,
    });
  },
};
