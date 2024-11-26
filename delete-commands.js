require('dotenv').config(); // Load environment variables from .env file
const { REST, Routes } = require('discord.js'); // Import required modules

const clientId = process.env.ClIENT_ID;
const guildId = process.env.GUILD_ID;
const botToken= process.env.BOT_TOKEN;

if (!clientId || !guildId || !botToken) {
    console.error('Missing required environment variables.');
    process.exit(1); // Exit if variables are missing
  }

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Started deleting all commands...');

    // Fetch all existing commands
    const existingCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
    
    // Loop through and delete each command
    for (const command of existingCommands) {
      await rest.delete(Routes.applicationGuildCommand(clientId, guildId, command.id));
      console.log(`Deleted command: ${command.name}`);
    }

    console.log('Successfully deleted all commands.');
  } catch (error) {
    console.error('Error deleting commands:', error);
  }
})();
