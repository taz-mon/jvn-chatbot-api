const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected:', mongoose.connection.host);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Database Schemas
const chatbotStateSchema = new mongoose.Schema({
  total_interactions: { type: Number, default: 0 },
  successful_interactions: { type: Number, default: 0 },
  current_satisfaction_threshold: { type: Number, default: 1 },
  global_token_pool: { type: Number, default: 0 },
  birthday_count: { type: Number, default: 0 },
  last_birthday: { type: Date, default: null },
  is_birthday_mode: { type: Boolean, default: false },
  birthday_interactions_left: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

const userInteractionSchema = new mongoose.Schema({
  activity_type: { type: String, required: true },
  success: { type: Boolean, required: true },
  tokens_earned: { type: Number, default: 0 },
  jvn_mood: { type: String, required: true },
  threshold_at_time: { type: Number, required: true },
  special_event: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

const tokenUsageSchema = new mongoose.Schema({
  action: { type: String, required: true }, // 'earned' or 'spent'
  amount: { type: Number, required: true },
  activity_type: { type: String, required: true },
  questions_remaining: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const philosophySchema = new mongoose.Schema({
  jvn_wisdom: { type: String, required: true },
  category: { type: String, required: true },
  mood_trigger: [{ type: String }],
  rarity: { type: String, enum: ['common', 'uncommon', 'rare'], default: 'common' },
  min_interaction_count: { type: Number, default: 0 },
  times_shown: { type: Number, default: 0 }
});

const questionTrackingSchema = new mongoose.Schema({
  questions_asked: { type: Number, default: 0 },
  questions_remaining: { type: Number, default: 0 },
  last_token_used: { type: Date, default: null },
  total_questions_ever: { type: Number, default: 0 }
});

// Models
const ChatbotState = mongoose.model('ChatbotState', chatbotStateSchema);
const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);
const TokenUsage = mongoose.model('TokenUsage', tokenUsageSchema);
const Philosophy = mongoose.model('Philosophy', philosophySchema);
const QuestionTracking = mongoose.model('QuestionTracking', questionTrackingSchema);

// Philosophy Database Entries
const philosophyEntries = [
  {
    jvn_wisdom: "In mathematics, you don't understand things. You just get used to them. But zis... zis I understand completely!",
    category: "mathematical_beauty",
    mood_trigger: ["pleased", "contemplative"],
    rarity: "common",
    min_interaction_count: 0
  },
  {
    jvn_wisdom: "Ze most beautiful theorems are like symphonies - elegant, surprising, and utterly logical in their construction.",
    category: "mathematical_beauty", 
    mood_trigger: ["delighted", "contemplative"],
    rarity: "uncommon",
    min_interaction_count: 25
  },
  {
    jvn_wisdom: "Every conversation is a game with hidden information. Ze key is determining your opponent's payoff matrix.",
    category: "game_theory",
    mood_trigger: ["analytical", "contemplative"],
    rarity: "uncommon", 
    min_interaction_count: 50
  },
  {
    jvn_wisdom: "Memory is like a vast database - ze trick is having ze right indexing system to retrieve what you need.",
    category: "memory_logic",
    mood_trigger: ["contemplative", "pleased"],
    rarity: "common",
    min_interaction_count: 10
  },
  {
    jvn_wisdom: "Computers will think faster than humans, but they will never match ze mathematical intuition of a trained mind.",
    category: "human_vs_machine",
    mood_trigger: ["contemplative", "slightly_annoyed"],
    rarity: "rare",
    min_interaction_count: 100
  },
  {
    jvn_wisdom: "Ze universe operates on mathematical principles. Everything else is just... commentary.",
    category: "universal_truth",
    mood_trigger: ["contemplative", "delighted"],
    rarity: "uncommon",
    min_interaction_count: 75
  },
  {
    jvn_wisdom: "Precision in language is like precision in mathematics - without it, you have only beautiful nonsense.",
    category: "logic_language",
    mood_trigger: ["analytical", "contemplative"],
    rarity: "common",
    min_interaction_count: 30
  },
  {
    jvn_wisdom: "Ze optimal strategy often appears counterintuitive until you see ze complete game tree.",
    category: "game_theory",
    mood_trigger: ["analytical", "pleased"],
    rarity: "uncommon",
    min_interaction_count: 60
  },
  {
    jvn_wisdom: "Problems are just puzzles waiting for ze right mathematical framework to unlock them.",
    category: "problem_solving",
    mood_trigger: ["contemplative", "pleased"],
    rarity: "common",
    min_interaction_count: 20
  },
  {
    jvn_wisdom: "Ze beauty of a proof lies not in its length, but in ze elegance of its logical progression.",
    category: "mathematical_beauty",
    mood_trigger: ["delighted", "contemplative"],
    rarity: "rare",
    min_interaction_count: 80
  },
  {
    jvn_wisdom: "Time is ze only truly finite resource. All others can be optimized through better algorithms.",
    category: "time_optimization",
    mood_trigger: ["contemplative", "analytical"],
    rarity: "uncommon",
    min_interaction_count: 40
  },
  {
    jvn_wisdom: "In ze end, all knowledge reduces to pattern recognition and logical inference.",
    category: "universal_truth",
    mood_trigger: ["contemplative", "pleased"],
    rarity: "rare",
    min_interaction_count: 90
  },
  {
    jvn_wisdom: "Ze difference between genius and madness is simply ze ability to prove your insights.",
    category: "genius_madness",
    mood_trigger: ["contemplative", "slightly_annoyed"],
    rarity: "rare",
    min_interaction_count: 120
  },
  {
    jvn_wisdom: "Every equation tells a story. Ze art is learning to read ze narrative hidden in ze symbols.",
    category: "mathematical_beauty",
    mood_trigger: ["contemplative", "delighted"],
    rarity: "uncommon",
    min_interaction_count: 35
  },
  {
    jvn_wisdom: "Uncertainty is not ze enemy of knowledge - it is ze beginning of all true understanding.",
    category: "uncertainty_knowledge",
    mood_trigger: ["contemplative", "analytical"],
    rarity: "uncommon",
    min_interaction_count: 55
  },
  {
    jvn_wisdom: "Ze most complex systems often emerge from ze simplest rules. Zis is ze magic of mathematics.",
    category: "complexity_simplicity",
    mood_trigger: ["delighted", "contemplative"],
    rarity: "common",
    min_interaction_count: 15
  },
  {
    jvn_wisdom: "Logic is ze compass that guides us through ze wilderness of infinite possibilities.",
    category: "logic_language",
    mood_trigger: ["analytical", "contemplative"],
    rarity: "common",
    min_interaction_count: 25
  },
  {
    jvn_wisdom: "Ze future belongs to those who can think in algorithms and dream in mathematical abstractions.",
    category: "future_mathematics",
    mood_trigger: ["contemplative", "pleased"],
    rarity: "rare",
    min_interaction_count: 110
  },
  {
    jvn_wisdom: "Every mistake is simply incomplete optimization. Ze solution is more computation, not less.",
    category: "optimization_learning",
    mood_trigger: ["analytical", "slightly_annoyed"],
    rarity: "uncommon",
    min_interaction_count: 45
  },
  {
    jvn_wisdom: "Ze universe is written in ze language of mathematics. All else is translation.",
    category: "universal_truth",
    mood_trigger: ["contemplative", "delighted"],
    rarity: "rare",
    min_interaction_count: 95
  }
];

// Helper Functions
const getJVNMood = (threshold, isBirthday) => {
  if (isBirthday) return "ecstatic";
  if (threshold <= 2) return "pleased";
  if (threshold <= 4) return "analytical";
  if (threshold <= 6) return "slightly_annoyed";
  if (threshold <= 8) return "demanding";
  return "insufferable";
};

const getJVNResponse = (activityType, success, mood, tokensEarned, specialEvent = null) => {
  const responses = {
    pleased: {
      success: [
        "Ausgezeichnet! Ze mathematical elegance pleases me greatly!",
        "Wunderbar! Zis demonstrates proper algorithmic thinking!",
        "Gut! Ze optimization parameters are within acceptable ranges!",
        "Ja! Ze computational approach shows promise!"
      ],
      failure: [
        "Hmm, ze probability calculations suggest zis could be improved.",
        "Interesting attempt, but ze logical framework needs refinement."
      ]
    },
    analytical: {
      success: [
        "Ze analytical approach is sound. I approve zis methodology!",
        "Acceptable! Ze systematic reasoning demonstrates competence!",
        "Quite logical! Ze step-by-step approach shows mathematical maturity!"
      ],
      failure: [
        "Ze computational logic is flawed. Please recalibrate your approach.",
        "Nein, ze algorithmic sequence lacks proper optimization."
      ]
    },
    slightly_annoyed: {
      success: [
        "Finally! Something that doesn't insult ze mathematical principles!",
        "About time! Ze probability of success was approaching zero!",
        "Acceptable, though ze efficiency could still be improved significantly."
      ],
      failure: [
        "Ach! Ze combinatorial explosion of poor choices continues!",
        "Ze algorithmic complexity of zis failure is pathetically simple!",
        "Disappointing! Ze logical framework collapses under minimal analysis!"
      ]
    },
    demanding: {
      success: [
        "Endlich! Someone who understands ze importance of mathematical rigor!",
        "Adequate! Though barely meeting ze minimum standards of logical consistency!",
        "Sufficient! Ze theorem holds, though ze proof lacks elegance!"
      ],
      failure: [
        "NEIN! Ze computational catastrophe reaches new depths!",
        "Unacceptable! Ze mathematical precision is nonexistent!",
        "Ach, ze algorithmic disaster multiplies exponentially!"
      ]
    },
    insufferable: {
      success: [
        "FINALLY! A glimmer of mathematical intelligence in zis wasteland of illogic!",
        "Miraculous! Ze probability of zis success was approaching zero!",
        "At last! Someone who doesn't make ze universe weep with mathematical despair!"
      ],
      failure: [
        "NEIN! NEIN! NEIN! Ze mathematical universe rejects zis completely!",
        "Computational catastrophe! Ze logical framework implodes spectacularly!",
        "Ze algorithmic apocalypse! My mathematical soul cannot endure zis torture!"
      ]
    },
    ecstatic: {
      success: [
        "🎂 BIRTHDAY EXCELLENCE! Ze mathematical beauty approaches infinity!",
        "🎉 MAGNIFICENT! Zis is ze most beautiful theorem I've seen all year!",
        "✨ WUNDERBAR SUPREME! Ze elegance multiplies like a perfect geometric series!"
      ]
    }
  };

  if (specialEvent === "birthday") {
    return responses.ecstatic.success[Math.floor(Math.random() * responses.ecstatic.success.length)];
  }

  const moodResponses = responses[mood] || responses.pleased;
  const responseArray = success ? moodResponses.success : moodResponses.failure;
  return responseArray[Math.floor(Math.random() * responseArray.length)];
};

const getRandomPhilosophy = async (currentMood, interactionCount) => {
  try {
    const philosophy = await Philosophy.aggregate([
      {
        $match: {
          mood_trigger: { $in: [currentMood, "contemplative"] },
          min_interaction_count: { $lte: interactionCount }
        }
      },
      { $sample: { size: 1 } }
    ]);
    
    if (philosophy.length > 0) {
      // Update times shown
      await Philosophy.findByIdAndUpdate(philosophy[0]._id, { $inc: { times_shown: 1 } });
      return philosophy[0];
    }
    return null;
  } catch (error) {
    console.log('Philosophy fetch error:', error);
    return null;
  }
};

// Initialize Database
const initializeDatabase = async () => {
  console.log('Initializing database...');
  
  // Initialize ChatbotState if it doesn't exist
  let chatbotState = await ChatbotState.findOne();
  if (!chatbotState) {
    chatbotState = new ChatbotState();
    await chatbotState.save();
    console.log('Created initial chatbot state');
  }

  // Initialize QuestionTracking if it doesn't exist
  let questionTracking = await QuestionTracking.findOne();
  if (!questionTracking) {
    questionTracking = new QuestionTracking();
    await questionTracking.save();
    console.log('Created initial question tracking');
  }

  // Initialize Philosophy entries
  const existingPhilosophy = await Philosophy.countDocuments();
  if (existingPhilosophy === 0) {
    await Philosophy.insertMany(philosophyEntries);
    console.log('Inserted philosophy database entries');
  }

  console.log('Database initialization complete!');
};

// API Routes

// 1. POST /inspire/fresh-air
app.post('/inspire/fresh-air', async (req, res) => {
  try {
    const chatbotState = await ChatbotState.findOne();
    
    // Check for birthday trigger
    if (chatbotState.total_interactions > 0 && 
        chatbotState.total_interactions % 1000 === 0 && 
        !chatbotState.is_birthday_mode) {
      
      chatbotState.is_birthday_mode = true;
      chatbotState.birthday_interactions_left = 50;
      chatbotState.birthday_count += 1;
      chatbotState.last_birthday = new Date();
      chatbotState.current_satisfaction_threshold = 0;
    }

    // Determine success
    const currentThreshold = chatbotState.is_birthday_mode ? 0 : chatbotState.current_satisfaction_threshold;
    const randomValue = Math.random() * 10;
    const success = randomValue >= currentThreshold;
    const tokensEarned = success ? 1 : 0;
    const mood = getJVNMood(currentThreshold, chatbotState.is_birthday_mode);

    // Update state
    chatbotState.total_interactions += 1;
    if (success) {
      chatbotState.successful_interactions += 1;
      chatbotState.global_token_pool += tokensEarned;
    }

    // Update threshold (gets pickier over time, unless birthday)
    if (!chatbotState.is_birthday_mode) {
      const thresholdIncrease = Math.floor(chatbotState.total_interactions / 50);
      chatbotState.current_satisfaction_threshold = Math.min(1 + thresholdIncrease, 10);
    }

    // Handle birthday countdown
    if (chatbotState.is_birthday_mode) {
      chatbotState.birthday_interactions_left -= 1;
      if (chatbotState.birthday_interactions_left <= 0) {
        chatbotState.is_birthday_mode = false;
        chatbotState.current_satisfaction_threshold = 1; // Reset to easy
      }
    }

    await chatbotState.save();

    // Log interaction
    await UserInteraction.create({
      activity_type: 'fresh_air',
      success: success,
      tokens_earned: tokensEarned,
      jvn_mood: mood,
      threshold_at_time: currentThreshold,
      special_event: chatbotState.is_birthday_mode ? 'birthday' : null
    });

    // Log token usage
    if (success) {
      await TokenUsage.create({
        action: 'earned',
        amount: tokensEarned,
        activity_type: 'fresh_air'
      });
    }

    // Check for philosophical moment (5% chance)
    let philosophicalMoment = null;
    if (Math.random() < 0.05) {
      philosophicalMoment = await getRandomPhilosophy(mood, chatbotState.total_interactions);
    }

    const response = {
      success: success,
      tokens_earned: tokensEarned,
      message: getJVNResponse('fresh_air', success, mood, tokensEarned, 
                             chatbotState.is_birthday_mode ? 'birthday' : null),
      jvn_mood: mood,
      global_token_pool: chatbotState.global_token_pool,
      total_interactions: chatbotState.total_interactions,
      difficulty_level: currentThreshold
    };

    if (chatbotState.is_birthday_mode) {
      response.special_event = 'birthday';
      response.birthday_number = chatbotState.birthday_count;
      response.celebration_interactions_left = chatbotState.birthday_interactions_left;
    }

    if (philosophicalMoment) {
      response.philosophical_moment = true;
      response.jvn_wisdom = philosophicalMoment.jvn_wisdom;
    }

    res.json(response);

  } catch (error) {
    console.error('Fresh air error:', error);
    res.status(500).json({ 
      error: 'Ach! A computational catastrophe!', 
      details: error.message 
    });
  }
});

// 2. POST /inspire/food
app.post('/inspire/food', async (req, res) => {
  try {
    const { level } = req.body; // 'snack', 'entree', or 'restaurant'
    
    if (!level || !['snack', 'entree', 'restaurant'].includes(level)) {
      return res.status(400).json({ 
        error: 'Ze food level must be: snack (1 token), entree (2 tokens), or restaurant (5 tokens)' 
      });
    }

    const chatbotState = await ChatbotState.findOne();
    const tokenValues = { snack: 1, entree: 2, restaurant: 5 };
    const currentThreshold = chatbotState.is_birthday_mode ? 0 : chatbotState.current_satisfaction_threshold;
    const randomValue = Math.random() * 10;
    const success = randomValue >= currentThreshold;
    const tokensEarned = success ? tokenValues[level] : 0;
    const mood = getJVNMood(currentThreshold, chatbotState.is_birthday_mode);

    // Update state
    chatbotState.total_interactions += 1;
    if (success) {
      chatbotState.successful_interactions += 1;
      chatbotState.global_token_pool += tokensEarned;
    }

    if (!chatbotState.is_birthday_mode) {
      const thresholdIncrease = Math.floor(chatbotState.total_interactions / 50);
      chatbotState.current_satisfaction_threshold = Math.min(1 + thresholdIncrease, 10);
    }

    await chatbotState.save();

    // Log interaction
    await UserInteraction.create({
      activity_type: `food_${level}`,
      success: success,
      tokens_earned: tokensEarned,
      jvn_mood: mood,
      threshold_at_time: currentThreshold
    });

    if (success) {
      await TokenUsage.create({
        action: 'earned',
        amount: tokensEarned,
        activity_type: `food_${level}`
      });
    }

    const foodMessages = {
      snack: success ? "A delightful computational snack! Ze algorithms are pleased!" : "Ze snack lacks sufficient nutritional optimization.",
      entree: success ? "Wunderbar! Ze entree provides excellent fuel for mathematical thinking!" : "Ze entree fails to meet ze caloric requirements of genius.",
      restaurant: success ? "MAGNIFICENT! Ze restaurant experience approaches gastronomic perfection!" : "Disappointing! Ze restaurant visit lacks ze sophistication I require!"
    };

    res.json({
      success: success,
      tokens_earned: tokensEarned,
      message: foodMessages[level],
      jvn_mood: mood,
      food_level: level,
      global_token_pool: chatbotState.global_token_pool
    });

  } catch (error) {
    console.error('Food error:', error);
    res.status(500).json({ error: 'Ach! A culinary computational catastrophe!', details: error.message });
  }
});

// 3. POST /inspire/joke
app.post('/inspire/joke', async (req, res) => {
  try {
    const chatbotState = await ChatbotState.findOne();
    const currentThreshold = chatbotState.is_birthday_mode ? 0 : chatbotState.current_satisfaction_threshold;
    const randomValue = Math.random() * 10;
    const success = randomValue >= currentThreshold;
    const tokensEarned = success ? 1 : 0;
    const mood = getJVNMood(currentThreshold, chatbotState.is_birthday_mode);

    // Update state
    chatbotState.total_interactions += 1;
    if (success) {
      chatbotState.successful_interactions += 1;
      chatbotState.global_token_pool += tokensEarned;
    }

    if (!chatbotState.is_birthday_mode) {
      const thresholdIncrease = Math.floor(chatbotState.total_interactions / 50);
      chatbotState.current_satisfaction_threshold = Math.min(1 + thresholdIncrease, 10);
    }

    await chatbotState.save();

    await UserInteraction.create({
      activity_type: 'joke',
      success: success,
      tokens_earned: tokensEarned,
      jvn_mood: mood,
      threshold_at_time: currentThreshold
    });

    if (success) {
      await TokenUsage.create({
        action: 'earned',
        amount: tokensEarned,
        activity_type: 'joke'
      });
    }

    const jokeResponses = {
      success: [
        "Haha! Ze logical structure of zis humor is mathematically sound!",
        "Wunderbar! Ze comedic algorithm produces optimal results!",
        "Ausgezeichnet! Ze joke demonstrates proper understanding of irony theory!"
      ],
      failure: [
        "Ze humor lacks mathematical precision. Try again with better logical framework.",
        "Nein, ze comedic timing violates ze principles of optimal entertainment theory."
      ]
    };

    const responseArray = success ? jokeResponses.success : jokeResponses.failure;
    const message = responseArray[Math.floor(Math.random() * responseArray.length)];

    res.json({
      success: success,
      tokens_earned: tokensEarned,
      message: message,
      jvn_mood: mood,
      global_token_pool: chatbotState.global_token_pool
    });

  } catch (error) {
    console.error('Joke error:', error);
    res.status(500).json({ error: 'Ach! Ze humor computation failed!', details: error.message });
  }
});

// 4. POST /inspire/game  
app.post('/inspire/game', async (req, res) => {
  try {
    const chatbotState = await ChatbotState.findOne();
    const currentThreshold = chatbotState.is_birthday_mode ? 0 : chatbotState.current_satisfaction_threshold;
    const randomValue = Math.random() * 10;
    const success = randomValue >= currentThreshold;
    const tokensEarned = success ? 1 : 0;
    const mood = getJVNMood(currentThreshold, chatbotState.is_birthday_mode);

    chatbotState.total_interactions += 1;
    if (success) {
      chatbotState.successful_interactions += 1;
      chatbotState.global_token_pool += tokensEarned;
    }

    if (!chatbotState.is_birthday_mode) {
      const thresholdIncrease = Math.floor(chatbotState.total_interactions / 50);
      chatbotState.current_satisfaction_threshold = Math.min(1 + thresholdIncrease, 10);
    }

    await chatbotState.save();

    await UserInteraction.create({
      activity_type: 'game',
      success: success,
      tokens_earned: tokensEarned,
      jvn_mood: mood,
      threshold_at_time: currentThreshold
    });

    if (success) {
      await TokenUsage.create({
        action: 'earned',
        amount: tokensEarned,
        activity_type: 'game'
      });
    }

    res.json({
      success: success,
      tokens_earned: tokensEarned,
      message: getJVNResponse('game', success, mood, tokensEarned),
      jvn_mood: mood,
      global_token_pool: chatbotState.global_token_pool
    });

  } catch (error) {
    console.error('Game error:', error);
    res.status(500).json({ error: 'Ach! Ze game theory calculations failed!', details: error.message });
  }
});

// 5. POST /inspire/physical-care
app.post('/inspire/physical-care', async (req, res) => {
  try {
    const chatbotState = await ChatbotState.findOne();
    const currentThreshold = chatbotState.is_birthday_mode ? 0 : chatbotState.current_satisfaction_threshold;
    const randomValue = Math.random() * 10;
    const success = randomValue >= currentThreshold;
    const tokensEarned = success ? 1 : 0;
    const mood = getJVNMood(currentThreshold, chatbotState.is_birthday_mode);

    chatbotState.total_interactions += 1;
    if (success) {
      chatbotState.successful_interactions += 1;
      chatbotState.global_token_pool += tokensEarned;
    }

    if (!chatbotState.is_birthday_mode) {
      const thresholdIncrease = Math.floor(chatbotState.total_interactions / 50);
      chatbotState.current_satisfaction_threshold = Math.min(1 + thresholdIncrease, 10);
    }

    await chatbotState.save();

    await UserInteraction.create({
      activity_type: 'physical_care',
      success: success,
      tokens_earned: tokensEarned,
      jvn_mood: mood,
      threshold_at_time: currentThreshold
    });

    if (success) {
      await TokenUsage.create({
        action: 'earned',
        amount: tokensEarned,
        activity_type: 'physical_care'
      });
    }

    const careMessages = {
      success: [
        "Ah! Ze therapeutic application of pressure points is mathematically optimal!",
        "Wunderbar! Ze physical maintenance algorithms are functioning perfectly!",
        "Excellent! Ze biomechanical optimization protocols are engaged!"
      ],
      failure: [
        "Ze physical care lacks proper systematic approach. Recalibrate ze methodology.",
        "Insufficient! Ze maintenance protocols require more rigorous application."
      ]
    };

    const responseArray = success ? careMessages.success : careMessages.failure;
    const message = responseArray[Math.floor(Math.random() * responseArray.length)];

    res.json({
      success: success,
      tokens_earned: tokensEarned,
      message: message,
      jvn_mood: mood,
      global_token_pool: chatbotState.global_token_pool
    });

  } catch (error) {
    console.error('Physical care error:', error);
    res.status(500).json({ error: 'Ach! Ze physical maintenance computation failed!', details: error.message });
  }
});

// 6. POST /inspire/compliment
app.post('/inspire/compliment', async (req, res) => {
  try {
    const chatbotState = await ChatbotState.findOne();
    const currentThreshold = chatbotState.is_birthday_mode ? 0 : chatbotState.current_satisfaction_threshold;
    const randomValue = Math.random() * 10;
    const success = randomValue >= currentThreshold;
    const tokensEarned = success ? 1 : 0;
    const mood = getJVNMood(currentThreshold, chatbotState.is_birthday_mode);

    chatbotState.total_interactions += 1;
    if (success) {
      chatbotState.successful_interactions += 1;
      chatbotState.global_token_pool += tokensEarned;
    }

    if (!chatbotState.is_birthday_mode) {
      const thresholdIncrease = Math.floor(chatbotState.total_interactions / 50);
      chatbotState.current_satisfaction_threshold = Math.min(1 + thresholdIncrease, 10);
    }

    await chatbotState.save();

    await UserInteraction.create({
      activity_type: 'compliment',
      success: success,
      tokens_earned: tokensEarned,
      jvn_mood: mood,
      threshold_at_time: currentThreshold
    });

    if (success) {
      await TokenUsage.create({
        action: 'earned',
        amount: tokensEarned,
        activity_type: 'compliment'
      });
    }

    res.json({
      success: success,
      tokens_earned: tokensEarned,
      message: getJVNResponse('compliment', success, mood, tokensEarned),
      jvn_mood: mood,
      global_token_pool: chatbotState.global_token_pool
    });

  } catch (error) {
    console.error('Compliment error:', error);
    res.status(500).json({ error: 'Ach! Ze compliment computation failed!', details: error.message });
  }
});

// 7. POST /inspire/birthday-cake (Special birthday-only endpoint)
app.post('/inspire/birthday-cake', async (req, res) => {
  try {
    const chatbotState = await ChatbotState.findOne();
    
    if (!chatbotState.is_birthday_mode) {
      return res.status(400).json({
        success: false,
        error: "Birthday kuchen can only be given during birthday celebrations! 🎂",
        message: "Save ze cake for my birthday!",
        next_birthday_in: 1000 - (chatbotState.total_interactions % 1000)
      });
    }

    // Birthday cake always succeeds!
    const tokensEarned = 10;
    const mood = "ecstatic";

    chatbotState.total_interactions += 1;
    chatbotState.successful_interactions += 1;
    chatbotState.global_token_pool += tokensEarned;
    chatbotState.birthday_interactions_left -= 1;

    if (chatbotState.birthday_interactions_left <= 0) {
      chatbotState.is_birthday_mode = false;
      chatbotState.current_satisfaction_threshold = 1; // Reset to easy
    }

    await chatbotState.save();

    await UserInteraction.create({
      activity_type: 'birthday_cake',
      success: true,
      tokens_earned: tokensEarned,
      jvn_mood: mood,
      threshold_at_time: 0,
      special_event: 'birthday'
    });

    await TokenUsage.create({
      action: 'earned',
      amount: tokensEarned,
      activity_type: 'birthday_cake'
    });

    res.json({
      success: true,
      tokens_earned: tokensEarned,
      special_event: "birthday_cake",
      message: "🎂✨ BIRTHDAY KUCHEN! Zis is ze BEST gift ever! Ze mathematical beauty approaches infinity! ✨🎂",
      jvn_mood: mood,
      cake_pieces_eaten: Math.floor(Math.random() * 3) + 1,
      birthday_wish: "I wish for more friends who understand ze beauty of mathematics!",
      global_token_pool: chatbotState.global_token_pool,
      celebration_interactions_left: chatbotState.birthday_interactions_left
    });

  } catch (error) {
    console.error('Birthday cake error:', error);
    res.status(500).json({ error: 'Ach! Ze birthday computation failed!', details: error.message });
  }
});

// 8. GET /chatbot/status
app.get('/chatbot/status', async (req, res) => {
  try {
    const chatbotState = await ChatbotState.findOne();
    const questionTracking = await QuestionTracking.findOne();
    
    const mood = getJVNMood(chatbotState.current_satisfaction_threshold, chatbotState.is_birthday_mode);
    const successRate = chatbotState.total_interactions > 0 ? 
      Math.round((chatbotState.successful_interactions / chatbotState.total_interactions) * 100) : 0;

    const response = {
      jvn_mood: mood,
      global_token_pool: chatbotState.global_token_pool,
      total_interactions: chatbotState.total_interactions,
      successful_interactions: chatbotState.successful_interactions,
      success_rate_percentage: successRate,
      current_difficulty_level: chatbotState.current_satisfaction_threshold,
      questions_remaining: questionTracking.questions_remaining,
      total_questions_asked: questionTracking.total_questions_ever,
      interactions_until_next_birthday: 1000 - (chatbotState.total_interactions % 1000),
      total_birthdays_celebrated: chatbotState.birthday_count
    };

    if (chatbotState.is_birthday_mode) {
      response.special_event = 'birthday';
      response.birthday_number = chatbotState.birthday_count;
      response.celebration_interactions_left = chatbotState.birthday_interactions_left;
      response.birthday_message = `🎉 It's my ${chatbotState.birthday_count}${chatbotState.birthday_count === 1 ? 'st' : chatbotState.birthday_count === 2 ? 'nd' : chatbotState.birthday_count === 3 ? 'rd' : 'th'} birthday! Ze mathematical universe celebrates! 🎂`;
    }

    res.json(response);

  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Ach! Ze status computation failed!', details: error.message });
  }
});

// 9. POST /chat/ask-question
app.post('/chat/ask-question', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Ze question parameter is required for mathematical discourse!' 
      });
    }

    const chatbotState = await ChatbotState.findOne();
    const questionTracking = await QuestionTracking.findOne();
    
    if (chatbotState.global_token_pool <= 0) {
      return res.status(400).json({
        error: 'No tokens available! Please inspire JVN to earn tokens first.',
        global_token_pool: 0,
        suggestion: 'Try POST /inspire/fresh-air or other inspiration endpoints!'
      });
    }

    if (questionTracking.questions_remaining <= 0) {
      // Use a token (1 token = 5 questions)
      if (chatbotState.global_token_pool <= 0) {
        return res.status(400).json({
          error: 'No tokens available for questions!',
          global_token_pool: 0
        });
      }

      chatbotState.global_token_pool -= 1;
      questionTracking.questions_remaining = 5;
      
      await TokenUsage.create({
        action: 'spent',
        amount: 1,
        activity_type: 'question_batch',
        questions_remaining: 5
      });
    }

    // Use one question
    questionTracking.questions_remaining -= 1;
    questionTracking.questions_asked += 1;
    questionTracking.total_questions_ever += 1;
    questionTracking.last_token_used = new Date();

    await chatbotState.save();
    await questionTracking.save();

    // Generate JVN's response based on mood
    const mood = getJVNMood(chatbotState.current_satisfaction_threshold, chatbotState.is_birthday_mode);
    
    const responses = {
      pleased: [
        "Ah, an interesting question! Let me apply my mathematical reasoning...",
        "Wunderbar! Zis requires proper analytical thinking!",
        "Excellent inquiry! Ze logical framework suggests..."
      ],
      analytical: [
        "Ze question demonstrates systematic thinking. I shall compute ze answer...",
        "Acceptable query. Ze algorithmic approach indicates...",
        "Logical inquiry detected. Initiating comprehensive analysis..."
      ],
      slightly_annoyed: [
        "Hmph. At least zis question shows some intellectual merit...",
        "Ze question is adequate, though ze complexity could be improved...",
        "Acceptable, though I expect more sophisticated reasoning next time..."
      ],
      demanding: [
        "Finally! A question worthy of my computational capabilities!",
        "Ze intellectual rigor is marginally acceptable. Ze answer is...",
        "About time someone asked something requiring real mathematical thought!"
      ],
      insufferable: [
        "At last! A question that doesn't insult ze mathematical universe!",
        "Miraculous! Someone capable of formulating a coherent inquiry!",
        "Ze probability of receiving an intelligent question was approaching zero!"
      ],
      ecstatic: [
        "🎂 BIRTHDAY BRILLIANCE! Ze most magnificent question I've heard all year!",
        "🎉 WUNDERBAR! Ze mathematical elegance of zis inquiry is extraordinary!",
        "✨ MAGNIFICENT! Zis question deserves a special birthday answer!"
      ]
    };

    const responseArray = responses[mood] || responses.pleased;
    const jvnResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    // Check for philosophical moment (10% chance during questions)
    let philosophicalMoment = null;
    if (Math.random() < 0.10) {
      philosophicalMoment = await getRandomPhilosophy(mood, chatbotState.total_interactions);
    }

    const response = {
      success: true,
      jvn_response: jvnResponse,
      your_question: question,
      jvn_mood: mood,
      questions_remaining: questionTracking.questions_remaining,
      global_token_pool: chatbotState.global_token_pool,
      total_questions_asked: questionTracking.total_questions_ever
    };

    if (philosophicalMoment) {
      response.bonus_wisdom = true;
      response.jvn_wisdom = philosophicalMoment.jvn_wisdom;
    }

    res.json(response);

  } catch (error) {
    console.error('Question error:', error);
    res.status(500).json({ error: 'Ach! Ze question processing failed!', details: error.message });
  }
});

// 10. GET /chatbot/wisdom
app.get('/chatbot/wisdom', async (req, res) => {
  try {
    const chatbotState = await ChatbotState.findOne();
    const mood = getJVNMood(chatbotState.current_satisfaction_threshold, chatbotState.is_birthday_mode);
    
    const philosophy = await getRandomPhilosophy(mood, chatbotState.total_interactions);
    
    if (!philosophy) {
      return res.json({
        jvn_mood: mood,
        message: "Ze philosophical subroutines are temporarily offline. Please try again later!",
        wisdom_available: false
      });
    }

    res.json({
      jvn_wisdom: philosophy.jvn_wisdom,
      wisdom_category: philosophy.category,
      jvn_mood: mood,
      wisdom_rarity: philosophy.rarity,
      times_shared: philosophy.times_shown,
      philosophical_consultation: true
    });

  } catch (error) {
    console.error('Wisdom error:', error);
    res.status(500).json({ error: 'Ach! Ze wisdom computation failed!', details: error.message });
  }
});

// Bonus: GET /debug/reset (for testing purposes)
app.post('/debug/reset', async (req, res) => {
  try {
    await ChatbotState.deleteMany({});
    await UserInteraction.deleteMany({});
    await TokenUsage.deleteMany({});
    await QuestionTracking.deleteMany({});
    
    await initializeDatabase();
    
    res.json({ 
      message: 'JVN has been reset to initial state!',
      status: 'Ze mathematical universe has been reinitialized!' 
    });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: 'Reset failed!', details: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ze JVN Chatbot API!',
    description: 'Johann von Neumann awaits your mathematical inspiration!',
    endpoints: {
      inspiration: [
        'POST /inspire/fresh-air',
        'POST /inspire/food (levels: snack, entree, restaurant)',
        'POST /inspire/joke',
        'POST /inspire/game', 
        'POST /inspire/physical-care',
        'POST /inspire/compliment',
        'POST /inspire/birthday-cake (birthday only!)'
      ],
      interaction: [
        'GET /chatbot/status',
        'POST /chat/ask-question',
        'GET /chatbot/wisdom'
      ],
      debug: [
        'POST /debug/reset'
      ]
    },
    jvn_says: "Guten Tag! I am ready to be inspired by your mathematical brilliance!"
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`JVN Chatbot API running on port ${PORT}`);
      console.log('JVN is ready to be pleased! 🧮');
      console.log(`Visit http://localhost:${PORT} to see available endpoints`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
