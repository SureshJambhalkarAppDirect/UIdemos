import React, { useState } from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Group, 
  Box, 
  Button, 
  Tabs,
  SimpleGrid,
  Badge,
  ActionIcon,
  Breadcrumbs,
  Anchor,
  Indicator,
  Select,
  Stack,
  Center,
  Menu,
  Notification
} from '@mantine/core';
import { 
  IconChevronRight, 
  IconDots, 
  IconCopy,
  IconRefresh,
  IconEdit,
  IconX,
  IconCheck
} from '@tabler/icons-react';
import AdditionalInfoModal from './AdditionalInfoModal';

interface CompanyDetailPageProps {
  companyId: string;
  onBack: () => void;
}

const CompanyDetailPage = ({ companyId, onBack }: CompanyDetailPageProps) => {
  const [activeTab, setActiveTab] = useState('vendor-information');
  const [selectedVendor, setSelectedVendor] = useState('Adobe');
  const [modalOpened, setModalOpened] = useState(false);
  const [hasVendorProfile, setHasVendorProfile] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  // Company data
  const company = {
    id: companyId,
    name: 'Cypress Cormier - Fay',
    logo: 'A',
    status: 'Enabled',
    companyId: 'P1005214392'
  };

  // Stats data
  const stats = [
    { label: 'Total Users', value: hasVendorProfile ? '16' : '15' },
    { label: 'Active Users', value: '12' },
    { label: 'Purchased Products', value: hasVendorProfile ? '3' : '2' },
    { label: 'Active Products', value: '2' },
    { label: 'Pending Orders', value: '1' },
    { label: 'Total Revenue', value: '$24,580' }
  ];

  const breadcrumbItems = [
    { title: 'Home', href: '#' },
    { title: 'Companies', href: '#' },
    { title: company.name, href: '#' }
  ].map((item, index) => (
    <Anchor 
      href={item.href} 
      key={index} 
      size="sm" 
      c="#0891b2"
      onClick={index === 1 ? onBack : undefined}
      style={{ cursor: index === 1 ? 'pointer' : 'default' }}
    >
      {item.title}
    </Anchor>
  ));

  const handleSaveAdditionalInfo = (data: any) => {
    console.log('Saving additional info:', data);
    setHasVendorProfile(true);
    setModalOpened(false);
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 5000);
  };

  const handleUpdateProfile = () => {
    setModalOpened(true);
  };

  const handleUpdateAdditionalInfo = (data: any) => {
    console.log('Updating additional info:', data);
    setModalOpened(false);
    setShowUpdateNotification(true);
    setTimeout(() => setShowUpdateNotification(false), 5000);
  };

  const renderVendorInformation = () => {
    if (!hasVendorProfile) {
      return (
        <Box>
          {/* Vendor Selection */}
          <Group mb="lg" justify="space-between">
            <Text fw={500} size="sm" c="#374151">Select Vendor</Text>
          </Group>
          
          <Select
            data={[
              { value: 'Microsoft', label: 'Microsoft' },
              { value: 'Adobe', label: 'Adobe ✓' },
              { value: 'Salesforce', label: 'Salesforce' },
              { value: 'Oracle', label: 'Oracle' }
            ]}
            value={selectedVendor}
            onChange={(value) => setSelectedVendor(value || 'Adobe')}
            placeholder="Select vendor"
            mb="xl"
            bg="#f5f5f5"
            styles={{
              input: { backgroundColor: '#f5f5f5' }
            }}
          />

          {/* Adobe Empty State */}
          {selectedVendor === 'Adobe' && (
            <Center p="xl">
              <Stack align="center" gap="lg">
                <Box
                  bg="#e53e3e"
                  c="white"
                  p="lg"
                  style={{ 
                    borderRadius: '8px',
                    fontSize: '24px',
                    fontWeight: 700,
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  A
                </Box>
                <Text fw={600} size="lg" c="#374151" ta="center">
                  There is no Adobe company profile linked to this account.
                </Text>
                <Button 
                  variant="outline" 
                  color="gray"
                  onClick={() => setModalOpened(true)}
                  styles={{
                    root: {
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                        borderColor: '#9ca3af'
                      }
                    }
                  }}
                >
                  Add Additional Information
                </Button>
              </Stack>
            </Center>
          )}
        </Box>
      );
    }

    // Vendor Profile Card (after form submission)
    return (
      <Box>
        {/* Vendor Selection */}
        <Group mb="lg" justify="space-between">
          <Text fw={500} size="sm" c="#374151">Select Vendor</Text>
        </Group>
        
        <Select
          data={[
            { value: 'Microsoft', label: 'Microsoft' },
            { value: 'Adobe', label: 'Adobe ✓' },
            { value: 'Salesforce', label: 'Salesforce' },
            { value: 'Oracle', label: 'Oracle' }
          ]}
          value={selectedVendor}
          onChange={(value) => setSelectedVendor(value || 'Adobe')}
          placeholder="Select vendor"
          mb="xl"
          bg="#f5f5f5"
          styles={{
            input: { backgroundColor: '#f5f5f5' }
          }}
        />

        {/* Populated Vendor Profile */}
        {selectedVendor === 'Adobe' && (
          <Paper withBorder p="lg" radius="md">
            <Group justify="space-between" mb="md">
              <Group>
                <Box
                  bg="#e53e3e"
                  c="white"
                  p="sm"
                  style={{ 
                    borderRadius: '4px',
                    fontSize: '18px',
                    fontWeight: 700,
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  A
                </Box>
                <Box>
                  <Text fw={600} size="lg" c="#374151">Cypress Dietrich - Labadie</Text>
                  <Text size="sm" c="#6b7280">P1005214392</Text>
                </Box>
              </Group>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconRefresh size={16} />}>
                    Refresh
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<IconEdit size={16} />}
                    onClick={handleUpdateProfile}
                  >
                    Update company profile
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            <SimpleGrid cols={2} spacing="lg">
              <Box>
                <Text size="sm" c="#6b7280" mb="xs">Address</Text>
                <Text size="sm" c="#374151">50 GROVE ST.</Text>
                <Text size="sm" c="#374151">Somerville, MA 02114</Text>
                <Text size="sm" c="#374151">US</Text>
              </Box>
              <Box>
                <Text size="sm" c="#6b7280" mb="xs">Contact</Text>
                <Text size="sm" c="#374151">Phone: (555) 123-4567</Text>
                <Text size="sm" c="#374151">Email: contact@cypress.com</Text>
              </Box>
              <Box>
                <Text size="sm" c="#6b7280" mb="xs">Current discount levels - licenses</Text>
                <Text size="sm" fw={500} c="#374151">Level 01</Text>
              </Box>
              <Box>
                <Text size="sm" c="#6b7280" mb="xs">Current discount levels - consumables</Text>
                <Text size="sm" fw={500} c="#374151">Tier T1</Text>
              </Box>
              <Box>
                <Text size="sm" c="#6b7280" mb="xs">Market segment</Text>
                <Text size="sm" fw={500} c="#374151">Government</Text>
              </Box>
              <Box>
                <Text size="sm" c="#6b7280" mb="xs">Type</Text>
                <Text size="sm" fw={500} c="#374151">Commercial</Text>
              </Box>
            </SimpleGrid>

            {/* Administrator Information */}
            <Paper withBorder p="md" radius="sm" mt="lg" bg="#f8f9fa">
              <Text fw={600} mb="md" c="#374151">Administrator Contact Information</Text>
              <SimpleGrid cols={3}>
                <Box>
                  <Text size="xs" fw={700} c="#374151">Administrator name</Text>
                  <Text size="sm" c="#374151">adsasd asdasd</Text>
                </Box>
                <Box>
                  <Text size="xs" fw={700} c="#374151">Email ID</Text>
                  <Text size="sm" c="#374151">asdasd@as.com</Text>
                </Box>
                <Box>
                  <Text size="xs" fw={700} c="#374151">Phone number</Text>
                  <Text size="sm" c="#374151">2132423456</Text>
                </Box>
              </SimpleGrid>
            </Paper>
          </Paper>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Success Notifications */}
      {showSuccessNotification && (
        <Box style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <Notification
            icon={<IconCheck size={18} />}
            color="green"
            title="Success"
            onClose={() => setShowSuccessNotification(false)}
            withCloseButton
          >
            Customer account created successfully.
          </Notification>
        </Box>
      )}

      {showUpdateNotification && (
        <Box style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <Notification
            icon={<IconCheck size={18} />}
            color="green"
            title="Success"
            onClose={() => setShowUpdateNotification(false)}
            withCloseButton
          >
            Customer account updated successfully.
          </Notification>
        </Box>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs separator={<IconChevronRight size={14} />} mb="lg">
        {breadcrumbItems}
      </Breadcrumbs>

      {/* Company Header Card */}
      <Paper withBorder p="lg" radius="md" mb="lg">
        <Group justify="space-between">
          <Group>
            <Box
              bg="#0891b2"
              c="white"
              p="sm"
              style={{ 
                borderRadius: '4px',
                fontSize: '18px',
                fontWeight: 700,
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {company.logo}
            </Box>
            <Box>
              <Group gap="sm">
                <Text fw={600} size="lg" c="#374151">{company.name}</Text>
                <Badge color="green" variant="light" leftSection={
                  <Indicator color="#22c55e" size={6} />
                }>
                  {company.status}
                </Badge>
              </Group>
              <Group gap="xs">
                <Text size="sm" c="#6b7280">{company.companyId}</Text>
                <ActionIcon variant="subtle" size="sm" color="gray">
                  <IconCopy size={14} />
                </ActionIcon>
              </Group>
            </Box>
          </Group>
          <Group>
            <Button variant="outline" color="gray">Edit</Button>
            <Button color="#0891b2">Manage</Button>
          </Group>
        </Group>
      </Paper>

      {/* Statistics Cards */}
      <Box bg="#f5f5f5" p="lg" mb="lg" style={{ borderRadius: '8px' }}>
        <SimpleGrid cols={6} spacing="lg">
          {stats.map((stat, index) => (
            <Paper key={index} p="md" bg="white" withBorder radius="md" style={{ textAlign: 'center' }}>
              <Text fw={700} size="xl" c="#374151">{stat.value}</Text>
              <Text size="xs" c="#6b7280">{stat.label}</Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Box>

      {/* Company Information Card */}
      <Paper withBorder p="lg" radius="md" mb="lg">
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg" c="#374151">{company.name}</Text>
          <Group>
            <Anchor size="sm" c="#0891b2">Edit</Anchor>
            <Anchor size="sm" c="#0891b2">Show more</Anchor>
          </Group>
        </Group>
        
        <SimpleGrid cols={2} spacing="lg">
          <Box>
            <Text size="sm" c="#6b7280" mb="xs">Company ID</Text>
            <Group gap="xs">
              <Text size="sm" c="#374151" ff="monospace">{company.companyId}</Text>
              <ActionIcon variant="subtle" size="sm" color="gray">
                <IconCopy size={14} />
              </ActionIcon>
            </Group>
          </Box>
          <Box>
            <Text size="sm" c="#6b7280" mb="xs">Status</Text>
            <Text size="sm" c="#374151">{company.status}</Text>
          </Box>
          <Box>
            <Text size="sm" c="#6b7280" mb="xs">Created Date</Text>
            <Text size="sm" c="#374151">January 15, 2025</Text>
          </Box>
          <Box>
            <Text size="sm" c="#6b7280" mb="xs">Last Updated</Text>
            <Text size="sm" c="#374151">January 16, 2025</Text>
          </Box>
        </SimpleGrid>
      </Paper>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'vendor-information')} color="#0891b2">
        <Tabs.List bg="white" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <Tabs.Tab value="users" fw={500}>Users</Tabs.Tab>
          <Tabs.Tab value="payment-methods" fw={500}>Payment Methods</Tabs.Tab>
          <Tabs.Tab value="vendor-information" fw={500}>Vendor Information</Tabs.Tab>
          <Tabs.Tab value="domains" fw={500}>Domains</Tabs.Tab>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" color="gray" size="sm">
                +3 more Tabs
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Orders</Menu.Item>
              <Menu.Item>Billing</Menu.Item>
              <Menu.Item>Settings</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Tabs.List>

        <Tabs.Panel value="users" pt="md">
          <Paper withBorder p="lg" radius="md" bg="white">
            <Text c="#374151">Users content would go here...</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="payment-methods" pt="md">
          <Paper withBorder p="lg" radius="md" bg="white">
            <Text c="#374151">Payment Methods content would go here...</Text>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="vendor-information" pt="md">
          <Paper withBorder p="lg" radius="md" bg="white">
            {renderVendorInformation()}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="domains" pt="md">
          <Paper withBorder p="lg" radius="md" bg="white">
            <Text c="#374151">Domains content would go here...</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Additional Info Modal */}
      <AdditionalInfoModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSave={hasVendorProfile ? handleUpdateAdditionalInfo : handleSaveAdditionalInfo}
        scenario={hasVendorProfile ? 'Edit' : 'Create'}
      />
    </Box>
  );
};

export default CompanyDetailPage; 