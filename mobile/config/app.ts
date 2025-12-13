import { NPP_TENANT, TenantConfig } from '../types';

interface AppConfig {
  tenant: TenantConfig;
  apiBaseUrl: string | null;
}

const APP_CONFIG: AppConfig = {
  tenant: NPP_TENANT,
  apiBaseUrl: null,
};

export function getAppConfig(): AppConfig {
  return APP_CONFIG;
}

export function getTenant(): TenantConfig {
  return APP_CONFIG.tenant;
}

export function getApiBaseUrl(): string | null {
  return APP_CONFIG.apiBaseUrl;
}
