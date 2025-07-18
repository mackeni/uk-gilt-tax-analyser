# UK Gilt Tax Efficiency Analyser - Cloudflare Worker

A high-performance web application for analysing UK gilt tax efficiency, converted from Python/Streamlit to JavaScript/Cloudflare Workers.

## Features

- **Real-time Gilt Data**: Fetches current UK gilt market data
- **Tax Efficiency Analysis**: Calculates after-tax yields for different tax brackets
- **Interactive Interface**: Modern, responsive web interface
- **Coupon Scheduling**: Detailed payment schedule analysis
- **British Pound Integration**: Full UK financial terminology and symbols

## Architecture

### Frontend
- **Pure HTML/CSS/JavaScript**: No framework dependencies
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live data from APIs

### Backend (Cloudflare Worker)
- **Edge Computing**: Fast global response times
- **Serverless**: No server management required
- **API Endpoints**: RESTful API for data and calculations

### Core Libraries
- **GiltDataFetcher**: Handles data retrieval from UK sources
- **TaxCalculator**: Performs tax efficiency calculations
- **CouponScheduler**: Generates detailed payment schedules
- **Utils**: Common formatting and calculation functions

## API Endpoints

### GET /api/gilt-data
Retrieves current UK gilt market data.

### POST /api/calculate-tax
Calculates tax efficiency for gilt investments.

**Request Body:**
```json
{
  "giltData": [...],
  "taxpayerType": "additional_rate",
  "investmentAmount": 10000,
  "savingsRate": 4.5
}
```

### POST /api/coupon-schedule
Generates detailed coupon payment schedules.

**Request Body:**
```json
{
  "giltInfo": {
    "maturityDate": "2030-09-07",
    "couponRate": 4.0,
    "faceValue": 100
  },
  "taxRate": 0.45
}
```

## Deployment

### Prerequisites
- Node.js 18+ (for local development)
- Cloudflare account
- Wrangler CLI installed

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure Wrangler:**
```bash
npx wrangler login
```

3. **Create D1 Database (optional):**
```bash
npx wrangler d1 create gilt-analyser-db
```

4. **Deploy:**
```bash
npx wrangler deploy
```

### Local Development

```bash
npx wrangler dev
```

## Configuration

### Environment Variables
- `ENVIRONMENT`: Production/development environment
- `DATABASE_URL`: D1 database connection (optional)

### wrangler.toml
```toml
name = "uk-gilt-tax-analyser"
main = "src/index.js"
compatibility_date = "2024-03-18"

[vars]
ENVIRONMENT = "production"
```

## Tax Calculations

### Supported Tax Brackets
- **Basic Rate (20%)**: £1,000 Personal Savings Allowance
- **Higher Rate (40%)**: £500 Personal Savings Allowance  
- **Additional Rate (45%)**: £0 Personal Savings Allowance

### Key Features
- **Capital Gains Tax Exempt**: UK gilts are CGT-free
- **Accurate Accrued Interest**: Actual/Actual day count convention
- **Real Payment Dates**: Business day adjustments and UK holidays
- **Scalable Calculations**: Works for any investment amount

## Data Sources

### Primary Sources
- UK Debt Management Office (DMO)
- DividendData.co.uk
- Financial market data providers

### Data Integrity
- No synthetic or mock data
- Real-time market information
- Graceful error handling when sources unavailable

## Performance

### Edge Computing Benefits
- **Global CDN**: Sub-100ms response times worldwide
- **Auto-scaling**: Handles traffic spikes automatically
- **Zero Cold Starts**: Always-on performance

### Optimization
- **Caching**: Efficient data caching strategies
- **Compression**: Optimized payload sizes
- **Lazy Loading**: Progressive enhancement

## Security

### Input Validation
- Parameter sanitization
- Type checking
- Range validation

### CORS Configuration
- Appropriate cross-origin policies
- Secure headers
- Rate limiting

## Migration from Streamlit

### Key Changes
1. **Runtime**: Python → JavaScript (Node.js)
2. **Hosting**: Server-based → Edge/Serverless
3. **UI**: Streamlit components → Pure HTML/CSS/JS
4. **Data**: Pandas → Native JavaScript arrays/objects
5. **API**: Direct function calls → HTTP endpoints

### Preserved Features
- All original tax calculations
- Coupon scheduling logic
- Data fetching strategies
- UI functionality and design principles

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Check the documentation
- Review API endpoints
- Test with sample data
- Verify Cloudflare Worker logs