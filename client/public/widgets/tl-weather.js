/**
 * TrustLayer Weather Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <div id="tl-weather"></div>
 * <script src="https://tlid.io/widgets/tl-weather.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-lat="36.1627"
 *         data-lng="-86.7816"
 *         data-city="Nashville, TN"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var lat = parseFloat(currentScript.getAttribute('data-lat')) || 36.1627;
  var lng = parseFloat(currentScript.getAttribute('data-lng')) || -86.7816;
  var city = currentScript.getAttribute('data-city') || 'Nashville, TN';
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-weather';
  var units = currentScript.getAttribute('data-units') || 'fahrenheit';

  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Weather] Container not found:', containerId);
    return;
  }

  var css = '\
    .tl-weather-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 360px; background: linear-gradient(135deg, ' + primaryColor + ' 0%, ' + adjustColor(primaryColor, -40) + ' 100%); border-radius: 16px; color: #fff; overflow: hidden; }\
    .tl-weather-current { padding: 24px; }\
    .tl-weather-location { font-size: 18px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }\
    .tl-weather-main { display: flex; align-items: center; gap: 16px; }\
    .tl-weather-temp { font-size: 64px; font-weight: 700; line-height: 1; }\
    .tl-weather-temp sup { font-size: 24px; }\
    .tl-weather-icon { font-size: 48px; }\
    .tl-weather-desc { font-size: 16px; opacity: 0.9; margin-top: 8px; }\
    .tl-weather-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); }\
    .tl-weather-detail { text-align: center; }\
    .tl-weather-detail-value { font-size: 18px; font-weight: 600; }\
    .tl-weather-detail-label { font-size: 12px; opacity: 0.7; margin-top: 4px; }\
    .tl-weather-forecast { background: rgba(0,0,0,0.1); padding: 16px 24px; }\
    .tl-weather-forecast-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; opacity: 0.9; }\
    .tl-weather-forecast-days { display: flex; justify-content: space-between; }\
    .tl-weather-day { text-align: center; }\
    .tl-weather-day-name { font-size: 12px; opacity: 0.7; margin-bottom: 8px; }\
    .tl-weather-day-icon { font-size: 24px; margin-bottom: 4px; }\
    .tl-weather-day-temps { font-size: 13px; }\
    .tl-weather-day-high { font-weight: 600; }\
    .tl-weather-day-low { opacity: 0.7; }\
    .tl-weather-work { background: rgba(255,255,255,0.15); margin: 16px 24px; padding: 12px 16px; border-radius: 8px; display: flex; align-items: center; gap: 12px; }\
    .tl-weather-work-icon { font-size: 24px; }\
    .tl-weather-work-text { font-size: 14px; }\
    .tl-weather-work-good { border-left: 4px solid #10b981; }\
    .tl-weather-work-caution { border-left: 4px solid #f59e0b; }\
    .tl-weather-work-bad { border-left: 4px solid #ef4444; }\
    .tl-weather-powered { text-align: center; font-size: 11px; opacity: 0.6; padding: 12px; }\
    .tl-weather-powered a { color: #fff; text-decoration: none; }\
    .tl-weather-loading { padding: 40px; text-align: center; opacity: 0.8; }\
  ';

  var WEATHER_ICONS = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌧️', 53: '🌧️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️',
    80: '🌧️', 81: '🌧️', 82: '🌧️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
  };

  var WEATHER_DESC = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm'
  };

  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function adjustColor(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = Math.min(255, Math.max(0, (num >> 16) + percent));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    var b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }

  function injectStyles() {
    if (document.getElementById('tl-weather-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-weather-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function convertTemp(celsius) {
    if (units === 'celsius') return Math.round(celsius);
    return Math.round(celsius * 9/5 + 32);
  }

  function getWorkCondition(weather) {
    var code = weather.current.weathercode;
    var temp = convertTemp(weather.current.temperature_2m);
    var windSpeed = weather.current.windspeed_10m;
    
    if (code >= 95 || code >= 71 && code <= 75) {
      return { status: 'bad', icon: '🚫', text: 'Not recommended for outdoor work' };
    }
    if (code >= 61 || windSpeed > 20 || temp < 40 || temp > 95) {
      return { status: 'caution', icon: '⚠️', text: 'Exercise caution for outdoor work' };
    }
    return { status: 'good', icon: '✓', text: 'Good conditions for outdoor work' };
  }

  function fetchWeather() {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng + 
              '&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m&' +
              'daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto';
    
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Weather API error'));
        }
      };
      xhr.onerror = reject;
      xhr.send();
    });
  }

  function renderWeather(weather) {
    var current = weather.current;
    var daily = weather.daily;
    var temp = convertTemp(current.temperature_2m);
    var icon = WEATHER_ICONS[current.weathercode] || '🌡️';
    var desc = WEATHER_DESC[current.weathercode] || 'Unknown';
    var workCondition = getWorkCondition(weather);

    var forecastHtml = '';
    for (var i = 1; i < Math.min(6, daily.time.length); i++) {
      var date = new Date(daily.time[i]);
      var dayIcon = WEATHER_ICONS[daily.weathercode[i]] || '🌡️';
      forecastHtml += '<div class="tl-weather-day">\
        <div class="tl-weather-day-name">' + DAYS[date.getDay()] + '</div>\
        <div class="tl-weather-day-icon">' + dayIcon + '</div>\
        <div class="tl-weather-day-temps">\
          <span class="tl-weather-day-high">' + convertTemp(daily.temperature_2m_max[i]) + '°</span>\
          <span class="tl-weather-day-low">' + convertTemp(daily.temperature_2m_min[i]) + '°</span>\
        </div>\
      </div>';
    }

    container.innerHTML = '\
      <div class="tl-weather-container">\
        <div class="tl-weather-current">\
          <div class="tl-weather-location">📍 ' + city + '</div>\
          <div class="tl-weather-main">\
            <div class="tl-weather-icon">' + icon + '</div>\
            <div>\
              <div class="tl-weather-temp">' + temp + '<sup>°' + (units === 'celsius' ? 'C' : 'F') + '</sup></div>\
              <div class="tl-weather-desc">' + desc + '</div>\
            </div>\
          </div>\
          <div class="tl-weather-details">\
            <div class="tl-weather-detail">\
              <div class="tl-weather-detail-value">' + Math.round(current.relative_humidity_2m) + '%</div>\
              <div class="tl-weather-detail-label">Humidity</div>\
            </div>\
            <div class="tl-weather-detail">\
              <div class="tl-weather-detail-value">' + Math.round(current.windspeed_10m) + '</div>\
              <div class="tl-weather-detail-label">Wind mph</div>\
            </div>\
            <div class="tl-weather-detail">\
              <div class="tl-weather-detail-value">' + convertTemp(daily.temperature_2m_max[0]) + '°/' + convertTemp(daily.temperature_2m_min[0]) + '°</div>\
              <div class="tl-weather-detail-label">Hi/Lo</div>\
            </div>\
          </div>\
        </div>\
        <div class="tl-weather-work tl-weather-work-' + workCondition.status + '">\
          <div class="tl-weather-work-icon">' + workCondition.icon + '</div>\
          <div class="tl-weather-work-text">' + workCondition.text + '</div>\
        </div>\
        <div class="tl-weather-forecast">\
          <div class="tl-weather-forecast-title">5-Day Forecast</div>\
          <div class="tl-weather-forecast-days">' + forecastHtml + '</div>\
        </div>\
        <div class="tl-weather-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';
  }

  function render() {
    injectStyles();
    
    container.innerHTML = '<div class="tl-weather-container"><div class="tl-weather-loading">Loading weather...</div></div>';
    
    fetchWeather()
      .then(renderWeather)
      .catch(function(err) {
        container.innerHTML = '<div class="tl-weather-container"><div class="tl-weather-loading">Unable to load weather</div></div>';
        console.error('[TL Weather] Error:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLWeather = { refresh: render };

  console.log('[TL Weather] Loaded for site:', siteId);

})();
