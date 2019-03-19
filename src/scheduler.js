const schedule = require('node-schedule');

module.exports = async () => {
  if (process.env.NODE_ENV !== 'local') {
    schedule.scheduleJob(
      {
        hour: 0,
        minute: 0,
      },
      async () => true
    );
  }
};
