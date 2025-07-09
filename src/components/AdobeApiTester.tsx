import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Text,
  Group,
  Stack,
  Accordion,
  TextInput,
  Textarea,
  Badge,
  Alert,
  Code,
  Divider,
  Loader,
  ActionIcon,
  Tooltip,
  ScrollArea,
} from '@mantine/core';
import { IconPlayerPlay, IconCopy, IconCheck, IconX, IconRefresh } from '@tabler/icons-react';
import { adobeApiClient, ApiResponse } from '../services/adobeApi';
import { adobeAuthService } from '../services/adobeAuth';

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  description: string;
  requiresAuth: boolean;
  inputFields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number';
    placeholder?: string;
    required?: boolean;
  }>;
  endpoint: string;
  apiCall: (params: any) => Promise<ApiResponse>;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'health-check',
    name: 'Health Check',
    method: 'GET',
    description: 'Test basic connectivity to Adobe VIP Marketplace API',
    requiresAuth: false,
    endpoint: '/v3/healthcheck',
    apiCall: () => adobeApiClient.healthCheck(),
  },
  {
    id: 'health-check-auth',
    name: 'Health Check (Authenticated)',
    method: 'GET',
    description: 'Test authenticated connectivity to Adobe VIP Marketplace API',
    requiresAuth: true,
    endpoint: '/v3/healthcheck',
    apiCall: () => adobeApiClient.healthCheckAuth(),
  },
  {
    id: 'get-customer',
    name: 'Get Customer Account',
    method: 'GET',
    description: 'Retrieve details of a specific customer account',
    requiresAuth: true,
    endpoint: '/v3/customers/{customerId}',
    inputFields: [
      {
        name: 'customerId',
        label: 'Customer ID',
        type: 'text',
        placeholder: 'Enter customer ID',
        required: true,
      },
    ],
    apiCall: (params) => adobeApiClient.getCustomerAccount(params.customerId),
  },
  {
    id: 'get-reseller',
    name: 'Get Reseller Account',
    method: 'GET',
    description: 'Retrieve details of a specific reseller account',
    requiresAuth: true,
    endpoint: '/v3/resellers/{resellerId}',
    inputFields: [
      {
        name: 'resellerId',
        label: 'Reseller ID',
        type: 'text',
        placeholder: 'Enter reseller ID (default: your reseller ID)',
        required: false,
      },
    ],
    apiCall: (params) => adobeApiClient.getResellerAccount(params.resellerId || adobeApiClient.getCurrentResellerId()),
  },
  {
    id: 'create-customer',
    name: 'Create Customer Account',
    method: 'POST',
    description: 'Create a new customer account',
    requiresAuth: true,
    endpoint: '/v3/customers',
    inputFields: [
      {
        name: 'customerData',
        label: 'Customer Data (JSON)',
        type: 'textarea',
        placeholder: 'Enter customer data in JSON format',
        required: true,
      },
    ],
    apiCall: (params) => {
      try {
        const customerData = JSON.parse(params.customerData);
        return adobeApiClient.createCustomerAccount(customerData);
      } catch (error) {
        return Promise.resolve({ success: false, error: 'Invalid JSON format' });
      }
    },
  },
  {
    id: 'get-recommendations',
    name: 'Get Recommendations',
    method: 'GET',
    description: 'Get product recommendations for a customer',
    requiresAuth: true,
    endpoint: '/v3/customers/{customerId}/recommendations',
    inputFields: [
      {
        name: 'customerId',
        label: 'Customer ID',
        type: 'text',
        placeholder: 'Enter customer ID',
        required: true,
      },
    ],
    apiCall: (params) => adobeApiClient.getRecommendations(params.customerId),
  },
];

export const AdobeApiTester: React.FC = () => {
  const [results, setResults] = useState<Record<string, { loading: boolean; response?: ApiResponse; error?: string }>>({});
  const [inputValues, setInputValues] = useState<Record<string, Record<string, string>>>({});
  const [copiedResponse, setCopiedResponse] = useState<string | null>(null);

  const handleInputChange = (endpointId: string, fieldName: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [endpointId]: {
        ...prev[endpointId],
        [fieldName]: value,
      },
    }));
  };

  const handleApiCall = async (endpoint: ApiEndpoint) => {
    const params = inputValues[endpoint.id] || {};
    
    // Check authentication if required
    if (endpoint.requiresAuth && !adobeAuthService.getAuthStatus().isAuthenticated) {
      setResults(prev => ({
        ...prev,
        [endpoint.id]: {
          loading: false,
          error: 'Authentication required. Please connect first.',
        },
      }));
      return;
    }

    // Validate required fields
    const missingFields = endpoint.inputFields?.filter(field => 
      field.required && !params[field.name]
    ) || [];

    if (missingFields.length > 0) {
      setResults(prev => ({
        ...prev,
        [endpoint.id]: {
          loading: false,
          error: `Missing required fields: ${missingFields.map(f => f.label).join(', ')}`,
        },
      }));
      return;
    }

    // Set loading state
    setResults(prev => ({
      ...prev,
      [endpoint.id]: { loading: true },
    }));

    try {
      const response = await endpoint.apiCall(params);
      setResults(prev => ({
        ...prev,
        [endpoint.id]: {
          loading: false,
          response,
        },
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint.id]: {
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      }));
    }
  };

  const handleCopyResponse = async (endpointId: string, response: ApiResponse) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopiedResponse(endpointId);
      setTimeout(() => setCopiedResponse(null), 2000);
    } catch (error) {
      console.error('Failed to copy response:', error);
    }
  };

  const clearResult = (endpointId: string) => {
    setResults(prev => {
      const newResults = { ...prev };
      delete newResults[endpointId];
      return newResults;
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'blue';
      case 'POST': return 'green';
      case 'PATCH': return 'yellow';
      case 'DELETE': return 'red';
      default: return 'gray';
    }
  };

  const formatResponse = (response: ApiResponse) => {
    return JSON.stringify(response, null, 2);
  };

  return (
    <Card withBorder shadow="sm" padding="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Adobe VIP Marketplace API Tester
          </Text>
          <Badge color="blue" variant="light">
            Environment: {adobeApiClient.getCurrentEnvironment()}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          Test Adobe VIP Marketplace API endpoints. Authentication is required for most endpoints.
        </Text>

        <Accordion variant="separated" multiple>
          {API_ENDPOINTS.map((endpoint) => {
            const result = results[endpoint.id];
            const hasError = result?.error;
            const hasResponse = result?.response;

            return (
              <Accordion.Item key={endpoint.id} value={endpoint.id}>
                <Accordion.Control>
                  <Group justify="space-between" w="100%">
                    <Group gap="sm">
                      <Badge color={getMethodColor(endpoint.method)} size="sm">
                        {endpoint.method}
                      </Badge>
                      <Text fw={500}>{endpoint.name}</Text>
                      {endpoint.requiresAuth && (
                        <Badge color="orange" size="xs" variant="light">
                          Auth Required
                        </Badge>
                      )}
                    </Group>
                    {result?.loading && <Loader size="sm" />}
                    {hasResponse && result.response?.success && (
                      <IconCheck size={16} color="green" />
                    )}
                    {hasError || (hasResponse && !result.response?.success) && (
                      <IconX size={16} color="red" />
                    )}
                  </Group>
                </Accordion.Control>

                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed">
                      {endpoint.description}
                    </Text>

                    <Code block style={{ fontSize: '0.75rem' }}>
                      {endpoint.method} {endpoint.endpoint}
                    </Code>

                    {/* Input Fields */}
                    {endpoint.inputFields && endpoint.inputFields.length > 0 && (
                      <Stack gap="xs">
                        <Text size="sm" fw={500}>Input Parameters:</Text>
                        {endpoint.inputFields.map((field) => (
                          <div key={field.name}>
                            {field.type === 'textarea' ? (
                              <Textarea
                                label={field.label}
                                placeholder={field.placeholder}
                                value={inputValues[endpoint.id]?.[field.name] || ''}
                                onChange={(e) => handleInputChange(endpoint.id, field.name, e.target.value)}
                                required={field.required}
                                minRows={3}
                              />
                            ) : (
                              <TextInput
                                label={field.label}
                                placeholder={field.placeholder}
                                value={inputValues[endpoint.id]?.[field.name] || ''}
                                onChange={(e) => handleInputChange(endpoint.id, field.name, e.target.value)}
                                required={field.required}
                                type={field.type}
                              />
                            )}
                          </div>
                        ))}
                      </Stack>
                    )}

                    {/* Action Buttons */}
                    <Group gap="xs">
                      <Button
                        leftSection={<IconPlayerPlay size={16} />}
                        onClick={() => handleApiCall(endpoint)}
                        loading={result?.loading}
                        disabled={result?.loading}
                      >
                        Test API
                      </Button>
                      {(hasResponse || hasError) && (
                        <Button
                          variant="outline"
                          leftSection={<IconRefresh size={16} />}
                          onClick={() => clearResult(endpoint.id)}
                        >
                          Clear
                        </Button>
                      )}
                    </Group>

                    {/* Error Display */}
                    {hasError && (
                      <Alert color="red" title="Error">
                        {result.error}
                      </Alert>
                    )}

                    {/* Response Display */}
                    {hasResponse && (
                      <Box>
                        <Group justify="space-between" mb="xs">
                          <Text size="sm" fw={500}>
                            Response:
                          </Text>
                          <Group gap="xs">
                            <Badge 
                              color={result.response?.success ? 'green' : 'red'} 
                              variant="light"
                            >
                              {result.response?.success ? 'Success' : 'Failed'}
                            </Badge>
                            <Tooltip label="Copy Response">
                              <ActionIcon
                                variant="subtle"
                                size="sm"
                                onClick={() => handleCopyResponse(endpoint.id, result.response!)}
                              >
                                {copiedResponse === endpoint.id ? (
                                  <IconCheck size={14} />
                                ) : (
                                  <IconCopy size={14} />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Group>
                        <ScrollArea.Autosize mah={400}>
                          <Code block style={{ fontSize: '0.75rem' }}>
                            {formatResponse(result.response!)}
                          </Code>
                        </ScrollArea.Autosize>
                      </Box>
                    )}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Stack>
    </Card>
  );
}; 