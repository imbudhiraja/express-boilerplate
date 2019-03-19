const Twilio = require('twilio');
const { twilioConfig } = require('../config');

const client = new Twilio(twilioConfig.accountSid, twilioConfig.authToken);

exports.sendSMS = (params) => client.messages.create({
  ...params,
  from: twilioConfig.from,
});
