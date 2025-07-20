// UK Gilt Data Fetcher - Live data from DividendData close-of-business prices
// Data sourced exclusively from DividendData previous working day close

export class GiltDataFetcher {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 1000 * 60 * 15; // 15 minutes cache
  }

  async fetchGiltData() {
    try {
      console.log('Fetching fresh gilt data from DividendData...');
      // Always fetch fresh data from DividendData
      const data = await this.fetchFromDividendData();
      if (!data || data.length === 0) {
        throw new Error('No gilt data received from DividendData');
      }
      
      return this.calculateGiltMetrics(data);
    } catch (error) {
      console.error('Error fetching gilt data:', error);
      throw error; // Don't use fallback data - always require authentic data
    }
  }

  async fetchFromDividendData() {
    try {
      console.log('Fetching gilt data from DividendData...');
      
      // Try multiple DividendData URLs with proper headers
      const urls = [
        'https://www.dividenddata.co.uk/uk-gilts-prices-yields.py',
        'https://www.dividenddata.co.uk/uk-gilts',
        'https://dividenddata.co.uk/uk-gilts-prices-yields.py'
      ];
      
      const headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; GiltAnalyser/1.0; +https://uk-gilt-tax-analyser.ian-a04.workers.dev)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.5',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
      };
      
      for (const url of urls) {
        try {
          console.log(`Trying URL: ${url}`);
          const response = await fetch(url, {
            method: 'GET',
            headers: headers
          });
          
          if (response.ok) {
            const html = await response.text();
            const result = this.parseGiltHTML(html);
            if (result && result.data && result.data.length > 0) {
              return result;
            }
          }
        } catch (urlError) {
          console.log(`Failed to fetch from ${url}:`, urlError.message);
          continue;
        }
      }
      
      throw new Error('All DividendData URLs failed - site may be blocking automated access');
      
    } catch (error) {
      console.error('DividendData fetch error:', error);
      throw error;
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