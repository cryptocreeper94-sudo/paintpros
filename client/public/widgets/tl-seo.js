/**
 * TrustLayer SEO Manager Widget
 * Version: 1.0.0
 * 
 * Usage:
 * <script src="https://tlid.io/widgets/tl-seo.js" 
 *         data-site-id="YOUR_SITE_ID"
 *         data-api-key="YOUR_API_KEY"></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var siteId = currentScript.getAttribute('data-site-id');
  var apiKey = currentScript.getAttribute('data-api-key');
  var autoFix = currentScript.getAttribute('data-auto-fix') === 'true';

  var issues = [];
  var score = 100;

  function checkMetaTag(name, maxLength) {
    var tag = document.querySelector('meta[name="' + name + '"]') || 
              document.querySelector('meta[property="' + name + '"]');
    var content = tag ? tag.getAttribute('content') : null;
    
    if (!content) {
      issues.push({ type: 'missing', tag: name, severity: 'high', message: 'Missing ' + name + ' tag' });
      return null;
    }
    
    if (maxLength && content.length > maxLength) {
      issues.push({ type: 'length', tag: name, severity: 'medium', message: name + ' exceeds ' + maxLength + ' characters' });
    }
    
    return content;
  }

  function checkTitle() {
    var title = document.title;
    if (!title) {
      issues.push({ type: 'missing', tag: 'title', severity: 'critical', message: 'Missing page title' });
      return null;
    }
    if (title.length > 60) {
      issues.push({ type: 'length', tag: 'title', severity: 'medium', message: 'Title exceeds 60 characters (' + title.length + ')' });
    }
    if (title.length < 30) {
      issues.push({ type: 'length', tag: 'title', severity: 'low', message: 'Title is too short (< 30 characters)' });
    }
    return title;
  }

  function checkHeadings() {
    var h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      issues.push({ type: 'missing', tag: 'h1', severity: 'high', message: 'Missing H1 heading' });
    } else if (h1s.length > 1) {
      issues.push({ type: 'multiple', tag: 'h1', severity: 'medium', message: 'Multiple H1 headings (' + h1s.length + ')' });
    }
    
    var h2s = document.querySelectorAll('h2');
    if (h2s.length === 0) {
      issues.push({ type: 'missing', tag: 'h2', severity: 'low', message: 'No H2 headings found' });
    }
  }

  function checkImages() {
    var images = document.querySelectorAll('img');
    var missingAlt = 0;
    
    images.forEach(function(img) {
      if (!img.getAttribute('alt')) missingAlt++;
    });
    
    if (missingAlt > 0) {
      issues.push({ type: 'accessibility', tag: 'img', severity: 'medium', message: missingAlt + ' images missing alt text' });
    }
  }

  function checkCanonical() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      issues.push({ type: 'missing', tag: 'canonical', severity: 'medium', message: 'Missing canonical URL' });
    }
  }

  function checkOpenGraph() {
    checkMetaTag('og:title', 95);
    checkMetaTag('og:description', 200);
    checkMetaTag('og:image', null);
    checkMetaTag('og:url', null);
  }

  function checkTwitterCards() {
    checkMetaTag('twitter:card', null);
    checkMetaTag('twitter:title', 70);
    checkMetaTag('twitter:description', 200);
  }

  function checkStructuredData() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    if (scripts.length === 0) {
      issues.push({ type: 'missing', tag: 'structured-data', severity: 'medium', message: 'No structured data (JSON-LD) found' });
    }
  }

  function calculateScore() {
    var deductions = {
      critical: 25,
      high: 15,
      medium: 5,
      low: 2
    };
    
    issues.forEach(function(issue) {
      score -= deductions[issue.severity] || 5;
    });
    
    return Math.max(0, score);
  }

  function generateReport() {
    return {
      url: window.location.href,
      title: document.title,
      score: score,
      issueCount: issues.length,
      issues: issues,
      timestamp: new Date().toISOString(),
      siteId: siteId
    };
  }

  function injectSchemaGenerator() {
    window.TLSeoSchema = {
      localBusiness: function(data) {
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": data.name,
          "description": data.description,
          "url": data.url || window.location.origin,
          "telephone": data.phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.streetAddress,
            "addressLocality": data.city,
            "addressRegion": data.state,
            "postalCode": data.zip,
            "addressCountry": data.country || "US"
          },
          "geo": data.lat && data.lng ? {
            "@type": "GeoCoordinates",
            "latitude": data.lat,
            "longitude": data.lng
          } : undefined,
          "openingHours": data.hours,
          "priceRange": data.priceRange || "$$",
          "image": data.image,
          "sameAs": data.socialLinks || []
        };
      },
      
      service: function(data) {
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data.name,
          "description": data.description,
          "provider": {
            "@type": "LocalBusiness",
            "name": data.providerName
          },
          "areaServed": data.serviceArea,
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "USD"
          }
        };
      },
      
      faq: function(questions) {
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": questions.map(function(q) {
            return {
              "@type": "Question",
              "name": q.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": q.answer
              }
            };
          })
        };
      },
      
      inject: function(schema) {
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    };
  }

  function runAudit() {
    issues = [];
    score = 100;
    
    checkTitle();
    checkMetaTag('description', 160);
    checkHeadings();
    checkImages();
    checkCanonical();
    checkOpenGraph();
    checkTwitterCards();
    checkStructuredData();
    
    score = calculateScore();
    
    return generateReport();
  }

  function sendReport(report) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://tlid.io/api/seo/report', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (apiKey) xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);
    xhr.send(JSON.stringify(report));
  }

  injectSchemaGenerator();
  var report = runAudit();
  
  if (apiKey) {
    sendReport(report);
  }

  window.TLSEO = {
    audit: runAudit,
    getReport: function() { return report; },
    getScore: function() { return score; },
    getIssues: function() { return issues; },
    schema: window.TLSeoSchema
  };

  console.log('[TL SEO] Audit complete. Score:', score, '/ 100. Issues:', issues.length);

})();
