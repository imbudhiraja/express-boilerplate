const Joi = require('joi');

module.exports = {
  download: {
    query: {
      accessToken: Joi.string().required(),
      format: Joi.string()
        .valid('png', 'jpeg', 'jpg', 'mp4', 'mov')
        .default('png'),
      height: Joi.number().required(),
      width: Joi.number().required(),
    },
  },
};
