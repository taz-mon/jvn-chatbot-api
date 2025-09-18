// tests/helpers/testHelpers.js
const request = require('supertest');
const app = require('../../app');

class JVNTestHelper {
  constructor() {
    this.agent = request(app);
  }

  async resetJVN() {
    return await this.agent.post('/debug/reset');
  }

  async getStatus() {
    const response = await this.agent.get('/chatbot/status');
    return response.body.data;
  }

  async earnTokens(type = 'fresh-air', count = 1) {
    const results = [];
    for (let i = 0; i < count; i++) {
      const response = await this.agent.post(`/inspire/${type}`);
      results.push(response.body);
    }
    return results;
  }

  async askQuestion(question = "Test question") {
    return await this.agent
      .post('/chat/ask-question')
      .send({ question });
  }

  async simulateQuestionCycle(targetQuestions) {
    // Efficient simulation of question asking
    let questionsAsked = 0;
    
    while (questionsAsked < targetQuestions) {
      // Earn tokens in batches
      await this.earnTokens('fresh-air', 5);
      
      // Ask questions until tokens run out
      for (let i = 0; i < 25 && questionsAsked < targetQuestions; i++) {
        const response = await this.askQuestion(`Question ${questionsAsked + 1}`);
        if (response.status === 200) {
          questionsAsked++;
        } else {
          break; // Need more tokens
        }
      }
    }
    
    return questionsAsked;
  }

  async inspireFood(level = 'snack') {
    return await this.agent
      .post('/inspire/food')
      .send({ level });
  }
}

module.exports = { JVNTestHelper };

