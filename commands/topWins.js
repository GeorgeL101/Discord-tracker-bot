const { EmbedBuilder } = require('discord.js');
const User = require('../models/users'); // Your User model

// Function to fetch top users
const getTopUsers = async (client) => {
  try {
    const topUsers = await User.find()
      .sort({ savedWins: -1 })  // Sort by 'savedWins' (wins) in descending order
      .limit(10); // Get top 10 users

    // Map over the top users and fetch usernames
    const usersWithWins = await Promise.all(topUsers.map(async (user) => {
      const discordUser = await client.users.fetch(user.userId).catch(() => null); // Fetch user from Discord API
      return {
        username: discordUser ? discordUser.username : 'Unknown User',  // Fallback to 'Unknown User' if the user is not found
        savedWins: user.savedWins || 0,  // Use savedWins here instead of savedValue
      };
    }));

    return usersWithWins;
  } catch (error) {
    console.error('Error fetching top users:', error);
    throw error;
  }
};

// Function to send the top wins leaderboard embed (called by /topwins command or scheduled task)
const execute = async (interaction, client) => {
  try {
    const topUsers = await getTopUsers(client);

    if (topUsers.length === 0) {
      return interaction.reply("No top users found. Be sure to add wins first.");
    }

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
        value: `**${user.savedWins}** wins`,  // Ensure that savedWins is displayed correctly
      });
    });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error executing topwins command:', error);
    await interaction.reply('There was an error while fetching the top users.');
  }
};

module.exports = { getTopUsers, execute };
