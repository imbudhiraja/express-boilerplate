const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const Sequence = new Schema({ counter: { type: Number } });

const SequenceModel = Mongoose.model('Sequence', Sequence);

module.exports = SequenceModel;
