import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, Title, Text, Group, Card, Button, Stack, Radio, FileInput, Flex, Select } from '@mantine/core';
import AppDirectHeader from './AppDirectHeader';
import AppDirectSecondaryNav from './AppDirectSecondaryNav';
import SettingsSidebar from './SettingsSidebar';

const AdobeVIPMPMigrationsFlow: React.FC = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdobeVIPMPMigrationsMain />} />
    </Routes>
  );
};

const AdobeVIPMPMigrationsMain: React.FC = () => {
  const [migrationMode, setMigrationMode] = useState<'vip-to-vipmp' | 'vipmp-generation'>('vip-to-vipmp');
  const [requestType, setRequestType] = useState<'new' | 'open'>('new');
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly' | 'multi-year'>('yearly');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const getModeDescription = () => {
    if (migrationMode === 'vip-to-vipmp') {
      return 'Transfer memberships from VIP to VIPMP and generate migration files.';
    }
    return 'Generate migration files for existing VIPMP memberships.';
  };

  const getFileRequirement = () => {
    if (migrationMode === 'vip-to-vipmp') {
      return 'Requires CSV file upload';
    }
    return 'Requires CSV file upload';
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* AppDirect Header */}
      <AppDirectHeader />
      
      {/* Secondary Navigation */}
      <AppDirectSecondaryNav activeTab="settings" />
      
      <Flex style={{ minHeight: 'calc(100vh - 108px)' }}>
        {/* Sidebar */}
        <SettingsSidebar />
        
        {/* Main Content */}
        <Box style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <Box style={{ padding: '32px 48px' }}>
            {/* Back Button */}
            <Button
              variant="subtle"
              size="sm"
              leftSection={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              }
              style={{ 
                color: '#6b7280',
                marginBottom: '10px',
                padding: '8px 12px',
                fontSize: '14px'
              }}
            >
              Back
            </Button>

            {/* Page Title */}
            <Title 
              order={1} 
              style={{ 
                fontSize: '24px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '24px'
              }}
            >
              Generate Migration Files
            </Title>

            {/* Migration Type Selection - Same pattern as Request Type */}
            <Box style={{ marginBottom: '32px' }}>
              <Text size="sm" fw={500} style={{ color: '#374151', marginBottom: '10px' }}>
                Migration Type
              </Text>
              <Radio.Group
                value={migrationMode}
                onChange={(value) => setMigrationMode(value as 'vip-to-vipmp' | 'vipmp-generation')}
              >
                <Group gap="xl">
                  <Radio
                    value="vip-to-vipmp"
                    label="Transfer VIP to VIPMP"
                    description="Transfer memberships from VIP to VIPMP and generate migration files"
                    styles={{
                      label: { fontSize: '14px', fontWeight: 500, color: '#374151' },
                      description: { fontSize: '12px', color: '#6b7280' }
                    }}
                  />
                  <Radio
                    value="vipmp-generation"
                    label="Generate files for VIPMP memberships"
                    description="Generate migration files for existing VIPMP memberships"
                    styles={{
                      label: { fontSize: '14px', fontWeight: 500, color: '#374151' },
                      description: { fontSize: '12px', color: '#6b7280' }
                    }}
                  />
                </Group>
              </Radio.Group>
            </Box>

            {/* Request Type Selection */}
            <Box style={{ marginBottom: '48px' }}>
              <Text size="sm" fw={500} style={{ color: '#374151', marginBottom: '12px' }}>
                Request Type
              </Text>
              <Radio.Group
                value={requestType}
                onChange={(value) => setRequestType(value as 'new' | 'open')}
              >
                <Group gap="xl">
                  <Radio
                    value="new"
                    label="New request"
                    description={getFileRequirement()}
                    styles={{
                      label: { fontSize: '14px', fontWeight: 500, color: '#374151' },
                      description: { fontSize: '12px', color: '#6b7280' }
                    }}
                  />
                  <Radio
                    value="open"
                    label="Open request"
                    description="Requires any request ID from past 24 hours"
                    styles={{
                      label: { fontSize: '14px', fontWeight: 500, color: '#374151' },
                      description: { fontSize: '12px', color: '#6b7280' }
                    }}
                  />
                </Group>
              </Radio.Group>
            </Box>

            {/* Step 1: Initiate Request */}
            <Box style={{ marginBottom: '24px' }}>
              <Group gap="sm" style={{ marginBottom: '16px' }}>
                <Text style={{ fontSize: '18px', fontWeight: 600, color: '#374151' }}>1</Text>
                <Title order={3} style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}>
                  Initiate Request
                </Title>
              </Group>

              <Text size="sm" style={{ color: '#6b7280', marginBottom: '16px' }}>
                {getModeDescription()}
              </Text>

              <Box
                style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '4px',
                  padding: '12px',
                  marginBottom: '16px'
                }}
              >
                <Stack gap="xs">
                  <Text size="xs" style={{ color: '#0891b2' }}>
                    • You can process only one request at a time.
                  </Text>
                  <Text size="xs" style={{ color: '#0891b2' }}>
                    • Ensure that the data format matches attached{' '}
                    <Text component="span" style={{ color: '#0891b2', textDecoration: 'underline', cursor: 'pointer' }}>
                      sample file
                    </Text>
                    .
                  </Text>
                  <Text size="xs" style={{ color: '#0891b2' }}>
                    • Ensure the correct file format (.csv) and size (1MB).
                  </Text>
                </Stack>
              </Box>

              <Stack gap="md">
                <Box>
                  <Text size="sm" fw={500} style={{ color: '#374151', marginBottom: '8px' }}>
                    * Upload file
                  </Text>
                  <Group gap="sm">
                    <Box style={{ flex: 1, position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="No file chosen"
                        disabled
                        style={{
                          width: '100%',
                          backgroundColor: '#f9fafb',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          color: '#6b7280'
                        }}
                      />
                    </Box>
                    <Button
                      variant="outline"
                      style={{
                        border: '1px solid #d1d5db',
                        color: '#374151',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        padding: '8px 16px'
                      }}
                    >
                      Choose File
                    </Button>
                  </Group>
                </Box>

                    <Box>
                      <Text size="sm" fw={500} style={{ color: '#374151', marginBottom: '8px' }}>
                        * Billing cycle
                      </Text>
                      <Radio.Group
                        value={billingCycle}
                        onChange={(value) => setBillingCycle(value as 'yearly' | 'monthly' | 'multi-year')}
                      >
                        <Group gap="lg">
                          <Radio
                            value="yearly"
                            label="Yearly"
                            styles={{
                              label: { fontSize: '14px', color: '#374151' }
                            }}
                          />
                          <Radio
                            value="monthly"
                            label="Monthly"
                            styles={{
                              label: { fontSize: '14px', color: '#374151' }
                            }}
                          />
                          <Radio
                            value="multi-year"
                            label="Multi-year"
                            styles={{
                              label: { fontSize: '14px', color: '#374151' }
                            }}
                          />
                        </Group>
                      </Radio.Group>
                    </Box>

                <Group justify="flex-end">
                  <Button
                    disabled
                    style={{
                      backgroundColor: '#d1d5db',
                      color: '#6b7280',
                      border: 'none',
                      fontSize: '14px',
                      padding: '8px 16px'
                    }}
                  >
                    Initiate Request
                  </Button>
                </Group>
              </Stack>
            </Box>

            {/* Step 2: Download Files */}
            <Box style={{ marginBottom: '24px' }}>
              <Group gap="sm" style={{ marginBottom: '16px' }}>
                <Text style={{ fontSize: '18px', fontWeight: 600, color: '#374151' }}>2</Text>
                <Title order={3} style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}>
                  Download Files
                </Title>
              </Group>

              <Text size="sm" style={{ color: '#6b7280', marginBottom: '16px' }}>
                Files will be available for download after the initiate request processing is complete.
              </Text>

              <Group justify="flex-end">
                <Button
                  disabled
                  style={{
                    backgroundColor: '#d1d5db',
                    color: '#6b7280',
                    border: 'none',
                    fontSize: '14px',
                    padding: '8px 16px'
                  }}
                >
                  Download Files
                </Button>
              </Group>
            </Box>

            {/* Step 3: Initiate Migration */}
            <Box>
              <Group gap="sm" style={{ marginBottom: '16px' }}>
                <Text style={{ fontSize: '18px', fontWeight: 600, color: '#374151' }}>3</Text>
                <Title order={3} style={{ fontSize: '16px', fontWeight: 500, color: '#374151' }}>
                  Initiate Migration
                </Title>
              </Group>

              <Text size="sm" style={{ color: '#6b7280', marginBottom: '16px' }}>
                You can proceed with the migration after downloading the generated migration files.
              </Text>

              <Group justify="flex-end">
                <Button
                  disabled
                  style={{
                    backgroundColor: '#d1d5db',
                    color: '#6b7280',
                    border: 'none',
                    fontSize: '14px',
                    padding: '8px 16px'
                  }}
                >
                  Initiate Migration
                </Button>
              </Group>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default AdobeVIPMPMigrationsFlow;
