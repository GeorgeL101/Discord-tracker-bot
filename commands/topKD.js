// commands/topKD.js

const { EmbedBuilder } = require('discord.js');
const User = require('../models/users'); // Import User model

// Function to fetch the top 10 users based on the kdValue (Kill/Death Ratio)
const getTopUsers = async (client) => {
  try {
    // Fetch the top 10 users sorted by the 'kdValue' (Kill/Death Ratio)
    const topUsers = await User.find()
      .sort({ kdValue: -1 })  // Sort by 'kdValue' in descending order
      .limit(10);  // Get the top 10 users

    // Map the users to include their usernames and KD values
    const usersWithKD = topUsers.map(user => ({
      username: client.users.cache.get(user.userId)?.username || 'Unknown User', // Get the username from Discord
      kdValue: user.kdValue,  // The Kill/Death Ratio
    }));

    return usersWithKD;
  } catch (error) {
    console.error('Error fetching top KD users:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Function to send the top users as an embed (called from index.js or other places)
const execute = async (interaction, client) => {
  try {
    const topUsers = await getTopUsers(client);

    if (topUsers.length === 0) {
      return interaction.reply("No top users found. Be sure to add KD values first.");
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 **Top 10 Users with the Highest Kill/Death Ratios (KD)** 🏆')
      .setDescription('Here are the top 10 users with the most impressive KD ratios:')
      .setTimestamp()
      .setFooter({ text: `Week of ${new Date().toLocaleDateString()}` });

    topUsers.forEach((user, index) => {
      embed.addFields({
        name: `**#${index + 1}** ${user.username}`,
        value: `**${user.kdValue.toFixed(2)}** KD`,
      });
    });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error executing topKD command:', error);
    await interaction.reply('There was an error while fetching the top KD users.');
  }
};

module.exports = { getTopUsers, execute };
