const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  djOnly: true,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) =>
      option.setName("song").setDescription("Enter a song").setRequired(true)
    ),

  run: async (interaction, client) => {
    const query = interaction.options.getString("song");
    const vc = interaction.member.voice.channel;

    // if (interaction.user.id == "437366707049463819") {
    //   return interaction.reply("Sorry! No dogs allowed! 🐶");
    // }

    if (!vc) {
      return await interaction.reply({
        content: "Join a voice channel!",
        ephemeral: true,
      });
    }

    const msg = await interaction.reply({
      content: "**Searching** 🔎 `" + query + "`",
      ephemeral: true,
    });

    await client.distube.play(vc, query, {
      textChannel: interaction.channel,
      member: interaction.member,
    });
  },
};
