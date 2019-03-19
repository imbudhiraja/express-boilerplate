const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const { DateTime } = require('luxon');
const User = require('../api/v1/user/modal');
const { Error } = require('../utils/api-response');
const { jwtSecret } = require('../config');

const authorize = async (req, res, next, roles) => {
  try {
    const { authorization } = req.headers;

    const apiError = new Error({
      message: 'Unauthorized',
      status: httpStatus.UNAUTHORIZED,
    });

    if (!authorization) {
      return next(apiError);
    }

    const token = authorization.split(' ')[1];
    const tokenResult = jwt.decode(token, jwtSecret);

    if (!tokenResult || !tokenResult.exp || !tokenResult._id) {
      apiError.message = 'Malformed Token';

      return next(apiError);
    }

    if (tokenResult.exp - DateTime.local().toSeconds() < 0) {
      apiError.message = 'Token Expired';

      return next(apiError);
    }

    const user = await User.findById(tokenResult._id);

    if (!user) {
      return next(apiError);
    }

    if (roles && user.role !== 'admin' && !roles.includes(user.role)) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';

      return next(apiError);
    }
    req.user = user;

    return next();
  } catch (e) {
    return next(
      new Error({
        message: httpStatus[500],
        status: httpStatus.INTERNAL_SERVER_ERROR,
      })
    );
  }
};

exports.authorize = (roles = User.roles) => (req, res, next) => authorize(req, res, next, roles);
