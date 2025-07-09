import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppShell, 
  Burger, 
  Group, 
  Box, 
  Tabs,
  Grid,
  NavLink,
  TextInput,
  ActionIcon,
  Menu,
  Avatar,
  UnstyledButton,
  Button,
  Stack,
  Text,
  Card,
  Badge,
  Container,
  Title,
  Paper,
  ThemeIcon,
  ScrollArea,
  Divider,
  SimpleGrid,
  Flex,
  Select,
  Anchor,
  Image
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconGridDots, 
  IconBell, 
  IconShoppingCart, 
  IconSearch,
  IconSettings,
  IconChevronDown,
  IconArrowLeft,
  IconStar,
  IconUsers,
  IconTrendingUp,
  IconDownload,
  IconEye,
  IconChartBar,
  IconCheck,
  IconPlus,
  IconCopy,
  IconChevronRight,
  IconBuilding,
  IconHome,
  IconReceipt,
  IconCalendar,
  IconChartLine,
  IconUser,
  IconCreditCard,
  IconFileInvoice,
  IconCoin,
  IconClipboard,
  IconActivity,
  IconDatabase,
  IconShield,
  IconMail,
  IconPhone,
  IconWorld,
  IconDots
} from '@tabler/icons-react';

// Mock Adobe product data
const adobeRecommendations = [
  {
    id: '1',
    name: 'Adobe Creative Cloud for Teams',
    category: 'Creative Suite',
    price: '$79.99/month',
    rating: 4.8,
    users: 1250,
    trend: '+15%',
    description: 'Complete creative suite with Photoshop, Illustrator, InDesign, and more.',
    features: ['20+ Creative Apps', 'Cloud Storage', 'Team Collaboration', 'Admin Console'],
    recommended: 'high',
    usage: 'High adoption in design teams'
  },
  {
    id: '2',
    name: 'Adobe Acrobat Pro DC',
    category: 'Document Management',
    price: '$24.99/month',
    rating: 4.6,
    users: 890,
    trend: '+8%',
    description: 'Create, edit, and sign PDFs. Work with documents anywhere.',
    features: ['PDF Creation', 'E-signatures', 'Form Creation', 'Mobile Access'],
    recommended: 'medium',
    usage: 'Growing usage in business operations'
  },
  {
    id: '3',
    name: 'Adobe Analytics',
    category: 'Analytics',
    price: 'Contact Sales',
    rating: 4.4,
    users: 340,
    trend: '+22%',
    description: 'Advanced web analytics and customer intelligence platform.',
    features: ['Real-time Analytics', 'Segmentation', 'Attribution', 'API Access'],
    recommended: 'high',
    usage: 'Recommended for data-driven teams'
  },
  {
    id: '4',
    name: 'Adobe Experience Manager',
    category: 'Content Management',
    price: 'Contact Sales',
    rating: 4.2,
    users: 120,
    trend: '+12%',
    description: 'Digital asset management and web content management system.',
    features: ['Asset Management', 'Content Creation', 'Multi-site Management', 'Personalization'],
    recommended: 'medium',
    usage: 'Ideal for large content operations'
  },
  {
    id: '5',
    name: 'Adobe Sign',
    category: 'E-signature',
    price: '$19.99/month',
    rating: 4.7,
    users: 670,
    trend: '+18%',
    description: 'Electronic signature solution for faster document workflows.',
    features: ['E-signatures', 'Workflow Automation', 'Mobile Signing', 'Integrations'],
    recommended: 'high',
    usage: 'High ROI for document workflows'
  },
  {
    id: '6',
    name: 'Adobe Marketo Engage',
    category: 'Marketing Automation',
    price: 'Contact Sales',
    rating: 4.3,
    users: 280,
    trend: '+10%',
    description: 'B2B marketing automation platform for lead management.',
    features: ['Lead Scoring', 'Email Marketing', 'Campaign Management', 'ROI Reporting'],
    recommended: 'medium',
    usage: 'Perfect for B2B marketing teams'
  }
];

const AppDirectHeader = () => (
  <Group h="100%" px="md" justify="space-between" style={{ backgroundColor: '#3c3c3c', color: 'white' }}>
    <Group>
      <Text size="lg" fw={600} c="white">AppDirect</Text>
      <Group gap="xs" ml="xl">
        <ActionIcon variant="subtle" color="gray" size="sm">
          <IconGridDots size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray" size="sm">
          <IconChartBar size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray" size="sm">
          <IconBuilding size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray" size="sm">
          <IconShield size={16} />
        </ActionIcon>
      </Group>
    </Group>
    
    <Group>
      <Group gap="sm">
        <Text size="sm" c="white">Marketplace</Text>
        <IconChevronDown size={14} color="white" />
      </Group>
      <TextInput
        placeholder="Search..."
        size="sm"
        style={{ width: 200 }}
        leftSection={<IconSearch size={14} />}
        styles={{
          input: {
            backgroundColor: 'white',
            border: 'none'
          }
        }}
      />
      
      <Menu>
        <Menu.Target>
          <UnstyledButton>
            <Group gap="sm">
              <Text size="sm" c="white">Manage</Text>
              <IconChevronDown size={14} color="white" />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>Settings</Menu.Item>
          <Menu.Item>Billing</Menu.Item>
          <Menu.Item>Support</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      
      <Group gap="sm">
        <Text size="sm" c="white">Abdullah</Text>
        <IconChevronDown size={14} color="white" />
      </Group>
      
      <ActionIcon variant="subtle" color="gray" size="sm">
        <IconShoppingCart size={16} />
      </ActionIcon>
      <Text size="sm" c="white">Cart</Text>
    </Group>
  </Group>
);

const SecondaryNav = () => {
  const tabs = [
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'dashboard', label: 'Dashboard', active: true },
    { value: 'products', label: 'Products' },
    { value: 'settings', label: 'Settings' },
    { value: 'reports', label: 'Reports' },
    { value: 'theme-manager', label: 'Theme Manager' }
  ];
  
  return (
    <Box style={{ backgroundColor: '#f8f8f8', borderBottom: '1px solid #e5e7eb' }}>
      <Container size="xl">
        <Group gap={0}>
          {tabs.map(tab => (
            <Button
              key={tab.value}
              variant="subtle"
              color={tab.active ? 'blue' : 'gray'}
              style={{
                backgroundColor: 'transparent',
                color: tab.active ? '#0891b2' : '#6b7280',
                borderBottom: tab.active ? '2px solid #0891b2' : 'none',
                borderRadius: 0,
                fontWeight: tab.active ? 600 : 400
              }}
              px="md"
              py="sm"
            >
              {tab.label}
            </Button>
          ))}
        </Group>
      </Container>
    </Box>
  );
};

const Sidebar = () => {
  const sidebarItems = [
    {
      section: 'HOME',
      items: [
        { icon: IconHome, label: 'Overview' },
        { icon: IconUsers, label: 'Users' },
        { icon: IconBuilding, label: 'Companies', active: true },
        { icon: IconStar, label: 'Adobe Product Recommendations' },
        { icon: IconBuilding, label: 'Pending Companies' },
        { icon: IconUser, label: 'Leads' },
        { icon: IconChartLine, label: 'Opportunities' },
        { icon: IconPlus, label: 'Bulk Creation' },
        { icon: IconClipboard, label: 'Reviews & Questions' }
      ]
    },
    {
      section: 'BILLING',
      items: [
        { icon: IconReceipt, label: 'Orders' },
        { icon: IconFileInvoice, label: 'Invoices' },
        { icon: IconCreditCard, label: 'Payments' },
        { icon: IconClipboard, label: 'Quotes' },
        { icon: IconActivity, label: 'Metered Usage' }
      ]
    },
    {
      section: 'EVENTS',
      items: [
        { icon: IconCalendar, label: 'Event Logs' },
        { icon: IconDatabase, label: 'App Usage Logs' },
        { icon: IconShield, label: 'Admin Logs' }
      ]
    },
    {
      section: 'ADMIN TASKS',
      items: [
        { icon: IconSettings, label: 'Microsoft' },
        { icon: IconSettings, label: 'Adobe' }
      ]
    }
  ];

  return (
    <Box style={{ backgroundColor: '#f5f5f5', width: 280, height: '100%' }}>
      <ScrollArea style={{ height: '100%' }}>
        <Stack gap="xs" p="sm">
          {sidebarItems.map((section, sectionIndex) => (
            <Box key={sectionIndex}>
              <Text size="xs" fw={600} c="dimmed" mb="xs" px="sm">
                {section.section}
              </Text>
              <Stack gap={2}>
                {section.items.map((item, itemIndex) => (
                  <NavLink
                    key={itemIndex}
                    label={item.label}
                    leftSection={<item.icon size={16} />}
                    active={item.active}
                    styles={{
                      root: {
                        borderRadius: 4,
                        fontSize: '14px',
                        fontWeight: item.active ? 600 : 400,
                        backgroundColor: item.active ? '#0891b2' : 'transparent',
                        color: item.active ? 'white' : '#374151',
                        '&:hover': {
                          backgroundColor: item.active ? '#0891b2' : '#e5e7eb'
                        }
                      }
                    }}
                  />
                ))}
              </Stack>
              {sectionIndex < sidebarItems.length - 1 && <Divider my="sm" />}
            </Box>
          ))}
        </Stack>
      </ScrollArea>
    </Box>
  );
};

// TypeScript interfaces for Adobe Recommendations API
interface AdobeProduct {
  baseOfferId: string;
  name: string;
  description: string;
}

interface AdobeRecommendation {
  rank: number;
  product: AdobeProduct;
  source: {
    sourceType: string;
    offerIds: string[];
  };
}

interface ProductRecommendations {
  upsells: AdobeRecommendation[];
  crossSells: AdobeRecommendation[];
  addOns: AdobeRecommendation[];
}

interface RecommendationResponse {
  productRecommendations: ProductRecommendations;
}

interface AdobeRecommendationsData {
  generic: RecommendationResponse;
  renewal: RecommendationResponse;
}

// Mock data based on Adobe API response structure
const mockAdobeRecommendations: AdobeRecommendationsData = {
  generic: {
    productRecommendations: {
      upsells: [
        {
          rank: 0,
          product: {
            baseOfferId: "30006208CA01A12",
            name: "Adobe Creative Cloud for Teams",
            description: "Complete creative suite with 20+ apps"
          },
          source: {
            sourceType: "OFFER",
            offerIds: ["30005702CA01A12"]
          }
        },
        {
          rank: 1,
          product: {
            baseOfferId: "65304921CA01A12", 
            name: "Adobe Analytics Premium",
            description: "Advanced web analytics and insights"
          },
          source: {
            sourceType: "OFFER",
            offerIds: ["30005702CA01A12"]
          }
        }
      ],
      crossSells: [
        {
          rank: 0,
          product: {
            baseOfferId: "30006566CA14A12",
            name: "Adobe Acrobat Pro DC",
            description: "Create, edit and sign PDFs"
          },
          source: {
            sourceType: "CUSTOMER",
            offerIds: []
          }
        },
        {
          rank: 1,
          product: {
            baseOfferId: "30005897CA01A12",
            name: "Adobe Sign for Business",
            description: "Electronic signatures and workflows"
          },
          source: {
            sourceType: "CUSTOMER", 
            offerIds: []
          }
        }
      ],
      addOns: [
        {
          rank: 0,
          product: {
            baseOfferId: "30007123CA01A12",
            name: "Adobe Stock for Teams",
            description: "Premium stock photos and assets"
          },
          source: {
            sourceType: "OFFER",
            offerIds: ["30006208CA01A12"]
          }
        },
        {
          rank: 1,
          product: {
            baseOfferId: "30007124CA01A12",
            name: "Adobe Workfront Planning",
            description: "Project management and collaboration"
          },
          source: {
            sourceType: "OFFER",
            offerIds: ["30006208CA01A12"]
          }
        }
      ]
    }
  },
  renewal: {
    productRecommendations: {
      upsells: [
        {
          rank: 0,
          product: {
            baseOfferId: "30008456CA01A12",
            name: "Adobe Experience Manager Sites",
            description: "Content management and delivery"
          },
          source: {
            sourceType: "SUBSCRIPTION",
            offerIds: ["30006208CA01A12"]
          }
        },
        {
          rank: 1,
          product: {
            baseOfferId: "30008457CA01A12",
            name: "Adobe Target Premium",
            description: "AI-powered personalization and testing"
          },
          source: {
            sourceType: "SUBSCRIPTION",
            offerIds: ["30006208CA01A12"]
          }
        }
      ],
      crossSells: [
        {
          rank: 0,
          product: {
            baseOfferId: "30009789CA01A12",
            name: "Adobe Campaign Standard",
            description: "Cross-channel marketing automation"
          },
          source: {
            sourceType: "SUBSCRIPTION",
            offerIds: []
          }
        },
        {
          rank: 1,
          product: {
            baseOfferId: "30009790CA01A12",
            name: "Adobe Audience Manager",
            description: "Data management platform"
          },
          source: {
            sourceType: "SUBSCRIPTION",
            offerIds: []
          }
        }
      ],
      addOns: [
        {
          rank: 0,
          product: {
            baseOfferId: "30010234CA01A12",
            name: "Adobe Commerce Cloud",
            description: "Enterprise e-commerce platform"
          },
          source: {
            sourceType: "SUBSCRIPTION",
            offerIds: ["30006208CA01A12"]
          }
        },
        {
          rank: 1,
          product: {
            baseOfferId: "30010235CA01A12",
            name: "Adobe Real-time CDP",
            description: "Customer data platform"
          },
          source: {
            sourceType: "SUBSCRIPTION",
            offerIds: ["30006208CA01A12"]
          }
        }
      ]
    }
  }
};

// Mock Products in Current Term products
const currentContractProducts = [
  {
    baseOfferId: "30001234CA01A12",
    name: "Adobe Photoshop for Teams",
    description: "Photo editing for creative teams"
  },
  {
    baseOfferId: "30001235CA01A12", 
    name: "Adobe Illustrator for Teams",
    description: "Vector graphics and illustration"
  },
  {
    baseOfferId: "30001236CA01A12",
    name: "Adobe InDesign for Teams", 
    description: "Page layout and design"
  }
];

const AdobeRecommendationSection = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AdobeRecommendationsData | null>(null);
  const [activeTab, setActiveTab] = useState<'generic' | 'renewal'>('generic');
  const [isVisible, setIsVisible] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate API calls to Adobe Recommendations API
    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock the API response structure
      setRecommendations(mockAdobeRecommendations);
      setIsVisible(true);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product: AdobeProduct) => {
    // Navigate to product details page
    navigate(`/adobe-recommendations/product/${product.baseOfferId}`);
  };

  const handleClose = () => {
    setIsVisible(false);
    setRecommendations(null);
  };

  // Product logo mapping
  const getProductLogo = (productName: string) => {
    const logoMap: Record<string, { initials: string; color: string; fontSize?: string }> = {
      'Adobe Creative Cloud for Teams': { initials: 'Cc', color: '#FF6B35', fontSize: 'md' },
      'Adobe Analytics Premium': { initials: 'An', color: '#FF4081', fontSize: 'md' },
      'Adobe Acrobat Pro DC': { initials: 'Ac', color: '#DC143C', fontSize: 'md' },
      'Adobe Sign for Business': { initials: 'Si', color: '#0066CC', fontSize: 'md' },
      'Adobe Stock for Teams': { initials: 'St', color: '#00A4E4', fontSize: 'md' },
      'Adobe Workfront Planning': { initials: 'Wf', color: '#8E4EC6', fontSize: 'xs' },
      'Adobe Experience Manager Sites': { initials: 'Em', color: '#FF9500', fontSize: 'xs' },
      'Adobe Target Premium': { initials: 'Tg', color: '#9C27B0', fontSize: 'md' },
      'Adobe Campaign Standard': { initials: 'Cp', color: '#4CAF50', fontSize: 'md' },
      'Adobe Audience Manager': { initials: 'Am', color: '#FF5722', fontSize: 'xs' },
      'Adobe Commerce Cloud': { initials: 'Co', color: '#607D8B', fontSize: 'md' },
      'Adobe Real-time CDP': { initials: 'Rt', color: '#3F51B5', fontSize: 'md' },
      // Products in Current Term products
      'Adobe Photoshop for Teams': { initials: 'Ps', color: '#31C5F0', fontSize: 'md' },
      'Adobe Illustrator for Teams': { initials: 'Ai', color: '#FF9A00', fontSize: 'md' },
      'Adobe InDesign for Teams': { initials: 'Id', color: '#FD006E', fontSize: 'md' }
    };

    return logoMap[productName] || { initials: 'A', color: '#dc2626', fontSize: 'lg' };
  };

  const ContractProductCard = ({ product }: { 
    product: { baseOfferId: string; name: string; description: string; }; 
  }) => {
    const logo = getProductLogo(product.name);
    
    return (
      <Paper 
        withBorder 
        p="sm" 
        style={{ 
          marginBottom: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
        onClick={() => navigate(`/adobe-recommendations/product/${product.baseOfferId}`)}
      >
        <Group gap="sm" align="flex-start">
          <Box
            style={{
              width: 48,
              height: 48,
              backgroundColor: logo.color,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Text c="white" fw={700} size={logo.fontSize} style={{ letterSpacing: '0.5px' }}>
              {logo.initials}
            </Text>
          </Box>
          <Stack gap={2} style={{ flex: 1 }}>
            <Text 
              size="sm" 
              fw={600} 
              style={{ 
                color: '#374151',
                lineHeight: 1.4
              }}
            >
              {product.name}
            </Text>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.4 }}>
              {product.description}
            </Text>
          </Stack>
        </Group>
      </Paper>
    );
  };

  const RecommendationCard = ({ recommendation }: { 
    recommendation: AdobeRecommendation; 
  }) => {
    const logo = getProductLogo(recommendation.product.name);
    
    return (
      <Paper 
        withBorder 
        p="sm" 
        style={{ 
          marginBottom: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
        onClick={() => handleProductClick(recommendation.product)}
      >
        <Group gap="sm" align="flex-start">
          <Box
            style={{
              width: 48,
              height: 48,
              backgroundColor: logo.color,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Text c="white" fw={700} size={logo.fontSize} style={{ letterSpacing: '0.5px' }}>
              {logo.initials}
            </Text>
          </Box>
          <Stack gap={2} style={{ flex: 1 }}>
            <Text 
              size="sm" 
              fw={600} 
              style={{ 
                color: '#374151',
                lineHeight: 1.4
              }}
            >
              {recommendation.product.name}
            </Text>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.4 }}>
              {recommendation.product.description}
            </Text>
          </Stack>
        </Group>
      </Paper>
    );
  };

  const currentData = recommendations && activeTab === 'generic' 
    ? recommendations.generic 
    : recommendations?.renewal;

  return (
    <Stack gap="md">
      <Title order={4}>Adobe Product Recommendations</Title>
      
      {!isVisible ? (
        <Paper withBorder p="md" style={{ textAlign: 'center' }}>
          <Stack gap="md" align="center">
            <Title order={4}>Adobe Product Recommendations</Title>
            <Anchor size="sm" c="blue">Find out more</Anchor>
            <Button 
              variant="outline" 
              size="sm" 
              loading={isLoading}
              onClick={fetchRecommendations}
              style={{ width: 'auto' }}
            >
              List Recommendations
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Box>
          {/* Tabs */}
          <Group gap={0} mb={0}>
            <Button
              variant="subtle"
              color={activeTab === 'generic' ? 'blue' : 'gray'}
              onClick={() => setActiveTab('generic')}
              style={{
                backgroundColor: 'transparent',
                color: activeTab === 'generic' ? '#0891b2' : '#6b7280',
                borderBottom: activeTab === 'generic' ? '2px solid #0891b2' : 'none',
                borderRadius: 0,
                fontWeight: activeTab === 'generic' ? 600 : 400,
                padding: '8px 16px'
              }}
            >
              Generic
            </Button>
            <Button
              variant="subtle"
              color={activeTab === 'renewal' ? 'blue' : 'gray'}
              onClick={() => setActiveTab('renewal')}
              style={{
                backgroundColor: 'transparent',
                color: activeTab === 'renewal' ? '#0891b2' : '#6b7280',
                borderBottom: activeTab === 'renewal' ? '2px solid #0891b2' : 'none',
                borderRadius: 0,
                fontWeight: activeTab === 'renewal' ? 600 : 400,
                padding: '8px 16px'
              }}
            >
              Renewal
            </Button>
            <Group ml="auto">
              <ActionIcon 
                variant="subtle" 
                color="gray" 
                size="sm"
                onClick={handleClose}
              >
                <Text style={{ fontSize: '14px', color: '#6b7280', cursor: 'pointer' }}>✕</Text>
              </ActionIcon>
            </Group>
          </Group>

          {/* Content with border starting from tabs */}
          <Paper withBorder style={{ backgroundColor: 'white', borderTop: 'none' }}>
            <Box p="md">
              {currentData && (
                <Stack gap="md">
                  {/* Upsell */}
                  {currentData.productRecommendations.upsells?.length > 0 && (
                    <Stack gap="xs">
                      <Title order={5} style={{ color: '#374151', fontSize: '16px', fontWeight: 600 }}>
                        Upsell Recommendations
                      </Title>
                      {activeTab === 'renewal' 
                        ? <RecommendationCard recommendation={currentData.productRecommendations.upsells[0]} />
                        : currentData.productRecommendations.upsells.map((rec, index) => (
                            <RecommendationCard key={index} recommendation={rec} />
                          ))
                      }
                    </Stack>
                  )}
                  
                  {/* Cross-sell */}
                  {currentData.productRecommendations.crossSells?.length > 0 && (
                    <Stack gap="xs">
                      <Title order={5} style={{ color: '#374151', fontSize: '16px', fontWeight: 600 }}>
                        Cross-sell Recommendations
                      </Title>
                      {activeTab === 'renewal' 
                        ? <RecommendationCard recommendation={currentData.productRecommendations.crossSells[0]} />
                        : currentData.productRecommendations.crossSells.map((rec, index) => (
                            <RecommendationCard key={index} recommendation={rec} />
                          ))
                      }
                    </Stack>
                  )}

                  {/* Products in Current Term Products - Only show for Renewal tab */}
                  {activeTab === 'renewal' && (
                    <Stack gap="xs">
                      <Title order={5} style={{ color: '#374151', fontSize: '16px', fontWeight: 600 }}>
                        Products in Current Term
                      </Title>
                      {currentContractProducts.map((product, index) => (
                        <ContractProductCard key={index} product={product} />
                      ))}
                    </Stack>
                  )}
                  
                  {/* Add-on - Only show for Generic tab */}
                  {activeTab === 'generic' && currentData.productRecommendations.addOns?.length > 0 && (
                    <Stack gap="xs">
                      <Title order={5} style={{ color: '#374151', fontSize: '16px', fontWeight: 600 }}>
                        Add-on Recommendations
                      </Title>
                      {currentData.productRecommendations.addOns.map((rec, index) => (
                        <RecommendationCard key={index} recommendation={rec} />
                      ))}
                    </Stack>
                  )}
                </Stack>
              )}
            </Box>
          </Paper>
        </Box>
      )}
    </Stack>
  );
};

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  
  // Mock product data based on the screenshot
  const productData = {
    name: "Adobe Acrobat Standard for Teams (NA)",
    subtitle: "Discover all the things your PDF can do.",
    developer: "Adobe",
    description: "Adobe Acrobat DC helps you keep business moving. Convert, edit, share, and sign PDFs. It keeps you connected to your team with simple workflows across desktop, mobile, and web — no matter where you're working.",
    pricing: {
      startingFrom: "$179.88",
      period: "/year"
    },
    features: [
      {
        category: "Convert",
        title: "Convert",
        description: "Turn almost any file into a PDF."
      },
      {
        category: "Edit PDF", 
        title: "Edit PDF",
        description: "Edit text and images in your PDF."
      },
      {
        category: "Share",
        title: "Share", 
        description: "Send a file to others for commenting or viewing."
      },
      {
        category: "Sign",
        title: "Sign",
        description: "Send a document to others for signing."
      }
    ]
  };

  return (
    <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <Box style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <Container size="xl">
          <Group justify="space-between" py="sm">
            <Group gap="lg">
              <Text size="sm" fw={500}>Browse</Text>
              <Text size="sm" c="dimmed">Be more productive</Text>
              <Text size="sm" c="dimmed">Secure my business</Text>
              <Text size="sm" c="dimmed">Windows in the Cloud</Text>
            </Group>
          </Group>
          <Box py="xs">
            <Text size="sm" c="dimmed">All Products</Text>
          </Box>
        </Container>
      </Box>

      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Product Header */}
          <Group align="flex-start" gap="xl">
            <Box
              style={{
                width: 120,
                height: 120,
                backgroundColor: '#dc2626',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #dc2626'
              }}
            >
              <Text c="white" fw={700} size="3rem">A</Text>
            </Box>
            
            <Stack gap="md" style={{ flex: 1 }}>
              <Stack gap="xs">
                <Title order={1} size="2rem" fw={400}>{productData.name}</Title>
                <Title order={2} size="1.25rem" fw={400} c="dimmed">
                  {productData.subtitle}
                </Title>
                <Text size="sm" c="dimmed">Developer: {productData.developer}</Text>
              </Stack>
            </Stack>
            
            <Button size="lg" style={{ backgroundColor: '#8bc34a', color: 'white' }}>
              Buy
            </Button>
          </Group>

          {/* Main Content */}
          <SimpleGrid cols={2} spacing="xl">
            {/* Left Column - Product Image */}
            <Box>
              <Paper p="xl" style={{ backgroundColor: '#dc2626', borderRadius: 8 }}>
                <Box style={{ backgroundColor: 'white', borderRadius: 4, padding: '2rem', minHeight: 300 }}>
                  <Text ta="center" c="dimmed" size="lg">Product Preview</Text>
                </Box>
              </Paper>
            </Box>

            {/* Right Column - Description and Pricing */}
            <Stack gap="xl">
              <Stack gap="md">
                <Title order={2} size="1.5rem" fw={400}>
                  Discover all the things your PDF can do.
                </Title>
                <Text size="md" lh={1.6}>
                  {productData.description}
                </Text>
              </Stack>

              <Stack gap="md">
                <Group align="baseline" gap="xs">
                  <Text size="sm" c="dimmed">Starting From</Text>
                </Group>
                <Group align="baseline" gap="md">
                  <Text size="2.5rem" fw={400}>{productData.pricing.startingFrom}</Text>
                  <Text size="sm" c="dimmed">{productData.pricing.period}</Text>
                  <Button style={{ backgroundColor: '#2b8ce6' }}>
                    See Pricing Plans
                  </Button>
                </Group>
              </Stack>
            </Stack>
          </SimpleGrid>

          {/* Features and Benefits */}
          <Stack gap="lg">
            <Title order={3} size="1.25rem" fw={600}>Features and Benefits</Title>
            <SimpleGrid cols={2} spacing="xl">
              {productData.features.map((feature, index) => (
                <Stack key={index} gap="sm">
                  <Title order={4} size="1rem" fw={600}>{feature.title}</Title>
                  <Text size="sm" c="dimmed">{feature.description}</Text>
                </Stack>
              ))}
            </SimpleGrid>
            <Group justify="center" mt="md">
              <Button variant="outline" style={{ color: '#2b8ce6', borderColor: '#2b8ce6' }}>
                More Features
              </Button>
            </Group>
          </Stack>

          {/* Reviews */}
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Title order={3} size="1.25rem" fw={600}>Reviews</Title>
              <Button style={{ backgroundColor: '#2b8ce6' }}>
                Write a Review
              </Button>
            </Group>
            <Group align="center" gap="md">
              <Group gap="xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} c="orange" size="lg">☆</Text>
                ))}
              </Group>
              <Text size="sm" c="dimmed">Based on 0 reviews</Text>
            </Group>
            <Text c="dimmed">No customer reviews have been written.</Text>
          </Stack>

          {/* Additional Information */}
          <Stack gap="lg">
            <Title order={3} size="1.25rem" fw={600}>Additional Information</Title>
            <Stack gap="md">
              <Title order={4} size="1rem" fw={600}>Terms & Conditions</Title>
              <Anchor size="sm" c="blue">Terms of Service</Anchor>
              <Anchor size="sm" c="blue">Privacy Policy</Anchor>
            </Stack>
          </Stack>

          {/* Questions and Answers */}
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Title order={3} size="1.25rem" fw={600}>Questions And Answers</Title>
              <Button style={{ backgroundColor: '#2b8ce6' }}>
                Ask a Question
              </Button>
            </Group>
            <Text c="dimmed">No questions have been asked.</Text>
          </Stack>
        </Stack>
      </Container>

      {/* Footer */}
      <Box style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', marginTop: '4rem' }}>
        <Container size="xl" py="lg">
          <Stack gap="md" align="center">
            <Group gap="xs" align="center">
              <Text size="sm" c="dimmed">Powered by</Text>
              <Text size="sm" fw={600}>AppDirect</Text>
            </Group>
            <Group gap="lg">
              <Text size="xs" c="dimmed">© 2025 AppDistribution</Text>
              <Anchor size="xs" c="dimmed">Contact</Anchor>
              <Anchor size="xs" c="dimmed">Help Center</Anchor>
              <Anchor size="xs" c="dimmed">Privacy Policy</Anchor>
              <Anchor size="xs" c="dimmed">Terms & Conditions</Anchor>
              <Text size="xs" c="dimmed">English (United States)</Text>
            </Group>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

const CompanyManagementPage = () => {
  const navigate = useNavigate();
  
  return (
    <Box style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Container size="xl" py="md">
        <Stack gap="lg">
          {/* Breadcrumb */}
          <Group gap="xs">
            <Anchor size="sm" c="dimmed" onClick={() => navigate('/')}>Companies</Anchor>
            <IconChevronRight size={14} style={{ color: '#6b7280' }} />
            <Text size="sm" c="dimmed">ABD CA</Text>
          </Group>

          {/* Company Header */}
          <Paper p="lg" withBorder style={{ backgroundColor: 'white' }}>
            <Group justify="space-between" align="flex-start">
              <Group align="flex-start" gap="md">
                <Box
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#0891b2',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text c="white" fw={700} size="lg">C</Text>
                </Box>
                <Stack gap="xs">
                  <Group gap="sm" align="center">
                    <Title order={3}>Company</Title>
                    <Group gap="xs" align="center">
                      <Box w={8} h={8} style={{ backgroundColor: '#22c55e', borderRadius: '50%' }} />
                      <Text size="sm" fw={500}>Enabled</Text>
                    </Group>
                  </Group>
                  <Title order={2} fw={700}>ABD CA</Title>
                </Stack>
              </Group>
              <Group gap="sm">
                <Button variant="outline" size="sm">New Lead or Purchase</Button>
                <Menu>
                  <Menu.Target>
                    <Button variant="filled" size="sm" rightSection={<IconChevronDown size={14} />}>
                      Manage Company
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>Edit Company</Menu.Item>
                    <Menu.Item>View Details</Menu.Item>
                    <Menu.Item>Disable</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Paper>

          {/* Statistics Row */}
          <SimpleGrid cols={6} spacing="md">
            {[
              { value: '0', label: 'Free Trials' },
              { value: '0', label: 'Expired Free Trials' },
              { value: '3', label: 'Purchased Products' },
              { value: '0', label: 'Suspended Products' },
              { value: '0', label: 'Unpaid Invoices' },
              { value: '$5.25', label: 'Total Spend' }
            ].map((stat, index) => (
              <Paper key={index} p="md" withBorder style={{ textAlign: 'center' }}>
                <Text size="xl" fw={700}>{stat.value}</Text>
                <Text size="xs" c="dimmed">{stat.label}</Text>
              </Paper>
            ))}
          </SimpleGrid>

          {/* Company Details */}
          <Paper withBorder>
            <Box p="md" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e5e7eb' }}>
              <Group justify="space-between">
                <Stack gap={4}>
                  <Group gap="lg">
                    <Stack gap={2}>
                      <Text size="sm" c="dimmed">Company Name</Text>
                      <Text size="sm" fw={500}>ABD CA</Text>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="sm" c="dimmed">Created</Text>
                      <Text size="sm" fw={500}>07/01/25</Text>
                    </Stack>
                  </Group>
                  <Group gap="lg">
                    <Stack gap={2}>
                      <Text size="sm" c="dimmed">ID</Text>
                      <Group gap="xs">
                        <Text size="sm" fw={500} style={{ fontFamily: 'monospace' }}>
                          f250d965-e43b-47a0-90a4-edf7360353d0
                        </Text>
                        <ActionIcon size="sm" variant="subtle">
                          <IconCopy size={12} />
                        </ActionIcon>
                      </Group>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="sm" c="dimmed">Website</Text>
                      <Anchor size="sm" c="blue">appdirect.com</Anchor>
                    </Stack>
                  </Group>
                </Stack>
                <Anchor size="sm" c="blue">Edit</Anchor>
              </Group>
            </Box>
            <Box p="md">
              <Anchor size="sm" c="blue" style={{ textDecoration: 'underline' }}>
                Show more ▼
              </Anchor>
            </Box>
          </Paper>

          {/* Content Tabs */}
          <Box>
            <Group gap={0} mb="md">
              {['Users', 'Billing', 'Activities', 'Settings', 'Vendor Information'].map((tab, index) => (
                <Button
                  key={tab}
                  variant="subtle"
                  color={tab === 'Vendor Information' ? 'blue' : 'gray'}
                  style={{
                    backgroundColor: 'transparent',
                    borderBottom: tab === 'Vendor Information' ? '2px solid #0891b2' : 'none',
                    borderRadius: 0,
                    fontWeight: tab === 'Vendor Information' ? 600 : 400
                  }}
                  px="md"
                  py="sm"
                >
                  {tab}
                </Button>
              ))}
              <Menu>
                <Menu.Target>
                  <Button variant="subtle" color="gray" px="md" py="sm" style={{ backgroundColor: '#f8f9fa' }}>
                    + 3 more Tabs
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>Payment Methods</Menu.Item>
                  <Menu.Item>Vendor Information</Menu.Item>
                  <Menu.Item>Domains</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            {/* Vendor Selection */}
            <Stack gap="lg">
              <Box style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '4px' }}>
                <Text size="sm" fw={500} mb="sm">Vendor</Text>
                <Select
                  data={[
                    { value: 'adobe', label: 'Adobe' },
                    { value: 'microsoft', label: 'Microsoft' },
                    { value: 'google', label: 'Google' }
                  ]}
                  value="adobe"
                  size="sm"
                  style={{ width: 200 }}
                />
              </Box>

              {/* Adobe Company Profile */}
              <Paper withBorder p="lg">
                <Group justify="space-between" align="flex-start">
                  <Group align="flex-start" gap="md">
                    <Box
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#ff0000',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text c="white" fw={700} size="lg">A</Text>
                    </Box>
                    <Stack gap="xs">
                      <Title order={4}>ABD CA</Title>
                      <Text size="sm" c="dimmed" style={{ fontFamily: 'monospace' }}>
                        F100052634
                      </Text>
                    </Stack>
                  </Group>
                  <ActionIcon variant="subtle">
                    <IconDots size={16} />
                  </ActionIcon>
                </Group>

                <Divider my="md" />

                <SimpleGrid cols={2} spacing="xl">
                  <Stack gap="sm">
                    <Text size="sm" fw={600}>ABD CA</Text>
                    <Text size="sm">abdcanada abdcada</Text>
                    <Text size="sm">50 Grove St</Text>
                    <Text size="sm">Somerville, MA 02144</Text>
                    <Text size="sm">US</Text>

                    <Stack gap={4} mt="md">
                      <Text size="sm" fw={600}>Current discount levels - licenses</Text>
                      <Text size="sm">Level 01</Text>
                      
                      <Text size="sm" fw={600} mt="sm">Preferred language</Text>
                      <Text size="sm">English (US)</Text>
                      
                      <Text size="sm" fw={600} mt="sm">Anniversary date</Text>
                      <Text size="sm">07/02/26</Text>
                      
                      <Text size="sm" fw={600} mt="sm">Administrator name</Text>
                      <Text size="sm">abdcad abdcadd</Text>
                    </Stack>
                  </Stack>

                  <Stack gap="sm">
                    <Text size="sm" fw={600}>Current discount levels - consumables</Text>
                    <Text size="sm">Tier T1</Text>
                    
                    <Text size="sm" fw={600} mt="sm">Market segment</Text>
                    <Text size="sm">Commercial</Text>
                    
                    <Text size="sm" fw={600} mt="sm">Global customer</Text>
                    <Text size="sm">No</Text>
                    
                    <Text size="sm" fw={600} mt="sm">Email ID</Text>
                    <Text size="sm">abd@as.com</Text>
                    
                    <Text size="sm" fw={600} mt="sm">Phone number</Text>
                    <Text size="sm">2133453456</Text>
                  </Stack>
                </SimpleGrid>
              </Paper>

              {/* Value Incentive Plan Programs */}
              <Stack gap="md">
                <Title order={4}>Value Incentive Plan (VIP) Programs</Title>
                <SimpleGrid cols={2} spacing="lg">
                  <Paper withBorder p="md" style={{ textAlign: 'center' }}>
                    <Stack gap="md" align="center">
                      <Title order={5}>3-Year Commit (3YC)</Title>
                      <Anchor size="sm" c="blue">Find out more</Anchor>
                      <Button variant="outline" size="sm" style={{ width: 'auto' }}>Apply for 3YC</Button>
                    </Stack>
                  </Paper>
                  <Paper withBorder p="md" style={{ textAlign: 'center' }}>
                    <Stack gap="md" align="center">
                      <Title order={5}>High Growth Offers (HGO)</Title>
                      <Anchor size="sm" c="blue">Find out more</Anchor>
                      <Button variant="outline" size="sm" style={{ width: 'auto' }}>Check Eligible Offers</Button>
                    </Stack>
                  </Paper>
                </SimpleGrid>
              </Stack>

              {/* Linked Membership */}
              <Paper withBorder p="md" style={{ textAlign: 'center' }}>
                <Stack gap="md" align="center">
                  <Title order={4}>Linked Membership</Title>
                  <Anchor size="sm" c="blue">Find out more</Anchor>
                  <Button variant="outline" size="sm" style={{ width: 'auto' }}>Apply for Linked Membership</Button>
                </Stack>
              </Paper>

              {/* Adobe Recommendation */}
              <AdobeRecommendationSection />

              {/* Update or schedule new products at renewal */}
              <Stack gap="md">
                <Title order={4}>Update or schedule new products at renewal</Title>
                
                <Paper withBorder p="md" style={{ textAlign: 'center' }}>
                  <Stack gap="md" align="center">
                    <Title order={5}>Update Adobe renewal quantity</Title>
                    <Anchor size="sm" c="blue">Find out more</Anchor>
                    <Button variant="outline" size="sm" style={{ width: 'auto' }}>List Adobe Products</Button>
                  </Stack>
                </Paper>

                <Paper withBorder p="md" style={{ textAlign: 'center' }}>
                  <Stack gap="md" align="center">
                    <Title order={5}>Add new Adobe products at renewal</Title>
                    <Anchor size="sm" c="blue">Find out more</Anchor>
                    <Button variant="outline" size="sm" style={{ width: 'auto' }}>Add New Products</Button>
                  </Stack>
                </Paper>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

const AdobeRecommendationsFlow = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={0}
      styles={{
        main: {
          backgroundColor: '#ffffff'
        }
      }}
    >
      <AppShell.Header>
        <AppDirectHeader />
      </AppShell.Header>
      
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>
      
      <AppShell.Main>
        <SecondaryNav />
        <Routes>
          <Route path="/" element={<CompanyManagementPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/*" element={<CompanyManagementPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

export default AdobeRecommendationsFlow; 