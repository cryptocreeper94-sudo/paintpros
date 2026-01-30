/**
 * TrustLayer CRM Pipeline Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <div id="tl-crm"></div>
 * <script src="https://tlid.io/widgets/tl-crm.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var containerId = currentScript.getAttribute('data-container') || 'tl-crm';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');

  var container = document.getElementById(containerId);
  if (!container) {
    console.warn('[TL CRM] Container not found:', containerId);
    return;
  }

  var STAGES = [
    { id: 'lead', name: 'New Leads', color: '#6366f1' },
    { id: 'qualified', name: 'Qualified', color: '#8b5cf6' },
    { id: 'proposal', name: 'Proposal Sent', color: '#f59e0b' },
    { id: 'negotiation', name: 'Negotiation', color: '#3b82f6' },
    { id: 'won', name: 'Won', color: '#10b981' }
  ];

  var deals = [
    { id: 1, name: 'John Smith', value: 2500, stage: 'lead', email: 'john@email.com', phone: '555-0101', service: 'Interior Painting' },
    { id: 2, name: 'Sarah Johnson', value: 4200, stage: 'qualified', email: 'sarah@email.com', phone: '555-0102', service: 'Exterior Painting' },
    { id: 3, name: 'Mike Davis', value: 1800, stage: 'proposal', email: 'mike@email.com', phone: '555-0103', service: 'Cabinet Refinishing' },
    { id: 4, name: 'Emily Wilson', value: 3500, stage: 'proposal', email: 'emily@email.com', phone: '555-0104', service: 'Full Home Interior' },
    { id: 5, name: 'Robert Brown', value: 6000, stage: 'negotiation', email: 'robert@email.com', phone: '555-0105', service: 'Commercial Project' },
    { id: 6, name: 'Lisa Anderson', value: 2800, stage: 'won', email: 'lisa@email.com', phone: '555-0106', service: 'Kitchen Cabinets' }
  ];

  var css = '\
    .tl-crm-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f9fafb; border-radius: 12px; padding: 20px; }\
    .tl-crm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }\
    .tl-crm-title { font-size: 20px; font-weight: 700; color: #1f2937; }\
    .tl-crm-stats { display: flex; gap: 24px; }\
    .tl-crm-stat { text-align: center; }\
    .tl-crm-stat-value { font-size: 24px; font-weight: 700; color: ' + primaryColor + '; }\
    .tl-crm-stat-label { font-size: 12px; color: #6b7280; }\
    .tl-crm-pipeline { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; }\
    .tl-crm-column { flex: 0 0 260px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }\
    .tl-crm-column-header { padding: 16px; border-bottom: 3px solid; display: flex; justify-content: space-between; align-items: center; }\
    .tl-crm-column-title { font-size: 14px; font-weight: 600; color: #374151; }\
    .tl-crm-column-count { background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #6b7280; }\
    .tl-crm-column-body { padding: 12px; min-height: 200px; }\
    .tl-crm-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }\
    .tl-crm-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(-2px); }\
    .tl-crm-card-name { font-weight: 600; color: #1f2937; margin-bottom: 4px; }\
    .tl-crm-card-service { font-size: 13px; color: #6b7280; margin-bottom: 8px; }\
    .tl-crm-card-value { font-size: 16px; font-weight: 700; color: ' + primaryColor + '; }\
    .tl-crm-card-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 12px; color: #9ca3af; }\
    .tl-crm-add-btn { width: 100%; padding: 10px; background: #f9fafb; border: 2px dashed #e5e7eb; border-radius: 8px; color: #6b7280; font-size: 14px; cursor: pointer; transition: all 0.2s; }\
    .tl-crm-add-btn:hover { border-color: ' + primaryColor + '; color: ' + primaryColor + '; }\
    .tl-crm-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 10000; }\
    .tl-crm-modal.open { display: flex; }\
    .tl-crm-modal-content { background: #fff; border-radius: 16px; width: 400px; max-width: 90%; max-height: 90vh; overflow-y: auto; }\
    .tl-crm-modal-header { padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }\
    .tl-crm-modal-title { font-size: 18px; font-weight: 600; color: #1f2937; }\
    .tl-crm-modal-close { background: none; border: none; font-size: 24px; color: #9ca3af; cursor: pointer; }\
    .tl-crm-modal-body { padding: 20px; }\
    .tl-crm-field { margin-bottom: 16px; }\
    .tl-crm-label { display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px; }\
    .tl-crm-input, .tl-crm-select { width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box; }\
    .tl-crm-input:focus, .tl-crm-select:focus { outline: none; border-color: ' + primaryColor + '; }\
    .tl-crm-modal-footer { padding: 16px 20px; border-top: 1px solid #e5e7eb; display: flex; gap: 12px; justify-content: flex-end; }\
    .tl-crm-btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }\
    .tl-crm-btn-secondary { background: #f3f4f6; color: #374151; border: none; }\
    .tl-crm-btn-primary { background: ' + primaryColor + '; color: #fff; border: none; }\
    .tl-crm-btn-primary:hover { opacity: 0.9; }\
    .tl-crm-powered { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 16px; }\
    .tl-crm-powered a { color: ' + primaryColor + '; text-decoration: none; }\
  ';

  function injectStyles() {
    if (document.getElementById('tl-crm-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-crm-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString();
  }

  function getDealsForStage(stageId) {
    return deals.filter(function(d) { return d.stage === stageId; });
  }

  function getTotalValue() {
    return deals.reduce(function(sum, d) { return sum + d.value; }, 0);
  }

  function sendWebhook(eventType, data) {
    if (!webhookUrl) return;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      event: 'crm.' + eventType,
      siteId: siteId,
      timestamp: new Date().toISOString(),
      data: data
    }));
  }

  function renderCard(deal) {
    return '<div class="tl-crm-card" data-id="' + deal.id + '">\
      <div class="tl-crm-card-name">' + deal.name + '</div>\
      <div class="tl-crm-card-service">' + deal.service + '</div>\
      <div class="tl-crm-card-value">' + formatCurrency(deal.value) + '</div>\
      <div class="tl-crm-card-meta">\
        <span>' + deal.email + '</span>\
      </div>\
    </div>';
  }

  function renderColumn(stage) {
    var stageDeals = getDealsForStage(stage.id);
    var cardsHtml = stageDeals.map(renderCard).join('');
    var stageTotal = stageDeals.reduce(function(sum, d) { return sum + d.value; }, 0);
    
    return '<div class="tl-crm-column">\
      <div class="tl-crm-column-header" style="border-color: ' + stage.color + ';">\
        <span class="tl-crm-column-title">' + stage.name + '</span>\
        <span class="tl-crm-column-count">' + stageDeals.length + ' | ' + formatCurrency(stageTotal) + '</span>\
      </div>\
      <div class="tl-crm-column-body" data-stage="' + stage.id + '">\
        ' + cardsHtml + '\
        <button class="tl-crm-add-btn" data-stage="' + stage.id + '">+ Add Deal</button>\
      </div>\
    </div>';
  }

  function openModal(deal) {
    var modal = document.getElementById('tl-crm-modal');
    var isNew = !deal;
    
    document.getElementById('tl-crm-modal-title').textContent = isNew ? 'Add New Deal' : 'Edit Deal';
    document.getElementById('tl-deal-name').value = deal ? deal.name : '';
    document.getElementById('tl-deal-email').value = deal ? deal.email : '';
    document.getElementById('tl-deal-phone').value = deal ? deal.phone : '';
    document.getElementById('tl-deal-service').value = deal ? deal.service : '';
    document.getElementById('tl-deal-value').value = deal ? deal.value : '';
    document.getElementById('tl-deal-stage').value = deal ? deal.stage : 'lead';
    document.getElementById('tl-deal-id').value = deal ? deal.id : '';
    
    modal.classList.add('open');
  }

  function closeModal() {
    document.getElementById('tl-crm-modal').classList.remove('open');
  }

  function saveDeal() {
    var id = document.getElementById('tl-deal-id').value;
    var dealData = {
      name: document.getElementById('tl-deal-name').value.trim(),
      email: document.getElementById('tl-deal-email').value.trim(),
      phone: document.getElementById('tl-deal-phone').value.trim(),
      service: document.getElementById('tl-deal-service').value.trim(),
      value: parseInt(document.getElementById('tl-deal-value').value) || 0,
      stage: document.getElementById('tl-deal-stage').value
    };

    if (!dealData.name) {
      alert('Please enter a name');
      return;
    }

    if (id) {
      var idx = deals.findIndex(function(d) { return d.id === parseInt(id); });
      if (idx !== -1) {
        deals[idx] = Object.assign({}, deals[idx], dealData);
        sendWebhook('deal_updated', deals[idx]);
      }
    } else {
      dealData.id = Date.now();
      deals.push(dealData);
      sendWebhook('deal_created', dealData);
    }

    closeModal();
    renderPipeline();

    if (window.TLAnalytics) {
      window.TLAnalytics.track(id ? 'crm_deal_updated' : 'crm_deal_created', dealData);
    }
  }

  function renderPipeline() {
    document.getElementById('tl-crm-pipeline').innerHTML = STAGES.map(renderColumn).join('');
    document.getElementById('tl-crm-total').textContent = formatCurrency(getTotalValue());
    document.getElementById('tl-crm-count').textContent = deals.length;

    document.querySelectorAll('.tl-crm-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var id = parseInt(card.getAttribute('data-id'));
        var deal = deals.find(function(d) { return d.id === id; });
        if (deal) openModal(deal);
      });
    });

    document.querySelectorAll('.tl-crm-add-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        openModal(null);
        document.getElementById('tl-deal-stage').value = btn.getAttribute('data-stage');
      });
    });
  }

  function render() {
    injectStyles();

    var stageOptions = STAGES.map(function(s) {
      return '<option value="' + s.id + '">' + s.name + '</option>';
    }).join('');

    container.innerHTML = '\
      <div class="tl-crm-container">\
        <div class="tl-crm-header">\
          <div class="tl-crm-title">Sales Pipeline</div>\
          <div class="tl-crm-stats">\
            <div class="tl-crm-stat"><div class="tl-crm-stat-value" id="tl-crm-count">' + deals.length + '</div><div class="tl-crm-stat-label">Deals</div></div>\
            <div class="tl-crm-stat"><div class="tl-crm-stat-value" id="tl-crm-total">' + formatCurrency(getTotalValue()) + '</div><div class="tl-crm-stat-label">Pipeline Value</div></div>\
          </div>\
        </div>\
        <div class="tl-crm-pipeline" id="tl-crm-pipeline"></div>\
        <div class="tl-crm-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
      <div class="tl-crm-modal" id="tl-crm-modal">\
        <div class="tl-crm-modal-content">\
          <div class="tl-crm-modal-header">\
            <span class="tl-crm-modal-title" id="tl-crm-modal-title">Add Deal</span>\
            <button class="tl-crm-modal-close" id="tl-crm-modal-close">&times;</button>\
          </div>\
          <div class="tl-crm-modal-body">\
            <input type="hidden" id="tl-deal-id">\
            <div class="tl-crm-field"><label class="tl-crm-label">Name</label><input type="text" class="tl-crm-input" id="tl-deal-name" placeholder="Customer name"></div>\
            <div class="tl-crm-field"><label class="tl-crm-label">Email</label><input type="email" class="tl-crm-input" id="tl-deal-email" placeholder="email@example.com"></div>\
            <div class="tl-crm-field"><label class="tl-crm-label">Phone</label><input type="tel" class="tl-crm-input" id="tl-deal-phone" placeholder="555-0123"></div>\
            <div class="tl-crm-field"><label class="tl-crm-label">Service</label><input type="text" class="tl-crm-input" id="tl-deal-service" placeholder="Interior Painting"></div>\
            <div class="tl-crm-field"><label class="tl-crm-label">Value ($)</label><input type="number" class="tl-crm-input" id="tl-deal-value" placeholder="2500"></div>\
            <div class="tl-crm-field"><label class="tl-crm-label">Stage</label><select class="tl-crm-select" id="tl-deal-stage">' + stageOptions + '</select></div>\
          </div>\
          <div class="tl-crm-modal-footer">\
            <button class="tl-crm-btn tl-crm-btn-secondary" id="tl-crm-cancel">Cancel</button>\
            <button class="tl-crm-btn tl-crm-btn-primary" id="tl-crm-save">Save Deal</button>\
          </div>\
        </div>\
      </div>\
    ';

    renderPipeline();

    document.getElementById('tl-crm-modal-close').addEventListener('click', closeModal);
    document.getElementById('tl-crm-cancel').addEventListener('click', closeModal);
    document.getElementById('tl-crm-save').addEventListener('click', saveDeal);
    document.getElementById('tl-crm-modal').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLCRM = { refresh: render, getDeals: function() { return deals; } };

  console.log('[TL CRM] Loaded for site:', siteId);

})();
