const mongoose = require('mongoose');
const { mediaTypes } = require('../../../config');

/**
 * Files Schema
 * @private
 */
const Files = new mongoose.Schema({
  created_at: {
    default: Date.now,
    type: Number,
  },
  file_extension: { type: String },
  file_mime_type: { type: String },
  file_original_name: { type: String },
  file_size: {
    default: 0,
    type: Number,
  },
  file_type: {
    default: 'photo',
    enum: mediaTypes,
    type: String,
  },
  is_deleted: {
    default: false,
    type: Boolean,
  },
  is_temp: {
    default: false,
    type: Boolean,
  },
  temp_location: { type: String },
  updated_at: {
    default: Date.now,
    type: Number,
  },
  user_id: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - victuals
 */
Files.pre('save', async () => {});

/**
 * Methods
 */
Files.method({});

/**
 * Statics
 */
Files.statics = {};

/**
 * @typedef Files
 */

const model = mongoose.model('Files', Files);

module.exports = model;
