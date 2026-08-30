import path from 'path';
import crypto from 'crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import menuRoutes from './modules/menu/menu.routes';
import restaurantRoutes from './modules/restaurant/restaurant.routes';

const app = express();

// Disable x-powered-by header
app.disable('x-powered-by');

// Enable trust proxy (essential for rate limiting on Render/Vercel)
app.set('trust proxy', 1);

// Generate Request ID for tracing
app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  (req as any).id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Configure CORS allowed origins from comma-separated string
const allowedOrigins = env.CORS_ORIGINS.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.algorithyum.in') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Security Middlewares - allow cross-origin resource policies for uploaded images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Body and Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Static Files Serving - Disable directory indexing, enforce 1-day cache control
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'), {
    maxAge: '1d',
    index: false,
  })
);

// Logger with Request ID trace prefix
morgan.token('req-id', (req: any) => req.id);
if (env.NODE_ENV !== 'test') {
  app.use(morgan('[:req-id] :method :url :status :res[content-length] - :response-time ms'));
}

// Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check with version, environment, and uptime
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: '0.3.0',
    environment: env.NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount auth routes directly to root /
app.use('/', authLimiter, authRoutes);

// Mount menu builder routes under /api
app.use('/api', menuRoutes);
app.use('/api', restaurantRoutes);

// Global Error Handler Middleware
app.use(errorMiddleware);

export default app;
