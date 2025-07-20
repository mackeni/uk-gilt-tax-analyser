/**
 * UK Gilt Tax Efficiency Analyser - Cloudflare Worker
 * Converted from Streamlit application
 */

import { GiltDataFetcher } from './lib/gilt-data.js';
import { TaxCalculator } from './lib/tax-calculator.js';
import { CouponScheduler } from './lib/coupon-scheduler.js';
import { formatCurrency, formatPercentage, calculateYearsToMaturity } from './lib/utils.js';
import { renderHomePage } from './views/home.js';
import { renderAnalysisPage } from './views/analysis.js';
import { renderAPIResponse } from './views/api.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle lib files (JavaScript modules) with cache busting
    if (path.startsWith('/lib/')) {
      return await handleLibFile(request, env, path);
    }
    
    // Handle CSS files
    if (path.startsWith('/styles/')) {
      return await handleStyleFile(request, env, path);
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
            'Cache-Control': 'no-cache, no-store, must-revalidate',
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
            'X-Content-Type-Options': 'nosniff'
          }
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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
          'Cache-Control': 'no-cache, no-store, must-revalidate',
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
          'Cache-Control': 'no-cache, no-store, must-revalidate',
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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
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
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

// CSS file handler
async function handleStyleFile(request, env, path) {
  let cssContent = '';
  
  if (path === '/styles/main.css') {
    cssContent = `/* Main CSS for UK Gilt Tax Efficiency Analyser */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f8f9fa;
    color: #333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 30px;
    text-align: center;
}

.header h1 {
    color: #2c3e50;
    font-size: 2.5em;
    margin-bottom: 10px;
}

.header p {
    color: #7f8c8d;
    font-size: 1.1em;
}

.sidebar {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.sidebar h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.3em;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label,
.form-group .form-label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #2c3e50;
}

.form-group select,
.form-group input {
    width: 100%;
    padding: 10px;
    border: 2px solid #e0e0e0;
    border-radius: 5px;
    font-size: 16px;
}

.form-group select:focus,
.form-group input:focus {
    outline: none;
    border-color: #3498db;
}

.tax-info {
    background: #f1f8ff;
    padding: 15px;
    border-radius: 5px;
    margin-top: 20px;
    border-left: 4px solid #3498db;
}

.tax-info h4 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.tax-info-inline {
    margin-top: 10px;
    padding: 10px;
    font-size: 14px;
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.controls-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.gilt-table {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow-x: auto;
    min-width: 100%;
}

.gilt-table h3 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.4em;
}

.table-container {
    overflow-x: auto;
    min-width: 800px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

th {
    background: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
    position: sticky;
    top: 0;
    z-index: 10;
}

tr:hover {
    background-color: #f8f9fa;
}

td:hover {
    background-color: #e8f4fd;
}

.btn {
    background: #3498db;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: background-color 0.3s ease;
    min-height: 44px;
}

.btn:hover {
    background: #2980b9;
}

.btn:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
}

.btn-full-width {
    width: 100%;
    margin-bottom: 20px;
}

.metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.metrics.hidden {
    display: none;
}

.metric-card {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    text-align: center;
    border-left: 4px solid #3498db;
}

.metric-value {
    font-size: 1.8em;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 5px;
}

.metric-label {
    color: #7f8c8d;
    font-size: 0.9em;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #7f8c8d;
    font-style: italic;
}

.error {
    background: #ffebee;
    color: #c62828;
    padding: 15px;
    border-radius: 5px;
    border-left: 4px solid #f44336;
    margin: 20px 0;
}

.error.hidden {
    display: none;
}

.success {
    background: #e8f5e8;
    color: #2e7d32;
    padding: 15px;
    border-radius: 5px;
    border-left: 4px solid #4caf50;
    margin: 20px 0;
}

.data-source {
    background: #f8f9fa;
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 15px;
    font-size: 14px;
    text-align: center;
}

.data-source.live {
    background: #e8f5e8;
    color: #2e7d32;
    border-left: 4px solid #4caf50;
}

.data-source.cached {
    background: #e3f2fd;
    color: #1565c0;
    border-left: 4px solid #2196f3;
}

.data-source.static {
    background: #fff3e0;
    color: #e65100;
    border-left: 4px solid #ff9800;
}

.filter-controls {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.filter-controls.hidden {
    display: none;
}

.filter-row {
    display: grid;
    grid-template-columns: auto auto auto auto 1fr;
    gap: 15px;
    align-items: center;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.filter-group label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 14px;
}

.filter-group input {
    padding: 8px;
    border: 2px solid #e0e0e0;
    border-radius: 5px;
    width: 80px;
    font-size: 16px;
}

.filter-info {
    color: #7f8c8d;
    font-size: 14px;
    text-align: right;
}

.hidden {
    display: none !important;
}

.account-charge-settings {
    display: none;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    border-radius: 10px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
    padding: 20px 30px;
    border-bottom: 1px solid #e0e0e0;
    background: #f8f9fa;
    border-radius: 10px 10px 0 0;
    position: sticky;
    top: 0;
    z-index: 1001;
}

.modal-title {
    font-size: 1.3em;
    color: #2c3e50;
    margin: 0;
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #7f8c8d;
    padding: 5px;
    line-height: 1;
}

.modal-close:hover {
    color: #2c3e50;
}

.modal-content {
    padding: 30px;
}

.explanation-section {
    margin-bottom: 25px;
}

.explanation-section h4 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 1.1em;
}

.formula {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 5px;
    font-family: 'Courier New', monospace;
    border-left: 4px solid #3498db;
    margin: 10px 0;
    overflow-x: auto;
}

.schedule-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.schedule-table th,
.schedule-table td {
    padding: 8px 12px;
    text-align: right;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
}

.schedule-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
    position: sticky;
    top: 0;
}

.schedule-table th:first-child,
.schedule-table td:first-child {
    text-align: left;
}

.coupon-payment {
    background: #e8f5e8 !important;
}

.account-charge {
    background: #fff8e1 !important;
}

.charge-max {
    font-weight: bold;
    color: #f57c00;
}

.schedule-section {
    margin-bottom: 30px;
}

.schedule-section h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e0e0e0;
}

.schedule-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 20px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.summary-item {
    text-align: center;
}

.summary-value {
    font-size: 1.3em;
    font-weight: bold;
    color: #2c3e50;
    display: block;
}

.summary-label {
    color: #7f8c8d;
    font-size: 0.9em;
}

.custom-psa-indicator {
    color: #e67e22;
    font-size: 12px;
    margin-top: 5px;
}

.custom-psa-indicator strong {
    font-weight: bold;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .header {
        padding: 20px;
    }
    
    .header h1 {
        font-size: 1.8em;
    }
    
    .controls-section {
        grid-template-columns: 1fr;
    }
    
    .metrics {
        grid-template-columns: 1fr;
    }
    
    .filter-row {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .filter-group input {
        width: 100%;
    }
    
    th, td {
        padding: 8px;
        font-size: 14px;
    }
    
    .modal {
        max-width: 95%;
        max-height: 95%;
    }
    
    .modal-content {
        padding: 20px;
    }
    
    .schedule-summary {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .header h1 {
        font-size: 1.5em;
    }
    
    .btn {
        font-size: 14px;
        padding: 10px 20px;
    }
    
    th, td {
        padding: 6px;
        font-size: 12px;
    }
    
    .table-container {
        min-width: 600px;
    }
}`;
  } else if (path === '/styles/analysis.css') {
    cssContent = `/* Analysis Page Specific Styles */

.analysis-section {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 30px;
}

.coupon-schedule {
    overflow-x: auto;
}

.coupon-schedule table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.coupon-schedule th,
.coupon-schedule td {
    padding: 12px;
    text-align: right;
    border-bottom: 1px solid #e0e0e0;
}

.coupon-schedule th {
    background: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
}

.coupon-schedule th:first-child,
.coupon-schedule td:first-child {
    text-align: left;
}

.schedule-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.summary-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #3498db;
}

.back-button {
    background: #95a5a6;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    display: inline-block;
    margin-bottom: 20px;
}

.back-button:hover {
    background: #7f8c8d;
}`;
  } else {
    return new Response('CSS file not found', { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Origin-Agent-Cluster': '?1',
        'X-Permitted-Cross-Domain-Policies': 'none'
      }
    });
  }
  
  return new Response(cssContent, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': '"css-v1.0"',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Origin-Agent-Cluster': '?1',
      'X-Permitted-Cross-Domain-Policies': 'none'
    }
  });
}

