const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Util, Message } = require("discord.js");

module.exports = {
  djOnly: false,
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View the current queue"),

  timeout: 500,

  run: async (interaction, client) => {
    const vc = interaction.member.voice.channel;
    const queue = client.distube.getQueue(interaction);

    if (!vc) {
      return interaction.reply("Join a voice channel!");
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

    const q = queue.songs
      .map((song, i) => {
        return `${i === 0 ? "**Playing:**" : `**${i}.**`} ${song.name} - \`${
          song.formattedDuration
        }\``;
      })
      .join("\n");

    let y = await Util.splitMessage(q, { maxLength: 1500 });
    const embed = new MessageEmbed()
      .setDescription(`**Current Queue** \n\n  ${y}`)
      .setColor("DARK_BUT_NOT_BLACK")
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL(),
      })
      .addField(
        "**Loop**",
        queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "✅") : "❌"
      );

    interaction.reply({ embeds: [embed] });
  },
};
