// tests/unit/services/tokenService.test.js
const TokenService = require('../../../services/tokenService');

describe('TokenService Unit Tests', () => {
  describe('determineSuccess', () => {
    test('should return boolean result', () => {
      const result = TokenService.determineSuccess(5);
      expect(typeof result).toBe('boolean');
    });

    test('should have higher success rate with lower threshold', () => {
      let successCount = 0;
      const trials = 1000;
      
      for (let i = 0; i < trials; i++) {
        if (TokenService.determineSuccess(1)) {
          successCount++;
        }
      }
      
      const successRate = successCount / trials;
      expect(successRate).toBeGreaterThan(0.8); // Should succeed often with low threshold
    });
  });

  describe('calculateTokensEarned', () => {
    test('should return correct tokens for food activities', () => {
      expect(TokenService.calculateTokensEarned('food', 'snack')).toBe(1);
      expect(TokenService.calculateTokensEarned('food', 'entree')).toBe(2);
      expect(TokenService.calculateTokensEarned('food', 'restaurant')).toBe(5);
    });

    test('should return 1 token for standard activities', () => {
      expect(TokenService.calculateTokensEarned('fresh-air')).toBe(1);
      expect(TokenService.calculateTokensEarned('joke')).toBe(1);
      expect(TokenService.calculateTokensEarned('game')).toBe(1);
    });

    test('should return 10 tokens for birthday cake', () => {
      expect(TokenService.calculateTokensEarned('birthday_cake')).toBe(10);
    });
  });

  describe('validateTokensAvailable', () => {
    test('should return valid for positive token pool', () => {
      const result = TokenService.validateTokensAvailable(5);
      expect(result.valid).toBe(true);
    });

    test('should return invalid for zero tokens', () => {
      const result = TokenService.validateTokensAvailable(0);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('No tokens available');
    });
  });
});

