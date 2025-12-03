// Cloudflare Pages Function untuk Multi-Page App routing
export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Handle /app/* routes - serve app/index.html for SPA routing
  if (pathname.startsWith('/app/')) {
    // Allow static assets to pass through
    if (pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/)) {
      return next();
    }
    
    // Rewrite to app/index.html for SPA routes
    const appIndexUrl = new URL('/app/index.html', url.origin);
    return env.ASSETS.fetch(appIndexUrl);
  }

  // Default: continue to next handler
  return next();
}
