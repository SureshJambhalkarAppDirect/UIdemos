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
  const [selectedModel, setSelectedModel] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load current configuration when modal opens
  useEffect(() => {
    if (opened) {
      const config = getConfig();
      setApiKey(config.apiKey);
      setEndpointValue(config.endpoint);
      setSelectedModel(config.defaultModel);
      
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
      
      // Test devs.ai connection with a simple request
      const response = await fetch('https://devs.ai/api/v1/chats/completions', {
        method: 'POST',
        headers: {
          'X-Authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: 'Hello, can you help me?' }],
          stream: false,
        }),
      });

      if (response.ok) {
        setErrors(['✅ Connection successful! devs.ai API is working.']);
        setIsValid(true);
      } else {
        const errorText = await response.text();
        setErrors([`❌ API Error (${response.status}): ${errorText || 'Invalid AI ID or API key'}`]);
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
              {isConfigured() ? 'LLM API is configured and ready' : 'LLM API requires configuration'}
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
          description="Your devs.ai API key for accessing Claude and OpenAI models"
          placeholder="Enter your devs.ai API key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          leftSection={<IconKey size={16} />}
          type="password"
          required
        />

        {/* Endpoint is hidden since it's fixed for devs.ai */}

        {/* AI ID Selection */}
        <TextInput
          label="AI ID"
          description="Your devs.ai AI ID (found in your AI's URL or dashboard)"
          placeholder="ai_abc123xyz or my-analytics-ai"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          leftSection={<IconBrain size={16} />}
          required
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
        {isValid && apiKey && selectedModel && (
          <Alert icon={<IconCheck size={16} />} color="green" variant="light">
            <Text size="sm">Configuration is valid! Your AI assistant will use devs.ai with pattern matching as fallback.</Text>
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
            disabled={!apiKey || !selectedModel}
          >
            Test Config
          </Button>
          <Button 
            onClick={handleSave}
            loading={isSaving}
            disabled={!apiKey || !selectedModel}
            style={{ backgroundColor: '#0891b2' }}
          >
            Save Configuration
          </Button>
        </Group>

        {/* Usage Info */}
        <Alert color="blue" variant="light">
          <Text size="sm" fw={500} mb="xs">How this works:</Text>
          <Text size="sm">
            • <strong>Primary:</strong> devs.ai API with your custom AI for superior natural language understanding<br/>
            • <strong>Fallback:</strong> Pattern matching if API fails or is unavailable<br/>
            • <strong>Caching:</strong> 5-minute cache to reduce API costs for repeated queries<br/>
            • <strong>Setup:</strong> Create an AI on <a href="https://devs.ai" target="_blank" style={{color: '#0891b2'}}>devs.ai</a> and copy its ID here
          </Text>
        </Alert>
      </Stack>
    </Modal>
  );
};

export default LLMSettingsModal; 