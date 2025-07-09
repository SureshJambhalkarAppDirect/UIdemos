import React, { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Text,
  Group,
  Button,
  Badge,
  Select,
  TextInput,
  Checkbox,
  Loader,
  Alert,
  Collapse,
  ActionIcon,
  CopyButton,
  Table,
  Divider,
  NumberInput,
  Modal,
  Code,
  Tooltip,
  Pagination,
  Center,
  ScrollArea,
  Grid,
  MultiSelect,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconRefresh,
  IconCopy,
  IconCheck,
  IconAlertCircle,
  IconCalendar,
  IconTag,
  IconCurrency,
  IconSearch,
  IconFilter,
  IconPlayerPlay,
  IconX,
  IconExternalLink,
  IconLock,
  IconShoppingCart,
  IconReceipt,
  IconTrendingUp,
  IconDatabase,
} from '@tabler/icons-react';
import { adobeConfigService } from '../services/adobeConfig';
import { adobeAuthService, AuthenticationStatus } from '../services/adobeAuth';

// Types based on Adobe VIP Marketplace pricing API structure
interface PriceListOffer {
  offerId: string;
  productFamily: string;
  productType: 'Enterprise Consumption' | 'Enterprise Hosted Subscription New' | 'Feature Restricted Licensing Subscription New' | 'Hosted Subscription' | 'Subscription New' | 'Team Consumption' | 'Transaction New';
  productTypeDetail: '12-month, no proration (fixed price)' | 'Annual (proration based on duration)' | 'No Proration (fixed price, no term)';
  additionalDetail?: string;
  operatingSystem: 'Multiple Platforms' | 'Other' | 'Windows';
  language: 'EU English' | 'Japanese' | 'Multi Asian Languages' | 'Multi European Languages' | 'Multi Language Australia' | 'Multi Latin American Languages' | 'Multi NorthAmerican Language';
  version: string;
  users: '1 User' | 'Named' | 'Per Credit Pack' | 'Per Server' | 'Per Transaction' | 'Per Workstation' | 'Subscription';
  metric?: '1000' | '10000' | '15000' | '20000' | '30000' | '40 Images' | '50 TRS INTRO NC' | '5000' | '50000' | 'Transaction - USER';
  bridge?: string;
  upcEanCode?: string;
  gtinCode?: string;
  acdIndicator?: 'Add' | 'Change' | 'Delete';
  acdEffectiveDate?: string;
  acdDescription?: string;
  levelDetails: string;
  firstOrderDate: string;
  lastOrderDate: string;
  partnerPrice: string;
  estimatedStreetPrice: string;
  discountCode?: string;
  estimatedShipDate: string;
  publicAnnounceDate: string;
  rmaRequestDeadline: string;
  pool: 'Application' | 'Discount1' | 'Discount2' | 'Pricing Version 23' | 'Pricing Version 24' | 'Pricing Version 25';
  duration: string;
}

interface PriceListResponse {
  limit: number;
  offset: number;
  count: number;
  totalCount: number;
  offers: PriceListOffer[];
  links?: {
    self: { uri: string; method: string; headers: any[] };
    next?: { uri: string; method: string; headers: any[] };
    prev?: { uri: string; method: string; headers: any[] };
  };
}

interface PriceListRequest {
  region: string;
  marketSegment: string;
  priceListType?: 'STANDARD' | '3YC';
  currency: string;
  priceListMonth: string;
  filters?: {
    offerId?: string;
    productFamily?: string;
    firstOrderDate?: string;
    lastOrderDate?: string;
    discountCode?: string;
  };
  includeOfferAttributes?: string[];
  limit?: number;
  offset?: number;
}

// Market segments and regions from Adobe VIP Marketplace
const MARKET_SEGMENTS = [
  { value: 'COM', label: 'Commercial' },
  { value: 'EDU', label: 'Education' },
  { value: 'GOV', label: 'Government' },
];

const REGIONS = [
  { value: 'NA', label: 'North America' },
  { value: 'EMEA', label: 'Europe, Middle East & Africa' },
  { value: 'APAC', label: 'Asia Pacific' },
  { value: 'LATAM', label: 'Latin America' },
];

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar' },
  { value: 'EUR', label: 'Euro' },
  { value: 'GBP', label: 'British Pound' },
  { value: 'CAD', label: 'Canadian Dollar' },
  { value: 'AUD', label: 'Australian Dollar' },
  { value: 'JPY', label: 'Japanese Yen' },
];

const PRODUCT_FAMILIES = [
  { value: 'CREATIVE_CLOUD', label: 'Creative Cloud' },
  { value: 'DOCUMENT_CLOUD', label: 'Document Cloud' },
  { value: 'ACROBAT_DC', label: 'Acrobat DC' },
  { value: 'STOCK', label: 'Adobe Stock' },
  { value: 'SIGN', label: 'Adobe Sign' },
  { value: 'SUBSTANCE', label: 'Substance' },
  { value: 'FIREFLY', label: 'Adobe Firefly' },
];

const OFFER_ATTRIBUTES = [
  { value: 'isPromotion', label: 'Promotion Status' },
  { value: 'is3YCEligible', label: '3-Year Commit Eligibility' },
  { value: 'supportedLanguages', label: 'Supported Languages' },
  { value: 'platforms', label: 'Supported Platforms' },
];

export const PriceLists: React.FC<{
  expanded?: boolean;
  onToggle?: () => void;
}> = ({ expanded = true, onToggle }) => {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>(adobeAuthService.getAuthStatus());

  useEffect(() => {
    const unsubscribe = adobeAuthService.onStatusChange((status) => {
      setAuthStatus(status);
    });

    return unsubscribe;
  }, []);

  const toggleBlock = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  // Show authentication required message if not connected
  if (!authStatus.isAuthenticated) {
    return (
      <Card withBorder shadow="sm" radius="md" style={{ padding: '1rem' }}>
        <Group justify="space-between" align="center" mb="md">
          <Group gap="xs">
            <Text fw={700} size="xl">
              Adobe VIP Marketplace Price Lists Management
            </Text>
            <Badge size="sm" variant="light" color="red">
              Authentication Required
            </Badge>
          </Group>
          {onToggle && (
            <ActionIcon variant="subtle" onClick={onToggle}>
              {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </ActionIcon>
          )}
        </Group>

        <Collapse in={expanded} transitionDuration={400} transitionTimingFunction="ease-in-out">
          <Alert
            icon={<IconLock size={16} />}
            title="Authentication Required"
            color="red"
            variant="light"
          >
            <Text size="sm">
              You must be authenticated with Adobe to access Price Lists Management features.
              Please connect your Adobe account using the authentication panel above.
            </Text>
          </Alert>
        </Collapse>
      </Card>
    );
  }

  return (
    <Card withBorder shadow="sm" radius="md" style={{ padding: '1rem' }}>
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <Text fw={700} size="xl">
            Adobe VIP Marketplace Price Lists Management
          </Text>
          <Badge size="sm" variant="light" color="blue">
            Live API
          </Badge>
        </Group>
        {onToggle && (
          <ActionIcon variant="subtle" onClick={onToggle}>
            {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </ActionIcon>
        )}
      </Group>

      <Collapse in={expanded} transitionDuration={400} transitionTimingFunction="ease-in-out">
        <Stack gap="lg">
          <GetPriceListsBlock
            expanded={expandedBlocks.has('get-price-lists')}
            onToggle={() => toggleBlock('get-price-lists')}
          />
          <PriceComparisonBlock
            expanded={expandedBlocks.has('price-comparison')}
            onToggle={() => toggleBlock('price-comparison')}
          />
          <HistoricalPricingBlock
            expanded={expandedBlocks.has('historical-pricing')}
            onToggle={() => toggleBlock('historical-pricing')}
          />
          <PricingAnalyticsBlock
            expanded={expandedBlocks.has('pricing-analytics')}
            onToggle={() => toggleBlock('pricing-analytics')}
          />
        </Stack>
      </Collapse>
    </Card>
  );
};

const GetPriceListsBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [formData, setFormData] = useState<PriceListRequest>({
    region: 'NA',
    marketSegment: 'COM',
    currency: 'USD',
    priceListMonth: '202501', // January 2025
    priceListType: 'STANDARD',
    filters: {},
    includeOfferAttributes: ['productType', 'productTypeDetail', 'language'],
    limit: 50,
    offset: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceListData, setPriceListData] = useState<PriceListResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOffers, setSelectedOffers] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<keyof PriceListOffer>('offerId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchPriceLists = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/adobe/proxy/v3/pricelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        if (errorData?.code && errorData?.message) {
          // Adobe API specific error with helpful context
          let errorMessage = `Adobe API Error ${errorData.code}: ${errorData.message}`;
          
          // Add helpful context for common Adobe error codes
          if (errorData.code === '1162') {
            errorMessage += '\n\nThis error indicates that no price list data is available for the requested parameters. This is common in Adobe\'s sandbox environment. Try different region, market segment, or date combinations.';
          } else if (errorData.code === '1159') {
            errorMessage += '\n\nThis indicates an inactive partner contract. Check your Adobe VIP Marketplace account status.';
          } else if (errorData.code === '1160') {
            errorMessage += '\n\nThe selected market segment is not valid for your partner account.';
          } else if (errorData.code === '1161') {
            errorMessage += '\n\nThe selected currency/region combination is not valid for your partner account.';
          }
          
          throw new Error(errorMessage);
        } else {
          // Generic HTTP error
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data: PriceListResponse = await response.json();
      setPriceListData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      region: 'NA',
      marketSegment: 'COM',
      currency: 'USD',
      priceListMonth: '202501',
      priceListType: 'STANDARD',
      filters: {},
      includeOfferAttributes: ['productType', 'productTypeDetail', 'language'],
      limit: 50,
      offset: 0,
    });
    setPriceListData(null);
    setError(null);
    setSelectedOffers(new Set());
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newOffset = (page - 1) * (formData.limit || 50);
    setFormData({ ...formData, offset: newOffset });
  };

  const handleSort = (column: keyof PriceListOffer) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriceTypeColor = (priceType: string) => {
    switch (priceType) {
      case 'SUBSCRIPTION': return 'blue';
      case 'PERPETUAL': return 'green';
      case 'CONSUMABLE': return 'orange';
      default: return 'gray';
    }
  };

  const getDiscountColor = (discountPercentage: number) => {
    if (discountPercentage >= 30) return 'red';
    if (discountPercentage >= 20) return 'orange';
    if (discountPercentage >= 10) return 'yellow';
    return 'gray';
  };

  const sortedOffers = priceListData?.offers.sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <IconDatabase size={20} color="#0891b2" />
          <Text fw={600} size="lg">
            Get Price Lists
          </Text>
          <Badge size="sm" variant="light" color="blue">
            POST /v3/pricelist
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Stack gap="md">
          <Text size="sm" color="dimmed">
            Fetch real-time and historical pricing information for Adobe VIP Marketplace products.
            Supports comprehensive global coverage with various filters and pagination.
          </Text>

          <Grid>
            <Grid.Col span={4}>
              <Select
                label="Region"
                placeholder="Select region"
                data={REGIONS}
                value={formData.region}
                onChange={(value) => setFormData({ ...formData, region: value || 'US' })}
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Market Segment"
                placeholder="Select market segment"
                data={MARKET_SEGMENTS}
                value={formData.marketSegment}
                onChange={(value) => setFormData({ ...formData, marketSegment: value || 'COM' })}
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Currency"
                placeholder="Select currency"
                data={CURRENCIES}
                value={formData.currency}
                onChange={(value) => setFormData({ ...formData, currency: value || 'USD' })}
                required
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Price List Month"
                placeholder="YYYY-MM"
                value={formData.priceListMonth}
                onChange={(event) => setFormData({ ...formData, priceListMonth: event.target.value })}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Product Family"
                placeholder="All product families"
                data={PRODUCT_FAMILIES}
                value={formData.filters?.productFamily}
                onChange={(value) => setFormData({ 
                  ...formData, 
                  filters: { ...formData.filters, productFamily: value || undefined } 
                })}
                clearable
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Offer ID"
                placeholder="Filter by specific offer ID"
                value={formData.filters?.offerId || ''}
                onChange={(event) => setFormData({ 
                  ...formData, 
                  filters: { ...formData.filters, offerId: event.target.value || undefined } 
                })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Discount Code"
                placeholder="Filter by discount code"
                value={formData.filters?.discountCode || ''}
                onChange={(event) => setFormData({ 
                  ...formData, 
                  filters: { ...formData.filters, discountCode: event.target.value || undefined } 
                })}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>
              <TextInput
                label="First Order Date"
                placeholder="YYYY-MM-DD"
                value={formData.filters?.firstOrderDate || ''}
                onChange={(event) => setFormData({ 
                  ...formData, 
                  filters: { ...formData.filters, firstOrderDate: event.target.value || undefined } 
                })}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Last Order Date"
                placeholder="YYYY-MM-DD"
                value={formData.filters?.lastOrderDate || ''}
                onChange={(event) => setFormData({ 
                  ...formData, 
                  filters: { ...formData.filters, lastOrderDate: event.target.value || undefined } 
                })}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Results per page"
                value={formData.limit}
                onChange={(value) => setFormData({ ...formData, limit: Number(value) || 50 })}
                min={1}
                max={100}
              />
            </Grid.Col>
          </Grid>

          <MultiSelect
            label="Include Offer Attributes"
            placeholder="Select attributes to include"
            data={OFFER_ATTRIBUTES}
            value={formData.includeOfferAttributes}
            onChange={(value) => setFormData({ ...formData, includeOfferAttributes: value.length > 0 ? value : undefined })}
          />

          <Group>
            <Button
              leftSection={<IconSearch size={16} />}
              onClick={fetchPriceLists}
              loading={loading}
              disabled={!formData.region || !formData.marketSegment || !formData.currency || !formData.priceListMonth}
            >
              Get Price Lists
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
          </Group>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="light"
            >
              {error}
            </Alert>
          )}

          {priceListData && (
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Text size="lg" fw={600}>
                  Price Lists Results
                </Text>
                <Group gap="sm">
                  <Badge variant="light" color="blue">
                    {priceListData.totalCount} total offers
                  </Badge>
                  <Badge variant="light" color="green">
                    {priceListData.count} displayed
                  </Badge>
                </Group>
              </Group>

              <ScrollArea>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        <Checkbox
                          checked={selectedOffers.size === priceListData.offers.length}
                          indeterminate={selectedOffers.size > 0 && selectedOffers.size < priceListData.offers.length}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setSelectedOffers(new Set(priceListData.offers.map(o => o.offerId)));
                            } else {
                              setSelectedOffers(new Set());
                            }
                          }}
                        />
                      </Table.Th>
                      <Table.Th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('offerId')}
                      >
                        Offer ID {sortColumn === 'offerId' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </Table.Th>
                      <Table.Th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('productFamily')}
                      >
                        Product Family {sortColumn === 'productFamily' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </Table.Th>
                      <Table.Th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('productType')}
                      >
                        Product Type {sortColumn === 'productType' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </Table.Th>
                      <Table.Th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('partnerPrice')}
                      >
                        Partner Price {sortColumn === 'partnerPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </Table.Th>
                      <Table.Th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('estimatedStreetPrice')}
                      >
                        Street Price {sortColumn === 'estimatedStreetPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </Table.Th>
                      <Table.Th>Discount</Table.Th>
                      <Table.Th>Users</Table.Th>
                      <Table.Th>OS</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {sortedOffers?.map((offer) => (
                      <Table.Tr key={offer.offerId}>
                        <Table.Td>
                          <Checkbox
                            checked={selectedOffers.has(offer.offerId)}
                            onChange={(event) => {
                              const newSelected = new Set(selectedOffers);
                              if (event.target.checked) {
                                newSelected.add(offer.offerId);
                              } else {
                                newSelected.delete(offer.offerId);
                              }
                              setSelectedOffers(newSelected);
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Stack gap="xs">
                            <Text size="sm" fw={500}>
                              {offer.productName}
                            </Text>
                            <Text size="xs" color="dimmed">
                              {offer.description}
                            </Text>
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Code>{offer.sku}</Code>
                            <CopyButton value={offer.sku}>
                              {({ copied, copy }) => (
                                <ActionIcon size="xs" color={copied ? 'teal' : 'gray'} onClick={copy}>
                                  {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                                </ActionIcon>
                              )}
                            </CopyButton>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge size="sm" variant="light" color="blue">
                            {offer.productFamily}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600}>
                            {formatPrice(offer.unitPrice, offer.currency)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" color="dimmed">
                            {formatPrice(offer.listPrice, offer.currency)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Badge 
                              size="sm" 
                              variant="light" 
                              color={getDiscountColor(offer.discountPercentage)}
                            >
                              {offer.discountPercentage}%
                            </Badge>
                            <Text size="xs" color="dimmed">
                              {offer.discountLevel}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            size="sm" 
                            variant="light" 
                            color={getPriceTypeColor(offer.priceType)}
                          >
                            {offer.priceType}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {offer.billingCycle}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <CopyButton value={offer.offerId}>
                              {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Copied!' : 'Copy Offer ID'}>
                                  <ActionIcon size="sm" color={copied ? 'teal' : 'gray'} onClick={copy}>
                                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                  </ActionIcon>
                                </Tooltip>
                              )}
                            </CopyButton>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {priceListData.totalCount > (formData.limit || 50) && (
                <Center>
                  <Pagination
                    total={Math.ceil(priceListData.totalCount / (formData.limit || 50))}
                    value={currentPage}
                    onChange={handlePageChange}
                    withEdges
                  />
                </Center>
              )}
            </Stack>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

const PriceComparisonBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['US']);
  const [selectedMarketSegments, setSelectedMarketSegments] = useState<string[]>(['COM']);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const runComparison = async () => {
    if (selectedProducts.length === 0 || selectedRegions.length === 0 || selectedMarketSegments.length === 0) {
      setError('Please select at least one product, region, and market segment.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock comparison data
      const mockComparison = {
        products: selectedProducts,
        regions: selectedRegions,
        marketSegments: selectedMarketSegments,
        currency: selectedCurrency,
        timestamp: new Date().toISOString(),
        comparisons: [
          {
            productName: 'Creative Cloud All Apps',
            sku: 'CC-ALL-VIP-MP-COM-EN-US',
            priceByRegion: {
              US: { price: 52.99, discount: 33.33 },
              CA: { price: 67.99, discount: 30.00 },
              EMEA: { price: 59.99, discount: 25.00 }
            },
            priceByMarketSegment: {
              COM: { price: 52.99, discount: 33.33 },
              EDU: { price: 39.99, discount: 45.00 },
              GOV: { price: 47.99, discount: 36.67 }
            }
          },
          {
            productName: 'Acrobat Pro DC',
            sku: 'ACR-PRO-VIP-MP-COM-EN-US',
            priceByRegion: {
              US: { price: 19.99, discount: 33.33 },
              CA: { price: 24.99, discount: 30.00 },
              EMEA: { price: 22.99, discount: 25.00 }
            },
            priceByMarketSegment: {
              COM: { price: 19.99, discount: 33.33 },
              EDU: { price: 14.99, discount: 45.00 },
              GOV: { price: 17.99, discount: 36.67 }
            }
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setComparisonData(mockComparison);
    } catch (err) {
      setError('Failed to generate comparison data. Please try again.');
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setComparisonData(null);
    setError(null);
    setSelectedProducts([]);
    setSelectedRegions(['US']);
    setSelectedMarketSegments(['COM']);
    setSelectedCurrency('USD');
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <IconTrendingUp size={20} color="#22c55e" />
          <Text fw={600} size="lg">
            Price Comparison
          </Text>
          <Badge size="sm" variant="light" color="green">
            Analysis Tool
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Stack gap="md">
          <Text size="sm" color="dimmed">
            Compare pricing across different regions, market segments, and time periods.
          </Text>
          
          {/* Comparison Controls */}
          <Grid>
            <Grid.Col span={6}>
              <MultiSelect
                label="Products"
                placeholder="Select products to compare"
                data={PRODUCT_FAMILIES}
                value={selectedProducts}
                onChange={setSelectedProducts}
                clearable
                searchable
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MultiSelect
                label="Regions"
                placeholder="Select regions"
                data={REGIONS}
                value={selectedRegions}
                onChange={setSelectedRegions}
                clearable
                searchable
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MultiSelect
                label="Market Segments"
                placeholder="Select market segments"
                data={MARKET_SEGMENTS}
                value={selectedMarketSegments}
                onChange={setSelectedMarketSegments}
                clearable
                searchable
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Currency"
                data={CURRENCIES}
                value={selectedCurrency}
                onChange={(value) => setSelectedCurrency(value || 'USD')}
              />
            </Grid.Col>
          </Grid>

          {/* Action Buttons */}
          <Group>
            <Button
              leftSection={<IconTrendingUp size={16} />}
              onClick={runComparison}
              loading={loading}
              disabled={selectedProducts.length === 0}
            >
              Compare Prices
            </Button>
            <Button variant="outline" onClick={resetComparison}>
              Reset
            </Button>
          </Group>

          {/* Error Display */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
            >
              {error}
            </Alert>
          )}

          {/* Comparison Results */}
          {comparisonData && (
            <Card withBorder>
              <Text fw={600} mb="md">Comparison Results</Text>
              <Text size="sm" color="dimmed" mb="md">
                Generated on {new Date(comparisonData.timestamp).toLocaleString()}
              </Text>
              
              <Stack gap="md">
                {comparisonData.comparisons.map((comparison: any, index: number) => (
                  <div key={index}>
                    <Text fw={500} mb="sm">{comparison.productName}</Text>
                    
                    <Grid>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500} mb="xs">Price by Region</Text>
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Region</Table.Th>
                              <Table.Th>Price</Table.Th>
                              <Table.Th>Discount</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {Object.entries(comparison.priceByRegion).map(([region, data]: [string, any]) => (
                              <Table.Tr key={region}>
                                <Table.Td>{region}</Table.Td>
                                <Table.Td>${data.price}</Table.Td>
                                <Table.Td>
                                  <Badge 
                                    size="sm" 
                                    color={data.discount > 35 ? 'green' : data.discount > 25 ? 'yellow' : 'red'}
                                  >
                                    {data.discount}%
                                  </Badge>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Grid.Col>
                      
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500} mb="xs">Price by Market Segment</Text>
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Segment</Table.Th>
                              <Table.Th>Price</Table.Th>
                              <Table.Th>Discount</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {Object.entries(comparison.priceByMarketSegment).map(([segment, data]: [string, any]) => (
                              <Table.Tr key={segment}>
                                <Table.Td>{segment}</Table.Td>
                                <Table.Td>${data.price}</Table.Td>
                                <Table.Td>
                                  <Badge 
                                    size="sm" 
                                    color={data.discount > 35 ? 'green' : data.discount > 25 ? 'yellow' : 'red'}
                                  >
                                    {data.discount}%
                                  </Badge>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Grid.Col>
                    </Grid>
                    
                    {index < comparisonData.comparisons.length - 1 && <Divider my="md" />}
                  </div>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

const HistoricalPricingBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('US');
  const [selectedMarketSegment, setSelectedMarketSegment] = useState<string>('COM');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const fetchHistoricalData = async () => {
    if (!selectedProduct || !dateRange[0] || !dateRange[1]) {
      setError('Please select a product and date range.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock historical data
      const mockHistoricalData = {
        product: selectedProduct,
        region: selectedRegion,
        marketSegment: selectedMarketSegment,
        currency: selectedCurrency,
        dateRange: [dateRange[0]?.toISOString(), dateRange[1]?.toISOString()],
        priceHistory: [
          {
            month: '2024-01',
            unitPrice: 45.99,
            listPrice: 69.99,
            discountPercentage: 34.29,
            discountLevel: 'Level 1',
            is3YCEligible: true,
            priceChange: 0
          },
          {
            month: '2024-02',
            unitPrice: 47.99,
            listPrice: 69.99,
            discountPercentage: 31.43,
            discountLevel: 'Level 2',
            is3YCEligible: true,
            priceChange: 2.00
          },
          {
            month: '2024-03',
            unitPrice: 52.99,
            listPrice: 79.49,
            discountPercentage: 33.33,
            discountLevel: 'Level 2',
            is3YCEligible: true,
            priceChange: 5.00
          },
          {
            month: '2024-04',
            unitPrice: 52.99,
            listPrice: 79.49,
            discountPercentage: 33.33,
            discountLevel: 'Level 2',
            is3YCEligible: true,
            priceChange: 0
          },
          {
            month: '2024-05',
            unitPrice: 52.99,
            listPrice: 79.49,
            discountPercentage: 33.33,
            discountLevel: 'Level 2',
            is3YCEligible: true,
            priceChange: 0
          }
        ],
        threeCYCommitAnalysis: {
          averagePrice: 50.39,
          totalSavings: 120.60,
          priceStability: 'Stable',
          recommendation: 'Good candidate for 3YC commitment'
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHistoricalData(mockHistoricalData);
    } catch (err) {
      setError('Failed to fetch historical pricing data. Please try again.');
      console.error('Historical pricing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetHistoricalData = () => {
    setHistoricalData(null);
    setError(null);
    setSelectedProduct('');
    setSelectedRegion('US');
    setSelectedMarketSegment('COM');
    setSelectedCurrency('USD');
    setDateRange([null, null]);
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <IconCalendar size={20} color="#f59e0b" />
          <Text fw={600} size="lg">
            Historical Pricing
          </Text>
          <Badge size="sm" variant="light" color="yellow">
            3YC Support
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Stack gap="md">
          <Text size="sm" color="dimmed">
            Access historical pricing data with support for 3-Year Commit (3YC) scenarios.
          </Text>
          
          {/* Historical Data Controls */}
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Product"
                placeholder="Select product"
                data={PRODUCT_FAMILIES}
                value={selectedProduct}
                onChange={(value) => setSelectedProduct(value || '')}
                searchable
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Region"
                data={REGIONS}
                value={selectedRegion}
                onChange={(value) => setSelectedRegion(value || 'US')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Market Segment"
                data={MARKET_SEGMENTS}
                value={selectedMarketSegment}
                onChange={(value) => setSelectedMarketSegment(value || 'COM')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Currency"
                data={CURRENCIES}
                value={selectedCurrency}
                onChange={(value) => setSelectedCurrency(value || 'USD')}
              />
            </Grid.Col>
          </Grid>

          {/* Action Buttons */}
          <Group>
            <Button
              leftSection={<IconCalendar size={16} />}
              onClick={fetchHistoricalData}
              loading={loading}
              disabled={!selectedProduct}
            >
              Get Historical Data
            </Button>
            <Button variant="outline" onClick={resetHistoricalData}>
              Reset
            </Button>
          </Group>

          {/* Error Display */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
            >
              {error}
            </Alert>
          )}

          {/* Historical Data Results */}
          {historicalData && (
            <Stack gap="md">
              <Card withBorder>
                <Text fw={600} mb="md">Historical Price Data</Text>
                
                <Table striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Month</Table.Th>
                      <Table.Th>Unit Price</Table.Th>
                      <Table.Th>List Price</Table.Th>
                      <Table.Th>Discount</Table.Th>
                      <Table.Th>3YC Eligible</Table.Th>
                      <Table.Th>Price Change</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {historicalData.priceHistory.map((entry: any) => (
                      <Table.Tr key={entry.month}>
                        <Table.Td>{entry.month}</Table.Td>
                        <Table.Td>${entry.unitPrice}</Table.Td>
                        <Table.Td>${entry.listPrice}</Table.Td>
                        <Table.Td>
                          <Badge 
                            size="sm" 
                            color={entry.discountPercentage > 30 ? 'green' : 'yellow'}
                          >
                            {entry.discountPercentage}%
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            size="sm" 
                            color={entry.is3YCEligible ? 'green' : 'red'}
                          >
                            {entry.is3YCEligible ? 'Yes' : 'No'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            size="sm" 
                            color={entry.priceChange > 0 ? 'red' : entry.priceChange < 0 ? 'green' : 'gray'}
                          >
                            {entry.priceChange > 0 ? '+' : ''}${entry.priceChange}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>

              <Card withBorder>
                <Text fw={600} mb="md">3-Year Commit Analysis</Text>
                <Grid>
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Text size="sm" color="dimmed">Average Price</Text>
                      <Text size="lg" fw={600}>${historicalData.threeCYCommitAnalysis.averagePrice}</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Text size="sm" color="dimmed">Total Potential Savings</Text>
                      <Text size="lg" fw={600} color="green">${historicalData.threeCYCommitAnalysis.totalSavings}</Text>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Text size="sm" color="dimmed">Price Stability</Text>
                      <Badge size="lg" color="blue">{historicalData.threeCYCommitAnalysis.priceStability}</Badge>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Stack gap="xs">
                      <Text size="sm" color="dimmed">Recommendation</Text>
                      <Text size="sm" fw={500}>{historicalData.threeCYCommitAnalysis.recommendation}</Text>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Card>
            </Stack>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

const PricingAnalyticsBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [selectedAnalyticsType, setSelectedAnalyticsType] = useState<string>('market_trends');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('6_months');

  const analyticsTypes = [
    { value: 'market_trends', label: 'Market Trends Analysis' },
    { value: 'discount_analysis', label: 'Discount Level Analysis' },
    { value: 'product_comparison', label: 'Product Price Comparison' },
    { value: 'savings_calculator', label: 'Savings Calculator' },
    { value: 'competitive_analysis', label: 'Competitive Analysis' }
  ];

  const timeframes = [
    { value: '3_months', label: 'Last 3 Months' },
    { value: '6_months', label: 'Last 6 Months' },
    { value: '1_year', label: 'Last 12 Months' },
    { value: '2_years', label: 'Last 24 Months' }
  ];

  const generateAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock analytics data based on selected type
      const mockAnalyticsData = {
        analysisType: selectedAnalyticsType,
        timeframe: selectedTimeframe,
        generatedAt: new Date().toISOString(),
        data: getAnalyticsDataByType(selectedAnalyticsType)
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAnalyticsData(mockAnalyticsData);
    } catch (err) {
      setError('Failed to generate analytics. Please try again.');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAnalyticsDataByType = (type: string) => {
    switch (type) {
      case 'market_trends':
        return {
          title: 'Market Trends Analysis',
          insights: [
            'Creative Cloud pricing has increased by 12% over the past 6 months',
            'Document Cloud shows stable pricing with minimal fluctuations',
            'Education segment offers consistently higher discount rates',
            'EMEA region shows 8% higher pricing compared to US market'
          ],
          metrics: {
            overallPriceChange: '+12%',
            bestPerformingSegment: 'Education',
            mostVolatileProduct: 'Creative Cloud',
            stablePricing: 'Document Cloud'
          }
        };
      case 'discount_analysis':
        return {
          title: 'Discount Level Analysis',
          insights: [
            'Level 2 discounts (33-35%) are most common across products',
            'Government segment receives highest average discounts',
            '3YC eligible products show better discount stability',
            'Promotional pricing available for 45% of products'
          ],
          discountDistribution: {
            'Level 1 (25-30%)': 23,
            'Level 2 (31-35%)': 45,
            'Level 3 (36-40%)': 28,
            'Level 4 (41%+)': 12
          }
        };
      case 'product_comparison':
        return {
          title: 'Product Price Comparison',
          insights: [
            'Creative Cloud All Apps offers best value for comprehensive users',
            'Individual app licenses cost 60% more than bundled pricing',
            'Stock Standard provides competitive pricing vs alternatives',
            'Acrobat Pro DC shows premium pricing in enterprise segment'
          ],
          priceRankings: [
            { product: 'Creative Cloud All Apps', price: 52.99, value: 'Excellent' },
            { product: 'Adobe Stock Standard', price: 29.99, value: 'Good' },
            { product: 'Acrobat Pro DC', price: 19.99, value: 'Premium' }
          ]
        };
      case 'savings_calculator':
        return {
          title: 'Savings Calculator',
          insights: [
            'Annual billing saves 16% compared to monthly',
            '3YC commitment provides additional 8% savings',
            'Volume discounts kick in at 10+ licenses',
            'Education pricing offers up to 45% savings'
          ],
          savingsBreakdown: {
            monthlyToAnnual: '16%',
            threeYearCommit: '8%',
            volumeDiscount: '12%',
            educationDiscount: '45%'
          }
        };
      case 'competitive_analysis':
        return {
          title: 'Competitive Analysis',
          insights: [
            'Adobe pricing is competitive within creative software market',
            'Enterprise features justify premium pricing',
            'Educational discounts are industry-leading',
            'Subscription model provides better value than perpetual licensing'
          ],
          competitorComparison: {
            'Adobe Creative Cloud': { price: 52.99, features: 'Premium', support: 'Excellent' },
            'Competitor A': { price: 45.99, features: 'Standard', support: 'Good' },
            'Competitor B': { price: 39.99, features: 'Basic', support: 'Limited' }
          }
        };
      default:
        return {};
    }
  };

  const resetAnalytics = () => {
    setAnalyticsData(null);
    setError(null);
    setSelectedAnalyticsType('market_trends');
    setSelectedTimeframe('6_months');
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <IconReceipt size={20} color="#8b5cf6" />
          <Text fw={600} size="lg">
            Pricing Analytics
          </Text>
          <Badge size="sm" variant="light" color="violet">
            Insights
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Stack gap="md">
          <Text size="sm" color="dimmed">
            Generate insights and analytics from pricing data including trends, discount analysis, and market comparisons.
          </Text>
          
          {/* Analytics Controls */}
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Analysis Type"
                data={analyticsTypes}
                value={selectedAnalyticsType}
                onChange={(value) => setSelectedAnalyticsType(value || 'market_trends')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Timeframe"
                data={timeframes}
                value={selectedTimeframe}
                onChange={(value) => setSelectedTimeframe(value || '6_months')}
              />
            </Grid.Col>
          </Grid>

          {/* Action Buttons */}
          <Group>
            <Button
              leftSection={<IconTrendingUp size={16} />}
              onClick={generateAnalytics}
              loading={loading}
            >
              Generate Analytics
            </Button>
            <Button variant="outline" onClick={resetAnalytics}>
              Reset
            </Button>
          </Group>

          {/* Error Display */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
            >
              {error}
            </Alert>
          )}

          {/* Analytics Results */}
          {analyticsData && (
            <Stack gap="md">
              <Card withBorder>
                <Text fw={600} mb="md">{analyticsData.data.title}</Text>
                <Text size="sm" color="dimmed" mb="md">
                  Generated on {new Date(analyticsData.generatedAt).toLocaleString()}
                </Text>
                
                <Stack gap="md">
                  <div>
                    <Text fw={500} mb="sm">Key Insights</Text>
                    <Stack gap="xs">
                      {analyticsData.data.insights?.map((insight: string, index: number) => (
                        <Text key={index} size="sm" style={{ paddingLeft: '1rem' }}>
                          • {insight}
                        </Text>
                      ))}
                    </Stack>
                  </div>

                  {analyticsData.data.metrics && (
                    <div>
                      <Text fw={500} mb="sm">Key Metrics</Text>
                      <Grid>
                        {Object.entries(analyticsData.data.metrics).map(([key, value]) => (
                          <Grid.Col key={key} span={6}>
                            <Stack gap="xs">
                              <Text size="sm" color="dimmed">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Text>
                              <Badge size="lg" variant="light" color="violet">
                                {value as string}
                              </Badge>
                            </Stack>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </div>
                  )}

                  {analyticsData.data.discountDistribution && (
                    <div>
                      <Text fw={500} mb="sm">Discount Distribution</Text>
                      <Table>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Discount Level</Table.Th>
                            <Table.Th>Product Count</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {Object.entries(analyticsData.data.discountDistribution).map(([level, count]) => (
                            <Table.Tr key={level}>
                              <Table.Td>{level}</Table.Td>
                              <Table.Td>
                                <Badge size="sm" variant="light" color="blue">
                                  {count as number}
                                </Badge>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </div>
                  )}

                  {analyticsData.data.priceRankings && (
                    <div>
                      <Text fw={500} mb="sm">Price Rankings</Text>
                      <Table>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Product</Table.Th>
                            <Table.Th>Price</Table.Th>
                            <Table.Th>Value Rating</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {analyticsData.data.priceRankings.map((item: any, index: number) => (
                            <Table.Tr key={index}>
                              <Table.Td>{item.product}</Table.Td>
                              <Table.Td>${item.price}</Table.Td>
                              <Table.Td>
                                <Badge 
                                  size="sm" 
                                  color={item.value === 'Excellent' ? 'green' : item.value === 'Good' ? 'blue' : 'orange'}
                                >
                                  {item.value}
                                </Badge>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </div>
                  )}

                  {analyticsData.data.savingsBreakdown && (
                    <div>
                      <Text fw={500} mb="sm">Savings Breakdown</Text>
                      <Grid>
                        {Object.entries(analyticsData.data.savingsBreakdown).map(([key, value]) => (
                          <Grid.Col key={key} span={6}>
                            <Stack gap="xs">
                              <Text size="sm" color="dimmed">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </Text>
                              <Badge size="lg" variant="light" color="green">
                                {value as string}
                              </Badge>
                            </Stack>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </div>
                  )}
                </Stack>
              </Card>
            </Stack>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
}; 