const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
dotenv.config();

const { sequelize } = require('./config/db.js');

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 500, // relaxed for development and smooth testing
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authRoutes = require('./routes/auth.js');
const campaignRoutes = require('./routes/campaign.js');
const donationRoutes = require('./routes/donation.js');
const commentRoutes = require('./routes/comment.js');
const updateRoutes = require('./routes/update.js');
const adminRoutes = require('./routes/admin.js');

const app = express();

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(require('cookie-parser')());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(require('morgan')('dev'));

// CORS - allow frontend origin in production, always allow localhost:5173 in development
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174']
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];
app.use(require('cors')({ origin: allowedOrigins, credentials: true }));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve static files from React frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Catch-all route - return the index.html file for any non-API routes
  // Make sure it does not intercept /api routes
  app.get('/{*splat}', (req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ message: 'Route not found' });
    } else {
      res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    }
  });
}

// Unknown route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler middleware (after all routes)
app.use((err, req, res, next) => {
  console.error('Error handler:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    // Auto-seed database if empty
    try {
      const { Campaign } = require('./models/index.js');
      const count = await Campaign.count();
      if (count === 0 || process.env.AUTO_SEED === 'true') {
        console.log('Database empty or AUTO_SEED set, running seed script...');
        const seed = require('./seed.js');
        await seed();
      }
    } catch (seedErr) {
      console.warn('Auto-seed check notice:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();