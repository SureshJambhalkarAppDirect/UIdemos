import React, { useState, useEffect } from 'react';
import {
  Card,
  Stack,
  Text,
  Group,
  Button,
  Badge,
  Grid,
  Select,
  MultiSelect,
  TextInput,
  Checkbox,
  Loader,
  Alert,
  Collapse,
  ActionIcon,
  CopyButton,
  Table,
  Progress,
  Divider,
  NumberInput,
  Textarea,
  Modal,
  Code,
  Tooltip,
  Pagination,
  Center,
  ScrollArea,
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
  IconShoppingCart,
  IconReceipt,
  IconHistory,
  IconSearch,
  IconFilter,
  IconPlayerPlay,
  IconX,
  IconPlus,
  IconMinus,
  IconExternalLink,
} from '@tabler/icons-react';
import { adobeConfigService } from '../services/adobeConfig';

// Types based on Adobe API documentation
interface FlexibleDiscount {
  id: string;
  name: string;
  description: string;
  code: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  qualification: {
    baseOfferIds: string[];
  };
  outcomes: Array<{
    type: 'FIXED_DISCOUNT' | 'PERCENTAGE_DISCOUNT';
    discountValues: Array<{
      country?: string;
      currency?: string;
      value: number;
    }>;
  }>;
}

interface FlexibleDiscountsResponse {
  limit: number;
  offset: number;
  count: number;
  totalCount: number;
  flexDiscounts: FlexibleDiscount[];
  links?: {
    self: { uri: string; method: string; headers: any[] };
    next?: { uri: string; method: string; headers: any[] };
    prev?: { uri: string; method: string; headers: any[] };
  };
}

interface OrderLineItem {
  extLineItemNumber: number;
  offerId: string;
  quantity: number;
  status: string;
  subscriptionId: string;
  currencyCode: string;
  flexDiscounts?: Array<{
    id: string;
    code: string;
    result: string;
  }>;
}

interface Order {
  referenceOrderId: string;
  orderType: string;
  externalReferenceId: string;
  customerId: string;
  orderId: string;
  currencyCode: string;
  creationDate: string;
  status: string;
  lineItems: OrderLineItem[];
  links?: any;
}

interface OrderHistoryResponse {
  items: Order[];
  links?: any;
}

// Market segments from Adobe documentation
const MARKET_SEGMENTS = [
  { value: 'COM', label: 'Commercial' },
  { value: 'EDU', label: 'Education' },
  { value: 'GOV', label: 'Government' },
];

// Common countries
const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'AU', label: 'Australia' },
  { value: 'JP', label: 'Japan' },
  { value: 'IN', label: 'India' },
];

export const FlexibleDiscounts: React.FC<{
  expanded?: boolean;
  onToggle?: () => void;
}> = ({ expanded = true, onToggle }) => {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const toggleBlock = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  return (
    <Card withBorder shadow="sm" radius="md" style={{ padding: '1rem' }}>
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <Text fw={700} size="xl">
            Adobe Flexible Discounts Management
          </Text>
          <Badge size="sm" variant="light" color="blue">
            Environment: {adobeConfigService.getCurrentEnvironment()}
          </Badge>
        </Group>
        {onToggle && (
          <ActionIcon variant="subtle" onClick={onToggle}>
            {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </ActionIcon>
        )}
      </Group>

      <Collapse in={expanded}>
        <Stack gap="lg">
          {/* Block 1: Get Flexible Discounts */}
          <GetFlexibleDiscountsBlock
            expanded={expandedBlocks.has('get-discounts')}
            onToggle={() => toggleBlock('get-discounts')}
          />

          {/* Block 2: Create Order and Preview Order */}
          <CreateOrderBlock
            expanded={expandedBlocks.has('create-order')}
            onToggle={() => toggleBlock('create-order')}
          />

          {/* Block 3: Get Order */}
          <GetOrderBlock
            expanded={expandedBlocks.has('get-order')}
            onToggle={() => toggleBlock('get-order')}
          />

          {/* Block 4: Get Order History */}
          <GetOrderHistoryBlock
            expanded={expandedBlocks.has('order-history')}
            onToggle={() => toggleBlock('order-history')}
          />
        </Stack>
      </Collapse>
    </Card>
  );
};

// Block 1: Get Flexible Discounts
const GetFlexibleDiscountsBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState<FlexibleDiscountsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchMode, setSearchMode] = useState('browse'); // 'browse', 'offers', 'code', 'date'
  
  // Form state
  const [marketSegment, setMarketSegment] = useState<string>('COM');
  const [country, setCountry] = useState<string>('US');
  const [offerIds, setOfferIds] = useState<string>('');
  const [flexDiscountCode, setFlexDiscountCode] = useState<string>('');
  const [flexDiscountId, setFlexDiscountId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [limit, setLimit] = useState<number>(20);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      const offset = (currentPage - 1) * limit;
      
      // Always required parameters
      params.append('market-segment', marketSegment);
      params.append('country', country);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      
      // Optional parameters based on search mode
      if (searchMode === 'offers' && offerIds.trim()) {
        params.append('offer-ids', offerIds.trim());
      }
      if (searchMode === 'code' && flexDiscountCode.trim()) {
        params.append('flex-discount-code', flexDiscountCode.trim());
      }
      if (searchMode === 'id' && flexDiscountId.trim()) {
        params.append('flex-discount-id', flexDiscountId.trim());
      }
      if (searchMode === 'date') {
        if (startDate) params.append('start-date', startDate);
        if (endDate) params.append('end-date', endDate);
      }

      const response = await fetch(`http://localhost:3001/api/adobe/proxy/v3/flex-discounts?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setDiscounts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMarketSegment('COM');
    setCountry('US');
    setOfferIds('');
    setFlexDiscountCode('');
    setFlexDiscountId('');
    setStartDate('');
    setEndDate('');
    setLimit(20);
    setCurrentPage(1);
    setDiscounts(null);
    setError(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'INACTIVE': return 'yellow';
      case 'EXPIRED': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDiscountValue = (outcome: any) => {
    if (outcome.type === 'PERCENTAGE_DISCOUNT') {
      return `${outcome.discountValues[0]?.value || 0}% off`;
    } else if (outcome.type === 'FIXED_DISCOUNT') {
      const discountValue = outcome.discountValues[0];
      return `${discountValue?.currency || 'USD'} ${discountValue?.value || 0} off`;
    }
    return 'Discount available';
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconTag size={20} color="blue" />
          <Text fw={600} size="lg">
            Get Flexible Discounts
          </Text>
          <Badge size="sm" variant="light">
            {discounts?.totalCount || 0} discounts available
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Stack gap="md">
          {/* Search Mode Selection */}
          <Group gap="md">
            <Text size="sm" fw={500}>Search Mode:</Text>
            <Group gap="xs">
              {[
                { value: 'browse', label: 'Browse by Market' },
                { value: 'offers', label: 'Search by Offers' },
                { value: 'code', label: 'Find by Code' },
                { value: 'id', label: 'Find by ID' },
                { value: 'date', label: 'Date Range' },
              ].map((mode) => (
                <Checkbox
                  key={mode.value}
                  label={mode.label}
                  checked={searchMode === mode.value}
                  onChange={() => setSearchMode(mode.value)}
                  size="sm"
                />
              ))}
            </Group>
          </Group>

          {/* Input Fields */}
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Market Segment"
                placeholder="Select market segment"
                value={marketSegment}
                onChange={(value) => setMarketSegment(value || 'COM')}
                data={MARKET_SEGMENTS}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Country"
                placeholder="Select country"
                value={country}
                onChange={(value) => setCountry(value || 'US')}
                data={COUNTRIES}
                required
              />
            </Grid.Col>

            {searchMode === 'offers' && (
              <Grid.Col span={12}>
                <TextInput
                  label="Offer IDs"
                  placeholder="Enter comma-separated offer IDs (e.g., 65322535CA04A12, 86322535CA04A12)"
                  value={offerIds}
                  onChange={(e) => setOfferIds(e.target.value)}
                />
              </Grid.Col>
            )}

            {searchMode === 'code' && (
              <Grid.Col span={12}>
                <TextInput
                  label="Flexible Discount Code"
                  placeholder="Enter discount code (e.g., BLACK_FRIDAY)"
                  value={flexDiscountCode}
                  onChange={(e) => setFlexDiscountCode(e.target.value)}
                />
              </Grid.Col>
            )}

            {searchMode === 'id' && (
              <Grid.Col span={12}>
                <TextInput
                  label="Flexible Discount ID"
                  placeholder="Enter specific discount ID"
                  value={flexDiscountId}
                  onChange={(e) => setFlexDiscountId(e.target.value)}
                />
              </Grid.Col>
            )}

            {searchMode === 'date' && (
              <>
                <Grid.Col span={6}>
                  <TextInput
                    label="Start Date"
                    placeholder="2025-01-01 or 2025-01-01T00:00:00Z"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="End Date"
                    placeholder="2025-12-31 or 2025-12-31T23:59:59Z"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Grid.Col>
              </>
            )}

            <Grid.Col span={12}>
              <NumberInput
                label="Results per page"
                value={limit}
                onChange={(value) => setLimit(typeof value === 'number' ? value : 20)}
                min={1}
                max={50}
                step={10}
              />
            </Grid.Col>
          </Grid>

          {/* Action Buttons */}
          <Group justify="space-between">
            <Button
              leftSection={<IconSearch size={16} />}
              onClick={fetchDiscounts}
              loading={loading}
              disabled={!marketSegment || !country}
            >
              Search Discounts
            </Button>
            <Group gap="xs">
              <Button variant="light" onClick={resetForm}>
                Reset
              </Button>
              <Button
                variant="subtle"
                leftSection={<IconRefresh size={16} />}
                onClick={fetchDiscounts}
                loading={loading}
              >
                Refresh
              </Button>
            </Group>
          </Group>

          {/* Error Display */}
          {error && (
            <Alert color="red" title="Error" icon={<IconAlertCircle size={16} />}>
              {error}
            </Alert>
          )}

          {/* Results */}
          {discounts && !loading && (
            <Stack gap="md">
              {/* Summary */}
              <Group justify="space-between" align="center">
                <Text size="sm" c="dimmed">
                  Showing {discounts.count} of {discounts.totalCount} discounts
                </Text>
                {discounts.totalCount > discounts.limit && (
                  <Pagination
                    value={currentPage}
                    onChange={(page) => {
                      setCurrentPage(page);
                      fetchDiscounts();
                    }}
                    total={Math.ceil(discounts.totalCount / discounts.limit)}
                    size="sm"
                  />
                )}
              </Group>

              {/* Discount Cards */}
              <Grid>
                {discounts.flexDiscounts.map((discount) => (
                  <Grid.Col key={discount.id} span={6}>
                    <Card withBorder padding="md" radius="md">
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Text fw={600} size="sm">
                            {discount.name}
                          </Text>
                          <Badge
                            size="sm"
                            color={getStatusColor(discount.status)}
                            variant="light"
                          >
                            {discount.status}
                          </Badge>
                        </Group>

                        <Text size="xs" c="dimmed">
                          {discount.description}
                        </Text>

                        <Group justify="space-between" align="center">
                          <Group gap="xs">
                            <Text size="xs" fw={500}>
                              Code:
                            </Text>
                            <Code size="xs">{discount.code}</Code>
                            <CopyButton value={discount.code}>
                              {({ copied, copy }) => (
                                <ActionIcon size="xs" variant="subtle" onClick={copy}>
                                  {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                                </ActionIcon>
                              )}
                            </CopyButton>
                          </Group>
                          <Text size="xs" fw={500} c="blue">
                            {formatDiscountValue(discount.outcomes[0])}
                          </Text>
                        </Group>

                        <Group justify="space-between" align="center">
                          <Text size="xs">
                            {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {discount.qualification.baseOfferIds.length} offer(s)
                          </Text>
                        </Group>

                        <Group justify="space-between" align="center">
                          <CopyButton value={discount.id}>
                            {({ copied, copy }) => (
                              <Button size="xs" variant="subtle" onClick={copy}>
                                {copied ? 'Copied ID' : 'Copy ID'}
                              </Button>
                            )}
                          </CopyButton>
                          <Button size="xs" variant="light">
                            Use in Order
                          </Button>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>

              {/* Empty State */}
              {discounts.flexDiscounts.length === 0 && (
                <Center py="xl">
                  <Stack align="center" gap="md">
                    <IconTag size={48} color="gray" />
                    <Text c="dimmed">No flexible discounts found</Text>
                    <Text size="sm" c="dimmed">
                      Try adjusting your search criteria or check a different market segment
                    </Text>
                  </Stack>
                </Center>
              )}
            </Stack>
          )}

          {/* Loading State */}
          {loading && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Loader size="md" />
                <Text c="dimmed">Searching for flexible discounts...</Text>
              </Stack>
            </Center>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

// Block 2: Create Order and Preview Order
const CreateOrderBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(true);
  const [createResult, setCreateResult] = useState<any>(null);
  
  // Form state
  const [customerId, setCustomerId] = useState<string>('P1005230905');
  const [externalReferenceId, setExternalReferenceId] = useState<string>('');
  const [lineItems, setLineItems] = useState<Array<{
    extLineItemNumber: number;
    offerId: string;
    quantity: number;
    flexDiscountId?: string;
    flexDiscountCode?: string;
  }>>([
    {
      extLineItemNumber: 1,
      offerId: '65322651CA01A12',
      quantity: 1,
    }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, {
      extLineItemNumber: lineItems.length + 1,
      offerId: '',
      quantity: 1,
    }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const createOrPreviewOrder = async (preview: boolean = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const orderPayload = {
        orderType: 'NEW',
        externalReferenceId: externalReferenceId || `order-${Date.now()}`,
        lineItems: lineItems.map(item => ({
          extLineItemNumber: item.extLineItemNumber,
          offerId: item.offerId,
          quantity: item.quantity,
          ...(item.flexDiscountId && { flexDiscountId: item.flexDiscountId }),
          ...(item.flexDiscountCode && { flexDiscountCode: item.flexDiscountCode }),
        })),
        environment: 'sandbox',
      };

      const url = preview 
        ? `http://localhost:3001/api/adobe/proxy/v3/customers/${customerId}/orders?preview=true`
        : `http://localhost:3001/api/adobe/proxy/v3/customers/${customerId}/orders`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      if (preview) {
        setOrderData(result);
      } else {
        setCreateResult(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerId('P1005230905');
    setExternalReferenceId('');
    setLineItems([{
      extLineItemNumber: 1,
      offerId: '65322651CA01A12',
      quantity: 1,
    }]);
    setOrderData(null);
    setCreateResult(null);
    setError(null);
    setPreviewMode(true);
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconShoppingCart size={20} color="green" />
          <Text fw={600} size="lg">
            Create Order and Preview Order
          </Text>
          <Badge size="sm" variant="light" color="green">
            {createResult ? 'Order Created' : 'Ready'}
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Stack gap="md">
          {/* Order Form */}
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Customer ID"
                placeholder="Enter customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="External Reference ID"
                placeholder="Optional external reference"
                value={externalReferenceId}
                onChange={(e) => setExternalReferenceId(e.target.value)}
              />
            </Grid.Col>
          </Grid>

          <Divider label="Line Items" labelPosition="left" />

          {/* Line Items */}
          <Stack gap="sm">
            {lineItems.map((item, index) => (
              <Card key={index} withBorder padding="sm" bg="gray.0">
                <Grid>
                  <Grid.Col span={1}>
                    <NumberInput
                      label="Line #"
                      value={item.extLineItemNumber}
                      onChange={(value) => updateLineItem(index, 'extLineItemNumber', value)}
                      min={1}
                      size="sm"
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Offer ID"
                      placeholder="e.g., 65322651CA01A12"
                      value={item.offerId}
                      onChange={(e) => updateLineItem(index, 'offerId', e.target.value)}
                      size="sm"
                      required
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <NumberInput
                      label="Quantity"
                      value={item.quantity}
                      onChange={(value) => updateLineItem(index, 'quantity', value)}
                      min={1}
                      size="sm"
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <TextInput
                      label="Flex Discount ID"
                      placeholder="Optional discount ID"
                      value={item.flexDiscountId || ''}
                      onChange={(e) => updateLineItem(index, 'flexDiscountId', e.target.value)}
                      size="sm"
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <TextInput
                      label="Flex Discount Code"
                      placeholder="Optional discount code"
                      value={item.flexDiscountCode || ''}
                      onChange={(e) => updateLineItem(index, 'flexDiscountCode', e.target.value)}
                      size="sm"
                    />
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Group justify="flex-end" style={{ marginTop: '1.5rem' }}>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => removeLineItem(index)}
                        disabled={lineItems.length === 1}
                      >
                        <IconMinus size={16} />
                      </ActionIcon>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card>
            ))}

            <Group justify="flex-start">
              <Button
                leftSection={<IconPlus size={16} />}
                variant="light"
                onClick={addLineItem}
                size="sm"
              >
                Add Line Item
              </Button>
            </Group>
          </Stack>

          {/* Action Buttons */}
          <Group justify="space-between">
            <Group gap="xs">
              <Button
                leftSection={<IconSearch size={16} />}
                onClick={() => createOrPreviewOrder(true)}
                loading={loading}
                disabled={!customerId || lineItems.some(item => !item.offerId)}
              >
                Preview Order
              </Button>
              <Button
                leftSection={<IconShoppingCart size={16} />}
                onClick={() => createOrPreviewOrder(false)}
                loading={loading}
                disabled={!customerId || lineItems.some(item => !item.offerId)}
                color="green"
              >
                Create Order
              </Button>
            </Group>
            <Button variant="light" onClick={resetForm}>
              Reset
            </Button>
          </Group>

          {/* Error Display */}
          {error && (
            <Alert color="red" title="Error" icon={<IconAlertCircle size={16} />}>
              {error}
            </Alert>
          )}

          {/* Preview Results */}
          {orderData && !loading && (
            <Card withBorder padding="md" bg="blue.0">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} size="sm">
                    Order Preview
                  </Text>
                  <Badge size="sm" variant="light" color="blue">
                    Preview Mode
                  </Badge>
                </Group>
                
                <Grid>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Customer ID</Text>
                    <Text size="sm">{orderData.customerId}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Order Type</Text>
                    <Text size="sm">{orderData.orderType}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Currency</Text>
                    <Text size="sm">{orderData.currencyCode}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Status</Text>
                    <Badge size="sm" color="blue">{orderData.status}</Badge>
                  </Grid.Col>
                </Grid>

                <Divider label="Line Items" labelPosition="left" />
                
                <Stack gap="xs">
                  {orderData.lineItems?.map((item: any, index: number) => (
                    <Card key={index} withBorder padding="xs" bg="white">
                      <Group justify="space-between">
                        <div>
                          <Text size="sm" fw={500}>
                            Line #{item.extLineItemNumber} - {item.offerId}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Quantity: {item.quantity} | Status: {item.status}
                          </Text>
                        </div>
                        {item.flexDiscounts?.length > 0 && (
                          <Badge size="sm" color="green">
                            {item.flexDiscounts.length} discount(s)
                          </Badge>
                        )}
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          )}

          {/* Create Results */}
          {createResult && !loading && (
            <Card withBorder padding="md" bg="green.0">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} size="sm">
                    Order Created Successfully
                  </Text>
                  <Badge size="sm" variant="light" color="green">
                    Live Order
                  </Badge>
                </Group>
                
                <Grid>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Order ID</Text>
                    <Group gap="xs">
                      <Code size="sm">{createResult.orderId}</Code>
                      <CopyButton value={createResult.orderId}>
                        {({ copied, copy }) => (
                          <ActionIcon size="xs" variant="subtle" onClick={copy}>
                            {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                          </ActionIcon>
                        )}
                      </CopyButton>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Reference Order ID</Text>
                    <Code size="sm">{createResult.referenceOrderId}</Code>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Creation Date</Text>
                    <Text size="sm">{new Date(createResult.creationDate).toLocaleString()}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Status</Text>
                    <Badge size="sm" color="green">{createResult.status}</Badge>
                  </Grid.Col>
                </Grid>

                <Group justify="flex-end">
                  <Button
                    size="sm"
                    variant="light"
                    leftSection={<IconExternalLink size={14} />}
                    onClick={() => {
                      // This would navigate to the Get Order block
                      // For now, just copy the order ID
                      navigator.clipboard.writeText(createResult.orderId);
                    }}
                  >
                    View Order Details
                  </Button>
                </Group>
              </Stack>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Loader size="md" />
                <Text c="dimmed">
                  {previewMode ? 'Generating order preview...' : 'Creating order...'}
                </Text>
              </Stack>
            </Center>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

// Block 3: Get Order
const GetOrderBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [customerId, setCustomerId] = useState<string>('P1005230905');
  const [orderId, setOrderId] = useState<string>('');

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/adobe/proxy/v3/customers/${customerId}/orders/${orderId}?environment=sandbox`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerId('P1005230905');
    setOrderId('');
    setOrderData(null);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green';
      case 'processing': return 'blue';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      case 'cancelled': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconReceipt size={20} color="orange" />
          <Text fw={600} size="lg">
            Get Order
          </Text>
          <Badge size="sm" variant="light" color="orange">
            {orderData ? 'Order Found' : 'Ready'}
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Stack gap="md">
          {/* Search Form */}
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Customer ID"
                placeholder="Enter customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Order ID"
                placeholder="Enter order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </Grid.Col>
          </Grid>

          {/* Action Buttons */}
          <Group justify="space-between">
            <Button
              leftSection={<IconSearch size={16} />}
              onClick={fetchOrder}
              loading={loading}
              disabled={!customerId || !orderId}
            >
              Get Order
            </Button>
            <Button variant="light" onClick={resetForm}>
              Reset
            </Button>
          </Group>

          {/* Error Display */}
          {error && (
            <Alert color="red" title="Error" icon={<IconAlertCircle size={16} />}>
              {error}
            </Alert>
          )}

          {/* Order Details */}
          {orderData && !loading && (
            <Card withBorder padding="md" bg="orange.0">
              <Stack gap="md">
                <Group justify="space-between">
                  <Text fw={600} size="lg">
                    Order Details
                  </Text>
                  <Badge size="sm" color={getStatusColor(orderData.status)}>
                    {orderData.status}
                  </Badge>
                </Group>

                {/* Order Summary */}
                <Grid>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Order ID</Text>
                    <Group gap="xs">
                      <Code size="sm">{orderData.orderId}</Code>
                      <CopyButton value={orderData.orderId}>
                        {({ copied, copy }) => (
                          <ActionIcon size="xs" variant="subtle" onClick={copy}>
                            {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                          </ActionIcon>
                        )}
                      </CopyButton>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Reference Order ID</Text>
                    <Code size="sm">{orderData.referenceOrderId}</Code>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Customer ID</Text>
                    <Text size="sm">{orderData.customerId}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Order Type</Text>
                    <Text size="sm">{orderData.orderType}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Currency</Text>
                    <Text size="sm">{orderData.currencyCode}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">Creation Date</Text>
                    <Text size="sm">{formatDate(orderData.creationDate)}</Text>
                  </Grid.Col>
                  {orderData.externalReferenceId && (
                    <Grid.Col span={12}>
                      <Text size="xs" c="dimmed">External Reference ID</Text>
                      <Text size="sm">{orderData.externalReferenceId}</Text>
                    </Grid.Col>
                  )}
                </Grid>

                <Divider label="Line Items" labelPosition="left" />

                {/* Line Items */}
                <Stack gap="sm">
                  {orderData.lineItems?.map((item, index) => (
                    <Card key={index} withBorder padding="md" bg="white">
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <div>
                            <Text fw={500} size="sm">
                              Line #{item.extLineItemNumber}
                            </Text>
                            <Text size="xs" c="dimmed">
                              Offer ID: {item.offerId}
                            </Text>
                          </div>
                          <Badge size="sm" color={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </Group>

                        <Grid>
                          <Grid.Col span={4}>
                            <Text size="xs" c="dimmed">Quantity</Text>
                            <Text size="sm">{item.quantity}</Text>
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Text size="xs" c="dimmed">Currency</Text>
                            <Text size="sm">{item.currencyCode}</Text>
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Text size="xs" c="dimmed">Subscription ID</Text>
                            <Text size="sm">{item.subscriptionId}</Text>
                          </Grid.Col>
                        </Grid>

                        {/* Flexible Discounts */}
                        {item.flexDiscounts && item.flexDiscounts.length > 0 && (
                          <div>
                            <Text size="xs" c="dimmed" mb="xs">Applied Flexible Discounts</Text>
                            <Stack gap="xs">
                              {item.flexDiscounts.map((discount, discountIndex) => (
                                <Card key={discountIndex} withBorder padding="xs" bg="green.0">
                                  <Group justify="space-between">
                                    <div>
                                      <Text size="xs" fw={500}>
                                        Code: {discount.code}
                                      </Text>
                                      <Text size="xs" c="dimmed">
                                        ID: {discount.id}
                                      </Text>
                                    </div>
                                    <Badge size="xs" color="green">
                                      {discount.result}
                                    </Badge>
                                  </Group>
                                </Card>
                              ))}
                            </Stack>
                          </div>
                        )}
                      </Stack>
                    </Card>
                  ))}
                </Stack>

                {/* Order Links */}
                {orderData.links && (
                  <div>
                    <Text size="xs" c="dimmed" mb="xs">Related Actions</Text>
                    <Group gap="xs">
                      <Button size="xs" variant="light">
                        View in Adobe Console
                      </Button>
                      <Button size="xs" variant="light">
                        Export Order Data
                      </Button>
                    </Group>
                  </div>
                )}
              </Stack>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Loader size="md" />
                <Text c="dimmed">Retrieving order details...</Text>
              </Stack>
            </Center>
          )}

          {/* Empty State */}
          {!orderData && !loading && !error && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <IconReceipt size={48} color="gray" />
                <Text c="dimmed">Enter Customer ID and Order ID to view order details</Text>
                <Text size="sm" c="dimmed">
                  Order IDs can be found in the Create Order block or Order History
                </Text>
              </Stack>
            </Center>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

// Block 4: Get Order History
const GetOrderHistoryBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Form state
  const [customerId, setCustomerId] = useState<string>('P1005230905');
  const [limit, setLimit] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  const fetchOrderHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      const offset = (currentPage - 1) * limit;
      
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      params.append('environment', 'sandbox');
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      if (dateRange.start) {
        params.append('startDate', dateRange.start);
      }
      if (dateRange.end) {
        params.append('endDate', dateRange.end);
      }

      const response = await fetch(`http://localhost:3001/api/adobe/proxy/v3/customers/${customerId}/orders?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setOrderHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerId('P1005230905');
    setLimit(10);
    setStatusFilter('');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
    setOrderHistory(null);
    setSelectedOrder(null);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green';
      case 'processing': return 'blue';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      case 'cancelled': return 'gray';
      default: return 'gray';
    }
  };

  const getFlexDiscountCount = (order: Order) => {
    return order.lineItems?.reduce((total, item) => {
      return total + (item.flexDiscounts?.length || 0);
    }, 0) || 0;
  };

  const ORDER_STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconHistory size={20} color="purple" />
          <Text fw={600} size="lg">
            Get Order History
          </Text>
          <Badge size="sm" variant="light" color="purple">
            {orderHistory?.items?.length || 0} orders found
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded}>
        <Stack gap="md">
          {/* Search Form */}
          <Grid>
            <Grid.Col span={4}>
              <TextInput
                label="Customer ID"
                placeholder="Enter customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Status Filter"
                placeholder="Filter by status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value || '')}
                data={ORDER_STATUSES}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Results per page"
                value={limit}
                onChange={(value) => setLimit(typeof value === 'number' ? value : 10)}
                min={1}
                max={100}
                step={5}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Start Date"
                placeholder="2025-01-01T00:00:00Z"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="End Date"
                placeholder="2025-12-31T23:59:59Z"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </Grid.Col>
          </Grid>

          {/* Action Buttons */}
          <Group justify="space-between">
            <Button
              leftSection={<IconSearch size={16} />}
              onClick={fetchOrderHistory}
              loading={loading}
              disabled={!customerId}
            >
              Get Order History
            </Button>
            <Group gap="xs">
              <Button variant="light" onClick={resetForm}>
                Reset
              </Button>
              <Button
                variant="subtle"
                leftSection={<IconRefresh size={16} />}
                onClick={fetchOrderHistory}
                loading={loading}
              >
                Refresh
              </Button>
            </Group>
          </Group>

          {/* Error Display */}
          {error && (
            <Alert color="red" title="Error" icon={<IconAlertCircle size={16} />}>
              {error}
            </Alert>
          )}

          {/* Order History Results */}
          {orderHistory && !loading && (
            <Stack gap="md">
              {/* Summary and Pagination */}
              <Group justify="space-between" align="center">
                <Text size="sm" c="dimmed">
                  Showing {orderHistory.items?.length || 0} orders
                </Text>
                {orderHistory.items?.length > 0 && (
                  <Group gap="xs">
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Text size="sm">Page {currentPage}</Text>
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!orderHistory.links?.next}
                    >
                      Next
                    </Button>
                  </Group>
                )}
              </Group>

              {/* Order Cards */}
              <Stack gap="sm">
                {orderHistory.items?.map((order) => (
                  <Card key={order.orderId} withBorder padding="md" bg="purple.0">
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <div>
                          <Text fw={500} size="sm">
                            Order #{order.orderId}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Reference: {order.referenceOrderId}
                          </Text>
                        </div>
                        <Group gap="xs">
                          <Badge size="sm" color={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          {getFlexDiscountCount(order) > 0 && (
                            <Badge size="sm" color="green" variant="light">
                              {getFlexDiscountCount(order)} discount(s)
                            </Badge>
                          )}
                        </Group>
                      </Group>

                      <Grid>
                        <Grid.Col span={4}>
                          <Text size="xs" c="dimmed">Order Type</Text>
                          <Text size="sm">{order.orderType}</Text>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Text size="xs" c="dimmed">Currency</Text>
                          <Text size="sm">{order.currencyCode}</Text>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Text size="xs" c="dimmed">Creation Date</Text>
                          <Text size="sm">{formatDate(order.creationDate)}</Text>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Text size="xs" c="dimmed">Line Items</Text>
                          <Text size="sm">{order.lineItems?.length || 0} item(s)</Text>
                        </Grid.Col>
                      </Grid>

                      {/* Flexible Discounts Summary */}
                      {order.lineItems?.some(item => item.flexDiscounts && item.flexDiscounts.length > 0) && (
                        <div>
                          <Text size="xs" c="dimmed" mb="xs">Applied Flexible Discounts</Text>
                          <Stack gap="xs">
                            {order.lineItems?.filter(item => item.flexDiscounts && item.flexDiscounts.length > 0).map((item, itemIndex) => (
                              <div key={itemIndex}>
                                <Text size="xs" fw={500}>Line #{item.extLineItemNumber}</Text>
                                <Group gap="xs">
                                  {item.flexDiscounts?.map((discount, discountIndex) => (
                                    <Badge key={discountIndex} size="xs" color="green">
                                      {discount.code}
                                    </Badge>
                                  ))}
                                </Group>
                              </div>
                            ))}
                          </Stack>
                        </div>
                      )}

                      <Group justify="space-between">
                        <CopyButton value={order.orderId}>
                          {({ copied, copy }) => (
                            <Button size="xs" variant="subtle" onClick={copy}>
                              {copied ? 'Copied ID' : 'Copy Order ID'}
                            </Button>
                          )}
                        </CopyButton>
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </Stack>

              {/* Empty State */}
              {orderHistory.items?.length === 0 && (
                <Center py="xl">
                  <Stack align="center" gap="md">
                    <IconHistory size={48} color="gray" />
                    <Text c="dimmed">No orders found</Text>
                    <Text size="sm" c="dimmed">
                      Try adjusting your filters or check a different customer ID
                    </Text>
                  </Stack>
                </Center>
              )}
            </Stack>
          )}

          {/* Loading State */}
          {loading && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Loader size="md" />
                <Text c="dimmed">Loading order history...</Text>
              </Stack>
            </Center>
          )}

          {/* Empty State */}
          {!orderHistory && !loading && !error && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <IconHistory size={48} color="gray" />
                <Text c="dimmed">Enter Customer ID to view order history</Text>
                <Text size="sm" c="dimmed">
                  Apply filters to narrow down your search results
                </Text>
              </Stack>
            </Center>
          )}
        </Stack>
      </Collapse>

      {/* Order Details Modal */}
      <Modal
        opened={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details - ${selectedOrder?.orderId}`}
        size="lg"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedOrder && (
          <Stack gap="md">
            <Grid>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Order ID</Text>
                <Code size="sm">{selectedOrder.orderId}</Code>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Status</Text>
                <Badge size="sm" color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Customer ID</Text>
                <Text size="sm">{selectedOrder.customerId}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Creation Date</Text>
                <Text size="sm">{formatDate(selectedOrder.creationDate)}</Text>
              </Grid.Col>
            </Grid>

            <Divider label="Line Items" />

            <Stack gap="sm">
              {selectedOrder.lineItems?.map((item, index) => (
                <Card key={index} withBorder padding="sm">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fw={500} size="sm">
                        Line #{item.extLineItemNumber}
                      </Text>
                      <Badge size="sm" color={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Offer: {item.offerId} | Quantity: {item.quantity}
                    </Text>
                    {item.flexDiscounts && item.flexDiscounts.length > 0 && (
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">Discounts:</Text>
                        {item.flexDiscounts.map((discount, discountIndex) => (
                          <Badge key={discountIndex} size="xs" color="green">
                            {discount.code}
                          </Badge>
                        ))}
                      </Group>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Stack>
        )}
      </Modal>
    </Card>
  );
};

export default FlexibleDiscounts; 