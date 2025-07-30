// Configuration utility for devs.ai API
interface LLMConfig {
  endpoint: string;
  apiKey: string;
  defaultModel: string;
  timeout: number;
}

// Default configuration - using local proxy to avoid CORS
let config: LLMConfig = {
  endpoint: 'http://localhost:3001', // Local proxy endpoint
  apiKey: '',
  defaultModel: 'claude-3-5-sonnet-20241022', // Default to Claude 3.5 Sonnet
  timeout: 10000, // Increased timeout for proxy
};

// Configuration setters
export const setDevsAIConfig = (newConfig: Partial<LLMConfig>) => {
  config = { ...config, ...newConfig };
};

export const setAPIKey = (apiKey: string) => {
  config.apiKey = apiKey;
};

export const setEndpoint = (endpoint: string) => {
  config.endpoint = endpoint;
};

export const setModel = (model: string) => {
  config.defaultModel = model;
};

// Configuration getters
export const getConfig = (): LLMConfig => config;

export const isConfigured = (): boolean => {
  return Boolean(config.apiKey && config.endpoint && config.defaultModel);
};

// Validate configuration
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.apiKey) errors.push('API key is required');
  if (!config.endpoint) errors.push('Endpoint is required');
  // Model has a default, so no need to require it
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Quick setup function
export const quickSetup = (apiKey: string, endpoint?: string) => {
  setAPIKey(apiKey);
  if (endpoint) setEndpoint(endpoint);
  return validateConfig();
}; 