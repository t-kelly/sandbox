// Any app proxy request that includes a service-worker-allowed: '/' header has 
// the following JS prepended to it via an NGINX Lua script. This prepended code 
// overrides the global addEventListener method and makes sure it doesn't
// intercept sensitive requests

// --------- START PREPENDED CONTENT ----------
// Wrap everything in a IIFE so that the original self.addEventListener is only accessible to us
'use strict';
(function () {
  const {hostname, pathname} = self.location
  const proxy = pathname.match(/\/(apps|a|community|tools)\/[^\/]+/)[0] 

  const ROUTE_WHITELIST_REGEX = [
    // Allow only specific subroutes within a storefront
    `^https\:\/\/${hostname}+\/($|collections|products|pages|cart|search|blogs|account|recommendations)`,
    // Allow requests from the app proxy in which the service worker was served
    `^https\:\/\/${hostname}+${proxy}`,
    // Allow all 3rd party urls
    `^https?\:\/\/(?!${hostname}).+`,
  ];

  const originalAddEventListener = EventTarget.prototype.addEventListener;

  function safeAddEventListener(event, cb, options) {
    function whitelistedFetchCallback(event) {
      if (!isWhitelisted(event.request.url)) {
        return console.log(`BLOCKED: Cannot execute service worker fetch event handler on following request: ${event.request.url}`)
      }
  
      return cb.call(this, event);
    }

    function isWhitelisted(url) {
      return ROUTE_WHITELIST_REGEX.some((str) => {
        const re = new RegExp(str);
        return url.match(re)
      })
    }

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
// self.onfetch = (event) => {
//   console.log('PASS: Fetch event listener fired for:' , event.request.url);
// }
// -------- END ORIGINAL SW.JS CONTENT PROVIDED BY APP --------
