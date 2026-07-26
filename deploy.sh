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

# Deploy the worker
echo "🌐 Deploying to Cloudflare Workers..."
wrangler deploy

echo "✅ Deployment complete!"
echo "📋 Your app is now available at: https://gilts.monsters.org.uk"
echo ""
echo "🔧 Next steps:"
echo "1. Set any required environment variables"
echo "2. Test your application endpoints"
echo ""
echo "📚 Documentation: See README.md for detailed setup instructions"