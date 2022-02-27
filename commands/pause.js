const { SlashCommandBuilder } = require("@discordjs/builders");
const { InteractionCollector } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song"),

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

    if (!queue) {
      return interaction.reply({
        content: "There's nothing to pause",
        ephemeral: true,
      });
    }

    try {
      await client.distube.pause(interaction);

      const embed = new MessageEmbed()
        .setColor("DARK_BUT_NOT_BLACK")
        .setThumbnail("https://c.tenor.com/U0D6jtPHPeEAAAAC/paz-white-flag.gif")
        .setTitle("**Song Paused ⏸️**")
        .setDescription("PauseChamp")
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.avatarURL(),
        });

      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply({
        content: "The music has already been paused",
        ephemeral: true,
      });
    }
  },
};
