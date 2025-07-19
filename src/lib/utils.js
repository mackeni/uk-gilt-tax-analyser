/**
 * Utility functions - Cloudflare Worker Version
 * Common formatting and calculation functions
 */

export function formatCurrency(amount, currency = '£') {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'N/A';
  }
  
  // Always show full amount with exactly 2 decimal places
  return `${currency}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPercentage(percentage, decimalPlaces = 2) {
  if (isNaN(percentage) || percentage === null || percentage === undefined) {
    return 'N/A';
  }
  
  return `${percentage.toFixed(decimalPlaces)}%`;
}

export function formatCouponRate(rate) {
  if (isNaN(rate) || rate === null || rate === undefined) {
    return 'N/A';
  }
  
  // Format with max 3 decimal places, removing trailing zeros
  const formatted = rate.toFixed(3).replace(/\.?0+$/, '');
  return `${formatted}%`;
}

export function calculateYearsToMaturity(maturityDate, referenceDate = null) {
  return getCachedCalculation('yearsToMaturity', _calculateYearsToMaturity, maturityDate, referenceDate);
}

function _calculateYearsToMaturity(maturityDate, referenceDate = null) {
  if (!referenceDate) {
    referenceDate = new Date();
  }
  
  const maturity = typeof maturityDate === 'string' ? new Date(maturityDate) : maturityDate;
  
  if (isNaN(maturity.getTime())) {
    return NaN;
  }
  
  const timeDifference = maturity - referenceDate;
  const years = timeDifference / (1000 * 60 * 60 * 24 * 365.25);
  
  return Math.max(0, years);
}

export function calculateDirtyPrice(cleanPrice, accruedInterest) {
  if (isNaN(cleanPrice) || isNaN(accruedInterest)) {
    return cleanPrice || 0;
  }
  return cleanPrice + accruedInterest;
}

export function calculateUnitsOwned(investmentAmount, dirtyPrice) {
  if (isNaN(investmentAmount) || isNaN(dirtyPrice) || dirtyPrice === 0) {
    return 0;
  }
  return (investmentAmount / dirtyPrice) * 100;
}

export function calculateCouponPaymentDates(maturityDate, numPayments = 20) {
  const maturity = new Date(maturityDate);
  const paymentDates = [];
  
  // Calculate payments going backwards from maturity (more efficient than loop)
  for (let i = 0; i < numPayments; i++) {
    const paymentDate = new Date(maturity);
    paymentDate.setMonth(maturity.getMonth() - (i * 6));
    
    if (paymentDate > new Date('2020-01-01')) {
      paymentDates.unshift(paymentDate);
    } else {
      break;
    }
  }
  
  return paymentDates;
}

export function findLastCouponDate(maturityDate, referenceDate = null) {
  return getCachedCalculation('lastCouponDate', _findLastCouponDate, maturityDate, referenceDate);
}

function _findLastCouponDate(maturityDate, referenceDate = null) {
  if (!referenceDate) {
    referenceDate = new Date();
  }
  
  const paymentDates = calculateCouponPaymentDates(maturityDate);
  
  // Find last payment before reference date (more efficient than loop)
  for (let i = paymentDates.length - 1; i >= 0; i--) {
    if (paymentDates[i] <= referenceDate) {
      return paymentDates[i];
    }
  }
  
  return null;
}

export function findNextCouponDate(maturityDate, referenceDate = null) {
  return getCachedCalculation('nextCouponDate', _findNextCouponDate, maturityDate, referenceDate);
}

function _findNextCouponDate(maturityDate, referenceDate = null) {
  if (!referenceDate) {
    referenceDate = new Date();
  }
  
  const paymentDates = calculateCouponPaymentDates(maturityDate);
  
  // Find first payment after reference date
  for (let i = 0; i < paymentDates.length; i++) {
    if (paymentDates[i] > referenceDate) {
      return paymentDates[i];
    }
  }
  
  return new Date(maturityDate);
}

export function calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate = null) {
  return getCachedCalculation('accruedInterest', _calculateAccruedInterest, couponRate, lastPaymentDate, settlementDate);
}

function _calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate = null) {
  if (!settlementDate) {
    settlementDate = new Date();
  }
  
  const lastPayment = new Date(lastPaymentDate);
  const daysSinceLastPayment = Math.floor((settlementDate - lastPayment) / (1000 * 60 * 60 * 24));
  
  // UK gilts use Actual/Actual day count convention with semi-annual payments
  const daysInSemiAnnualPeriod = 184; // Approximate semi-annual period
  const accruedFraction = daysSinceLastPayment / daysInSemiAnnualPeriod;
  
  // Return semi-annual coupon amount multiplied by accrued fraction
  return (couponRate / 2) * accruedFraction;
}

export function getTaxRateInfo(taxBracket) {
  const taxRates = {
    'basic_rate': { income: 20, psa: 1000 },
    'higher_rate': { income: 40, psa: 500 },
    'additional_rate': { income: 45, psa: 0 }
  };
  
  return taxRates[taxBracket] || taxRates['additional_rate'];
}

export function calculateEquivalentGrossSavingsRate(afterTaxYield, incomeTaxRate) {
  if (incomeTaxRate >= 1) {
    return 0;
  }
  return afterTaxYield / (1 - incomeTaxRate);
}

// Enhanced memoization cache for expensive calculations
const calculationCache = new Map();
const cacheStats = { hits: 0, misses: 0 };

export function getCachedCalculation(key, calculationFn, ...args) {
  const cacheKey = `${key}_${JSON.stringify(args)}`;
  
  if (calculationCache.has(cacheKey)) {
    cacheStats.hits++;
    console.log(`Cache hit for ${key} (${cacheStats.hits}/${cacheStats.hits + cacheStats.misses} hit rate)`);
    return calculationCache.get(cacheKey);
  }
  
  cacheStats.misses++;
  const result = calculationFn(...args);
  calculationCache.set(cacheKey, result);
  
  // Limit cache size to prevent memory issues
  if (calculationCache.size > 2000) {
    // Remove oldest 500 entries
    const keysToDelete = Array.from(calculationCache.keys()).slice(0, 500);
    keysToDelete.forEach(key => calculationCache.delete(key));
    console.log(`Cache cleanup: removed ${keysToDelete.length} entries`);
  }
  
  return result;
}

// Cache for complex calculations with TTL (time-to-live)
const timedCache = new Map();

export function getCachedCalculationWithTTL(key, calculationFn, ttlMs = 300000, ...args) { // 5 minute default TTL
  const cacheKey = `${key}_${JSON.stringify(args)}`;
  const now = Date.now();
  
  if (timedCache.has(cacheKey)) {
    const cached = timedCache.get(cacheKey);
    if (now - cached.timestamp < ttlMs) {
      console.log(`TTL cache hit for ${key}`);
      return cached.value;
    } else {
      timedCache.delete(cacheKey);
    }
  }
  
  const result = calculationFn(...args);
  timedCache.set(cacheKey, { value: result, timestamp: now });
  
  // Cleanup expired entries
  if (timedCache.size > 100) {
    for (const [k, v] of timedCache.entries()) {
      if (now - v.timestamp >= ttlMs) {
        timedCache.delete(k);
      }
    }
  }
  
  return result;
}

export function clearCache() {
  calculationCache.clear();
  timedCache.clear();
  cacheStats.hits = 0;
  cacheStats.misses = 0;
  console.log('All caches cleared');
}

export function getCacheStats() {
  return {
    ...cacheStats,
    cacheSize: calculationCache.size,
    timedCacheSize: timedCache.size,
    hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0
  };
}

export function sortData(data, sortBy, ascending = true) {
  return [...data].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle numeric values
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return ascending ? aVal - bVal : bVal - aVal;
    }
    
    // Handle string values
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    // Handle dates
    if (aVal instanceof Date && bVal instanceof Date) {
      return ascending ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });
}

export function filterData(data, filters) {
  return data.filter(item => {
    return Object.entries(filters).every(([key, { min, max }]) => {
      const value = item[key];
      if (typeof value !== 'number') return true;
      
      if (min !== undefined && value < min) return false;
      if (max !== undefined && value > max) return false;
      
      return true;
    });
  });
}

export function generateChartData(data, xField, yFields) {
  const chartData = {
    labels: data.map(item => item[xField]),
    datasets: yFields.map(field => ({
      label: field.label,
      data: data.map(item => item[field.key]),
      backgroundColor: field.color || '#3498db',
      borderColor: field.borderColor || field.color || '#2980b9',
      borderWidth: 1
    }))
  };
  
  return chartData;
}

export function calculateInvestmentMetrics(investmentAmount, dirtyPrice, couponRate, yearsToMaturity) {
  const unitsOwned = (investmentAmount / dirtyPrice) * 100;
  const annualCouponIncome = unitsOwned * couponRate;
  const totalCouponIncome = annualCouponIncome * yearsToMaturity;
  const principalRepayment = unitsOwned; // £100 per £100 nominal
  const totalReturn = totalCouponIncome + principalRepayment;
  
  return {
    unitsOwned,
    annualCouponIncome,
    totalCouponIncome,
    principalRepayment,
    totalReturn
  };
}

export function validateGiltData(gilt) {
  const required = ['name', 'couponRate', 'maturityDate', 'currentYield'];
  
  for (const field of required) {
    if (gilt[field] === undefined || gilt[field] === null) {
      return false;
    }
  }
  
  // Validate numeric fields
  const numericFields = ['couponRate', 'currentYield', 'cleanPrice', 'dirtyPrice'];
  for (const field of numericFields) {
    if (gilt[field] !== undefined && (isNaN(gilt[field]) || gilt[field] < 0)) {
      return false;
    }
  }
  
  // Validate date
  const maturityDate = new Date(gilt.maturityDate);
  if (isNaN(maturityDate.getTime())) {
    return false;
  }
  
  return true;
}

export function createDataTable(data, columns) {
  const headers = columns.map(col => col.header);
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      return col.formatter ? col.formatter(value) : value;
    })
  );
  
  return {
    headers,
    rows
  };
}

export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}