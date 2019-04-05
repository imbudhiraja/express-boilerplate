const httpStatus = require('http-status');
const User = require('./api/v1/user/model');
const { Error } = require('./utils/api-response');

const authentication = async (data, socketId) => {
  try {
    let user = await User.findOne({ 'sessions.refresh_token': data.token });

    if (user) {
      user = await User.findOneAndUpdate(
        { 'sessions.refresh_token': data.token },
        { $set: { 'sessions.$.socket_id': socketId } },
        { new: true }
      );
    }

    return user;
  } catch (err) {
    throw new Error({
      message: 'Unauthorized',
      status: httpStatus.UNAUTHORIZED,
    });
  }
};

exports.emitToSocketId = (socketId, eventName, data) => {
  console.log(`Emit ${eventName}`, socketId, data);
  global.io.to(`${socketId}`).emit(eventName, data);
};

exports.emitOverChannel = (eventName, data) => {
  console.log(`Emit over channel ${eventName}`, data);
  global.io.emit(eventName, data);
};

exports.init = async () => {
  global.io.on('connection', async (socket) => {
    const query = socket.request._query;

    authentication(query, socket.id)
      .then((result) => {
        if (result) {
          global.io.to(socket.id).emit('onAuthenticated', true);

          return;
        }

        global.io.to(socket.id).emit('onAuthenticated', false);
        global.io.sockets.sockets[socket.id].disconnect();
      })
      .catch(() => {});
  });
};
