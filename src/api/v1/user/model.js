/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');
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

const userSchema = new mongoose.Schema({
  created_at: {
    default: Date.now,
    type: Number,
  },
  email: { type: String },
  first_name: { type: String },
  is_verified: {
    default: false,
    type: Boolean,
  },
  last_name: { type: String },
  password: { type: String },
  photo: {
    ref: 'Files',
    type: mongoose.Schema.Types.ObjectId,
  },
  role: {
    default: 'user',
    enum: roles,
    type: String,
  },
  sessions: [
    {
      access_token: { type: String },
      client_type: { type: String },
      created_at: {
        default: DateTime.local().toSeconds(),
        type: Number,
      },
      device_token: { type: String },
      is_active: {
        default: true,
        type: String,
      },
      refresh_token: { type: String },
      socket_id: { type: String },
    },
  ],
  status: {
    default: 'active',
    enum: ['active', 'blocked', 'deleted', 'pending'],
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
    reset_password: {
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
    const result = await bcrypt.compare(password, this.password);

    return result;
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

const model = mongoose.model('User', userSchema);

model.createIndexes({
  first_name: 1,
  last_name: 1,
});

module.exports = model;
