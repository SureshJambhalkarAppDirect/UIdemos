import { adobeConfigService } from './adobeConfig';

export interface AdobeTokens {
  jwt: string | null;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
}

export interface AuthenticationStatus {
  isAuthenticated: boolean;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  error?: string;
  tokens?: AdobeTokens;
  lastAuthenticated?: Date;
}

export class AdobeAuthService {
  private authStatus: AuthenticationStatus = {
    isAuthenticated: false,
    status: 'disconnected',
  };

  private statusListeners: ((status: AuthenticationStatus) => void)[] = [];

  // Mock authentication for demo purposes
  private async mockAuthenticate(): Promise<AdobeTokens> {
    console.log('Using mock authentication for demo purposes...');
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockTokens: AdobeTokens = {
      jwt: null,
      accessToken: 'mock-access-token-' + Math.random().toString(36).substr(2, 9),
      tokenType: 'Bearer',
      expiresIn: 3600,
      expiresAt: Date.now() + (3600 * 1000),
    };

    return mockTokens;
  }

  // Real authentication flow using proxy server
  private async realAuthenticate(): Promise<AdobeTokens> {
    const config = await adobeConfigService.getConfig();

      // Call proxy server for authentication
      console.log('Requesting authentication from proxy server...');
      const response = await fetch(`${config.endpoints.ims}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environment: config.environment,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const tokenResponse = await response.json();

      // Create token object
      const tokens: AdobeTokens = {
        jwt: tokenResponse.jwt,
        accessToken: tokenResponse.access_token,
        tokenType: tokenResponse.token_type || 'Bearer',
        expiresIn: tokenResponse.expires_in || 3600,
        expiresAt: Date.now() + ((tokenResponse.expires_in || 3600) * 1000),
      };

    return tokens;
  }

  // Full authentication flow (mock or real depending on environment)
  async authenticate(): Promise<AdobeTokens> {
    this.updateStatus({ isAuthenticated: false, status: 'connecting' });

    try {
      const config = await adobeConfigService.getConfig();
      let tokens: AdobeTokens;

      if (config.useMockAuth) {
        tokens = await this.mockAuthenticate();
        console.log('Mock Adobe authentication successful');
      } else {
        tokens = await this.realAuthenticate();
        console.log('Adobe authentication successful');
      }

      // Update status
      this.updateStatus({
        isAuthenticated: true,
        status: 'connected',
        tokens,
        lastAuthenticated: new Date(),
      });

      return tokens;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('Adobe authentication failed:', errorMessage);
      this.updateStatus({
        isAuthenticated: false,
        status: 'error',
        error: errorMessage,
      });
      throw error;
    }
  }

  // Check if current token is valid and not expired
  isTokenValid(): boolean {
    if (!this.authStatus.tokens) return false;
    
    const now = Date.now();
    const expirationBuffer = 5 * 60 * 1000; // 5 minutes buffer
    
    return now < (this.authStatus.tokens.expiresAt - expirationBuffer);
  }

  // Get current authentication status
  getAuthStatus(): AuthenticationStatus {
    return { ...this.authStatus };
  }

  // Get current access token if available and valid
  getAccessToken(): string | null {
    if (!this.isTokenValid()) return null;
    return this.authStatus.tokens?.accessToken || null;
  }

  // Get current JWT token if available (may be null for OAuth)
  getJWTToken(): string | null {
    return this.authStatus.tokens?.jwt || null;
  }

  // Clear authentication state
  clearAuth(): void {
    this.updateStatus({
      isAuthenticated: false,
      status: 'disconnected',
    });
  }

  // Subscribe to authentication status changes
  onStatusChange(listener: (status: AuthenticationStatus) => void): () => void {
    this.statusListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.statusListeners.indexOf(listener);
      if (index > -1) {
        this.statusListeners.splice(index, 1);
      }
    };
  }

  // Update status and notify listeners
  private updateStatus(newStatus: Partial<AuthenticationStatus>): void {
    this.authStatus = {
      ...this.authStatus,
      ...newStatus,
    };
    
    this.statusListeners.forEach(listener => listener(this.authStatus));
  }

  // Utility method to generate request headers for Adobe API calls
  async getApiHeaders(): Promise<Record<string, string>> {
    const config = await adobeConfigService.getConfig();
    const accessToken = this.getAccessToken();
    
    if (!accessToken) {
      throw new Error('No valid access token available. Please authenticate first.');
    }

    return {
      'Authorization': `Bearer ${accessToken}`,
      'X-API-Key': config.credentials.clientId,
      'Content-Type': 'application/json',
    };
  }

  // Ensure we have a valid token, re-authenticate if needed
  async ensureValidToken(): Promise<void> {
    if (!this.isTokenValid()) {
      await this.authenticate();
    }
  }

  // Check if we're using mock authentication
  async isUsingMockAuth(): Promise<boolean> {
    return await adobeConfigService.isUsingMockAuth();
  }

  // Synchronous version for backwards compatibility
  isUsingMockAuthSync(): boolean {
    return adobeConfigService.isUsingMockAuthSync();
  }
}

// Export singleton instance
export const adobeAuthService = new AdobeAuthService(); 