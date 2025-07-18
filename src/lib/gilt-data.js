/**
 * UK Gilt Data Fetcher - Authentic Data Sources Only
 * Fetches real-time UK government bond data from authorized sources
 */

export class GiltDataFetcher {
  constructor() {
    this.baseUrls = {
      dmo: 'https://www.dmo.gov.uk/data/',
      dividenddata: 'https://www.dividenddata.co.uk/uk-gilts-prices-yields.py'
    };
    this.maxYearsDefault = 3;
  }

  async getGiltData() {
    try {
      // Try to get real data from DividendData first
      let data = await this.fetchFromDividendData();
      if (data && data.length > 0) {
        return await this.addCouponPaymentDates(data);
      }
      
      // Try DMO as fallback
      data = await this.fetchFromDMO();
      if (data && data.length > 0) {
        return await this.addCouponPaymentDates(data);
      }
      
      // If real data fails, throw error - no sample data fallback
      throw new Error('Unable to fetch real-time gilt data from authentic sources');
      
    } catch (error) {
      console.error('Error fetching gilt data:', error);
      // Throw error instead of returning sample data
      throw new Error('Failed to connect to authentic UK gilt data sources. Please check API connectivity.');
    }
  }
  
  async addCouponPaymentDates(giltData) {
    const { CouponScheduler } = await import('./coupon-scheduler.js');
    const scheduler = new CouponScheduler();
    
    return giltData.map(gilt => {
      // Calculate last and next coupon payment dates based on maturity
      const lastPaymentDate = this.calculateLastCouponDate(gilt.maturityDate);
      const nextPaymentDate = this.calculateNextCouponDate(gilt.maturityDate);
      
      // Calculate precise accrued interest using actual dates
      const accruedInterest = scheduler.calculateAccruedInterest(
        gilt.couponRate, 
        lastPaymentDate, 
        nextPaymentDate
      );
      
      // Calculate precise dirty price
      const dirtyPrice = gilt.cleanPrice + accruedInterest;
      
      return {
        ...gilt,
        lastPaymentDate,
        nextPaymentDate,
        accruedInterest,
        dirtyPrice: dirtyPrice || gilt.dirtyPrice
      };
    });
  }
  
  calculateLastCouponDate(maturityDate) {
    const maturity = new Date(maturityDate);
    const today = new Date();
    
    // UK gilts pay semi-annually on the same day/month as maturity
    let lastPayment = new Date(maturity);
    
    // Move backwards 6 months at a time until we find the last payment before today
    while (lastPayment > today) {
      lastPayment.setMonth(lastPayment.getMonth() - 6);
    }
    
    return lastPayment.toISOString().split('T')[0];
  }
  
  calculateNextCouponDate(maturityDate) {
    const maturity = new Date(maturityDate);
    const today = new Date();
    
    // UK gilts pay semi-annually on the same day/month as maturity
    let nextPayment = new Date(maturity);
    
    // Move backwards 6 months at a time until we find the next payment after today
    while (nextPayment <= today) {
      nextPayment.setMonth(nextPayment.getMonth() + 6);
    }
    
    // Don't go beyond maturity
    if (nextPayment > maturity) {
      return maturityDate;
    }
    
    return nextPayment.toISOString().split('T')[0];
  }

  async fetchFromDividendData() {
    try {
      const response = await fetch(this.baseUrls.dividenddata, {
        headers: {
          'User-Agent': 'UK-Gilt-Analyser/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      return this.parseGiltHTML(html);
      
    } catch (error) {
      console.error('DividendData fetch error:', error);
      return null;
    }
  }

  async fetchFromDMO() {
    try {
      // DMO doesn't provide a direct API for current prices
      // This would need to be implemented based on their specific endpoints
      throw new Error('DMO API implementation required for authentic data');
    } catch (error) {
      console.error('DMO fetch error:', error);
      return null;
  
      const monthNames = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      return new Date(parseInt(year), monthNames[month], parseInt(day));
    }
    return new Date(dateStr);
  }

  calculateGiltMetrics(giltData) {
    return giltData.map(gilt => {
      const yearsToMaturity = this.calculateYearsToMaturity(gilt.maturityDate);
      const currentYield = gilt.currentYield || (gilt.couponRate / gilt.cleanPrice * 100);
      
      return {
        ...gilt,
        yearsToMaturity,
        currentYield
      };
    });
  }

  calculateYearsToMaturity(maturityDate) {
    const now = new Date();
    const maturity = typeof maturityDate === 'string' ? new Date(maturityDate) : maturityDate;
    const timeDiff = maturity - now;
    return Math.max(0, timeDiff / (1000 * 60 * 60 * 24 * 365.25));
  }

  calculateExactAccruedInterest(couponRate, lastPaymentDate, nextPaymentDate) {
    const today = new Date();
    const lastPayment = new Date(lastPaymentDate);
    const nextPayment = new Date(nextPaymentDate);
    
    // Exact day count using Actual/Actual convention
    const daysSinceLastPayment = Math.floor((today - lastPayment) / (1000 * 60 * 60 * 24));
    const totalDaysInPeriod = Math.floor((nextPayment - lastPayment) / (1000 * 60 * 60 * 24));
    
    // Precise accrued fraction (no approximations)
    const accruedFraction = daysSinceLastPayment / totalDaysInPeriod;
    
    // Semi-annual coupon payment
    const semiAnnualCoupon = couponRate / 2;
    
    return semiAnnualCoupon * accruedFraction;
  }
}