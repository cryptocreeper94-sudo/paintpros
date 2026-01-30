/**
 * TrustLayer Analytics - Embeddable Tracking Snippet
 * Version: 1.0.0
 * 
 * Usage:
 * <script src="https://tlid.io/analytics/tl-analytics.js" data-site-id="YOUR_SITE_ID"></script>
 * 
 * Or async:
 * <script async defer src="https://tlid.io/analytics/tl-analytics.js" data-site-id="YOUR_SITE_ID"></script>
 */

(function() {
  'use strict';

  // Configuration
  var ANALYTICS_ENDPOINT = 'https://tlid.io/api/analytics/track';
  var HEARTBEAT_INTERVAL = 30000; // 30 seconds
  
  // Get site ID from script tag
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  
  if (!siteId) {
    console.warn('TrustLayer Analytics: Missing data-site-id attribute');
    return;
  }

  // Generate or retrieve session ID
  var sessionId = sessionStorage.getItem('tl_session_id');
  if (!sessionId) {
    sessionId = 'tl_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem('tl_session_id', sessionId);
  }

  // Track page start time for duration calculation
  var pageStartTime = Date.now();
  var lastActivity = Date.now();

  // Get referrer (cleaned)
  function getReferrer() {
    var ref = document.referrer;
    if (!ref) return 'direct';
    try {
      var url = new URL(ref);
      if (url.hostname === window.location.hostname) return 'internal';
      return url.hostname;
    } catch (e) {
      return 'unknown';
    }
  }

  // Get current page path
  function getPagePath() {
    return window.location.pathname + window.location.search;
  }

  // Send tracking data
  function sendTrack(eventType, extraData) {
    var data = {
      siteId: siteId,
      sessionId: sessionId,
      page: getPagePath(),
      referrer: getReferrer(),
      eventType: eventType || 'pageview',
      timestamp: new Date().toISOString(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // Merge extra data
    if (extraData) {
      for (var key in extraData) {
        if (extraData.hasOwnProperty(key)) {
          data[key] = extraData[key];
        }
      }
    }

    // Use sendBeacon if available (better for page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(data));
    } else {
      // Fallback to XHR
      var xhr = new XMLHttpRequest();
      xhr.open('POST', ANALYTICS_ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
  }

  // Track initial pageview
  sendTrack('pageview');

  // Track page visibility changes
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      var duration = Math.round((Date.now() - pageStartTime) / 1000);
      sendTrack('pagehide', { duration: duration });
    } else if (document.visibilityState === 'visible') {
      pageStartTime = Date.now();
      sendTrack('pageshow');
    }
  });

  // Track before page unload
  window.addEventListener('beforeunload', function() {
    var duration = Math.round((Date.now() - pageStartTime) / 1000);
    sendTrack('unload', { duration: duration });
  });

  // Heartbeat for live visitor tracking
  setInterval(function() {
    if (document.visibilityState === 'visible') {
      sendTrack('heartbeat');
    }
  }, HEARTBEAT_INTERVAL);

  // Track clicks on external links
  document.addEventListener('click', function(e) {
    var target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentNode;
    }
    if (target && target.tagName === 'A') {
      var href = target.getAttribute('href');
      if (href && href.indexOf('http') === 0) {
        try {
          var url = new URL(href);
          if (url.hostname !== window.location.hostname) {
            sendTrack('outbound_click', { 
              destination: url.hostname,
              url: href 
            });
          }
        } catch (e) {}
      }
    }
  });

  // Track hash changes (SPA navigation)
  window.addEventListener('hashchange', function() {
    sendTrack('navigation', { type: 'hash' });
  });

  // Track history changes (SPA navigation)
  if (window.history && window.history.pushState) {
    var originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(function() {
        sendTrack('navigation', { type: 'pushstate' });
      }, 0);
    };

    window.addEventListener('popstate', function() {
      sendTrack('navigation', { type: 'popstate' });
    });
  }

  // Expose global API for custom event tracking
  window.TLAnalytics = {
    track: function(eventName, eventData) {
      sendTrack('custom', { 
        eventName: eventName,
        eventData: eventData 
      });
    },
    identify: function(userId, traits) {
      sendTrack('identify', {
        userId: userId,
        traits: traits
      });
    }
  };

  console.log('TrustLayer Analytics loaded for site:', siteId);

})();
