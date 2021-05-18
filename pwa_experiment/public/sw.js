// Any app proxy request that includes a service-worker-allowed: '/' header has 
// the following JS prepended to it via an NGINX Lua script. This prepended code 
// overrides the global addEventListener method and makes sure it doesn't
// intercept sensitive requests

// --------- START PREPENDED CONTENT ----------
// Wrap everything in a IIFE so that the original self.addEventListener is only accessible to us
// 'use strict';
(function () {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

  const {hostname, pathname} = self.location
  const safeFetchHandlers = new WeakMap();
  let currentOnFetch = null;
 
  const matches = /^\/(apps|a|community|tools)\/[^\/]+/.exec(pathname);
  const proxy = matches && matches[0];
  const hostnameRegex = hostname.replace(/\./g, '\\.');
  const ALLOWLIST = [
    // Allow only specific subroutes within a storefront
    `^https\:\/\/${hostnameRegex}+\/($|collections|products|pages|cart|search|blogs|account|recommendations)`,
    // Allow requests from the app proxy in which the service worker was served
    `^https\:\/\/${hostnameRegex}+${proxy}`,
    // Allow all 3rd party urls
    `^https?\:\/\/(?!${hostnameRegex}).+`,
  ];

  function isAllowlisted(url) {
    return ALLOWLIST.some((str) => {
      const re = new RegExp(str);
      return url.match(re)
    })
  }

  function safeAddEventListener(event, handler, options) {
    if (event !== 'fetch') return originalAddEventListener.call(this, event, handler, options);
    function safeHandler(event) {
      if (!isAllowlisted(event.request.url)) {
        return console.debug(`FETCH EVENT BLOCKED: Cannot execute fetch event handler on following request: ${event.request.url}`)
      }
      return handler.call(this, event);
    }
    safeFetchHandlers.set(handler, safeHandler);
    originalAddEventListener.call(this, event, safeHandler, options); 
  };

  function safeRemoveEventListener(event, handler) {
    if (!safeFetchHandlers.has(handler)) return;
    const safeHandler = safeFetchHandlers.get(handler)
    safeFetchHandlers.delete(handler);
    originalRemoveEventListener.call(this, event, safeHandler);
  }

  Object.defineProperty(EventTarget.prototype, 'addEventListener', {
    ...Object.getOwnPropertyDescriptor(EventTarget.prototype, 'addEventListener'),
    value: safeAddEventListener
  });

  Object.defineProperty(EventTarget.prototype, 'removeEventListener', {
    ...Object.getOwnPropertyDescriptor(EventTarget.prototype, 'removeEventListener'),
    value: safeRemoveEventListener
  });
  
  Object.defineProperty(self, 'onfetch', {
    ...Object.getOwnPropertyDescriptor(self, 'onfetch'),
    get() { return currentOnFetch; },
    set(newOnFetch) {
      if (currentOnFetch !== null) {
        safeRemoveEventListener.call(self, 'fetch', currentOnFetch);
      }
      if (typeof newOnFetch === 'function') {
        safeAddEventListener.call(self, 'fetch', newOnFetch);
      }
      currentOnFetch = newOnFetch;
    },
  });
}()); 
// -------- END PREPENDED CONTENT ---------

// -------- START ORIGINAL SW.JS CONTENT PROVIDED BY APP --------
// Test addEventListener
self.addEventListener('fetch', event => {
    console.debug('PASS: Fetch event listener fired for:' , event.request.url);

    event.respondWith((async function() {
      const response = await fetch(event.request);
      const bodyText = await response.text() + 'MODIFIED BY SERVICE WORKER'

      console.log("READ AND MODIFIED: ", event.request.url);
  
      return new Response(bodyText, response);
    })());
});

// Test onfetch property of SW. Make sure previous onFetch handler is removed
self.onfetch = (event) => {
  console.debug('ONFETCH 1: Fetch event listener fired for:' , event.request.url);
}
self.onfetch = (event) => {
  console.debug('ONFETCH 2: Fetch event listener fired for:' , event.request.url);
}

// Test add and remove event handler
function testEventHandler (event) {
  console.debug('REMOVE FAILED: Fetch event listener fired for:' , event.request.url);
}
self.addEventListener('fetch', testEventHandler);
self.removeEventListener('fetch', testEventHandler);
// -------- END ORIGINAL SW.JS CONTENT PROVIDED BY APP --------

importScripts(`https://weinfuerst.app.baqend.com/v1/speedkit/sw.js?r=487a886b-861f-4cbd-9c43-2268fffeedc7&v=2.6.2&gr=A`);
