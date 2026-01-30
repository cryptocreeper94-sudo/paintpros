/**
 * TrustLayer Analytics Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <script src="https://tlid.io/widgets/tl-analytics.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"></script>
 */
(function() {
  'use strict';

  var ANALYTICS_ENDPOINT = 'https://tlid.io/api/analytics/track';
  var HEARTBEAT_INTERVAL = 30000;
  
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  
  if (!siteId) {
    console.warn('[TL Analytics] Missing data-site-id');
    return;
  }

  var sessionId = sessionStorage.getItem('tl_session_id');
  if (!sessionId) {
    sessionId = 'tl_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem('tl_session_id', sessionId);
  }

  var pageStartTime = Date.now();
  var scrollDepth = 0;

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

  function getPagePath() {
    return window.location.pathname + window.location.search;
  }

  function getDeviceType() {
    var ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
  }

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
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      deviceType: getDeviceType(),
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent
    };

    if (extraData) {
      Object.keys(extraData).forEach(function(key) {
        data[key] = extraData[key];
      });
    }

    if (navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(data));
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', ANALYTICS_ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (apiKey) xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);
      xhr.send(JSON.stringify(data));
    }
  }

  sendTrack('pageview');

  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      sendTrack('pagehide', { 
        duration: Math.round((Date.now() - pageStartTime) / 1000),
        scrollDepth: scrollDepth
      });
    } else if (document.visibilityState === 'visible') {
      pageStartTime = Date.now();
      sendTrack('pageshow');
    }
  });

  window.addEventListener('beforeunload', function() {
    sendTrack('unload', { 
      duration: Math.round((Date.now() - pageStartTime) / 1000),
      scrollDepth: scrollDepth
    });
  });

  window.addEventListener('scroll', function() {
    var docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;
    var currentScroll = window.scrollY;
    var depth = docHeight > 0 ? Math.round((currentScroll / docHeight) * 100) : 100;
    if (depth > scrollDepth) scrollDepth = depth;
  });

  setInterval(function() {
    if (document.visibilityState === 'visible') {
      sendTrack('heartbeat', { scrollDepth: scrollDepth });
    }
  }, HEARTBEAT_INTERVAL);

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
            sendTrack('outbound_click', { destination: url.hostname, url: href });
          }
        } catch (e) {}
      }
    }
  });

  window.addEventListener('hashchange', function() {
    sendTrack('navigation', { type: 'hash', page: getPagePath() });
  });

  if (window.history && window.history.pushState) {
    var origPush = window.history.pushState;
    window.history.pushState = function() {
      origPush.apply(this, arguments);
      setTimeout(function() {
        pageStartTime = Date.now();
        scrollDepth = 0;
        sendTrack('pageview', { type: 'spa' });
      }, 0);
    };

    window.addEventListener('popstate', function() {
      pageStartTime = Date.now();
      scrollDepth = 0;
      sendTrack('pageview', { type: 'popstate' });
    });
  }

  window.TLAnalytics = {
    track: function(eventName, eventData) {
      sendTrack('custom', { eventName: eventName, eventData: eventData });
    },
    identify: function(userId, traits) {
      sendTrack('identify', { userId: userId, traits: traits });
    },
    goal: function(goalName, value) {
      sendTrack('goal', { goalName: goalName, value: value });
    }
  };

  console.log('[TL Analytics] Loaded for site:', siteId);

})();
