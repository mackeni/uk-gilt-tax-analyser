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
        return new Response('Not Found', { status: 404 });
    }
  },
};

async function handleStaticFile(request, env) {
  // In a real implementation, you'd serve from R2 or KV
  // For now, return a basic response
  return new Response('Static file not found', { status: 404 });
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
        return new Response('API endpoint not found', { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getGiltData(request, env) {
  try {
    const fetcher = new GiltDataFetcher(env);
    const data = await fetcher.getGiltData();
    
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function calculateTax(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
    return new Response('Method not allowed', { status: 405 });
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
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}