import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        // Single Page Application Routing Fallback
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^(?!\/__|\/api).*/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        
        // Custom Runtime Caching Strategy definitions
        runtimeCaching: [
          {
            // Immutable hashed static assets
            urlPattern: /\.(?:js|css)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ros-static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // Fonts (Cache First, 365 Days TTL)
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ros-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
            },
          },
          {
            // PWA Icons & Logo assets (Cache First, 365 Days TTL)
            urlPattern: /\/icons\/.*\.(?:png|svg|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ros-pwa-icons',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
            },
          },
          {
            // Cloudinary Images (Stale While Revalidate, 30 Days TTL)
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\/image\/upload\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'ros-cloudinary-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Public Menu API requests (Stale While Revalidate, 24 Hours TTL)
            urlPattern: /\/api\/menu\/public\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'ros-public-menu-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Theme API config requests (Stale While Revalidate, 24 Hours TTL)
            urlPattern: /\/api\/restaurant\/theme/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'ros-theme-api',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Restaurant profile, logo, covers (Stale While Revalidate, 30 Days TTL)
            urlPattern: /\/api\/restaurant\/profile/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'ros-restaurant-profile',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Authentication, Login, Refresh tokens: Network Only (Never cached)
            urlPattern: /\/api\/auth\//,
            handler: 'NetworkOnly',
          },
          {
            // Other API endpoints fallback (Network First)
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ros-api-fallback',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
              networkTimeoutSeconds: 5, // Fallback to cache after 5s
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Restaurant OS',
        short_name: 'Restaurant OS',
        description: 'Enterprise Restaurant Digital Menu & Operations Management System',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f97316',
        orientation: 'portrait',
        categories: ['food', 'business', 'utilities'],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    }),
  ],
})
