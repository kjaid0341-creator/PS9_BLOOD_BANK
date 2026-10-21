const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/admin/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
  res.json({
    name: 'Blood Bank Donor & Request Management System API',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      donors: '/api/donors',
      donations: '/api/donations',
      stock: '/api/stock',
      requests: '/api/requests',
      dashboard: '/api/admin/dashboard'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running successfully', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
