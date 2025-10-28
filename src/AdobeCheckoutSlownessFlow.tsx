import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Grid, 
  Group, 
  Stack, 
  Badge, 
  Alert,
  TextInput,
  NumberInput,
  ActionIcon,
  Tooltip,
  Table,
  Divider,
  Paper,
  ThemeIcon,
  Loader,
  Anchor
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconCopy, 
  IconTrash, 
  IconX, 
  IconRefresh,
  IconStar,
  IconMessageCircle,
  IconCreditCard,
  IconMapPin,
  IconPhone,
  IconCheck,
  IconAlertTriangle,
  IconLoader
} from '@tabler/icons-react';

const AdobeCheckoutSlownessFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorRef = useRef<HTMLDivElement>(null);

  return (
    <Box style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top Navigation Bar */}
      <Box style={{ backgroundColor: '#3c3c3c', padding: '0.75rem 0' }}>
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group>
              <Text c="white" fw={600} size="lg">AppDirect</Text>
            </Group>
            <Group>
              <TextInput 
                placeholder="Search" 
                size="sm" 
                style={{ width: 300 }}
                rightSection={<ActionIcon variant="subtle" color="white"><IconRefresh size={16} /></ActionIcon>}
              />
            </Group>
            <Group>
              <Button variant="subtle" color="white" size="sm">Manage</Button>
              <Button variant="subtle" color="white" size="sm">Suresh</Button>
              <ActionIcon variant="subtle" color="white" size="lg">
                <IconCreditCard size={20} />
                <Badge size="xs" color="red" style={{ position: 'absolute', top: -5, right: -5 }}>1</Badge>
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Secondary Navigation */}
      <Box style={{ backgroundColor: '#f8f8f8', borderBottom: '1px solid #e5e7eb' }}>
        <Container size="xl">
          <Group gap="xl" py="sm">
            <Anchor c="dimmed" size="sm">Marketplace</Anchor>
            <Anchor c="dark" size="sm" fw={500}>Dashboard</Anchor>
            <Anchor c="dimmed" size="sm">Products</Anchor>
            <Anchor c="dimmed" size="sm">Settings</Anchor>
            <Anchor c="dimmed" size="sm">Reports</Anchor>
            <Anchor c="dimmed" size="sm">Themes</Anchor>
          </Group>
        </Container>
      </Box>

      {/* Main Content */}
      <Container size="xl" py="xl">
        <Routes>
          <Route path="/" element={<OpportunityPageContent errorRef={errorRef} />} />
          <Route path="/dashboard" element={<OpportunityPageContent errorRef={errorRef} />} />
        </Routes>
      </Container>
    </Box>
  );
};

// Opportunity Page Content Component
const OpportunityPageContent: React.FC<{ errorRef: React.RefObject<HTMLDivElement> }> = ({ errorRef }) => {
  const [quantity, setQuantity] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAttemptedQuantity, setLastAttemptedQuantity] = useState<number | null>(null);

  // Load last attempted quantity from localStorage on component mount
  useEffect(() => {
    const savedQuantity = localStorage.getItem('lastAttemptedQuantity');
    if (savedQuantity) {
      setLastAttemptedQuantity(parseInt(savedQuantity, 10));
    }
  }, []);

  // Calculate pricing based on quantity
  const unitPrice = 335.88;
  const totalPrice = quantity * unitPrice;
  const proratedAmount = totalPrice * 0.96; // 96% of total for prorated
  const tax = proratedAmount * 0.05; // 5% tax
  const totalDueToday = proratedAmount + tax;

  const handleSave = async () => {
    // Check if user is trying the same quantity that previously failed
    if (lastAttemptedQuantity !== null && quantity === lastAttemptedQuantity) {
      // Same quantity as last attempt - show success message
      setShowSuccess(true);
      setShowError(false);
      
      // Clear the stored quantity since it was successful
      localStorage.removeItem('lastAttemptedQuantity');
      setLastAttemptedQuantity(null);
      
      // Auto-scroll to success message
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      return;
    }
    
    // Different quantity or first attempt - proceed with normal flow
    setIsSaving(true);
    setIsProcessing(true);
    setLastAttemptedQuantity(quantity);
    
    // Save the attempted quantity to localStorage
    localStorage.setItem('lastAttemptedQuantity', quantity.toString());
    
    // Simulate 5 minutes of processing
    setTimeout(() => {
      setIsSaving(false);
      setIsProcessing(false);
      setShowError(true);
      setShowSuccess(false);
      
      // Auto-scroll to error message
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }, 5000); // 5 seconds for demo (change to 300000 for 5 minutes)
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Grid>
      {/* Main Content */}
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Stack gap="xl">
          {/* Back Navigation */}
          <Group>
            <ActionIcon variant="subtle" size="sm">
              <IconArrowLeft size={16} />
            </ActionIcon>
            <Text size="sm" c="dimmed">OPPORTUNITIES</Text>
          </Group>

          {/* Opportunity Header */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Group>
                <ThemeIcon color="blue" size="lg" radius="md">
                  <IconStar size={20} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" c="dimmed">Opportunity</Text>
                  <Badge color="green" size="sm">OPEN</Badge>
                </Box>
              </Group>
            </Group>
            
            <Title order={3} mb="md">
              Quote version for Adobe Commercial SJ by Appdirect SJ
              <ActionIcon variant="subtle" size="sm" ml="xs">
                <IconEdit size={14} />
              </ActionIcon>
            </Title>
            
            <Group>
              <Button color="blue" disabled={showError || showSuccess}>Finalize</Button>
              <Button variant="outline">Clone Opportunity</Button>
            </Group>
          </Card>

          {/* Success Message */}
          {showSuccess && (
            <Alert 
              ref={errorRef}
              icon={<IconCheck size={16} />} 
              title="Quantity Updated Successfully" 
              color="green"
              mb="md"
            >
              <Text size="sm">
                Your quantity has been successfully updated to {quantity} users. The pricing has been recalculated.
              </Text>
            </Alert>
          )}

          {/* Error Message */}
          {showError && (
            <Alert 
              ref={errorRef}
              icon={<IconAlertTriangle size={16} />} 
              title="System Slowness Detected" 
              color="orange"
              mb="md"
            >
              <Text size="sm" mb="sm">
                We're experiencing slowness from downstream systems. Your changes may not have been saved properly.
              </Text>
              <Button 
                leftSection={<IconRefresh size={16} />} 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
              >
                Refresh Page
              </Button>
            </Alert>
          )}

          {/* Details Section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Details</Title>
              <ActionIcon variant="subtle" size="sm">
                <IconEdit size={14} />
                <Text size="xs" ml="xs">Edit</Text>
              </ActionIcon>
            </Group>
            
            <Grid>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Box>
                    <Text size="sm" c="dimmed">Opportunity Name</Text>
                    <Text size="sm">Quote version for Adobe Commercial SJ by Appdirect SJ</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Created Date</Text>
                    <Text size="sm">10/28/25</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Purchase Effective Date</Text>
                    <Text size="sm">—</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Confirm Currency</Text>
                    <Text size="sm">USD</Text>
                  </Box>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="sm">
                  <Box>
                    <Text size="sm" c="dimmed">Customer</Text>
                    <Anchor size="sm">Adobe Commercial SJ, Suresh Jambhalkar</Anchor>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Owner</Text>
                    <Anchor size="sm">Appdirect SJ, Suresh J</Anchor>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">Opportunity ID</Text>
                    <Group gap="xs">
                      <Text size="sm">161db585-ac7f-42cc-bb18-829b2bb81298</Text>
                      <ActionIcon variant="subtle" size="xs">
                        <IconCopy size={12} />
                      </ActionIcon>
                    </Group>
                  </Box>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Payment Section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Payment</Title>
              <ActionIcon variant="subtle" size="sm">
                <IconEdit size={14} />
                <Text size="xs" ml="xs">Edit</Text>
              </ActionIcon>
            </Group>
            
            <Grid>
              <Grid.Col span={6}>
                <Box>
                  <Text size="sm" c="dimmed" mb="sm">Payment Method</Text>
                  <Group>
                    <ThemeIcon color="blue" size="md" radius="md">
                      <IconCreditCard size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={500}>Visa ending in 1111</Text>
                      <Text size="sm" c="dimmed">Suresh Test</Text>
                      <Text size="sm" c="dimmed">Expires 09/27</Text>
                    </Box>
                  </Group>
                </Box>
              </Grid.Col>
              <Grid.Col span={6}>
                <Box>
                  <Text size="sm" c="dimmed" mb="sm">Billing Address</Text>
                  <Group>
                    <ThemeIcon color="gray" size="md" radius="md">
                      <IconMapPin size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm">123 Amen Corner</Text>
                      <Text size="sm">Raleigh, NC</Text>
                      <Text size="sm">US 27607</Text>
                      <Group gap="xs" mt="xs">
                        <ThemeIcon color="gray" size="sm" radius="md">
                          <IconPhone size={12} />
                        </ThemeIcon>
                        <Text size="sm">5305556465</Text>
                      </Group>
                    </Box>
                  </Group>
                </Box>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Products Section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Products</Title>
            
            <TextInput 
              placeholder="Search to add a product" 
              mb="md"
              rightSection={<ActionIcon variant="subtle"><IconRefresh size={16} /></ActionIcon>}
            />
            
            {/* Product Item */}
            <Paper p="md" withBorder mb="md">
              <Group justify="space-between" mb="md">
                <Group>
                  <ThemeIcon color="red" size="md" radius="md">
                    <Text size="xs" fw={700} c="white">PDF</Text>
                  </ThemeIcon>
                  <Box>
                    <Text fw={500}>Adobe Acrobat Pro for Enterprise (NA)</Text>
                    <Badge size="xs" color="blue">WEB APP</Badge>
                  </Box>
                </Group>
                <Group>
                  <ActionIcon variant="subtle" color="red">
                    <IconTrash size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle">
                    <IconX size={16} />
                  </ActionIcon>
                </Group>
              </Group>
              
              <Stack gap="md">
                {/* Plan */}
                <Box>
                  <Text size="sm" c="dimmed" mb="xs">Plan</Text>
                  <Text size="sm">Pro subscription, annual - Yearly - 1 Year Contract</Text>
                </Box>
                
                {/* Users */}
                <Box>
                  <Text size="sm" c="dimmed" mb="xs">Users</Text>
                  <NumberInput
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    min={1}
                    size="sm"
                    rightSection={<IconCheck size={16} color="green" />}
                    style={{ width: 100 }}
                  />
                  <Text size="xs" c="dimmed" mt="xs">Minimum 1</Text>
                </Box>
                
                {/* Markup */}
                <Box>
                  <Text size="sm" c="dimmed" mb="xs">Apply Markdown / MarkUp % (optional)</Text>
                  <Group gap="xs" mb="xs">
                    <Button variant="filled" size="xs">MarkUp %</Button>
                    <Button variant="outline" size="xs">Markdown %</Button>
                  </Group>
                  <NumberInput
                    value={0}
                    size="sm"
                    style={{ width: 100 }}
                  />
                  <Text size="xs" c="dimmed" mt="xs">Markup the price by using percentage points here</Text>
                </Box>
                
                {/* Pricing Table */}
                <Box>
                  <Text size="sm" c="dimmed" mb="xs">Product Pricing</Text>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Frequency</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Unit wholesale price</Table.Th>
                        <Table.Th>Unit selling price</Table.Th>
                        <Table.Th>Total selling price</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td>Recurring Fee Per User (USER)</Table.Td>
                        <Table.Td>Yearly</Table.Td>
                        <Table.Td>{quantity}</Table.Td>
                        <Table.Td>—</Table.Td>
                        <Table.Td>$335.88</Table.Td>
                        <Table.Td>${totalPrice.toFixed(2)}</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </Box>
                
                {/* Contract Terms */}
                <Box>
                  <Text size="sm" c="dimmed" mb="xs">Contract Terms</Text>
                  <Text size="sm">Length: 1 year(s)</Text>
                  <Button variant="outline" size="xs" mt="xs">Add custom contract</Button>
                </Box>
                
                {/* Date Controls */}
                <Box>
                  <Text size="sm" c="dimmed" mb="xs">Date Controls</Text>
                  <Stack gap="sm">
                    <Box>
                      <Text size="sm" c="dimmed" mb="xs">Request service on:</Text>
                      <Group gap="xs">
                        <Button variant="filled" size="xs">Immediate</Button>
                        <Button variant="outline" size="xs">Fixed date</Button>
                      </Group>
                    </Box>
                    <Box>
                      <Text size="sm" c="dimmed" mb="xs">Billing effective on:</Text>
                      <Group gap="xs">
                        <Button variant="filled" size="xs">Service activation</Button>
                        <Button variant="outline" size="xs">Next billing cycle</Button>
                        <Button variant="outline" size="xs">Fixed date</Button>
                      </Group>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
            
            {/* Action Buttons */}
            <Group justify="flex-end">
              <Button 
                variant="outline" 
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                color="blue" 
                onClick={handleSave}
                disabled={isSaving}
                leftSection={isSaving ? <Loader size="xs" /> : null}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </Group>
          </Card>
        </Stack>
      </Grid.Col>

      {/* Right Sidebar */}
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Stack gap="md">
          {/* Products Summary */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Products Summary</Title>
              <Group>
                <ActionIcon variant="subtle" size="sm">
                  <IconStar size={16} />
                </ActionIcon>
                <ActionIcon variant="subtle" size="sm">
                  <IconMessageCircle size={16} />
                </ActionIcon>
              </Group>
            </Group>
            
            <Paper p="md" withBorder mb="md">
              <Group justify="space-between" mb="sm">
                <Anchor size="sm">Adobe Acrobat Pro for Enterprise (NA)</Anchor>
                <Group>
                  <ActionIcon variant="subtle" color="red" size="sm">
                    <IconTrash size={14} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" size="sm">
                    <IconMessageCircle size={14} />
                  </ActionIcon>
                </Group>
              </Group>
              <Badge size="xs" color="blue" mb="sm">WEB APP</Badge>
              <Text size="sm" c="dimmed" mb="xs">Pro subscription, annual</Text>
              <Text size="sm">1 - {quantity} Users - $335.88/User</Text>
              <Text size="sm" fw={500} mt="xs">${totalPrice.toFixed(2)}</Text>
            </Paper>
            
            {/* Discount Code */}
            <Box mb="md">
              <Text size="sm" c="dimmed" mb="xs">Apply a discount code</Text>
              <Group>
                <TextInput 
                  placeholder="Enter a discount code" 
                  size="sm"
                  style={{ flex: 1 }}
                />
                <Button size="sm">Apply</Button>
              </Group>
            </Box>
            
            {/* Order Totals */}
            <Box>
              <Text size="sm" c="dimmed" mb="xs">
                Prorated charges for period from $323.00 10/28/25 to 10/14/26
              </Text>
              <Group justify="space-between" mb="xs">
                <Text size="sm">Subtotal: *</Text>
                <Text size="sm">${proratedAmount.toFixed(2)}</Text>
              </Group>
              <Group justify="space-between" mb="xs">
                <Text size="sm">Flat Tax</Text>
                <Text size="sm">${tax.toFixed(2)}</Text>
              </Group>
              <Divider my="sm" />
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Total due today *</Text>
                <Text size="sm" fw={500}>${totalDueToday.toFixed(2)}</Text>
              </Group>
              <Text size="xs" c="dimmed">* Estimated values until order is finalized</Text>
            </Box>
          </Card>
          
          {/* Total Estimated Recurring Fees */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Total estimated recurring fees</Title>
              <ActionIcon variant="subtle" size="sm">
                <IconEdit size={14} />
                <Text size="xs" ml="xs">Edit</Text>
              </ActionIcon>
            </Group>
            
            <Text size="sm" c="dimmed" mb="md">
              The amount you pay each billing cycle may vary based on usage, if applicable.
            </Text>
            
            <Group justify="space-between">
              <Text size="sm" fw={500}>Total due yearly</Text>
              <Text size="sm" fw={500}>${totalPrice.toFixed(2)}</Text>
            </Group>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default AdobeCheckoutSlownessFlow;