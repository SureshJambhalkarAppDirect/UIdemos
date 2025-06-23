import React from 'react';
import { 
  Box, 
  Text, 
  Stack, 
  Button, 
  Divider 
} from '@mantine/core';

const AppDirectSidebar = () => {
  const menuSections = [
    {
      title: 'HOME',
      items: [
        { label: 'Overview', active: false },
        { label: 'Users', active: false },
        { label: 'Companies', active: true },
        { label: 'Products', active: false },
        { label: 'Subscriptions', active: false }
      ]
    },
    {
      title: 'BILLING',
      items: [
        { label: 'Orders', active: false },
        { label: 'Invoices', active: false },
        { label: 'Payments', active: false },
        { label: 'Credits', active: false }
      ]
    },
    {
      title: 'EVENTS',
      items: [
        { label: 'Event Logs', active: false },
        { label: 'App Usage Logs', active: false },
        { label: 'API Logs', active: false }
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
                    fontWeight: item.active ? 500 : 400
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

export default AppDirectSidebar; 