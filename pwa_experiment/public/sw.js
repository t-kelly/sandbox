// Any app proxy request that includes a service-worker-allowed: '/' header has 
// the following JS prepended to it via an NGINX Lua script. This prepended code 
// overrides the global addEventListener method and makes sure it doesn't
// intercept sensitive requests

// --------- START PREPENDED CONTENT ----------
// Wrap everything in a IIFE so that the original self.addEventListener is only accessible to us
(function () {
  // Use strict mode to enforce non-writable properties
  'use strict';

  // TODO -- Expand this list to cover all routes we want to make available and are needed for core PWA 
  const ROUTE_WHITELIST_REGEX = [
    '/^https?\:\/\/[^\/]+\/?$/', // Is root URL
    '/^https?\:\/\/[^\/]+\/products/',
    '/^https?\:\/\/[^\/]+\/collections/',
    '/^https?\:\/\/[^\/]+\/pages/',
    '/^https?\:\/\/[^\/]+\/cart/',
    '/^https?\:\/\/[^\/]+\/search/'
  ];

  const originalAddEventListener = EventTarget.prototype.addEventListener;

  function whitelistedFetchCallback(event) {
    if (!isWhitelisted(event.request.url)) {
      return console.log(`BLOCKED: Cannot execute service worker fetch event handler on following request: ${event.request.url}`)
    }

    // Only call original event handler if the route is whitelisted
    return cb.call(this, event);
  }

  function isWhitelisted(url) {
    return ROUTE_WHITELIST_REGEX.some((regex) => url.match(regex));
  }

  function safeAddEventListener(event, cb, options) {
    if (event !== 'fetch') return originalAddEventListener.call(self, event, cb, options);
    return originalAddEventListener.call(self, event, whitelistedFetchCallback, options); 
  };

  Object.defineProperty(EventTarget.prototype, 'addEventListener', {value: safeAddEventListener, enumerable: false, writable: false});
  Object.defineProperty(self, 'onfetch', {value: null, enumerable: false, writable: false});
  
}());
// -------- END PREPENDED CONTENT ---------

// -------- START ORIGINAL SW.JS CONTENT PROVIDED BY APP --------
// Test addEventListener
self.addEventListener('fetch', event => {
    console.log('PASS: Fetch event listener fired for:' , event.request.url);
});

// Test onfetch property of Service
self.onfetch = (event) => {
  console.log('PASS: Fetch event listener fired for:' , event.request.url);
}
// -------- END ORIGINAL SW.JS CONTENT PROVIDED BY APP --------
