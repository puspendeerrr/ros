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

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body and Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Logger
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
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

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'OK', timestamp: new Date() });
});

// Mount auth routes directly to root /
app.use('/', authLimiter, authRoutes);

// Global Error Handler Middleware
app.use(errorMiddleware);

export default app;
