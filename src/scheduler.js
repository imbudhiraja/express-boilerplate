const schedule = require('node-schedule');

module.exports = async () => {
  if (process.env.NODE_ENV !== 'development') {
    const rule = new schedule.RecurrenceRule();

    rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
    rule.hour = [12, 24];
    rule.minute = 0;

    schedule.scheduleJob(rule, async () => {});
  }
};
