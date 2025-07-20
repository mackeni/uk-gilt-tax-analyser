/**
 * UK Gilt Tax Efficiency Analyser - Cloudflare Worker
 * Converted from Streamlit application
 */

import { GiltDataFetcher } from './lib/gilt-data.js';
import { TaxCalculator } from './lib/tax-calculator';
import { CouponScheduler } from './lib/coupon-scheduler';
import { formatCurrency, formatPercentage, calculateYearsToMaturity } from './lib/utils';
import { renderHomePage } from './views/home';
import { renderAnalysisPage } from './views/analysis';
import { renderAPIResponse } from './views/api';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle lib files (JavaScript modules) with cache busting
    if (path.startsWith('/lib/')) {
      return await handleLibFile(request, env, path);
    }
    
    // Handle static files
    if (path.startsWith('/static/')) {
      return await handleStaticFile(request, env);
    }
    
    // Handle API routes
    if (path.startsWith('/api/')) {
      return await handleAPIRequest(request, env, path);
    }
    
    // Handle main routes
    switch (path) {
      case '/':
        return await renderHomePage(request, env);
      case '/analysis':
        return await renderAnalysisPage(request, env);
      default:
        return new Response('Not Found', { 
          status: 404,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'Cross-Origin-Resource-Policy': 'same-origin',
            'Origin-Agent-Cluster': '?1',
            'X-Permitted-Cross-Domain-Policies': 'none'
          }
        });
    }
  },
};

async function handleLibFile(request, env, path) {
  // Serve JavaScript module files
  if (path === '/lib/utils.js') {
    const utilsContent = `
// UK Gilt Tax Efficiency Analyser - Utility Functions
export function formatCurrency(amount, maxDigits = 2) {
    if (amount === 0) return '£0.00';
    if (!amount && amount !== 0) return 'N/A';
    
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    
    if (absAmount >= 1e9) {
        return \`\${sign}£\${(absAmount / 1e9).toFixed(maxDigits)}B\`;
    } else if (absAmount >= 1e6) {
        return \`\${sign}£\${(absAmount / 1e6).toFixed(maxDigits)}M\`;
    } else if (absAmount >= 1e3 && maxDigits <= 2) {
        return \`\${sign}£\${absAmount.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}\`;
    } else {
        return \`\${sign}£\${absAmount.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')}\`;
    }
}

export function formatPercentage(rate, digits = 2) {
    if (rate === 0) return '0.00%';
    if (!rate && rate !== 0) return 'N/A';
    
    const percentage = rate * 100;
    return \`\${percentage.toFixed(digits)}%\`;
}

export function formatCouponRate(rate) {
    if (!rate && rate !== 0) return 'N/A';
    
    // Show up to 3 decimal places but remove trailing zeros
    const formatted = rate.toFixed(3).replace(/\\.?0+$/, '');
    return \`\${formatted}%\`;
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

// Memoization cache for expensive calculations
const calculationCache = new Map();

export function getCachedCalculation(key, calculationFn, ...args) {
    const cacheKey = \`\${key}_\${JSON.stringify(args)}\`;
    
    if (calculationCache.has(cacheKey)) {
        return calculationCache.get(cacheKey);
    }
    
    const result = calculationFn(...args);
    calculationCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory issues
    if (calculationCache.size > 1000) {
        const firstKey = calculationCache.keys().next().value;
        calculationCache.delete(firstKey);
    }
    
    return result;
}
    `;
    
    return new Response(utilsContent, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': '"utils-v1.0"',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Origin-Agent-Cluster': '?1',
        'X-Permitted-Cross-Domain-Policies': 'none'
      }
    });
  }
  
  return new Response('Library file not found', { 
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    }
  });
}

async function handleStaticFile(request, env) {
  // In a real implementation, you'd serve from R2 or KV
  // For now, return a basic response
  return new Response('Static file not found', { 
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    }
  });
}

async function handleAPIRequest(request, env, path) {
  const url = new URL(request.url);
  
  try {
    switch (path) {
      case '/api/gilt-data':
        return await getGiltData(request, env);
      case '/api/calculate-tax':
        return await calculateTax(request, env);
      case '/api/coupon-schedule':
        return await getCouponSchedule(request, env);
      default:
        return new Response('API endpoint not found', { 
          status: 404,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
          }
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Origin-Agent-Cluster': '?1',
        'X-Permitted-Cross-Domain-Policies': 'none'
      }
    });
  }
}

async function getGiltData(request, env) {
  try {
    console.log('API endpoint called: /api/gilt-data');
    const fetcher = new GiltDataFetcher(env);
    console.log('GiltDataFetcher created');
    
    const result = await fetcher.getGiltData();
    console.log(`Fetched ${result?.data?.length || 0} gilts from ${result?.dataSource || 'unknown'} source`);
    console.log('Price date:', result?.priceDate);
    
    if (!result?.data || result.data.length === 0) {
      throw new Error('No gilt data available from any source');
    }
    
    return new Response(JSON.stringify(result), {
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Origin-Agent-Cluster': '?1',
        'X-Permitted-Cross-Domain-Policies': 'none'
      }
    });
  } catch (error) {
    console.error('Error in getGiltData:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString(),
      debug: 'API endpoint /api/gilt-data failed'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Origin-Agent-Cluster': '?1',
        'X-Permitted-Cross-Domain-Policies': 'none'
      }
    });
  }
}

async function calculateTax(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
  
  try {
    const body = await request.json();
    const calculator = new TaxCalculator();
    
    if (body.giltData && Array.isArray(body.giltData)) {
      // Calculate for multiple gilts using schedule-based approach
      const results = await Promise.all(body.giltData.map(async gilt => {
        try {
          // Use schedule-based calculation for accurate after-tax yields
          const scheduleResult = await calculator.calculateAfterTaxYieldWithSchedule(
            gilt,
            body.taxpayerType,
            body.investmentAmount || 10000
          );
          
          const afterTaxYield = scheduleResult.afterTaxYield || calculator.calculateAfterTaxYield(
            gilt.currentYield || 0,
            gilt.yearsToMaturity || 0,
            gilt.couponRate || 0,
            body.taxpayerType,
            gilt.dirtyPrice,
            gilt.cleanPrice
          );
          
          const equivalentSavingsRate = calculator.calculateEquivalentSavingsRate(
            afterTaxYield,
            body.taxpayerType
          );
          
          // Calculate savings after tax for comparison
          const savingsAfterTaxRate = calculator.calculateSavingsAfterTax(
            body.savingsRate || 0,
            body.investmentAmount || 10000,
            body.taxpayerType
          );
          
          const taxAdvantage = afterTaxYield - savingsAfterTaxRate;
          const annualAdvantage = calculator.calculateAnnualAdvantage(taxAdvantage, body.investmentAmount || 10000);
          
          // Calculate total extra income over the life of the gilt
          const yearsToMaturity = gilt.yearsToMaturity || ((new Date(gilt.maturityDate) - new Date()) / (365.25 * 24 * 60 * 60 * 1000));
          const extraIncome = annualAdvantage * yearsToMaturity;
          
          // Create detailed tooltip with payment schedule
          const scheduleTooltip = createScheduleTooltip(scheduleResult, body.taxpayerType);
          
          return {
            ...gilt,
            afterTaxYield: afterTaxYield,
            equivalentGrossSavingsRate: equivalentSavingsRate,
            taxAdvantage: taxAdvantage,
            annualAdvantage: annualAdvantage,
            extraIncome: extraIncome,
            yearsToMaturity: yearsToMaturity,
            scheduleDetails: scheduleResult,
            scheduleTooltip: scheduleTooltip
          };
        } catch (giltError) {
          console.error(`Error calculating for gilt ${gilt.name}:`, giltError);
          return {
            ...gilt,
            afterTaxYield: 0,
            equivalentGrossSavingsRate: 0,
            taxAdvantage: 0,
            annualAdvantage: 0,
            scheduleDetails: null,
            scheduleTooltip: "Calculation error"
          };
        }
      }));
      
      return new Response(JSON.stringify(results), {
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Origin-Agent-Cluster': '?1',
          'X-Permitted-Cross-Domain-Policies': 'none'
        }
      });
    } else {
      // Calculate for single gilt
      const result = calculator.calculateAfterTaxYield(
        body.currentYield,
        body.yearsToMaturity,
        body.couponRate,
        body.taxpayerType,
        body.dirtyPrice,
        body.cleanPrice
      );
      
      return new Response(JSON.stringify({ afterTaxYield: result }), {
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Origin-Agent-Cluster': '?1',
          'X-Permitted-Cross-Domain-Policies': 'none'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Origin-Agent-Cluster': '?1',
        'X-Permitted-Cross-Domain-Policies': 'none'
      }
    });
  }
}

function createScheduleTooltip(scheduleResult, taxpayerType) {
  if (!scheduleResult || !scheduleResult.schedule) {
    return "Schedule-based calculation unavailable";
  }
  
  const { schedule, summary } = scheduleResult;
  const taxRatePercent = taxpayerType === 'additional_rate' ? '45%' : 
                        taxpayerType === 'higher_rate' ? '40%' : '20%';
  
  let tooltip = `<div class="schedule-tooltip">
    <h4>Detailed Coupon Payment Schedule & IRR Calculation</h4>
    <div class="schedule-summary">
      <p><strong>Investment:</strong> £${summary.investmentAmount.toFixed(2)}</p>
      <p><strong>Tax Rate:</strong> ${taxRatePercent} (Income Tax on Coupons)</p>
      <p><strong>Total Return:</strong> £${summary.totalAfterTaxReturn.toFixed(2)} (${summary.totalReturn.toFixed(2)}%)</p>
      <p><strong>After-Tax IRR:</strong> ${summary.annualizedReturn.toFixed(3)}%</p>
    </div>
    
    <div class="irr-calculation">
      <h5>IRR Calculation Method</h5>
      <p><strong>Formula:</strong> NPV = -Initial Investment + Σ(Cash Flow<sub>t</sub> ÷ (1 + IRR)<sup>t</sup>) = 0</p>
      <p><strong>Method:</strong> Newton-Raphson iterative convergence (tolerance: 1e-7)</p>
      <p><strong>Cash Flows:</strong> Uses exact payment dates converted to fractional years</p>
      <p><strong>Time Calculation:</strong> Days to payment ÷ 365.25 = Years</p>
    </div>
    
    <div class="payment-schedule">
      <table>
        <thead>
          <tr>
            <th>Payment Date</th>
            <th>Days</th>
            <th>Years</th>
            <th>Gross Coupon</th>
            <th>Tax (${taxRatePercent})</th>
            <th>After-Tax Coupon</th>
            <th>Principal</th>
            <th>Total Cash Flow</th>
          </tr>
        </thead>
        <tbody>`;
  
  schedule.forEach(payment => {
    const paymentDate = new Date(payment.paymentDate).toLocaleDateString('en-GB');
    const timeInYears = payment.daysToPayment / 365.25;
    tooltip += `
          <tr>
            <td>${paymentDate}</td>
            <td>${payment.daysToPayment}</td>
            <td>${timeInYears.toFixed(3)}</td>
            <td>£${payment.grossCouponAmount.toFixed(2)}</td>
            <td>£${payment.couponTax.toFixed(2)}</td>
            <td>£${payment.afterTaxCouponAmount.toFixed(2)}</td>
            <td>£${payment.principalAmount.toFixed(2)}</td>
            <td>£${payment.totalAfterTaxPayment.toFixed(2)}</td>
          </tr>`;
  });
  
  tooltip += `
        </tbody>
      </table>
    </div>
    <div class="irr-details">
      <h5>IRR Cash Flow Analysis</h5>
      <p><strong>Initial Investment:</strong> -£${summary.investmentAmount.toFixed(2)} (at Time 0)</p>
      <p><strong>Present Value Check:</strong> Sum of discounted cash flows should equal investment</p>
      <p><strong>Convergence:</strong> IRR found when NPV = 0 within 1e-7 tolerance</p>
    </div>
    
    <div class="schedule-notes">
      <p><small>• IRR accounts for exact timing of each cash flow using fractional years</small></p>
      <p><small>• Coupon payments subject to ${taxRatePercent} Income Tax</small></p>
      <p><small>• Principal repayment is tax-free</small></p>
      <p><small>• Capital gains on gilts are tax-free in the UK</small></p>
      <p><small>• Newton-Raphson method provides professional-grade accuracy</small></p>
    </div>
  </div>`;
  
  return tooltip;
}

async function getCouponSchedule(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
  
  const body = await request.json();
  const scheduler = new CouponScheduler();
  
  const schedule = scheduler.generateCouponSchedule(body.giltInfo);
  const afterTaxSchedule = scheduler.calculateAfterTaxCashFlows(schedule, body.taxRate);
  
  return new Response(JSON.stringify({
    schedule: afterTaxSchedule,
    summary: scheduler.getScheduleSummary(afterTaxSchedule)
  }), {
    headers: { 
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}