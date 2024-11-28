const { scrapeWzStats } = require('../Utils/scrape');
const { EmbedBuilder } = require('discord.js');

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
      console.log(weapons);  // Log the weapons data for debugging

      if (weapons.length === 0) {
        await interaction.editReply('Sorry, there was an error retrieving the weapon data.');
        return;
      }

      // Create the embed message
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Top 5 Weapons and Attachments')
        .setDescription('Here are the top 5 weapons and their attachments from WZ Stats.')
        .setTimestamp()
        .setFooter({ text: 'Data from WZ Stats' });

      // Add fields for each weapon and attachments
      weapons.forEach((weapon) => {
        let attachmentList = weapon.attachments.length > 0
          ? weapon.attachments.map((attachment, idx) => `${idx + 1}. ${attachment}`).join('\n')
          : 'No attachments found.';

        embed.addFields({
          name: `**${weapon.name}**`,
          value: attachmentList,
          inline: false,
        });
      });

      // Send the embed
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('Error executing meta command:', error);
      await interaction.editReply('There was an error processing your request.');
    }
  },
};
