// eslint-disable-next-line no-global-assign
Promise = require('bluebird');
const {
  port, env,
} = require('./config');

const server = require('./server');
const database = require('./database');
const scheduler = require('./scheduler');

database.connect();

server.listen(port, () => {
  scheduler(server);
  console.info(`server started on port ${port} (${env})`);
});

const src = server;

module.exports = src;
