import React from 'react';
import { 
  Box, 
  Text, 
  Stack, 
  Button, 
  Divider 
} from '@mantine/core';

const SettingsSidebar = () => {
  const menuSections = [
    {
      title: 'SETTINGS',
      items: [
        { label: 'General Settings', active: false },
        { label: 'Developers', active: false },
        { label: 'Marketplace Functionality', active: false },
        { label: 'Roles', active: false },
        { label: 'Assisted Sales', active: false },
        { label: 'Security', active: false },
        { label: 'Product Search', active: false },
        { label: 'Usage Analytics Accounts', active: false },
        { label: 'Data Removal', active: false }
      ]
    },
    {
      title: 'BILLING SETTINGS',
      items: [
        { label: 'Billing Functionality', active: false },
        { label: 'Payment Methods', active: false },
        { label: 'Invoice Settings', active: false },
        { label: 'Revenue Shares Settings', active: false }
      ]
    },
    {
      title: 'CUSTOM UI',
      items: [
        { label: 'FAQs', active: false },
        { label: 'Notifications', active: false },
        { label: 'Custom Attributes', active: false },
        { label: 'Customize Translations', active: false }
      ]
    },
    {
      title: 'INTEGRATION',
      items: [
        { label: 'GraphQL Explorer', active: false },
        { label: 'API Clients', active: false },
        { label: 'Migration', active: true }, // This should be active since we're in migration
        { label: 'Webhooks', active: false }
      ]
    }
  ];

  return (
    <Box 
      bg="#f5f5f5" 
      style={{ 
        width: '280px', 
        height: '100vh', 
        borderRight: '1px solid #e5e7eb',
        padding: '16px 0'
      }}
    >
      <Stack gap="md">
        {menuSections.map((section, sectionIndex) => (
          <Box key={section.title}>
            {/* Section Title */}
            <Text 
              size="xs" 
              fw={600} 
              c="#6b7280" 
              px="md" 
              mb="xs"
              style={{ letterSpacing: '0.05em' }}
            >
              {section.title}
            </Text>
            
            {/* Section Items */}
            <Stack gap="xs">
              {section.items.map((item, itemIndex) => (
                <Button
                  key={`${sectionIndex}-${itemIndex}`}
                  variant="subtle"
                  justify="flex-start"
                  color={item.active ? 'white' : 'gray'}
                  style={{
                    backgroundColor: item.active ? '#0891b2' : 'transparent',
                    color: item.active ? 'white' : '#374151',
                    borderRadius: 0,
                    padding: '8px 16px',
                    height: 'auto',
                    fontWeight: item.active ? 500 : 400,
                    fontSize: '14px'
                  }}
                  styles={{
                    root: {
                      '&:hover': {
                        backgroundColor: item.active ? '#0891b2' : '#e5e7eb'
                      }
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
            
            {/* Divider between sections */}
            {sectionIndex < menuSections.length - 1 && (
              <Divider my="md" color="#e5e7eb" />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default SettingsSidebar;
