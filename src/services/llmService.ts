// LLM Service for Analytics AI - devs.ai Integration
// Primary: devs.ai API (Claude/OpenAI) | Fallback: Pattern Matching

import { getConfig, isConfigured, setModel } from './llmConfig';

interface AnalyticsQuery {
  intent: string;
  entity: string | null;
  metric: string | null;
  visualization: string;
  timeframe: string;
  confidence: number;
  isValidCombination: boolean;
  suggestions: string[] | null;
  isContextual: boolean;
}

interface LLMResponse {
  success: boolean;
  data?: AnalyticsQuery;
  error?: string;
  fallbackUsed?: boolean;
  usedCache?: boolean;
}

// Get devs.ai configuration
const getDevsAIConfig = () => getConfig();

// devs.ai uses AI IDs directly as model identifiers

// Cache for repeated queries (reduces API costs)
const queryCache = new Map<string, { result: AnalyticsQuery; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function calling schema for structured extraction
const ANALYTICS_FUNCTION_SCHEMA = {
  name: 'parse_analytics_query',
  description: 'Parse a natural language analytics query into structured parameters',
  parameters: {
    type: 'object',
    properties: {
      intent: {
        type: 'string',
        enum: ['show_chart', 'show_trend', 'show_insight', 'compare', 'change_visualization', 'unknown'],
        description: 'The user\'s intent for the query'
      },
      entity: {
        type: 'string',
        enum: ['companies', 'invoices', 'leads', 'opportunities', 'orders', 'payments', 'users', 'provider_sales'],
        description: 'The business entity to analyze'
      },
      metric: {
        type: 'string',
        enum: [
          'new_companies', 'new_users', 'new_subscriptions', 'invoiced_amount',
          'commission_tickets', 'commission_tickets_by_provider', 'commission_tickets_by_status', 
          'commission_tickets_by_age', 'commission_tickets_open_vs_resolved',
          'commissions_by_provider', 'booked_order_amount', 'booked_order_amount_by_provider',
          'booked_order_amount_by_product_category', 'booked_orders', 'quotes_created', 'net_billed',
          'new_opportunities', 'opportunities_by_status', 'pending_approval_opportunities_by_age',
          'total_opportunities', 'sales_velocity'
        ],
        description: 'The specific metric to visualize'
      },
      visualization: {
        type: 'string',
        enum: ['bar', 'line', 'insight'],
        description: 'The type of visualization requested'
      },
      timeframe: {
        type: 'string',
        enum: ['last_7_days', 'last_30_days', 'last_12_months', 'this_month', 'this_year'],
        description: 'The time period for the analysis'
      },
      confidence: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Confidence level in the interpretation (0-1)'
      },
      isContextual: {
        type: 'boolean',
        description: 'Whether this is a contextual request (like changing visualization of existing chart)'
      }
    },
    required: ['intent', 'visualization', 'timeframe', 'confidence', 'isContextual']
  }
};

// Main LLM processing function
// Export enhanced suggestion function (will be defined below)

export const processQueryWithLLM = async (
  query: string, 
  lastContext?: { entity: string; metric: string; title: string } | null
): Promise<LLMResponse> => {
  const config = getDevsAIConfig();
  
  // Check cache first (include AI ID for isolation)
  const cacheKey = `${config.defaultModel}_${query}_${lastContext?.metric || 'none'}`;
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('🟢 [LLM CACHE HIT]', { query, result: cached.result.entity + '/' + cached.result.metric });
    return { success: true, data: cached.result, usedCache: true };
  }

  try {
    console.log('🚀 [LLM API CALL] Attempting devs.ai request...', { query, context: lastContext });
    
    // Try devs.ai API first
    const llmResult = await callDevsAI(query, lastContext);
    
    if (llmResult.success && llmResult.data) {
      console.log('✅ [LLM SUCCESS]', { 
        query, 
        entity: llmResult.data.entity, 
        metric: llmResult.data.metric,
        confidence: llmResult.data.confidence,
        isContextual: llmResult.data.isContextual
      });
      
      // Cache successful results
      queryCache.set(cacheKey, { 
        result: llmResult.data, 
        timestamp: Date.now() 
      });
      return llmResult;
    }
  } catch (error) {
    console.warn('❌ [LLM FAILED] Falling back to pattern matching:', error);
  }

  // Fallback to pattern matching
  console.log('🔄 [PATTERN FALLBACK] Using local pattern matching...', { query });
  const fallbackResult = processWithPatternMatching(query, lastContext);
  console.log('📊 [PATTERN RESULT]', { 
    entity: fallbackResult.entity, 
    metric: fallbackResult.metric,
    confidence: fallbackResult.confidence 
  });
  
  return { 
    success: true, 
    data: fallbackResult, 
    fallbackUsed: true 
  };
};

// devs.ai API integration
const callDevsAI = async (
  query: string, 
  lastContext?: { entity: string; metric: string; title: string } | null
): Promise<LLMResponse> => {
  const config = getDevsAIConfig();
  if (!config.apiKey) {
    throw new Error('devs.ai API key not configured');
  }

  const systemPrompt = `You are a data analytics assistant. When users ask for business data, respond naturally while clearly mentioning:
1. The DATA TYPE they want (companies, users, orders, invoices, provider_sales, opportunities)
2. The SPECIFIC METRIC (new_companies, commission_tickets_by_provider, etc.)  
3. The VISUALIZATION type (bar chart, line graph, or insight)

Examples:
"Show new companies" → "I'll show you new_companies data as a bar chart"
"Commission tickets by provider" → "Here are commission_tickets_by_provider displayed as a bar chart"
"User growth over time" → "I'll display new_users as a line graph to show trends"

${lastContext ? `CONTEXT: User was just viewing ${lastContext.title} (${lastContext.entity}/${lastContext.metric}). ` : ''}

Always mention the entity, metric, and visualization clearly in your response so I can create the appropriate chart.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: query }
  ];

  // devs.ai API call - Using actual devs.ai format
  const response = await fetch(`${config.endpoint}/api/v1/chats/completions`, {
    method: 'POST',
    headers: {
      'X-Authorization': config.apiKey, // devs.ai uses X-Authorization, not Bearer
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.defaultModel, // Use AI ID directly, not model mapping
      messages,
      stream: false,
      // Note: devs.ai may not support function calling like OpenAI
      // We'll parse the response text directly
    }),
  });

  if (!response.ok) {
    throw new Error(`devs.ai API error: ${response.status}`);
  }

  const result = await response.json();
  
  // Extract content from devs.ai response format
  const content = result.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content in devs.ai response');
  }

  // Parse the AI response using natural language understanding
  // Since devs.ai doesn't support structured function calling, we'll parse the text response
  const analyticsQuery = parseAIResponse(content, query, lastContext);
  
  return { success: true, data: analyticsQuery };
};

// Parse AI response from devs.ai (no function calling support)
const parseAIResponse = (
  content: string, 
  originalQuery: string,
  lastContext?: { entity: string; metric: string; title: string } | null
): AnalyticsQuery => {
  // Enhanced pattern matching with AI context
  const lowerContent = content.toLowerCase();
  const lowerQuery = originalQuery.toLowerCase();
  
  // Extract entity and metric from AI response
  let entity: string | null = null;
  let metric: string | null = null;
  let visualization = 'bar';
  let confidence = 0.85; // Higher confidence for AI responses
  
  // Entity detection patterns
  if (lowerContent.includes('companies') || lowerContent.includes('company')) {
    entity = 'companies';
    metric = 'new_companies';
  } else if (lowerContent.includes('users') || lowerContent.includes('user')) {
    entity = 'users';
    metric = 'new_users';
  } else if (lowerContent.includes('provider') || lowerContent.includes('commission')) {
    entity = 'provider_sales';
    if (lowerContent.includes('by provider')) metric = 'commission_tickets_by_provider';
    else if (lowerContent.includes('by status')) metric = 'commission_tickets_by_status';
    else metric = 'commission_tickets';
  } else if (lowerContent.includes('opportunities') || lowerContent.includes('opportunity')) {
    entity = 'opportunities';
    if (lowerContent.includes('by status')) metric = 'opportunities_by_status';
    else metric = 'new_opportunities';
  } else if (lowerContent.includes('orders') || lowerContent.includes('subscription')) {
    entity = 'orders';
    metric = 'new_subscriptions';
  } else if (lowerContent.includes('invoice')) {
    entity = 'invoices';
    metric = 'invoiced_amount';
  }
  
  // Visualization detection
  if (lowerContent.includes('line') || lowerContent.includes('trend') || lowerContent.includes('over time')) {
    visualization = 'line';
  } else if (lowerContent.includes('insight') || lowerContent.includes('metric') || lowerContent.includes('total')) {
    visualization = 'insight';
  }
  
  // Context handling for follow-up requests
  const isContextual = lastContext && (
    lowerQuery.includes('make it') || 
    lowerQuery.includes('change to') || 
    lowerQuery.includes('show as')
  );
  
  if (isContextual && lastContext) {
    entity = lastContext.entity;
    metric = lastContext.metric;
  }
  
  // Fallback to pattern matching if AI didn't provide clear structure
  if (!entity || !metric) {
    const fallback = processWithPatternMatching(originalQuery, lastContext);
    return {
      ...fallback,
      confidence: Math.max(fallback.confidence, 0.7), // Boost confidence slightly for AI attempt
    };
  }
  
  return {
    intent: isContextual ? 'change_visualization' : 'show_chart',
    entity,
    metric,
    visualization,
    timeframe: 'last_12_months',
    confidence,
    isValidCombination: validateEntityMetricCombination(entity, metric),
    suggestions: null,
    isContextual: isContextual || false
  };
};

// Validation helper
const validateEntityMetricCombination = (entity: string | null, metric: string | null): boolean => {
  if (!entity || !metric) return false;
  
  const validCombinations: Record<string, string[]> = {
    companies: ['new_companies'],
    users: ['new_users'],
    orders: ['new_subscriptions'],
    invoices: ['invoiced_amount'],
    provider_sales: [
      'commission_tickets', 'commission_tickets_by_provider', 'commission_tickets_by_status',
      'commission_tickets_by_age', 'commission_tickets_open_vs_resolved', 'commissions_by_provider',
      'booked_order_amount', 'booked_order_amount_by_provider', 'booked_order_amount_by_product_category',
      'booked_orders', 'quotes_created', 'net_billed'
    ],
    opportunities: [
      'new_opportunities', 'opportunities_by_status', 'pending_approval_opportunities_by_age',
      'total_opportunities', 'sales_velocity'
    ]
  };

  return validCombinations[entity]?.includes(metric) || false;
};

// Enhanced suggestion engine for graceful fallbacks
const generateContextualSuggestions = (
  query: string,
  entity: string | null, 
  metric: string | null,
  confidence: number
): { suggestions: string[], category: string, examples: string[] } => {
  const lowerQuery = query.toLowerCase();
  
  // Detect what user might be asking for
  if (entity && !metric) {
    // User mentioned entity but no clear metric
    const validMetrics = getValidMetricsForEntity(entity);
    return {
      suggestions: [`I recognize you want ${entity} data. Here are some options:`],
      category: 'partial_entity_match',
      examples: validMetrics.slice(0, 4)
    };
  }
  
  if (!entity && metric) {
    // User mentioned metric-like words but no entity
    return {
      suggestions: [`I heard "${metric}" but need to know what type of data you want.`],
      category: 'partial_metric_match', 
      examples: ['Try: "new companies", "user growth", "commission tickets by provider"']
    };
  }
  
  if (confidence < 0.3) {
    // Very low confidence - provide general guidance
    const detectedWords = extractKeywords(lowerQuery);
    return {
      suggestions: generateSmartSuggestions(detectedWords),
      category: 'general_guidance',
      examples: [
        'Show me new companies as a bar chart',
        'Display commission tickets by provider', 
        'What are the total new users?',
        'User growth over time as a line graph'
      ]
    };
  }
  
  // Moderate confidence but invalid combination
  return {
    suggestions: [`I understand you want data visualization, but need clarification.`],
    category: 'clarification_needed',
    examples: [
      'Try being more specific about the data type',
      'Mention if you want charts, graphs, or insights',
      'Examples: "revenue trends", "user metrics", "sales data"'
    ]
  };
};

// Extract meaningful keywords from user query
const extractKeywords = (query: string): string[] => {
  const businessTerms = [
    'revenue', 'sales', 'profit', 'growth', 'users', 'customers', 'orders',
    'commission', 'tickets', 'opportunities', 'companies', 'invoices',
    'trends', 'analytics', 'metrics', 'data', 'chart', 'graph', 'insight'
  ];
  
  return businessTerms.filter(term => query.includes(term));
};

// Generate smart suggestions based on detected keywords
const generateSmartSuggestions = (keywords: string[]): string[] => {
  const suggestions: string[] = [];
  
  if (keywords.includes('revenue') || keywords.includes('sales')) {
    suggestions.push("For revenue data, try: 'invoiced amount' or 'booked orders'");
  }
  if (keywords.includes('users') || keywords.includes('customers')) {
    suggestions.push("For user data, try: 'new users' or 'user growth over time'");
  }
  if (keywords.includes('commission') || keywords.includes('tickets')) {
    suggestions.push("For commission data, try: 'commission tickets by provider'");
  }
  if (keywords.length === 0) {
    suggestions.push("I can help you visualize business data like companies, users, orders, and revenue.");
  }
  
  return suggestions.length > 0 ? suggestions : [
    "I can show charts for companies, users, orders, invoices, and sales data.",
    "Try asking about specific metrics like 'new users' or 'revenue trends'."
  ];
};

// Legacy function for backward compatibility
const generateSuggestions = (entity: string | null, metric: string | null): string[] => {
  const enhanced = generateContextualSuggestions('', entity, metric, 0.5);
  return enhanced.suggestions;
};

const getValidMetricsForEntity = (entity: string): string[] => {
  const entityMetrics: Record<string, string[]> = {
    companies: ['new companies'],
    users: ['new users'],
    orders: ['new subscriptions'],
    invoices: ['invoiced amount'],
    provider_sales: ['commission tickets by provider', 'booked orders', 'quotes created'],
    opportunities: ['new opportunities', 'opportunities by status']
  };
  
  return entityMetrics[entity] || [];
};

// Pattern matching fallback (your existing sophisticated system)
const processWithPatternMatching = (
  query: string, 
  lastContext?: { entity: string; metric: string; title: string } | null
): AnalyticsQuery => {
  // Your existing processNaturalLanguageQuery logic here
  // I'll import this from the existing component
  const lowerQuery = query.toLowerCase();
  
  // Simplified version - you can copy your full pattern matching logic here
  const patterns = [
    { pattern: /commission tickets by provider/i, entity: 'provider_sales', metric: 'commission_tickets_by_provider', confidence: 0.95 },
    { pattern: /new users/i, entity: 'users', metric: 'new_users', confidence: 0.9 },
    { pattern: /new companies/i, entity: 'companies', metric: 'new_companies', confidence: 0.9 },
    // Add more patterns as needed
  ];

  type PatternMatch = { pattern: RegExp; entity: string; metric: string; confidence: number };
  let bestMatch: PatternMatch | null = null;
  let bestConfidence = 0;
  
  for (const pattern of patterns) {
    if (pattern.pattern.test(query)) {
      if (pattern.confidence > bestConfidence) {
        bestMatch = pattern;
        bestConfidence = pattern.confidence;
      }
    }
  }

  // Detect visualization preference
  let visualization = 'bar';
  if (/line|trend|over time/i.test(query)) visualization = 'line';
  else if (/insight|metric|number/i.test(query)) visualization = 'insight';

  if (bestMatch) {
    return {
      intent: 'show_chart',
      entity: bestMatch.entity,
      metric: bestMatch.metric,
      visualization,
      timeframe: 'last_12_months',
      confidence: bestConfidence,
      isValidCombination: true,
      suggestions: null,
      isContextual: false
    };
  }

  // Fallback
  return {
    intent: 'unknown',
    entity: null,
    metric: null,
    visualization: 'bar',
    timeframe: 'last_12_months',
    confidence: 0.2,
    isValidCombination: false,
    suggestions: ["Try asking for 'new companies as a bar chart' or 'commission tickets by provider'"],
    isContextual: false
  };
};

// Utility to switch between models
export const switchModel = (model: 'claude' | 'openai') => {
  if (model === 'claude') {
    setModel('claude-3-haiku');
  } else {
    setModel('gpt-3.5-turbo');
  }
};

// Clear cache utility
export const clearQueryCache = () => {
  queryCache.clear();
};

// Export for debugging
export const getCacheStats = () => ({
  size: queryCache.size,
  entries: Array.from(queryCache.keys())
});

// Export enhanced suggestion function
export const getContextualSuggestions = generateContextualSuggestions; 