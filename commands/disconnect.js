const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel } = require("@discordjs/voice");
const { MessageEmbed } = require("discord.js");

module.exports = {
  djOnly: true,
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnect the bot from vc!"),

  run: async (interaction, client) => {
    const vc = interaction.member.voice.channel;

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
        content: "I'm not on any voice channel yet!",
        ephemeral: true,
      });
    }

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    connection.destroy();

    const embed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setTitle("**Disconnected 👋**")
      .setThumbnail("https://c.tenor.com/U0D6jtPHPeEAAAAC/paz-white-flag.gif")
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
