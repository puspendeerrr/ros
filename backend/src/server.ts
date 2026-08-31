import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';
import { MenuService } from './modules/menu/menu.service';

const port = env.PORT;

const server = app.listen(port, () => {
  console.log(`[Server] Restaurant OS Auth Module listening on port ${port} in ${env.NODE_ENV} mode`);
  
  // Asynchronously warm the cache on startup
  warmCacheOnStartup();
});

async function warmCacheOnStartup() {
  try {
    console.log('[Cache Warming] Starting startup cache preloading...');
    const activeRestaurants = await prisma.restaurant.findMany({
      where: { status: 'ACTIVE' },
      take: 5,
      select: { id: true, slug: true }
    });

    const menuService = new MenuService();
    const warmingPromises = activeRestaurants.map(async (r) => {
      try {
        console.log(`[Cache Warming] Preloading menu for restaurant: ${r.slug}`);
        await menuService.warmPublicMenuCache(r.id, r.slug);
      } catch (err) {
        console.error(`[Cache Warming Error] Preload failed for slug "${r.slug}":`, (err as Error).message);
      }
    });

    await Promise.all(warmingPromises);
    console.log('[Cache Warming] Startup cache preloading completed.');
  } catch (error) {
    console.error('[Cache Warming Error] Startup preloading failed:', (error as Error).message);
  }
}

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
