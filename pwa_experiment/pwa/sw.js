const addEventListener = self.addEventListener;

self.addEventListener = function(event, cb, options) {

  const ROUTE_BLACKLIST_GLOBS = [
    '/products'
  ]

  function fetchCallbackWithBlacklist(event) {
    const {pathname} = new URL(event.request.url);

    if (isBlacklisted(pathname)) {
      return console.log(`Shopify: Cannot execute service worker fetch event listener on following request: ${pathname}`)
    }

    return cb.call(this, event);
  }

  function isBlacklisted(pathname) {
    return ROUTE_BLACKLIST_GLOBS.some((pattern) => pathname.startsWith(pattern));
  }

  if (event !== 'fetch') return addEventListener.call(self, event, cb, options);
  
  return addEventListener.call(self, event, fetchCallbackWithBlacklist, options); 
}

self.addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  console.log('Fetch event listener fired for:' , event.request.url);
});