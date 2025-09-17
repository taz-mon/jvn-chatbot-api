require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { seedDatabase } = require('./utils/seedData');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Seed initial data
    await seedDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`JVN Chatbot API running on port ${PORT}`);
      console.log('JVN is ready to be pleased! 🧮');
      console.log(`Visit http://localhost:${PORT} to see available endpoints`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

