/**
 * UK Gilt Tax Efficiency Analyser - Cloudflare Worker
 * Converted from Streamlit application
 */

import { GiltDataFetcher } from './lib/gilt-data';
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
    const fetcher = new GiltDataFetcher();
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
      // Calculate for multiple gilts
      const results = calculator.calculateDetailedTaxAnalysis(
        body.giltData,
        body.investmentAmount,
        body.taxpayerType,
        body.savingsRate
      );
      
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