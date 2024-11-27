const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

// Scrape function to fetch attachments for a specific weapon
const scrapeWeaponAttachments = async (weaponName) => {
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless')).build();

  try {
    await driver.get('https://wzstats.gg/');
    await driver.wait(until.elementLocated(By.className('loadout-content-name')), 10000); // Wait until weapon elements are loaded

    // Find the weapon by name and click it
    const weaponElements = await driver.findElements(By.className('loadout-content-name'));
    let weaponFound = false;
    
    for (let weaponElement of weaponElements) {
      let currentWeaponName = await weaponElement.getText();
      if (currentWeaponName === weaponName) {
        await weaponElement.click();
        weaponFound = true;
        break;
      }
    }

    if (!weaponFound) {
      console.error('Weapon not found:', weaponName);
      return [];
    }

    // Wait for the attachments to load
    await driver.sleep(1500); // Adjust this delay if needed

    // Get the list of attachments
    const attachmentElements = await driver.findElements(By.className('attachment-name-no-image'));
    let attachments = [];
    for (let attachmentElement of attachmentElements) {
      let attachmentName = await attachmentElement.getText();
      attachments.push(attachmentName); // Collect attachments
    }

    return attachments;  // Return the list of attachments for this weapon
  } catch (error) {
    console.error('Error scraping attachments for weapon:', weaponName, error);
    return [];
  } finally {
    await driver.quit();
  }
};

// Scrape the top 5 weapons from the main page and fetch attachments for each
const scrapeWzStats = async () => {
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless')).build();
  const weapons = [];

  try {
    await driver.get('https://wzstats.gg/');
    await driver.wait(until.elementLocated(By.className('loadout-content-name')), 10000); // Wait for weapon elements

    // Get all weapon elements (limit to top 5)
    const weaponElements = await driver.findElements(By.className('loadout-content-name'));
    const topWeapons = weaponElements.slice(0, 5); // Only get the top 5 weapons

    // Loop through each weapon, click it, and get its attachments
    for (let i = 0; i < topWeapons.length; i++) {
      const weaponElement = topWeapons[i];
      const weaponName = await weaponElement.getText();
      console.log(`Clicking on weapon: ${weaponName}`);

      // Click the weapon to show attachments
      await weaponElement.click();
      await driver.sleep(1500);  // Wait for attachments to load

      // Get the attachments for the current weapon
      const attachments = await scrapeWeaponAttachments(weaponName);

      // Add the weapon and its attachments to the weapons array
      weapons.push({ name: weaponName, attachments });
    }

    return weapons;  // Return the array of weapons and their attachments
  } catch (error) {
    console.error('Error scraping WZ Stats:', error);
    return [];
  } finally {
    await driver.quit();
  }
};

module.exports = {
  scrapeWzStats, // Export the scrapeWzStats function
  scrapeWeaponAttachments, // Export the scrapeWeaponAttachments function
};
