const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  djOnly: true,
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song!"),

  run: async (interaction, client) => {
    const vc = interaction.member.voice.channel;
    const queue = client.distube.getQueue(interaction);

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
        content: "We are not in the same voice channel!",
        ephemeral: true,
      });
    }

    if (queue.songs.length == 1) {
      const connection = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      connection.destroy();
    } else {
      await client.distube.skip(interaction);
    }

    const embed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setThumbnail("https://c.tenor.com/U0D6jtPHPeEAAAAC/paz-white-flag.gif")
      .setTitle("**Song Skipped ⏭️**")
      .setDescription("Go next song!")
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
