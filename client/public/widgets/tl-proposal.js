/**
 * TrustLayer Proposal Builder Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <div id="tl-proposal"></div>
 * <script src="https://tlid.io/widgets/tl-proposal.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"
 *         data-proposal-id="PROPOSAL_ID"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var proposalId = currentScript.getAttribute('data-proposal-id');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-proposal';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');
  var companyName = currentScript.getAttribute('data-company') || 'Your Company';

  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL Proposal] Container not found:', containerId);
    return;
  }

  var css = '\
    .tl-prop-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }\
    .tl-prop-header { background: linear-gradient(135deg, ' + primaryColor + ' 0%, ' + adjustColor(primaryColor, -30) + ' 100%); color: #fff; padding: 32px; }\
    .tl-prop-company { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }\
    .tl-prop-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }\
    .tl-prop-meta { font-size: 14px; opacity: 0.8; }\
    .tl-prop-body { padding: 32px; }\
    .tl-prop-section { margin-bottom: 32px; }\
    .tl-prop-section-title { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }\
    .tl-prop-customer { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }\
    .tl-prop-field { }\
    .tl-prop-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }\
    .tl-prop-value { font-size: 14px; color: #1f2937; font-weight: 500; }\
    .tl-prop-items { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }\
    .tl-prop-item { display: grid; grid-template-columns: 1fr 100px 100px; padding: 16px; border-bottom: 1px solid #e5e7eb; }\
    .tl-prop-item:last-child { border-bottom: none; }\
    .tl-prop-item-header { background: #f9fafb; font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; }\
    .tl-prop-item-name { font-weight: 500; color: #1f2937; }\
    .tl-prop-item-desc { font-size: 13px; color: #6b7280; margin-top: 4px; }\
    .tl-prop-item-qty, .tl-prop-item-price { text-align: right; font-weight: 500; }\
    .tl-prop-total { display: flex; justify-content: flex-end; padding: 20px; background: #f9fafb; }\
    .tl-prop-total-row { display: flex; gap: 40px; }\
    .tl-prop-total-label { color: #6b7280; }\
    .tl-prop-total-value { font-size: 24px; font-weight: 700; color: ' + primaryColor + '; }\
    .tl-prop-terms { font-size: 13px; color: #6b7280; line-height: 1.6; }\
    .tl-prop-signature { margin-top: 32px; padding: 24px; border: 2px dashed #e5e7eb; border-radius: 8px; }\
    .tl-prop-sig-title { font-weight: 600; color: #1f2937; margin-bottom: 16px; }\
    .tl-prop-sig-input { width: 100%; padding: 16px; font-size: 24px; font-family: "Brush Script MT", cursive; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 16px; }\
    .tl-prop-sig-line { display: flex; justify-content: space-between; gap: 20px; }\
    .tl-prop-sig-field { flex: 1; }\
    .tl-prop-sig-field input { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; box-sizing: border-box; }\
    .tl-prop-btn { width: 100%; padding: 16px; font-size: 16px; font-weight: 600; color: #fff; background: ' + primaryColor + '; border: none; border-radius: 8px; cursor: pointer; margin-top: 24px; transition: opacity 0.2s; }\
    .tl-prop-btn:hover { opacity: 0.9; }\
    .tl-prop-btn:disabled { opacity: 0.5; cursor: not-allowed; }\
    .tl-prop-success { text-align: center; padding: 60px 32px; }\
    .tl-prop-success-icon { font-size: 64px; margin-bottom: 16px; }\
    .tl-prop-powered { text-align: center; font-size: 12px; color: #9ca3af; padding: 16px; }\
    .tl-prop-powered a { color: ' + primaryColor + '; text-decoration: none; }\
    @media (max-width: 600px) { .tl-prop-customer { grid-template-columns: 1fr; } .tl-prop-item { grid-template-columns: 1fr; gap: 8px; } .tl-prop-item-qty, .tl-prop-item-price { text-align: left; } }\
  ';

  var SAMPLE_PROPOSAL = {
    id: proposalId || 'P-2026-001',
    customer: { name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', address: '123 Main St, Nashville, TN 37201' },
    items: [
      { name: 'Interior Painting - Living Room', description: 'Walls and ceiling, 2 coats', qty: '400 sq ft', price: 1200 },
      { name: 'Interior Painting - Kitchen', description: 'Walls only, premium paint', qty: '250 sq ft', price: 850 },
      { name: 'Trim & Baseboards', description: 'All rooms, semi-gloss finish', qty: '180 linear ft', price: 540 },
      { name: 'Prep Work & Materials', description: 'Patching, sanding, primer', qty: '1', price: 350 }
    ],
    terms: 'Payment: 50% deposit, 50% upon completion. Work guaranteed for 2 years. Estimate valid for 30 days.',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
  };

  function adjustColor(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = Math.min(255, Math.max(0, (num >> 16) + percent));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    var b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }

  function injectStyles() {
    if (document.getElementById('tl-prop-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-prop-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function sendWebhook(data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'proposal.signed',
      siteId: siteId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }

  function render() {
    injectStyles();
    
    var proposal = SAMPLE_PROPOSAL;
    var total = proposal.items.reduce(function(sum, item) { return sum + item.price; }, 0);
    
    var itemsHtml = proposal.items.map(function(item) {
      return '<div class="tl-prop-item">\
        <div><div class="tl-prop-item-name">' + item.name + '</div><div class="tl-prop-item-desc">' + item.description + '</div></div>\
        <div class="tl-prop-item-qty">' + item.qty + '</div>\
        <div class="tl-prop-item-price">' + formatCurrency(item.price) + '</div>\
      </div>';
    }).join('');

    container.innerHTML = '\
      <div class="tl-prop-container">\
        <div class="tl-prop-header">\
          <div class="tl-prop-company">' + companyName + '</div>\
          <div class="tl-prop-title">Project Proposal</div>\
          <div class="tl-prop-meta">Proposal #' + proposal.id + ' | Valid until ' + proposal.validUntil + '</div>\
        </div>\
        <div class="tl-prop-body">\
          <div class="tl-prop-section">\
            <div class="tl-prop-section-title">Customer Information</div>\
            <div class="tl-prop-customer">\
              <div class="tl-prop-field"><div class="tl-prop-label">Name</div><div class="tl-prop-value">' + proposal.customer.name + '</div></div>\
              <div class="tl-prop-field"><div class="tl-prop-label">Email</div><div class="tl-prop-value">' + proposal.customer.email + '</div></div>\
              <div class="tl-prop-field"><div class="tl-prop-label">Phone</div><div class="tl-prop-value">' + proposal.customer.phone + '</div></div>\
              <div class="tl-prop-field"><div class="tl-prop-label">Address</div><div class="tl-prop-value">' + proposal.customer.address + '</div></div>\
            </div>\
          </div>\
          <div class="tl-prop-section">\
            <div class="tl-prop-section-title">Scope of Work</div>\
            <div class="tl-prop-items">\
              <div class="tl-prop-item tl-prop-item-header"><div>Description</div><div class="tl-prop-item-qty">Quantity</div><div class="tl-prop-item-price">Price</div></div>\
              ' + itemsHtml + '\
            </div>\
            <div class="tl-prop-total">\
              <div class="tl-prop-total-row">\
                <div class="tl-prop-total-label">Total</div>\
                <div class="tl-prop-total-value">' + formatCurrency(total) + '</div>\
              </div>\
            </div>\
          </div>\
          <div class="tl-prop-section">\
            <div class="tl-prop-section-title">Terms & Conditions</div>\
            <div class="tl-prop-terms">' + proposal.terms + '</div>\
          </div>\
          <div class="tl-prop-signature">\
            <div class="tl-prop-sig-title">Sign to Accept Proposal</div>\
            <input type="text" class="tl-prop-sig-input" id="tl-signature" placeholder="Type your signature">\
            <div class="tl-prop-sig-line">\
              <div class="tl-prop-sig-field"><input type="text" id="tl-sig-name" placeholder="Printed Name"></div>\
              <div class="tl-prop-sig-field"><input type="date" id="tl-sig-date" value="' + new Date().toISOString().split('T')[0] + '"></div>\
            </div>\
            <button class="tl-prop-btn" id="tl-accept-btn">Accept & Sign Proposal</button>\
          </div>\
        </div>\
        <div class="tl-prop-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
    ';

    document.getElementById('tl-accept-btn').addEventListener('click', function() {
      var signature = document.getElementById('tl-signature').value.trim();
      var name = document.getElementById('tl-sig-name').value.trim();
      var date = document.getElementById('tl-sig-date').value;

      if (!signature || !name) {
        alert('Please provide your signature and printed name');
        return;
      }

      var signatureData = {
        proposalId: proposal.id,
        signature: signature,
        printedName: name,
        signedDate: date,
        total: total
      };

      sendWebhook(signatureData);

      if (window.TLAnalytics) {
        window.TLAnalytics.track('proposal_signed', signatureData);
      }

      container.querySelector('.tl-prop-body').innerHTML = '\
        <div class="tl-prop-success">\
          <div class="tl-prop-success-icon">✓</div>\
          <div style="font-size:24px;font-weight:700;color:#1f2937;margin-bottom:8px;">Proposal Accepted!</div>\
          <p style="color:#6b7280;">Thank you for your business. We\'ll be in touch shortly to schedule your project.</p>\
        </div>\
      ';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLProposal = { refresh: render };

  console.log('[TL Proposal] Loaded for site:', siteId);

})();
