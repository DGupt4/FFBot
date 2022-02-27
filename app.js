require("dotenv").config();
const fs = require("fs");
const distube = require("distube");
const Cooldown = new Set();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("The bot is online");
  const CLIENT_ID = client.user.id;
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  (async () => {
    try {
      if (process.env.ENV === "production") {
        await rest.put(Routes.applicationCommand(CLIENT_ID), {
          body: commands,
        });
        console.log("Commands have been registered globally");
      } else {
        await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
          { body: commands }
        );
        console.log("Commands have been registered locally");
      }
    } catch (err) {
      if (err) console.log(err);
    }
  })();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.run(interaction, client);
  } catch (err) {
    if (err) console.error(err);
    await interaction.reply({
      content: "An error has occured",
      ephemeral: true,
    });
  }
});

client.distube = new distube.default(client, {
  youtubeDL: false,
  leaveOnEmpty: true,
  emptyCooldown: 30,
  leaveOnFinish: true,
  emitNewSongOnly: true,
  updateYouTubeDL: true,
  nsfw: true,
});

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube
  .on("addSong", (queue, song) => {
    const embed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setThumbnail(song.thumbnail)
      .setDescription(`**[${song.name}](${song.url})**`)
      .addField("**Duration:**", song.formattedDuration.toString(), true)
      .setFooter({
        text: `Requested by ${song.user.username}`,
        iconURL: song.user.avatarURL(),
      });
    queue.textChannel.send({ embeds: [embed] });
  })
  .on("addList", (queue, song) => {
    const embed = new MessageEmbed()
      .setColor("DARK_BUT_NOT_BLACK")
      .setThumbnail(song.thumbnail)
      .setDescription(`**[${song.name}](${song.url}) - Playlist**`)
      .addField("**Duration:**", song.formattedDuration.toString(), true)
      .setFooter({
        text: `Requested by ${song.user.username}`,
        iconURL: song.user.avatarURL(),
      });
    queue.textChannel.send({ embeds: [embed] });
  })
  .on("error", (textChannel, e) => {
    console.error(e);
    textChannel.send(`An error encountered: ${e.message.slice(0, 2000)}`);
  })
  .on("disconnect", (queue) => {})
  .on("playSong", (queue, song) => {});

client.login(process.env.TOKEN);
