import React, { useState, useRef, useEffect } from 'react';
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
  ScrollArea,
  Tooltip
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
  IconSparkles,
  IconTrendingUp,
  IconChartLine,
  IconChartPie,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import { processQueryWithLLM, getContextualSuggestions as getEnhancedSuggestions } from './services/llmService';
import { isConfigured, getConfig } from './services/llmConfig';
import LLMSettingsModal from './components/LLMSettingsModal';
import ResponseFeedback from './components/ResponseFeedback';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip as RechartsTooltip
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
    // Handle compound chart names with "chart" suffix
    /^make it a? (pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)/i,
    /^change to a? (pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)/i,
    /^show as a? (pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)/i,
    /^i want a? (pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)/i,
    /^(pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)$/i,
    /^make this a? (pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)/i,
    /^convert to a? (pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)/i,
    /^give me a? (pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)/i,
    /^create a? (pie chart|line chart|bar chart|scatter plot|bubble chart|heatmap|treemap|funnel chart|gauge chart|radar chart|spider chart|area chart|histogram|sankey diagram|waterfall chart|gantt chart|network diagram|map)/i,
    // Handle single word visualization types (backup patterns)
    /^make it a? (line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map)/i,
    /^change to (line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map)/i,
    /^show as (line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map)/i,
    /^i want a? (line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map)/i,
    /^(line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map) chart$/i,
    /^make this a? (line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map)/i,
    /^convert to (line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map)/i,
    /^give me a? (line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map)/i,
    /^create a? (line|bar|insight|pie|scatter|bubble|heatmap|treemap|funnel|gauge|radar|spider|area|histogram|sankey|waterfall|gantt|network|map)/i
  ];

  // Extract visualization from context request
  let contextVisualization: string | null = null;
  let contextIsUnsupportedVisualization = false;
  let contextRequestedVisualization = '';
  
  for (const pattern of visualizationOnlyPatterns) {
    const match = query.match(pattern);
    if (match) {
      const vizType = match[1]?.toLowerCase();
      
      // Map visualization types (both compound and single word forms)
      const vizMapping: { [key: string]: { supported: boolean; actual: string; displayName: string } } = {
        // Supported types
        'line': { supported: true, actual: 'line', displayName: 'line chart' },
        'line chart': { supported: true, actual: 'line', displayName: 'line chart' },
        'bar': { supported: true, actual: 'bar', displayName: 'bar chart' },
        'bar chart': { supported: true, actual: 'bar', displayName: 'bar chart' },
        'insight': { supported: true, actual: 'insight', displayName: 'insight' },
        
        // Unsupported types - single word forms
        'pie': { supported: false, actual: 'bar', displayName: 'pie chart' },
        'scatter': { supported: false, actual: 'bar', displayName: 'scatter plot' },
        'bubble': { supported: false, actual: 'bar', displayName: 'bubble chart' },
        'heatmap': { supported: false, actual: 'bar', displayName: 'heatmap' },
        'treemap': { supported: false, actual: 'bar', displayName: 'treemap' },
        'funnel': { supported: false, actual: 'bar', displayName: 'funnel chart' },
        'gauge': { supported: false, actual: 'bar', displayName: 'gauge chart' },
        'radar': { supported: false, actual: 'bar', displayName: 'radar chart' },
        'spider': { supported: false, actual: 'bar', displayName: 'spider chart' },
        'area': { supported: false, actual: 'bar', displayName: 'area chart' },
        'histogram': { supported: false, actual: 'bar', displayName: 'histogram' },
        'sankey': { supported: false, actual: 'bar', displayName: 'sankey diagram' },
        'waterfall': { supported: false, actual: 'bar', displayName: 'waterfall chart' },
        'gantt': { supported: false, actual: 'bar', displayName: 'gantt chart' },
        'network': { supported: false, actual: 'bar', displayName: 'network diagram' },
        'map': { supported: false, actual: 'bar', displayName: 'map visualization' },
        
        // Unsupported types - compound forms
        'pie chart': { supported: false, actual: 'bar', displayName: 'pie chart' },
        'scatter plot': { supported: false, actual: 'bar', displayName: 'scatter plot' },
        'bubble chart': { supported: false, actual: 'bar', displayName: 'bubble chart' },
        'funnel chart': { supported: false, actual: 'bar', displayName: 'funnel chart' },
        'gauge chart': { supported: false, actual: 'bar', displayName: 'gauge chart' },
        'radar chart': { supported: false, actual: 'bar', displayName: 'radar chart' },
        'spider chart': { supported: false, actual: 'bar', displayName: 'spider chart' },
        'area chart': { supported: false, actual: 'bar', displayName: 'area chart' },
        'sankey diagram': { supported: false, actual: 'bar', displayName: 'sankey diagram' },
        'waterfall chart': { supported: false, actual: 'bar', displayName: 'waterfall chart' },
        'gantt chart': { supported: false, actual: 'bar', displayName: 'gantt chart' },
        'network diagram': { supported: false, actual: 'bar', displayName: 'network diagram' }
      };
      
      const vizInfo = vizMapping[vizType];
      if (vizInfo) {
        contextVisualization = vizInfo.actual;
        contextRequestedVisualization = vizInfo.displayName;
        contextIsUnsupportedVisualization = !vizInfo.supported;
      }
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
      isContextual: true,
      isUnsupportedVisualization: contextIsUnsupportedVisualization,
      requestedVisualization: contextRequestedVisualization
    };
  }

  // If visualization-only request but no context
  if (contextVisualization && !lastContext) {
    const helpMessage = contextIsUnsupportedVisualization 
      ? `${contextRequestedVisualization}s aren't currently supported, but I can help you create a bar chart! What data would you like to visualize? Try asking something like 'Show me commission tickets by provider as a bar chart'`
      : "I'd like to help you create a " + contextRequestedVisualization + "! What data would you like to visualize? Try asking something like 'Show me commission tickets by provider as a " + contextRequestedVisualization + "'";
    
    return {
      intent: 'need_context',
      entity: null,
      metric: null,
      visualization: contextVisualization,
      timeframe: 'last_12_months',
      confidence: 0.3,
      isValidCombination: false,
      suggestions: [helpMessage],
      isUnsupportedVisualization: contextIsUnsupportedVisualization,
      requestedVisualization: contextRequestedVisualization
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
  let isUnsupportedVisualization = false;
  let requestedVisualization = '';
  
  // Supported visualizations
  const supportedVizTypes = ['bar', 'line', 'insight'];
  
  // All possible visualization types (supported + unsupported)
  const allVizPatterns = [
    { pattern: /pie|doughnut|donut/i, name: 'pie chart' },
    { pattern: /scatter|bubble/i, name: 'scatter plot' },
    { pattern: /heatmap|heat map/i, name: 'heatmap' },
    { pattern: /treemap|tree map/i, name: 'treemap' },
    { pattern: /funnel/i, name: 'funnel chart' },
    { pattern: /gauge|speedometer/i, name: 'gauge chart' },
    { pattern: /radar|spider/i, name: 'radar chart' },
    { pattern: /area/i, name: 'area chart' },
    { pattern: /histogram/i, name: 'histogram' },
    { pattern: /box plot|violin plot/i, name: 'box plot' },
    { pattern: /sankey/i, name: 'sankey diagram' },
    { pattern: /waterfall/i, name: 'waterfall chart' },
    { pattern: /gantt/i, name: 'gantt chart' },
    { pattern: /network|node.link/i, name: 'network diagram' },
    { pattern: /geographic|map|choropleth/i, name: 'map visualization' },
    { pattern: /line|trend|over time|timeline/i, name: 'line chart' },
    { pattern: /insight|metric|number|kpi|summary|total/i, name: 'insight' },
    { pattern: /bar|column|chart|graph/i, name: 'bar chart' }
  ];
  
  // Find requested visualization type
  for (const vizPattern of allVizPatterns) {
    if (vizPattern.pattern.test(query)) {
      requestedVisualization = vizPattern.name;
      
      // Check if it's supported
      if (vizPattern.name === 'line chart') {
        visualization = 'line';
      } else if (vizPattern.name === 'insight') {
        visualization = 'insight';
      } else if (vizPattern.name === 'bar chart') {
        visualization = 'bar';
      } else {
        // Unsupported visualization - fallback to bar
        visualization = 'bar';
        isUnsupportedVisualization = true;
      }
      break;
    }
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
      isContextual: false,
      isUnsupportedVisualization,
      requestedVisualization
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

// Enhanced suggestion response with contextual help
const getEnhancedSuggestionResponse = (
  query: string, 
  analysis: any, 
  suggestions: { suggestions: string[], category: string, examples: string[] }
): string => {
  const { suggestions: msgs, category, examples } = suggestions;
  
  let response = '';
  
  // Primary suggestion message
  if (msgs.length > 0) {
    response = msgs[0];
  } else {
    response = "I'd like to help you visualize your data.";
  }
  
  // Add contextual guidance based on category
  switch (category) {
    case 'partial_entity_match':
      response += `\n\nHere are some things you can ask for:\n${examples.map(ex => `• ${ex}`).join('\n')}`;
      break;
    case 'partial_metric_match':
      response += `\n\n${examples[0]}`;
      break;
    case 'general_guidance':
      response += `\n\nTry these examples:\n${examples.map(ex => `• ${ex}`).join('\n')}`;
      break;
    case 'clarification_needed':
      response += `\n\n${examples.join('\n')}`;
      break;
  }
  
  // Add confidence indicator for transparency
  if (analysis.confidence) {
    // Convert confidence to descriptive terms
    const getConfidenceLabel = (confidence: number): string => {
      if (confidence >= 0.9) return "highly confident";
      if (confidence >= 0.75) return "moderately confident";
      if (confidence >= 0.6) return "somewhat confident";
      return "less confident";
    };
    
    const confidenceLabel = getConfidenceLabel(analysis.confidence);
    if (analysis.confidence > 0 && analysis.confidence < 0.7) {
      response += `\n\n*I'm ${confidenceLabel} in my understanding of your request.*`;
    }
  }
  
  return response;
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
  source?: 'llm' | 'pattern' | 'cache';
  confidence?: number;
}

// Utility function to determine if a widget supports drill-down
const isDrillDownEnabled = (widgetTitle: string): boolean => {
  // List of widgets that don't support drill-down
  const nonDrillDownWidgets = [
    'Total Subscriptions',
    'Total Companies',
    'Total Users'
  ];
  
  return !nonDrillDownWidgets.includes(widgetTitle);
};

// Tooltip options for non-drill-down widgets
// You can choose the tooltip text that best fits your needs
const getNonDrillDownTooltip = (widgetTitle: string, option: number = 4): string => {
  const options = {
    // General options
    1: "This view shows summary data that cannot be further broken down",
    2: "This metric provides an overview only",
    3: "No drill-down available for this summary view",
    4: "Averages and totals are aggregated metrics without drill-down options",
    
    // Widget-specific options (kept for reference but not used by default)
    "Total Subscriptions": {
      1: "This view shows aggregate subscription totals across all time periods",
      2: "This growth chart incorporates historical data with no further breakdown available",
      3: "Total subscriptions metric shows combined data with no drill-down option" 
    },
    "Total Companies": {
      1: "This view shows the overall number of companies with no further breakdown available",
      2: "Company count data is presented as an aggregate total only",
      3: "This metric represents system-wide company totals without drill-down capability"
    },
    "Total Users": {
      1: "This view provides a system-wide user count that cannot be broken down further",
      2: "User totals are presented as aggregate metrics without drill-down options",
      3: "This growth chart shows combined user data across all segments"
    }
  };
  
  // Always use option 4 as default unless explicitly overridden
  return options[option] || options[4];
};

// Enhanced ChartCard component with optional badge for non-drill-down widgets
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const canDrillDown = isDrillDownEnabled(title);
  
  return (
    <Paper p="md" withBorder style={{ height: '100%' }}>
      <Group justify="space-between" mb="sm">
        <Text fw={500} size="md">{title}</Text>
        <Group gap="xs">
          {!canDrillDown && (
            <Tooltip 
              label={getNonDrillDownTooltip(title)} 
              position="top"
              withArrow
              arrowPosition="center"
            >
              <Badge 
                size="xs" 
                color="gray" 
                variant="light"
                style={{ 
                  opacity: 0.7,
                  textTransform: 'none',
                  fontWeight: 400
                }}
              >
                View only
              </Badge>
            </Tooltip>
          )}
          <ActionIcon variant="subtle" size="sm">
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Group>
      </Group>
      {children}
    </Paper>
  );
};

// Move generateMockDrillDownData out of the components to be shared
// Function to generate mock drill-down data
const generateMockDrillDownData = (title: string, dataPoint: any) => {
  // Different mock data based on widget type
  if (title === "Invoiced Amount") {
    // Generate invoices data
    return Array(508).fill(0).map((_, i) => ({
      invoiceNumber: `2145${Math.floor(10000 + Math.random() * 90000)}`,
      companyName: ["Wilson appdistribution test", "Jan 31 Indirect Provider", "UserAssignment - 0831", "Appdirect", "SandhyaUATHGO"][Math.floor(Math.random() * 5)],
      dueDate: `2025-06-${String(Math.floor(1 + Math.random() * 30)).padStart(2, '0')}`,
      balanceDue: "0.00",
      isRefund: "N",
      status: "PAID",
      total: [
        "0.00", 
        "19.03", 
        "235.61", 
        "420.94", 
        "6492.18"
      ][Math.floor(Math.random() * 5)]
    }));
  } else if (title === "Received Payments") {
    // Generate payments data
    return Array(128).fill(0).map((_, i) => ({
      paymentId: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      companyName: ["Wilson appdistribution", "Jan 31 Provider", "Enterprise Customer", "Appdirect", "GlobalTech Inc."][Math.floor(Math.random() * 5)],
      paymentDate: `2025-06-${String(Math.floor(1 + Math.random() * 30)).padStart(2, '0')}`,
      amount: [
        "125.50", 
        "892.75", 
        "1435.25", 
        "2750.00", 
        "5125.90"
      ][Math.floor(Math.random() * 5)],
      method: ["Credit Card", "ACH", "Wire Transfer", "Check", "PayPal"][Math.floor(Math.random() * 5)],
      status: ["Completed", "Processing", "Completed", "Completed", "Failed"][Math.floor(Math.random() * 5)]
    }));
  } else {
    // Generic data for other drill-down widgets
    return Array(52).fill(0).map((_, i) => ({
      id: `ITEM-${Math.floor(10000 + Math.random() * 90000)}`,
      name: `Record ${i+1}`,
      date: `2025-06-${String(Math.floor(1 + Math.random() * 30)).padStart(2, '0')}`,
      value: `${Math.floor(100 + Math.random() * 9900)}.${Math.floor(10 + Math.random() * 90)}`,
      category: ["Category A", "Category B", "Category C", "Category D"][Math.floor(Math.random() * 4)],
      status: ["Active", "Pending", "Completed", "On Hold"][Math.floor(Math.random() * 4)]
    }));
  }
};

const CustomView = () => {
  // Track which view we're showing
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-insight' | 'ai-assistant'>('dashboard');
  const [entity, setEntity] = useState<string | null>(null);
  const [widgetType, setWidgetType] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<string | null>('bar');
  const [timeFrame, setTimeFrame] = useState<string>('last_1_month');
  const [aggregatedBy, setAggregatedBy] = useState<string>('monthly');
  const [insights, setInsights] = useState<Array<{
    type: string;
    visualization: string;
    title: string;
    data: any[] | any;
  }>>([]);

  // Drill-down modal state
  const [drillDownModalOpen, setDrillDownModalOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{
    title: string;
    dataPoint: any;
    results: any[];
  } | null>(null);

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
  
  // Scroll area ref for auto-scrolling
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        // Smooth animated scroll to bottom
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages]);

  // Context memory for AI
  const [lastInsightContext, setLastInsightContext] = useState<{
    entity: string;
    metric: string;
    title: string;
  } | null>(null);

  // LLM Settings modal
  const [settingsModalOpened, setSettingsModalOpened] = useState(false);

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

  // Group By options based on widget type
  const getGroupByOptions = () => {
    if (!widgetType) return [];
    
    // For new and total opportunities, add Status group by
    if (widgetType === 'new_opportunities' || widgetType === 'total_opportunities') {
      return [{ value: 'status', label: 'Status' }];
    }
    
    // Add more group by options for other widget types as needed
    return [];
  };

  // Time Frame options
  const timeFrameOptions = [
    { value: 'last_1_month', label: 'Last 1 month' },
    { value: 'last_3_months', label: 'Last 3 months' },
    { value: 'last_6_months', label: 'Last 6 months' },
    { value: 'last_12_months', label: 'Last 12 months' },
    { value: 'last_24_months', label: 'Last 24 months' },
    { value: 'last_36_months', label: 'Last 36 months' }
  ];

  // Aggregated By options with smart logic
  const getAggregatedByOptions = () => {
    const baseOptions = [
      { value: 'yearly', label: 'Yearly' },
      { value: 'quarterly', label: 'Quarterly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'daily', label: 'Daily' }
    ];

    // If timeframe is Last 1 month, disable yearly and quarterly
    if (timeFrame === 'last_1_month') {
      return baseOptions.map(option => ({
        ...option,
        disabled: option.value === 'yearly' || option.value === 'quarterly'
      }));
    }

    return baseOptions;
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

    console.log(`🚀 Processing Query: "${inputText}"`);

    try {
      // Use LLM API with fallback to pattern matching
      const llmResponse = await processQueryWithLLM(inputText, lastInsightContext);
      console.log('LLM Response:', llmResponse); // Debug log
      
      const analysis = llmResponse.data;
      if (!analysis) {
        throw new Error('No analysis data received');
      }
      
      // Determine source for visual indicator
      const source = llmResponse.usedCache ? 'cache' : (llmResponse.fallbackUsed ? 'pattern' : 'llm');
      console.log(`🔧 AI Response Source: ${source.toUpperCase()}`, { 
        usedCache: llmResponse.usedCache, 
        fallbackUsed: llmResponse.fallbackUsed, 
        confidence: analysis?.confidence 
      });
      
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
        if (analysis.isContextual && analysis.isUnsupportedVisualization) {
          responseContent = `${analysis.requestedVisualization}s aren't currently supported, so I've updated the visualization to a bar chart for you instead. This will clearly show your data with easy-to-compare bars.`;
        } else if (analysis.isContextual) {
          responseContent = `I've updated the visualization to a ${analysis.visualization} chart for you!`;
        } else if (analysis.isUnsupportedVisualization) {
          responseContent = `${analysis.requestedVisualization}s aren't currently supported, so I've created a bar chart visualization for you instead. This will clearly show your data with easy-to-compare bars.`;
        } else {
          responseContent = '';
        }
      } else if (analysis.intent === 'need_context') {
        // Visualization-only request without context
        responseContent = analysis.suggestions?.[0] || "What data would you like to visualize?";
      } else {
        // Low confidence or unknown request - use enhanced graceful fallbacks
        const suggestions = getEnhancedSuggestions(
          inputText,
          analysis.entity,
          analysis.metric,
          analysis.confidence
        );
        
        responseContent = getEnhancedSuggestionResponse(inputText, analysis, suggestions);
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        insight,
        source,
        confidence: analysis.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    } catch (error) {
      console.error('LLM processing failed:', error);
      
      // Fallback to pattern matching
      const analysis = processNaturalLanguageQuery(inputText, lastInsightContext);
      
      let responseContent = '';
      let insight: {
        type: string;
        visualization: string;
        title: string;
        data: any[] | any;
      } | undefined = undefined;

      if (analysis.confidence > 0.5 && analysis.metric) {
        insight = {
          type: analysis.metric,
          visualization: analysis.visualization,
          title: getInsightTitle(analysis.metric),
          data: getDataForMetric(analysis.metric, analysis.visualization)
        };

        setLastInsightContext({
          entity: analysis.entity || '',
          metric: analysis.metric,
          title: getInsightTitle(analysis.metric)
        });

        if (analysis.isContextual && analysis.isUnsupportedVisualization) {
          responseContent = `${analysis.requestedVisualization}s aren't currently supported, so I've updated the visualization to a bar chart for you instead. This will clearly show your data with easy-to-compare bars.`;
        } else if (analysis.isContextual) {
          responseContent = `I've updated the visualization to a ${analysis.visualization} chart for you!`;
        } else if (analysis.isUnsupportedVisualization) {
          responseContent = `${analysis.requestedVisualization}s aren't currently supported, so I've created a bar chart visualization for you instead. This will clearly show your data with easy-to-compare bars.`;
        } else {
          responseContent = '';
        }
      } else {
        responseContent = "I'm having trouble understanding your request. Try asking something like 'Show me new companies as a bar chart'";
      }
      
      console.log(`🔧 AI Response Source: PATTERN (Fallback)`, { 
        confidence: analysis.confidence,
        intent: analysis.intent,
        entity: analysis.entity 
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        insight,
        source: 'pattern',
        confidence: analysis.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }
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
    setGroupBy(null);
    setVisualizationType('bar');
    setTimeFrame('last_1_month');
    setAggregatedBy('monthly');
    setCurrentView('dashboard');
  };

  // Cancel and go back to dashboard
  const handleCancel = () => {
    setEntity(null);
    setWidgetType(null);
    setGroupBy(null);
    setVisualizationType('bar');
    setTimeFrame('last_1_month');
    setAggregatedBy('monthly');
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

  // Add a handler for chart point clicks
  const handleChartPointClick = (title: string, dataPoint: any) => {
    // Only open drill-down for widgets that support it
    if (isDrillDownEnabled(title)) {
      // Generate mock data based on the clicked data point
      const mockResults = generateMockDrillDownData(title, dataPoint);
      
      setDrillDownData({
        title,
        dataPoint,
        results: mockResults
      });
      
      setDrillDownModalOpen(true);
    }
  };

  // Add a specific handler for message chart clicks
  const handleMessageChartClick = (title: string, dataPoint: any) => {
    // Only open drill-down for widgets that support it
    if (isDrillDownEnabled(title)) {
      // Generate mock data based on the clicked data point
      const mockResults = generateMockDrillDownData(title, dataPoint);
      
      setDrillDownData({
        title,
        dataPoint,
        results: mockResults
      });
      
      setDrillDownModalOpen(true);
    }
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
          {currentView === 'ai-assistant' && (
            <Group gap="xs">
              <ActionIcon
                variant="light"
                size="lg"
                onClick={() => setSettingsModalOpened(true)}
                color={isConfigured() ? "green" : "orange"}
                title="Configure LLM API Settings"
              >
                <IconSettings size={16} />
              </ActionIcon>
            </Group>
          )}
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
                setGroupBy(null); // Reset group by when entity changes
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
              onChange={(value) => {
                setWidgetType(value);
                setGroupBy(null); // Reset group by when widget type changes
              }}
              searchable
              disabled={!entity}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Text size="sm" mb={4}>
              Group By
            </Text>
            <Select
              placeholder={!entity ? "Select entity first" : getGroupByOptions().length > 0 ? "Select group by" : "No grouping available"}
              data={getGroupByOptions()}
              value={groupBy}
              onChange={setGroupBy}
              disabled={!entity || getGroupByOptions().length === 0}
              clearable
            />
          </Grid.Col>
        </Grid>
        
        <Grid gutter="md" mt="md">
          <Grid.Col span={4}>
            <Text size="sm" mb={4}>
              Visualisation Type <span style={{ color: 'red' }}>*</span>
            </Text>
            <Select
              placeholder="Select visualisation type"
              data={visualizationOptions}
              value={visualizationType}
              onChange={setVisualizationType}
              disabled={!entity}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Text size="sm" mb={4}>
              Time Frame <span style={{ color: 'red' }}>*</span>
            </Text>
            <Select
              placeholder="Select time frame"
              data={timeFrameOptions}
              value={timeFrame}
              onChange={(value) => {
                setTimeFrame(value || 'last_1_month');
                // Reset aggregated by to monthly if current selection becomes disabled
                if (value === 'last_1_month' && (aggregatedBy === 'yearly' || aggregatedBy === 'quarterly')) {
                  setAggregatedBy('monthly');
                }
              }}
              disabled={!entity}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Text size="sm" mb={4}>
              Aggregated By <span style={{ color: 'red' }}>*</span>
            </Text>
            <Select
              placeholder="Select aggregation"
              data={getAggregatedByOptions()}
              value={aggregatedBy}
              onChange={(value) => setAggregatedBy(value || 'monthly')}
              disabled={!entity}
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
                  disabled={!entity || !widgetType || !visualizationType || !timeFrame || !aggregatedBy}
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
        /* AI Assistant - Apple-Style Unified Conversation */
        <Box
          style={{
            backgroundColor: 'white',
            height: 'calc(100vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Simplified Header */}
          <Box style={{ 
            padding: '20px 32px', 
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f8f9fa'
          }}>
            <Group justify="space-between" align="center">
              <Text fw={600} size="xl" c="#011B58">Ask Your Data Anything</Text>
              <CloseButton onClick={handleCancel} size="md" />
            </Group>
          </Box>

          {/* Unified Conversation Stream */}
          <Box style={{ flex: 1, padding: '0 32px', overflow: 'hidden' }}>
            <ScrollArea h="100%" scrollbars="y" ref={scrollAreaRef}>
              <Stack gap="lg" style={{ paddingTop: '24px', paddingBottom: '32px' }}>
                {/* Conversation Messages */}
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
                          {/* First message (AI greeting) - Apple style clean */}
                          {index === 0 && message.type === 'assistant' ? (
                            <Box>
                              <Text size="sm" c="#011B58" fw={500} style={{ lineHeight: 1.6 }}>
                                {message.content}
                              </Text>
                            </Box>
                          ) : message.type === 'assistant' && message.insight ? (
                            /* AI Response with Chart Preview */
                            <Paper 
                              p="md" 
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
                                <Group gap="xs">
                                <Badge variant="light" color="green" size="sm">
                                  Preview
                                </Badge>
                                </Group>
                              </Group>
                              
                              {/* Chart and Button Container - Proper Alignment */}
                              <Group align="flex-end" justify="space-between" style={{ width: '100%' }}>
                                {/* Mini Chart Preview */}
                                <Box
                                  style={{
                                    height: '200px',
                                    width: '400px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '12px'
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
                                        <RechartsTooltip 
                                          contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #dee2e6',
                                            borderRadius: '6px',
                                            fontSize: '12px'
                                          }}
                                        />
                                        <Bar 
                                          dataKey="value" 
                                          fill="#014929" 
                                          radius={[2, 2, 0, 0]} 
                                          style={{ cursor: message.insight && isDrillDownEnabled(message.insight.title) ? 'pointer' : 'default' }}
                                          onClick={message.insight && isDrillDownEnabled(message.insight.title) ? (data) => {
                                            const insight = message.insight;
                                            if (insight) {
                                              handleMessageChartClick(insight.title, data);
                                            }
                                          } : undefined}
                                        />
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
                                        <RechartsTooltip 
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
                                          dot={{ 
                                            fill: '#014929', 
                                            strokeWidth: 0, 
                                            r: 3,
                                            cursor: message.insight && isDrillDownEnabled(message.insight.title) ? 'pointer' : 'default' 
                                          }}
                                          activeDot={{ 
                                            r: 4, 
                                            fill: '#014929',
                                            cursor: message.insight && isDrillDownEnabled(message.insight.title) ? 'pointer' : 'default'
                                          }}
                                          onClick={message.insight && isDrillDownEnabled(message.insight.title) ? (data) => {
                                            const insight = message.insight;
                                            if (insight) {
                                              handleMessageChartClick(insight.title, data);
                                            }
                                          } : undefined}
                                        />
                                      </LineChart>
                                    )}
                                  </ResponsiveContainer>
                                )}
                                </Box>

                                {/* Add to Dashboard Button - Bottom Aligned */}
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
                              
                              {/* Feedback Component for Insights */}
                              <Box mt="sm" pt="sm" style={{ borderTop: '1px solid #f0f0f0' }}>
                                <ResponseFeedback
                                  messageId={message.id}
                                  query={messages[index - 1]?.content || ''}
                                  response={message.content}
                                  source={message.source || 'pattern'}
                                  confidence={message.confidence}
                                />
                              </Box>
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
                                {message.content || "I'm not entirely sure what you're looking for. Could you try asking something like 'Show me revenue trends' or 'Display user growth over time'?"}
                              </Text>
                              
                              {/* Feedback Component for Suggestions */}
                              <Box mt="sm" pt="sm" style={{ borderTop: '1px solid #f0f0f0' }}>
                                <ResponseFeedback
                                  messageId={message.id}
                                  query={messages[index - 1]?.content || ''}
                                  response={message.content}
                                  source={message.source || 'pattern'}
                                  confidence={message.confidence}
                                />
                              </Box>
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
                                <>
                                  <Box style={{ height: '220px', marginTop: '16px', marginBottom: '8px', position: 'relative' }}>
                                    {!isDrillDownEnabled(message.insight.title) && message.insight.visualization !== 'insight' && (
                                      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                                        <Tooltip
                                          label={getNonDrillDownTooltip(message.insight.title)}
                                          position="top"
                                          withArrow
                                        >
                                          <Badge 
                                            size="xs" 
                                            color="gray" 
                                            variant="light"
                                            style={{ 
                                              opacity: 0.7,
                                              textTransform: 'none',
                                              fontWeight: 400
                                            }}
                                          >
                                            View only
                                          </Badge>
                                        </Tooltip>
                                      </div>
                                    )}
                                    {message.insight.visualization === 'insight' ? (
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
                                            fontSize: '72px',
                                            fontWeight: 'bold',
                                            color: '#6366f1',
                                            lineHeight: 1
                                          }}
                                        >
                                          {message.insight.data.value}
                                        </Text>
                                        <Text
                                          style={{
                                            fontSize: '18px',
                                            color: '#374151',
                                            marginTop: '8px',
                                            fontWeight: 500
                                          }}
                                        >
                                          {message.insight.data.label}
                                        </Text>
                                        <Text
                                          style={{
                                            fontSize: '14px',
                                            color: '#6b7280',
                                            marginTop: '4px'
                                          }}
                                        >
                                          {message.insight.data.subtitle}
                                        </Text>
                                        <Text
                                          style={{
                                            fontSize: '14px',
                                            color: message.insight.data.changeType === 'increase' ? '#22c55e' : '#ef4444',
                                            marginTop: '8px',
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
                                            <RechartsTooltip 
                                              contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                              }}
                                            />
                                            <Bar 
                                              dataKey="value" 
                                              fill="#014929" 
                                              radius={[2, 2, 0, 0]} 
                                              style={{ cursor: message.insight && isDrillDownEnabled(message.insight.title) ? 'pointer' : 'default' }}
                                              onClick={message.insight && isDrillDownEnabled(message.insight.title) ? (data) => {
                                                const insight = message.insight;
                                                if (insight) {
                                                  handleMessageChartClick(insight.title, data);
                                                }
                                              } : undefined}
                                            />
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
                                            <RechartsTooltip 
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
                                              dot={{ 
                                                fill: '#014929', 
                                                strokeWidth: 0, 
                                                r: 3,
                                                cursor: message.insight && isDrillDownEnabled(message.insight.title) ? 'pointer' : 'default' 
                                              }}
                                              activeDot={{ 
                                                r: 4, 
                                                fill: '#014929',
                                                cursor: message.insight && isDrillDownEnabled(message.insight.title) ? 'pointer' : 'default'
                                              }}
                                              onClick={message.insight && isDrillDownEnabled(message.insight.title) ? (data) => {
                                                const insight = message.insight;
                                                if (insight) {
                                                  handleMessageChartClick(insight.title, data);
                                                }
                                              } : undefined}
                                            />
                                          </LineChart>
                                        )}
                                      </ResponsiveContainer>
                                    )}
                                  </Box>
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
                                      }}
                                    >
                                      Add This Insight
                                    </Button>
                                  </Box>
                                </>
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

                {/* Suggested Questions as natural conversation elements */}
                {(messages.length <= 1 || lastInsightContext) && (
                  <Group align="flex-start" gap="md">
                    <Box
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#011B58',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <IconRobot size={18} color="white" />
                    </Box>
                    <Box flex={1}>
                      <Text size="sm" c="#011B58" fw={500} style={{ marginBottom: '12px', lineHeight: 1.6 }}>
                        {lastInsightContext ? `Based on your ${lastInsightContext.title}:` : 'Here are some things you can try:'}
                      </Text>
                      <Grid gutter="xs">
                        {getContextualSuggestions().map((question, index) => (
                          <Grid.Col key={index} span={6}>
                            <Button
                              variant="subtle"
                              size="sm"
                              radius="xl"
                              fullWidth
                              leftSection={<IconSparkles size={12} />}
                              onClick={() => handleSendMessage(question)}
                              style={{
                                backgroundColor: 'rgba(6, 41, 211, 0.08)',
                                border: '1px solid rgba(6, 41, 211, 0.2)',
                                color: '#0629D3',
                                fontWeight: 400,
                                justifyContent: 'flex-start',
                                height: 'auto',
                                padding: '8px 12px',
                                whiteSpace: 'normal',
                                textAlign: 'left',
                                '&:hover': {
                                  backgroundColor: 'rgba(6, 41, 211, 0.12)',
                                  borderColor: '#0629D3'
                                }
                              }}
                            >
                              <Text size="sm" style={{ lineHeight: 1.4 }}>
                                {question}
                              </Text>
                            </Button>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Box>
                  </Group>
                )}
              </Stack>
            </ScrollArea>
          </Box>

          {/* Fixed Input Area at Bottom - Apple Style */}
          <Box
            style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: '#f8f9fa',
              borderTop: '1px solid #e5e7eb',
              padding: '20px 32px',
              backdropFilter: 'blur(8px)'
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
                radius="xl"
                style={{
                  '& .mantine-Input-input': {
                    border: '1px solid #e9ecef',
                    backgroundColor: '#f8f9fa',
                    fontSize: '16px',
                    padding: '12px 20px',
                    '&:focus': {
                      borderColor: '#0629D3',
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(6, 41, 211, 0.1)'
                    }
                  }
                }}
              />
              <ActionIcon 
                onClick={() => handleSendMessage()}
                disabled={!currentInput.trim() || isProcessing}
                size="lg"
                radius="xl"
                style={{
                  background: currentInput.trim() && !isProcessing ? 
                    '#0629D3' : 
                    '#e9ecef',
                  color: currentInput.trim() && !isProcessing ? 'white' : '#6c757d',
                  border: 'none',
                  minWidth: '44px',
                  height: '44px',
                  '&:hover': {
                    background: currentInput.trim() && !isProcessing ? 
                      '#0520b3' : 
                      '#dee2e6'
                  }
                }}
              >
                <IconSend size={18} />
              </ActionIcon>
            </Group>
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
                        <RechartsTooltip />
                        <Bar 
                          dataKey="value" 
                          fill="#6366f1" 
                          style={{ cursor: isDrillDownEnabled(insight.title) ? 'pointer' : 'default' }}
                          onClick={isDrillDownEnabled(insight.title) ? (data) => handleChartPointClick(insight.title, data) : undefined}
                        />
                      </BarChart>
                    ) : (
                      <LineChart data={Array.isArray(insight.data) ? insight.data : []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#6366f1" 
                          dot={{ 
                            fill: '#6366f1',
                            cursor: isDrillDownEnabled(insight.title) ? 'pointer' : 'default'
                          }}
                          activeDot={{ 
                            r: 4, 
                            fill: '#6366f1',
                            cursor: isDrillDownEnabled(insight.title) ? 'pointer' : 'default'
                          }}
                          onClick={isDrillDownEnabled(insight.title) ? (data) => handleChartPointClick(insight.title, data) : undefined}
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
      
      {/* LLM Settings Modal */}
      <LLMSettingsModal 
        opened={settingsModalOpened} 
        onClose={() => setSettingsModalOpened(false)} 
      />

      {drillDownModalOpen && drillDownData && (
        <Modal 
          opened={drillDownModalOpen}
          onClose={() => setDrillDownModalOpen(false)}
          title={drillDownData.title}
          size="xl"
        >
          <Box mb="md">
            <Group justify="space-between">
              <Group>
                <ActionIcon variant="light" size="md">
                  <IconFilter size={16} />
                </ActionIcon>
                <Button variant="subtle" size="xs">Clear Filters</Button>
              </Group>
              <Text size="sm" c="dimmed">{drillDownData.results.length} results</Text>
            </Group>
          </Box>

          {drillDownData.title === "Invoiced Amount" && (
            <>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice Number</Table.Th>
                    <Table.Th>Company Name</Table.Th>
                    <Table.Th>Invoice Due Date</Table.Th>
                    <Table.Th>Balance Due (in $)</Table.Th>
                    <Table.Th>Is Refund</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Total (in $)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {drillDownData.results.slice(0, 10).map((invoice, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{invoice.invoiceNumber}</Table.Td>
                      <Table.Td>{invoice.companyName}</Table.Td>
                      <Table.Td>{invoice.dueDate}</Table.Td>
                      <Table.Td>{invoice.balanceDue}</Table.Td>
                      <Table.Td>{invoice.isRefund}</Table.Td>
                      <Table.Td>{invoice.status}</Table.Td>
                      <Table.Td>{invoice.total}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="space-between" mt="md">
                <Text size="sm">Rows per page: 10</Text>
                <Group>
                  <Text size="sm">1-10 of {drillDownData.results.length}</Text>
                  <ActionIcon variant="subtle" disabled><IconChevronLeft size={16} /></ActionIcon>
                  <ActionIcon variant="subtle"><IconChevronRight size={16} /></ActionIcon>
                </Group>
              </Group>
            </>
          )}

          {drillDownData.title === "Received Payments" && (
            <>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Payment ID</Table.Th>
                    <Table.Th>Company</Table.Th>
                    <Table.Th>Payment Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Method</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {drillDownData.results.slice(0, 10).map((payment, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{payment.paymentId}</Table.Td>
                      <Table.Td>{payment.companyName}</Table.Td>
                      <Table.Td>{payment.paymentDate}</Table.Td>
                      <Table.Td>${payment.amount}</Table.Td>
                      <Table.Td>{payment.method}</Table.Td>
                      <Table.Td>{payment.status}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="space-between" mt="md">
                <Text size="sm">Rows per page: 10</Text>
                <Group>
                  <Text size="sm">1-10 of {drillDownData.results.length}</Text>
                  <ActionIcon variant="subtle" disabled><IconChevronLeft size={16} /></ActionIcon>
                  <ActionIcon variant="subtle"><IconChevronRight size={16} /></ActionIcon>
                </Group>
              </Group>
            </>
          )}

          {drillDownData.title !== "Invoiced Amount" && drillDownData.title !== "Received Payments" && (
            <>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Value</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {drillDownData.results.slice(0, 10).map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{item.id}</Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.date}</Table.Td>
                      <Table.Td>${item.value}</Table.Td>
                      <Table.Td>{item.category}</Table.Td>
                      <Table.Td>{item.status}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="space-between" mt="md">
                <Text size="sm">Rows per page: 10</Text>
                <Group>
                  <Text size="sm">1-10 of {drillDownData.results.length}</Text>
                  <ActionIcon variant="subtle" disabled><IconChevronLeft size={16} /></ActionIcon>
                  <ActionIcon variant="subtle"><IconChevronRight size={16} /></ActionIcon>
                </Group>
              </Group>
            </>
          )}
        </Modal>
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
              <span>Custom Insights</span>
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
const MarketplaceInsights = () => {
  // Add state for drill-down modal and settings
  const [drillDownModalOpen, setDrillDownModalOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<{
    title: string;
    dataPoint: any;
    results: any[];
  } | null>(null);
  const [settingsModalOpened, setSettingsModalOpened] = useState(false);

  // Handler for chart point clicks
  const handleChartPointClick = (title: string, dataPoint: any) => {
    // Only open drill-down for widgets that support it
    if (isDrillDownEnabled(title)) {
      // Generate mock data based on the clicked data point
      const mockResults = generateMockDrillDownData(title, dataPoint);
      
      setDrillDownData({
        title,
        dataPoint,
        results: mockResults
      });
      
      setDrillDownModalOpen(true);
    }
  };

  return (
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
        {/* The ChartCard component will automatically add the badge and tooltip based on the title */}
        <Grid.Col span={6}>
          <ChartCard title="Total Subscriptions">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  dot={{ fill: '#6366f1', cursor: 'default' }}
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
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  dot={{ fill: '#6366f1', cursor: 'default' }}
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
                <RechartsTooltip />
                <Bar 
                  dataKey="value" 
                  fill="#6366f1" 
                  style={{ cursor: 'pointer' }}
                  onClick={(data) => handleChartPointClick("Invoiced Amount", data)}
                />
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
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  dot={{ fill: '#6366f1', cursor: 'default' }}
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
                <RechartsTooltip />
                <Bar 
                  dataKey="value" 
                  fill="#6366f1" 
                  style={{ cursor: 'pointer' }}
                  onClick={(data) => handleChartPointClick("Received Payments", data)}
                />
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
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  dot={{ fill: '#6366f1', cursor: 'pointer' }}
                  activeDot={{ r: 4, fill: '#6366f1' }}
                  onClick={(data) => handleChartPointClick("Assigned Seats", data)}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid.Col>
      </Grid>

      {/* Add drill-down modal */}
      {drillDownModalOpen && drillDownData && (
        <Modal 
          opened={drillDownModalOpen}
          onClose={() => setDrillDownModalOpen(false)}
          title={drillDownData.title}
          size="xl"
        >
          <Box mb="md">
            <Group justify="space-between">
              <Group>
                <ActionIcon variant="light" size="md">
                  <IconFilter size={16} />
                </ActionIcon>
                <Button variant="subtle" size="xs">Clear Filters</Button>
              </Group>
              <Text size="sm" c="dimmed">{drillDownData.results.length} results</Text>
            </Group>
          </Box>

          {drillDownData.title === "Invoiced Amount" && (
            <>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice Number</Table.Th>
                    <Table.Th>Company Name</Table.Th>
                    <Table.Th>Invoice Due Date</Table.Th>
                    <Table.Th>Balance Due (in $)</Table.Th>
                    <Table.Th>Is Refund</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Total (in $)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {drillDownData.results.slice(0, 10).map((invoice, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{invoice.invoiceNumber}</Table.Td>
                      <Table.Td>{invoice.companyName}</Table.Td>
                      <Table.Td>{invoice.dueDate}</Table.Td>
                      <Table.Td>{invoice.balanceDue}</Table.Td>
                      <Table.Td>{invoice.isRefund}</Table.Td>
                      <Table.Td>{invoice.status}</Table.Td>
                      <Table.Td>{invoice.total}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="space-between" mt="md">
                <Text size="sm">Rows per page: 10</Text>
                <Group>
                  <Text size="sm">1-10 of {drillDownData.results.length}</Text>
                  <ActionIcon variant="subtle" disabled><IconChevronLeft size={16} /></ActionIcon>
                  <ActionIcon variant="subtle"><IconChevronRight size={16} /></ActionIcon>
                </Group>
              </Group>
            </>
          )}

          {drillDownData.title === "Received Payments" && (
            <>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Payment ID</Table.Th>
                    <Table.Th>Company</Table.Th>
                    <Table.Th>Payment Date</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Method</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {drillDownData.results.slice(0, 10).map((payment, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{payment.paymentId}</Table.Td>
                      <Table.Td>{payment.companyName}</Table.Td>
                      <Table.Td>{payment.paymentDate}</Table.Td>
                      <Table.Td>${payment.amount}</Table.Td>
                      <Table.Td>{payment.method}</Table.Td>
                      <Table.Td>{payment.status}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="space-between" mt="md">
                <Text size="sm">Rows per page: 10</Text>
                <Group>
                  <Text size="sm">1-10 of {drillDownData.results.length}</Text>
                  <ActionIcon variant="subtle" disabled><IconChevronLeft size={16} /></ActionIcon>
                  <ActionIcon variant="subtle"><IconChevronRight size={16} /></ActionIcon>
                </Group>
              </Group>
            </>
          )}

          {drillDownData.title !== "Invoiced Amount" && drillDownData.title !== "Received Payments" && (
            <>
              <Table striped withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Value</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {drillDownData.results.slice(0, 10).map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{item.id}</Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.date}</Table.Td>
                      <Table.Td>${item.value}</Table.Td>
                      <Table.Td>{item.category}</Table.Td>
                      <Table.Td>{item.status}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="space-between" mt="md">
                <Text size="sm">Rows per page: 10</Text>
                <Group>
                  <Text size="sm">1-10 of {drillDownData.results.length}</Text>
                  <ActionIcon variant="subtle" disabled><IconChevronLeft size={16} /></ActionIcon>
                  <ActionIcon variant="subtle"><IconChevronRight size={16} /></ActionIcon>
                </Group>
              </Group>
            </>
          )}
        </Modal>
      )}
    </Box>
  );
};

export default AppInsightsAIFlow; 