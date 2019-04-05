const {
  model, Schema,
} = require('mongoose');

/**
 * Notifications Schema
 * @private
 */

const Notifications = new Schema({
  content: { type: String },
  created_at: {
    default: Date.now,
    type: Number,
  },
  status: {
    default: 'sent',
    enum: ['sent', 'read'],
    type: String,
  },
  type: { type: String },
  updated_at: {
    default: Date.now,
    type: Number,
  },
});

/**
 * Statics
 */
Notifications.statics = {};

/**
 * @typedef Notifications
 */
module.exports = model('Notifications', Notifications);
