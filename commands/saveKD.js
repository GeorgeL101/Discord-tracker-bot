const User = require('../models/users');

module.exports = async (interaction) => {
  console.log('saveKD command invoked');
  const user = interaction.options.getUser('user') || interaction.user;
  const kd = interaction.options.getNumber('kd'); // Getting the KD value

  console.log('Target user:', user);
  console.log('KD value provided:', kd);

  if (kd === undefined || isNaN(kd)) {
    return interaction.reply('Please provide a valid KD value.');
  }

  try {
    // Find or create the user in the database
    let userData = await User.findOne({ userId: user.id });
    console.log('User data before update:', userData);

    if (!userData) {
      userData = new User({
        userId: user.id,
        savedWins: 0, // Default saved wins
        kdValue: kd,  // Set the initial KD value
      });
    } else {
      userData.kdValue = kd; // Update the existing KD value
    }

    await userData.save();
    console.log('Saved user data:', userData);

    return interaction.reply(`Successfully updated KD for ${user.username} to ${kd}.`);
  } catch (error) {
    console.error('Error saving KD:', error);
    return interaction.reply('There was an error saving the KD value.');
  }
};
