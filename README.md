# Adobe VIP Marketplace API UI

This project provides a comprehensive UI for managing Adobe VIP Marketplace API operations, including flexible discounts, order management, and customer account operations.

## Environment Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Adobe API Credentials

1. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your actual Adobe VIP Marketplace API credentials:
   - `ADOBE_CLIENT_ID`: Your Adobe OAuth Client ID
   - `ADOBE_CLIENT_SECRET`: Your Adobe OAuth Client Secret
   - `ADOBE_TECHNICAL_ACCOUNT_ID`: Your Adobe Technical Account ID
   - `ADOBE_ORGANIZATION_ID`: Your Adobe Organization ID
   - `ADOBE_RESELLER_ID`: Your Adobe Reseller ID
   - `ADOBE_DISTRIBUTOR_ID`: Your Adobe Distributor ID
   - `ADOBE_PRIVATE_KEY`: Your Adobe Private Key (include BEGIN/END lines)

### 3. Running the Application

The application automatically detects the environment and switches between two authentication modes:

#### Development Mode (Local)
1. Start the proxy server:
   ```bash
   node proxy-server.js
   ```

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5179`)

- Requires the proxy server for real Adobe API authentication
- Provides real Adobe VIP Marketplace API connectivity

#### Production Mode (Vercel/Online)
1. Deploy to Vercel or access the live site
2. No proxy server required
3. Authentication and API calls use realistic mock data
4. Perfect for UI demonstrations and testing without Adobe credentials

## Security Notes

- Never commit the `.env` file containing actual credentials
- The `.env.example` file contains placeholder values and is safe to commit
- All sensitive credentials are handled through environment variables
- The proxy server handles OAuth authentication securely

## Features

- **Adobe VIP Marketplace Authentication**: OAuth Server-to-Server flow
- **Flexible Discounts Management**: Browse, search, and manage flexible discounts
- **Order Management**: Create orders, preview orders, and track order history
- **Customer Account Operations**: Manage customer accounts and information
- **Enterprise UI**: Professional AppDirect-style interface

## API Proxy Server

The proxy server runs on port 3001 and provides secure endpoints for:
- `/api/status` - Health check
- `/api/adobe/authenticate` - OAuth authentication
- `/api/adobe/proxy/v3/*` - Proxied Adobe VIP API calls

## Development

The application is built with:
- React + TypeScript + Vite
- Adobe VIP Marketplace API integration
- Secure OAuth Server-to-Server authentication
- Enterprise-grade UI components 