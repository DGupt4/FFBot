const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear messages")
    .addIntegerOption((option) =>
      option
        .setName("messages")
        .setDescription("Enter number of messages to delete")
        .setRequired(true)
    ),

  run: async (interaction, client) => {
    const msg = interaction.options.getInteger("messages");

    if (interaction.user.id == "437366707049463819") {
      return interaction.reply("Sorry! No dogs allowed! 🐶");
    }

    if (interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      if (msg > 100 || msg < 1) {
        return await interaction.reply({
          content: "You can only delete 1-100 messages at a time",
          ephemeral: true,
        });
      }
      await interaction.channel.bulkDelete(msg);
      await interaction.reply({ content: "Messages deleted", ephemeral: true });
    } else {
      await interaction.reply({
        content: "You do not have the necessary permissions",
        ephemeral: true,
      });
    }
  },
};
