/* eslint-disable max-lines */
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { DateTime } = require('luxon');
const uuidv4 = require('uuid/v4');
const User = require('./model');
const { Error } = require('../../../utils/api-response');
const { env } = require('../../../config');
const {
  jwtExpirationInterval,
  baseUrl,
  emails: {
    templates: {
      'reset-password': resetPasswordTemplate, verification,
    },
  },
  website,
} = require('../../../config');
const {
  capitalizeEachLetter, generateRandom,
} = require('../../../utils/methods');
const sendMail = require('../../../utils/mail-services');
const { keysToCamel } = require('../../../utils/snake');
const { deleteFile } = require('../files/controller');

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
      access_token: user.token(),
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
      throw new Error({
        message: 'Refresh token did not match',
        status: httpStatus.CONFLICT,
      });
    }

    await User.findOneAndUpdate(
      {
        _id: user._id,
        'sessions.refresh_token': refreshToken,
      },
      { $pull: { sessions: { refresh_token: refreshToken } } }
    );

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
      throw new Error({
        message: 'Refresh token did not match',
        status: httpStatus.CONFLICT,
      });
    }
    const refreshTokenKey = uuidv4() + user._id;

    await User.updateOne(
      {
        _id: user._id,
        'sessions.refresh_token': refreshToken,
      },
      {
        'sessions.$.refresh_token': refreshTokenKey,
        'sessions.$.updated_at': DateTime.local().toSeconds(),
      }
    );

    const expiresIn = DateTime.local()
      .plus({ minutes: jwtExpirationInterval })
      .toSeconds();

    res.set('authorization', user.token());
    res.set('x-refresh-token', refreshTokenKey);
    res.set('x-token-expiry-time', expiresIn);

    return res.status(httpStatus.NO_CONTENT).json();
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
        company_id: 1,
        email: 1,
        first_name: 1,
        is_verified: 1,
        last_name: 1,
        phone: 1,
        photo: 1,
        sessions: 1,
        status: 1,
      }
    );
    const passwordMatches = await user.passwordMatches(password);

    if (!user || !passwordMatches) {
      throw new Error({
        message: 'Credentials did not match',
        status: httpStatus.CONFLICT,
      });
    }

    if (!user.is_verified) {
      throw new Error({
        message: 'Your email address is not verified. Please verify your email to continue.',
        status: httpStatus.NOT_ACCEPTABLE,
      });
    }

    if (user.status === 'blocked') {
      throw new Error({
        message: 'Your account has been suspended by admin.',
        status: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
      });
    }

    if (user.status === 'deleted') {
      throw new Error({
        message: 'You have deleted you account. Please signup again to continue',
        status: httpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
      });
    }

    const token = await generateTokenResponse(user, {
      client_type: clientType,
      device_token: deviceToken,
    });

    res.set('authorization', token.accessToken);
    res.set('x-refresh-token', token.refreshToken);
    res.set('x-token-expiry-time', token.expiresIn);
    res.status(httpStatus.OK);

    return res.json({
      _id: user._id,
      companyId: user.company_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone || null,
      photo: user.photo || null,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Creates a new user if valid details
 * @public
 */

// eslint-disable-next-line consistent-return
exports.register = async (req, res, next) => {
  try {
    const {
      firstName, lastName, email, password,
    } = req.body;

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists) {
      throw new Error({
        message: 'Email address is already exists.',
        status: httpStatus.CONFLICT,
      });
    }
    const token = generateRandom();

    await new User({
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      'verify_tokens.email': token,
    }).save();

    const msg = {
      dynamic_template_data: {
        name: capitalizeEachLetter(`${firstName} ${lastName}`),
        url: `${baseUrl}/v1/user/email-verification/${token}`,
      },
      templateId: verification,
      to: email,
    };

    res.status(httpStatus.CREATED).json();
    sendMail(msg);
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
      is_verified: false,
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
      query: {
        companyId, userId,
      },
    } = req;

    let query = {};

    if (companyId) {
      query = { company_id: companyId };
    } else if (userId) {
      query = { _id: userId };
    } else {
      query = {
        _id: { $nin: user._id },
        role: { $ne: 'admin' },
      };
    }

    const options = {
      _id: 1,
      company_id: 1,
      email: 1,
      first_name: 1,
      is_verified: 1,
      last_name: 1,
      phone: 1,
      photo: 1,
      role: 1,
      status: 1,
    };

    let users = await User.find(query, options);

    if (users.length > 0 && userId) {
      const [singleUser] = users;

      users = keysToCamel(singleUser.toObject());
    } else {
      users = users.map((singleUser) => keysToCamel(singleUser.toObject()));
    }

    return res.status(httpStatus.OK).json(users);
  } catch (error) {
    return next(error);
  }
};

/**
 * Email Verification
 * @private
 */
exports.emailVerification = async (req, res, next) => {
  try {
    const { params: { token } } = req;
    const query = { 'verify_tokens.email': token };
    const update = {
      is_verified: true,
      'verify_tokens.email': '',
    };

    await User.findOneAndUpdate(query, update);

    return res.status(httpStatus.PERMANENT_REDIRECT).redirect(website);
  } catch (error) {
    return next(error);
  }
};

/**
 * Forgot Password
 * @public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { body: { email } } = req;
    const query = { email };

    const user = await User.findOne(query);

    if (!user) {
      throw new Error({
        message: 'Please enter your registered email address.',
        status: httpStatus.BAD_REQUEST,
      });
    }
    const token = generateRandom();
    const msg = {
      dynamic_template_data: {
        name: capitalizeEachLetter(`${user.first_name} ${user.last_name}`),
        url: `${website}/reset-password/${token}`,
      },
      templateId: resetPasswordTemplate,
      to: email,
    };

    await User.findOneAndUpdate(query, { 'verify_tokens.reset_password': token });

    sendMail(msg);

    res.status(httpStatus.NO_CONTENT).json();

    return true;
  } catch (error) {
    return next(error);
  }
};

/**
 * Reset Password
 * @public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const {
      body: {
        password, token,
      },
    } = req;
    const query = { 'verify_tokens.reset_password': token };
    const user = await User.findOne(query);

    if (!user) {
      throw new Error({
        message: 'Not an authorized user',
        status: httpStatus.UNAUTHORIZED,
      });
    }

    const isPasswordMatches = await user.passwordMatches(password);

    if (isPasswordMatches) {
      throw new Error({
        message: 'New password can not same as old password',
        status: httpStatus.CONFLICT,
      });
    }

    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(password, rounds);

    await User.findOneAndUpdate(query, {
      password: hash,
      'verify_tokens.reset_password': '',
    });

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

/**
 * Change Password
 * @public
 */
exports.changePassword = async (req, res, next) => {
  try {
    const {
      body: {
        password, oldPassword,
      },
      user: { _id: userId },
    } = req;

    const query = { _id: userId };
    const user = await User.findOne(query);
    const isPasswordMatches = await user.passwordMatches(oldPassword);
    const isSamePassword = await user.passwordMatches(password);

    if (!isPasswordMatches) {
      throw new Error({
        message: 'Old password does not matched.',
        status: httpStatus.CONFLICT,
      });
    }

    if (isSamePassword) {
      throw new Error({
        message: 'New password can not same as old password.',
        status: httpStatus.CONFLICT,
      });
    }

    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(password, rounds);

    await User.findOneAndUpdate({ _id: user._id }, { password: hash });

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

/**
 * Edit Profile
 * @public
 */

exports.editProfile = async (req, res, next) => {
  try {
    const {
      body: {
        firstName, lastName, photo,
      },
      user,
    } = req;

    if (photo && user.photo && user.photo.toString() !== photo) {
      await deleteFile(user.photo, user._id);
    }

    let updateFields = {
      first_name: firstName,
      last_name: lastName,
    };

    if (photo) {
      updateFields = {
        ...updateFields,
        photo,
      };
    }

    await User.findOneAndUpdate({ _id: user._id }, updateFields);

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};
