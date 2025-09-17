// for the token usage tracking schema
const mongoose = require('mongoose');

const tokenUsageSchema = new mongoose.Schema({
  action: { type: String, required: true }, // 'earned' or 'spent'
  amount: { type: Number, required: true },
  activity_type: { type: String, required: true },
  questions_remaining: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TokenUsage', tokenUsageSchema);


