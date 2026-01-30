/**
 * TrustLayer Live Chat Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <script src="https://tlid.io/widgets/tl-chat.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"
 *         data-primary-color="#3b82f6"
 *         data-position="right"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var primaryColor = currentScript.getAttribute('data-primary-color') || '#3b82f6';
  var position = currentScript.getAttribute('data-position') || 'right';
  var webhookUrl = currentScript.getAttribute('data-webhook-url');
  var greeting = currentScript.getAttribute('data-greeting') || 'Hi! How can we help you today?';
  var agentName = currentScript.getAttribute('data-agent-name') || 'Support';

  var isOpen = false;
  var messages = [];
  var visitorId = sessionStorage.getItem('tl_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('tl_visitor_id', visitorId);
  }

  var css = '\
    .tl-chat-widget { position: fixed; bottom: 20px; ' + position + ': 20px; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }\
    .tl-chat-button { width: 60px; height: 60px; border-radius: 50%; background: ' + primaryColor + '; color: #fff; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }\
    .tl-chat-button:hover { transform: scale(1.05); }\
    .tl-chat-button svg { width: 28px; height: 28px; }\
    .tl-chat-window { position: absolute; bottom: 80px; ' + position + ': 0; width: 360px; height: 500px; background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; }\
    .tl-chat-window.open { display: flex; }\
    .tl-chat-header { background: ' + primaryColor + '; color: #fff; padding: 16px 20px; display: flex; align-items: center; gap: 12px; }\
    .tl-chat-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-weight: 600; }\
    .tl-chat-header-info h3 { margin: 0; font-size: 16px; font-weight: 600; }\
    .tl-chat-header-info p { margin: 4px 0 0; font-size: 12px; opacity: 0.8; }\
    .tl-chat-close { margin-left: auto; background: none; border: none; color: #fff; cursor: pointer; font-size: 24px; opacity: 0.8; }\
    .tl-chat-close:hover { opacity: 1; }\
    .tl-chat-messages { flex: 1; padding: 16px; overflow-y: auto; background: #f9fafb; }\
    .tl-chat-message { margin-bottom: 12px; display: flex; }\
    .tl-chat-message.visitor { justify-content: flex-end; }\
    .tl-chat-bubble { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.4; }\
    .tl-chat-message.agent .tl-chat-bubble { background: #fff; color: #1f2937; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; }\
    .tl-chat-message.visitor .tl-chat-bubble { background: ' + primaryColor + '; color: #fff; border-bottom-right-radius: 4px; }\
    .tl-chat-time { font-size: 10px; color: #9ca3af; margin-top: 4px; }\
    .tl-chat-input-area { padding: 16px; background: #fff; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; }\
    .tl-chat-input { flex: 1; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 24px; font-size: 14px; outline: none; }\
    .tl-chat-input:focus { border-color: ' + primaryColor + '; }\
    .tl-chat-send { width: 44px; height: 44px; border-radius: 50%; background: ' + primaryColor + '; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }\
    .tl-chat-send:hover { opacity: 0.9; }\
    .tl-chat-send svg { width: 20px; height: 20px; }\
    .tl-chat-typing { padding: 8px 16px; font-size: 12px; color: #9ca3af; font-style: italic; }\
    .tl-chat-powered { text-align: center; padding: 8px; font-size: 11px; color: #9ca3af; background: #fff; }\
    .tl-chat-powered a { color: ' + primaryColor + '; text-decoration: none; }\
    @media (max-width: 480px) { .tl-chat-window { width: calc(100vw - 40px); height: calc(100vh - 120px); bottom: 70px; } }\
  ';

  function injectStyles() {
    if (document.getElementById('tl-chat-styles')) return;
    var style = document.createElement('style');
    style.id = 'tl-chat-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(text, sender) {
    messages.push({ text: text, sender: sender, time: new Date() });
    renderMessages();
    
    if (webhookUrl && sender === 'visitor') {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', webhookUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        event: 'chat.message',
        siteId: siteId,
        visitorId: visitorId,
        timestamp: new Date().toISOString(),
        data: { text: text, sender: sender }
      }));
    }
  }

  function renderMessages() {
    var container = document.getElementById('tl-chat-messages');
    if (!container) return;
    
    container.innerHTML = messages.map(function(msg) {
      return '<div class="tl-chat-message ' + msg.sender + '">\
        <div class="tl-chat-bubble">' + escapeHtml(msg.text) + '<div class="tl-chat-time">' + formatTime(msg.time) + '</div></div>\
      </div>';
    }).join('');
    
    container.scrollTop = container.scrollHeight;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function simulateResponse(userMessage) {
    setTimeout(function() {
      var responses = [
        "Thanks for reaching out! A team member will be with you shortly.",
        "I've noted your message. Someone will respond within a few minutes.",
        "Got it! We typically respond within 5 minutes during business hours."
      ];
      addMessage(responses[Math.floor(Math.random() * responses.length)], 'agent');
    }, 1500);
  }

  function render() {
    injectStyles();
    
    var widget = document.createElement('div');
    widget.className = 'tl-chat-widget';
    widget.innerHTML = '\
      <div class="tl-chat-window" id="tl-chat-window">\
        <div class="tl-chat-header">\
          <div class="tl-chat-avatar">' + agentName[0] + '</div>\
          <div class="tl-chat-header-info">\
            <h3>' + agentName + '</h3>\
            <p>We typically reply within minutes</p>\
          </div>\
          <button class="tl-chat-close" id="tl-chat-close">&times;</button>\
        </div>\
        <div class="tl-chat-messages" id="tl-chat-messages"></div>\
        <div class="tl-chat-input-area">\
          <input type="text" class="tl-chat-input" id="tl-chat-input" placeholder="Type a message...">\
          <button class="tl-chat-send" id="tl-chat-send">\
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>\
          </button>\
        </div>\
        <div class="tl-chat-powered">Powered by <a href="https://tlid.io" target="_blank">TrustLayer</a></div>\
      </div>\
      <button class="tl-chat-button" id="tl-chat-button">\
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>\
      </button>\
    ';
    
    document.body.appendChild(widget);
    
    addMessage(greeting, 'agent');
    
    document.getElementById('tl-chat-button').addEventListener('click', function() {
      isOpen = !isOpen;
      document.getElementById('tl-chat-window').classList.toggle('open', isOpen);
      if (isOpen) {
        document.getElementById('tl-chat-input').focus();
      }
    });
    
    document.getElementById('tl-chat-close').addEventListener('click', function() {
      isOpen = false;
      document.getElementById('tl-chat-window').classList.remove('open');
    });
    
    document.getElementById('tl-chat-send').addEventListener('click', sendMessage);
    document.getElementById('tl-chat-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function sendMessage() {
    var input = document.getElementById('tl-chat-input');
    var text = input.value.trim();
    if (!text) return;
    
    addMessage(text, 'visitor');
    input.value = '';
    
    if (window.TLAnalytics) {
      window.TLAnalytics.track('chat_message', { visitorId: visitorId });
    }
    
    simulateResponse(text);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.TLChat = {
    open: function() { isOpen = true; document.getElementById('tl-chat-window').classList.add('open'); },
    close: function() { isOpen = false; document.getElementById('tl-chat-window').classList.remove('open'); },
    sendMessage: function(text) { addMessage(text, 'agent'); }
  };

  console.log('[TL Chat] Loaded for site:', siteId);

})();
