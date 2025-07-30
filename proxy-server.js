const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Enable CORS for the frontend
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    message: 'Adobe VIP Marketplace API Proxy Server',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// devs.ai API Proxy endpoint
app.post('/api/devs-ai/chats/completions', async (req, res) => {
  try {
    const { apiKey, model, messages, stream } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    console.log(`Proxying devs.ai request - Model: ${model}`);
    
    // Forward the request to devs.ai using their correct API format
    const response = await fetch('https://devs.ai/api/v1/chats/completions', {
      method: 'POST',
      headers: {
        'X-Authorization': apiKey, // devs.ai uses X-Authorization header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022', // Can be AI ID or LLM model name
        messages: messages || [],
        stream: stream || false
      }),
    });
    
    let responseData;
    const responseText = await response.text();
    
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      // Handle non-JSON responses (like plain text error messages)
      responseData = { error: responseText };
    }
    
    if (!response.ok) {
      console.error(`devs.ai API Error: ${response.status} - ${responseText}`);
      return res.status(response.status).json(responseData);
    }
    
    console.log('devs.ai response received successfully');
    res.json(responseData);
  } catch (error) {
    console.error('devs.ai Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Adobe credentials from environment variables
const ADOBE_CONFIG = {
  sandbox: {
    credentials: {
      clientId: process.env.ADOBE_CLIENT_ID || 'de7dadf0964a454ba754af89f741362a',
      clientSecret: process.env.ADOBE_CLIENT_SECRET || '',
      technicalAccountId: process.env.ADOBE_TECHNICAL_ACCOUNT_ID || '',
      organizationId: process.env.ADOBE_ORGANIZATION_ID || '',
      privateKey: process.env.ADOBE_PRIVATE_KEY || '',
      resellerId: process.env.ADOBE_RESELLER_ID || 'P1000084654',
      distributorId: process.env.ADOBE_DISTRIBUTOR_ID || 'd1b4fd10-686f-4807-9839-2bf80707c21f',
    },
    endpoints: {
      api: process.env.ADOBE_API_URL || 'https://partnersandbox-stage.adobe.io',
      ims: process.env.ADOBE_IMS_URL || 'https://ims-na1-stg1.adobelogin.com',
    },
  }
};

// Try OAuth Server-to-Server authentication as per Adobe's new requirements
async function getOAuthAccessToken(environment = 'sandbox') {
  const config = ADOBE_CONFIG[environment];
  
  try {
    const tokenEndpoint = `${config.endpoints.ims}/ims/token/v2`;
    
    const formData = new URLSearchParams();
    formData.append('client_id', config.credentials.clientId);
    formData.append('client_secret', config.credentials.clientSecret);
    formData.append('grant_type', 'client_credentials');
    formData.append('scope', 'openid,AdobeID,ent_vip_marketplace_sdk');

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const tokenData = await response.json();
    
    return {
      accessToken: tokenData.access_token,
      tokenType: tokenData.token_type || 'Bearer',
      expiresIn: tokenData.expires_in || 3600,
    };
  } catch (error) {
    console.error('OAuth Authentication Error:', error);
    throw error;
  }
}

// Authentication endpoint
app.post('/api/adobe/authenticate', async (req, res) => {
  try {
    // Handle cases where req.body might be undefined
    const body = req.body || {};
    const { environment = 'sandbox' } = body;
    
    console.log(`Authenticating with Adobe using OAuth - Environment: ${environment}`);
    
    const tokenData = await getOAuthAccessToken(environment);
    console.log('OAuth access token obtained successfully');
    
    res.json({
      jwt: null, // OAuth doesn't use JWT in the same way
      access_token: tokenData.accessToken,
      token_type: tokenData.tokenType,
      expires_in: tokenData.expiresIn,
    });
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// VIP API Proxy endpoint for customer accounts
app.get('/api/adobe/proxy/v3/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { environment = 'sandbox' } = req.query;
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    const apiUrl = `${config.endpoints.api}/v3/customers/${customerId}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Forward the request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': config.credentials.clientId,
      },
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// VIP API Proxy endpoint for health check
app.get('/api/adobe/proxy/v3/healthcheck', async (req, res) => {
  try {
    const { environment = 'sandbox' } = req.query;
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    const apiUrl = `${config.endpoints.api}/v3/healthcheck`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Forward the request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': config.credentials.clientId,
      },
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// VIP API Proxy endpoint for flexible discounts
app.get('/api/adobe/proxy/v3/flex-discounts', async (req, res) => {
  try {
    const { environment = 'sandbox', ...queryParams } = req.query;
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    
    // Build query string from parameters
    const queryString = new URLSearchParams(queryParams).toString();
    const apiUrl = `${config.endpoints.api}/v3/flex-discounts${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Forward the request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': config.credentials.clientId,
      },
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Helper function to generate correlation ID
function generateCorrelationId() {
  return 'req-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
}

// VIP API Proxy endpoint for creating orders
app.post('/api/adobe/proxy/v3/customers/:customerId/orders', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { environment = 'sandbox', ...orderData } = req.body;
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    
    // Handle preview mode
    const isPreview = req.query.preview === 'true';
    const apiUrl = `${config.endpoints.api}/v3/customers/${customerId}/orders${isPreview ? '?preview=true' : ''}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Generate correlation ID
    const correlationId = generateCorrelationId();
    
    // Forward the request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': config.credentials.clientId,
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify(orderData),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// VIP API Proxy endpoint for getting specific order
app.get('/api/adobe/proxy/v3/customers/:customerId/orders/:orderId', async (req, res) => {
  try {
    const { customerId, orderId } = req.params;
    const { environment = 'sandbox' } = req.query;
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    const apiUrl = `${config.endpoints.api}/v3/customers/${customerId}/orders/${orderId}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Generate correlation ID
    const correlationId = generateCorrelationId();
    
    // Forward the request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': config.credentials.clientId,
        'X-Correlation-ID': correlationId,
      },
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// VIP API Proxy endpoint for getting order history
app.get('/api/adobe/proxy/v3/customers/:customerId/orders', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { environment = 'sandbox', ...queryParams } = req.query;
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    
    // Build query string from parameters
    const queryString = new URLSearchParams(queryParams).toString();
    const apiUrl = `${config.endpoints.api}/v3/customers/${customerId}/orders${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Generate correlation ID
    const correlationId = generateCorrelationId();
    
    // Forward the request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': config.credentials.clientId,
        'X-Correlation-ID': correlationId,
      },
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// VIP API Proxy endpoint for price lists
app.post('/api/adobe/proxy/v3/pricelist', async (req, res) => {
  try {
    const { environment = 'sandbox', limit, offset, ...priceListData } = req.body;
    
    console.log(`Price Lists endpoint called with environment: ${environment}`);
    console.log('Request data:', JSON.stringify(priceListData, null, 2));
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    
    // Build query string for pagination
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    if (offset) queryParams.append('offset', offset.toString());
    
    const queryString = queryParams.toString();
    const apiUrl = `${config.endpoints.api}/v3/pricelist${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Generate correlation ID and request ID
    const correlationId = generateCorrelationId();
    const requestId = generateCorrelationId(); // Use same function for request ID
    
    // Prepare request body according to Adobe API documentation
    const requestBody = {
      region: priceListData.region || 'NA',
      marketSegment: priceListData.marketSegment || 'COM',
      priceListType: priceListData.priceListType || 'STANDARD',
      currency: priceListData.currency || 'USD',
      priceListMonth: priceListData.priceListMonth || '202501',
      filters: priceListData.filters || {},
      includeOfferAttributes: priceListData.includeOfferAttributes || [
        'productType',
        'productTypeDetail',
        'language'
      ]
    };
    
    console.log('Sending request body:', JSON.stringify(requestBody, null, 2));
    
    // Forward the request to Adobe API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-Key': config.credentials.clientId,
        'X-Correlation-ID': correlationId,
        'X-Request-Id': requestId,
      },
      body: JSON.stringify(requestBody),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`Adobe API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    console.log('Price lists response received successfully');
    res.json(responseData);
  } catch (error) {
    console.error('Price Lists Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Adobe Recommendations API Proxy endpoints

// Fetch Recommendations
app.post('/api/adobe/proxy/v3/recommendations', async (req, res) => {
  try {
    const { environment = 'sandbox', customerId, country, language, recommendationContext, offers } = req.body;
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    
    // Build query parameters based on the request
    const queryParams = new URLSearchParams({
      'customer-id': customerId,
      'country': country,
      'language': language,
      'recommendation-context': recommendationContext
    });
    
    const apiUrl = `${config.endpoints.api}/v3/customers/${customerId}/recommendations?${queryParams.toString().replace('customer-id=' + customerId + '&', '')}`;
    
    console.log(`Proxying recommendations request to: ${apiUrl}`);
    
    // Generate correlation ID
    const correlationId = generateCorrelationId();
    
    // Prepare request body for Adobe API
    const requestBody = {
      recommendationContext,
      customerId,
      country,
      language
    };
    
    // Add offers if provided
    if (offers && offers.length > 0) {
      requestBody.offers = offers;
    }

    // Forward the request (POST method for recommendations with body)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': config.credentials.clientId,
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify(requestBody),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Recommendations Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Note: Preview Order and Preview Order Renewal now use existing order endpoints
// with query parameters like ?preview=true&fetch-recommendations=true

// Get Subscriptions (Customer-specific)
app.get('/api/adobe/proxy/v3/customers/:customerId/subscriptions', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { environment = 'sandbox', ...queryParams } = req.query;
    
    // Get access token
    const tokenData = await getOAuthAccessToken(environment);
    
    const config = ADOBE_CONFIG[environment];
    const queryString = new URLSearchParams(queryParams).toString();
    const apiUrl = `${config.endpoints.api}/v3/customers/${customerId}/subscriptions${queryString ? `?${queryString}` : ''}`;
    
    console.log(`Proxying customer subscriptions request to: ${apiUrl}`);
    
    // Generate correlation ID
    const correlationId = generateCorrelationId();
    
    // Forward the request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.accessToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': config.credentials.clientId,
        'X-Correlation-ID': correlationId,
      },
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${JSON.stringify(responseData)}`);
      return res.status(response.status).json(responseData);
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Customer Subscriptions Proxy Error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Adobe VIP Marketplace API Proxy Server running on port ${PORT}`);
  console.log(`Status endpoint: http://localhost:${PORT}/api/status`);
  console.log(`Authentication endpoint: http://localhost:${PORT}/api/adobe/authenticate`);
  console.log(`Customer endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/customers/:customerId`);
  console.log(`Health check endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/healthcheck`);
  console.log(`Flexible discounts endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/flex-discounts`);
  console.log(`Create order endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/customers/:customerId/orders`);
  console.log(`Get order endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/customers/:customerId/orders/:orderId`);
  console.log(`Order history endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/customers/:customerId/orders`);
  console.log(`Price lists endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/pricelist`);
  console.log(`Recommendations endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/recommendations`);
  console.log(`Customer subscriptions endpoint: http://localhost:${PORT}/api/adobe/proxy/v3/customers/:customerId/subscriptions`);
  console.log(`devs.ai proxy endpoint: http://localhost:${PORT}/api/devs-ai/chats/completions`);
  console.log(`Note: Order preview uses existing order endpoints with ?preview=true&fetch-recommendations=true`);
}); 