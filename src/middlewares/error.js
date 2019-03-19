const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const { Error } = require('../utils/api-response');
const { env } = require('../config');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    errors: err.errors,
    message: err.message || httpStatus[err.status],
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }
  if (err.status) {
    res.status(err.status);
  } else {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
  res.json(response);
};

exports.handler = handler;

/**
 * If error is not an instanceOf {Error}, convert it.
 * @public
 */
// eslint-disable-next-line no-unused-vars
exports.converter = (err, req, res, next) => {
  let convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    let customMsg = '';

    err.errors.forEach((element) => {
      customMsg += `${element.field.join('.')}, `;
    });
    customMsg = customMsg.substring(0, customMsg.length - 2);
    convertedError = new Error({
      errors: err.errors,
      message: `Please enter valid ${customMsg}`,
      stack: err.stack,
      status: err.status,
    });
  } else if (!(err instanceof Error)) {
    convertedError = new Error({
      message: err.message,
      stack: err.stack,
      status: err.status,
    });
  }

  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res) => {
  const err = new Error({
    message: 'Not found',
    status: httpStatus.NOT_FOUND,
  });

  return handler(err, req, res);
};
