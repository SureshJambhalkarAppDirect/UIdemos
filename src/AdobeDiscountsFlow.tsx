import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Group, 
  Button, 
  Text, 
  Stack, 
  Card, 
  Title,
  ActionIcon,
  Menu,
  Image,
  Flex,
  Divider,
  TextInput,
  Select,
  Table,
  Badge,
  Pagination,
  Checkbox
} from '@mantine/core';

import { IconDots, IconSearch, IconFilter, IconMaximize, IconList, IconChevronDown } from '@tabler/icons-react';
import AppDirectHeader from './AppDirectHeader';
import AppDirectSecondaryNav from './AppDirectSecondaryNav';

const AdobeDiscountsFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'main' | 'discounts' | 'discounts-listing'>('main');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [contractFilter, setContractFilter] = useState('Show all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [createdDiscounts, setCreatedDiscounts] = useState<any[]>([]);

  const vendors = [
    { name: 'Google', logo: 'G', color: '#4285f4', status: 'active' as const, actionType: 'edit' as const },
    { name: 'Microsoft', logo: '⊞', color: '#00a1f1', status: 'active' as const, actionType: 'configure' as const },
    { name: 'Adobe', logo: 'A', color: '#ff0000', status: 'active' as const, actionType: 'edit' as const },
    { name: 'Cisco', logo: 'C', color: '#1ba0d7', status: 'active' as const, actionType: 'configure' as const },
    { name: 'Dropbox', logo: 'D', color: '#0061ff', status: 'active' as const, actionType: 'edit' as const },
    { name: 'Zoom', logo: 'Z', color: '#2d8cff', status: 'active' as const, actionType: 'edit' as const },
    { name: 'Amazon Web Services', logo: 'AWS', color: '#ff9900', status: 'active' as const, actionType: 'edit' as const }
  ];

  // Sample data for the discounts table (now stateful)
  const [discountData, setDiscountData] = useState([
    {
      code: "ADOBE_CREATIVE_2024",
      autoApply: "Yes",
      description: "Creative Cloud Team Discount",
      startDate: "2024-01-01",
      expirationDate: "2024-12-31", 
      nbBillingCycles: "12",
      redemptionRestriction: "None",
      maxRedemptions: "100",
      retainable: "Yes",
      appdirectShare: "15%",
      vendorShare: "70%",
      partnerShare: "15%",
      discountType: "Percentage",
      discount: "15%",
      editionPricingUuid: "uuid-ep-001",
      editionUuid: "uuid-ed-001",
      applicationUuid: "uuid-app-001",
      unit: "User",
      minUnit: "5",
      maxUnit: "1000"
    },
    {
      code: "ADOBE_ACROBAT_BULK_LICENSE_2024_ENTERPRISE",
      autoApply: "No", 
      description: "Acrobat Pro Bulk License for Enterprise Customers",
      startDate: "2024-02-15",
      expirationDate: "2024-11-30",
      nbBillingCycles: "1",
      redemptionRestriction: "Enterprise Only",
      maxRedemptions: "50",
      retainable: "No",
      appdirectShare: "10%",
      vendorShare: "80%",
      partnerShare: "10%",
      discountType: "Fixed",
      discount: "$25",
      editionPricingUuid: "uuid-ep-002",
      editionUuid: "uuid-ed-002",
      applicationUuid: "uuid-app-002",
      unit: "License",
      minUnit: "10",
      maxUnit: "500"
    }
  ]);

  // Handle removing selected rows
  const handleRemoveSelected = () => {
    const newData = discountData.filter((_, index) => !selectedRows.has(index));
    setDiscountData(newData);
    setSelectedRows(new Set()); // Clear selection
  };

  // Handle create discounts
  const handleCreateDiscounts = () => {
    // Convert selected rows to created discounts
    const newDiscounts = discountData
      .filter((_, index) => selectedRows.size === 0 || selectedRows.has(index))
      .map(discount => ({
        code: discount.code,
        application: discount.description,
        redemptions: parseInt(discount.maxRedemptions || '0'),
        startDate: discount.startDate,
        endDate: discount.expirationDate,
        discount: discount.discount
      }));
    
    setCreatedDiscounts(prev => [...prev, ...newDiscounts]);
    setShowSuccessMessage(true);
    
    // Redirect after showing success message
    setTimeout(() => {
      setCurrentView('discounts-listing');
      setShowSuccessMessage(false);
    }, 2000);
  };

  // Handle cancel
  const handleCancel = () => {
    setCurrentView('main');
  };

  // Settings Sidebar Component
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
          { label: 'Migration', active: false }
        ]
      }
    ];

    return (
      <Box 
        bg="#f5f5f5" 
        style={{ 
          width: '280px', 
          minWidth: '280px',
          height: 'calc(100vh - 108px)', // Account for header + secondary nav
          borderRight: '1px solid #e5e7eb',
          padding: '16px 0',
          overflowY: 'auto',
          position: 'sticky',
          top: 0
        }}
      >
        <Stack gap="lg" px="md">
          {menuSections.map((section, sectionIndex) => (
            <Stack key={sectionIndex} gap="xs">
              <Text size="xs" fw={600} c="#6b7280" tt="uppercase" px="sm">
                {section.title}
              </Text>
              <Stack gap={2}>
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="subtle"
                    justify="flex-start"
                    size="sm"
                    color={item.active ? 'white' : 'gray'}
                    bg={item.active ? '#0891b2' : 'transparent'}
                    styles={{
                      root: {
                        height: '36px',
                        borderRadius: '4px',
                        padding: '0 12px',
                        '&:hover': {
                          backgroundColor: item.active ? '#0891b2' : '#e5e7eb'
                        }
                      },
                      label: {
                        fontSize: '14px',
                        fontWeight: item.active ? 600 : 400,
                        color: item.active ? 'white' : '#374151'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  };

  // Catalog Sidebar Component
  const CatalogSidebar = () => {
    const sections = [
      {
        title: 'CATALOG',
        items: [
          { label: 'Production Catalog', active: false },
          { label: 'Staging Catalog', active: false },
          { label: 'Product Uploader', active: false }
        ]
      },
      {
        title: 'PRICE MANAGEMENT', 
        items: [
          { label: 'Price Books', active: false },
          { label: 'Discounts', active: true }
        ]
      },
      {
        title: 'PROMOTIONS',
        items: [
          { label: 'Bundles', active: false },
          { label: 'Promotional Products', active: false },
          { label: 'Merchandising Options', active: false }
        ]
      },
      {
        title: 'GROUPS',
        items: [
          { label: 'Product Groups', active: false },
          { label: 'Segments', active: false }
        ]
      },
      {
        title: 'PRODUCT CONTENT',
        items: [
          { label: 'Media Sources', active: false },
          { label: 'Featured Customers', active: false }
        ]
      }
    ];

    return (
      <Box 
        bg="#f5f5f5" 
        style={{ 
          width: '280px', 
          minWidth: '280px',
          height: 'calc(100vh - 108px)',
          borderRight: '1px solid #e5e7eb',
          padding: '16px 0',
          overflowY: 'auto',
          position: 'sticky',
          top: 0
        }}
      >
        <Stack gap="lg" px="md">
          {sections.map((section, sectionIndex) => (
            <Stack key={sectionIndex} gap="xs">
              <Text size="xs" fw={600} c="#6b7280" tt="uppercase" px="sm">
                {section.title}
              </Text>
              <Stack gap={2}>
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="subtle"
                    justify="flex-start"
                    size="sm"
                    color={item.active ? 'white' : 'gray'}
                    bg={item.active ? '#0891b2' : 'transparent'}
                    styles={{
                      root: {
                        height: '36px',
                        borderRadius: '4px',
                        padding: '0 12px',
                        '&:hover': {
                          backgroundColor: item.active ? '#0891b2' : '#e5e7eb'
                        }
                      },
                      label: {
                        fontSize: '14px',
                        fontWeight: item.active ? 600 : 400,
                        color: item.active ? 'white' : '#374151'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  };

  // Vendor Integration Card Component
  const VendorCard = ({ 
    vendor, 
    status, 
    actionType 
  }: { 
    vendor: { name: string; logo: string; color: string }; 
    status: 'active' | 'inactive';
    actionType: 'edit' | 'configure';
  }) => {
    return (
      <Card 
        withBorder 
        radius="md" 
        style={{ 
          backgroundColor: 'white',
          border: '1px solid #e5e7eb'
        }}
      >
        <Group justify="space-between" align="center" p="md">
          <Group align="center" gap="md">
            {/* Vendor Logo */}
            <Box
              style={{
                width: 40,
                height: 40,
                borderRadius: '4px',
                backgroundColor: vendor.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 700
              }}
            >
              {vendor.logo}
            </Box>
            
            {/* Vendor Name and Status */}
            <Group align="center" gap="sm">
              <Text fw={500} size="md" c="#374151">
                {vendor.name}
              </Text>
              {status === 'active' && (
                <Box
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#22c55e'
                  }}
                />
              )}
            </Group>
          </Group>

          {/* Action Buttons */}
          <Group gap="sm">
            <Button
              variant={actionType === 'configure' ? 'filled' : 'outline'}
              color={actionType === 'configure' ? 'teal' : 'gray'}
              size="sm"
              styles={{
                root: {
                  backgroundColor: actionType === 'configure' ? '#0891b2' : 'white',
                  borderColor: actionType === 'configure' ? '#0891b2' : '#d1d5db',
                  color: actionType === 'configure' ? 'white' : '#374151',
                  '&:hover': {
                    backgroundColor: actionType === 'configure' ? '#0891b2' : '#f3f4f6'
                  }
                }
              }}
            >
              {actionType === 'configure' ? 'Configure' : 'Edit'}
            </Button>
            
            <Menu shadow="md" width={180}>
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="sm">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown
                styles={{
                  dropdown: {
                    padding: 0
                  }
                }}
              >
                <Menu.Item
                  styles={{
                    item: {
                      padding: '8px 16px',
                      fontSize: '14px',
                      '&:hover': {
                        backgroundColor: '#0891b2',
                        color: 'white'
                      }
                    }
                  }}
                >
                  Notify users
                </Menu.Item>
                <Menu.Item
                  styles={{
                    item: {
                      padding: '8px 16px',
                      fontSize: '14px',
                      '&:hover': {
                        backgroundColor: '#0891b2',
                        color: 'white'
                      }
                    }
                  }}
                >
                  Check eligibility
                </Menu.Item>
                <Menu.Item
                  styles={{
                    item: {
                      padding: '8px 16px',
                      fontSize: '14px',
                      '&:hover': {
                        backgroundColor: '#0891b2',
                        color: 'white'
                      }
                    }
                  }}
                >
                  Generate migration files
                </Menu.Item>
                <Menu.Item
                  styles={{
                    item: {
                      padding: '8px 16px',
                      fontSize: '14px',
                      '&:hover': {
                        backgroundColor: '#0891b2',
                        color: 'white'
                      }
                    }
                  }}
                >
                  Transfer Reseller
                </Menu.Item>
                <Menu.Item
                  styles={{
                    item: {
                      padding: '8px 16px',
                      fontSize: '14px',
                      '&:hover': {
                        backgroundColor: '#0891b2',
                        color: 'white'
                      }
                    }
                  }}
                  onClick={() => setCurrentView('discounts')}
                >
                  Get Discounts
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Card>
    );
  };

  const renderMainContent = () => {
    if (currentView === 'main') {
      return (
        <>
          {/* Page Header */}
          <Title order={1} size="1.5rem" mb="lg" fw={600} c="#374151">
            Vendor Integrations
          </Title>
          
          {/* Help Section */}
          <Card
            withBorder={false}
            radius="md"
            mb="xl"
            style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd'
            }}
          >
            <Group justify="space-between" align="flex-start" p="md">
              <Box style={{ flex: 1 }}>
                <Text fw={600} size="md" mb="xs" c="#0369a1">
                  Need help connecting with these leading software vendors?
                </Text>
                <Text size="sm" c="#0369a1">
                  Reach out to us if you want to partner with any of these vendors below. We can help make introductions.
                </Text>
              </Box>
              <Button
                bg="#0891b2"
                size="sm"
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: '#0891b2'
                    }
                  }
                }}
              >
                Contact Us
              </Button>
            </Group>
          </Card>
          
          {/* Vendor Cards */}
          <Stack gap="md">
            {vendors.map((vendor, index) => (
              <VendorCard
                key={index}
                vendor={vendor}
                status={vendor.status}
                actionType={vendor.actionType}
              />
            ))}
          </Stack>
        </>
      );
    }

    if (currentView === 'discounts') {
      return (
        <>
          {/* Back Button */}
          <Group align="center" gap="xs" mb="lg" style={{ cursor: 'pointer' }} onClick={() => setCurrentView('main')}>
            <Text size="sm" c="#6b7280">
              &lt; Back
            </Text>
          </Group>
          
          {/* Page Header */}
          <Title order={1} size="1.5rem" mb="sm" fw={600} c="#374151">
            Get Discounts
          </Title>
          
          {/* Sub-heading */}
          <Text size="sm" c="#6b7280" mb="xl">
            Access and manage discount opportunities for your Adobe integrations and partnerships.
          </Text>
          
          {/* Combined Filters, Search and Data Table */}
          <Card withBorder radius="md" style={{ backgroundColor: 'white', width: '100%' }}>
            {/* Hidden Filters and Search Section */}
            <div style={{ display: 'none' }}>
              <Stack gap="md" p="md">
                <Flex justify="space-between" align="flex-end" mb="xs">
                  <Group gap="md" style={{ flex: 1 }}>
                    <Box style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                      <TextInput
                        placeholder="Search by discount code or description"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.currentTarget.value)}
                        leftSection={<IconSearch size={16} />}
                        size="sm"
                        styles={{
                          input: { 
                            height: 36,
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db'
                          }
                        }}
                      />
                    </Box>
                    <ActionIcon 
                      variant={showFilters ? "filled" : "outline"} 
                      size={36} 
                      color={showFilters ? "blue" : "gray"}
                      onClick={() => setShowFilters(!showFilters)}
                      style={{
                        backgroundColor: showFilters ? '#228be6' : 'transparent',
                        color: showFilters ? 'white' : '#6b7280'
                      }}
                    >
                      <IconFilter size={16} />
                    </ActionIcon>
                  </Group>
                  
                  <Group gap="sm">
                    <ActionIcon variant="outline" size={36} color="gray">
                      <IconMaximize size={16} />
                    </ActionIcon>
                    <ActionIcon variant="outline" size={36} color="gray">
                      <IconList size={16} />
                    </ActionIcon>
                  </Group>
                </Flex>
              </Stack>
            </div>
            
            {/* Bulk Selection Bar */}
            {selectedRows.size > 0 && (
              <Box 
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Group gap="md">
                  <ActionIcon 
                    variant="transparent" 
                    color="white"
                    onClick={() => setSelectedRows(new Set())}
                  >
                    <Text size="lg" c="white">×</Text>
                  </ActionIcon>
                  <Button 
                    variant="outline" 
                    size="sm"
                    color="white"
                    onClick={handleRemoveSelected}
                    styles={{
                      root: {
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }
                    }}
                  >
                    Remove
                  </Button>
                  <Text size="sm" c="white">
                    {selectedRows.size} selected
                  </Text>
                </Group>
              </Box>
            )}
            
            {/* Data Table Section */}
            <Box 
              style={{ 
                overflowX: 'auto',
                overflowY: 'visible',
                maxWidth: '100%',
                width: '100%'
              }}
            >
              <Table striped highlightOnHover style={{ minWidth: '2400px', tableLayout: 'fixed' }}>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '50px' }}>
                      <Checkbox 
                        onChange={(e) => {
                          if (e.currentTarget.checked) {
                            setSelectedRows(new Set(discountData.map((_, index) => index)));
                          } else {
                            setSelectedRows(new Set());
                          }
                        }}
                        checked={selectedRows.size === discountData.length && discountData.length > 0}
                        style={{ cursor: 'pointer' }}
                      />
                    </Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '140px' }}>Code</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '100px' }}>Auto Apply</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '200px' }}>Description</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '120px' }}>Start Date</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '120px' }}>Expiration Date</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '130px' }}>Nb Billing Cycles</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '150px' }}>Redemption Restriction</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '130px' }}>Max Redemptions</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '100px' }}>Retainable</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '120px' }}>Appdirect Share</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '110px' }}>Vendor Share</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '110px' }}>Partner Share</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '120px' }}>Discount Type</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '100px' }}>Discount</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '150px' }}>Edition Pricing Uuid</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '120px' }}>Edition Uuid</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '140px' }}>Application Uuid</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '80px' }}>Unit</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '80px' }}>Min Unit</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '80px' }}>Max Unit</Table.Th>
                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '50px' }}>
                      <IconDots size={16} />
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {discountData.map((row, index) => (
                    <Table.Tr key={index} style={{
                      backgroundColor: selectedRows.has(index) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                    }}>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                        <Checkbox 
                          checked={selectedRows.has(index)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedRows);
                            if (e.currentTarget.checked) {
                              newSelected.add(index);
                            } else {
                              newSelected.delete(index);
                            }
                            setSelectedRows(newSelected);
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </Table.Td>
                      <Table.Td style={{ 
                        fontSize: '14px', 
                        color: '#374151',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                        lineHeight: '1.4'
                      }}>
                        {row.code}
                      </Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                        <Badge 
                          variant="outline" 
                          color={row.autoApply === 'Yes' ? 'green' : 'gray'}
                          size="xs"
                        >
                          {row.autoApply}
                        </Badge>
                      </Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.description}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.startDate}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.expirationDate}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.nbBillingCycles}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.redemptionRestriction}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.maxRedemptions}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.retainable}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.appdirectShare}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.vendorShare}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.partnerShare}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.discountType}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>{row.discount}</Table.Td>
                      <Table.Td style={{ 
                        fontSize: '14px', 
                        color: '#374151',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}>
                        {row.editionPricingUuid}
                      </Table.Td>
                      <Table.Td style={{ 
                        fontSize: '14px', 
                        color: '#374151',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}>
                        {row.editionUuid}
                      </Table.Td>
                      <Table.Td style={{ 
                        fontSize: '14px', 
                        color: '#374151',
                        wordWrap: 'break-word',
                        whiteSpace: 'normal'
                      }}>
                        {row.applicationUuid}
                      </Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.unit}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.minUnit}</Table.Td>
                      <Table.Td style={{ fontSize: '14px', color: '#374151' }}>{row.maxUnit}</Table.Td>
                      <Table.Td>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
            
            {/* Pagination */}
            <Group justify="space-between" p="md" style={{ borderTop: '1px solid #e5e7eb' }}>
              <Group gap="sm">
                <Text size="sm" c="dimmed">Rows per page</Text>
                <Select
                  data={['10', '25', '50', '100']}
                  defaultValue="10"
                  size="xs"
                  styles={{ input: { width: 70 } }}
                />
              </Group>
              
              <Group gap="md">
                <Text size="sm" c="dimmed">1-{discountData.length} of {discountData.length}</Text>
                <Pagination total={1} size="sm" />
              </Group>
            </Group>
          </Card>
          
          {/* Success Message */}
          {showSuccessMessage && (
            <Box
              style={{
                backgroundColor: '#d1fae5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Group gap="sm">
                <Text size="sm" c="#065f46" fw={500}>
                  Successfully started generating the discounts and redirecting to the history page
                </Text>
              </Group>
              <ActionIcon 
                variant="transparent" 
                color="green"
                size="sm"
                onClick={() => setShowSuccessMessage(false)}
              >
                <Text size="lg" c="#065f46">×</Text>
              </ActionIcon>
            </Box>
          )}

          {/* Action Buttons */}
          <Group justify="flex-end" mt="lg" gap="sm">
            <Button 
              variant="outline" 
              color="gray"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              bg="#0891b2"
              onClick={handleCreateDiscounts}
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: '#0891b2'
                  }
                }
              }}
            >
              Create Discounts
            </Button>
          </Group>
        </>
      );
    }

    if (currentView === 'discounts-listing') {
      return (
        <>
          {/* Discounts Listing Page */}
          <Group justify="space-between" align="center" mb="lg">
            <Title order={1} size="1.5rem" fw={600} c="#374151">
              Discounts
            </Title>
            <Button
              bg="#0891b2"
              leftSection={<Text size="lg">+</Text>}
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: '#0891b2'
                  }
                }
              }}
            >
              Add Discount
            </Button>
          </Group>

          {/* Filters and Search */}
          <Group justify="space-between" align="center" mb="md">
            <Group gap="sm">
              <Button variant="outline" color="gray" size="sm">
                Show Filters
              </Button>
              <Button variant="outline" color="gray" size="sm" leftSection={<IconChevronDown size={16} />}>
                Download CSV
              </Button>
            </Group>
            
            <TextInput
              placeholder="Search"
              leftSection={<IconSearch size={16} />}
              size="sm"
              style={{ width: '300px' }}
              styles={{
                input: { 
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db'
                }
              }}
            />
          </Group>

          {/* Discounts Table */}
          <Card withBorder radius="md" style={{ backgroundColor: 'white', width: '100%' }}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                  <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>Code</Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>Application</Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>Redemptions</Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>Start date</Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>End date</Table.Th>
                  <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px' }}>Discount</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {/* Sample existing data */}
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>BLACK FRIDAY</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>Adobe Acrobat Pro for Teams (NA)</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>0</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10/01/25</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>11/22/25</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10.00</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>Adobe Acrobat Pro for Teams (NA)</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>0</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>07/01/25</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>07/30/25</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10.00</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>AZURE_SL_4DEC</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>Azure Plan</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>1</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>15%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>Azure_SL_10</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>Azure Plan</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>1</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10%</Table.Td>
                </Table.Tr>
                
                {/* Dynamic data from our created discounts */}
                {createdDiscounts.map((discount, index) => (
                  <Table.Tr key={`created-${index}`} style={{ backgroundColor: '#f0f9ff' }}>
                    <Table.Td style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>
                      {discount.code}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                      {discount.application}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                      {discount.redemptions}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                      {discount.startDate}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                      {discount.endDate}
                    </Table.Td>
                    <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                      {discount.discount}
                    </Table.Td>
                  </Table.Tr>
                ))}
                
                {/* More sample data */}
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>mu product sp</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>0</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>SP MU</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>0</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>MS10</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>NCE Microsoft 365 Business</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>0</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>WILSONFREE</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>1 of 1</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>100%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>ADOBE_TEST</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>2</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>100%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>86</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10/01/22</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>12/31/22</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>2020NCE</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>0</Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}></Table.Td>
                  <Table.Td style={{ fontSize: '14px', color: '#374151' }}>10%</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>
        </>
      );
    }

    return null;
  };

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Back to Home Navigation */}
      <Box style={{ backgroundColor: 'white', padding: '8px 16px', borderBottom: '1px solid #e0e0e0' }}>
        <Group>
          <Button onClick={() => navigate('/')} variant="outline" size="xs">
            🏠 Back to Home
          </Button>
        </Group>
      </Box>

      {/* AppDirect Header */}
      <AppDirectHeader />
      
      {/* Secondary Navigation */}
      <AppDirectSecondaryNav activeTab={currentView === 'discounts-listing' ? 'products' : 'settings'} />
      
      {/* Main Layout */}
      <Flex style={{ minHeight: 'calc(100vh - 108px)' }}>
        {/* Sidebar - Conditional */}
        {currentView === 'discounts-listing' ? <CatalogSidebar /> : <SettingsSidebar />}
        
        {/* Main Content Area */}
        <Box style={{ flex: 1, padding: '24px', backgroundColor: '#ffffff', minWidth: 0 }}>
          {renderMainContent()}
        </Box>
      </Flex>
    </Box>
  );
};

export default AdobeDiscountsFlow; 