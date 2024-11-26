const { EmbedBuilder } = require('discord.js');
const User = require('../models/users'); // Assuming User model exists and contains the user's win data
const { getRankFromWins } = require('../Utils/rankUtils'); // Assuming rank logic is in utils/rankUtil.js

// Function to execute the /rank command and show the rank
const execute = async (interaction) => {
  try {
    // Get the user (either the specified user or the invoking user)
    const user = interaction.options.getUser('user') || interaction.user;
    
    // Find the user in the database
    const userData = await User.findOne({ userId: user.id });
    
    if (!userData) {
      return interaction.reply(`${user.username} has no saved data.`);
    }

    // Get the total wins of the user
    const totalWins = userData.savedWins || 0;

    // Get the user's rank from their total wins
    const rank = getRankFromWins(totalWins);

    // Create an embed to display the rank
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(`${user.username}'s Rank`)
      .setDescription(`**Wins:** ${totalWins}\n**Rank:** ${rank}`)
      .setTimestamp()
      .setFooter({ text: `Ranked on: ${new Date().toLocaleDateString()}` });

    // Reply with the embed showing the user's rank
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error executing /rank command:', error);
    await interaction.reply('There was an error while fetching the rank.');
  }
};

module.exports = { execute }; // Ensure it's exported like this

