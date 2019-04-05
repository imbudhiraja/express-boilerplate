const Joi = require('joi');

module.exports = {
  deleteFile: { params: { _id: Joi.string().required() } },
  download: {
    params: { _id: Joi.string().required() },
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
