const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  djOnly: false,
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("View the song that's currently playing"),

  run: async (interaction, client) => {
    const vc = interaction.member.voice.channel;
    const queue = client.distube.getQueue(interaction);

    if (!vc) {
      return await interaction.reply("Join a voice channel!");
    }

    if (
      interaction.member.guild.me.voice.channelId !==
      interaction.member.voice.channelId
    ) {
      return await interaction.reply({
        content: "I'm not in the same voice channel!",
        ephemeral: true,
      });
    }

    if (!queue) {
      return await interaction.reply({
        content: "There are no songs playing!",
        ephemeral: true,
      });
    }

    const song = queue.songs[0];

    const embed = new MessageEmbed()
      .setAuthor({ name: "Now Playing" })
      .setDescription(`[${song.name}](${song.url})`)
      .setThumbnail(song.thumbnail)
      .setColor("DARK_BUT_NOT_BLACK")
      .addField("**Views**", song.views.toString(), true)
      .addField(
        "**Duration**",
        `${queue.formattedCurrentTime} / ${song.formattedDuration}`
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
