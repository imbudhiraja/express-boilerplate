// const RefreshToken = require('./refreshToken.model');
// const moment = require('moment-timezone');
const httpStatus = require('http-status');
const { DateTime } = require('luxon');
const uuidv4 = require('uuid/v4');
const User = require('./modal');
const APIError = require('../../../utils/api-error');
const { jwtExpirationInterval } = require('../../../config');
const { snakeToCamelCase } = require('../../../utils/methods');

/**
 * @async
 * Returns a formated object with tokens
 * @param {object} user object
 * @param {string} accessToken token
 * @param {string} refreshObjectId _id of refreshToken if planning to update previous one
 * @returns {object} access token object
 * @private
 */
async function generateTokenResponse(user, deviceInfo) {
  const refreshToken = uuidv4() + user._id;

  // eslint-disable-next-line no-param-reassign
  user.sessions = [
    ...user.sessions,
    {
      ...deviceInfo,
      created_at: DateTime.local().toSeconds(),
      is_active: true,
      refresh_token: refreshToken,
    },
  ];
  user.save();

  const expiresIn = DateTime.local()
    .plus({ minutes: jwtExpirationInterval })
    .toSeconds();

  return {
    accessToken: user.token(),
    expiresIn,
    refreshToken,
  };
}

/**
 * Logout
 * @public
 */
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findOne({
      sessions: {
        $elemMatch: {
          is_active: true,
          refresh_token: refreshToken,
        },
      },
    });

    if (!user) {
      throw new APIError({
        message: 'Refresh token did not match',
        status: httpStatus.CONFLICT,
      });
    }

    const sessions = user.sessions.map((token) => {
      const cloneToken = { ...token };

      if (cloneToken.refresh_token === refreshToken) {
        cloneToken.is_active = false;
        cloneToken.updated_at = DateTime.local().toSeconds();
      }

      return cloneToken;
    });

    await User.updateOne({ _id: user._id }, { sessions });

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

/**
 * Refresh token function to get new access token
 * @public
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findOne({
      sessions: {
        $elemMatch: {
          is_active: true,
          refresh_token: refreshToken,
        },
      },
    });

    if (!user) {
      throw new APIError({
        message: 'Refresh token did not match',
        status: httpStatus.CONFLICT,
      });
    }
    const refreshTokenKey = uuidv4() + user._id;

    const sessions = user.sessions.map((token) => {
      const cloneToken = { ...token };

      if (cloneToken.refresh_token === refreshToken) {
        cloneToken.refresh_token = refreshTokenKey;
        cloneToken.updated_at = DateTime.local().toSeconds();
      }

      return cloneToken;
    });

    await User.updateOne({ _id: user._id }, { sessions });

    const expiresIn = DateTime.local()
      .plus({ minutes: jwtExpirationInterval })
      .toSeconds();

    res.status(httpStatus.OK);

    return res.json({
      token: {
        accessToken: user.token(),
        expiresIn,
        refreshToken: refreshTokenKey,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Login with an existing user
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const {
      email, password, clientType, deviceToken,
    } = req.body;
    const user = await User.findOne(
      { email },
      {
        _id: 1,
        email: 1,
        first_name: 1,
        last_name: 1,
        phone: 1,
        sessions: 1,
        status: 1,
      }
    );

    if (!user || !user.passwordMatches(password)) {
      throw new APIError({
        message: 'Credentials did not match',
        status: httpStatus.CONFLICT,
      });
    }

    if (user.status === 'blocked') {
      throw new APIError({
        message: 'Your account has been suspended by admin.',
        status: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
      });
    }

    if (user.status === 'deleted') {
      throw new APIError({
        message: 'You have deleted you account. Please signup again to continue',
        status: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
      });
    }

    const token = await generateTokenResponse(user, {
      client_type: clientType,
      device_token: deviceToken,
    });

    res.set('Authorization', token.accessToken);
    res.set('x-refresh-token', token.refreshToken);
    res.set('x-token-expiry-time', token.expiresIn);
    res.status(httpStatus.OK);

    console.log('snakeToCamelCase==> ', snakeToCamelCase(user));

    return res.json({
      _id: user._id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Creates a new user if valid details
 * @public
 */
exports.signup = async (req, res, next) => {
  try {
    const {
      firstName, lastName, email, password, clientType, deviceToken,
    } = req.body;

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists) {
      throw new APIError({
        message: 'Email address is already exists',
        status: httpStatus.CONFLICT,
      });
    }

    const user = await new User({
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    }).save();

    const token = await generateTokenResponse(user, {
      client_type: clientType,
      device_token: deviceToken,
    });

    res.set('Authorization', token.accessToken);
    res.set('x-refresh-token', token.refreshToken);
    res.set('x-token-expiry-time', token.expiresIn);
    res.status(httpStatus.CREATED);

    return res.json({
      _id: user._id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const { user } = req;

    const query = { _id: user._id };
    const update = {
      first_name: '',
      is_deleted: true,
      last_name: '',
      password: '',
      phone: '',
      role: '',
      sessions: [],
      status: 'deleted',
      updated_at: DateTime.local().toSeconds(),
    };

    await User.findOneAndUpdate(query, update);

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

exports.users = async (req, res, next) => {
  try {
    const {
      user,
      params: { userId },
    } = req;

    let query = {};

    if (userId) {
      query = { _id: userId };
    } else {
      query = { _id: { $nin: user._id } };
    }

    const options = {
      email: 1,
      first_name: 1,
      last_name: 1,
      phone: 1,
      photo: 1,
      role: 1,
      status: 1,
    };

    let users = await User.find(query, options);

    if (userId) {
      // eslint-disable-next-line prefer-destructuring
      users = users[0];
    }

    return res.status(httpStatus.OK).json(users);
  } catch (error) {
    return next(error);
  }
};
