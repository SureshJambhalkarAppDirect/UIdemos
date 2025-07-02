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
  Modal,
  Select,
  CloseButton,
  Table,
  Pagination,
  Badge,
  Chip,
  Textarea,
  Paper,
  Loader,
  ThemeIcon,
  ScrollArea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconGridDots, 
  IconBell, 
  IconShoppingCart, 
  IconSearch,
  IconSettings,
  IconChevronDown,
  IconMaximize,
  IconDotsVertical,
  IconChartBar,
  IconClock,
  IconPlus,
  IconInfoCircle,
  IconDotsVertical as IconMoreVertical,
  IconLayoutGrid,
  IconFilter,
  IconX,
  IconSend,
  IconRobot,
  IconUser,
  IconBulb,
  IconTrendingUp,
  IconChartLine,
  IconChartPie
} from '@tabler/icons-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip
} from 'recharts';

// Mock data for charts
const monthlyData = [
  { month: 'Jun', value: 150000 },
  { month: 'Jul', value: 155000 },
  { month: 'Aug', value: 158000 },
  { month: 'Sep', value: 156000 },
  { month: 'Oct', value: 157000 },
  { month: 'Nov', value: 158000 },
  { month: 'Dec', value: 159000 },
  { month: 'Jan 2023', value: 160000 },
  { month: 'Feb', value: 162000 },
  { month: 'Mar', value: 165000 },
  { month: 'Apr', value: 168000 },
  { month: 'May', value: 170000 }
];

const invoicedData = [
  { month: 'Jun', value: 2500000 },
  { month: 'Jul', value: 3000000 },
  { month: 'Aug', value: 3500000 },
  { month: 'Sep', value: 4000000 },
  { month: 'Oct', value: 4200000 },
  { month: 'Nov', value: 3800000 },
  { month: 'Dec', value: 4000000 },
  { month: 'Jan 2023', value: 4100000 },
  { month: 'Feb', value: 4000000 },
  { month: 'Mar', value: 5500000 },
  { month: 'Apr', value: 5000000 },
  { month: 'May', value: 4500000 }
];

const receivedPaymentsData = [
  { month: 'Jun', value: 150000000 },
  { month: 'Jul', value: 145000000 },
  { month: 'Aug', value: 148000000 },
  { month: 'Sep', value: 146000000 },
  { month: 'Oct', value: 147000000 },
  { month: 'Nov', value: 148000000 },
  { month: 'Dec', value: 149000000 },
  { month: 'Jan 2023', value: 147000000 },
  { month: 'Feb', value: 146000000 },
  { month: 'Mar', value: 145000000 },
  { month: 'Apr', value: 147000000 },
  { month: 'May', value: 150000000 }
];

const assignedSeatsData = [
  { month: 'Jun', value: 4000 },
  { month: 'Jul', value: 4200 },
  { month: 'Aug', value: 4000 },
  { month: 'Sep', value: 3800 },
  { month: 'Oct', value: 4000 },
  { month: 'Nov', value: 4000 },
  { month: 'Dec', value: 3900 },
  { month: 'Jan 2023', value: 4100 },
  { month: 'Feb', value: 4200 },
  { month: 'Mar', value: 16000 },
  { month: 'Apr', value: 5000 },
  { month: 'May', value: 8000 }
];

// Natural Language Processing utility
const processNaturalLanguageQuery = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  // Intent classification
  let intent = 'unknown';
  let metric = 'revenue';
  let visualization = 'line';
  let timeframe = 'last_12_months';
  
  // Detect metrics
  if (lowerQuery.includes('revenue') || lowerQuery.includes('income') || lowerQuery.includes('money') || lowerQuery.includes('sales')) {
    metric = 'revenue';
  } else if (lowerQuery.includes('user') || lowerQuery.includes('customer') || lowerQuery.includes('people')) {
    metric = 'users';
  } else if (lowerQuery.includes('company') || lowerQuery.includes('companies') || lowerQuery.includes('business')) {
    metric = 'companies';
  } else if (lowerQuery.includes('payment') || lowerQuery.includes('paid') || lowerQuery.includes('received')) {
    metric = 'payments';
  } else if (lowerQuery.includes('seat') || lowerQuery.includes('license') || lowerQuery.includes('subscription')) {
    metric = 'seats';
  } else if (lowerQuery.includes('invoice') || lowerQuery.includes('bill')) {
    metric = 'invoiced';
  }
  
  // Detect visualization preference
  if (lowerQuery.includes('bar') || lowerQuery.includes('column')) {
    visualization = 'bar';
  } else if (lowerQuery.includes('line') || lowerQuery.includes('trend') || lowerQuery.includes('over time')) {
    visualization = 'line';
  }
  
  // Detect intent
  if (lowerQuery.includes('show') || lowerQuery.includes('display') || lowerQuery.includes('chart') || lowerQuery.includes('graph')) {
    intent = 'show_chart';
  } else if (lowerQuery.includes('trend') || lowerQuery.includes('growing') || lowerQuery.includes('increasing')) {
    intent = 'show_trend';
    visualization = 'line';
  } else if (lowerQuery.includes('compare') || lowerQuery.includes('comparison')) {
    intent = 'compare';
    visualization = 'bar';
  }
  
  return {
    intent,
    metric,
    visualization,
    timeframe,
    confidence: calculateConfidence(lowerQuery, intent, metric)
  };
};

const calculateConfidence = (query: string, intent: string, metric: string): number => {
  let confidence = 0.3; // Base confidence
  
  // Increase confidence based on keyword matches
  const keywords = ['show', 'display', 'chart', 'revenue', 'users', 'trend', 'over time'];
  const matches = keywords.filter(keyword => query.includes(keyword)).length;
  confidence += (matches / keywords.length) * 0.7;
  
  return Math.min(confidence, 1.0);
};

const getDataForMetric = (metric: string) => {
  switch (metric) {
    case 'revenue':
    case 'invoiced':
      return invoicedData;
    case 'users':
    case 'companies':
      return monthlyData;
    case 'payments':
      return receivedPaymentsData;
    case 'seats':
      return assignedSeatsData;
    default:
      return monthlyData;
  }
};

const getInsightTitle = (metric: string): string => {
  const titles = {
    revenue: 'Revenue Trend',
    invoiced: 'Invoiced Amount',
    users: 'Total Users',
    companies: 'Total Companies',
    payments: 'Received Payments', 
    seats: 'Assigned Seats'
  };
  return titles[metric as keyof typeof titles] || 'Business Metric';
};

const getSuggestionResponse = (query: string, analysis: any): string => {
  const { metric, confidence } = analysis;
  
  if (confidence < 0.5) {
    return `I'm not entirely sure what you're looking for. Could you try asking something like "Show me revenue trends" or "Display user growth over time"?`;
  }
  
  const responses = {
    revenue: `I'll show you the revenue trends. This will help you understand how your income has changed over the past year.`,
    invoiced: `Here's your invoiced amount data. This shows the total value of invoices sent to customers.`,
    users: `I'll display your user growth. This metric shows how your customer base has evolved.`,
    companies: `Here's your company growth data. This shows how many new businesses have joined your platform.`,
    payments: `I'll show you received payments. This tracks the actual money collected from customers.`,
    seats: `Here's your seat assignment data. This shows how license utilization has changed.`
  };
  
  return responses[metric as keyof typeof responses] || `I'll create a visualization for your ${metric} data.`;
};

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insight?: {
    type: string;
    visualization: string;
    title: string;
    data: any[];
  };
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box
    style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      height: '100%'
    }}
  >
    <Group justify="space-between" mb="md">
      <span style={{ fontWeight: 500 }}>{title}</span>
      <Group gap="xs">
        <ActionIcon variant="subtle" size="sm">
          <IconDotsVertical size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" size="sm">
          <IconMaximize size={16} />
        </ActionIcon>
      </Group>
    </Group>
    {children}
  </Box>
);

const CustomView = () => {
  // Track which view we're showing
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-insight' | 'ai-assistant'>('dashboard');
  const [widgetType, setWidgetType] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<string | null>('bar');
  const [insights, setInsights] = useState<Array<{
    type: string;
    visualization: string;
    title: string;
    data: any[];
  }>>([]);

  // AI Assistant state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m your AI analytics assistant. What would you like to explore?',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const widgetOptions = [
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'invoiced', label: 'Invoiced Amount' },
    { value: 'companies', label: 'New Companies' },
    { value: 'seats', label: 'New Subscriptions' },
    { value: 'users', label: 'New Users' }
  ];

  const visualizationOptions = [
    { value: 'bar', label: 'Bar Graph (Default)' },
    { value: 'line', label: 'Line Graph' }
  ];

  // Handle AI message sending
  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const analysis = processNaturalLanguageQuery(currentInput);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '', // No text content - we'll show the chart directly
        timestamp: new Date(),
        insight: analysis.confidence > 0.5 ? {
          type: analysis.metric,
          visualization: analysis.visualization,
          title: getInsightTitle(analysis.metric),
          data: getDataForMetric(analysis.metric)
        } : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  // Insight coming from AI assistant
  const handleAiInsight = (insight: any) => {
    setInsights([...insights, {
      type: insight.type,
      visualization: insight.visualization,
      title: insight.title,
      data: insight.data
    }]);
    setCurrentView('dashboard');
  };

  // Handle manual insight creation
  const handleManualInsight = () => {
    if (!widgetType || !visualizationType) return;
    
    setInsights([...insights, {
      type: widgetType,
      visualization: visualizationType,
      title: getInsightTitle(widgetType),
      data: getDataForMetric(widgetType)
    }]);
    
    // Reset form
    setWidgetType(null);
    setVisualizationType('bar');
    setCurrentView('dashboard');
  };

  // Cancel and go back to dashboard
  const handleCancel = () => {
    setWidgetType(null);
    setVisualizationType('bar');
    setCurrentView('dashboard');
    // Reset AI messages when closing
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: 'Hi! I\'m your AI analytics assistant. What would you like to explore?',
        timestamp: new Date()
      }
    ]);
    setCurrentInput('');
    setIsProcessing(false);
  };

  const suggestedQuestions = [
    "Show me revenue trends over the last year",
    "How is user growth looking?",
    "Display payment data as a bar chart",
    "What's our invoiced amount trend?"
  ];

  return (
    <Box p="md">
      {/* Header */}
      <Group justify="space-between" mb="xl">
          <Group gap="xs">
          <Text>New Dashboard 1</Text>
          <ActionIcon variant="subtle" size="sm">
            <IconMoreVertical size={16} />
          </ActionIcon>
          </Group>
        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            leftSection={<IconPlus size={14} />}
            onClick={() => setCurrentView('add-insight')}
          >
            Add Insight
          </Button>
          <Button
            size="xs"
            variant="light"
            leftSection={<IconRobot size={14} />}
            onClick={() => setCurrentView('ai-assistant')}
          >
            Ask Your Data
          </Button>
        </Group>
      </Group>

      {currentView === 'add-insight' ? (
        /* Add Insight Form - Inline */
        <Box
          style={{
            border: '2px solid #ff6b6b',
            borderRadius: '8px',
            padding: '24px',
            backgroundColor: 'white'
          }}
        >
          <Group justify="space-between" mb="md">
            <Group gap="xs">
              <Text fw={500}>{widgetType ? getInsightTitle(widgetType) : 'New Widget'}</Text>
              <IconLayoutGrid size={16} style={{ color: '#228be6' }} />
            </Group>
            <CloseButton onClick={handleCancel} />
          </Group>

        <Grid gutter="md">
          <Grid.Col span={6}>
            <Text size="sm" mb={4}>
              Widget Type <span style={{ color: 'red' }}>*</span>
            </Text>
            <Select
              placeholder="Select a widget type"
              data={widgetOptions}
              value={widgetType}
              onChange={setWidgetType}
              searchable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" mb={4}>
              Visualisation Type <span style={{ color: 'red' }}>*</span>
            </Text>
            <Select
              data={visualizationOptions}
              value={visualizationType}
              onChange={setVisualizationType}
              disabled={!widgetType}
            />
          </Grid.Col>
        </Grid>

        {!widgetType ? (
          <Box 
            style={{ 
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '24px'
            }}
          >
            <Stack align="center" gap="md">
              <Box 
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#e7f5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconLayoutGrid size={24} color="#228be6" />
              </Box>
              <Text size="sm" color="dimmed" ta="center" maw={300}>
                First, add a widget type. Then, choose and filter your data to create your first Insight.
              </Text>
            </Stack>
          </Box>
        ) : (
          <Box mt="md">
              {/* Preview placeholder */}
            <Table>
              <Table.Thead>
                <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Company</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>193583789</Table.Td>
                    <Table.Td>Live Marketing</Table.Td>
                    <Table.Td>
                      <Badge color="green">PAID</Badge>
                    </Table.Td>
                  </Table.Tr>
              </Table.Tbody>
            </Table>

              <Group mt="xl">
                <Button
                  color="blue"
                  onClick={handleManualInsight}
                  disabled={!widgetType || !visualizationType}
                >
                  Add Insight
                </Button>
                <Button variant="default" onClick={handleCancel}>
                  Cancel
                </Button>
              </Group>
            </Box>
          )}
        </Box>
      ) : currentView === 'ai-assistant' ? (
        /* AI Assistant - Inline */
        <Box
          style={{
            padding: '0',
            backgroundColor: 'white',
            height: 'calc(100vh - 140px)',
            overflow: 'hidden'
          }}
        >
          <Box style={{ padding: 0 }}>
            <Group justify="space-between" mb="xl">
              <Group gap="md">
                <Box
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0629D3 0%, #G41B211 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconRobot size={24} color="white" />
                </Box>
                <Box>
                  <Text fw={600} size="xl" c="#011B58">Ask Your Data Anything</Text>
                  <Text size="sm" c="black" mt={4}>Get instant insights from your business data</Text>
                </Box>
              </Group>
            </Group>
          </Box>

          <Box style={{ padding: '0 32px', height: 'calc(100% - 140px)' }}>
            <Stack gap="xl" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Messages */}
              <Box
                style={{
                  flex: 1,
                  border: '1px solid #F0F0F0',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  padding: '20px',
                  minHeight: '200px',
                  overflow: 'hidden'
                }}
              >
                <ScrollArea h="100%" scrollbars="y">
                  <Stack gap="lg">
                    {messages.map((message, index) => (
                      <Group key={message.id} align="flex-start" gap="md">
                        <Box
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: message.type === 'user' ? '#0629D3' : '#011B58',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {message.type === 'user' ? 
                            <IconUser size={18} color="white" /> : 
                            <IconRobot size={18} color="white" />
                          }
                        </Box>
                        <Box flex={1}>
                          {/* First message (AI greeting) gets special styling */}
                          {index === 0 && message.type === 'assistant' ? (
                            <Paper 
                              p="md" 
                              radius="lg"
                              style={{
                                backgroundColor: '#F0F8FF',
                                border: '1px solid #ABE7FF',
                                boxShadow: 'none'
                              }}
                            >
                              <Text size="sm" c="#0629D3" fw={500} style={{ lineHeight: 1.6 }}>
                                {message.content}
                              </Text>
                            </Paper>
                          ) : message.type === 'assistant' && message.insight ? (
                            /* AI Response with Chart Preview */
                            <Paper 
                              p="lg" 
                              radius="lg"
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #CDFDDA',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                              }}
                            >
                              <Group justify="space-between" align="flex-start" mb="md">
                                <Box>
                                  <Text size="sm" fw={600} c="#014929" mb="xs">
                                    {message.insight.title}
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    Here's a preview of your data visualization
                                  </Text>
                                </Box>
                                <Badge variant="light" color="green" size="sm">
                                  Preview
                                </Badge>
                              </Group>
                              
                              {/* Mini Chart Preview - Fixed Width */}
                              <Box
                                style={{
                                  height: '120px',
                                  width: '400px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '8px',
                                  padding: '12px',
                                  marginBottom: '16px'
                                }}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  {message.insight.visualization === 'bar' ? (
                                    <BarChart data={message.insight.data.slice(-6)}>
                                      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e9ecef" />
                                      <XAxis 
                                        dataKey="month" 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#6c757d' }}
                                      />
                                      <YAxis hide />
                                      <Tooltip 
                                        contentStyle={{
                                          backgroundColor: 'white',
                                          border: '1px solid #dee2e6',
                                          borderRadius: '6px',
                                          fontSize: '12px'
                                        }}
                                      />
                                      <Bar dataKey="value" fill="#014929" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                  ) : (
                                    <LineChart data={message.insight.data.slice(-6)}>
                                      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#e9ecef" />
                                      <XAxis 
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#6c757d' }}
                                      />
                                      <YAxis hide />
                                      <Tooltip 
                                        contentStyle={{
                                          backgroundColor: 'white',
                                          border: '1px solid #dee2e6',
                                          borderRadius: '6px',
                                          fontSize: '12px'
                                        }}
                                      />
                                      <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#014929" 
                                        strokeWidth={2}
                                        dot={{ fill: '#014929', strokeWidth: 0, r: 3 }}
                                        activeDot={{ r: 4, fill: '#014929' }}
                                      />
                                    </LineChart>
                                  )}
                                </ResponsiveContainer>
                              </Box>

                              <Group justify="space-between" align="center">
                                <Text size="xs" c="dimmed">
                                  Click to add this insight to your dashboard
                                </Text>
              <Button 
                                  size="sm"
                                  radius="md"
                                  leftSection={<IconChartLine size={16} />}
                                  onClick={() => handleAiInsight(message.insight)}
                                  style={{
                                    backgroundColor: '#011B58',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: 600,
                                    padding: '8px 20px',
                                    '&:hover': {
                                      backgroundColor: '#001240'
                                    }
                                  }}
                                >
                                  Add to Dashboard
              </Button>
            </Group>
                            </Paper>
                          ) : message.type === 'assistant' && !message.insight ? (
                            /* AI Response without chart (low confidence) */
                            <Paper 
                              p="lg" 
                              radius="lg"
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #CDFDDA',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                              }}
                            >
                              <Text size="sm" style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                I'm not entirely sure what you're looking for. Could you try asking something like "Show me revenue trends" or "Display user growth over time"?
                              </Text>
                            </Paper>
                          ) : (
                            <Paper 
                              p="lg" 
                              radius="lg"
                              style={{
                                backgroundColor: message.type === 'user' ? '#F0F8FF' : 'white',
                                border: message.type === 'user' ? '1px solid #ABE7FF' : '1px solid #CDFDDA',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                              }}
                            >
                              <Text size="sm" style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                {message.content}
                              </Text>
                              {message.insight && (
                                <Box mt="md">
                                  <Button 
                                    size="sm"
                                    radius="md"
                                    leftSection={<IconChartLine size={16} />}
                                    onClick={() => handleAiInsight(message.insight)}
                                    style={{
                                      backgroundColor: '#011B58',
                                      border: 'none',
                                      color: 'white',
                                      fontWeight: 600,
                                      padding: '8px 20px',
                                      '&:hover': {
                                        backgroundColor: '#001240'
                                      }
                                    }}
                                  >
                                    Add This Insight
                                  </Button>
          </Box>
                              )}
                            </Paper>
        )}
      </Box>
                      </Group>
                    ))}
                    {isProcessing && (
                      <Group align="flex-start" gap="md">
                        <Box
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: '#011B58',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <IconRobot size={18} color="white" />
                        </Box>
                        <Paper 
                          p="lg" 
                          radius="lg"
                          style={{
                            backgroundColor: 'white',
                            border: '1px solid #CDFDDA',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                          }}
                        >
                          <Group gap="sm">
                            <Loader size="sm" color="#011B58" />
                            <Text size="sm" c="#011B58" fw={500}>Analyzing your question...</Text>
                          </Group>
                        </Paper>
                      </Group>
                    )}
                  </Stack>
                </ScrollArea>
              </Box>

              {/* Suggested Questions */}
              {messages.length <= 1 && (
                <Box>
                  <Text size="sm" fw={500} c="#011B58" mb="sm">Try asking:</Text>
                  <Grid gutter="xs">
                    {suggestedQuestions.map((question, index) => (
                      <Grid.Col key={index} span={6}>
                        <Button
                          variant="light"
                          size="sm"
                          radius="md"
                          fullWidth
                          leftSection={<IconBulb size={14} />}
                          onClick={() => setCurrentInput(question)}
                          style={{
                            backgroundColor: '#F0F8FF',
                            border: '1px solid #ABE7FF',
                            color: '#0629D3',
                            fontWeight: 400,
                            height: '40px',
                            justifyContent: 'flex-start',
                            padding: '0 12px',
                            '&:hover': {
                              backgroundColor: '#E6F3FF',
                              borderColor: '#0629D3'
                            }
                          }}
                        >
                          <Text size="xs" style={{ textAlign: 'left', lineHeight: 1.3 }}>
                            {question}
                          </Text>
                        </Button>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Input Area */}
              <Box
                style={{
                  border: '2px solid #F0F0F0',
                  borderRadius: '16px',
                  padding: '16px',
                  backgroundColor: 'white',
                  flexShrink: 0
                }}
              >
                <Group gap="md">
                  <TextInput
                    flex={1}
                    placeholder="Ask me anything about your business data..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isProcessing}
                    size="md"
                    radius="lg"
                    style={{
                      '& .mantine-Input-input': {
                        border: 'none',
                        backgroundColor: '#FDFDDA',
                        fontSize: '16px',
                        padding: '16px 20px',
                        '&:focus': {
                          borderColor: '#0629D3',
                          boxShadow: '0 0 0 2px rgba(6, 41, 211, 0.1)'
                        }
                      }
                    }}
                  />
                  <ActionIcon 
                    onClick={handleSendMessage}
                    disabled={!currentInput.trim() || isProcessing}
                    size="xl"
                    radius="lg"
                    style={{
                      background: currentInput.trim() && !isProcessing ? 
                        '#011B58' : 
                        '#F0F0F0',
                      color: currentInput.trim() && !isProcessing ? 'white' : '#011B58',
                      border: 'none',
                      width: '56px',
                      height: '56px',
                      '&:hover': {
                        background: currentInput.trim() && !isProcessing ? 
                          '#001240' : 
                          '#E6E6E6'
                      }
                    }}
                  >
                    <IconSend size={20} />
          </ActionIcon>
        </Group>
              </Box>
            </Stack>
          </Box>
        </Box>
      ) : insights.length === 0 ? (
        /* Empty State */
        <Box 
          style={{ 
            height: 'calc(100vh - 200px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Stack align="center" gap="md">
            <Box 
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#e7f5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconClock size={24} color="#228be6" />
            </Box>
            <Text size="sm" color="dimmed">Start by adding your first insight.</Text>
            <Group gap="sm">
            <Button 
              variant="outline" 
              leftSection={<IconPlus size={16} />}
                onClick={() => setCurrentView('add-insight')}
            >
              Add Insight
            </Button>
              <Button
                variant="outline"
                leftSection={<IconRobot size={16} />}
                onClick={() => setCurrentView('ai-assistant')}
              >
                Ask Your Data
              </Button>
            </Group>
          </Stack>
        </Box>
      ) : (
        /* Grid of Insights */
        <Grid gutter="md">
          {insights.map((insight, index) => (
            <Grid.Col key={index} span={6}>
              <ChartCard title={insight.title}>
                <ResponsiveContainer width="100%" height={200}>
                  {insight.visualization === 'bar' ? (
                    <BarChart data={insight.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" />
                    </BarChart>
                  ) : (
                    <LineChart data={insight.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#6366f1" 
                        dot={{ fill: '#6366f1' }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </ChartCard>
            </Grid.Col>
          ))}
          <Grid.Col span={6}>
            <Box
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #e9ecef'
              }}
              onClick={() => setCurrentView('add-insight')}
            >
              <Stack align="center" gap="md">
                <ActionIcon 
                  variant="light" 
                  color="blue" 
                  size="xl" 
                  radius="xl"
                >
                  <IconPlus size={24} />
                </ActionIcon>
                <Text size="sm" color="dimmed">Add another insight</Text>
              </Stack>
            </Box>
          </Grid.Col>
        </Grid>
      )}
    </Box>
  );
};

const AppInsightsAIFlow = () => {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if we're in custom view
  const isCustomView = location.pathname.includes('/custom-view');

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <img src="/path-to-appdirect-logo.svg" alt="AppDirect" height={30} />
            <ActionIcon variant="subtle"><IconGridDots size={20} /></ActionIcon>
            <ActionIcon variant="subtle"><IconBell size={20} /></ActionIcon>
            <ActionIcon variant="subtle"><IconShoppingCart size={20} /></ActionIcon>
          </Group>
          
          <Group>
            <TextInput
              placeholder="Search"
              leftSection={<IconSearch size={16} />}
              rightSection={
                <Group gap="xs">
                  <span style={{ fontSize: '14px' }}>Marketplace</span>
                  <IconChevronDown size={16} />
                </Group>
              }
              rightSectionWidth={120}
              style={{ width: '400px' }}
            />
            <ActionIcon variant="subtle"><IconSettings size={20} /></ActionIcon>
            <UnstyledButton>
              <Group gap="xs">
                <Avatar radius="xl" size="sm">AA</Avatar>
                <span style={{ fontSize: '14px' }}>AppDirect (Marketplace...</span>
              </Group>
            </UnstyledButton>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          label={
            <Group gap="xs">
              <IconChartBar size={20} />
              <span>Insights</span>
            </Group>
          }
          active
        />
        <NavLink
          label="Marketplace Insights"
          active={!isCustomView}
          pl={48}
          onClick={() => navigate('/appinsights-ai')}
        />
        <NavLink
          label={
            <Group gap="xs">
              <IconClock size={20} />
              <span>Custom View</span>
            </Group>
          }
          active={isCustomView}
          pl={48}
          onClick={() => navigate('/appinsights-ai/custom-view')}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<MarketplaceInsights />} />
          <Route path="/custom-view" element={<CustomView />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

// MarketplaceInsights component with all the charts from before
const MarketplaceInsights = () => (
  <Box p="md">
    <Tabs defaultValue="commerce">
      <Tabs.List>
        <Tabs.Tab value="commerce">Commerce</Tabs.Tab>
        <Tabs.Tab value="products">Products & Orders</Tabs.Tab>
        <Tabs.Tab value="revenue">Revenue</Tabs.Tab>
        <Tabs.Tab value="usage">Company Usage</Tabs.Tab>
      </Tabs.List>
    </Tabs>

    <Grid mt="md" gutter="md">
      <Grid.Col span={6}>
        <ChartCard title="Total Subscriptions">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                dot={{ fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid.Col>

      <Grid.Col span={6}>
        <ChartCard title="Total Companies">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                dot={{ fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid.Col>

      <Grid.Col span={6}>
        <ChartCard title="Invoiced Amount">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={invoicedData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid.Col>

      <Grid.Col span={6}>
        <ChartCard title="Total Users">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                dot={{ fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid.Col>

      <Grid.Col span={6}>
        <ChartCard title="Received Payments">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={receivedPaymentsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid.Col>

      <Grid.Col span={6}>
        <ChartCard title="Assigned Seats">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={assignedSeatsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                dot={{ fill: '#6366f1' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid.Col>
    </Grid>
  </Box>
);

export default AppInsightsAIFlow; 