import { adobeAuthService } from './adobeAuth';
import { adobeConfigService } from './adobeConfig';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export interface CustomerAccount {
  externalReferenceId?: string;
  customerId?: string;
  resellerId?: string;
  globalSalesEnabled?: boolean;
  companyProfile?: {
    companyName: string;
    preferredLanguage: string;
    marketSegment: string;
    marketSubSegments?: string[];
    address: {
      country: string;
      region: string;
      city: string;
      addressLine1: string;
      addressLine2?: string;
      postalCode: string;
      phoneNumber: string;
    };
    contacts: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    }>;
  };
  discounts?: Array<{
    offerType: string;
    level: string;
  }>;
  cotermDate?: string;
  creationDate?: string;
  status?: string;
  linkedMembership?: {
    id: string;
    name: string;
    type: string;
    linkedMembershipType: string;
    creationDate: string;
  };
}

export interface ResellerAccount {
  resellerId?: string;
  companyProfile?: {
    companyName: string;
    preferredLanguage: string;
    address: {
      country: string;
      region: string;
      city: string;
      addressLine1: string;
      addressLine2?: string;
      postalCode: string;
      phoneNumber: string;
    };
  };
  status?: string;
  creationDate?: string;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

export class AdobeApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = adobeConfigService.getConfig().endpoints.api;
  }

  // Generic API request method via proxy server
  private async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      requiresAuth?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, requiresAuth = true } = options;

    try {
      // Ensure valid authentication if required
      if (requiresAuth) {
        await adobeAuthService.ensureValidToken();
      }

      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      // For proxy server, we don't need to add auth headers as the proxy handles authentication
      const config: RequestInit = {
        method,
        headers,
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(body);
      }

      // Add environment as query parameter for proxy server
      const currentEnvironment = adobeConfigService.getCurrentEnvironment();
      const separator = endpoint.includes('?') ? '&' : '?';
      const urlWithEnvironment = `${this.baseUrl}${endpoint}${separator}environment=${currentEnvironment}`;

      // Use proxy server endpoint
      const response = await fetch(urlWithEnvironment, config);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
          status: response.status,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Health Check APIs
  async healthCheck(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.makeRequest<HealthCheckResponse>('/v3/healthcheck', {
      requiresAuth: false,
    });
  }

  async healthCheckAuth(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.makeRequest<HealthCheckResponse>('/v3/healthcheck', {
      requiresAuth: true,
    });
  }

  // Customer Management APIs
  async getCustomerAccount(customerId: string): Promise<ApiResponse<CustomerAccount>> {
    return this.makeRequest<CustomerAccount>(`/v3/customers/${customerId}`);
  }

  async createCustomerAccount(customerData: Partial<CustomerAccount>): Promise<ApiResponse<CustomerAccount>> {
    return this.makeRequest<CustomerAccount>('/v3/customers', {
      method: 'POST',
      body: customerData,
    });
  }

  async updateCustomerAccount(
    customerId: string,
    customerData: Partial<CustomerAccount>
  ): Promise<ApiResponse<CustomerAccount>> {
    return this.makeRequest<CustomerAccount>(`/v3/customers/${customerId}`, {
      method: 'PATCH',
      body: customerData,
    });
  }

  // Reseller Management APIs
  async getResellerAccount(resellerId: string): Promise<ApiResponse<ResellerAccount>> {
    return this.makeRequest<ResellerAccount>(`/v3/resellers/${resellerId}`);
  }

  async createResellerAccount(resellerData: Partial<ResellerAccount>): Promise<ApiResponse<ResellerAccount>> {
    return this.makeRequest<ResellerAccount>('/v3/resellers', {
      method: 'POST',
      body: resellerData,
    });
  }

  async updateResellerAccount(
    resellerId: string,
    resellerData: Partial<ResellerAccount>
  ): Promise<ApiResponse<ResellerAccount>> {
    return this.makeRequest<ResellerAccount>(`/v3/resellers/${resellerId}`, {
      method: 'PATCH',
      body: resellerData,
    });
  }

  // Recommendations API
  async getRecommendations(customerId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/recommendations`);
  }

  async createRecommendation(customerId: string, recommendationData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/recommendations`, {
      method: 'POST',
      body: recommendationData,
    });
  }

  // Deployments API
  async getDeployments(customerId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/deployments`);
  }

  async createDeployment(customerId: string, deploymentData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/deployments`, {
      method: 'POST',
      body: deploymentData,
    });
  }

  async updateDeployment(
    customerId: string,
    deploymentId: string,
    deploymentData: any
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/deployments/${deploymentId}`, {
      method: 'PATCH',
      body: deploymentData,
    });
  }

  // Orders API
  async getOrders(customerId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/orders`);
  }

  async createOrder(customerId: string, orderData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/orders`, {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrderDetails(customerId: string, orderId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/orders/${orderId}`);
  }

  async updateOrder(customerId: string, orderId: string, orderData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/orders/${orderId}`, {
      method: 'PATCH',
      body: orderData,
    });
  }

  // Subscriptions API
  async getSubscriptions(customerId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/subscriptions`);
  }

  async createSubscription(customerId: string, subscriptionData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/subscriptions`, {
      method: 'POST',
      body: subscriptionData,
    });
  }

  async getSubscriptionDetails(customerId: string, subscriptionId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/subscriptions/${subscriptionId}`);
  }

  async updateSubscription(
    customerId: string,
    subscriptionId: string,
    subscriptionData: any
  ): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/customers/${customerId}/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: subscriptionData,
    });
  }

  // Transfers API
  async getTransfers(): Promise<ApiResponse<any>> {
    return this.makeRequest('/v3/transfers');
  }

  async createTransfer(transferData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/v3/transfers', {
      method: 'POST',
      body: transferData,
    });
  }

  async getTransferDetails(transferId: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/v3/transfers/${transferId}`);
  }

  // Utility method to get current reseller ID for convenience
  getCurrentResellerId(): string {
    return adobeConfigService.getConfig().credentials.resellerId;
  }

  // Utility method to get current environment
  getCurrentEnvironment(): string {
    return adobeConfigService.getCurrentEnvironment();
  }
}

// Export singleton instance
export const adobeApiClient = new AdobeApiClient(); 