// define a few Application Constants
const JVN_MOODS = {
  PLEASED: 'pleased',
  ANALYTICAL: 'analytical', 
  SLIGHTLY_ANNOYED: 'slightly_annoyed',
  DEMANDING: 'demanding',
  INSUFFERABLE: 'insufferable',
  ECSTATIC: 'ecstatic'
};

const ACTIVITY_TYPES = {
  FRESH_AIR: 'fresh_air',
  FOOD: 'food',
  JOKE: 'joke',
  GAME: 'game',
  PHYSICAL_CARE: 'physical_care',
  COMPLIMENT: 'compliment',
  BIRTHDAY_CAKE: 'birthday_cake'
};

const TOKEN_VALUES = {
  STANDARD: 1,
  BIRTHDAY_CAKE: 10,
  FOOD: {
    snack: 1,
    entree: 2,
    restaurant: 5
  }
};

const BIRTHDAY_INTERACTIONS_COUNT = 50;
const QUESTIONS_PER_TOKEN = 5;
const BIRTHDAY_TRIGGER_INTERVAL = 1000;

module.exports = {
  JVN_MOODS,
  ACTIVITY_TYPES,
  TOKEN_VALUES,
  BIRTHDAY_INTERACTIONS_COUNT,
  QUESTIONS_PER_TOKEN,
  BIRTHDAY_TRIGGER_INTERVAL
};
