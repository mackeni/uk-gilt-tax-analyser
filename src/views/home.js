/**
 * Home Page View - Cloudflare Worker Version
 * Main interface for the UK Gilt Tax Efficiency Analyser
 */

import { formatCurrency, formatPercentage, formatCouponRate } from '../lib/utils.js';

export async function renderHomePage(request, env) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💷 UK Gilt Tax Efficiency Analyser</title>
    <style>
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
        
        .form-group label {
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
        
        .main-content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }
        
        .gilt-table {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .gilt-table h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 1.3em;
        }
        
        .loading {
            text-align: center;
            padding: 50px;
            color: #7f8c8d;
            font-size: 1.1em;
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .btn {
            background: #3498db;
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #2980b9;
        }
        
        .btn:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
        }
        
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .metric-value {
            font-size: 1.8em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .metric-label {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-bottom: 5px;
        }
        
        .metric-subtitle {
            color: #95a5a6;
            font-size: 0.8em;
            margin-top: 5px;
        }
        
        .filter-controls {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .range-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        
        .range-container input[type="range"] {
            flex: 1;
            max-width: 200px;
            height: 8px;
            border-radius: 5px;
            background: #ddd;
            outline: none;
            -webkit-appearance: none;
        }
        
        .range-container input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .range-container input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .range-info {
            margin-top: 10px;
            color: #7f8c8d;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .header {
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .header h1 {
                font-size: 1.8em;
                margin-bottom: 8px;
            }
            
            .header p {
                font-size: 1em;
            }
            
            .container {
                padding: 10px;
            }
            
            .sidebar {
                padding: 20px;
                margin-bottom: 20px;
            }
            
            .gilt-table {
                padding: 20px;
            }
            
            .metrics {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .metric-card {
                padding: 15px;
            }
            
            .metric-value {
                font-size: 1.5em;
            }
            
            .form-group select,
            .form-group input {
                font-size: 16px;
                padding: 12px;
            }
            
            .btn {
                width: 100%;
                padding: 15px;
                font-size: 16px;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 5px;
            }
            
            .header {
                padding: 15px;
            }
            
            .header h1 {
                font-size: 1.5em;
            }
            
            .sidebar,
            .gilt-table {
                padding: 15px;
            }
            
            .sidebar h3,
            .gilt-table h3 {
                font-size: 1.1em;
            }
            
            .metric-value {
                font-size: 1.3em;
            }
            
            .tax-info {
                padding: 12px;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
        }
        
        /* Table Responsiveness */
        .table-container {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
        }
        
        table th:nth-child(2), table td:nth-child(2) {
            min-width: 80px; /* Coupon column */
        }
        
        table th:nth-child(3), table td:nth-child(3) {
            min-width: 80px; /* Current yield column */
        }
        
        table th:nth-child(4), table td:nth-child(4) {
            min-width: 90px; /* After-tax column */
        }
        
        table th:nth-child(5), table td:nth-child(5) {
            min-width: 90px; /* Equivalent column */
        }
        
        table th:nth-child(6), table td:nth-child(6) {
            min-width: 60px; /* Years column */
        }
        
        /* Prevent text wrapping in numeric columns */
        table th:nth-child(2), table td:nth-child(2),
        table th:nth-child(3), table td:nth-child(3),
        table th:nth-child(4), table td:nth-child(4),
        table th:nth-child(5), table td:nth-child(5),
        table th:nth-child(6), table td:nth-child(6) {
            white-space: nowrap;
        }
        
        @media (max-width: 768px) {
            table {
                font-size: 12px;
            }
            
            th, td {
                padding: 8px 6px; /* Increased padding to prevent truncation */
            }
            
            .table-container {
                margin: 10px -5px;
            }
        }
        
        @media (max-width: 480px) {
            table {
                font-size: 11px;
            }
            
            th, td {
                padding: 6px 4px; /* Still provide adequate padding */
            }

            
            .table-container {
                margin: 10px -10px;
            }
        }
        
        /* Better touch targets for mobile */
        @media (max-width: 768px) {
            select, input, button {
                min-height: 44px;
            }
            
            .btn {
                min-height: 48px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>💷 UK Gilt Tax Efficiency Analyser</h1>
            <p>Analyse the tax efficiency of UK gilt investments for your specific tax situation</p>
        </header>
        
        <div class="main-content">
            <aside class="sidebar">
                <h3>💷 Tax Settings</h3>
                <div class="form-group">
                    <label for="taxBracket">Select Your Tax Bracket</label>
                    <select id="taxBracket">
                        <option value="basic_rate">Basic Rate (20%)</option>
                        <option value="higher_rate">Higher Rate (40%)</option>
                        <option value="additional_rate" selected>Additional Rate (45%)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="investmentAmount">Investment Amount (£)</label>
                    <input type="number" id="investmentAmount" value="10000" min="100" max="10000000" step="1000">
                </div>
                
                <div class="form-group">
                    <label for="savingsRate">Current Savings Rate (%)</label>
                    <input type="number" id="savingsRate" value="4.5" min="0" max="20" step="0.1">
                </div>
                
                <div class="tax-info" id="taxInfo">
                    <h4>Your Tax Settings:</h4>
                    <div id="taxDetails">
                        <p><strong>Income Tax Rate:</strong> 45%</p>
                        <p><strong>Personal Savings Allowance:</strong> £0</p>
                        <p><strong>Capital Gains Tax on Gilts:</strong> 0% (exempt)</p>
                    </div>
                </div>
                
                <button class="btn" id="refreshData">🔄 Refresh Data</button>
            </aside>
            
            <main class="gilt-table">
                <h3>📊 Available Gilts</h3>
                
                <div id="filterControls" class="filter-controls" style="display: none;">
                    <div class="form-group">
                        <label for="durationRange">Filter by Duration (Years to Maturity):</label>
                        <div class="range-container">
                            <input type="range" id="durationMin" min="0" max="45" value="0" step="1">
                            <span id="durationMinValue">0</span> years
                            <span style="margin: 0 10px;">to</span>
                            <input type="range" id="durationMax" min="0" max="45" value="45" step="1">
                            <span id="durationMaxValue">45</span> years
                        </div>
                        <div class="range-info">
                            <small>Showing <span id="filteredCount">0</span> of <span id="totalCount">0</span> gilts</small>
                        </div>
                    </div>
                </div>
                
                <div id="loading" class="loading">Loading gilt data...</div>
                <div id="error" class="error" style="display: none;"></div>
                <div id="giltData" style="display: none;"></div>
                <div id="metrics" class="metrics" style="display: none;"></div>
            </main>
        </div>
    </div>
    
    <script>
        let currentGiltData = [];
        let currentResults = [];
        let currentSettings = {
            taxBracket: 'additional_rate',
            investmentAmount: 10000,
            savingsRate: 4.5
        };
        let durationFilter = { min: 0, max: 45 };
        
        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            setupEventListeners();
            loadGiltData();
        });
        
        function setupEventListeners() {
            document.getElementById('taxBracket').addEventListener('change', updateTaxSettings);
            document.getElementById('investmentAmount').addEventListener('input', updateInvestmentAmount);
            document.getElementById('savingsRate').addEventListener('input', updateSavingsRate);
            document.getElementById('refreshData').addEventListener('click', loadGiltData);
            
            // Duration filter listeners
            document.getElementById('durationMin').addEventListener('input', updateDurationFilter);
            document.getElementById('durationMax').addEventListener('input', updateDurationFilter);
        }
        
        function updateTaxSettings() {
            const taxBracket = document.getElementById('taxBracket').value;
            currentSettings.taxBracket = taxBracket;
            
            const taxInfo = {
                'basic_rate': { rate: 20, psa: 1000 },
                'higher_rate': { rate: 40, psa: 500 },
                'additional_rate': { rate: 45, psa: 0 }
            };
            
            const info = taxInfo[taxBracket];
            document.getElementById('taxDetails').innerHTML = \`
                <p><strong>Income Tax Rate:</strong> \${info.rate}%</p>
                <p><strong>Personal Savings Allowance:</strong> £\${info.psa.toLocaleString()}</p>
                <p><strong>Capital Gains Tax on Gilts:</strong> 0% (exempt)</p>
            \`;
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function updateInvestmentAmount() {
            currentSettings.investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function updateSavingsRate() {
            currentSettings.savingsRate = parseFloat(document.getElementById('savingsRate').value);
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function updateDurationFilter() {
            const minSlider = document.getElementById('durationMin');
            const maxSlider = document.getElementById('durationMax');
            const minValue = parseFloat(minSlider.value);
            const maxValue = parseFloat(maxSlider.value);
            
            // Ensure min doesn't exceed max
            if (minValue > maxValue) {
                minSlider.value = maxValue;
                durationFilter.min = maxValue;
            } else {
                durationFilter.min = minValue;
            }
            
            // Ensure max doesn't go below min
            if (maxValue < minValue) {
                maxSlider.value = minValue;
                durationFilter.max = minValue;
            } else {
                durationFilter.max = maxValue;
            }
            
            // Update display values
            document.getElementById('durationMinValue').textContent = durationFilter.min;
            document.getElementById('durationMaxValue').textContent = durationFilter.max;
            
            // Apply filter if we have results
            if (currentResults.length > 0) {
                displayResults(currentResults);
            }
        }
        
        async function loadGiltData() {
            const loadingDiv = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            const dataDiv = document.getElementById('giltData');
            const metricsDiv = document.getElementById('metrics');
            
            loadingDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            dataDiv.style.display = 'none';
            metricsDiv.style.display = 'none';
            
            try {
                const response = await fetch('/api/gilt-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch gilt data');
                }
                
                const data = await response.json();
                currentGiltData = data;
                
                loadingDiv.style.display = 'none';
                dataDiv.style.display = 'block';
                metricsDiv.style.display = 'block';
                document.getElementById('filterControls').style.display = 'block';
                
                calculateTaxEfficiency();
                
            } catch (error) {
                loadingDiv.style.display = 'none';
                errorDiv.style.display = 'block';
                errorDiv.textContent = \`Error loading gilt data: \${error.message}\`;
            }
        }
        
        async function calculateTaxEfficiency() {
            if (currentGiltData.length === 0) return;
            
            try {
                const response = await fetch('/api/calculate-tax', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        giltData: currentGiltData,
                        taxpayerType: currentSettings.taxBracket,
                        investmentAmount: currentSettings.investmentAmount,
                        savingsRate: currentSettings.savingsRate
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to calculate tax efficiency');
                }
                
                const results = await response.json();
                currentResults = results;
                displayResults(results);
                
            } catch (error) {
                console.error('Error calculating tax efficiency:', error);
            }
        }
        
        function displayResults(results) {
            const dataDiv = document.getElementById('giltData');
            const metricsDiv = document.getElementById('metrics');
            
            // Filter results by duration
            const filteredResults = results.filter(gilt => 
                gilt.yearsToMaturity >= durationFilter.min && 
                gilt.yearsToMaturity <= durationFilter.max
            );
            
            // Sort by years to maturity (increasing duration)
            const sortedResults = filteredResults.sort((a, b) => 
                a.yearsToMaturity - b.yearsToMaturity
            );
            
            // Update filter count display
            document.getElementById('filteredCount').textContent = sortedResults.length;
            document.getElementById('totalCount').textContent = results.length;
            
            // Display metrics (from filtered results)
            if (sortedResults.length === 0) {
                metricsDiv.innerHTML = '<div class="metric-card"><div class="metric-label">No gilts match your duration filter</div></div>';
                dataDiv.innerHTML = '<p style="text-align: center; padding: 20px; color: #7f8c8d;">No gilts found within the selected duration range. Adjust the filter above.</p>';
                return;
            }
            
            const bestGilt = sortedResults.reduce((best, gilt) => 
                gilt.afterTaxYield > best.afterTaxYield ? gilt : best, sortedResults[0]);
            
            metricsDiv.innerHTML = \`
                <div class="metric-card">
                    <div class="metric-label">💷 Best After-Tax Yield</div>
                    <div class="metric-value">\${bestGilt.afterTaxYield.toFixed(2)}%</div>
                    <div class="metric-subtitle">\${bestGilt.name}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">💷 Best Equivalent Savings Rate</div>
                    <div class="metric-value">\${bestGilt.equivalentSavingsRate.toFixed(2)}%</div>
                    <div class="metric-subtitle">\${bestGilt.name}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">💷 Annual Tax Advantage</div>
                    <div class="metric-value">£\${bestGilt.annualAdvantage.toFixed(0)}</div>
                    <div class="metric-subtitle">vs. savings account</div>
                </div>
            \`;
            
            // Display table
            const tableHTML = \`
                <div class="table-container">
                    <table>
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                                <th style="padding: 12px; text-align: left; border-right: 1px solid #e0e0e0;">Name</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">Coupon</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">Current</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">After-Tax</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">Equivalent</th>
                                <th style="padding: 12px; text-align: right;">Years</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${sortedResults.map(gilt => \`
                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                    <td style="padding: 12px; border-right: 1px solid #e0e0e0; font-weight: 500;">\${gilt.name}</td>
                                    <td style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${gilt.couponRate.toFixed(3).replace(/\.?0+$/, '')}%</td>
                                    <td style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${gilt.currentYield.toFixed(2)}%</td>
                                    <td style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0; font-weight: bold; color: #27ae60;">\${gilt.afterTaxYield.toFixed(2)}%</td>
                                    <td style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${gilt.equivalentSavingsRate.toFixed(2)}%</td>
                                    <td style="padding: 12px; text-align: right;">\${gilt.yearsToMaturity.toFixed(1)}</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                </div>
            \`;
            
            dataDiv.innerHTML = tableHTML;
        }
    </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}