import React, { useState } from 'react';
import { Box, Group, Text, Button } from '@mantine/core';

interface SecondaryNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AppDirectSecondaryNav = ({ activeTab = 'companies', onTabChange }: SecondaryNavProps) => {
  const tabs = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'products', label: 'Products' },
    { id: 'companies', label: 'Companies' },
    { id: 'settings', label: 'Settings' },
    { id: 'reports', label: 'Reports' },
    { id: 'theme-manager', label: 'Theme Manager' }
  ];

  return (
    <Box bg="#f8f8f8" style={{ height: '48px', borderBottom: '1px solid #e5e7eb' }}>
      <Group h="100%" px="md" gap="xs">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => onTabChange?.(tab.id)}
            styles={{
              root: {
                backgroundColor: activeTab === tab.id ? 'transparent' : 'transparent',
                color: activeTab === tab.id ? '#374151' : '#6b7280',
                borderBottom: activeTab === tab.id ? '2px solid #0891b2' : '2px solid transparent',
                borderRadius: 0,
                padding: '0 16px',
                height: '48px',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                  color: '#374151'
                }
              },
              label: {
                fontWeight: activeTab === tab.id ? 600 : 500
              }
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Group>
    </Box>
  );
};

export default AppDirectSecondaryNav; 