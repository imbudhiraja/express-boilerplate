const fs = require('fs');
const sharp = require('sharp');
const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const { DateTime } = require('luxon');
const User = require('../api/v1/user/modal');
const { Error } = require('../utils/api-response');
const { jwtSecret } = require('../config');

exports.snakeToCamelCase = function snakeToCamelCase(params, allowedKeys = []) {
  const response = {};

  Object.keys(params).forEach((d) => {
    if (allowedKeys.length === 0 || (allowedKeys.length > 0 && allowedKeys.includes(d)));
    response[d.replace(/(_\w)/g, (k) => k[1].toUpperCase())] = params[d];
  });

  return response;
};

exports.camelToSnakeCase = function camelToSnakeCase(params, allowedKeys = []) {
  const response = {};

  // eslint-disable-next-line consistent-return
  Object.keys(params).forEach((d) => {
    const upperChars = d.match(/([A-Z])/g);

    if (!upperChars && (allowedKeys.length === 0 || (allowedKeys.length > 0 && allowedKeys.includes(d)))) {
      return d;
    }

    let str = d.toString();

    // eslint-disable-next-line no-plusplus
    for (let i = 0, n = upperChars.length; i < n; i++) {
      str = str.replace(`${new RegExp(upperChars[i])}_${upperChars[i].toLowerCase()}`);
    }

    if (str.slice(0, 1) === '_') {
      str = str.slice(1);
    }
    response[str] = params[d];
  });

  return response;
};

exports.resizeImage = function resizeImage(path, format, width, height) {
  const readStream = fs.createReadStream(path);

  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (width || height) {
    transform = transform.resize(width, height);
  }

  return readStream.pipe(transform);
};

const authorize = async (req, res, next, roles) => {
  try {
    const { accessToken } = req.query;

    const apiError = new Error({
      message: 'Unauthorized',
      status: httpStatus.UNAUTHORIZED,
    });

    if (!accessToken) {
      return next(apiError);
    }

    const tokenResult = jwt.decode(accessToken, jwtSecret);

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

exports.authorize = (req, res, next) => (roles = User.roles) => authorize(req, res, next, roles);
