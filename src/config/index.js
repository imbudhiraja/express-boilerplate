require('dotenv').config();

const config = {
  allowedMedia: ['jpg', 'jpeg', 'png', 'gif', 'avi', 'mov', '3gp', 'mp4', 'mkv', 'mpeg', 'mpg', 'mp3', 'pdf'],
  baseUrl: process.env.BASE_URL,
  ddosConfig: {
    burst: process.env.DDOS_BRUST,
    limit: process.env.DDOS_LIMIT,
  },
  emails: {
    'api-key': process.env.SEND_GRID_API_KEY,
    from: {
      email: process.env.SENDER_EMAIL,
      name: process.env.SENDER_NAME,
    },
    templates: {
      'invite-email': process.env.INVITE_EMAIL_TEMPLATE,
      'reset-password': process.env.RESET_PASSWORD_EMAIL_TEMPLATE,
      verification: process.env.VERIFICATION_EMAIL_TEMPLATE,
    },
  },
  env: process.env.NODE_ENV,
  fcm: { 'server-key': process.env.FCM_SERVER_KEY },
  // JWT expiry time in minutes
  jwtExpirationInterval: process.env.JWT_EXPIRATION_INTERVAL,
  jwtSecret: process.env.JWT_SECRET,
  mediaTypes: ['photo', 'video', 'document'],
  mongo: { uri: process.env.DB_CONNECTION_STRING },
  port: process.env.PORT,
  roles: ['admin', 'user'],
  socketPort: process.env.SOCKET_PORT,
  socketUrl: process.env.SOCKET_URL,
  twilioConfig: {
    // Your Account SID from www.twilio.com/console
    accountSid: process.env.TWILIO_ACCOUNT_ID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_NUMBER,
  },
  website: process.env.WEBSITE,
  whitelist: [null, undefined, 'null'].includes(process.env.WHITE_LIST) ? null : process.env.WHITE_LIST.split(','),
};

module.exports = config;
