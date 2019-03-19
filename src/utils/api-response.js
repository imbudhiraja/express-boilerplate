const httpStatus = require('http-status');

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor({
    message, errors, status, isPublic, stack,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    // This is required since bluebird 4 doesn't append it anymore.
    this.isOperational = true;
    this.stack = stack;
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class ApiError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor({
    message, errors, stack, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false,
  }) {
    super({
      errors,
      isPublic,
      message,
      stack,
      status,
    });
  }
}

/**
 * @function Api succes response
 * @param {string} typeOrMessage Can be "FETCH","UPDATE","DELETE" or any custom message
 * @param {any} data Any data type array, object etc.
 */
function success(typeOrMessage, data = null) {
  let message = '';

  switch (typeOrMessage) {
    case 'FETCH':
      message = 'Data fetched successfully';
      break;

    case 'UPDATE':
      message = 'Data updated successfully';
      break;

    case 'DELETE':
      message = 'Data deleted successfully';
      break;

    default:
      message = typeOrMessage;
      break;
  }

  return {
    data,
    message,
  };
}

module.exports = {
  Error: ApiError,
  success,
};
