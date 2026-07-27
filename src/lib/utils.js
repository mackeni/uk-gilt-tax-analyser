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
  
  // Format as decimal percentage with 3 decimal places (no trailing zero removal)
  return `${rate.toFixed(3)}%`;
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
  // Round to 2 decimal places for consistent principal calculations
  return Math.round(((investmentAmount / dirtyPrice) * 100) * 100) / 100;
}

export function calculateCouponPaymentDates(maturityDate, numPayments = 20) {
  const maturity = new Date(maturityDate);
  const paymentDates = [];
  const cutoffTime = new Date('2020-01-01').getTime();
  
  // Pre-calculate dates in forward direction to avoid unshift operations
  let currentTime = maturity.getTime();
  const sixMonthsMs = 6 * 30.44 * 24 * 60 * 60 * 1000; // Average 6 months in ms
  
  for (let i = 0; i < numPayments; i++) {
    if (currentTime <= cutoffTime) break;
    
    const paymentDate = new Date(currentTime);
    paymentDates.push(paymentDate);
    currentTime -= sixMonthsMs;
  }
  
  // Reverse once instead of using unshift in loop
  return paymentDates.reverse();
}

export function findLastCouponDate(maturityDate, referenceDate = null) {
  if (!referenceDate) {
    referenceDate = new Date();
  }
  
  const paymentDates = calculateCouponPaymentDates(maturityDate);
  
  // Find last payment before reference date
  for (let i = paymentDates.length - 1; i >= 0; i--) {
    if (paymentDates[i] <= referenceDate) {
      return paymentDates[i];
    }
  }
  
  return null;
}

export function findNextCouponDate(maturityDate, referenceDate = null) {
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

export function calculateAccruedInterest(couponRate, maturityDate, settlementDate = null) {
  if (!settlementDate) {
    settlementDate = new Date();
  }
  
  // Find the last and next coupon payment dates
  const lastPaymentDate = findLastCouponDate(maturityDate, settlementDate);
  const nextPaymentDate = findNextCouponDate(maturityDate, settlementDate);
  
  if (!lastPaymentDate || !nextPaymentDate) {
    return 0;
  }
  
  // Calculate actual days using proper Actual/Actual day count convention
  const daysSinceLastPayment = Math.floor((settlementDate - lastPaymentDate) / (1000 * 60 * 60 * 24));
  const totalDaysInPeriod = Math.floor((nextPaymentDate - lastPaymentDate) / (1000 * 60 * 60 * 24));
  
  // UK gilts use Actual/Actual day count - exact days between actual coupon dates
  const accruedFraction = daysSinceLastPayment / totalDaysInPeriod;
  
  // Return semi-annual coupon amount (couponRate/2) multiplied by accrued fraction
  // This gives accrued interest as £ per £100 nominal
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