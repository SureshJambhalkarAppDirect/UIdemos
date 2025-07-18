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

  constructor() {
    // No longer storing baseUrl as it's determined dynamically
  }

  // Mock data generators
  private generateMockHealthCheck(): HealthCheckResponse {
    return {
      status: 'OK',
      message: 'Adobe VIP Marketplace API is healthy (mock response)',
      timestamp: new Date().toISOString(),
    };
  }

  private generateMockCustomerAccount(customerId?: string): CustomerAccount {
    return {
      externalReferenceId: `ext-${Math.random().toString(36).substr(2, 8)}`,
      customerId: customerId || `cust-${Math.random().toString(36).substr(2, 8)}`,
      resellerId: 'P1000084654',
      globalSalesEnabled: true,
      companyProfile: {
        companyName: 'Demo Company Inc',
        preferredLanguage: 'en-US',
        marketSegment: 'Enterprise',
        marketSubSegments: ['Technology', 'Software'],
        address: {
          country: 'US',
          region: 'CA',
          city: 'San Francisco',
          addressLine1: '123 Demo Street',
          addressLine2: 'Suite 100',
          postalCode: '94105',
          phoneNumber: '+1-555-0123',
        },
        contacts: [
          {
            firstName: 'John',
            lastName: 'Demo',
            email: 'john.demo@democompany.com',
            phoneNumber: '+1-555-0123',
          },
        ],
      },
      discounts: [
        {
          offerType: 'Volume',
          level: 'Level 3',
        },
      ],
      cotermDate: '2024-12-31',
      creationDate: '2024-01-15',
      status: 'ACTIVE',
      linkedMembership: {
        id: 'lm-demo-123',
        name: 'Demo Partnership Program',
        type: 'Standard',
        linkedMembershipType: 'CONSORTIUM',
        creationDate: '2024-01-15',
      },
    };
  }

  private generateMockResellerAccount(resellerId?: string): ResellerAccount {
    return {
      resellerId: resellerId || 'P1000084654',
      companyProfile: {
        companyName: 'Demo Reseller LLC',
        preferredLanguage: 'en-US',
        address: {
          country: 'US',
          region: 'NY',
          city: 'New York',
          addressLine1: '456 Reseller Ave',
          postalCode: '10001',
          phoneNumber: '+1-555-0456',
        },
      },
      status: 'ACTIVE',
      creationDate: '2023-06-15',
    };
  }

  private generateMockRecommendations(): any[] {
    return [
      {
        id: 'rec-1',
        type: 'PRODUCT_RECOMMENDATION',
        title: 'Creative Cloud Pro Edition',
        description: 'Recommended based on current usage patterns',
        products: [
          {
            sku: 'CC-PRO-TEAM',
            name: 'Creative Cloud Pro Team',
            price: 79.99,
            currency: 'USD',
          },
        ],
        confidence: 0.85,
        createdDate: '2024-01-20',
      },
      {
        id: 'rec-2',
        type: 'UPGRADE_RECOMMENDATION',
        title: 'Document Cloud Business',
        description: 'Enhance productivity with advanced document features',
        products: [
          {
            sku: 'DC-BUS-TEAM',
            name: 'Document Cloud Business',
            price: 29.99,
            currency: 'USD',
          },
        ],
        confidence: 0.72,
        createdDate: '2024-01-18',
      },
    ];
  }

  private generateMockDeployments(): any[] {
    return [
      {
        id: 'dep-1',
        name: 'Creative Cloud Deployment',
        status: 'ACTIVE',
        licenseCount: 50,
        assignedLicenses: 42,
        products: ['CC-PRO-TEAM', 'CC-SINGLE-APP'],
        deploymentDate: '2024-01-15',
        lastUpdated: '2024-01-20',
      },
      {
        id: 'dep-2',
        name: 'Document Cloud Deployment',
        status: 'PENDING',
        licenseCount: 25,
        assignedLicenses: 0,
        products: ['DC-BUS-TEAM'],
        deploymentDate: '2024-01-22',
        lastUpdated: '2024-01-22',
      },
    ];
  }

  private generateMockOrders(): any[] {
    return [
      {
        id: 'ord-1',
        orderNumber: 'ORD-2024-001',
        status: 'COMPLETED',
        totalAmount: 3999.50,
        currency: 'USD',
        orderDate: '2024-01-15',
        items: [
          {
            sku: 'CC-PRO-TEAM',
            quantity: 50,
            unitPrice: 79.99,
            totalPrice: 3999.50,
          },
        ],
      },
      {
        id: 'ord-2',
        orderNumber: 'ORD-2024-002',
        status: 'PROCESSING',
        totalAmount: 749.75,
        currency: 'USD',
        orderDate: '2024-01-22',
        items: [
          {
            sku: 'DC-BUS-TEAM',
            quantity: 25,
            unitPrice: 29.99,
            totalPrice: 749.75,
          },
        ],
      },
    ];
  }

  // Generic API request method (mock or real via proxy server)
  private async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      requiresAuth?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, requiresAuth = true } = options;

    // Get current configuration
    const config = await adobeConfigService.getConfig();

    // If using mock authentication, return mock data
    if (config.useMockAuth) {
      return this.makeMockRequest<T>(endpoint, options);
    }

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
      const requestConfig: RequestInit = {
        method,
        headers,
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        requestConfig.body = JSON.stringify(body);
      }

      // Add environment as query parameter for proxy server
      const currentEnvironment = adobeConfigService.getCurrentEnvironment();
      const separator = endpoint.includes('?') ? '&' : '?';
      const urlWithEnvironment = `${config.endpoints.api}${endpoint}${separator}environment=${currentEnvironment}`;

      console.log(`Making API request to: ${urlWithEnvironment}`);

      // Use proxy server endpoint
      const response = await fetch(urlWithEnvironment, requestConfig);

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

  // Mock API request handler
  private async makeMockRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      requiresAuth?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body } = options;

    console.log(`Making MOCK API request to: ${endpoint} (method: ${method})`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    try {
      let mockData: any;

      // Health check endpoints
      if (endpoint.includes('/v3/healthcheck')) {
        mockData = this.generateMockHealthCheck();
      }
      // Customer endpoints
      else if (endpoint.match(/\/v3\/customers\/([^/]+)$/)) {
        const customerId = endpoint.split('/').pop();
        if (method === 'POST') {
          mockData = this.generateMockCustomerAccount();
        } else if (method === 'PATCH') {
          mockData = { ...this.generateMockCustomerAccount(customerId), ...body };
        } else {
          mockData = this.generateMockCustomerAccount(customerId);
        }
      }
      // Customer orders endpoint (for preview order)
      else if (endpoint.includes('/orders')) {
        if (method === 'POST') {
          // Check if it's a preview request
          const isPreview = endpoint.includes('preview=true') || (body && body.preview === true);
          if (isPreview) {
            mockData = {
              orderPreview: {
                totalAmount: 999.99,
                currency: 'USD',
                items: [
                  {
                    sku: body?.items?.[0]?.sku || '65322650CA01A12',
                    quantity: body?.items?.[0]?.quantity || 1,
                    unitPrice: 999.99,
                    totalPrice: 999.99,
                  },
                ],
                taxes: 89.99,
                subtotal: 999.99,
                grandTotal: 1089.98,
              },
            };
          } else {
            mockData = { id: 'new-ord', ...body, orderDate: new Date().toISOString(), status: 'PROCESSING' };
          }
        } else {
          mockData = this.generateMockOrders();
        }
      }
      // Reseller endpoints
      else if (endpoint.match(/\/v3\/resellers\/([^/]+)$/)) {
        const resellerId = endpoint.split('/').pop();
        if (method === 'POST') {
          mockData = this.generateMockResellerAccount();
        } else if (method === 'PATCH') {
          mockData = { ...this.generateMockResellerAccount(resellerId), ...body };
        } else {
          mockData = this.generateMockResellerAccount(resellerId);
        }
      }
      // Recommendations endpoints
      else if (endpoint.includes('/recommendations')) {
        if (method === 'POST') {
          mockData = { id: 'new-rec', ...body, createdDate: new Date().toISOString() };
        } else {
          mockData = this.generateMockRecommendations();
        }
      }
      // Deployments endpoints
      else if (endpoint.includes('/deployments')) {
        if (method === 'POST') {
          mockData = { id: 'new-dep', ...body, deploymentDate: new Date().toISOString() };
        } else if (method === 'PATCH') {
          mockData = { ...this.generateMockDeployments()[0], ...body, lastUpdated: new Date().toISOString() };
        } else {
          mockData = this.generateMockDeployments();
        }
      }
      // Flex discounts endpoint
      else if (endpoint.includes('/flex-discounts')) {
        mockData = [
          {
            id: 'flex-1',
            name: 'Volume Discount Tier 1',
            type: 'VOLUME',
            discountPercentage: 10,
            minimumQuantity: 10,
            status: 'ACTIVE',
          },
          {
            id: 'flex-2',
            name: 'Volume Discount Tier 2',
            type: 'VOLUME',
            discountPercentage: 15,
            minimumQuantity: 50,
            status: 'ACTIVE',
          },
        ];
      }
      // Price lists endpoint
      else if (endpoint.includes('/price-lists') || endpoint.includes('/pricelists')) {
        mockData = [
          {
            id: 'pl-1',
            name: 'Standard Price List',
            currency: 'USD',
            effectiveDate: '2024-01-01',
            products: [
              {
                sku: 'CC-PRO-TEAM',
                name: 'Creative Cloud Pro Team',
                price: 79.99,
              },
              {
                sku: 'DC-BUS-TEAM',
                name: 'Document Cloud Business',
                price: 29.99,
              },
            ],
          },
        ];
      }
      // Default fallback
      else {
        mockData = { message: 'Mock API response', endpoint, method, timestamp: new Date().toISOString() };
      }

      return {
        success: true,
        data: mockData as T,
        status: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: `Mock API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: 500,
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

  async createOrder(customerId: string, orderData: any, preview: boolean = false): Promise<ApiResponse<any>> {
    const endpoint = `/v3/customers/${customerId}/orders${preview ? '?preview=true' : ''}`;
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: { ...orderData, preview },
    });
  }

  // Flexible Discounts API
  async getFlexDiscounts(): Promise<ApiResponse<any>> {
    return this.makeRequest('/v3/flex-discounts');
  }

  // Price Lists API  
  async getPriceLists(): Promise<ApiResponse<any>> {
    return this.makeRequest('/v3/price-lists');
  }
}

// Export singleton instance
export const adobeApiClient = new AdobeApiClient(); 