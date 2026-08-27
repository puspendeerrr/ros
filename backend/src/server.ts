import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const port = env.PORT;

const server = app.listen(port, () => {
  console.log(`[Server] Restaurant OS Auth Module listening on port ${port} in ${env.NODE_ENV} mode`);
});

// Clean shutdown handler
const shutdown = async () => {
  console.log('Shutdown signal received, shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Database connection disconnected.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
