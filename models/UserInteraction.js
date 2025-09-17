// for the user interaction tracking schema
const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  activity_type: { type: String, required: true },
  success: { type: Boolean, required: true },
  tokens_earned: { type: Number, default: 0 },
  jvn_mood: { type: String, required: true },
  threshold_at_time: { type: Number, required: true },
  special_event: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserInteraction', userInteractionSchema);


