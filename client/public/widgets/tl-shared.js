/**
 * TrustLayer Widgets - Shared Utilities
 * Version: 1.0.0
 */
(function(global) {
  'use strict';

  var TL_API_BASE = 'https://tlid.io/api';
  
  function getScriptData(scriptId) {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf(scriptId) !== -1) {
        return scripts[i];
      }
    }
    return document.currentScript || scripts[scripts.length - 1];
  }

  function generateId() {
    return 'tl_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  function getSessionId() {
    var sessionId = sessionStorage.getItem('tl_session_id');
    if (!sessionId) {
      sessionId = generateId();
      sessionStorage.setItem('tl_session_id', sessionId);
    }
    return sessionId;
  }

  function apiRequest(endpoint, method, data, apiKey) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, TL_API_BASE + endpoint, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (apiKey) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);
      }
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject({ status: xhr.status, message: xhr.responseText });
        }
      };
      xhr.onerror = function() {
        reject({ status: 0, message: 'Network error' });
      };
      xhr.send(data ? JSON.stringify(data) : null);
    });
  }

  function injectStyles(css, id) {
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createElement(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(key) {
        if (key === 'className') {
          el.className = attrs[key];
        } else if (key === 'style' && typeof attrs[key] === 'object') {
          Object.assign(el.style, attrs[key]);
        } else if (key.startsWith('on') && typeof attrs[key] === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
        } else {
          el.setAttribute(key, attrs[key]);
        }
      });
    }
    if (children) {
      if (typeof children === 'string') {
        el.textContent = children;
      } else if (Array.isArray(children)) {
        children.forEach(function(child) {
          if (child) el.appendChild(child);
        });
      } else {
        el.appendChild(children);
      }
    }
    return el;
  }

  function getColors(primaryColor) {
    var primary = primaryColor || '#3b82f6';
    return {
      primary: primary,
      primaryHover: adjustBrightness(primary, -15),
      background: '#ffffff',
      backgroundDark: '#1f2937',
      text: '#1f2937',
      textDark: '#f9fafb',
      border: '#e5e7eb',
      borderDark: '#374151'
    };
  }

  function adjustBrightness(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = Math.min(255, Math.max(0, (num >> 16) + percent));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
    var b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  }

  function loadWebSocket(url) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
      script.onload = function() { resolve(window.io); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  global.TLShared = {
    API_BASE: TL_API_BASE,
    getScriptData: getScriptData,
    generateId: generateId,
    getSessionId: getSessionId,
    apiRequest: apiRequest,
    injectStyles: injectStyles,
    createElement: createElement,
    getColors: getColors,
    loadWebSocket: loadWebSocket
  };

})(window);
