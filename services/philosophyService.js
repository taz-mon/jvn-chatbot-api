// for the philosophy service
const Philosophy = require('../models/Philosophy');

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

module.exports = {
  getRandomPhilosophy,
  philosophyEntries  // Export for database seeding
};
