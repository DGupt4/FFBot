const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  djOnly: false,
  data: new SlashCommandBuilder().setName("ping").setDescription("test!"),

  run: async(interaction, client) => {
    interaction.reply("pong!");
  },
};
