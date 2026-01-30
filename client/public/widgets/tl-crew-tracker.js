/**
 * TrustLayer Crew Tracker Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <div id="tl-crew-tracker"></div>
 * <script src="https://tlid.io/widgets/tl-crew-tracker.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"
 *         data-crew-id="CREW_ID"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var crewId = currentScript.getAttribute('data-crew-id');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-crew-tracker';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');

  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Crew Tracker] Container not found:', containerId);
    return;
  }

  var clockedIn = false;
  var clockInTime = null;
  var currentLocation = null;
  var elapsed = 0;
  var timerInterval = null;

  var css = '\
    .tl-crew-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }\
    .tl-crew-header { background: ' + primaryColor + '; color: #fff; padding: 24px; text-align: center; }\
    .tl-crew-title { font-size: 20px; font-weight: 700; margin-bottom: 4px; }\
    .tl-crew-subtitle { font-size: 14px; opacity: 0.8; }\
    .tl-crew-body { padding: 24px; }\
    .tl-crew-timer { text-align: center; margin-bottom: 24px; }\
    .tl-crew-time { font-size: 48px; font-weight: 700; color: #1f2937; font-family: monospace; }\
    .tl-crew-status { font-size: 14px; color: #6b7280; margin-top: 8px; }\
    .tl-crew-status.active { color: #10b981; }\
    .tl-crew-btn { width: 100%; padding: 16px; font-size: 18px; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s; margin-bottom: 16px; }\
    .tl-crew-btn-in { background: #10b981; color: #fff; }\
    .tl-crew-btn-in:hover { background: #059669; }\
    .tl-crew-btn-out { background: #ef4444; color: #fff; }\
    .tl-crew-btn-out:hover { background: #dc2626; }\
    .tl-crew-btn:disabled { opacity: 0.5; cursor: not-allowed; }\
    .tl-crew-location { background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }\
    .tl-crew-location-title { font-size: 12px; color: #6b7280; margin-bottom: 4px; }\
    .tl-crew-location-value { font-size: 14px; color: #1f2937; }\
    .tl-crew-location-coords { font-size: 12px; color: #9ca3af; margin-top: 4px; }\
    .tl-crew-notes { margin-top: 16px; }\
    .tl-crew-notes-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }\
    .tl-crew-notes-input { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; resize: vertical; min-height: 80px; box-sizing: border-box; }\
    .tl-crew-notes-input:focus { outline: none; border-color: ' + primaryColor + '; }\
    .tl-crew-history { margin-top: 24px; }\
    .tl-crew-history-title { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 12px; }\
    .tl-crew-history-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }\
    .tl-crew-history-date { font-size: 14px; color: #1f2937; }\
    .tl-crew-history-hours { font-size: 14px; font-weight: 600; color: ' + primaryColor + '; }\
    .tl-crew-powered { text-align: center; font-size: 12px; color: #9ca3af; padding: 16px; }\
    .tl-crew-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';

  function injectStyles() {
    if (document.getElementById('tl-crew-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-crew-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function formatTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function getLocation() {
    return new Promise(function(resolve, reject) {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function(position) {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        function(error) {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  function reverseGeocode(lat, lng) {
    return new Promise(function(resolve) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lng + '&format=json', true);
      xhr.onload = function() {
        try {
          var data = JSON.parse(xhr.responseText);
          resolve(data.display_name || 'Unknown location');
        } catch (e) {
          resolve('Unknown location');
        }
      };
      xhr.onerror = function() { resolve('Unknown location'); };
      xhr.send();
    });
  }

  function sendWebhook(eventType, data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'crew.' + eventType,
      siteId: siteId,
      crewId: crewId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }

  function updateTimer() {
    if (clockedIn && clockInTime) {
      elapsed = Math.floor((Date.now() - clockInTime) / 1000);
      var timerEl = document.getElementById('tl-crew-time');
      if (timerEl) timerEl.textContent = formatTime(elapsed);
    }
  }

  function clockIn() {
    var btn = document.getElementById('tl-crew-btn');
    btn.disabled = true;
    btn.textContent = 'Getting location...';

    getLocation()
      .then(function(location) {
        currentLocation = location;
        return reverseGeocode(location.lat, location.lng);
      })
      .then(function(address) {
        clockedIn = true;
        clockInTime = Date.now();
        elapsed = 0;

        document.getElementById('tl-crew-location').style.display = 'block';
        document.getElementById('tl-crew-address').textContent = address;
        document.getElementById('tl-crew-coords').textContent = currentLocation.lat.toFixed(6) + ', ' + currentLocation.lng.toFixed(6);

        btn.className = 'tl-crew-btn tl-crew-btn-out';
        btn.textContent = 'Clock Out';
        btn.disabled = false;

        document.getElementById('tl-crew-status').className = 'tl-crew-status active';
        document.getElementById('tl-crew-status').textContent = 'Currently working';

        timerInterval = setInterval(updateTimer, 1000);

        sendWebhook('clock_in', { location: currentLocation, address: address });

        if (window.TLAnalytics) {
          window.TLAnalytics.track('crew_clock_in', { crewId: crewId, location: currentLocation });
        }
      })
      .catch(function(err) {
        alert('Could not get location: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Clock In';
      });
  }

  function clockOut() {
    clearInterval(timerInterval);
    var notes = document.getElementById('tl-crew-notes-input').value.trim();
    
    var duration = elapsed;
    var hours = (duration / 3600).toFixed(2);

    sendWebhook('clock_out', {
      location: currentLocation,
      duration: duration,
      hours: hours,
      notes: notes
    });

    if (window.TLAnalytics) {
      window.TLAnalytics.track('crew_clock_out', { crewId: crewId, hours: hours });
    }

    clockedIn = false;
    clockInTime = null;

    var btn = document.getElementById('tl-crew-btn');
    btn.className = 'tl-crew-btn tl-crew-btn-in';
    btn.textContent = 'Clock In';

    document.getElementById('tl-crew-status').className = 'tl-crew-status';
    document.getElementById('tl-crew-status').textContent = 'Last shift: ' + hours + ' hours';

    document.getElementById('tl-crew-notes-input').value = '';
  }

  function render() {
    injectStyles();

    container.innerHTML = '\
      <div class="tl-crew-container">\
        <div class="tl-crew-header">\
          <div class="tl-crew-title">Time Tracker</div>\
          <div class="tl-crew-subtitle">Crew ID: ' + (crewId || 'Not set') + '</div>\
        </div>\
        <div class="tl-crew-body">\
          <div class="tl-crew-timer">\
            <div class="tl-crew-time" id="tl-crew-time">00:00:00</div>\
            <div class="tl-crew-status" id="tl-crew-status">Ready to clock in</div>\
          </div>\
          <button class="tl-crew-btn tl-crew-btn-in" id="tl-crew-btn">Clock In</button>\
          <div class="tl-crew-location" id="tl-crew-location" style="display:none;">\
            <div class="tl-crew-location-title">Current Location</div>\
            <div class="tl-crew-location-value" id="tl-crew-address">Getting address...</div>\
            <div class="tl-crew-location-coords" id="tl-crew-coords"></div>\
          </div>\
          <div class="tl-crew-notes">\
            <div class="tl-crew-notes-label">Work Notes (optional)</div>\
            <textarea class="tl-crew-notes-input" id="tl-crew-notes-input" placeholder="Describe work completed..."></textarea>\
          </div>\
          <div class="tl-crew-history">\
            <div class="tl-crew-history-title">Recent Shifts</div>\
            <div class="tl-crew-history-item"><div class="tl-crew-history-date">Today</div><div class="tl-crew-history-hours">--</div></div>\
            <div class="tl-crew-history-item"><div class="tl-crew-history-date">Yesterday</div><div class="tl-crew-history-hours">8.5 hrs</div></div>\
            <div class="tl-crew-history-item"><div class="tl-crew-history-date">Monday</div><div class="tl-crew-history-hours">7.25 hrs</div></div>\
          </div>\
        </div>\
        <div class="tl-crew-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';

    document.getElementById('tl-crew-btn').addEventListener('click', function() {
      if (clockedIn) {
        clockOut();
      } else {
        clockIn();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLCrewTracker = { refresh: render, getStatus: function() { return { clockedIn: clockedIn, elapsed: elapsed }; } };

  console.log('[TL Crew Tracker] Loaded for site:', siteId);

})();
