import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Stack, Text, Alert, Group, Badge, Select } from '@mantine/core';
import { IconKey, IconServer, IconCheck, IconAlertCircle, IconBrain } from '@tabler/icons-react';
import { getConfig, setAPIKey, setEndpoint, setModel, validateConfig, isConfigured } from '../services/llmConfig';

interface LLMSettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

const LLMSettingsModal: React.FC<LLMSettingsModalProps> = ({ opened, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpointValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet-20241022');
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load current configuration when modal opens
  useEffect(() => {
    if (opened) {
      const config = getConfig();
      setApiKey(config.apiKey);
      setEndpointValue(config.endpoint);
      setSelectedModel(config.defaultModel || 'claude-3-5-sonnet-20241022');
      
      const validation = validateConfig();
      setIsValid(validation.valid);
      setErrors(validation.errors);
    }
  }, [opened]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Update configuration
    setAPIKey(apiKey);
    setEndpoint(endpoint);
    setModel(selectedModel);
    
    // Validate
    const validation = validateConfig();
    setIsValid(validation.valid);
    setErrors(validation.errors);
    
    if (validation.valid) {
      // Success - close modal after brief delay
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 500);
    } else {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsSaving(true);
    try {
      // Update configuration with current values
      setAPIKey(apiKey);
      setModel(selectedModel);
      
      // Test devs.ai connection via proxy
      const response = await fetch('http://localhost:3001/api/devs-ai/chats/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey,
          model: selectedModel, // Can be AI ID or LLM model name per devs.ai docs
          messages: [{ role: 'user', content: 'Hello, can you help me?' }],
          stream: false,
        }),
      });

      if (response.ok) {
        setErrors(['✅ Connection successful! devs.ai API is working.']);
        setIsValid(true);
      } else {
        const errorText = await response.text();
        setErrors([`❌ API Error (${response.status}): ${errorText || 'Invalid API key or model'}`]);
        setIsValid(false);
      }
    } catch (error) {
      setErrors([`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      setIsValid(false);
    } finally {
      setIsSaving(false);
    }
  };

  // No longer need model options - using AI ID directly

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconKey size={24} color="#0891b2" />
          <Text size="lg" fw={600}>LLM API Configuration</Text>
        </Group>
      }
      size="md"
      centered
    >
      <Stack gap="md">
        {/* Current Status */}
        <Alert
          icon={isConfigured() ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
          color={isConfigured() ? "green" : "orange"}
          variant="light"
        >
          <Group justify="space-between">
            <Text size="sm">
              {isConfigured() ? 'devs.ai API is configured and ready' : 'devs.ai API requires configuration'}
            </Text>
            <Badge 
              color={isConfigured() ? "green" : "orange"} 
              variant="light"
              size="sm"
            >
              {isConfigured() ? 'Active' : 'Not Configured'}
            </Badge>
          </Group>
        </Alert>

        {/* API Key */}
        <TextInput
          label="devs.ai API Key"
          description="Your devs.ai API key (create at https://devs.ai/api-keys)"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          leftSection={<IconKey size={16} />}
          type="password"
          required
        />

        {/* Endpoint is hidden since it's fixed for devs.ai */}

        {/* Model Selection */}
        <Select
          label="Model"
          description="Choose your preferred AI model"
          value={selectedModel}
          onChange={(value) => setSelectedModel(value || 'claude-3-5-sonnet-20241022')}
          data={[
            { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet (Recommended)' },
            { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Faster)' },
            { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
            { value: 'gpt-4o', label: 'GPT-4o' }
          ]}
          leftSection={<IconBrain size={16} />}
        />

        {/* Validation Errors */}
        {errors.length > 0 && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
            <Text size="sm" fw={500} mb="xs">Configuration Issues:</Text>
            <Stack gap="xs">
              {errors.map((error, index) => (
                <Text key={index} size="sm">• {error}</Text>
              ))}
            </Stack>
          </Alert>
        )}

        {/* Success Message */}
        {isValid && apiKey && (
          <Alert icon={<IconCheck size={16} />} color="green" variant="light">
            <Text size="sm">Configuration is valid! Your AI assistant will use devs.ai with {selectedModel} and pattern matching as fallback.</Text>
          </Alert>
        )}

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTest}
            loading={isSaving}
            disabled={!apiKey}
          >
            Test Config
          </Button>
          <Button 
            onClick={handleSave}
            loading={isSaving}
            disabled={!apiKey}
            style={{ backgroundColor: '#0891b2' }}
          >
            Save Configuration
          </Button>
        </Group>

        {/* Usage Info */}
        <Alert color="blue" variant="light">
          <Text size="sm" fw={500} mb="xs">How this works:</Text>
          <Text size="sm">
            • <strong>Primary:</strong> devs.ai API with standard models for superior natural language understanding<br/>
            • <strong>Fallback:</strong> Pattern matching if API fails or is unavailable<br/>
            • <strong>Caching:</strong> 5-minute cache to reduce API costs for repeated queries<br/>
            • <strong>Setup:</strong> Get your API key from <a href="https://devs.ai/api-keys" target="_blank" style={{color: '#0891b2'}}>devs.ai/api-keys</a> and select your preferred model
          </Text>
        </Alert>
      </Stack>
    </Modal>
  );
};

export default LLMSettingsModal; 