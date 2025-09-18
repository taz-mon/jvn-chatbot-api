// tests/integration/tokenEconomy.test.js
const { JVNTestHelper } = require('../helpers/testHelpers');

describe('Token Economy Integration Tests', () => {
  let helper;

  beforeEach(() => {
    helper = new JVNTestHelper();
  });

  beforeEach(async () => {
    await helper.resetJVN();
  });

  describe('Token Earning', () => {
    test('should earn 1 token from fresh air', async () => {
      const response = await helper.earnTokens('fresh-air', 1);
      expect(response[0].tokens_earned).toBe(1);
      
      const status = await helper.getStatus();
      expect(status.global_token_pool).toBe(1);
    });

    test('should earn correct tokens from food levels', async () => {
      const snackResponse = await helper.inspireFood('snack');
      expect(snackResponse.body.tokens_earned).toBe(1);

      const entreeResponse = await helper.inspireFood('entree');
      expect(entreeResponse.body.tokens_earned).toBe(2);

      const restaurantResponse = await helper.inspireFood('restaurant');
      expect(restaurantResponse.body.tokens_earned).toBe(5);

      const status = await helper.getStatus();
      expect(status.global_token_pool).toBe(8); // 1 + 2 + 5
    });

    test('should reject invalid food levels', async () => {
      const response = await helper.agent
        .post('/inspire/food')
        .send({ level: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_FOOD_LEVEL');
    });
  });

  describe('Token Spending', () => {
    test('should spend tokens for questions correctly', async () => {
      // Earn some tokens first
      await helper.earnTokens('fresh-air', 2); // 2 tokens = 10 questions
      
      const initialStatus = await helper.getStatus();
      expect(initialStatus.global_token_pool).toBe(2);
      
      // Ask 5 questions (should use 1 token)
      for (let i = 0; i < 5; i++) {
        const response = await helper.askQuestion(`Question ${i + 1}`);
        expect(response.status).toBe(200);
      }
      
      const midStatus = await helper.getStatus();
      expect(midStatus.global_token_pool).toBe(1);
      expect(midStatus.questions_remaining).toBe(0);
      
      // Ask 5 more questions (should use second token)
      for (let i = 0; i < 5; i++) {
        const response = await helper.askQuestion(`Question ${i + 6}`);
        expect(response.status).toBe(200);
      }
      
      const finalStatus = await helper.getStatus();
      expect(finalStatus.global_token_pool).toBe(0);
      expect(finalStatus.total_questions_asked).toBe(10);
    });

    test('should reject questions when no tokens available', async () => {
      const response = await helper.askQuestion('Test question');
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('NO_TOKENS_AVAILABLE');
    });
  });
});

