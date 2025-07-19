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

export function calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate = null) {
  if (!settlementDate) {
    settlementDate = new Date();
  }
  
  const lastPayment = new Date(lastPaymentDate);
  const daysSinceLastPayment = Math.floor((settlementDate - lastPayment) / (1000 * 60 * 60 * 24));
  
  // UK gilts use Actual/Actual day count convention
  const daysInYear = 365.25;
  const accruedFraction = daysSinceLastPayment / daysInYear;
  
  return couponRate * accruedFraction;
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