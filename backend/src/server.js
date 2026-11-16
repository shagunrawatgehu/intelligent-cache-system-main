const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRouter = require('./routes/api.router');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');
const { checkDbConnection, initDatabase } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Intelligent Cache Prediction and Replacement System API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, async () => {
  console.log('==================================================');
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`📡 API Health Endpoint: http://localhost:${PORT}/api/health`);
  
  const dbStatus = await checkDbConnection();
  if (dbStatus.connected) {
    console.log(`🗄️  MySQL: Connected successfully to database '${process.env.DB_NAME || 'cache_prediction_db'}'`);
    const initResult = await initDatabase();
    if (initResult.success) {
      console.log('🔗 Foreign Key Constraints & Database Schema Verified (InnoDB)');
    }
  } else {
    console.warn(`⚠️  MySQL: Connection not established (${dbStatus.message})`);
    console.warn('   Make sure MySQL server is running and configured in backend/.env');
  }
  console.log('==================================================');
});