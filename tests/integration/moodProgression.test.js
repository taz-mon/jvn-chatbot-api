// tests/integration/moodProgression.test.js
const { JVNTestHelper } = require('../helpers/testHelpers');

describe('JVN Mood Progression Integration Tests', () => {
  let helper;

  beforeEach(() => {
    helper = new JVNTestHelper();
  });

  beforeEach(async () => {
    await helper.resetJVN();
  });

  describe('Mood State Transitions', () => {
    test('should start in pleased mood at 0 questions', async () => {
      const status = await helper.getStatus();
      expect(status.jvn_mood).toBe('pleased');
      expect(status.total_questions_asked).toBe(0);
    });

    test('should transition to analytical at 251 questions', async () => {
      await helper.simulateQuestionCycle(251);
      const status = await helper.getStatus();
      expect(status.jvn_mood).toBe('analytical');
      expect(status.total_questions_asked).toBeGreaterThanOrEqual(251);
    });

    test('should transition to demanding at 501 questions', async () => {
      await helper.simulateQuestionCycle(501);
      const status = await helper.getStatus();
      expect(status.jvn_mood).toBe('demanding');
      expect(status.total_questions_asked).toBeGreaterThanOrEqual(501);
    });

    test('should transition to insufferable at 751 questions', async () => {
      await helper.simulateQuestionCycle(751);
      const status = await helper.getStatus();
      expect(status.jvn_mood).toBe('insufferable');
      expect(status.total_questions_asked).toBeGreaterThanOrEqual(751);
    });
  });

  describe('Birthday Reset Cycle', () => {
    test('should reset to pleased mood after 1000 questions', async () => {
      // This test takes time but verifies critical behavior
      await helper.simulateQuestionCycle(1000);
      const status = await helper.getStatus();
      
      expect(status.jvn_mood).toBe('pleased');
      expect(status.total_birthdays_celebrated).toBe(1);
      expect(status.interactions_until_next_birthday).toBe(1000);
    }, 30000); // Extended timeout for long test

    test('should allow birthday cake during birthday mode', async () => {
      await helper.simulateQuestionCycle(1000);
      
      const response = await helper.agent.post('/inspire/birthday-cake');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    }, 30000);

    test('should reject birthday cake outside birthday mode', async () => {
      const response = await helper.agent.post('/inspire/birthday-cake');
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('NOT_BIRTHDAY_MODE');
    });
  });
});

