// Any app proxy request that includes a service-worker-allowed: '/' header has 
// the following JS prepended to it via an NGINX Lua script. This prepended code 
// overrides the global addEventListener method and makes sure it doesn't
// intercept sensitive requests

// --------- START PREPENDED CONTENT ----------
// Wrap everything in a IIFE so that the original self.addEventListener is only accessible to us
(function () {
  const addEventListener = self.addEventListener;

  self.addEventListener = function(event, cb, options) {

    // Our list of blacklisted request routes we don't want accesible via the 'fetch' event listener
    const ROUTE_BLACKLIST_REGEX = [
      '^\/admin',
      '^\/[[0-9]+\/.*?checkout',
    ];

    // Every 'fetch' event handler that is registered with addEventListener first needs 
    // to pass through this method
    function fetchCallbackWithBlacklist(event) {
      const {pathname} = new URL(event.request.url);

      if (isBlacklisted(pathname)) {
        return console.log(`Shopify: Cannot execute service worker fetch event listener on following request: ${pathname}`)
      }

      // Only if the route is not blacklisted do we call the event handler
      return cb.call(this, event);
    }

    function isBlacklisted(pathname) {
      return ROUTE_BLACKLIST_REGEX.some((regex) => pathname.match(regex));
    }

    // If the event listener is not for fetch events, it's safe so do nothing
    if (event !== 'fetch') return addEventListener.call(self, event, cb, options);
    
    // Otherwise use our safe event handler than blocks blacklisted routes
    return addEventListener.call(self, event, fetchCallbackWithBlacklist, options); 
  };

}());
// -------- END PREPENDED CONTENT ---------

// -------- START ORIGINAL SW.JS CONTENT PROVIDED BY APP --------

// Test Fetch Event Listener to see what request could be intercepted by app proxy service workers
self.addEventListener('fetch', event => {
    console.log('Fetch event listener fired for:' , event.request.url);
});

// -------- END ORIGINAL SW.JS CONTENT PROVIDED BY APP --------
