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
  window.location.hostname.includes('netlify.app') ||
  window.location.hostname.includes('github.io') ||
  (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !window.location.hostname.startsWith('192.168.'))
);

// Check if proxy server is available (async function)
let proxyServerAvailable: boolean | null = null;

async function checkProxyServerAvailability(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3001/api/status', { 
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

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
      api: 'http://localhost:3001/api/adobe/proxy',
      ims: 'http://localhost:3001/api/adobe',
    },
    useMockAuth: false, // Will be determined dynamically
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
      api: 'http://localhost:3001/api/adobe/proxy',
      ims: 'http://localhost:3001/api/adobe',
    },
    useMockAuth: false, // Will be determined dynamically
  },
};

export class AdobeConfigService {
  private currentEnvironment: AdobeEnvironment = 'sandbox';
  private mockAuthOverride: boolean | null = null;

  async getConfig(): Promise<AdobeConfig> {
    const baseConfig = {
      environment: this.currentEnvironment,
      ...ADOBE_CONFIGS[this.currentEnvironment],
    };

    // Determine if we should use mock auth
    const shouldUseMock = await this.shouldUseMockAuth();
    
    return {
      ...baseConfig,
      useMockAuth: shouldUseMock,
      endpoints: shouldUseMock ? {
        api: '/api/mock/adobe',
        ims: '/api/mock/adobe',
      } : baseConfig.endpoints,
    };
  }

  // Synchronous version for backwards compatibility (uses cached result)
  getConfigSync(): AdobeConfig {
    const baseConfig = {
      environment: this.currentEnvironment,
      ...ADOBE_CONFIGS[this.currentEnvironment],
    };

    // Use cached proxy server availability or default behavior
    const shouldUseMock = this.mockAuthOverride !== null ? this.mockAuthOverride : 
                         (isProduction || proxyServerAvailable === false);
    
    return {
      ...baseConfig,
      useMockAuth: shouldUseMock,
      endpoints: shouldUseMock ? {
        api: '/api/mock/adobe',
        ims: '/api/mock/adobe',
      } : baseConfig.endpoints,
    };
  }

  private async shouldUseMockAuth(): Promise<boolean> {
    // If explicitly overridden, use that
    if (this.mockAuthOverride !== null) {
      return this.mockAuthOverride;
    }

    // If clearly in production environment, use mock
    if (isProduction) {
      this.mockAuthOverride = true;
      return true;
    }

    // If in development, check if proxy server is available
    if (proxyServerAvailable === null) {
      proxyServerAvailable = await checkProxyServerAvailability();
    }

    // Use mock if proxy server is not available
    const useMock = !proxyServerAvailable;
    this.mockAuthOverride = useMock;
    
    return useMock;
  }

  setEnvironment(environment: AdobeEnvironment): void {
    this.currentEnvironment = environment;
  }

  getCurrentEnvironment(): AdobeEnvironment {
    return this.currentEnvironment;
  }

  async isConfigured(): Promise<boolean> {
    const config = await this.getConfig();
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

  // Synchronous version for backwards compatibility
  isConfiguredSync(): boolean {
    const config = this.getConfigSync();
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

  async validateCredentials(): Promise<{ isValid: boolean; errors: string[] }> {
    const config = await this.getConfig();
    
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
  async getImsAudienceUrl(): Promise<string> {
    const config = await this.getConfig();
    return `${config.endpoints.ims}/c/${config.credentials.clientId}`;
  }

  // Get VIP Marketplace API scope
  async getVipMarketplaceScope(): Promise<string> {
    const config = await this.getConfig();
    const imsBase = config.endpoints.ims;
    return `${imsBase}/s/ent_vip_marketplace_api`;
  }

  // Check if we're using mock authentication
  async isUsingMockAuth(): Promise<boolean> {
    const config = await this.getConfig();
    return config.useMockAuth;
  }

  // Synchronous version for backwards compatibility
  isUsingMockAuthSync(): boolean {
    return this.getConfigSync().useMockAuth;
  }

  // Force mock mode (useful for testing)
  setMockMode(useMock: boolean): void {
    this.mockAuthOverride = useMock;
    proxyServerAvailable = !useMock;
  }

  // Reset proxy server check (force re-check)
  resetProxyCheck(): void {
    proxyServerAvailable = null;
    this.mockAuthOverride = null;
  }
}

// Export singleton instance
export const adobeConfigService = new AdobeConfigService(); 