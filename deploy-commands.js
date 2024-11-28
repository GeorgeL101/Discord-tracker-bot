const { SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const clientId = process.env.ClIENT_ID;
const guildId = process.env.GUILD_ID;
const botToken= process.env.BOT_TOKEN;

if (!clientId || !guildId || !botToken) {
    console.error('Missing required environment variables.');
    process.exit(1); // Exit if variables are missing
  }

const commands = [
  new SlashCommandBuilder()
    .setName('savewins')
    .setDescription('Add wins to a user\'s total.')
    .addIntegerOption(option =>
      option.setName('wins')
        .setDescription('The number of wins to add.')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to save the wins for')
        .setRequired(false)),
  
  new SlashCommandBuilder()
    .setName('getwins')
    .setDescription('Get a user\'s total wins.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get the wins for')
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName('topwins')
    .setDescription('Shows the top users with the highest wins'),

  new SlashCommandBuilder()
    .setName('savekd')
    .setDescription('Add a user\'s KD ratio.')
    .addNumberOption(option =>
      option.setName('kd')
        .setDescription('The KD ratio to add.')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to save the KD ratio for')
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName('getkd')
    .setDescription('Get a user\'s KD ratio.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get the KD ratio for')
        .setRequired(false)),

  new SlashCommandBuilder()
    .setName('topkd')
    .setDescription('Shows the top users with the highest KD'),

    // Add the '/rank' command to display a user's rank based on their wins
  new SlashCommandBuilder()
  .setName('rank')
  .setDescription('Check a user\'s rank based on their total wins')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to check the rank for')
      .setRequired(false)), // Defaults to invoking user if not specified

  new SlashCommandBuilder()
  .setName("meta")
  .setDescription("Meta for guns ")
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),  // This registers commands only for your guild
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
