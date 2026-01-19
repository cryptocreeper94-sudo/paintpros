// Google Analytics hook for tracking page views
// Reference: blueprint:javascript_google_analytics

import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '../lib/analytics';
import { useTenant } from '@/context/TenantContext';

export const useAnalytics = () => {
  const [location] = useLocation();
  const tenant = useTenant();
  const prevLocationRef = useRef<string>(location);
  
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(location, tenant?.id);
      prevLocationRef.current = location;
    }
  }, [location, tenant?.id]);
};
