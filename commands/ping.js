const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("test!"),

  run: async(interaction, client) => {
    interaction.reply("pong!");
  },
};
