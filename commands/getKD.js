const User = require('../models/users');

module.exports = async (interaction) => {
  const user = interaction.options.getUser('user') || interaction.user; // Get the user
  try {
    const userData = await User.findOne({ userId: user.id });

    if (!userData) {
      return interaction.reply(`${user.username} does not have a recorded KD.`);
    }

    return interaction.reply(`${user.username}'s KD: ${userData.kdValue}`);
  } catch (error) {
    console.error('Error fetching KD:', error);
    return interaction.reply('There was an error fetching the KD value.');
  }
};