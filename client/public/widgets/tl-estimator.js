/**
 * TrustLayer Trade Estimator Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <div id="tl-estimator"></div>
 * <script src="https://tlid.io/widgets/tl-estimator.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"
 *         data-primary-color="#3b82f6"
 *         data-trade="painting"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var trade = currentScript.getAttribute('data-trade') || 'painting';
  var containerId = currentScript.getAttribute('data-container') || 'tl-estimator';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');

  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Estimator] Container not found:', containerId);
    return;
  }

  var PRICING = {
    painting: {
      interior: { base: 2.50, laborMultiplier: 1.0 },
      exterior: { base: 3.00, laborMultiplier: 1.2 },
      cabinet: { base: 75, perDoor: 35 },
      deck: { base: 3.50, laborMultiplier: 1.1 }
    },
    flooring: {
      hardwood: { base: 8.00, laborMultiplier: 1.0 },
      laminate: { base: 4.50, laborMultiplier: 0.8 },
      tile: { base: 12.00, laborMultiplier: 1.3 },
      carpet: { base: 3.50, laborMultiplier: 0.7 }
    },
    roofing: {
      shingle: { base: 4.00, laborMultiplier: 1.0 },
      metal: { base: 9.00, laborMultiplier: 1.5 },
      flat: { base: 6.00, laborMultiplier: 1.2 }
    }
  };

  var css = '\
    .tl-est-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }\
    .tl-est-title { font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #1f2937; text-align: center; }\
    .tl-est-field { margin-bottom: 16px; }\
    .tl-est-label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; }\
    .tl-est-input, .tl-est-select { width: 100%; padding: 12px 16px; font-size: 16px; border: 2px solid #e5e7eb; border-radius: 8px; box-sizing: border-box; transition: border-color 0.2s; }\
    .tl-est-input:focus, .tl-est-select:focus { outline: none; border-color: ' + primaryColor + '; }\
    .tl-est-row { display: flex; gap: 12px; }\
    .tl-est-row > * { flex: 1; }\
    .tl-est-result { background: linear-gradient(135deg, ' + primaryColor + ' 0%, ' + adjustColor(primaryColor, -20) + ' 100%); color: #fff; padding: 24px; border-radius: 12px; text-align: center; margin-top: 20px; }\
    .tl-est-result-label { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }\
    .tl-est-result-value { font-size: 36px; font-weight: 700; }\
    .tl-est-result-range { font-size: 14px; opacity: 0.8; margin-top: 8px; }\
    .tl-est-btn { width: 100%; padding: 16px; font-size: 16px; font-weight: 600; color: #fff; background: ' + primaryColor + '; border: none; border-radius: 8px; cursor: pointer; transition: transform 0.2s, background 0.2s; margin-top: 16px; }\
    .tl-est-btn:hover { background: ' + adjustColor(primaryColor, -15) + '; transform: translateY(-2px); }\
    .tl-est-powered { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 16px; }\
    .tl-est-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';

  function adjustColor(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = Math.min(255, Math.max(0, (num >> 16) + percent));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    var b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }

  function injectStyles() {
    if (document.getElementById('tl-est-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-est-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function formatCurrency(num) {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function calculateEstimate(serviceType, sqft, rooms, condition) {
    var pricing = PRICING[trade] || PRICING.painting;
    var service = pricing[serviceType] || pricing.interior || Object.values(pricing)[0];
    
    var baseRate = service.base || 2.50;
    var laborMult = service.laborMultiplier || 1.0;
    var conditionMult = condition === 'poor' ? 1.3 : (condition === 'fair' ? 1.1 : 1.0);
    var roomMult = Math.max(1, 0.95 + (rooms * 0.05));
    
    var estimate = sqft * baseRate * laborMult * conditionMult * roomMult;
    var low = Math.round(estimate * 0.85);
    var high = Math.round(estimate * 1.15);
    var mid = Math.round(estimate);
    
    return { low: low, mid: mid, high: high };
  }

  function sendWebhook(data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'estimator.calculated',
      siteId: siteId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }

  function render() {
    injectStyles();
    
    var tradePricing = PRICING[trade] || PRICING.painting;
    var serviceOptions = Object.keys(tradePricing).map(function(key) {
      return '<option value="' + key + '">' + key.charAt(0).toUpperCase() + key.slice(1) + '</option>';
    }).join('');

    container.innerHTML = '\
      <div class="tl-est-container">\
        <div class="tl-est-title">Get Your Free Estimate</div>\
        <div class="tl-est-field">\
          <label class="tl-est-label">Service Type</label>\
          <select class="tl-est-select" id="tl-service">' + serviceOptions + '</select>\
        </div>\
        <div class="tl-est-row">\
          <div class="tl-est-field">\
            <label class="tl-est-label">Square Feet</label>\
            <input type="number" class="tl-est-input" id="tl-sqft" placeholder="e.g. 1500" min="100" max="50000">\
          </div>\
          <div class="tl-est-field">\
            <label class="tl-est-label">Rooms</label>\
            <input type="number" class="tl-est-input" id="tl-rooms" placeholder="e.g. 4" min="1" max="50" value="1">\
          </div>\
        </div>\
        <div class="tl-est-field">\
          <label class="tl-est-label">Current Condition</label>\
          <select class="tl-est-select" id="tl-condition">\
            <option value="good">Good - Minor prep needed</option>\
            <option value="fair">Fair - Some repairs needed</option>\
            <option value="poor">Poor - Significant work needed</option>\
          </select>\
        </div>\
        <button class="tl-est-btn" id="tl-calculate">Calculate Estimate</button>\
        <div id="tl-result" style="display:none;"></div>\
        <div class="tl-est-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';

    document.getElementById('tl-calculate').addEventListener('click', function() {
      var service = document.getElementById('tl-service').value;
      var sqft = parseInt(document.getElementById('tl-sqft').value) || 0;
      var rooms = parseInt(document.getElementById('tl-rooms').value) || 1;
      var condition = document.getElementById('tl-condition').value;

      if (sqft < 100) {
        alert('Please enter at least 100 square feet');
        return;
      }

      var result = calculateEstimate(service, sqft, rooms, condition);
      var resultDiv = document.getElementById('tl-result');
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = '\
        <div class="tl-est-result">\
          <div class="tl-est-result-label">Estimated Cost</div>\
          <div class="tl-est-result-value">' + formatCurrency(result.mid) + '</div>\
          <div class="tl-est-result-range">Range: ' + formatCurrency(result.low) + ' - ' + formatCurrency(result.high) + '</div>\
        </div>\
      ';

      sendWebhook({
        service: service,
        sqft: sqft,
        rooms: rooms,
        condition: condition,
        estimate: result
      });

      if (window.TLAnalytics) {
        window.TLAnalytics.track('estimate_calculated', { trade: trade, service: service, sqft: sqft, estimate: result.mid });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLEstimator = {
    calculate: calculateEstimate,
    refresh: render
  };

  console.log('[TL Estimator] Loaded for site:', siteId);

})();
