const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
dotenv.config();

const { sequelize, connectDB } = require('./config/db.js');

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
let isDbReady = false;
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fundrise',
    dbConnected: isDbReady,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Serve static files from React frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const frontendDist = path.resolve(__dirname, '../frontend/dist');
  console.log(`[Static] Serving frontend bundle from: ${frontendDist}`);
  app.use(express.static(frontendDist));

  // Catch-all route for SPA navigation (never intercepts /api)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    next();
  });
}

// Unknown route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler middleware (after all routes)
const { errorHandler } = require('./middleware/errorHandler.js');
app.use(errorHandler);

// Start server immediately on 0.0.0.0 so Render detects open port and healthcheck passes
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FundRise server listening on port ${PORT} (0.0.0.0)`);
});

// Asynchronously initialize database, migrations, and automated post-deployment seeding
(async () => {
  try {
    const connected = await connectDB();
    if (connected) {
      isDbReady = true;

      // Automated post-deployment seeding check
      try {
        const { Campaign, User } = require('./models/index.js');
        const count = await Campaign.count();
        const adminCount = await User.count({ where: { role: 'admin' } });

        if (count === 0 || adminCount < 2 || process.env.AUTO_SEED === 'true') {
          console.log('[Post-Deploy] Running automated database seeding (admin accounts & demo campaigns)...');
          const seed = require('./seed.js');
          await seed();
          console.log('✓ [Post-Deploy] Automated database seeding finished successfully!');
        } else {
          console.log(`[Post-Deploy] Database ready (${count} campaigns, ${adminCount} admins verified).`);
        }
      } catch (seedErr) {
        console.warn('[Post-Deploy] Notice during auto-seeding:', seedErr.message);
      }
    } else {
      console.warn('⚠️ [DB Warning] Database connection could not be established. Server is running in degraded mode.');
    }
  } catch (error) {
    console.error('[Startup Warning] Error during database initialization:', error.message);
  }
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    sequelize.close().then(() => process.exit(0));
  });
});