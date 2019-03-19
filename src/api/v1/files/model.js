const mongoose = require('mongoose');

/**
 * Files Schema
 * @private
 */
const filesSchema = new mongoose.Schema({
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
    default: 'image',
    enum: ['video', 'image'],
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
    type: String,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
filesSchema.pre('save', async () => {});

/**
 * Methods
 */
filesSchema.method({});

/**
 * Statics
 */
filesSchema.statics = {};

/**
 * @typedef User
 */
module.exports = mongoose.model('Files', filesSchema);
