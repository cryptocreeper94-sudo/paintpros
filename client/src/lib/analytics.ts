// Google Analytics 4 Integration
// Reference: blueprint:javascript_google_analytics

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Track if GA script has already been added
let gaScriptAdded = false;

// Initialize Google Analytics
export const initGA = () => {
  // SSR guard
  if (typeof window === 'undefined') return;
  
  // Prevent duplicate script injection
  if (gaScriptAdded) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Mark as added before async operations
  gaScriptAdded = true;

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string, tenantId?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url,
    custom_map: {
      'dimension1': 'tenant_id'
    },
    tenant_id: tenantId
  });
};

// Track events with tenant context
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number,
  tenantId?: string
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    tenant_id: tenantId
  });
};

// Track estimate submissions
export const trackEstimateSubmission = (tenantId: string, estimateValue?: number) => {
  trackEvent('estimate_submitted', 'conversion', tenantId, estimateValue, tenantId);
};

// Track lead captures
export const trackLeadCapture = (tenantId: string, source?: string) => {
  trackEvent('lead_captured', 'conversion', source || 'direct', undefined, tenantId);
};

// Track contractor applications
export const trackContractorApplication = (tenantId: string) => {
  trackEvent('contractor_application', 'conversion', tenantId, undefined, tenantId);
};
