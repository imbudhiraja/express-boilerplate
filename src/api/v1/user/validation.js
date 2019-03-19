const Joi = require('joi');

module.exports = {
  // POST /v1/auth/login
  login: {
    body: {
      clientType: Joi.string()
        .valid('browser', 'ios', 'android')
        .required(),
      deviceToken: Joi.string().optional(),
      email: Joi.string()
        .required()
        .label('Email or phone number'),
      password: Joi.string()
        .min(8)
        .required(),
    },
  },

  // Post /v1/auth/rereshToken
  refreshToken: { body: { refreshToken: Joi.string().required() } },

  // POST /v1/auth/register
  register: {
    body: {
      brandName: Joi.string()
        .lowercase()
        .required(),
      clientType: Joi.string()
        .valid('browser', 'ios', 'android')
        .required(),
      deviceToken: Joi.string().optional(),
      email: Joi.string()
        .email()
        .lowercase()
        .required(),
      password: Joi.string()
        .min(8)
        .required(),
    },
  },
};
