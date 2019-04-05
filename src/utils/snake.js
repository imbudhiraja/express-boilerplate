const mongoose = require('mongoose');

const toCamel = (string) => string.replace(/([-_][a-z])/gi, ($1) => $1
  .toUpperCase()
  .replace('-', '')
  .replace('_', ''));

const isObject = (args) => args === Object(args) && !Array.isArray(args) && typeof args !== 'function';

const keysToCamel = (args) => {
  if (isObject(args)) {
    const n = {};

    Object.keys(args).forEach((k) => {
      if (mongoose.Types.ObjectId.isValid(args[k])) {
        if (k.toLowerCase() === '_id') {
          n[k] = args[k];
        } else {
          n[toCamel(k)] = args[k];
        }
      } else {
        n[toCamel(k)] = keysToCamel(args[k]);
      }
    });

    return n;
  }
  if (Array.isArray(args)) {
    return args.map((i) => keysToCamel(i));
  }

  return args;
};

exports.keysToCamel = keysToCamel;
