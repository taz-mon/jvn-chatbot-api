const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Route imports
const inspireRoutes = require('./routes/inspire');
const chatbotRoutes = require('./routes/chatbot');
const chatRoutes = require('./routes/chat');
const debugRoutes = require('./routes/debug');

const app = express();

// Load Swagger documentation
const swaggerDocument = YAML.load('./docs/api.yaml');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/inspire', inspireRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/chat', chatRoutes);
app.use('/debug', debugRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ze JVN Chatbot API!',
    description: 'Johann von Neumann awaits your mathematical inspiration!',
    documentation: '/api-docs',
    version: '1.0.0',
    endpoints: {
      inspiration: [
        'POST /inspire/fresh-air',
        'POST /inspire/food',
        'POST /inspire/joke',
        'POST /inspire/game',
        'POST /inspire/physical-care',
        'POST /inspire/compliment',
        'POST /inspire/birthday-cake'
      ],
      interaction: [
        'GET /chatbot/status',
        'POST /chat/ask-question',
        'GET /chatbot/wisdom'
      ],
      debug: [
        'POST /debug/reset'
      ]
    },
    jvn_says: "Guten Tag! I am ready to be inspired by your mathematical brilliance!"
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
