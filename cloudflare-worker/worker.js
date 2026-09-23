/**
 * Cloudflare Worker for Restaurant OS API Gateway
 * Handles CORS preflight (OPTIONS), credentials, and forwards requests to the upstream backend.
 */

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/ros\.algorithyum\.in$/,
  /^https:\/\/.*\.algorithyum\.in$/,
  /^https:\/\/.*\.vercel\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

function isOriginAllowed(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

function getCorsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');
    const url = new URL(request.url);

    // 1. Handle OPTIONS preflight requests immediately
    if (request.method === 'OPTIONS') {
      if (origin && isOriginAllowed(origin)) {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(origin),
        });
      }
      return new Response('CORS Origin Not Allowed', { status: 403 });
    }

    // 2. Determine Upstream Backend URL (from Cloudflare Worker environment variable or fallback)
    const upstreamBase = env.UPSTREAM_API_URL;

    if (!upstreamBase) {
      // If no upstream is configured, return an informational JSON response with valid CORS
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Worker is running with CORS enabled. Please configure UPSTREAM_API_URL environment variable to point to your backend.',
          endpoint: url.pathname,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(origin),
          },
        }
      );
    }

    // 3. Proxy request to upstream backend
    const targetUrl = new URL(url.pathname + url.search, upstreamBase);
    const newRequestHeaders = new Headers(request.headers);

    // Forward real client IP and host
    newRequestHeaders.set('X-Forwarded-Host', url.host);
    newRequestHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

    const proxyRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: newRequestHeaders,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
      duplex: 'half',
    });

    try {
      const response = await fetch(proxyRequest);

      // Clone response and attach CORS headers
      const responseHeaders = new Headers(response.headers);
      const corsHeaders = getCorsHeaders(origin);

      for (const [key, value] of Object.entries(corsHeaders)) {
        responseHeaders.set(key, value);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to connect to upstream backend API.',
          error: err.message,
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(origin),
          },
        }
      );
    }
  },
};
