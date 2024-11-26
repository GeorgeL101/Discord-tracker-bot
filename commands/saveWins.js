const User = require('../models/users'); // Import User model
const { getRankFromWins } = require('../Utils/rankUtils'); // Import the rank logic

// The function to handle the '/savewins' command
const saveWins = async (interaction) => {
    try {
      const user = interaction.options.getUser('user') || interaction.user;  // Get target user (default to command invoker)
      const userId = user.id;  // Get the user ID from the interaction
      const winsToAdd = interaction.options.getInteger('wins'); // Get the number of wins to add
      
      // Check if winsToAdd is a valid number
      if (isNaN(winsToAdd) || winsToAdd <= 0) {
        return interaction.reply('Please provide a valid number of wins greater than 0.');
      }
  
      // Find the user document in the database
      let dbUser = await User.findOne({ userId });

      if (!dbUser) {
        // If the user doesn't exist, create a new document
        dbUser = new User({ userId, savedWins: winsToAdd });
      } else {
        // If the user exists, add the new wins to their existing total
        // Ensure savedWins is a number
        if (isNaN(dbUser.savedWins)) {
          dbUser.savedWins = 0; // If the savedWins is somehow not a valid number, reset it to 0
        }
        dbUser.savedWins += winsToAdd;
      }
  
      // Calculate and update the user's rank based on their new total wins
      dbUser.rank = getRankFromWins(dbUser.savedWins);
  
      // Save the updated user data
      await dbUser.save();
  
      // Send a response to the user with their updated stats
      await interaction.reply(`${interaction.user.username} added ${winsToAdd} wins to ${user.tag}'s total. ${user.tag} now has ${dbUser.savedWins} wins and is ranked ${dbUser.rank}.`);
    } catch (error) {
      console.error('Error saving wins:', error);
      await interaction.reply('There was an error while saving the wins. Please try again later.');
    }
};

module.exports = saveWins;  // Export saveWins function
