const { Joi } = require('express-validation');

module.exports = {
  deleteFile: Joi.object({ params: { _id: Joi.string().required() } }),
  download: {
    params: Joi.object({ _id: Joi.string().required() }),
    query: Joi.object({
      accessToken: Joi.string().required(),
      format: Joi.string()
        .valid('png', 'jpeg', 'jpg', 'mp4', 'mov')
        .default('png'),
      height: Joi.number().required(),
      width: Joi.number().required(),
    }),
  },
};
