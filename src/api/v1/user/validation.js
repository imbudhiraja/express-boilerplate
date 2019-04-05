const Joi = require('joi');

const headers = {
  headers: Joi.object({
    authorization: Joi.string()
      .trim()
      .required()
      .label('Auth Token'),
  }).options({ allowUnknown: true }),
};

module.exports = {
  // POST /v1/user/add-people

  addPeople: {
    ...headers,
    body: {
      user: Joi.array().items(
        Joi.object().keys({
          email: Joi.string()
            .lowercase()
            .trim()
            .required(),
          firstName: Joi.string()
            .required()
            .lowercase()
            .trim(),
          lastName: Joi.string()
            .required()
            .lowercase()
            .trim(),
          role: Joi.string()
            .required()
            .valid(['admin', 'user'])
            .lowercase()
            .trim(),
        })
      ),
    },
  },

  // PUT /v1/user/block-unblock

  blockUnblock: {
    ...headers,
    body: {
      status: Joi.string()
        .required()
        .lowercase()
        .trim()
        .valid(['active', 'blocked']),
    },
    params: { userId: Joi.string().required() },
  },

  // POST /v1/user/change-password
  changePassword: {
    ...headers,
    body: {
      oldPassword: Joi.string()
        .required()
        .trim()
        .min(8)
        .max(16),
      password: Joi.string()
        .required()
        .trim()
        .min(8)
        .max(16),
    },
  },

  // PUT /v1/user/change-role

  changeRole: {
    ...headers,
    body: {
      role: Joi.string()
        .required()
        .lowercase()
        .valid(['admin', 'user'])
        .trim(),
    },
    params: { userId: Joi.string().required() },
  },

  // PUT /v1/user/edit-profile
  editProfile: {
    ...headers,
    body: {
      firstName: Joi.string()
        .required()
        .lowercase()
        .trim(),
      lastName: Joi.string()
        .required()
        .lowercase()
        .trim(),
      photo: Joi.string().optional(),
    },
  },

  // POST /v1/user/forgot-password
  forgotPassword: {
    body: {
      email: Joi.string()
        .required()
        .lowercase()
        .trim(),
    },
  },

  // POST /v1/user/login
  login: {
    body: {
      clientType: Joi.string()
        .valid('browser', 'ios', 'android')
        .lowercase()
        .trim()
        .required(),
      deviceToken: Joi.string()
        .optional()
        .trim()
        .default(''),
      email: Joi.string()
        .required()
        .lowercase()
        .trim()
        .label('Email or phone number'),
      password: Joi.string()
        .min(8)
        .max(16)
        .required()
        .trim(),
    },
  },

  // Get /v1/user/refresh-token
  refreshToken: {
    ...headers,
    body: {
      refreshToken: Joi.string()
        .required()
        .trim(),
    },
  },

  // POST /v1/user/register
  register: {
    body: {
      email: Joi.string()
        .email()
        .lowercase()
        .trim()
        .required(),
      firstName: Joi.string()
        .trim()
        .lowercase()
        .required(),
      lastName: Joi.string()
        .trim()
        .lowercase()
        .required(),
      password: Joi.string()
        .min(8)
        .max(16)
        .required()
        .trim(),
    },
  },

  // POST /v1/user/reset-password
  resetPassword: {
    body: {
      password: Joi.string()
        .required()
        .min(8)
        .trim()
        .max(16),
      token: Joi.string().required(),
    },
  },

  // POST /v1/user/user-available

  userAvailable: {
    ...headers,
    query: {
      email: Joi.string()
        .required()
        .lowercase()
        .trim(),
    },
  },

  // GET /v1/user
  users: {
    ...headers,
    query: {
      companyId: Joi.string().optional(),
      userId: Joi.string().optional(),
    },
  },

  // Get /v1/user/email-verification
  verificationToken: { params: { token: Joi.string().required() } },
};
