// Cloudflare Pages Function untuk Multi-Page App routing
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  let pathname = url.pathname;

  // Normalize path - remove trailing slash except for root
  if (pathname.endsWith('/') && pathname !== '/') {
    pathname = pathname.slice(0, -1);
  }

  // Handle /app routes - rewrite to app/index.html for SPA routing
  // But skip if already requesting /app/index.html or static assets
  if (pathname.startsWith('/app') && pathname !== '/app/index.html') {
    // Allow static assets and specific files to pass through
    if (pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|json|html)$/)) {
      return next();
    }
    
    // Rewrite to app/index.html without creating redirect loop
    url.pathname = '/app/index.html';
    return fetch(url.toString(), request);
  }

  // Default: continue to next handler
  return next();
}
