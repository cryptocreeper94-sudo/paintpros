/**
 * TrustLayer Booking Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <div id="tl-booking"></div>
 * <script src="https://tlid.io/widgets/tl-booking.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"
 *         data-primary-color="#3b82f6"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-booking';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');
  var serviceDuration = parseInt(currentScript.getAttribute('data-duration')) || 60;

  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Booking] Container not found:', containerId);
    return;
  }

  var selectedDate = null;
  var selectedTime = null;
  var currentMonth = new Date();

  var css = '\
    .tl-book-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 400px; margin: 0 auto; padding: 24px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }\
    .tl-book-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #1f2937; text-align: center; }\
    .tl-book-calendar { margin-bottom: 20px; }\
    .tl-book-month { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }\
    .tl-book-month-label { font-weight: 600; color: #374151; }\
    .tl-book-nav { background: none; border: none; cursor: pointer; padding: 8px; font-size: 18px; color: #6b7280; }\
    .tl-book-nav:hover { color: ' + primaryColor + '; }\
    .tl-book-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 8px; }\
    .tl-book-weekday { text-align: center; font-size: 12px; font-weight: 600; color: #9ca3af; padding: 4px; }\
    .tl-book-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }\
    .tl-book-day { text-align: center; padding: 10px 4px; border-radius: 8px; cursor: pointer; font-size: 14px; color: #374151; transition: all 0.2s; }\
    .tl-book-day:hover:not(.disabled):not(.selected) { background: #f3f4f6; }\
    .tl-book-day.selected { background: ' + primaryColor + '; color: #fff; }\
    .tl-book-day.disabled { color: #d1d5db; cursor: not-allowed; }\
    .tl-book-day.other-month { color: #d1d5db; }\
    .tl-book-times { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }\
    .tl-book-time { padding: 10px; text-align: center; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; }\
    .tl-book-time:hover:not(.selected) { border-color: ' + primaryColor + '; }\
    .tl-book-time.selected { background: ' + primaryColor + '; color: #fff; border-color: ' + primaryColor + '; }\
    .tl-book-section { margin-bottom: 16px; }\
    .tl-book-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; display: block; }\
    .tl-book-input { width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box; }\
    .tl-book-input:focus { outline: none; border-color: ' + primaryColor + '; }\
    .tl-book-btn { width: 100%; padding: 14px; font-size: 16px; font-weight: 600; color: #fff; background: ' + primaryColor + '; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; }\
    .tl-book-btn:hover { opacity: 0.9; transform: translateY(-1px); }\
    .tl-book-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }\
    .tl-book-success { text-align: center; padding: 40px 20px; }\
    .tl-book-success-icon { font-size: 48px; margin-bottom: 16px; }\
    .tl-book-powered { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 16px; }\
    .tl-book-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';

  var TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  var WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function injectStyles() {
    if (document.getElementById('tl-book-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-book-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function formatDate(date) {
    return MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  function isToday(date) {
    var today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }

  function isPast(date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  function sendWebhook(data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'booking.created',
      siteId: siteId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }

  function renderCalendar() {
    var year = currentMonth.getFullYear();
    var month = currentMonth.getMonth();
    var daysInMonth = getDaysInMonth(year, month);
    var firstDay = getFirstDayOfMonth(year, month);
    
    var daysHtml = '';
    
    for (var i = 0; i < firstDay; i++) {
      daysHtml += '<div class="tl-book-day other-month"></div>';
    }
    
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, month, d);
      var isSelected = selectedDate && 
                      selectedDate.getDate() === d && 
                      selectedDate.getMonth() === month && 
                      selectedDate.getFullYear() === year;
      var disabled = isPast(date) || date.getDay() === 0;
      
      var classes = 'tl-book-day';
      if (isSelected) classes += ' selected';
      if (disabled) classes += ' disabled';
      
      daysHtml += '<div class="' + classes + '" data-date="' + d + '">' + d + '</div>';
    }
    
    return daysHtml;
  }

  function render() {
    injectStyles();
    
    container.innerHTML = '\
      <div class="tl-book-container">\
        <div class="tl-book-title">Schedule Your Appointment</div>\
        <div class="tl-book-calendar">\
          <div class="tl-book-month">\
            <button class="tl-book-nav" id="tl-prev-month">&lt;</button>\
            <span class="tl-book-month-label" id="tl-month-label">' + MONTHS[currentMonth.getMonth()] + ' ' + currentMonth.getFullYear() + '</span>\
            <button class="tl-book-nav" id="tl-next-month">&gt;</button>\
          </div>\
          <div class="tl-book-weekdays">' + WEEKDAYS.map(function(d) { return '<div class="tl-book-weekday">' + d + '</div>'; }).join('') + '</div>\
          <div class="tl-book-days" id="tl-days">' + renderCalendar() + '</div>\
        </div>\
        <div class="tl-book-section" id="tl-times-section" style="display:none;">\
          <label class="tl-book-label">Select Time</label>\
          <div class="tl-book-times" id="tl-times">' + TIMES.map(function(t) { return '<div class="tl-book-time" data-time="' + t + '">' + t + '</div>'; }).join('') + '</div>\
        </div>\
        <div class="tl-book-section" id="tl-contact-section" style="display:none;">\
          <label class="tl-book-label">Your Information</label>\
          <input type="text" class="tl-book-input" id="tl-name" placeholder="Full Name" style="margin-bottom:8px;">\
          <input type="email" class="tl-book-input" id="tl-email" placeholder="Email Address" style="margin-bottom:8px;">\
          <input type="tel" class="tl-book-input" id="tl-phone" placeholder="Phone Number">\
        </div>\
        <button class="tl-book-btn" id="tl-book-btn" disabled>Select a Date</button>\
        <div class="tl-book-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';

    bindEvents();
  }

  function bindEvents() {
    document.getElementById('tl-prev-month').addEventListener('click', function() {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      updateCalendar();
    });

    document.getElementById('tl-next-month').addEventListener('click', function() {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      updateCalendar();
    });

    document.getElementById('tl-days').addEventListener('click', function(e) {
      if (e.target.classList.contains('tl-book-day') && !e.target.classList.contains('disabled')) {
        var day = parseInt(e.target.getAttribute('data-date'));
        selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        updateCalendar();
        document.getElementById('tl-times-section').style.display = 'block';
        updateButton();
      }
    });

    document.getElementById('tl-times').addEventListener('click', function(e) {
      if (e.target.classList.contains('tl-book-time')) {
        document.querySelectorAll('.tl-book-time').forEach(function(el) { el.classList.remove('selected'); });
        e.target.classList.add('selected');
        selectedTime = e.target.getAttribute('data-time');
        document.getElementById('tl-contact-section').style.display = 'block';
        updateButton();
      }
    });

    document.getElementById('tl-book-btn').addEventListener('click', function() {
      var name = document.getElementById('tl-name').value.trim();
      var email = document.getElementById('tl-email').value.trim();
      var phone = document.getElementById('tl-phone').value.trim();

      if (!name || !email) {
        alert('Please enter your name and email');
        return;
      }

      var bookingData = {
        date: formatDate(selectedDate),
        time: selectedTime,
        duration: serviceDuration,
        customer: { name: name, email: email, phone: phone }
      };

      sendWebhook(bookingData);

      if (window.TLAnalytics) {
        window.TLAnalytics.track('booking_created', bookingData);
      }

      container.querySelector('.tl-book-container').innerHTML = '\
        <div class="tl-book-success">\
          <div class="tl-book-success-icon">&#10003;</div>\
          <div class="tl-book-title">Booking Confirmed!</div>\
          <p>' + formatDate(selectedDate) + ' at ' + selectedTime + '</p>\
          <p>We\'ll send a confirmation to ' + email + '</p>\
        </div>\
        <div class="tl-book-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      ';
    });
  }

  function updateCalendar() {
    document.getElementById('tl-month-label').textContent = MONTHS[currentMonth.getMonth()] + ' ' + currentMonth.getFullYear();
    document.getElementById('tl-days').innerHTML = renderCalendar();
  }

  function updateButton() {
    var btn = document.getElementById('tl-book-btn');
    if (selectedDate && selectedTime) {
      btn.disabled = false;
      btn.textContent = 'Book ' + formatDate(selectedDate) + ' at ' + selectedTime;
    } else if (selectedDate) {
      btn.disabled = true;
      btn.textContent = 'Select a Time';
    } else {
      btn.disabled = true;
      btn.textContent = 'Select a Date';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLBooking = { refresh: render };

  console.log('[TL Booking] Loaded for site:', siteId);

})();
