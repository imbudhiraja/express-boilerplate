const mongoose = require('mongoose');
const {
  mongo, env,
} = require('./config');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`MongoDB connection error: ${err}`);
  // eslint-disable-next-line no-process-exit
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
  mongoose.set('debug', false);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useCreateIndex: true,
    useNewUrlParser: true,
  });

  return mongoose.connection;
};
