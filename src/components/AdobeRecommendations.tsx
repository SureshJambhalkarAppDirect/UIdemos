import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Stack, 
  Collapse, 
  ActionIcon, 
  Button, 
  TextInput, 
  Badge, 
  Divider, 
  NumberInput, 
  Select, 
  Grid, 
  Loader, 
  Alert, 
  Tabs, 
  Code, 
  ScrollArea, 
  Table, 
  Pagination, 
  Modal, 
  CopyButton, 
  Tooltip 
} from '@mantine/core';
import { 
  IconChevronDown, 
  IconChevronUp, 
  IconSearch, 
  IconShoppingCart, 
  IconRefresh, 
  IconEye, 
  IconClock, 
  IconPackage, 
  IconPlus, 
  IconTrash, 
  IconCopy, 
  IconDownload,
  IconFilter
} from '@tabler/icons-react';

// TypeScript Interfaces (Updated to match Adobe's actual response format)
interface RecommendationRequest {
  recommendationContext: 'GENERIC' | 'ORDER_PREVIEW' | 'RENEWAL_ORDER_PREVIEW';
  customerId: string;
  country: string;
  language: 'EN' | 'MULT';
  offers?: Array<{
    offerId: string;
    quantity: number;
  }>;
}

interface ProductRecommendation {
  rank: number;
  product: {
    baseOfferId: string;
  };
}

interface RecommendationResponse {
  productRecommendations: {
    upsells: ProductRecommendation[];
    crossSells: ProductRecommendation[];
    addOns: ProductRecommendation[];
  };
}

interface LineItem {
  offerId: string;
  quantity: number;
  productName?: string;
  unitPrice?: number;
  totalPrice?: number;
}

interface PreviewOrderRequest {
  customerId: string;
  country: string;
  currency: string;
  items: LineItem[];
  fetchRecommendations?: boolean;
}

interface PreviewOrderResponse {
  orderId: string;
  customerId: string;
  expirationDate: string;
  status: string;
  items: Array<{
    offerId: string;
    quantity: number;
    productName: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  pricing: {
    currency: string;
    subtotal: number;
    discounts: number;
    taxes: number;
    total: number;
  };
  recommendations?: ProductRecommendation[];
}

interface Subscription {
  subscriptionId: string;
  customerId: string;
  offerId: string;
  productName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  quantity: number;
  pricing: {
    currency: string;
    unitPrice: number;
    totalPrice: number;
  };
}

interface SubscriptionsResponse {
  customerId: string;
  subscriptions: Subscription[];
  totalCount: number;
}

interface Order {
  orderId: string;
  customerId: string;
  status: string;
  orderDate: string;
  totalAmount: number;
  currency: string;
  items: LineItem[];
}

interface OrderResponse {
  order: Order;
}

// Main Component
export const AdobeRecommendations: React.FC<{
  expanded?: boolean;
  onToggle?: () => void;
}> = ({ expanded = true, onToggle }) => {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(
    new Set(['fetch-recommendations', 'preview-order', 'preview-renewal', 'get-subscriptions', 'get-order'])
  );

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
    <Card withBorder shadow="sm" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
      <Group justify="space-between" align="center" mb={expanded ? "md" : 0}>
        <Text fw={700} size="xl" c="#0891b2">
          Adobe Recommendations Management
        </Text>
        {onToggle && (
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={onToggle}
            size="lg"
          >
            {expanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
          </ActionIcon>
        )}
      </Group>

      <Collapse in={expanded}>
        <Stack gap="lg">
          {/* Block 1: Fetch Recommendations - DISABLED until API endpoint is confirmed */}
          {/* <FetchRecommendationsBlock
            expanded={expandedBlocks.has('fetch-recommendations')}
            onToggle={() => toggleBlock('fetch-recommendations')}
          /> */}
          <Card withBorder shadow="sm" radius="md" style={{ opacity: 0.6 }}>
            <Group justify="space-between" mb="md">
              <Group gap="xs">
                <IconSearch size={20} color="#9333ea" />
                <Text fw={600} size="lg" c="dimmed">
                  Fetch Recommendations
                </Text>
                <Badge size="sm" variant="light" color="gray">
                  DISABLED - API ENDPOINT UNAVAILABLE
                </Badge>
              </Group>
            </Group>
            <Text size="sm" c="dimmed" p="md">
              This functionality is temporarily disabled as Adobe's standalone recommendations endpoint 
              is not available in the sandbox environment. Recommendations can be fetched via order preview operations.
            </Text>
          </Card>

          {/* Block 2: Preview Order */}
          <PreviewOrderBlock
            expanded={expandedBlocks.has('preview-order')}
            onToggle={() => toggleBlock('preview-order')}
          />

          {/* Block 3: Preview Order Renewal */}
          <PreviewOrderRenewalBlock
            expanded={expandedBlocks.has('preview-renewal')}
            onToggle={() => toggleBlock('preview-renewal')}
          />

          {/* Block 4: Get Subscriptions */}
          <GetSubscriptionsBlock
            expanded={expandedBlocks.has('get-subscriptions')}
            onToggle={() => toggleBlock('get-subscriptions')}
          />

          {/* Block 5: Get Order */}
          <GetOrderBlock
            expanded={expandedBlocks.has('get-order')}
            onToggle={() => toggleBlock('get-order')}
          />
        </Stack>
      </Collapse>
    </Card>
  );
};

// Block 1: Fetch Recommendations - DISABLED
/* DISABLED BLOCK - Adobe standalone recommendations endpoint not available
const FetchRecommendationsBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [customerId, setCustomerId] = useState('P1005230905');
  const [country, setCountry] = useState('US');
  const [language, setLanguage] = useState<'EN' | 'MULT'>('EN');
  const [offers, setOffers] = useState<Array<{ offerId: string; quantity: number }>>([]);
  const [recommendationContext, setRecommendationContext] = useState<'GENERIC' | 'ORDER_PREVIEW' | 'RENEWAL_ORDER_PREVIEW'>('GENERIC');

  const fetchRecommendations = async () => {
    if (!customerId.trim()) {
      setError('Customer ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use order preview with fetch-recommendations=true to get recommendations
      const response = await fetch(`/api/adobe/proxy/v3/customers/${customerId.trim()}/orders?preview=true&fetch-recommendations=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId.trim(),
          country,
          currency: 'USD',
          items: offers.length > 0 ? offers.map(offer => ({
            offerId: offer.offerId,
            quantity: offer.quantity
          })) : [
            // Default Adobe product for demo
            { offerId: '65322651CA01A12', quantity: 1 }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract recommendations from order preview response
      if (data.recommendations) {
        const transformedData = {
          productRecommendations: {
            upsells: data.recommendations.filter((r: any) => r.type === 'UPSELL').map((r: any, index: number) => ({
              rank: index,
              product: { baseOfferId: r.offerId }
            })),
            crossSells: data.recommendations.filter((r: any) => r.type === 'CROSS_SELL').map((r: any, index: number) => ({
              rank: index,
              product: { baseOfferId: r.offerId }
            })),
            addOns: data.recommendations.filter((r: any) => r.type === 'ADD_ON').map((r: any, index: number) => ({
              rank: index,
              product: { baseOfferId: r.offerId }
            }))
          }
        };
        setRecommendations(transformedData);
        console.log(`Success: Found recommendations via order preview`);
      } else {
        setError('No recommendations found in order preview response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const addOffer = () => {
    setOffers([...offers, { offerId: '', quantity: 1 }]);
  };

  const removeOffer = (index: number) => {
    setOffers(offers.filter((_, i) => i !== index));
  };

  const updateOffer = (index: number, field: keyof typeof offers[0], value: string | number) => {
    const newOffers = [...offers];
    newOffers[index] = { ...newOffers[index], [field]: value };
    setOffers(newOffers);
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconSearch size={20} color="#9333ea" />
          <Text fw={600} size="lg">
            Fetch Recommendations
          </Text>
          <Badge size="sm" variant="light" color="violet" style={{ backgroundColor: '#9333ea20' }}>
            BLOCK 1
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded} transitionDuration={350} transitionTimingFunction="ease-in-out">
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Customer ID"
                placeholder="P1005230905"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Country"
                value={country}
                onChange={(value) => setCountry(value || 'US')}
                data={[
                  { value: 'US', label: 'United States' },
                  { value: 'CA', label: 'Canada' },
                  { value: 'UK', label: 'United Kingdom' },
                  { value: 'DE', label: 'Germany' },
                  { value: 'FR', label: 'France' },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Language"
                value={language}
                onChange={(value) => setLanguage(value as 'EN' | 'MULT' || 'EN')}
                data={[
                  { value: 'EN', label: 'English' },
                  { value: 'MULT', label: 'Multiple Languages' },
                ]}
              />
            </Grid.Col>
          </Grid>

          <Select
            label="Recommendation Context"
            value={recommendationContext}
            onChange={(value) => setRecommendationContext(value as any || 'GENERIC')}
            data={[
              { value: 'GENERIC', label: 'Generic Recommendations' },
              { value: 'ORDER_PREVIEW', label: 'Order Preview Context' },
              { value: 'RENEWAL_ORDER_PREVIEW', label: 'Renewal Order Preview Context' },
            ]}
          />

          <Divider label="Offers (Optional)" labelPosition="left" />
          
          {offers.map((offer, index) => (
            <Grid key={index}>
              <Grid.Col span={8}>
                <TextInput
                  placeholder="Offer ID"
                  value={offer.offerId}
                  onChange={(e) => updateOffer(index, 'offerId', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  placeholder="Quantity"
                  value={offer.quantity}
                  onChange={(value) => updateOffer(index, 'quantity', value || 1)}
                  min={1}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <ActionIcon color="red" onClick={() => removeOffer(index)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          ))}

          <Group>
            <Button leftSection={<IconPlus size={16} />} variant="outline" onClick={addOffer}>
              Add Offer
            </Button>
            <Button 
              leftSection={<IconSearch size={16} />} 
              onClick={fetchRecommendations}
              loading={loading}
              color="violet"
            >
              Fetch Recommendations
            </Button>
          </Group>

          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          {recommendations && (
            <Card withBorder>
              <Text fw={500} mb="md">
                Found {recommendations.productRecommendations.upsells.length + recommendations.productRecommendations.crossSells.length + recommendations.productRecommendations.addOns.length} recommendations
              </Text>
              <Stack gap="sm">
                {recommendations.productRecommendations.upsells.map((rec, index) => (
                  <Card key={`upsell-${index}`} withBorder padding="sm">
                    <Group justify="space-between" align="flex-start">
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Badge size="sm" color="blue">
                            UPSELL
                          </Badge>
                          <Text fw={500}>Rank {rec.rank}</Text>
                          <Text size="sm" c="dimmed">Offer: {rec.product.baseOfferId}</Text>
                        </Group>
                      </Stack>
                      <CopyButton value={rec.product.baseOfferId}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied!' : 'Copy Offer ID'}>
                            <ActionIcon variant="subtle" onClick={copy}>
                              <IconCopy size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  </Card>
                ))}
                {recommendations.productRecommendations.crossSells.map((rec, index) => (
                  <Card key={`crosssell-${index}`} withBorder padding="sm">
                    <Group justify="space-between" align="flex-start">
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Badge size="sm" color="green">
                            CROSS_SELL
                          </Badge>
                          <Text fw={500}>Rank {rec.rank}</Text>
                          <Text size="sm" c="dimmed">Offer: {rec.product.baseOfferId}</Text>
                        </Group>
                      </Stack>
                      <CopyButton value={rec.product.baseOfferId}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied!' : 'Copy Offer ID'}>
                            <ActionIcon variant="subtle" onClick={copy}>
                              <IconCopy size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  </Card>
                ))}
                {recommendations.productRecommendations.addOns.map((rec, index) => (
                  <Card key={`addon-${index}`} withBorder padding="sm">
                    <Group justify="space-between" align="flex-start">
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Badge size="sm" color="orange">
                            ADD_ON
                          </Badge>
                          <Text fw={500}>Rank {rec.rank}</Text>
                          <Text size="sm" c="dimmed">Offer: {rec.product.baseOfferId}</Text>
                        </Group>
                      </Stack>
                      <CopyButton value={rec.product.baseOfferId}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied!' : 'Copy Offer ID'}>
                            <ActionIcon variant="subtle" onClick={copy}>
                              <IconCopy size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};
*/ // END DISABLED BLOCK

// Block 2: Preview Order
const PreviewOrderBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderPreview, setOrderPreview] = useState<PreviewOrderResponse | null>(null);
  const [customerId, setCustomerId] = useState('P1005230905');
  const [country, setCountry] = useState('US');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([
    { productId: '65322650CA01A12', quantity: 1 }
  ]);

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handlePreviewOrder = async () => {
    if (!customerId.trim()) {
      setError('Customer ID is required');
      return;
    }

    const validItems = items.filter(item => item.productId.trim());
    if (validItems.length === 0) {
      setError('At least one product ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        customerId: customerId.trim(),
        country,
        currencyCode: currency,
        orderType: 'NEW',
        items: validItems.map(item => ({
          offerId: item.productId.trim(),
          quantity: item.quantity
        }))
      };

      const response = await fetch(`/api/adobe/proxy/v3/customers/${customerId.trim()}/orders?preview=true&fetch-recommendations=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrderPreview(data);
      console.log('Success: Order preview generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview order');
      console.error('Error previewing order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconEye size={20} color="#2563eb" />
          <Text fw={600} size="lg">
            Preview Order
          </Text>
          <Badge size="sm" variant="light" color="blue" style={{ backgroundColor: '#2563eb20' }}>
            BLOCK 2
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded} transitionDuration={350} transitionTimingFunction="ease-in-out">
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Customer ID"
                placeholder="P1005230905"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Country"
                value={country}
                onChange={(value) => setCountry(value || 'US')}
                data={[
                  { value: 'US', label: 'United States' },
                  { value: 'CA', label: 'Canada' },
                  { value: 'UK', label: 'United Kingdom' },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Currency"
                value={currency}
                onChange={(value) => setCurrency(value || 'USD')}
                data={[
                  { value: 'USD', label: 'US Dollar' },
                  { value: 'EUR', label: 'Euro' },
                  { value: 'GBP', label: 'British Pound' },
                ]}
              />
            </Grid.Col>
          </Grid>

          <Divider label="Order Items" labelPosition="left" />
          
          {items.map((item, index) => (
            <Grid key={index}>
              <Grid.Col span={8}>
                <TextInput
                  placeholder="Product/Offer ID"
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(value) => updateItem(index, 'quantity', value || 1)}
                  min={1}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <ActionIcon color="red" onClick={() => removeItem(index)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          ))}

          <Group>
            <Button leftSection={<IconPlus size={16} />} variant="outline" onClick={addItem}>
              Add Item
            </Button>
            <Button 
              leftSection={<IconEye size={16} />} 
              onClick={handlePreviewOrder}
              loading={loading}
              color="blue"
            >
              Preview Order
            </Button>
          </Group>

          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          {orderPreview && (
            <Card withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={500}>Order Preview</Text>
                <CopyButton value={orderPreview.orderId}>
                  {({ copied, copy }) => (
                    <Button variant="light" size="xs" onClick={copy}>
                      {copied ? 'Copied!' : 'Copy Order ID'}
                    </Button>
                  )}
                </CopyButton>
              </Group>
              
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm"><strong>Order ID:</strong> {orderPreview.orderId}</Text>
                  <Text size="sm"><strong>Customer:</strong> {orderPreview.customerId}</Text>
                  <Text size="sm"><strong>Expires:</strong> {orderPreview.expirationDate}</Text>
                </Grid.Col>
              </Grid>

              <Divider my="md" label="Order Items" />
              
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Unit Price</Table.Th>
                    <Table.Th>Total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {orderPreview.items.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{item.productName}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>{orderPreview.pricing.currency} {item.unitPrice}</Table.Td>
                      <Table.Td>{orderPreview.pricing.currency} {item.totalPrice}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Divider my="md" label="Pricing Summary" />
              
              <Group justify="space-between">
                <Text size="sm">Subtotal:</Text>
                <Text size="sm">{orderPreview.pricing.currency} {orderPreview.pricing.subtotal}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="green">Discounts:</Text>
                <Text size="sm" c="green">-{orderPreview.pricing.currency} {orderPreview.pricing.discounts}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Taxes:</Text>
                <Text size="sm">{orderPreview.pricing.currency} {orderPreview.pricing.taxes}</Text>
              </Group>
              <Divider my="xs" />
              <Group justify="space-between">
                <Text fw={600}>Total:</Text>
                <Text fw={600}>{orderPreview.pricing.currency} {orderPreview.pricing.total}</Text>
              </Group>

              {orderPreview.recommendations && orderPreview.recommendations.length > 0 && (
                <>
                  <Divider my="md" label="Related Recommendations" />
                  <Text fw={500} mb="sm">Related Recommendations ({orderPreview.recommendations.length})</Text>
                  <Stack gap="xs">
                    {orderPreview.recommendations.map((rec, index) => (
                      <Card key={index} withBorder padding="xs">
                        <Group justify="space-between">
                          <Text size="sm">{rec.product.baseOfferId}</Text>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </>
              )}
            </Card>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

// Block 3: Preview Order Renewal
const PreviewOrderRenewalBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renewalPreview, setRenewalPreview] = useState<PreviewOrderResponse | null>(null);
  const [customerId, setCustomerId] = useState('P1005230905');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [country, setCountry] = useState('US');

  const previewRenewal = async () => {
    if (!customerId.trim() || !subscriptionId.trim()) {
      setError('Customer ID and Subscription ID are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        customerId: customerId.trim(),
        subscriptionId: subscriptionId.trim(),
        country
      });

      const response = await fetch(`/api/adobe/proxy/v3/customers/${customerId.trim()}/orders?preview=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId.trim(),
          country,
          currencyCode: 'USD',
          orderType: 'RENEWAL',
          subscriptionId: subscriptionId.trim(),
          items: [
            // Default renewal item - user can modify in UI
            { offerId: '65322651CA01A12', quantity: 1 }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRenewalPreview(data);
      console.log('Success: Renewal preview generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview renewal');
      console.error('Error previewing renewal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconRefresh size={20} color="#f59e0b" />
          <Text fw={600} size="lg">
            Preview Order Renewal
          </Text>
          <Badge size="sm" variant="light" color="orange" style={{ backgroundColor: '#f59e0b20' }}>
            BLOCK 3
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded} transitionDuration={350} transitionTimingFunction="ease-in-out">
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Customer ID"
                placeholder="P1005230905"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Subscription ID"
                placeholder="Enter subscription ID"
                value={subscriptionId}
                onChange={(e) => setSubscriptionId(e.target.value)}
                required
              />
            </Grid.Col>
          </Grid>

          <Select
            label="Country"
            value={country}
            onChange={(value) => setCountry(value || 'US')}
            data={[
              { value: 'US', label: 'United States' },
              { value: 'CA', label: 'Canada' },
              { value: 'UK', label: 'United Kingdom' },
            ]}
          />

          <Button 
            leftSection={<IconRefresh size={16} />} 
            onClick={previewRenewal}
            loading={loading}
            color="orange"
          >
            Preview Renewal
          </Button>

          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          {renewalPreview && (
            <Card withBorder>
              <Text fw={500} mb="md">Renewal Preview</Text>
              <Text size="sm"><strong>Order ID:</strong> {renewalPreview.orderId}</Text>
              <Text size="sm"><strong>Customer:</strong> {renewalPreview.customerId}</Text>
              <Text size="sm"><strong>Total:</strong> {renewalPreview.pricing.currency} {renewalPreview.pricing.total}</Text>
            </Card>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

// Block 4: Get Subscriptions
const GetSubscriptionsBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionsResponse | null>(null);
  const [customerId, setCustomerId] = useState('P1005230905');

  const fetchSubscriptions = async () => {
    if (!customerId.trim()) {
      setError('Customer ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/adobe/proxy/v3/customers/${customerId.trim()}/subscriptions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSubscriptions(data);
      console.log(`Success: Found ${data.subscriptions.length} subscriptions`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconPackage size={20} color="#059669" />
          <Text fw={600} size="lg">
            Get Subscriptions
          </Text>
          <Badge size="sm" variant="light" color="teal" style={{ backgroundColor: '#05966920' }}>
            BLOCK 4
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded} transitionDuration={350} transitionTimingFunction="ease-in-out">
        <Stack gap="md">
          <TextInput
            label="Customer ID"
            placeholder="P1005230905"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />

          <Button 
            leftSection={<IconPackage size={16} />} 
            onClick={fetchSubscriptions}
            loading={loading}
            color="teal"
          >
            Get Subscriptions
          </Button>

          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          {subscriptions && (
            <Card withBorder>
              <Text fw={500} mb="md">
                Found {subscriptions.subscriptions.length} subscriptions for {subscriptions.customerId}
              </Text>
              <Stack gap="sm">
                {subscriptions.subscriptions.map((sub, index) => (
                  <Card key={index} withBorder padding="sm">
                    <Group justify="space-between" align="flex-start">
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Badge size="sm" color={
                            sub.status === 'ACTIVE' ? 'green' : 
                            sub.status === 'INACTIVE' ? 'yellow' : 'red'
                          }>
                            {sub.status}
                          </Badge>
                          <Text fw={500}>{sub.productName}</Text>
                        </Group>
                        <Text size="sm" c="dimmed">Subscription: {sub.subscriptionId}</Text>
                        <Text size="sm">
                          <strong>Price:</strong> {sub.pricing.currency} {sub.pricing.totalPrice} 
                          <Text span c="dimmed" ml="xs">
                            (Qty: {sub.quantity})
                          </Text>
                        </Text>
                        <Text size="sm">
                          <strong>Period:</strong> {sub.startDate} - {sub.endDate || 'Ongoing'}
                        </Text>
                      </Stack>
                      <CopyButton value={sub.subscriptionId}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied!' : 'Copy Subscription ID'}>
                            <ActionIcon variant="subtle" onClick={copy}>
                              <IconCopy size={16} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
};

// Block 5: Get Order
const GetOrderBlock: React.FC<{
  expanded: boolean;
  onToggle: () => void;
}> = ({ expanded, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [customerId, setCustomerId] = useState('P1005230905');
  const [orderId, setOrderId] = useState('');

  const fetchOrder = async () => {
    if (!customerId.trim() || !orderId.trim()) {
      setError('Customer ID and Order ID are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/adobe/proxy/v3/customers/${customerId.trim()}/orders/${orderId.trim()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrder(data);
      console.log('Success: Order retrieved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder shadow="sm" radius="md">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconShoppingCart size={20} color="#7c3aed" />
          <Text fw={600} size="lg">
            Get Order
          </Text>
          <Badge size="sm" variant="light" color="indigo" style={{ backgroundColor: '#7c3aed20' }}>
            BLOCK 5
          </Badge>
        </Group>
        <ActionIcon variant="subtle" onClick={onToggle}>
          {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={expanded} transitionDuration={350} transitionTimingFunction="ease-in-out">
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Customer ID"
                placeholder="P1005230905"
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

          <Button 
            leftSection={<IconShoppingCart size={16} />} 
            onClick={fetchOrder}
            loading={loading}
            color="indigo"
          >
            Get Order
          </Button>

          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}

          {order && (
            <Card withBorder>
              <Group justify="space-between" mb="md">
                <Text fw={500}>Order Details</Text>
                <CopyButton value={order.order.orderId}>
                  {({ copied, copy }) => (
                    <Button variant="light" size="xs" onClick={copy}>
                      {copied ? 'Copied!' : 'Copy Order ID'}
                    </Button>
                  )}
                </CopyButton>
              </Group>
              
              <Text size="sm"><strong>Order ID:</strong> {order.order.orderId}</Text>
              <Text size="sm"><strong>Customer:</strong> {order.order.customerId}</Text>
              <Text size="sm"><strong>Status:</strong> {order.order.status}</Text>
              <Text size="sm"><strong>Date:</strong> {order.order.orderDate}</Text>
              <Text size="sm"><strong>Total:</strong> {order.order.currency} {order.order.totalAmount}</Text>
              
              {order.order.items.length > 0 && (
                <>
                  <Divider my="md" label="Order Items" />
                  <Stack gap="xs">
                    {order.order.items.map((item, index) => (
                      <Group key={index} justify="space-between">
                        <Text size="sm">{item.offerId}</Text>
                        <Text size="sm">Qty: {item.quantity}</Text>
                      </Group>
                    ))}
                  </Stack>
                </>
              )}
            </Card>
          )}
        </Stack>
      </Collapse>
    </Card>
  );
}; 