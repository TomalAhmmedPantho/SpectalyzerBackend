import cron from 'node-cron';
import DataController from './dataEntryController.js'; // Adjust the path as necessary
console.log('DataController:', DataController);
import DataModel from '../models/studentdataentry.js'; // Adjust the path as necessary
import StatisticsModel from '../models/statisticsModel.js'; // Adjust the path as necessary

console.log('Initializing cron job...');

// Define and schedule the cron job
cron.schedule('* * * * *', async () => {
  console.log('Running scheduled calculations...');

  try {
    // Fetch all unique user IDs
    const userIds = await DataModel.distinct('userId');

    for (const userId of userIds) {
      console.log(`Checking for new data for user: ${userId}`);

      // Fetch the most recent entry date in the data model
      const latestDataEntry = await DataModel.findOne({ userId }).sort({ createdAt: -1 });

      // Fetch the most recent calculation date in the statistics model
      const latestStatisticsEntry = await StatisticsModel.findOne({ userId }).sort({ updatedAt: -1 });

      // Determine if new data exists
      const isNewData = latestDataEntry && (!latestStatisticsEntry || latestDataEntry.createdAt > latestStatisticsEntry.updatedAt);

      if (isNewData) {
        console.log(`New data detected for user: ${userId}. Running calculations...`);

        await DataController.calculateMeanAndSD(userId);
        await DataController.calculateStandardizedValues(userId);
        await DataController.calculateWeightedScores(userId);
        await DataController.calculateRowMean(userId);
        await DataController.calculateSDofRM(userId);
        await DataController.finalScore(userId);
      } else {
        console.log(`No new data for user: ${userId}. Skipping calculations.`);
      }
    }

    console.log('Scheduled calculations completed.');
  } catch (error) {
    console.error('Error during scheduled calculations:', error);
  }
});

console.log('Cron job initialized.');

