const sendGridEmail = require('@sendgrid/mail');
const config = require('../config');

sendGridEmail.setApiKey(config.emails['api-key']);

module.exports = async (payload) => {
  const msg = {
    from: config.emails.from,
    ...payload,
  };

  console.log('Sending email to: ', payload);

  try {
    const response = await sendGridEmail.send(msg);

    response.forEach((mailStatus) => {
      console.log(`Mail has been sent successfully to ${mailStatus.email}. Mail Status is: ${mailStatus.statusCode}`);
    });
  } catch (err) {
    console.log(`Mail Sent Error. Error Message is: ${err.message}`);
  }
};
