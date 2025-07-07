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

// New mock data for the specific questions
const companyGrowthData = [
  { month: 'Jun', value: 12500 },
  { month: 'Jul', value: 13200 },
  { month: 'Aug', value: 14100 },
  { month: 'Sep', value: 15300 },
  { month: 'Oct', value: 16800 },
  { month: 'Nov', value: 18500 },
  { month: 'Dec', value: 20400 },
  { month: 'Jan 2023', value: 22600 },
  { month: 'Feb', value: 25100 },
  { month: 'Mar', value: 28200 },
  { month: 'Apr', value: 31800 },
  { month: 'May', value: 35900 }
];

const paidInvoicesData = [
  { month: 'Jun', value: 1850000, status: 'Paid' },
  { month: 'Jul', value: 2100000, status: 'Paid' },
  { month: 'Aug', value: 2400000, status: 'Paid' },
  { month: 'Sep', value: 2200000, status: 'Paid' },
  { month: 'Oct', value: 2650000, status: 'Paid' },
  { month: 'Nov', value: 2900000, status: 'Paid' },
  { month: 'Dec', value: 3100000, status: 'Paid' },
  { month: 'Jan 2023', value: 2950000, status: 'Paid' },
  { month: 'Feb', value: 3200000, status: 'Paid' },
  { month: 'Mar', value: 3450000, status: 'Paid' },
  { month: 'Apr', value: 3600000, status: 'Paid' },
  { month: 'May', value: 3800000, status: 'Paid' }
];

const userGrowthData = [
  { month: 'Jun', value: 145000 },
  { month: 'Jul', value: 152000 },
  { month: 'Aug', value: 159000 },
  { month: 'Sep', value: 167000 },
  { month: 'Oct', value: 176000 },
  { month: 'Nov', value: 186000 },
  { month: 'Dec', value: 197000 },
  { month: 'Jan 2023', value: 209000 },
  { month: 'Feb', value: 222000 },
  { month: 'Mar', value: 236000 },
  { month: 'Apr', value: 251000 },
  { month: 'May', value: 267000 }
];

// Key insight data - single metric
const orderVolumeInsight = {
  value: 81,
  label: 'New Subscriptions',
  subtitle: 'Previous Month',
  change: '+12%',
  changeType: 'increase'
};

// Enhanced Natural Language Processing utility with context memory
const processNaturalLanguageQuery = (query: string, lastContext?: { entity: string; metric: string; title: string } | null) => {
  const lowerQuery = query.toLowerCase();
  
  // Check for visualization-only requests first (context-dependent)
  const visualizationOnlyPatterns = [
    /^make it a? (line|bar|insight)/i,
    /^change to (line|bar|insight)/i,
    /^show as (line|bar|insight)/i,
    /^i want a? (line|bar|insight)/i,
    /^(line|bar|insight) chart$/i,
    /^make this a? (line|bar|insight)/i,
    /^convert to (line|bar|insight)/i,
    /^give me a? (line|bar|insight)/i,
    /^create a? (line|bar|insight)/i
  ];

  // Extract visualization from context request
  let contextVisualization: string | null = null;
  for (const pattern of visualizationOnlyPatterns) {
    const match = query.match(pattern);
    if (match) {
      const vizType = match[1]?.toLowerCase();
      if (vizType === 'line') contextVisualization = 'line';
      else if (vizType === 'bar') contextVisualization = 'bar';
      else if (vizType === 'insight') contextVisualization = 'insight';
      break;
    }
  }

  // If this is a visualization-only request and we have context
  if (contextVisualization && lastContext) {
    return {
      intent: 'change_visualization',
      entity: lastContext.entity,
      metric: lastContext.metric,
      visualization: contextVisualization,
      timeframe: 'last_12_months',
      confidence: 0.95,
      isValidCombination: true,
      suggestions: null,
      isContextual: true
    };
  }

  // If visualization-only request but no context
  if (contextVisualization && !lastContext) {
    return {
      intent: 'need_context',
      entity: null,
      metric: null,
      visualization: contextVisualization,
      timeframe: 'last_12_months',
      confidence: 0.3,
      isValidCombination: false,
      suggestions: ["I'd like to help you create a " + contextVisualization + " chart! What data would you like to visualize? Try asking something like 'Show me commission tickets by provider as a " + contextVisualization + " chart'"]
    };
  }
  
  // Direct pattern matching for supported combinations (most specific patterns first!)
  const patterns = [
    // Provider Sales entity - specific patterns first
    { pattern: /commission tickets by provider/i, entity: 'provider_sales', metric: 'commission_tickets_by_provider', confidence: 0.95 },
    { pattern: /commission tickets by status/i, entity: 'provider_sales', metric: 'commission_tickets_by_status', confidence: 0.95 },
    { pattern: /commission tickets by age/i, entity: 'provider_sales', metric: 'commission_tickets_by_age', confidence: 0.95 },
    { pattern: /commission tickets open v?s? resolved/i, entity: 'provider_sales', metric: 'commission_tickets_open_vs_resolved', confidence: 0.95 },
    { pattern: /commissions by provider/i, entity: 'provider_sales', metric: 'commissions_by_provider', confidence: 0.95 },
    { pattern: /booked order amount by product category/i, entity: 'provider_sales', metric: 'booked_order_amount_by_product_category', confidence: 0.95 },
    { pattern: /booked order amount by provider/i, entity: 'provider_sales', metric: 'booked_order_amount_by_provider', confidence: 0.95 },
    { pattern: /booked order amount/i, entity: 'provider_sales', metric: 'booked_order_amount', confidence: 0.9 },
    { pattern: /quotes created/i, entity: 'provider_sales', metric: 'quotes_created', confidence: 0.9 },
    { pattern: /net billed/i, entity: 'provider_sales', metric: 'net_billed', confidence: 0.9 },
    { pattern: /commission tickets/i, entity: 'provider_sales', metric: 'commission_tickets', confidence: 0.8 },
    { pattern: /booked orders?/i, entity: 'provider_sales', metric: 'booked_orders', confidence: 0.8 },
    
    // Opportunities entity - specific patterns first
    { pattern: /opportunities by status/i, entity: 'opportunities', metric: 'opportunities_by_status', confidence: 0.95 },
    { pattern: /pending approval opportunities by age/i, entity: 'opportunities', metric: 'pending_approval_opportunities_by_age', confidence: 0.95 },
    { pattern: /total opportunities/i, entity: 'opportunities', metric: 'total_opportunities', confidence: 0.9 },
    { pattern: /new opportunities/i, entity: 'opportunities', metric: 'new_opportunities', confidence: 0.9 },
    { pattern: /sales velocity/i, entity: 'opportunities', metric: 'sales_velocity', confidence: 0.9 },
    { pattern: /opportunities/i, entity: 'opportunities', metric: 'new_opportunities', confidence: 0.7 },
    
    // Users entity - specific patterns first
    { pattern: /new users?/i, entity: 'users', metric: 'new_users', confidence: 0.9 },
    { pattern: /users?/i, entity: 'users', metric: 'new_users', confidence: 0.7 },
    
    // Companies entity - specific patterns first
    { pattern: /new compan(y|ies)/i, entity: 'companies', metric: 'new_companies', confidence: 0.9 },
    { pattern: /compan(y|ies)/i, entity: 'companies', metric: 'new_companies', confidence: 0.7 },
    
    // Orders entity
    { pattern: /new subscriptions?/i, entity: 'orders', metric: 'new_subscriptions', confidence: 0.9 },
    { pattern: /orders?/i, entity: 'orders', metric: 'new_subscriptions', confidence: 0.7 },
    
    // Invoices entity
    { pattern: /invoiced amount/i, entity: 'invoices', metric: 'invoiced_amount', confidence: 0.9 },
    { pattern: /invoice/i, entity: 'invoices', metric: 'invoiced_amount', confidence: 0.7 }
  ];

  // Find best matching pattern
  let bestMatch: { pattern: RegExp; entity: string; metric: string; confidence: number } | null = null;
  let bestConfidence = 0;
  
  console.log('Analyzing query:', query); // Debug log
  
  for (const pattern of patterns) {
    if (pattern.pattern.test(query)) {
      console.log('Pattern matched:', pattern.pattern, 'with confidence:', pattern.confidence); // Debug log
      if (pattern.confidence > bestConfidence) {
        bestMatch = pattern;
        bestConfidence = pattern.confidence;
      }
    }
  }
  
  console.log('Best match found:', bestMatch); // Debug log

  // Detect visualization preference
  let visualization = 'bar'; // default
  if (/line|trend|over time|timeline/i.test(query)) {
    visualization = 'line';
  } else if (/insight|metric|number|kpi|summary|total/i.test(query)) {
    visualization = 'insight';
  } else if (/bar|column|chart|graph/i.test(query)) {
    visualization = 'bar';
  }

  // Determine intent
  let intent = 'show_chart';
  if (/compare|comparison/i.test(query)) {
    intent = 'compare';
    visualization = 'bar';
  } else if (/trend|over time/i.test(query)) {
    intent = 'show_trend';
    visualization = 'line';
  } else if (/insight|summary/i.test(query)) {
    intent = 'show_insight';
    visualization = 'insight';
  }

  if (bestMatch) {
    return {
      intent,
      entity: bestMatch.entity,
      metric: bestMatch.metric,
      visualization,
      timeframe: 'last_12_months',
      confidence: Math.min(bestMatch.confidence, 0.95),
      isValidCombination: true,
      suggestions: null,
      isContextual: false
    };
  }

  // Fallback to old logic if no patterns match
  return {
    intent: 'unknown',
    entity: null,
    metric: 'revenue',
    visualization: 'line',
    timeframe: 'last_12_months',
    confidence: 0.2,
    isValidCombination: false,
    suggestions: ["Try asking something like 'Show me new users as an insight' or 'Display commission tickets by provider'"],
    isContextual: false
  };
};

// Generate helpful suggestions when combinations aren't valid
const generateSuggestions = (entity: string | null, widget: string | null, validCombinations: any): string[] => {
  const suggestions: string[] = [];
  
  if (entity && !widget) {
    const availableWidgets = validCombinations[entity] || [];
    if (availableWidgets.length > 0) {
      suggestions.push(`For ${entity}, you can visualize: ${availableWidgets.slice(0, 3).map((w: string) => w.replace(/_/g, ' ')).join(', ')}${availableWidgets.length > 3 ? '...' : ''}`);
    }
  } else if (widget && !entity) {
    // Find which entity this widget belongs to
    for (const [ent, widgets] of Object.entries(validCombinations)) {
      if (Array.isArray(widgets) && widgets.includes(widget)) {
        suggestions.push(`"${widget.replace(/_/g, ' ')}" is available under ${ent}`);
        break;
      }
    }
  } else if (entity && widget) {
    const availableWidgets = validCombinations[entity] || [];
    suggestions.push(`${entity} supports: ${availableWidgets.slice(0, 3).map((w: string) => w.replace(/_/g, ' ')).join(', ')}`);
  } else {
    suggestions.push("Try asking for something like 'Show me new companies as a bar chart' or 'Display commission tickets by provider'");
  }
  
  return suggestions;
};

const calculateConfidence = (query: string, intent: string, metric: string): number => {
  let confidence = 0.3; // Base confidence
  
  // High confidence for specific recognized patterns
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('company growth') || 
      lowerQuery.includes('paid invoices') || 
      lowerQuery.includes('user growth') || 
      lowerQuery.includes('order volume') ||
      lowerQuery.includes('total order')) {
    confidence = 0.9;
  } else {
    // Increase confidence based on keyword matches
    const keywords = ['show', 'display', 'chart', 'revenue', 'users', 'trend', 'over time', 'growth', 'paid', 'invoices', 'volume'];
    const matches = keywords.filter(keyword => lowerQuery.includes(keyword)).length;
    confidence += (matches / keywords.length) * 0.7;
  }
  
  return Math.min(confidence, 1.0);
};

const getDataForMetric = (metric: string, visualization: string = 'bar') => {
  // If it's an insight visualization, return insight data structure
  if (visualization === 'insight') {
    switch (metric) {
      case 'new_users':
        return { value: 267000, label: 'New Users', subtitle: 'This Month', change: '+12%', changeType: 'increase' };
      case 'new_companies':
        return { value: 35900, label: 'New Companies', subtitle: 'This Month', change: '+8%', changeType: 'increase' };
      case 'commission_tickets_by_provider':
        return { value: 142, label: 'Commission Tickets', subtitle: 'By Provider', change: '+5%', changeType: 'increase' };
      case 'commission_tickets_by_status':
        return { value: 89, label: 'Commission Tickets', subtitle: 'By Status', change: '-3%', changeType: 'decrease' };
      case 'commission_tickets':
        return { value: 156, label: 'Commission Tickets', subtitle: 'Total', change: '+7%', changeType: 'increase' };
      case 'booked_orders':
        return { value: 2840, label: 'Booked Orders', subtitle: 'This Month', change: '+15%', changeType: 'increase' };
      case 'quotes_created':
        return { value: 3920, label: 'Quotes Created', subtitle: 'This Month', change: '+22%', changeType: 'increase' };
      case 'opportunities_by_status':
        return { value: 76, label: 'Opportunities', subtitle: 'By Status', change: '+9%', changeType: 'increase' };
      case 'new_opportunities':
        return { value: 124, label: 'New Opportunities', subtitle: 'This Month', change: '+18%', changeType: 'increase' };
      case 'new_subscriptions':
        return { value: 4580, label: 'New Subscriptions', subtitle: 'This Month', change: '+11%', changeType: 'increase' };
      case 'invoiced_amount':
        return { value: '$4.5M', label: 'Invoiced Amount', subtitle: 'This Month', change: '+6%', changeType: 'increase' };
      default:
        return { value: 81, label: 'Business Metric', subtitle: 'Current Period', change: '+12%', changeType: 'increase' };
    }
  }

  // For chart visualizations, return chart data
  switch (metric) {
    case 'revenue':
    case 'invoiced_amount':
      return invoicedData;
    case 'new_users':
    case 'new_companies':
      return monthlyData;
    case 'payments':
      return receivedPaymentsData;
    case 'seats':
      return assignedSeatsData;
    case 'company_growth':
      return companyGrowthData;
    case 'paid_invoices':
      return paidInvoicesData;
    case 'user_growth':
      return userGrowthData;
    case 'order_volume':
      return orderVolumeInsight;
    case 'commission_tickets_by_provider':
    case 'commission_tickets_by_status':
    case 'commission_tickets':
    case 'booked_orders':
    case 'quotes_created':
      return invoicedData; // Using invoiced data as placeholder for provider sales charts
    case 'opportunities_by_status':
    case 'new_opportunities':
      return monthlyData; // Using monthly data as placeholder for opportunities
    case 'new_subscriptions':
      return assignedSeatsData; // Using seats data as placeholder for subscriptions
    default:
      return monthlyData;
  }
};

const getInsightTitle = (metric: string): string => {
  const titles = {
    revenue: 'Revenue Trend',
    invoiced: 'Invoiced Amount',
    invoiced_amount: 'Invoiced Amount',
    users: 'Total Users',
    new_users: 'New Users',
    companies: 'Total Companies',
    new_companies: 'New Companies',
    payments: 'Received Payments', 
    seats: 'Assigned Seats',
    new_subscriptions: 'New Subscriptions',
    company_growth: 'Company Growth',
    paid_invoices: 'Paid Invoices',
    user_growth: 'User Growth',
    order_volume: 'Order Volume',
    commission_tickets: 'Commission Tickets',
    commission_tickets_by_provider: 'Commission Tickets by Provider',
    commission_tickets_by_status: 'Commission Tickets by Status',
    commission_tickets_by_age: 'Commission Tickets by Age',
    commission_tickets_open_vs_resolved: 'Commission Tickets Open vs Resolved',
    commissions_by_provider: 'Commissions by Provider',
    net_billed: 'Net Billed',
    booked_orders: 'Booked Orders',
    booked_order_amount: 'Booked Order Amount',
    booked_order_amount_by_product_category: 'Booked Order Amount by Product Category',
    booked_order_amount_by_provider: 'Booked Order Amount by Provider',
    provisioned_order_amount_pending_commissions: 'Provisioned Order Amount Pending Commissions',
    provisioned_order_count_pending_commissions: 'Provisioned Order Count Pending Commissions',
    quotes_created: 'Quotes Created',
    new_opportunities: 'New Opportunities',
    total_opportunities: 'Total Opportunities',
    opportunities_by_status: 'Opportunities by Status',
    pending_approval_opportunities_by_age: 'Pending Approval Opportunities by Age',
    sales_velocity: 'Sales Velocity'
  };
  return titles[metric as keyof typeof titles] || 'Business Metric';
};

const getSuggestionResponse = (query: string, analysis: any): string => {
  const { metric, confidence } = analysis;
  
  if (confidence < 0.5) {
    return `I'm not entirely sure what you're looking for. Could you try asking something like "Show me company growth" or "Display user growth over time"?`;
  }
  
  const responses = {
    revenue: `I'll show you the revenue trends. This will help you understand how your income has changed over the past year.`,
    invoiced: `Here's your invoiced amount data. This shows the total value of invoices sent to customers.`,
    users: `I'll display your user growth. This metric shows how your customer base has evolved.`,
    companies: `Here's your company growth data. This shows how many new businesses have joined your platform.`,
    payments: `I'll show you received payments. This tracks the actual money collected from customers.`,
    seats: `Here's your seat assignment data. This shows how license utilization has changed.`,
    company_growth: `I'll show you the company growth trends. This displays how your total companies have grown over time.`,
    paid_invoices: `Here's your paid invoices data. This shows the monthly paid invoice amounts.`,
    user_growth: `I'll display your user growth. This shows how your user base has grown cumulatively.`,
    order_volume: `Here's your order volume insight. This shows the total order volume metrics.`
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
    data: any[] | any;
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
  const [entity, setEntity] = useState<string | null>(null);
  const [widgetType, setWidgetType] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<string | null>('bar');
  const [insights, setInsights] = useState<Array<{
    type: string;
    visualization: string;
    title: string;
    data: any[] | any;
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

  // Context memory for AI
  const [lastInsightContext, setLastInsightContext] = useState<{
    entity: string;
    metric: string;
    title: string;
  } | null>(null);

  const entityOptions = [
    { value: 'companies', label: 'Companies' },
    { value: 'invoices', label: 'Invoices' },
    { value: 'leads', label: 'Leads' },
    { value: 'opportunities', label: 'Opportunities' },
    { value: 'orders', label: 'Orders' },
    { value: 'payments', label: 'Payments' },
    { value: 'users', label: 'Users' },
    { value: 'provider_sales', label: 'Provider Sales' }
  ];

  const widgetTypesByEntity = {
    companies: [
      { value: 'new_companies', label: 'New Companies' }
    ],
    invoices: [
      { value: 'invoiced_amount', label: 'Invoiced Amount' }
    ],
    orders: [
      { value: 'new_subscriptions', label: 'New Subscriptions' }
    ],
    users: [
      { value: 'new_users', label: 'New Users' }
    ],
    provider_sales: [
      { value: 'booked_orders', label: 'Booked Orders' },
      { value: 'booked_order_amount', label: 'Booked Order Amount' },
      { value: 'quotes_created', label: 'Quotes Created' },
      { value: 'commission_tickets', label: 'Commission Tickets' },
      { value: 'commission_tickets_by_age', label: 'Commission Tickets by Age' },
      { value: 'commission_tickets_by_provider', label: 'Commission Tickets by Provider' },
      { value: 'commission_tickets_by_status', label: 'Commission Tickets by Status' },
      { value: 'commission_tickets_open_vs_resolved', label: 'Commission Tickets Open v/s Resolved' },
      { value: 'commissions_by_provider', label: 'Commissions by Provider' },
      { value: 'net_billed', label: 'Net Billed' },
      { value: 'booked_order_amount_by_product_category', label: 'Booked Order Amount by Product Category' },
      { value: 'booked_order_amount_by_provider', label: 'Booked Order Amount by Provider' },
      { value: 'provisioned_order_amount_pending_commissions', label: 'Provisioned Order Amount Pending Commissions' },
      { value: 'provisioned_order_count_pending_commissions', label: 'Provisioned Order Count Pending Commissions' }
    ],
    opportunities: [
      { value: 'new_opportunities', label: 'New Opportunities' },
      { value: 'total_opportunities', label: 'Total Opportunities' },
      { value: 'opportunities_by_status', label: 'Opportunities by Status' },
      { value: 'pending_approval_opportunities_by_age', label: 'Pending Approval Opportunities by Age' },
      { value: 'sales_velocity', label: 'Sales Velocity' }
    ],
    leads: [],
    payments: []
  };

  const getWidgetOptions = () => {
    if (!entity) return [];
    return widgetTypesByEntity[entity as keyof typeof widgetTypesByEntity] || [];
  };

  const visualizationOptions = [
    { value: 'bar', label: 'Bar Graph (Default)' },
    { value: 'line', label: 'Line Graph' },
    { value: 'insight', label: 'Key Insight' }
  ];

  // Handle AI message sending
  const handleSendMessage = async (messageText?: string) => {
    const inputText = messageText || currentInput;
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const analysis = processNaturalLanguageQuery(inputText, lastInsightContext);
      console.log('Analysis result:', analysis); // Debug log
      
      let responseContent = '';
      let insight: {
        type: string;
        visualization: string;
        title: string;
        data: any[] | any;
      } | undefined = undefined;

              if (analysis.confidence > 0.5 && analysis.metric) {
          // Successful analysis with data
          insight = {
            type: analysis.metric,
            visualization: analysis.visualization,
            title: getInsightTitle(analysis.metric),
            data: getDataForMetric(analysis.metric, analysis.visualization)
          };

        // Update context for future requests
        setLastInsightContext({
          entity: analysis.entity || '',
          metric: analysis.metric,
          title: getInsightTitle(analysis.metric)
        });

        // Different messages for contextual vs new requests
        if (analysis.isContextual) {
          responseContent = `I've updated the visualization to a ${analysis.visualization} chart for you!`;
        } else {
          responseContent = '';
        }
      } else if (analysis.intent === 'need_context') {
        // Visualization-only request without context
        responseContent = analysis.suggestions?.[0] || "What data would you like to visualize?";
      } else {
        // Low confidence or unknown request
        responseContent = getSuggestionResponse(inputText, analysis);
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        insight
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
    if (!entity || !widgetType || !visualizationType) return;
    
    setInsights([...insights, {
      type: widgetType,
      visualization: visualizationType,
      title: getInsightTitle(widgetType),
      data: getDataForMetric(widgetType, visualizationType)
    }]);
    
    // Reset form
    setEntity(null);
    setWidgetType(null);
    setVisualizationType('bar');
    setCurrentView('dashboard');
  };

  // Cancel and go back to dashboard
  const handleCancel = () => {
    setEntity(null);
    setWidgetType(null);
    setVisualizationType('bar');
    setCurrentView('dashboard');
    // Reset AI messages and context when closing
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
    setLastInsightContext(null);
  };

  const suggestedQuestions = [
    "Show me commission tickets by provider as a bar chart",
    "Display new companies over time as a line graph", 
    "What's the total new users insight for this month?",
    "Create an opportunities by status visualization"
  ];

  // Dynamic suggested questions based on context
  const getContextualSuggestions = () => {
    if (lastInsightContext) {
      return [
        "Make it a line chart",
        "Change to bar chart", 
        "Show as insight",
        "Display new companies over time as a line graph"
      ];
    }
    return suggestedQuestions;
  };

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
            onClick={() => {
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
              setLastInsightContext(null);
              setCurrentView('ai-assistant');
            }}
          >
            Ask AI
          </Button>
        </Group>
      </Group>

      {currentView === 'add-insight' ? (
        /* Add Insight Form - Inline */
        <Box
          style={{
            border: '1px solid #e5e7eb',
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
          <Grid.Col span={4}>
            <Text size="sm" mb={4}>
              Entity <span style={{ color: 'red' }}>*</span>
            </Text>
            <Select
              placeholder="Select an entity"
              data={entityOptions}
              value={entity}
              onChange={(value) => {
                setEntity(value);
                setWidgetType(null); // Reset widget type when entity changes
              }}
              searchable
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Text size="sm" mb={4}>
              Widget Type <span style={{ color: 'red' }}>*</span>
            </Text>
            <Select
              placeholder="Select a widget type"
              data={getWidgetOptions()}
              value={widgetType}
              onChange={setWidgetType}
              searchable
              disabled={!entity}
            />
          </Grid.Col>
          <Grid.Col span={4}>
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

        {!entity || !widgetType ? (
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
                First, select an entity and widget type. Then, choose your visualization to create your first Insight.
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
                  disabled={!entity || !widgetType || !visualizationType}
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
              <CloseButton onClick={handleCancel} size="md" />
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
                                {message.insight.visualization === 'insight' ? (
                                  /* Key Insight Display */
                                  <Box
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      height: '100%',
                                      textAlign: 'center'
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: '36px',
                                        fontWeight: 'bold',
                                        color: '#014929',
                                        lineHeight: 1
                                      }}
                                    >
                                      {message.insight.data.value}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: '12px',
                                        color: '#6c757d',
                                        marginTop: '4px'
                                      }}
                                    >
                                      {message.insight.data.label}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: '10px',
                                        color: '#6c757d',
                                        marginTop: '2px'
                                      }}
                                    >
                                      {message.insight.data.subtitle}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: '10px',
                                        color: message.insight.data.changeType === 'increase' ? '#22c55e' : '#ef4444',
                                        marginTop: '4px',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      {message.insight.data.change}
                                    </Text>
                                  </Box>
                                ) : (
                                  <ResponsiveContainer width="100%" height="100%">
                                    {message.insight.visualization === 'bar' ? (
                                      <BarChart data={Array.isArray(message.insight.data) ? message.insight.data.slice(-6) : []}>
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
                                      <LineChart data={Array.isArray(message.insight.data) ? message.insight.data.slice(-6) : []}>
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
                                )}
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
              {(messages.length <= 1 || lastInsightContext) && (
                <Box>
                  <Text size="sm" fw={500} c="#011B58" mb="sm">
                    {lastInsightContext ? `Try asking (based on your last chart: ${lastInsightContext.title}):` : 'Try asking:'}
                  </Text>
                  <Grid gutter="xs">
                    {getContextualSuggestions().map((question, index) => (
                      <Grid.Col key={index} span={6}>
                        <Button
                          variant="light"
                          size="sm"
                          radius="md"
                          fullWidth
                          leftSection={<IconBulb size={14} />}
                          onClick={() => handleSendMessage(question)}
                          style={{
                            backgroundColor: lastInsightContext ? '#FFF8E7' : '#F0F8FF',
                            border: `1px solid ${lastInsightContext ? '#FFD43B' : '#ABE7FF'}`,
                            color: lastInsightContext ? '#B8860B' : '#0629D3',
                            fontWeight: 400,
                            height: '40px',
                            justifyContent: 'flex-start',
                            padding: '0 12px',
                            '&:hover': {
                              backgroundColor: lastInsightContext ? '#FFF4D6' : '#E6F3FF',
                              borderColor: lastInsightContext ? '#B8860B' : '#0629D3'
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
                    onClick={() => handleSendMessage()}
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
                    onClick={() => {
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
                      setLastInsightContext(null);
                      setCurrentView('ai-assistant');
                    }}
                  >
                    Ask AI
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
                {insight.visualization === 'insight' ? (
                  /* Key Insight Display */
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '200px',
                      textAlign: 'center'
                    }}
                  >
                    <Text
                      style={{
                        fontSize: '72px',
                        fontWeight: 'bold',
                        color: '#6366f1',
                        lineHeight: 1
                      }}
                    >
                      {insight.data.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: '18px',
                        color: '#374151',
                        marginTop: '8px',
                        fontWeight: 500
                      }}
                    >
                      {insight.data.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginTop: '4px'
                      }}
                    >
                      {insight.data.subtitle}
                    </Text>
                    <Text
                      style={{
                        fontSize: '14px',
                        color: insight.data.changeType === 'increase' ? '#22c55e' : '#ef4444',
                        marginTop: '8px',
                        fontWeight: 'bold'
                      }}
                    >
                      {insight.data.change}
                    </Text>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    {insight.visualization === 'bar' ? (
                      <BarChart data={Array.isArray(insight.data) ? insight.data : []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#6366f1" />
                      </BarChart>
                    ) : (
                      <LineChart data={Array.isArray(insight.data) ? insight.data : []}>
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
                )}
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
            >
              <Stack align="center" gap="md" style={{ width: '100%' }}>
                <Text size="sm" color="dimmed" fw={500}>Add another insight</Text>
                <Group gap="sm" justify="center" style={{ width: '100%' }}>
                  <Button
                    variant="light"
                    color="blue"
                    size="sm"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => setCurrentView('add-insight')}
                    style={{ minWidth: '110px', flex: 1 }}
                  >
                    Add Insight
                  </Button>
                  <Button
                    variant="light"
                    color="blue"
                    size="sm"
                    leftSection={<IconRobot size={16} />}
                    onClick={() => {
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
                      setLastInsightContext(null);
                      setCurrentView('ai-assistant');
                    }}
                    style={{ minWidth: '90px', flex: 1 }}
                  >
                    Ask AI
                  </Button>
                </Group>
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