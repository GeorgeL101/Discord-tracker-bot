const { scrapeWzStats } = require('../Utils/scrape');  // Ensure the path is correct

module.exports = {
  data: {
    name: 'meta',
    description: 'Fetch the top 5 weapons and their attachments from WZ Stats',
  },
  
  async execute(interaction) {
    try {
      // Acknowledge the interaction immediately (this prevents the timeout error)
      await interaction.deferReply();  

      // Scrape the top 5 weapons with their attachments
      const weapons = await scrapeWzStats();

      if (weapons.length === 0) {
        await interaction.editReply('Sorry, there was an error retrieving the weapon data.');
        return;
      }

      let responseMessage = 'Top 5 Weapons and Attachments:\n';

      weapons.forEach((weapon) => {
        responseMessage += `**${weapon.name}**\n`;
        if (weapon.attachments.length === 0) {
          responseMessage += '  No attachments found.\n';
        } else {
          weapon.attachments.forEach((attachment, idx) => {
            responseMessage += `  ${idx + 1}. ${attachment}\n`;
          });
        }
        responseMessage += '\n';  // Separate each weapon by a blank line
      });

      // Edit the deferred reply with the actual message
      await interaction.editReply(responseMessage);

    } catch (error) {
      console.error('Error executing meta command:', error);
      await interaction.editReply('There was an error processing your request.');
    }
  },
};
