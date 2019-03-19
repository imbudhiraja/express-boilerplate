/* eslint-disable no-invalid-this */
const {
  model, Schema,
} = require('mongoose');
const bcrypt = require('bcryptjs');

const { DateTime } = require('luxon');
const jwt = require('jwt-simple');
const {
  env, jwtSecret, jwtExpirationInterval, roles,
} = require('../../../config');

/**
 * User Schema
 * @private
 */

const userSchema = new Schema({
  created_at: {
    default: Date.now,
    type: Number,
  },
  email: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  login_tokens: Array,
  password: { type: String },
  phone: { type: String },
  role: {
    default: 'user',
    enum: roles,
    type: String,
  },
  status: {
    default: 'active',
    enum: ['active', 'blocked', 'deleted'],
    type: String,
  },
  updated_at: {
    default: Date.now,
    type: Number,
  },
  verify_tokens: {
    email: {
      default: '',
      type: String,
    },
    reset_pass: {
      default: '',
      type: String,
    },
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = env === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);

    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
  token() {
    const date = DateTime.local();
    const payload = {
      _id: this._id,
      exp: date.plus({ minutes: jwtExpirationInterval }).toSeconds(),
      iat: date.toSeconds(),
    };

    return jwt.encode(payload, jwtSecret);
  },
});

/**
 * Statics
 */
userSchema.statics = {};

/**
 * @typedef User
 */
module.exports = model('User', userSchema);
