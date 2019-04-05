// eslint-disable-next-line no-global-assign
Promise = require('bluebird');
const httpServer = require('http').createServer();
const {
  port, env, socketUrl, socketPort,
} = require('./config');

const server = require('./server');
const database = require('./database');
const scheduler = require('./scheduler');
const {
  createAdmin, counter,
} = require('./bootstrap');

const socket = require('./socket');

global.io = require('socket.io').listen(httpServer);

socket.init();

database.connect();

server.listen(port, () => {
  scheduler(server);
  console.info(`Server started on port ${port} (${env})`);

  createAdmin();
  counter();
});

httpServer.listen(socketPort, socketUrl, () => {
  console.info(`Socket server started on ${socketUrl}:${socketPort}(${env})`);
});

const src = server;

module.exports = src;
