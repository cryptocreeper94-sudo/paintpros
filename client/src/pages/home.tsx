import { useTenant } from "@/context/TenantContext";
import HomeDemo from "./home-demo";
import HomeNPP from "./home-npp";

export default function Home() {
  const tenant = useTenant();
  
  // Check for developer layout override in localStorage
  const layoutOverride = typeof window !== 'undefined' 
    ? localStorage.getItem('dev_layout_override') 
    : null;
  
  // If there's a layout override, use it regardless of tenant
  if (layoutOverride === 'bento') {
    return <HomeDemo />;
  }
  if (layoutOverride === 'minimalist') {
    return <HomeNPP />;
  }
  
  // Default: Use the full-featured Bento layout for all tenants
  // NPP now uses the same rich homepage with awards, color palette, service area, etc.
  return <HomeDemo />;
}
