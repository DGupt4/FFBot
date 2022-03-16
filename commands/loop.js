const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { EmbedMessage } = require("discord.js");

module.exports = {
  djOnly: true,
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops the current song"),

  run: async (interaction, client) => {
    const vc = interaction.member.voice.channel;
    const queue = client.distube.getQueue(interaction);

    if (interaction.user.id == "437366707049463819") {
      return interaction.reply("Sorry! No dogs allowed! 🐶");
    }

    if (!vc) {
      return interaction.reply({
        content: "Join a voice channel!",
        ephemeral: true,
      });
    }

    if (
      interaction.member.guild.me.voice.channelId !==
      interaction.member.voice.channelId
    ) {
      return interaction.reply({
        content: "I'm not in the same voice channel!",
        ephemeral: true,
      });
    }

    const embed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setThumbnail("https://c.tenor.com/U0D6jtPHPeEAAAAC/paz-white-flag.gif")

      .setDescription("More more more!")
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      });

    if (client.distube.setRepeatMode(queue) == 2) {
      client.distube.setRepeatMode(queue, 0);
      embed.setTitle("**Loop Disabled 🔁**");
    } else {
      embed.setTitle("**Loop Enabled 🔁**");
    }

    await interaction.reply({ embeds: [embed] });
  },
};
