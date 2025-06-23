import React from 'react';
import { 
  Box, 
  Group, 
  TextInput, 
  ActionIcon, 
  Menu, 
  Button,
  Text
} from '@mantine/core';
import { 
  IconSearch, 
  IconApps, 
  IconChartLine, 
  IconSettings, 
  IconShoppingCart,
  IconUser,
  IconChevronDown
} from '@tabler/icons-react';

const AppDirectHeader = () => {
  return (
    <Box bg="#3c3c3c" style={{ height: '60px', position: 'sticky', top: 0, zIndex: 1000 }}>
      <Group h="100%" px="md" justify="space-between">
        {/* Left Section - Logo and Navigation */}
        <Group>
          {/* AppDirect Logo */}
          <Group gap="xs">
            <Box
              style={{
                width: 24,
                height: 24,
                backgroundColor: '#ffffff',
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                transform: 'rotate(0deg)'
              }}
            />
            <Text c="white" fw={700} size="lg">AppDirect</Text>
          </Group>

          {/* Icon Navigation */}
          <Group gap="md" ml="xl">
            <ActionIcon variant="subtle" size="lg" color="white">
              <IconApps size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle" size="lg" color="white">
              <IconChartLine size={20} />
            </ActionIcon>
            <ActionIcon variant="subtle" size="lg" color="white">
              <IconSettings size={20} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Center Section - Search */}
        <Box style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            bg="white"
            styles={{
              input: {
                backgroundColor: 'white',
                border: 'none',
                '&:focus': {
                  borderColor: '#0891b2'
                }
              }
            }}
          />
        </Box>

        {/* Right Section - User Controls */}
        <Group>
          {/* Manage Dropdown */}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button 
                variant="subtle" 
                color="white" 
                rightSection={<IconChevronDown size={16} />}
                styles={{
                  root: { color: 'white' },
                  label: { color: 'white' }
                }}
              >
                Manage
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Companies</Menu.Item>
              <Menu.Item>Users</Menu.Item>
              <Menu.Item>Products</Menu.Item>
              <Menu.Item>Reports</Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* User Menu */}
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg" color="white">
                <IconUser size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Profile</Menu.Item>
              <Menu.Item>Settings</Menu.Item>
              <Menu.Item>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Cart */}
          <ActionIcon variant="subtle" size="lg" color="white">
            <IconShoppingCart size={20} />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
};

export default AppDirectHeader; 