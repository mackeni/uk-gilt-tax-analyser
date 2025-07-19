// UK Gilt Data Fetcher - API-based approach for real-time data
// Supports multiple financial data API providers

export class GiltDataAPIFetcher {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 1000 * 60 * 15; // 15 minutes cache
  }

  async fetchGiltData() {
    try {
      console.log('Fetching gilt data from financial APIs...');
      
      // Try multiple API providers in order of preference
      let data = await this.tryAlphaVantage();
      if (!data) data = await this.tryFinancialModelingPrep();
      if (!data) data = await this.tryPolygon();
      if (!data) data = await this.tryYahooFinance();
      if (!data) data = await this.tryMarketstack();
      
      if (!data || data.length === 0) {
        throw new Error('No gilt data available from any API provider');
      }
      
      return this.calculateGiltMetrics(data);
    } catch (error) {
      console.error('Error fetching gilt data from APIs:', error);
      throw error;
    }
  }

  async tryAlphaVantage() {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    if (!apiKey || apiKey === 'demo') return null;
    
    try {
      console.log('Trying Alpha Vantage API...');
      const giltData = [];
      
      // Major UK gilt symbols for Alpha Vantage
      const giltSymbols = [
        'UKT2%25', 'UKT3.5%25', 'UKT0.125%26', 'UKT0.375%26', 'UKT1.5%26',
        'UKT4.125%27', 'UKT3.75%27', 'UKT1.25%27', 'UKT4.25%27', 'UKT0.125%28'
      ];
      
      for (const symbol of giltSymbols.slice(0, 10)) { // Limit API calls
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
          );
          const data = await response.json();
          
          if (data['Global Quote'] && data['Global Quote']['05. price']) {
            const price = parseFloat(data['Global Quote']['05. price']);
            const giltInfo = this.parseGiltSymbol(symbol);
            
            if (giltInfo) {
              giltData.push({
                name: giltInfo.name,
                couponRate: giltInfo.couponRate,
                maturityDate: giltInfo.maturityDate,
                cleanPrice: price,
                currentYield: this.calculateCurrentYield(giltInfo.couponRate, price),
                indexLinked: false,
                greenGilt: false
              });
            }
          }
        } catch (error) {
          console.log(`Failed to fetch ${symbol} from Alpha Vantage:`, error.message);
        }
      }
      
      return giltData.length > 0 ? giltData : null;
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      return null;
    }
  }

  async tryFinancialModelingPrep() {
    const apiKey = process.env.FMP_API_KEY;
    if (!apiKey) return null;
    
    try {
      console.log('Trying Financial Modeling Prep API...');
      
      // FMP doesn't have direct gilt support, try bonds endpoint
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/UKT2%25?apikey=${apiKey}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return this.parseFMPBondData(data);
      
    } catch (error) {
      console.error('Financial Modeling Prep API error:', error);
      return null;
    }
  }

  async tryPolygon() {
    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) return null;
    
    try {
      console.log('Trying Polygon.io API...');
      
      // Polygon has limited UK bond coverage
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/UKT2%25/prev?apikey=${apiKey}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return this.parsePolygonBondData(data);
      
    } catch (error) {
      console.error('Polygon API error:', error);
      return null;
    }
  }

  async tryYahooFinance() {
    try {
      console.log('Trying Yahoo Finance API...');
      
      // Yahoo Finance doesn't require API key but has rate limits
      const giltSymbols = ['UKT2%25.L', 'UKT3.5%25.L', 'UKT0.125%26.L'];
      const giltData = [];
      
      for (const symbol of giltSymbols.slice(0, 5)) {
        try {
          const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; GiltAnalyser/1.0)',
                'Accept': 'application/json'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const parsed = this.parseYahooBondData(data, symbol);
            if (parsed) giltData.push(parsed);
          }
        } catch (error) {
          console.log(`Failed to fetch ${symbol} from Yahoo:`, error.message);
        }
      }
      
      return giltData.length > 0 ? giltData : null;
      
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      return null;
    }
  }

  async tryMarketstack() {
    const apiKey = process.env.MARKETSTACK_API_KEY;
    if (!apiKey) return null;
    
    try {
      console.log('Trying Marketstack API...');
      
      const response = await fetch(
        `http://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=UKT2%25&limit=1`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return this.parseMarketstackBondData(data);
      
    } catch (error) {
      console.error('Marketstack API error:', error);
      return null;
    }
  }

  parseGiltSymbol(symbol) {
    // Parse gilt symbols like 'UKT2%25' to extract coupon and maturity
    const match = symbol.match(/UKT([\d.]+)%(\d+)/);
    if (!match) return null;
    
    const couponRate = parseFloat(match[1]);
    const maturityYear = 2000 + parseInt(match[2]);
    
    return {
      name: `Treasury ${couponRate}% ${maturityYear}`,
      couponRate: couponRate,
      maturityDate: `${maturityYear}-09-07` // Default maturity date
    };
  }

  parseFMPBondData(data) {
    if (!Array.isArray(data) || data.length === 0) return null;
    
    return data.map(bond => ({
      name: bond.name || 'Treasury Bond',
      couponRate: bond.couponRate || 0,
      maturityDate: bond.maturityDate || '2025-12-31',
      cleanPrice: bond.price || 100,
      currentYield: bond.yield || 0,
      indexLinked: false,
      greenGilt: false
    }));
  }

  parsePolygonBondData(data) {
    if (!data.results || data.results.length === 0) return null;
    
    const result = data.results[0];
    return [{
      name: 'Treasury 2% 2025',
      couponRate: 2.0,
      maturityDate: '2025-09-07',
      cleanPrice: result.c || 100,
      currentYield: this.calculateCurrentYield(2.0, result.c || 100),
      indexLinked: false,
      greenGilt: false
    }];
  }

  parseYahooBondData(data, symbol) {
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) return null;
    
    const result = data.chart.result[0];
    const meta = result.meta;
    const price = meta.regularMarketPrice || meta.previousClose || 100;
    
    const giltInfo = this.parseGiltSymbol(symbol.replace('.L', ''));
    if (!giltInfo) return null;
    
    return {
      name: giltInfo.name,
      couponRate: giltInfo.couponRate,
      maturityDate: giltInfo.maturityDate,
      cleanPrice: price,
      currentYield: this.calculateCurrentYield(giltInfo.couponRate, price),
      indexLinked: false,
      greenGilt: false
    };
  }

  parseMarketstackBondData(data) {
    if (!data.data || data.data.length === 0) return null;
    
    const bond = data.data[0];
    return [{
      name: 'Treasury 2% 2025',
      couponRate: 2.0,
      maturityDate: '2025-09-07',
      cleanPrice: bond.close || 100,
      currentYield: this.calculateCurrentYield(2.0, bond.close || 100),
      indexLinked: false,
      greenGilt: false
    }];
  }

  calculateCurrentYield(couponRate, price) {
    return (couponRate / price) * 100;
  }

  calculateGiltMetrics(giltData) {
    return giltData.map(gilt => ({
      ...gilt,
      yearsToMaturity: this.calculateYearsToMaturity(gilt.maturityDate),
      lastPaymentDate: this.calculateLastCouponDate(gilt.maturityDate),
      nextPaymentDate: this.calculateNextCouponDate(gilt.maturityDate),
      accruedInterest: this.calculateExactAccruedInterest(
        gilt.couponRate,
        this.calculateLastCouponDate(gilt.maturityDate),
        this.calculateNextCouponDate(gilt.maturityDate)
      )
    })).map(gilt => ({
      ...gilt,
      dirtyPrice: gilt.cleanPrice + gilt.accruedInterest
    }));
  }

  calculateYearsToMaturity(maturityDate) {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const diffTime = maturity - today;
    return diffTime / (1000 * 60 * 60 * 24 * 365.25);
  }

  calculateLastCouponDate(maturityDate) {
    const maturity = new Date(maturityDate);
    const today = new Date();
    
    const lastCoupon = new Date(maturity);
    lastCoupon.setMonth(lastCoupon.getMonth() - 6);
    
    if (lastCoupon > today) {
      lastCoupon.setMonth(lastCoupon.getMonth() - 6);
    }
    
    return lastCoupon;
  }

  calculateNextCouponDate(maturityDate) {
    const lastCoupon = this.calculateLastCouponDate(maturityDate);
    const nextCoupon = new Date(lastCoupon);
    nextCoupon.setMonth(nextCoupon.getMonth() + 6);
    return nextCoupon;
  }

  calculateExactAccruedInterest(couponRate, lastPaymentDate, nextPaymentDate) {
    try {
      const today = new Date();
      const lastPayment = new Date(lastPaymentDate);
      const nextPayment = new Date(nextPaymentDate);
      
      const daysSinceLastPayment = (today - lastPayment) / (1000 * 60 * 60 * 24);
      const daysBetweenPayments = (nextPayment - lastPayment) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastPayment < 0 || daysBetweenPayments <= 0) {
        return 0;
      }
      
      const accrualFraction = daysSinceLastPayment / daysBetweenPayments;
      const semiAnnualCoupon = (couponRate / 2) / 100;
      const accruedInterest = semiAnnualCoupon * accrualFraction * 100;
      
      return Math.max(0, accruedInterest);
    } catch (error) {
      console.error('Error calculating accrued interest:', error);
      return 0;
    }
  }
}