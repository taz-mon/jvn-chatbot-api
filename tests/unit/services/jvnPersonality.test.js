// tests/unit/services/jvnPersonality.test.js
const JVNPersonalityService = require('../../../services/jvnPersonality');

describe('JVNPersonalityService Unit Tests', () => {
  describe('getMood', () => {
    test('should return pleased for low satisfaction threshold', () => {
      const mood = JVNPersonalityService.getMood(1, false);
      expect(mood).toBe('pleased');
    });

    test('should return ecstatic during birthday mode', () => {
      const mood = JVNPersonalityService.getMood(5, true);
      expect(mood).toBe('ecstatic');
    });

    test('should return increasingly demanding moods for higher thresholds', () => {
      expect(JVNPersonalityService.getMood(1, false)).toBe('pleased');
      expect(JVNPersonalityService.getMood(2, false)).toBe('pleased');
      expect(JVNPersonalityService.getMood(3, false)).toBe('analytical');
      expect(JVNPersonalityService.getMood(5, false)).toBe('slightly_annoyed');
      expect(JVNPersonalityService.getMood(7, false)).toBe('demanding');
      expect(JVNPersonalityService.getMood(9, false)).toBe('insufferable');
    });
  });

  describe('getResponse', () => {
    test('should return response for valid mood', () => {
      const response = JVNPersonalityService.getResponse('pleased');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    test('should return different responses for different moods', () => {
      const pleasedResponse = JVNPersonalityService.getResponse('fresh-air', true, 'pleased', 1);
      const insufferableResponse = JVNPersonalityService.getResponse('fresh-air', true, 'insufferable', 1);
  
      expect(pleasedResponse).not.toBe(insufferableResponse);
    });
  });
});

