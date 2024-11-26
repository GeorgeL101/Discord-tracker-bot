const User = require('../models/users');

const getWins = async (interaction) => {
  const user = interaction.options.getUser('user') || interaction.user; // Get user from options or the command sender

  try {
    const userData = await User.findOne({ userId: user.id });

    if (!userData) {
      return interaction.reply(`${user.tag} has no recorded wins.`);
    }

    interaction.reply(`${user.tag} has ${userData.savedWins} wins.`);
  } catch (error) {
    console.error('Error fetching value:', error);
    interaction.reply('There was an error fetching the value.');
  }
};

module.exports = getWins;
