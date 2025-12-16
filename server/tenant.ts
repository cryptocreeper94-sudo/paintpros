// Domain to tenant mapping (server-side)
const domainTenantMap: Record<string, string> = {
  "paintpros.io": "demo",
  "www.paintpros.io": "demo",
  "nashpaintpros.io": "npp",
  "www.nashpaintpros.io": "npp",
  "nashvillepaintingprofessionals.com": "npp",
  "www.nashvillepaintingprofessionals.com": "npp",
  "localhost": "npp",
};

// Subdomain to tenant mapping for *.paintpros.io
const subdomainTenantMap: Record<string, string> = {
  "nashpaintpros": "npp",
  "npp": "npp",
  "demo": "demo",
  "www": "demo",
};

export function getTenantFromHostname(hostname: string): string {
  const host = hostname.toLowerCase().split(':')[0];
  
  if (domainTenantMap[host]) {
    return domainTenantMap[host];
  }
  
  const parts = host.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    const baseDomain = parts.slice(-2).join('.');
    
    if (baseDomain === 'paintpros.io' && subdomainTenantMap[subdomain]) {
      return subdomainTenantMap[subdomain];
    }
  }
  
  if (process.env.NODE_ENV !== 'production' && process.env.VITE_TENANT_ID) {
    return process.env.VITE_TENANT_ID;
  }
  
  return "npp";
}
