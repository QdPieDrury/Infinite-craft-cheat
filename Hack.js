// ==UserScript==
// @name         Neal.fun Infinite Craft Request Hijacker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercept & rewrite requests to neal.fun infinite-craft pair API
// @author       ChatGPT
// @match        https://neal.fun/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // Target API base URL to detect
  const TARGET_BASE = "https://neal.fun/api/infinite-craft/pair?first=";

  // Replacement base URL (change this to your desired endpoint)
  const REPLACE_BASE = "https://example.com/api/new-endpoint?";

  // --- Intercept XMLHttpRequest.open ---
  (function interceptXHR() {
    const original_open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      if (typeof url === "string" && url.startsWith(TARGET_BASE)) {
        console.log("[Tampermonkey][XHR Intercepted]", url);

        // Extract query string (everything after ?)
        const queryString = url.split("?")[1] || "";
        url = REPLACE_BASE + queryString;

        console.log("[Tampermonkey][XHR Modified]", url);
      }
      return original_open.call(this, method, url, ...rest);
    };

    console.log("[Tampermonkey] XHR interceptor installed");
  })();

  // --- Intercept fetch() ---
  (function interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = function(input, init) {
      let url = "";

      if (typeof input === "string") {
        url = input;
      } else if (input instanceof Request) {
        url = input.url;
      }

      if (url && url.startsWith(TARGET_BASE)) {
        console.log("[Tampermonkey][fetch Intercepted]", url);

        const queryString = url.split("?")[1] || "";
        const newUrl = REPLACE_BASE + queryString;

        console.log("[Tampermonkey][fetch Modified]", newUrl);

        if (input instanceof Request) {
          // Clone the request with the new URL, preserving everything else
          input = new Request(newUrl, input);
        } else {
          input = newUrl;
        }
      }

      return originalFetch.call(this, input, init);
    };

    console.log("[Tampermonkey] fetch interceptor installed");
  })();

})();
