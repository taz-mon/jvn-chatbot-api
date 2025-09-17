# JVN Chatbot API Setup Guide

## Quick Start

### 1. Project Setup
```bash
# Create project directory
mkdir jvn-chatbot-api
cd jvn-chatbot-api

# Initialize project
npm init -y

# Install dependencies
npm install express mongoose dotenv
npm install --save-dev nodemon
```

### 2. Create Project Structure
```
# File Structure
jvn-chatbot-api/
├── server.js                   # Main application entry point
├── app.js                      # Express app configuration
├── config/
│   ├── database.js             # Database connection
│   ├── constants.js            # Application constants
│   └── swagger.js              # Swagger/OpenAPI configuration
├── models/
│   ├── ChatbotState.js         # JVN's state schema
│   ├── UserInteraction.js      # User interaction schema
│   ├── TokenUsage.js           # Token usage schema
│   ├── Philosophy.js           # Philosophy quotes schema
│   └── QuestionTracking.js     # Question tracking schema
├── routes/
│   ├── inspire.js              # All inspiration endpoints
│   ├── chatbot.js              # Chatbot status and wisdom endpoints
│   ├── chat.js                 # Question asking endpoints
│   └── debug.js                # Debug/admin endpoints
├── controllers/
│   ├── inspireController.js    # Inspiration business logic
│   ├── chatbotController.js    # Chatbot status logic
│   ├── chatController.js       # Chat question logic
│   └── debugController.js      # Debug operations
├── services/
│   ├── jvnPersonality.js       # JVN personality service
│   ├── tokenService.js         # Token management service
│   ├── philosophyService.js    # Philosophy quote service
│   └── birthdayService.js      # Birthday celebration service
├── middleware/
│   ├── errorHandler.js         # Error handling middleware
│   ├── validation.js           # Request validation
│   └── requestLogger.js        # Request logging
├── utils/
│   ├── responses.js            # Standardized API responses
│   └── seedData.js             # Database seed data
├── docs/
│   ├── api.yaml                 # OpenAPI specification
│   └── jvn-personality-guide.md # API documentation
├── tests/
│   ├── routes/                 # Route tests
│   ├── services/               # Service tests
│   └── setup.js                # Test setup
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies
└── README_SETUP.md             # This file
```

### 3. MongoDB Setup Options

#### Option A: Local MongoDB
1. Install MongoDB Community Server from https://www.mongodb.com/
2. Start MongoDB service
3. In .env file, use:
   ```
   MONGODB_URI=mongodb://localhost:27017/jvn_chatbot
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create free account at https://cloud.mongodb.com/
2. Create a new cluster (free tier available)
3. Create database user with username/password
4. Whitelist your IP address (or use 0.0.0.0/0 for testing)
5. Get connection string from "Connect" → "Connect your application"
6. In .env file, use the connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jvn_chatbot
   ```

### 4. Run the Application
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Test the API
Visit http://localhost:3000 to see available endpoints

### 6. Test with curl
```bash
# Get JVN's status
curl http://localhost:3000/chatbot/status

# Give JVN some fresh air
curl -X POST http://localhost:3000/inspire/fresh-air

# Feed JVN a snack
curl -X POST http://localhost:3000/inspire/food \
  -H "Content-Type: application/json" \
  -d '{"level": "snack"}'

# Ask JVN a question (requires tokens)
curl -X POST http://localhost:3000/chat/ask-question \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the meaning of mathematics?"}'
```

## Environment Variables

Copy these to your `.env` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/jvn_chatbot

# Server Configuration  
PORT=3000
NODE_ENV=development
```

## API Endpoints Summary

### Inspiration Endpoints (Earn Tokens)
- `POST /inspire/fresh-air` - Take JVN outside (1 token)
- `POST /inspire/food` - Feed JVN (1-5 tokens based on level)
- `POST /inspire/joke` - Tell JVN a joke (1 token)
- `POST /inspire/game` - Play with JVN (1 token)
- `POST /inspire/physical-care` - Scratch/groom JVN (1 token)
- `POST /inspire/compliment` - Compliment JVN (1 token)
- `POST /inspire/birthday-cake` - Special birthday treat (10 tokens)

### Interaction Endpoints (Use Tokens)
- `GET /chatbot/status` - Check JVN's mood and stats
- `POST /chat/ask-question` - Ask questions (1 token = 5 questions)
- `GET /chatbot/wisdom` - Get philosophical insights

### Debug Endpoints
- `POST /debug/reset` - Reset JVN to initial state

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running (local) or connection string is correct (Atlas)
   - Verify network connectivity for Atlas
   - Check username/password in connection string

2. **Port Already in Use**
   - Change PORT in .env file
   - Or kill process using port: `lsof -ti:3000 | xargs kill`

3. **Module Not Found**
   - Run `npm install` to install dependencies
   - Check package.json dependencies are correct

### MongoDB Atlas Specific
- Ensure IP whitelist includes your current IP
- Database user has read/write permissions
- Network access is configured properly
- Connection string format is correct

## Next Steps

Once running successfully:
1. Test all API endpoints
2. Monitor JVN's mood changes
3. Trigger a birthday celebration (1000 interactions)
4. Explore the philosophy system
5. Create documentation using docs-as-code approach
