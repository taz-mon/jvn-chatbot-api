// tests/performance/loadTesting.test.js
const { JVNTestHelper } = require('../helpers/testHelpers');

describe('Performance Tests', () => {
  let helper;

  beforeEach(() => {
    helper = new JVNTestHelper();
  });

  beforeEach(async () => {
    await helper.resetJVN();
  });

  test('should handle rapid successive requests', async () => {
    // Earn tokens first
    await helper.earnTokens('fresh-air', 10);

    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(helper.askQuestion(`Concurrent question ${i}`));
    }

    const responses = await Promise.all(promises);
    const successfulResponses = responses.filter(r => r.status === 200);
    
    // Should handle at least some concurrent requests successfully
    expect(successfulResponses.length).toBeGreaterThan(0);
  }, 15000);

  test('should maintain state consistency under concurrent load', async () => {
    const concurrentRequests = Array.from({ length: 5 }, (_, i) => 
      helper.earnTokens('fresh-air', 2)
    );

    await Promise.all(concurrentRequests);
    
    const status = await helper.getStatus();
    expect(status.global_token_pool).toBe(10); // 5 requests * 2 tokens each
    expect(status.total_interactions).toBe(10);
  });
});

