// Configuration utility for devs.ai API
interface LLMConfig {
  endpoint: string;
  apiKey: string;
  defaultModel: string;
  timeout: number;
}

// Default configuration - devs.ai endpoint is standardized
let config: LLMConfig = {
  endpoint: 'https://devs.ai', // Fixed devs.ai endpoint
  apiKey: '',
  defaultModel: '', // This will be the AI ID from devs.ai
  timeout: 10000, // Increased timeout for devs.ai
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
  return Boolean(config.apiKey && config.endpoint);
};

// Validate configuration
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.apiKey) errors.push('API key is required');
  if (!config.endpoint) errors.push('Endpoint is required');
  if (!config.defaultModel) errors.push('Default model is required');
  
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