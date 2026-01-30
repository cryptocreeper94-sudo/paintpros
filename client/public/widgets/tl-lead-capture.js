/**
 * TrustLayer Lead Capture Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <div id="tl-lead-capture"></div>
 * <script src="https://tlid.io/widgets/tl-lead-capture.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"
 *         data-webhook-url="YOUR_WEBHOOK_URL"
 *         data-primary-color="#3b82f6"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-lead-capture';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');
  var formStyle = currentScript.getAttribute('data-style') || 'multi-step';

  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Lead Capture] Container not found:', containerId);
    return;
  }

  var currentStep = 1;
  var totalSteps = 3;
  var formData = {};

  var css = '\
    .tl-lead-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }\
    .tl-lead-header { text-align: center; margin-bottom: 24px; }\
    .tl-lead-title { font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 8px; }\
    .tl-lead-subtitle { font-size: 14px; color: #6b7280; }\
    .tl-lead-progress { display: flex; gap: 8px; margin-bottom: 24px; }\
    .tl-lead-progress-step { flex: 1; height: 4px; border-radius: 2px; background: #e5e7eb; transition: background 0.3s; }\
    .tl-lead-progress-step.active { background: ' + primaryColor + '; }\
    .tl-lead-step { display: none; }\
    .tl-lead-step.active { display: block; }\
    .tl-lead-field { margin-bottom: 16px; }\
    .tl-lead-label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; }\
    .tl-lead-input, .tl-lead-select, .tl-lead-textarea { width: 100%; padding: 14px 16px; font-size: 16px; border: 2px solid #e5e7eb; border-radius: 10px; box-sizing: border-box; transition: border-color 0.2s; }\
    .tl-lead-input:focus, .tl-lead-select:focus, .tl-lead-textarea:focus { outline: none; border-color: ' + primaryColor + '; }\
    .tl-lead-textarea { min-height: 100px; resize: vertical; }\
    .tl-lead-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }\
    .tl-lead-option { padding: 16px; border: 2px solid #e5e7eb; border-radius: 10px; cursor: pointer; text-align: center; transition: all 0.2s; }\
    .tl-lead-option:hover { border-color: ' + primaryColor + '; }\
    .tl-lead-option.selected { border-color: ' + primaryColor + '; background: ' + primaryColor + '10; }\
    .tl-lead-option-icon { font-size: 28px; margin-bottom: 8px; }\
    .tl-lead-option-label { font-size: 14px; font-weight: 600; color: #374151; }\
    .tl-lead-buttons { display: flex; gap: 12px; margin-top: 24px; }\
    .tl-lead-btn { flex: 1; padding: 14px; font-size: 16px; font-weight: 600; border-radius: 10px; cursor: pointer; transition: all 0.2s; }\
    .tl-lead-btn-back { background: #f3f4f6; color: #374151; border: none; }\
    .tl-lead-btn-back:hover { background: #e5e7eb; }\
    .tl-lead-btn-next { background: ' + primaryColor + '; color: #fff; border: none; }\
    .tl-lead-btn-next:hover { opacity: 0.9; transform: translateY(-1px); }\
    .tl-lead-success { text-align: center; padding: 40px 20px; }\
    .tl-lead-success-icon { width: 64px; height: 64px; margin: 0 auto 16px; background: ' + primaryColor + '; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; }\
    .tl-lead-powered { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 20px; }\
    .tl-lead-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';

  var SERVICES = [
    { id: 'interior', label: 'Interior', icon: '🏠' },
    { id: 'exterior', label: 'Exterior', icon: '🏡' },
    { id: 'cabinet', label: 'Cabinets', icon: '🚪' },
    { id: 'commercial', label: 'Commercial', icon: '🏢' }
  ];

  var TIMELINE = [
    { id: 'asap', label: 'ASAP' },
    { id: '1-2weeks', label: '1-2 Weeks' },
    { id: '1month', label: '1 Month' },
    { id: 'flexible', label: 'Flexible' }
  ];

  function injectStyles() {
    if (document.getElementById('tl-lead-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-lead-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function sendWebhook(data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'lead.captured',
      siteId: siteId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }

  function updateProgress() {
    var steps = container.querySelectorAll('.tl-lead-progress-step');
    steps.forEach(function(step, i) {
      step.classList.toggle('active', i < currentStep);
    });
  }

  function showStep(step) {
    container.querySelectorAll('.tl-lead-step').forEach(function(el) {
      el.classList.remove('active');
    });
    var stepEl = container.querySelector('[data-step="' + step + '"]');
    if (stepEl) stepEl.classList.add('active');
    currentStep = step;
    updateProgress();
  }

  function validateStep(step) {
    if (step === 1) {
      return !!formData.service;
    } else if (step === 2) {
      var name = container.querySelector('#tl-lead-name').value.trim();
      var email = container.querySelector('#tl-lead-email').value.trim();
      var phone = container.querySelector('#tl-lead-phone').value.trim();
      formData.name = name;
      formData.email = email;
      formData.phone = phone;
      return name && email;
    } else if (step === 3) {
      formData.address = container.querySelector('#tl-lead-address').value.trim();
      formData.timeline = formData.timeline || 'flexible';
      formData.notes = container.querySelector('#tl-lead-notes').value.trim();
      return !!formData.address;
    }
    return true;
  }

  function submitForm() {
    sendWebhook(formData);

    if (window.TLAnalytics) {
      window.TLAnalytics.track('lead_captured', formData);
    }

    container.querySelector('.tl-lead-container').innerHTML = '\
      <div class="tl-lead-success">\
        <div class="tl-lead-success-icon">✓</div>\
        <div class="tl-lead-title">Thank You!</div>\
        <p style="color:#6b7280;margin-top:8px;">We\'ve received your request and will be in touch within 24 hours.</p>\
      </div>\
      <div class="tl-lead-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
    ';
  }

  function render() {
    injectStyles();
    
    var serviceOptions = SERVICES.map(function(s) {
      return '<div class="tl-lead-option" data-service="' + s.id + '">\
        <div class="tl-lead-option-icon">' + s.icon + '</div>\
        <div class="tl-lead-option-label">' + s.label + '</div>\
      </div>';
    }).join('');

    var timelineOptions = TIMELINE.map(function(t) {
      return '<div class="tl-lead-option" data-timeline="' + t.id + '">\
        <div class="tl-lead-option-label">' + t.label + '</div>\
      </div>';
    }).join('');

    container.innerHTML = '\
      <div class="tl-lead-container">\
        <div class="tl-lead-header">\
          <div class="tl-lead-title">Get Your Free Quote</div>\
          <div class="tl-lead-subtitle">Takes less than 2 minutes</div>\
        </div>\
        <div class="tl-lead-progress">\
          <div class="tl-lead-progress-step active"></div>\
          <div class="tl-lead-progress-step"></div>\
          <div class="tl-lead-progress-step"></div>\
        </div>\
        <div class="tl-lead-step active" data-step="1">\
          <div class="tl-lead-label">What type of service do you need?</div>\
          <div class="tl-lead-options">' + serviceOptions + '</div>\
          <div class="tl-lead-buttons">\
            <button class="tl-lead-btn tl-lead-btn-next" id="tl-next-1" disabled>Next</button>\
          </div>\
        </div>\
        <div class="tl-lead-step" data-step="2">\
          <div class="tl-lead-field">\
            <label class="tl-lead-label">Full Name</label>\
            <input type="text" class="tl-lead-input" id="tl-lead-name" placeholder="John Smith">\
          </div>\
          <div class="tl-lead-field">\
            <label class="tl-lead-label">Email Address</label>\
            <input type="email" class="tl-lead-input" id="tl-lead-email" placeholder="john@example.com">\
          </div>\
          <div class="tl-lead-field">\
            <label class="tl-lead-label">Phone Number</label>\
            <input type="tel" class="tl-lead-input" id="tl-lead-phone" placeholder="(555) 123-4567">\
          </div>\
          <div class="tl-lead-buttons">\
            <button class="tl-lead-btn tl-lead-btn-back" id="tl-back-2">Back</button>\
            <button class="tl-lead-btn tl-lead-btn-next" id="tl-next-2">Next</button>\
          </div>\
        </div>\
        <div class="tl-lead-step" data-step="3">\
          <div class="tl-lead-field">\
            <label class="tl-lead-label">Project Address</label>\
            <input type="text" class="tl-lead-input" id="tl-lead-address" placeholder="123 Main St, City, ST">\
          </div>\
          <div class="tl-lead-field">\
            <label class="tl-lead-label">When do you need this done?</label>\
            <div class="tl-lead-options">' + timelineOptions + '</div>\
          </div>\
          <div class="tl-lead-field">\
            <label class="tl-lead-label">Additional Details (optional)</label>\
            <textarea class="tl-lead-textarea" id="tl-lead-notes" placeholder="Tell us more about your project..."></textarea>\
          </div>\
          <div class="tl-lead-buttons">\
            <button class="tl-lead-btn tl-lead-btn-back" id="tl-back-3">Back</button>\
            <button class="tl-lead-btn tl-lead-btn-next" id="tl-submit">Get My Quote</button>\
          </div>\
        </div>\
        <div class="tl-lead-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';

    bindEvents();
  }

  function bindEvents() {
    container.querySelectorAll('[data-service]').forEach(function(el) {
      el.addEventListener('click', function() {
        container.querySelectorAll('[data-service]').forEach(function(o) { o.classList.remove('selected'); });
        el.classList.add('selected');
        formData.service = el.getAttribute('data-service');
        container.querySelector('#tl-next-1').disabled = false;
      });
    });

    container.querySelectorAll('[data-timeline]').forEach(function(el) {
      el.addEventListener('click', function() {
        container.querySelectorAll('[data-timeline]').forEach(function(o) { o.classList.remove('selected'); });
        el.classList.add('selected');
        formData.timeline = el.getAttribute('data-timeline');
      });
    });

    container.querySelector('#tl-next-1').addEventListener('click', function() {
      if (validateStep(1)) showStep(2);
    });

    container.querySelector('#tl-back-2').addEventListener('click', function() {
      showStep(1);
    });

    container.querySelector('#tl-next-2').addEventListener('click', function() {
      if (validateStep(2)) {
        showStep(3);
      } else {
        alert('Please enter your name and email');
      }
    });

    container.querySelector('#tl-back-3').addEventListener('click', function() {
      showStep(2);
    });

    container.querySelector('#tl-submit').addEventListener('click', function() {
      if (validateStep(3)) {
        submitForm();
      } else {
        alert('Please enter your address');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLLeadCapture = { refresh: render };

  console.log('[TL Lead Capture] Loaded for site:', siteId);

})();
