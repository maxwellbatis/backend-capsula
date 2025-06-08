const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const capsuleRoutes = require('./routes/capsule.routes');
const adminRoutes = require('./routes/admin.routes');
const coupleRoutes = require('./routes/couple.routes');
const galleryRoutes = require('./routes/gallery.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'], // Adicione as portas do seu frontend
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/couples', coupleRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;