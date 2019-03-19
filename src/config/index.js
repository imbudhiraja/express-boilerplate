require('dotenv').config();

/** Default config will remain same in all environments and can be overrided */
let config = {
  allowedMedia: ['jpg', 'jpeg', 'png', 'gif', 'avi', 'mov', '3gp', 'mp4', 'mkv', 'mpeg', 'mpg', 'mp3', 'pdf'],
  ddosConfig: {
    burst: 100,
    limit: 100,
  },
  emails: {
    'api-key': '',
    from: 'info@expressjs.com',
    templates: {
      'reset-password': '',
      verification: '',
    },
  },
  env: process.env.NODE_ENV,
  fcm: { 'server-key': '' },
  // JWT expiry time in minutes
  jwtExpirationInterval: 60 * 12,
  jwtSecret: 'qweqweuiquhjkdncjnzxncb12ne23h194y12u84134234h2j34h3',
  mediaTypes: ['photo', 'video', 'document'],
  mongo: { uri: 'mongodb://localhost:27017/express-boilerplate' },
  port: 3001,
  roles: ['user', 'admin'],
  twilioConfig: {
    // Your Account SID from www.twilio.com/console
    accountSid: '',
    authToken: '',
    from: '',
  },
  whitelist: null,
};

if (process.env.NODE_ENV === 'production') {
  config = { ...config };
} else if (process.env.NODE_ENV === 'staging') {
  config = { ...config };
}

module.exports = config;
