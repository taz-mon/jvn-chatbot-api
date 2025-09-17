// this holds the JVN Personality Service
const { JVN_MOODS, BIRTHDAY_INTERACTIONS_COUNT } = require('../config/constants');

class JVNPersonalityService {
  static getMood(threshold, isBirthday) {
    if (isBirthday) return JVN_MOODS.ECSTATIC;
    if (threshold <= 2) return JVN_MOODS.PLEASED;
    if (threshold <= 4) return JVN_MOODS.ANALYTICAL;
    if (threshold <= 6) return JVN_MOODS.SLIGHTLY_ANNOYED;
    if (threshold <= 8) return JVN_MOODS.DEMANDING;
    return JVN_MOODS.INSUFFERABLE;
  }

  static getResponse(activityType, success, mood, tokensEarned, specialEvent = null) {
    const responses = {
      [JVN_MOODS.PLEASED]: {
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
      [JVN_MOODS.ANALYTICAL]: {
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
      [JVN_MOODS.SLIGHTLY_ANNOYED]: {
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
      [JVN_MOODS.DEMANDING]: {
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
      [JVN_MOODS.INSUFFERABLE]: {
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
      [JVN_MOODS.ECSTATIC]: {
        success: [
          "🎂 BIRTHDAY EXCELLENCE! Ze mathematical beauty approaches infinity!",
          "🎉 MAGNIFICENT! Zis is ze most beautiful theorem I've seen all year!",
          "✨ WUNDERBAR SUPREME! Ze elegance multiplies like a perfect geometric series!"
        ]
      }
    };

    if (specialEvent === 'birthday') {
      const ecstaticResponses = responses[JVN_MOODS.ECSTATIC].success;
      return ecstaticResponses[Math.floor(Math.random() * ecstaticResponses.length)];
    }

    const moodResponses = responses[mood] || responses[JVN_MOODS.PLEASED];
    const responseArray = success ? moodResponses.success : (moodResponses.failure || moodResponses.success);
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  }

  static calculateNewThreshold(totalInteractions, isBirthdayMode) {
    if (isBirthdayMode) return 0;
    const thresholdIncrease = Math.floor(totalInteractions / 50);
    return Math.min(1 + thresholdIncrease, 10);
  }

  static shouldShowPhilosophy(mood, interactionCount) {
    const baseChance = 0.05; // 5%
    const bonusChance = mood === JVN_MOODS.ECSTATIC ? 0.10 : 0;
    return Math.random() < (baseChance + bonusChance);
  }
}

module.exports = JVNPersonalityService;


