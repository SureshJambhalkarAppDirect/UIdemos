// Adobe VIP Marketplace API Configuration
export type AdobeEnvironment = 'sandbox' | 'production';

export interface AdobeCredentials {
  clientId: string;
  clientSecret: string;
  technicalAccountId: string;
  organizationId: string;
  privateKey: string;
  resellerId: string;
  distributorId: string;
}

export interface AdobeConfig {
  environment: AdobeEnvironment;
  credentials: AdobeCredentials;
  endpoints: {
    api: string;
    ims: string;
  };
  useMockAuth: boolean;
}

// Detect if we're running in production (Vercel) or development
const isProduction = typeof window !== 'undefined' && (
  window.location.hostname.includes('vercel.app') ||
  window.location.hostname.includes('vercel.dev') ||
  (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
);

// Environment-specific configurations
const ADOBE_CONFIGS: Record<AdobeEnvironment, Omit<AdobeConfig, 'environment'>> = {
  sandbox: {
    credentials: {
      clientId: 'de7dadf0964a454ba754af89f741362a', // Public - safe to keep in frontend
      clientSecret: '', // Moved to proxy server
      technicalAccountId: '', // Moved to proxy server
      organizationId: '', // Moved to proxy server
      privateKey: '', // Moved to proxy server
      resellerId: 'P1000084654', // Public - safe to keep in frontend
      distributorId: 'd1b4fd10-686f-4807-9839-2bf80707c21f', // Public - safe to keep in frontend
    },
    endpoints: {
      api: isProduction ? '/api/mock/adobe' : 'http://localhost:3001/api/adobe/proxy',
      ims: isProduction ? '/api/mock/adobe' : 'http://localhost:3001/api/adobe',
    },
    useMockAuth: isProduction,
  },
  production: {
    credentials: {
      clientId: '', // To be configured when production credentials are available
      clientSecret: '',
      technicalAccountId: '',
      organizationId: '',
      privateKey: '',
      resellerId: '',
      distributorId: '',
    },
    endpoints: {
      api: isProduction ? '/api/mock/adobe' : 'http://localhost:3001/api/adobe/proxy',
      ims: isProduction ? '/api/mock/adobe' : 'http://localhost:3001/api/adobe',
    },
    useMockAuth: isProduction,
  },
};

export class AdobeConfigService {
  private currentEnvironment: AdobeEnvironment = 'sandbox';

  getConfig(): AdobeConfig {
    return {
      environment: this.currentEnvironment,
      ...ADOBE_CONFIGS[this.currentEnvironment],
    };
  }

  setEnvironment(environment: AdobeEnvironment): void {
    this.currentEnvironment = environment;
  }

  getCurrentEnvironment(): AdobeEnvironment {
    return this.currentEnvironment;
  }

  isConfigured(): boolean {
    const config = this.getConfig();
    // In mock mode, we're always configured
    if (config.useMockAuth) {
      return true;
    }
    
    // With proxy server architecture, we only need to validate public credentials and endpoints
    return !!(
      config.credentials.clientId &&
      config.credentials.resellerId &&
      config.endpoints.api &&
      config.endpoints.ims
    );
  }

  validateCredentials(): { isValid: boolean; errors: string[] } {
    const config = this.getConfig();
    
    // In mock mode, always valid
    if (config.useMockAuth) {
      return { isValid: true, errors: [] };
    }
    
    const errors: string[] = [];

    if (!config.credentials.clientId) {
      errors.push('Client ID is required');
    }

    if (!config.credentials.resellerId) {
      errors.push('Reseller ID is required');
    }

    if (!config.endpoints.api) {
      errors.push('API endpoint is required');
    }

    if (!config.endpoints.ims) {
      errors.push('IMS endpoint is required');
    }

    // Note: Other credentials are securely managed by the proxy server
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Method to update production credentials when available
  updateProductionCredentials(credentials: Partial<AdobeCredentials>): void {
    ADOBE_CONFIGS.production.credentials = {
      ...ADOBE_CONFIGS.production.credentials,
      ...credentials,
    };
  }

  // Get environment-specific IMS URL for JWT audience
  getImsAudienceUrl(): string {
    const config = this.getConfig();
    return `${config.endpoints.ims}/c/${config.credentials.clientId}`;
  }

  // Get VIP Marketplace API scope
  getVipMarketplaceScope(): string {
    const config = this.getConfig();
    const imsBase = config.endpoints.ims;
    return `${imsBase}/s/ent_vip_marketplace_api`;
  }

  // Check if we're using mock authentication
  isUsingMockAuth(): boolean {
    return this.getConfig().useMockAuth;
  }
}

// Export singleton instance
export const adobeConfigService = new AdobeConfigService(); 