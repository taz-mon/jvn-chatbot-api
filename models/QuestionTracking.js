// for the question tracking schema
const mongoose = require('mongoose');

const questionTrackingSchema = new mongoose.Schema({
  questions_asked: { type: Number, default: 0 },
  questions_remaining: { type: Number, default: 0 },
  last_token_used: { type: Date, default: null },
  total_questions_ever: { type: Number, default: 0 }
});

module.exports = mongoose.model('QuestionTracking', questionTrackingSchema);

