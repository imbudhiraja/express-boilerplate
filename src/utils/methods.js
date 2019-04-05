const fs = require('fs');
const sharp = require('sharp');
const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const { DateTime } = require('luxon');
const User = require('../api/v1/user/model');
const { Error } = require('../utils/api-response');
const { jwtSecret } = require('../config');

const capitalizeFirstLetter = (val) => val.charAt(0).toUpperCase() + val.toLowerCase().slice(1);

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

const authorize = async (req, res, next) => {
  try {
    const { accessToken } = req.query;

    const apiError = new Error({
      message: 'Unauthorized',
      status: httpStatus.UNAUTHORIZED,
    });

    if (!accessToken) {
      return next(apiError);
    }

    try {
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

      if (user.status === 'blocked') {
        throw new Error({
          message: 'Your account has been suspended by admin. Please contact us for more information.',
          status: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
        });
      }

      if (user.status === 'deleted') {
        throw new Error({
          message: 'You have deleted you account. Please signup again to continue',
          status: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
        });
      }

      req.user = user;

      return next();
    } catch (e) {
      apiError.message = 'Token Expired';

      return next(apiError);
    }
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

exports.capitalizeFirstLetter = capitalizeFirstLetter;

exports.capitalizeEachLetter = (data) => data
  .toLowerCase()
  .split(' ')
  .map((word) => capitalizeFirstLetter(word))
  .join(' ');

exports.generateRandom = (length = 32, alphanumeric = true) => {
  let data = '';

  let keys = '';

  if (alphanumeric) {
    keys = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  } else {
    keys = '0123456789';
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }

  return data;
};
