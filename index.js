require('dotenv').config(); // Load environment variables from .env file
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js'); // Import Discord.js components
const connectDB = require('./database'); // Import database connection function
const saveWins = require('./commands/saveWins'); // Import saveWins command
const getWins = require('./commands/getWins'); // Import getWins command
const topWins = require('./commands/topWins'); // Import topwins command
const saveKD = require('./commands/saveKD'); // Import saveKD command
const getKD = require('./commands/getKD'); // Import getKD command
const topKD = require('./commands/topKD'); // Import topKD command
const rank= require('./commands/rank') //import rank command
const cron = require('node-cron'); // Import node-cron to schedule tasks
const meta = require('./commands/meta');


// Initialize the Discord bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Intents needed for guild-based events
    GatewayIntentBits.GuildMessages, // Intents for reading messages
    GatewayIntentBits.MessageContent, // Intents for accessing message content
  ],
});

// When the bot is ready, log the bot's username
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Handle interactions (slash commands) from Discord
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Handle the '/savewins' command
  if (commandName === 'savewins') {
    await saveWins(interaction); // Call the saveWins function
  }

  // Handle the '/getwins' command
  if (commandName === 'getwins') {
    await getWins(interaction); // Call the getWins function
  }

  // Handle the '/topwins' command
  if (commandName === 'topwins') {
    await topWins.execute(interaction, client); // Get the top users and reply with the embed
  }

  // Handle the '/savekd' command (NEW)
  if (commandName === 'savekd') {
    await saveKD(interaction); // Call the saveKD function
  }

  // Handle the '/getkd' command (NEW)
  if (commandName === 'getkd') {
    await getKD(interaction); // Call the getKD function
  }

  // Handle the '/topkd' command (NEW)
  if (commandName === 'topkd') {
    await topKD.execute(interaction, client); // Get the top KD users and reply with the embed
  }

  // Handle the /rank command
  if (commandName === 'rank') {
    await rank.execute(interaction); // Call the execute function from the rank.js handler
  }
  
  if (commandName == 'meta'){
    await meta.execute(interaction)
  }

});

// Function to send the 'Top Wins' embed automatically (every Monday at 8 AM)
const sendTopWinsEmbed = async (channel) => {
  try {
    const topUsers = await topWins.getTopUsers(client); // Get the top users based on wins
    if (topUsers.length === 0) {
      console.log('No users found for topwins embed.');
      return;
    }

    // Create the embed with the top 10 users and their wins
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 **Top 10 Users with the Highest Wins** 🏆')
      .setDescription('Here are the top 10 users with the most wins:')
      .setTimestamp()
      .setFooter({ text: `Week of ${new Date().toLocaleDateString()}` });

    // Add the top users to the embed
    topUsers.forEach((user, index) => {
      embed.addFields({
        name: `**#${index + 1}** ${user.username}`,
        value: `**${user.savedWins}** wins`,
      });
    });

    // Send the embed to the specified channel
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending topwins embed:', error);
  }
};

// Function to send the 'Top KD' embed automatically (every Monday at 8 AM)
const sendTopKDEmbed = async (channel) => {
  try {
    const topUsers = await topKD.getTopUsers(client); // Get the top users based on KD
    if (topUsers.length === 0) {
      console.log('No users found for topkd embed.');
      return;
    }

    // Create the embed with the top 10 users and their KD
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 **Top 10 Users with the Highest KD** 🏆')
      .setDescription('Here are the top 10 users with the highest KD:')
      .setTimestamp()
      .setFooter({ text: `Week of ${new Date().toLocaleDateString()}` });

    // Add the top users to the embed
    topUsers.forEach((user, index) => {
      embed.addFields({
        name: `**#${index + 1}** ${user.username}`,
        value: `**${user.savedKD}** KD`,
      });
    });

    // Send the embed to the specified channel
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending topkd embed:', error);
  }
};

// Schedule both 'Top Wins' and 'Top KD' leaderboard every Monday at 8 AM
cron.schedule('0 8 * * 1', async () => {
  const channel = await client.channels.fetch(process.env.CHANNEL_ID); // Get the channel by ID from .env
  if (channel) {
    await sendTopWinsEmbed(channel); // Send the Top Wins embed
    await sendTopKDEmbed(channel);   // Send the Top KD embed
  } else {
    console.log('Channel not found!');
  }
});

// Connect to MongoDB (handle DB connection)
connectDB();

// Log in to Discord using the bot token
client.login(process.env.BOT_TOKEN).catch((error) => {
  console.error('Error logging in to Discord:', error);
});
