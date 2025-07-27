// UK Gilt Data Fetcher - Live data from multiple financial APIs
// Data sourced from Finnhub, Alpha Vantage, and Financial Modeling Prep APIs

export class GiltDataFetcher {
  constructor(env = null) {
    this.cache = new Map();
    this.cacheExpiry = 1000 * 60 * 15; // 15 minutes cache
    this.env = env; // Environment variables for API keys
  }

  async fetchGiltData() {
    try {
      console.log('Fetching fresh gilt data from financial APIs...');
      
      // Try multiple API sources in order of preference
      let data = await this.fetchFromFinnhub();
      if (!data || data.length === 0) {
        console.log('Finnhub failed, trying Alpha Vantage...');
        data = await this.fetchFromAlphaVantage();
      }
      if (!data || data.length === 0) {
        console.log('Alpha Vantage failed, trying Financial Modeling Prep...');
        data = await this.fetchFromFMP();
      }
      
      if (!data || data.length === 0) {
        throw new Error('All API sources failed - no gilt data available');
      }
      
      return this.calculateGiltMetrics(data);
    } catch (error) {
      console.error('Error fetching gilt data:', error);
      throw error; // Don't use fallback data - always require authentic data
    }
  }

  async fetchFromFinnhub() {
    try {
      console.log('Fetching gilt data from Finnhub API...');
      
      // UK government bond symbols for Finnhub
      const giltSymbols = [
        'GB00B24FF097', // Treasury 2% 2025
        'GB00B39R3F84', // Treasury 1.25% 2027  
        'GB00B6460505', // Treasury 4.75% 2030
        'GB00B84Z2M91', // Treasury 4.25% 2032
        'GB00B71LDL43', // Treasury 1.75% 2037
        'GB00B6SGW950', // Treasury 4.75% 2038
        'GB00B79J6Z09', // Treasury 4.25% 2039
      ];
      
      const giltData = [];
      
      for (const symbol of giltSymbols) {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.env?.FINNHUB_API_KEY || ''}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.c && data.c > 0) { // Current price exists
              giltData.push({
                symbol: symbol,
                cleanPrice: data.c,
                change: data.d,
                changePercent: data.dp,
                timestamp: data.t
              });
            }
          }
        } catch (error) {
          console.log(`Failed to fetch ${symbol} from Finnhub:`, error.message);
        }
      }
      
      return this.mapFinnhubToGiltFormat(giltData);
      
    } catch (error) {
      console.error('Finnhub fetch error:', error);
      return null;
    }
  }

  async fetchFromAlphaVantage() {
    try {
      console.log('Fetching gilt data from Alpha Vantage API...');
      
      // Try UK treasury bond data from Alpha Vantage
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${this.env?.ALPHA_VANTAGE_API_KEY || ''}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return this.mapAlphaVantageToGiltFormat(data);
      }
      
      return null;
    } catch (error) {
      console.error('Alpha Vantage fetch error:', error);
      return null;
    }
  }

  async fetchFromFMP() {
    try {
      console.log('Fetching gilt data from Financial Modeling Prep API...');
      
      // UK government bonds from FMP
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/GILT?apikey=${this.env?.FMP_API_KEY || ''}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return this.mapFMPToGiltFormat(data);
      }
      
      return null;
    } catch (error) {
      console.error('FMP fetch error:', error);
      return null;
    }
  }

  parseGiltHTML(html) {
    try {
      // Parse the HTML table from DividendData
      const giltData = [];
      
      // Extract the trading date from the HTML
      let tradingDate = this.extractTradingDate(html);
      if (!tradingDate) {
        // Fallback to calculated last trading date if not found in HTML
        tradingDate = this.getLastTradingDate();
      }
      
      // Extract table rows using regex patterns
      const tableRowPattern = /<tr[^>]*>.*?<\/tr>/gi;
      const rows = html.match(tableRowPattern) || [];
      
      for (const row of rows) {
        const cells = this.extractTableCells(row);
        if (cells.length >= 7 && cells[0] && cells[1] && cells[5] && cells[6]) {
          const epic = cells[0].trim();
          const name = cells[1].trim();
          const couponStr = cells[2].trim();
          const maturityStr = cells[3].trim();
          const priceStr = cells[5].trim();
          const yieldStr = cells[6].trim();
          
          // Skip header rows and invalid data
          if (epic === 'EPIC' || !priceStr.includes('£') || !yieldStr.includes('%')) {
            continue;
          }
          
          // Parse data
          const couponRate = this.parsePercentage(couponStr);
          const cleanPrice = this.parsePrice(priceStr);
          const currentYield = this.parsePercentage(yieldStr);
          const maturityDate = this.parseMaturityDate(maturityStr);
          
          if (couponRate !== null && cleanPrice !== null && currentYield !== null && maturityDate) {
            giltData.push({
              name: this.standardizeName(name),
              couponRate: couponRate,
              maturityDate: maturityDate,
              cleanPrice: cleanPrice,
              currentYield: currentYield,
              indexLinked: name.toLowerCase().includes('index'),
              greenGilt: name.toLowerCase().includes('green')
            });
          }
        }
      }
      
      console.log(`Parsed ${giltData.length} gilts from DividendData`);
      
      // Return both data and trading date
      return {
        data: giltData.length > 0 ? giltData : null,
        tradingDate: tradingDate
      };
      
    } catch (error) {
      console.error('Error parsing gilt HTML:', error);
      throw error;
    }
  }

  extractTableCells(row) {
    const cellPattern = /<t[dh][^>]*>(.*?)<\/t[dh]>/gi;
    const cells = [];
    let match;
    
    while ((match = cellPattern.exec(row)) !== null) {
      // Remove HTML tags and decode entities
      let cellContent = match[1]
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
      cells.push(cellContent);
    }
    
    return cells;
  }

  parsePercentage(str) {
    if (!str) return null;
    const match = str.match(/([\d.]+)%?/);
    return match ? parseFloat(match[1]) : null;
  }

  parsePrice(str) {
    if (!str) return null;
    const match = str.match(/£([\d,.]+)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
  }

  standardizeName(name) {
    // Standardize gilt names for consistency
    return name
      .replace(/Treasury\s+/i, 'Treasury ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  parseMaturityDate(dateStr) {
    try {
      // Parse dates like "07-Sep-2025" or "22-Oct-2025"
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = this.parseMonth(parts[1]);
        const year = parseInt(parts[2]);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  parseMonth(monthStr) {
    const months = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return months[monthStr] || 1;
  }

  extractTradingDate(html) {
    try {
      // Look for common date patterns in the HTML
      const datePatterns = [
        /(?:updated|close|trading|data).*?(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
        /(?:updated|close|trading|data).*?(\d{1,2}\s+\w+\s+\d{4})/i,
        /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
        /(\d{1,2}\s+\w+\s+\d{4})/
      ];
      
      for (const pattern of datePatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          const dateStr = match[1];
          const parsedDate = this.parseExtractedDate(dateStr);
          if (parsedDate) {
            console.log(`Found trading date in HTML: ${dateStr} → ${parsedDate}`);
            return parsedDate;
          }
        }
      }
      
      console.log('No trading date found in HTML, will use fallback');
      return null;
    } catch (error) {
      console.warn('Error extracting trading date:', error);
      return null;
    }
  }

  parseExtractedDate(dateStr) {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toLocaleDateString('en-GB');
    } catch (error) {
      return null;
    }
  }

  getLastTradingDate() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    let tradingDate = new Date(today);
    
    if (dayOfWeek === 0) { // Sunday
      tradingDate.setDate(today.getDate() - 2); // Go to Friday
    } else if (dayOfWeek === 6) { // Saturday
      tradingDate.setDate(today.getDate() - 1); // Go to Friday
    }
    // For Monday-Friday, use today as trading date
    
    return tradingDate.toLocaleDateString('en-GB');
  }

  mapFinnhubToGiltFormat(finnhubData) {
    // Map Finnhub data to our gilt format
    const giltMapping = {
      'GB00B24FF097': { name: 'Treasury 2% 2025', couponRate: 2.0, maturityDate: '2025-09-07' },
      'GB00B39R3F84': { name: 'Treasury 1.25% 2027', couponRate: 1.25, maturityDate: '2027-07-22' },
      'GB00B6460505': { name: 'Treasury 4.75% 2030', couponRate: 4.75, maturityDate: '2030-12-07' },
      'GB00B84Z2M91': { name: 'Treasury 4.25% 2032', couponRate: 4.25, maturityDate: '2032-06-07' },
      'GB00B71LDL43': { name: 'Treasury 1.75% 2037', couponRate: 1.75, maturityDate: '2037-07-22' },
      'GB00B6SGW950': { name: 'Treasury 4.75% 2038', couponRate: 4.75, maturityDate: '2038-12-07' },
      'GB00B79J6Z09': { name: 'Treasury 4.25% 2039', couponRate: 4.25, maturityDate: '2039-12-07' }
    };

    return finnhubData.map(item => {
      const giltInfo = giltMapping[item.symbol];
      if (!giltInfo) return null;
      
      return {
        name: giltInfo.name,
        couponRate: giltInfo.couponRate,
        maturityDate: giltInfo.maturityDate,
        cleanPrice: item.cleanPrice,
        currentYield: (giltInfo.couponRate / item.cleanPrice) * 100
      };
    }).filter(Boolean);
  }

  mapAlphaVantageToGiltFormat(alphaVantageData) {
    // Alpha Vantage provides treasury yields, we'll need to estimate prices
    if (!alphaVantageData.data) return [];
    
    // Convert yield data to estimated gilt prices (simplified)
    return [];
  }

  mapFMPToGiltFormat(fmpData) {
    // Map FMP data to our gilt format
    if (!Array.isArray(fmpData)) return [];
    
    return fmpData.map(item => ({
      name: item.name || 'UK Government Bond',
      cleanPrice: item.price || 0,
      currentYield: item.yield || 0,
      couponRate: item.coupon || 0,
      maturityDate: item.maturity || '2030-01-01'
    }));
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
    
    // UK gilts typically pay semi-annually
    const lastCoupon = new Date(maturity);
    lastCoupon.setMonth(lastCoupon.getMonth() - 6);
    
    // If that's still in the future, go back another 6 months
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