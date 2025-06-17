import React, { useState } from 'react';
import { 
  Box, 
  Group, 
  Text, 
  Button, 
  Tabs, 
  Paper, 
  Stack, 
  Grid,
  Badge,
  Anchor,
  ActionIcon,
  Textarea,
  Select,
  TextInput
} from '@mantine/core';
import { 
  IconHome, 
  IconGrid3x3, 
  IconChartBar, 
  IconUsers,
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconChevronDown,
  IconCopy,
  IconPlus
} from '@tabler/icons-react';
import AdditionalInfoModal from './AdditionalInfoModal';

interface MarketplaceInterfaceProps {
  mockDataScenarios: {
    visible: any;
    hidden: any;
  };
  onNavigate?: (view: string) => void;
}

const MarketplaceInterface: React.FC<MarketplaceInterfaceProps> = ({ mockDataScenarios, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string | null>('applicable');
  const [modalOpened, setModalOpened] = useState(false);

  const getCurrentScenario = () => {
    return activeTab === 'applicable' ? 'visible' : 'hidden';
  };

  const getCurrentMockData = () => {
    return activeTab === 'applicable' ? mockDataScenarios.visible : mockDataScenarios.hidden;
  };

  const getCompanyData = () => {
    if (activeTab === 'applicable') {
      return {
        name: 'Federal Gov Purchasing Group',
        id: 'P1005214392',
        created: '06/16/25',
        country: 'United States',
        segment: 'Government',
        subSegment: 'Federal',
        renewalQty: 150,
        totalSpent: '$15,000'
      };
    } else {
      return {
        name: 'Tech Solutions Corp',
        id: 'P1005214393',
        created: '03/15/25',
        country: 'Mexico',
        segment: 'Commercial',
        subSegment: '',
        renewalQty: 45,
        totalSpent: '$3,200'
      };
    }
  };

  const companyData = getCompanyData();

  const handleAddAdditionalInfo = () => {
    setModalOpened(true);
  };

  const handleSaveDetails = (data: any) => {
    setModalOpened(false);
    // Navigate to customer details view
    if (onNavigate) {
      onNavigate('customerDetails');
    }
  };

  return (
    <Box style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Adobe Marketplace Navigation */}
      <Box style={{ backgroundColor: '#333', color: 'white', padding: '8px 16px' }}>
        <Group justify="space-between" align="center">
          <Group gap="lg">
            <Group gap="xs">
              <IconHome size={20} />
              <IconGrid3x3 size={20} />
              <IconChartBar size={20} />
              <IconUsers size={20} />
            </Group>
            <Group gap="md">
              <Text size="sm">Marketplace</Text>
              <Group gap="xs">
                <TextInput 
                  placeholder="Search" 
                  size="xs" 
                  style={{ width: '200px' }}
                  rightSection={<IconSearch size={14} />}
                />
              </Group>
            </Group>
          </Group>
          <Group gap="md">
            <Text size="sm">Manage</Text>
            <IconChevronDown size={14} />
            <Text size="sm">Abdullah</Text>
            <IconChevronDown size={14} />
            <Group gap="xs">
              <IconShoppingCart size={16} />
              <Text size="sm">Cart</Text>
            </Group>
          </Group>
        </Group>
      </Box>

      {/* Sub Navigation */}
      <Box style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '8px 16px' }}>
        <Group gap="lg">
          <Anchor href="#" size="sm" fw={500}>Marketplace</Anchor>
          <Anchor href="#" size="sm" style={{ textDecoration: 'underline' }}>Dashboard</Anchor>
          <Anchor href="#" size="sm">Products</Anchor>
          <Anchor href="#" size="sm">Settings</Anchor>
          <Anchor href="#" size="sm">Reports</Anchor>
          <Anchor href="#" size="sm">Theme Manager</Anchor>
        </Group>
      </Box>

      <Group align="start" gap={0} style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Left Sidebar */}
        <Box style={{ 
          width: '250px', 
          backgroundColor: 'white', 
          borderRight: '1px solid #e0e0e0',
          minHeight: 'calc(100vh - 120px)',
          padding: '16px'
        }}>
          <Stack gap="xs">
            <Text size="xs" color="dimmed" fw={600} tt="uppercase">HOME</Text>
            <Anchor href="#" size="sm">Overview</Anchor>
            <Anchor href="#" size="sm">Users</Anchor>
            <Anchor href="#" size="sm" fw={600} style={{ 
              backgroundColor: '#4a90a4', 
              color: 'white', 
              padding: '4px 8px',
              textDecoration: 'none',
              borderRadius: '2px'
            }}>
              Companies
            </Anchor>
            <Anchor href="#" size="sm">Adobe Recommendations</Anchor>
            <Anchor href="#" size="sm">Pending Companies</Anchor>
            <Anchor href="#" size="sm">Leads</Anchor>
            <Anchor href="#" size="sm">Opportunities</Anchor>
            <Anchor href="#" size="sm">Bulk Creation</Anchor>
            <Anchor href="#" size="sm">Reviews & Questions</Anchor>
            
            <Text size="xs" color="dimmed" fw={600} tt="uppercase" mt="md">BILLING</Text>
            <Anchor href="#" size="sm">Orders</Anchor>
            <Anchor href="#" size="sm">Invoices</Anchor>
            <Anchor href="#" size="sm">Payments</Anchor>
            <Anchor href="#" size="sm">Quotes</Anchor>
            <Anchor href="#" size="sm">Metered Usage</Anchor>
            
            <Text size="xs" color="dimmed" fw={600} tt="uppercase" mt="md">EVENTS</Text>
            <Anchor href="#" size="sm">Event Logs</Anchor>
            <Anchor href="#" size="sm">App Usage Logs</Anchor>
            <Anchor href="#" size="sm" fw={600} style={{ 
              backgroundColor: '#1976d2', 
              color: 'white', 
              padding: '4px 8px',
              textDecoration: 'none',
              borderRadius: '2px'
            }}>
              Admin Logs
            </Anchor>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box style={{ flex: 1, padding: '16px', backgroundColor: '#fafafa' }}>
          {/* Breadcrumb */}
          <Group gap="xs" mb="md">
            <Text size="sm" color="dimmed">Companies</Text>
            <Text size="sm" color="dimmed">&gt;</Text>
            <Text size="sm" color="dimmed">{companyData.name}</Text>
          </Group>

          {/* Tabs for Scenarios */}
          <Tabs value={activeTab} onChange={setActiveTab} mb="lg">
            <Tabs.List>
              <Tabs.Tab value="applicable" color="green">
                Convert to LGA Applicable
              </Tabs.Tab>
              <Tabs.Tab value="not-applicable" color="red">
                Convert to LGA Not Applicable
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="applicable" pt="md">
              <CompanyProfile 
                companyData={companyData} 
                onAddAdditionalInfo={handleAddAdditionalInfo}
                scenario="applicable"
              />
            </Tabs.Panel>

            <Tabs.Panel value="not-applicable" pt="md">
              <CompanyProfile 
                companyData={companyData} 
                onAddAdditionalInfo={handleAddAdditionalInfo}
                scenario="not-applicable"
              />
            </Tabs.Panel>
          </Tabs>

          {/* Modal */}
          <AdditionalInfoModal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            mockData={getCurrentMockData()}
            scenario={activeTab === 'applicable' ? 'LGA Field Visible' : 'LGA Field Hidden'}
            onSave={handleSaveDetails}
          />
        </Box>
      </Group>
    </Box>
  );
};

const CompanyProfile = ({ companyData, onAddAdditionalInfo, scenario }: {
  companyData: any;
  onAddAdditionalInfo: () => void;
  scenario: string;
}) => {
  return (
    <Stack gap="lg">
      {/* Company Header */}
      <Paper withBorder p="lg" radius="md" style={{ backgroundColor: 'white' }}>
        <Group justify="space-between" align="start" mb="lg">
          <Group gap="md">
            <Box 
              style={{ 
                width: 48, 
                height: 48, 
                backgroundColor: '#4a90a4', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
              }}
            >
              C
            </Box>
            <Stack gap={2}>
              <Group gap="xs">
                <Text fw={600} size="lg">Company</Text>
                <Badge color="green" size="xs" style={{ marginLeft: '8px' }}>
                  • Enabled
                </Badge>
              </Group>
              <Text fw={700} size="xl" style={{ color: '#333' }}>
                {companyData.name}
              </Text>
            </Stack>
          </Group>
          <Group gap="md">
            <Button variant="outline" size="sm">New Lead or Purchase</Button>
            <Button variant="outline" size="sm">
              Manage Company <IconChevronDown size={14} />
            </Button>
          </Group>
        </Group>

        {/* Stats */}
        <Grid gutter="xl">
          <Grid.Col span={2}>
            <Stack align="center" gap="xs">
              <Text fw={700} size="xl">0</Text>
              <Text size="xs" color="dimmed" style={{ textAlign: 'center' }}>Free Trials</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}>
            <Stack align="center" gap="xs">
              <Text fw={700} size="xl">0</Text>
              <Text size="xs" color="dimmed" style={{ textAlign: 'center' }}>Expired Free Trials</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}>
            <Stack align="center" gap="xs">
              <Text fw={700} size="xl">{scenario === 'applicable' ? '3' : '1'}</Text>
              <Text size="xs" color="dimmed" style={{ textAlign: 'center' }}>Purchased Products</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}>
            <Stack align="center" gap="xs">
              <Text fw={700} size="xl">0</Text>
              <Text size="xs" color="dimmed" style={{ textAlign: 'center' }}>Suspended Products</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}>
            <Stack align="center" gap="xs">
              <Text fw={700} size="xl">0</Text>
              <Text size="xs" color="dimmed" style={{ textAlign: 'center' }}>Unpaid Invoices</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}>
            <Stack align="center" gap="xs">
              <Text fw={700} size="xl" color="green">{companyData.totalSpent}</Text>
              <Text size="xs" color="dimmed" style={{ textAlign: 'center' }}>Total Spent</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Company Details */}
      <Paper withBorder p="lg" radius="md" style={{ backgroundColor: 'white' }}>
        <Group justify="space-between" align="center" mb="lg">
          <Text fw={600}>Company Name</Text>
          <Anchor href="#" size="sm" color="blue">Edit</Anchor>
        </Group>
        
        <Grid gutter="lg">
          <Grid.Col span={6}>
            <Stack gap="sm">
              <Box>
                <Text size="xs" color="dimmed">Company Name</Text>
                <Text fw={500}>{companyData.name}</Text>
              </Box>
              <Box>
                <Text size="xs" color="dimmed">ID</Text>
                <Group gap="xs">
                  <Text fw={400} style={{ fontFamily: 'monospace' }}>{companyData.id}</Text>
                  <ActionIcon variant="subtle" size="sm">
                    <IconCopy size={12} />
                  </ActionIcon>
                </Group>
              </Box>
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack gap="sm">
              <Box>
                <Text size="xs" color="dimmed">Created</Text>
                <Text fw={500}>{companyData.created}</Text>
              </Box>
              <Box>
                <Text size="xs" color="dimmed">Website</Text>
                <Text fw={500} color="dimmed">No value</Text>
              </Box>
            </Stack>
          </Grid.Col>
        </Grid>

        <Group justify="center" mt="xl">
          <Anchor href="#" size="sm" color="blue">Show more ▼</Anchor>
        </Group>
      </Paper>

      {/* Tabs and Vendor Section */}
      <Paper withBorder p="lg" radius="md" style={{ backgroundColor: 'white' }}>
        <Group mb="md">
          <Text fw={500}>Users</Text>
          <Text fw={500}>Billing</Text>
          <Text fw={500}>Activities</Text>
          <Text fw={500}>Settings</Text>
          <Text fw={500}>Vendor Information</Text>
          <Text fw={500} color="blue">+ 3 more Tabs ▼</Text>
        </Group>

        <Box>
          <Text size="sm" mb="md">Vendor</Text>
          <Select
            value="Adobe"
            data={['Adobe']}
            style={{ width: '200px' }}
            mb="lg"
          />

          <Group justify="center" style={{ 
            minHeight: '200px',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Box style={{ 
              width: '80px', 
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <rect width="60" height="60" fill="#FA0F00"/>
                <path d="M15 45L25 15h10L45 45h-8l-2-6H25l-2 6h-8zm12-12h6l-3-9-3 9z" fill="white"/>
              </svg>
            </Box>
            <Text color="dimmed" style={{ textAlign: 'center' }}>
              There is no Adobe company profile linked to this account.
            </Text>
            <Button 
              variant="outline" 
              onClick={onAddAdditionalInfo}
              leftSection={<IconPlus size={16} />}
            >
              Add Additional Information
            </Button>
          </Group>
        </Box>
      </Paper>
    </Stack>
  );
};

export default MarketplaceInterface; 