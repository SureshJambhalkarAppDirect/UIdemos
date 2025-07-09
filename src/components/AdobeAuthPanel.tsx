import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Switch,
  ActionIcon,
  Tooltip,
  Collapse,
  Code,
  Divider,
  Alert,
  Loader,
} from '@mantine/core';
import { IconSettings, IconChevronDown, IconChevronUp, IconCopy, IconCheck, IconX, IconRefresh } from '@tabler/icons-react';
import { adobeAuthService, AuthenticationStatus } from '../services/adobeAuth';
import { adobeConfigService, AdobeEnvironment } from '../services/adobeConfig';

interface AdobeAuthPanelProps {
  onAuthStatusChange?: (status: AuthenticationStatus) => void;
}

export const AdobeAuthPanel: React.FC<AdobeAuthPanelProps> = ({ onAuthStatusChange }) => {
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>(adobeAuthService.getAuthStatus());
  const [environment, setEnvironment] = useState<AdobeEnvironment>(adobeConfigService.getCurrentEnvironment());
  const [tokensExpanded, setTokensExpanded] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(true);

  useEffect(() => {
    const unsubscribe = adobeAuthService.onStatusChange((status) => {
      setAuthStatus(status);
      onAuthStatusChange?.(status);
      
      // Auto-collapse when successfully connected
      if (status.status === 'connected' && panelExpanded) {
        setTimeout(() => setPanelExpanded(false), 1000);
      }
    });

    return unsubscribe;
  }, [onAuthStatusChange, panelExpanded]);

  const handleEnvironmentChange = (checked: boolean) => {
    const newEnv: AdobeEnvironment = checked ? 'production' : 'sandbox';
    setEnvironment(newEnv);
    adobeConfigService.setEnvironment(newEnv);
    
    // Clear authentication when switching environments
    adobeAuthService.clearAuth();
  };

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    try {
      await adobeAuthService.authenticate();
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = () => {
    adobeAuthService.clearAuth();
  };

  const handleCopyToken = async (token: string | null, tokenType: 'jwt' | 'access') => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(tokenType);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  const getStatusIcon = () => {
    switch (authStatus.status) {
      case 'connected':
        return '🟢';
      case 'connecting':
        return '🟡';
      case 'error':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusColor = () => {
    switch (authStatus.status) {
      case 'connected':
        return 'green';
      case 'connecting':
        return 'yellow';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = () => {
    switch (authStatus.status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  const formatToken = (token: string | null | undefined) => {
    if (!token) return 'N/A';
    if (token.length > 100) {
      return `${token.substring(0, 50)}...${token.substring(token.length - 50)}`;
    }
    return token;
  };

  const getTokenExpiration = () => {
    if (!authStatus.tokens) return null;
    
    const expiresAt = new Date(authStatus.tokens.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 0) return 'Expired';
    if (diffMins < 60) return `${diffMins} minutes`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hours`;
  };

  return (
    <Card withBorder shadow="sm" padding="sm" radius="md" style={{ marginBottom: '0.5rem' }}>
      <Stack gap="sm">
        {/* Compact Header with Status and Environment */}
        <Group justify="space-between">
          <Group gap="sm">
            <Text fw={500} size="sm">
              Adobe Authentication
            </Text>
            <Badge
              color={getStatusColor()}
              variant="light"
              leftSection={getStatusIcon()}
              size="sm"
            >
              {getStatusText()}
            </Badge>
          </Group>
          <Group gap="sm">
            {/* Environment Toggle - Compact */}
            <Group gap="xs">
              <Text size="xs" c={environment === 'sandbox' ? 'blue' : 'dimmed'}>
                Sandbox
              </Text>
              <Switch
                size="xs"
                color="green"
                checked={environment === 'production'}
                onChange={(event) => handleEnvironmentChange(event.currentTarget.checked)}
              />
              <Text size="xs" c={environment === 'production' ? 'green' : 'dimmed'}>
                Production
              </Text>
            </Group>
            <Tooltip label="Refresh Status">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => setAuthStatus(adobeAuthService.getAuthStatus())}
              >
                <IconRefresh size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={panelExpanded ? "Collapse" : "Expand"}>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => setPanelExpanded(!panelExpanded)}
              >
                {panelExpanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Collapse in={panelExpanded}>

        {/* Error Display */}
        {authStatus.error && (
          <Alert color="red" title="Authentication Error" icon={<IconX size={16} />}>
            {authStatus.error}
          </Alert>
        )}

        {/* Connection Button */}
        <Group justify="center">
          {authStatus.status === 'connected' ? (
            <Button
              variant="outline"
              color="red"
              onClick={handleDisconnect}
              leftSection={<IconX size={16} />}
              size="sm"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              color="green"
              onClick={handleAuthenticate}
              loading={isAuthenticating}
              leftSection={isAuthenticating ? <Loader size={16} /> : '🚀'}
              disabled={!adobeConfigService.isConfigured()}
              size="sm"
            >
              Initialize Adobe Connection
            </Button>
          )}
        </Group>

        {/* Compact Token Display */}
        {authStatus.tokens && (
          <Group justify="space-between" style={{ fontSize: '0.75rem' }}>
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Tokens: {getTokenExpiration()}
              </Text>
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={() => setTokensExpanded(!tokensExpanded)}
              >
                {tokensExpanded ? <IconChevronUp size={12} /> : <IconChevronDown size={12} />}
              </ActionIcon>
            </Group>
            {authStatus.tokens.accessToken && (
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={() => handleCopyToken(authStatus.tokens!.accessToken, 'access')}
              >
                {copiedToken === 'access' ? <IconCheck size={12} /> : <IconCopy size={12} />}
              </ActionIcon>
            )}
          </Group>
        )}

        {/* Expanded Token Details */}
        {authStatus.tokens && (
          <Collapse in={tokensExpanded}>
            <Stack gap="xs">
              {/* Access Token */}
              {authStatus.tokens.accessToken && (
                <Box>
                  <Text size="xs" fw={500} c="dimmed" mb="xs">
                    Access Token
                  </Text>
                  <Code block style={{ wordBreak: 'break-all', fontSize: '0.6rem', padding: '0.25rem' }}>
                    {formatToken(authStatus.tokens.accessToken)}
                  </Code>
                </Box>
              )}
              {/* OAuth message if no JWT */}
              {!authStatus.tokens.jwt && authStatus.tokens.accessToken && (
                <Text size="xs" c="dimmed" ta="center">
                  Using OAuth Server-to-Server authentication
                </Text>
              )}
            </Stack>
          </Collapse>
        )}

        {/* Configuration Status */}
        {!adobeConfigService.isConfigured() && (
          <Alert color="yellow" title="Configuration Required">
            Some credentials are missing for the {environment} environment. Please check your configuration.
          </Alert>
        )}
        </Collapse>
      </Stack>
    </Card>
  );
}; 