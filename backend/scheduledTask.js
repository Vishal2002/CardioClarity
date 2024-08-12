const cron = require('node-cron');
const {User} = require('./db');
const controller = require('./controller'); 

async function runCalculationForAllUsers() {
  try {
    const users = await User.find({});
    for (const user of users) {
      await controller.calculateAndStoreScore({ params: { userId: user._id } }, { json: () => {} });
    }
    console.log('Calculation completed for all users');
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
}

cron.schedule('0 */4 * * *', runCalculationForAllUsers);

console.log('Scheduled task set up to run every 4 hours');