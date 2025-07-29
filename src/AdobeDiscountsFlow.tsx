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
  Checkbox,
  Switch,
  NumberInput
} from '@mantine/core';

import { IconDots, IconSearch, IconFilter, IconMaximize, IconList, IconChevronDown, IconPencil, IconCheck, IconX, IconPlus, IconMinus } from '@tabler/icons-react';
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
  const [successMessageText, setSuccessMessageText] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');
  const [conflictingRows, setConflictingRows] = useState<Set<number>>(new Set());
  const [createdDiscounts, setCreatedDiscounts] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [savedDiscountCode, setSavedDiscountCode] = useState('');

  // All existing discounts (sample data + previously created)
  const existingDiscounts = [
    { code: 'BLACK FRIDAY', application: 'Adobe Acrobat Pro for Teams (NA)' },
    { code: '', application: 'Adobe Acrobat Pro for Teams (NA)' }, // Auto-apply discount
    { code: 'AZURE_SL_4DEC', application: 'Azure Plan' },
    { code: 'Azure_SL_10', application: 'Azure Plan' },
    { code: 'mu product sp', application: '' },
    ...createdDiscounts.map(d => ({ code: d.code, application: d.application }))
  ];

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
      nbBillingCycles: "1",
      redemptionRestriction: "None",
      maxRedemptions: "",
      retainable: "Yes",
      appdirectShare: "15%",
      vendorShare: "70%",
      partnerShare: "15%",
      discountType: "Percentage",
      discount: "10%",
      application: "Creative Cloud All Apps",
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
      maxRedemptions: "",
      retainable: "No",
      appdirectShare: "10%",
      vendorShare: "80%",
      partnerShare: "10%",
      discountType: "Fixed price",
      discount: "$25",
      application: "Adobe Acrobat Pro DC",
      editionPricingUuid: "uuid-ep-002",
      editionUuid: "uuid-ed-002",
      applicationUuid: "uuid-app-002",
      unit: "License",
      minUnit: "10",
      maxUnit: "500"
    },
    {
      code: "PHOTOSHOP_EDU_2024",
      autoApply: "No",
      description: "Photoshop Education Discount",
      startDate: "2024-03-01",
      expirationDate: "2024-08-31",
      nbBillingCycles: "1",
      redemptionRestriction: "Education Only",
      maxRedemptions: "",
      retainable: "Yes",
      appdirectShare: "12%",
      vendorShare: "75%",
      partnerShare: "13%",
      discountType: "Percentage",
      discount: "10%",
      application: "Adobe Photoshop",
      editionPricingUuid: "uuid-ep-003",
      editionUuid: "uuid-ed-003",
      applicationUuid: "uuid-app-003",
      unit: "User",
      minUnit: "1",
      maxUnit: "100"
    },
    {
      code: "ILLUSTRATOR_TEAM_BUNDLE",
      autoApply: "Yes",
      description: "Illustrator Team Bundle Discount",
      startDate: "2024-01-15",
      expirationDate: "2024-12-15",
      nbBillingCycles: "1",
      redemptionRestriction: "None",
      maxRedemptions: "",
      retainable: "Yes",
      appdirectShare: "15%",
      vendorShare: "70%",
      partnerShare: "15%",
      discountType: "Fixed price",
      discount: "$15",
      application: "Adobe Illustrator",
      editionPricingUuid: "uuid-ep-004",
      editionUuid: "uuid-ed-004",
      applicationUuid: "uuid-app-004",
      unit: "User",
      minUnit: "3",
      maxUnit: "50"
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
    // Convert selected rows to potential new discounts
    const selectedDiscounts = discountData
      .filter((_, index) => selectedRows.size === 0 || selectedRows.has(index))
      .map(discount => ({
        code: discount.code,
        application: discount.application,
        redemptions: parseInt(discount.maxRedemptions || '0'),
        startDate: discount.startDate,
        endDate: discount.expirationDate,
        discount: discount.discount,
        autoApply: discount.autoApply,
        discountType: discount.discountType
      }));

    // Check for duplicates within the selected discounts themselves
    const seenCombinations = new Set<string>();
    const internalDuplicates: Array<{discount: typeof selectedDiscounts[0], index: number}> = [];
    
    selectedDiscounts.forEach((discount, index) => {
      const combination = `${discount.code}|${discount.application}`;
      
      if (seenCombinations.has(combination)) {
        internalDuplicates.push({discount, index});
      } else {
        seenCombinations.add(combination);
      }
    });
    
    // Check for duplicates against ALL existing discounts (sample data + created)
    const externalConflicts: Array<{discount: typeof selectedDiscounts[0], index: number, existing: any}> = [];
    
    selectedDiscounts.forEach((discount, index) => {
      const conflict = existingDiscounts.find(existing => {
        // For auto-apply discounts, only check application
        if (discount.autoApply === 'Yes') {
          return existing.application === discount.application;
        }
        // For manual discounts, check code + application
        return existing.code === discount.code && existing.application === discount.application;
      });
      
      if (conflict) {
        externalConflicts.push({discount, index, existing: conflict});
      }
    });
    
    // Combine all conflicts
    const allConflicts = [...internalDuplicates, ...externalConflicts];
    
    if (allConflicts.length > 0) {
      // Mark conflicting rows for visual highlighting
      const conflictIndexes = new Set(allConflicts.map(c => c.index));
      setConflictingRows(conflictIndexes);
      
      // Generate specific error message
      const conflictDetails = allConflicts.slice(0, 3).map(conflict => {
        if ('existing' in conflict) {
          // External conflict
          return conflict.discount.autoApply === 'Yes' 
            ? `Auto-apply discount for ${conflict.discount.application} already exists`
            : `${conflict.discount.code} for ${conflict.discount.application} already exists`;
        } else {
          // Internal duplicate
          return `${conflict.discount.code} for ${conflict.discount.application} selected multiple times`;
        }
      });
      
      const totalConflicts = allConflicts.length;
      const showMore = totalConflicts > 3 ? ` (+${totalConflicts - 3} more)` : '';
      
      setErrorMessageText(
        `${totalConflicts} conflict${totalConflicts > 1 ? 's' : ''} found:\n` +
        conflictDetails.join('\n') + showMore +
        '\n\nDeselect conflicting discounts to continue.'
      );
      
      setShowErrorMessage(true);
      
      // Hide error message after 8 seconds (longer for more complex message)
      setTimeout(() => {
        setShowErrorMessage(false);
        setConflictingRows(new Set()); // Clear visual highlights
      }, 8000);
      
      return; // Don't proceed with creation
    }
    
    // Clear any previous conflict highlights
    setConflictingRows(new Set());
    
    // All selected discounts are valid - proceed with creation
    setCreatedDiscounts(prev => [...prev, ...selectedDiscounts]);
    const messageText = selectedRows.size === 0 
      ? `Successfully started creating all ${selectedDiscounts.length} discount(s) and redirecting to the Discounts page.`
      : `Successfully started creating ${selectedDiscounts.length} discount(s) and redirecting to the Discounts page.`;
    setSuccessMessageText(messageText);
    setShowSuccessMessage(true);
    
    // Clear selected rows
    setSelectedRows(new Set());
    
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

  // Handle row editing
  const handleEditRow = (index: number) => {
    setEditingRow(index);
    setEditFormData({ 
      ...discountData[index],
      // Ensure defaults are set for editing
      maxRedemptions: discountData[index].maxRedemptions || '',
      discount: discountData[index].discount || (discountData[index].discountType === 'Fixed price' ? '$25' : '10%')
    });
  };

  const handleSaveEdit = () => {
    if (editingRow !== null) {
      const originalRow = discountData[editingRow];
      
      // Check if any editable fields actually changed
      const hasChanges = (
        originalRow.autoApply !== editFormData.autoApply ||
        originalRow.startDate !== editFormData.startDate ||
        originalRow.maxRedemptions !== editFormData.maxRedemptions ||
        originalRow.discount !== editFormData.discount
      );
      
      const newData = [...discountData];
      newData[editingRow] = editFormData;
      setDiscountData(newData);
      setEditingRow(null);
      setEditFormData({});
      
      // Only show success feedback if something actually changed
      if (hasChanges) {
        setSavedDiscountCode(editFormData.code);
        setShowEditSuccess(true);
        setTimeout(() => setShowEditSuccess(false), 3000);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditFormData({});
  };

  // Function to add a duplicate row for testing (triggered by cart icon)
  const handleAddTestDuplicate = () => {
    // Only work on the "Get Discounts" page
    if (currentView !== 'discounts') return;
    
    if (discountData.length > 0) {
      const lastRow = discountData[discountData.length - 1];
      
      // Generate random discount value
      const randomDiscount = lastRow.discountType === 'Fixed price' 
        ? `$${(Math.random() * 50 + 10).toFixed(0)}` // Random $10-$60
        : `${(Math.random() * 30 + 5).toFixed(0)}%`; // Random 5%-35%
      
      // Create duplicate with random discount
      const duplicateRow = {
        ...lastRow,
        discount: randomDiscount
      };
      
      setDiscountData(prev => [...prev, duplicateRow]);
    }
  };

  const handleEditFieldChange = (field: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle keyboard shortcuts and click outside
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingRow !== null) {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          handleSaveEdit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleCancelEdit();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (editingRow !== null) {
        const target = e.target as HTMLElement;
        
        // Find the closest table row
        const closestRow = target.closest('tr');
        const editingRowElement = document.querySelector(`tr[data-editing-row="${editingRow}"]`);
        
        // If we didn't click on the editing row or its children, auto-save (Apple-style UX)
        if (closestRow !== editingRowElement) {
          handleSaveEdit();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingRow, editFormData, handleSaveEdit, handleCancelEdit]);

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
            Access and create Adobe discounts.
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
            
            {/* Editing Help Text */}
            {editingRow !== null && (
              <Box
                style={{
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '16px'
                }}
              >
                <Text size="xs" c="#0369a1">
                  ✏️ <strong>Editing {discountData[editingRow]?.code}:</strong> Press <kbd style={{ backgroundColor: '#e0e7ff', padding: '2px 4px', borderRadius: '3px', fontSize: '10px' }}>⌘ + Enter</kbd> to save, <kbd style={{ backgroundColor: '#e0e7ff', padding: '2px 4px', borderRadius: '3px', fontSize: '10px' }}>Esc</kbd> to cancel, or <kbd style={{ backgroundColor: '#e0e7ff', padding: '2px 4px', borderRadius: '3px', fontSize: '10px' }}>Tab</kbd> to navigate between fields
                </Text>
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
                                <Table striped highlightOnHover style={{ minWidth: '1340px', tableLayout: 'fixed' }}>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f8f9fa' }}>
                                                                    <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '40px' }}>
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
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '200px' }}>Code</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '100px' }}>Auto Apply</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '200px' }}>Description</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '140px' }}>Start Date</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '140px' }}>Expiration Date</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '130px', display: 'none' }}># of Billing Cycles</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '100px' }}>Max Redemptions</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '120px' }}>Discount Type</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '100px' }}>Discount</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', width: '200px' }}>Application</Table.Th>
                        
                        {/* Hidden Columns */}
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '150px', display: 'none' }}>Redemption Restriction</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '100px', display: 'none' }}>Retainable</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '120px', display: 'none' }}>Appdirect Share</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '110px', display: 'none' }}>Vendor Share</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '110px', display: 'none' }}>Partner Share</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '150px', display: 'none' }}>Edition Pricing Uuid</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '120px', display: 'none' }}>Edition Uuid</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '140px', display: 'none' }}>Application Uuid</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '80px', display: 'none' }}>Unit</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '80px', display: 'none' }}>Min Unit</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '80px', display: 'none' }}>Max Unit</Table.Th>
                        <Table.Th style={{ fontWeight: 600, color: '#374151', fontSize: '14px', minWidth: '50px', display: 'none' }}>
                          <IconDots size={16} />
                        </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {discountData.map((row, index) => {
                    const isEditing = editingRow === index;
                    const isSelected = selectedRows.has(index);
                    const isHovered = hoveredRow === index;
                    
                    return (
                      <Table.Tr 
                        key={index} 
                        data-editing-row={isEditing ? index : undefined}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          backgroundColor: conflictingRows.has(index)
                            ? '#fef2f2' // Light red for conflicts
                            : isSelected 
                              ? 'rgba(59, 130, 246, 0.1)' 
                              : isEditing 
                              ? 'rgba(8, 145, 178, 0.05)'
                              : 'transparent',
                          borderLeft: conflictingRows.has(index) 
                            ? '3px solid #dc2626' // Red border for conflicts
                            : isEditing ? '3px solid #0891b2' : '3px solid transparent',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                          <Checkbox 
                            checked={isSelected}
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
                        
                        {/* Auto Apply - Editable */}
                        <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                          {isEditing ? (
                            <Switch
                              checked={editFormData.autoApply === 'Yes'}
                              onChange={(e) => handleEditFieldChange('autoApply', e.currentTarget.checked ? 'Yes' : 'No')}
                              size="sm"
                              color="teal"
                            />
                          ) : (
                            <Box
                              style={{
                                cursor: 'pointer',
                                borderBottom: isHovered ? '1px dotted #0891b2' : '1px dotted transparent',
                                transition: 'border-color 0.2s ease',
                                display: 'inline-block'
                              }}
                              onClick={() => handleEditRow(index)}
                            >
                              {row.autoApply}
                            </Box>
                          )}
                        </Table.Td>
                        
                        <Table.Td style={{ 
                          fontSize: '14px', 
                          color: '#374151',
                          wordWrap: 'break-word',
                          whiteSpace: 'normal',
                          lineHeight: '1.4'
                        }}>
                          {row.description}
                        </Table.Td>
                        
                        {/* Start Date - Editable with validation */}
                        <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                          {isEditing ? (
                            <TextInput
                              type="date"
                              value={editFormData.startDate || ''}
                              onChange={(e) => handleEditFieldChange('startDate', e.currentTarget.value)}
                              min={row.startDate} // Can't choose date before original
                              size="xs"
                              styles={{
                                input: { 
                                  fontSize: '14px',
                                  padding: '4px 8px'
                                }
                              }}
                            />
                          ) : (
                            <Box
                              style={{
                                cursor: 'pointer',
                                borderBottom: isHovered ? '1px dotted #0891b2' : '1px dotted transparent',
                                transition: 'border-color 0.2s ease'
                              }}
                              onClick={() => handleEditRow(index)}
                            >
                              {row.startDate}
                            </Box>
                          )}
                        </Table.Td>
                        
                        <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                          {row.expirationDate}
                        </Table.Td>
                        
                        {/* Billing Cycles - Non-editable */}
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>
                          {row.nbBillingCycles}
                        </Table.Td>
                        
                        {/* Max Redemptions - Editable */}
                        <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                          {isEditing ? (
                            <TextInput
                              type="number"
                              value={editFormData.maxRedemptions === 0 ? '' : editFormData.maxRedemptions || ''}
                              onChange={(e) => {
                                const value = e.currentTarget.value;
                                // Only allow positive whole numbers, treat empty/0 as blank
                                if (value === '' || (Number(value) >= 0 && Number.isInteger(Number(value)))) {
                                  handleEditFieldChange('maxRedemptions', value === '' || value === '0' ? '' : value);
                                }
                              }}
                              min="0"
                              step="1"
                              size="xs"
                              placeholder="Leave blank"
                              styles={{
                                input: { 
                                  fontSize: '14px',
                                  padding: '4px 8px'
                                }
                              }}
                            />
                          ) : (
                            <Box
                              style={{
                                cursor: 'pointer',
                                borderBottom: isHovered ? '1px dotted #0891b2' : '1px dotted transparent',
                                transition: 'border-color 0.2s ease'
                              }}
                              onClick={() => handleEditRow(index)}
                            >
                              {row.maxRedemptions && row.maxRedemptions !== '0' ? row.maxRedemptions : '-'}
                            </Box>
                          )}
                        </Table.Td>

                        {/* Discount Type - Non-editable */}
                        <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                          {row.discountType}
                        </Table.Td>
                        
                        {/* Discount - Editable with smart placeholder */}
                        <Table.Td style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>
                          {isEditing ? (
                            <TextInput
                              value={editFormData.discount || (row.discountType === 'Fixed price' ? '$25' : '10%')}
                              onChange={(e) => handleEditFieldChange('discount', e.currentTarget.value)}
                              size="xs"
                              placeholder={row.discountType === 'Fixed price' ? '$25' : '10%'}
                              styles={{
                                input: { 
                                  fontSize: '14px',
                                  padding: '4px 8px',
                                  fontWeight: 600
                                }
                              }}
                            />
                          ) : (
                            <Box
                              style={{
                                cursor: 'pointer',
                                borderBottom: isHovered ? '1px dotted #0891b2' : '1px dotted transparent',
                                transition: 'border-color 0.2s ease'
                              }}
                              onClick={() => handleEditRow(index)}
                            >
                              {row.discount}
                            </Box>
                          )}
                        </Table.Td>

                        {/* Application */}
                        <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                          {row.application}
                        </Table.Td>
                        
                        {/* Hidden Columns */}
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>{row.redemptionRestriction}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>{row.retainable}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>{row.appdirectShare}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>{row.vendorShare}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>{row.partnerShare}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', wordWrap: 'break-word', whiteSpace: 'normal', display: 'none' }}>{row.editionPricingUuid}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', wordWrap: 'break-word', whiteSpace: 'normal', display: 'none' }}>{row.editionUuid}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', wordWrap: 'break-word', whiteSpace: 'normal', display: 'none' }}>{row.applicationUuid}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>{row.unit}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>{row.minUnit}</Table.Td>
                        <Table.Td style={{ fontSize: '14px', color: '#374151', display: 'none' }}>{row.maxUnit}</Table.Td>
                        
                        {/* Hidden Dots Column */}
                        <Table.Td style={{ display: 'none' }}>
                          <ActionIcon variant="subtle" color="gray" size="sm">
                            <IconDots size={16} />
                          </ActionIcon>
                        </Table.Td>
                        
                        {/* Actions Column */}
                        <Table.Td style={{ position: 'relative' }}>
                          {isEditing ? (
                            <Group gap="xs">
                              <ActionIcon
                                variant="subtle"
                                color="teal"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveEdit();
                                }}
                                style={{
                                  transition: 'transform 0.1s ease',
                                  '&:active': { transform: 'scale(0.97)' }
                                }}
                              >
                                <IconCheck size={16} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCancelEdit();
                                }}
                                style={{
                                  transition: 'transform 0.1s ease',
                                  '&:active': { transform: 'scale(0.97)' }
                                }}
                              >
                                <IconX size={16} />
                              </ActionIcon>
                            </Group>
                          ) : (
                            <ActionIcon 
                              variant="subtle" 
                              color="gray" 
                              size="sm"
                              style={{
                                opacity: isHovered ? 1 : 0.3,
                                transition: 'opacity 0.2s ease'
                              }}
                              onClick={() => handleEditRow(index)}
                            >
                              <IconPencil size={14} />
                            </ActionIcon>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
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
          
                        {/* Success Messages */}
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
{successMessageText}
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

              {/* Error Messages */}
              {showErrorMessage && (
                <Box
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Group gap="sm" align="flex-start">
                    <IconX size={16} color="#dc2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <Text size="sm" c="#dc2626" fw={500} style={{ whiteSpace: 'pre-line' }}>
                      {errorMessageText}
                    </Text>
                  </Group>
                  <ActionIcon 
                    variant="transparent" 
                    color="red"
                    size="sm"
                    onClick={() => setShowErrorMessage(false)}
                  >
                    <Text size="lg" c="#dc2626">×</Text>
                  </ActionIcon>
                </Box>
              )}

              {/* Edit Success Message */}
              {showEditSuccess && (
                <Box
                  style={{
                    backgroundColor: '#d1fae5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Group gap="sm">
                    <IconCheck size={16} color="#065f46" />
                    <Text size="sm" c="#065f46" fw={500}>
                      Discount {savedDiscountCode} updated successfully
                    </Text>
                  </Group>
                  <ActionIcon 
                    variant="transparent" 
                    color="green"
                    size="sm"
                    onClick={() => setShowEditSuccess(false)}
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
            
            {conflictingRows.size > 0 && (
              <Button 
                variant="outline" 
                color="red"
                onClick={() => {
                  // Remove conflicting rows from selection
                  const newSelection = new Set(selectedRows);
                  conflictingRows.forEach(index => newSelection.delete(index));
                  setSelectedRows(newSelection);
                  setConflictingRows(new Set());
                  setShowErrorMessage(false);
                }}
              >
                Remove {conflictingRows.size} Conflict{conflictingRows.size > 1 ? 's' : ''}
              </Button>
            )}
            
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
                {/* Dynamic data from our created discounts - shown at top */}
                {createdDiscounts.map((discount, index) => (
                  <Table.Tr key={`created-${index}`}>
                    <Table.Td style={{ fontSize: '14px', color: '#374151' }}>
                      {discount.autoApply === 'Yes' ? '' : discount.code}
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
                      {discount.discountType === 'Fixed price' 
                        ? (discount.discount.startsWith('$') 
                          ? parseFloat(discount.discount.substring(1)).toFixed(2) 
                          : parseFloat(discount.discount).toFixed(2))
                        : discount.discount
                      }
                    </Table.Td>
                  </Table.Tr>
                ))}
                
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
              <AppDirectHeader onCartClick={handleAddTestDuplicate} />
      
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