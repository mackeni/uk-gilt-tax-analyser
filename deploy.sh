#!/bin/bash

# UK Gilt Tax Efficiency Analyser - Cloudflare Worker Deployment Script

echo "🚀 Deploying UK Gilt Tax Efficiency Analyser to Cloudflare Workers..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please login to Cloudflare:"
    wrangler login
fi

# Create D1 database if it doesn't exist
echo "📊 Setting up D1 database..."
# wrangler d1 create gilt-analyser-db

# Deploy the worker
echo "🌐 Deploying to Cloudflare Workers..."
wrangler deploy

echo "✅ Deployment complete!"
echo "📋 Your app is now available at: https://uk-gilt-tax-analyser.YOUR_SUBDOMAIN.workers.dev"
echo ""
echo "🔧 Next steps:"
echo "1. Update your wrangler.toml with the correct database ID (if using D1)"
echo "2. Set any required environment variables"
echo "3. Test your application endpoints"
echo ""
echo "📚 Documentation: See README.md for detailed setup instructions"