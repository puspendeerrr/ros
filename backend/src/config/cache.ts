export const CacheConfig = {
  defaultTTL: 900,         // 15 minutes
  profileTTL: 900,         // 15 minutes
  menuTTL: 900,            // 15 minutes
  categoriesTTL: 900,      // 15 minutes
  publicMenuTTL: 900,      // 15 minutes
  qrTTL: 86400,            // 24 hours
  themeTTL: 86400,         // 24 hours
  analyticsTTL: 120,       // 2 minutes
  redisTimeout: 300,       // 300ms command timeout protection
  lockTimeout: 4000,       // 4 seconds distributed lock timeout
  compressionThreshold: 1024 // Compress values larger than 1KB
};
