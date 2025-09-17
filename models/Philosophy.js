// for the philosophy schema
const mongoose = require('mongoose');

const philosophySchema = new mongoose.Schema({
  
  jvn_wisdom: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  mood_trigger: [{ 
    type: String }],

  rarity: { 
    type: String,
    enum: ['common', 'uncommon', 'rare'],
    default: 'common'
  },

  min_interaction_count: { 
    type: Number, 
    default: 0 
  },

  times_shown: { 
    type: Number, 
    default: 0 }
});

module.exports = mongoose.model('Philosophy', philosophySchema);



