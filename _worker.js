export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle /app and /app/ - serve app/index.html
    if (pathname === '/app' || pathname === '/app/') {
      return env.ASSETS.fetch(new URL('/app/index.html', url.origin));
    }

    // Handle /app/* routes for SPA
    if (pathname.startsWith('/app/')) {
      // Let assets pass through
      if (pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|json|html)$/)) {
        return env.ASSETS.fetch(request);
      }
      // Otherwise serve app/index.html
      return env.ASSETS.fetch(new URL('/app/index.html', url.origin));
    }

    // Default: fetch from assets
    return env.ASSETS.fetch(request);
  },
};
