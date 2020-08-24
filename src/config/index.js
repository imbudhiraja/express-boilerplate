require('dotenv').config();

/** Default config will remain same in all environments and can be over-ridded */
let config = {
  allowedMedia: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'avi',
    'mov',
    '3gp',
    'mp4',
    'mkv',
    'mpeg',
    'mpg',
    'mp3',
    'pdf',
  ],
  baseUrl: 'http://localhost:3001',
  ddosConfig: {
    burst: 100,
    limit: 100,
  },
  emails: {
    'api-key':
      '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',
    from: {
      email: 'info@express.com',
      name: 'Express Boilerplate Platform',
    },
    templates: {
      'invite-email': '',
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
  mongo: { uri: 'mongodb://localhost:27017/local-express-boilerplate' },
  port: 8443,
  roles: ['admin', 'user'],
  socketPort: 3002,
  socketUrl: 'localhost',
  twilioConfig: {
    // Your Account SID from www.twilio.com/console
    accountSid: '',
    authToken: '',
    from: '',
  },
  website: 'http://localhost:3000',
  whitelist: null,
};

if (process.env.NODE_ENV === 'staging') {
  config = {
    ...config,
    mongo: { uri: 'mongodb://localhost:27017/staging-express-boilerplate' },
  };
} else if (process.env.NODE_ENV === 'production') {
  config = {
    ...config,
    mongo: { uri: 'mongodb://localhost:27017/production-express-boilerplate' },
    whitelist: null,
  };
}

module.exports = config;
