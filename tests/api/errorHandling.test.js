// tests/api/errorHandling.test.js
const { JVNTestHelper } = require('../helpers/testHelpers');

describe('API Error Handling Tests', () => {
  let helper;

  beforeEach(() => {
    helper = new JVNTestHelper();
  });

  beforeEach(async () => {
    await helper.resetJVN();
  });

  describe('Error Response Format', () => {
    test('should return consistent error structure', async () => {
      const response = await helper.agent
        .post('/chat/ask-question')
        .send({}); // Missing question

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error).toHaveProperty('code');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.meta).toHaveProperty('timestamp');
    });
  });

  describe('Validation Errors', () => {
    test('should validate required question parameter', async () => {
      const response = await helper.agent
        .post('/chat/ask-question')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('MISSING_QUESTION');
      expect(response.body.error.message).toContain('question parameter is required');
    });

    test('should validate food level parameter', async () => {
      const response = await helper.agent
        .post('/inspire/food')
        .send({ level: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_FOOD_LEVEL');
      expect(response.body.error.message).toContain('snack');
      expect(response.body.error.message).toContain('entree');
      expect(response.body.error.message).toContain('restaurant');
    });
  });

  describe('Business Logic Errors', () => {
    test('should prevent questions without tokens', async () => {
      const response = await helper.askQuestion('Test question');
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('NO_TOKENS_AVAILABLE');
      expect(response.body.error.message).toContain('No tokens available');
    });

    test('should prevent birthday cake outside birthday mode', async () => {
      const response = await helper.agent.post('/inspire/birthday-cake');
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('NOT_BIRTHDAY_MODE');
      expect(response.body.error.message).toContain('birthday celebrations');
    });
  });
});
