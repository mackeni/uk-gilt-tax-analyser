/**
 * Home Page View - Cloudflare Worker Version
 * Main interface for the UK Gilt Tax Efficiency Analyser
 */

import { formatCurrency, formatPercentage, formatCouponRate } from '../lib/utils.js';

export async function renderHomePage(request, env) {
  const html = `
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💷 UK Gilt Tax Efficiency Analyser</title>
    <meta name="description" content="Analyse the tax efficiency of UK gilt investments for different tax brackets with comprehensive calculations and comparisons">
    <meta name="keywords" content="UK gilts, tax efficiency, additional rate taxpayer, investment analysis, British pounds">
    <meta name="author" content="UK Gilt Tax Efficiency Analyser">
    
    <!-- Accessibility meta tags -->
    <meta name="theme-color" content="#3498db">
    <meta name="color-scheme" content="light">
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
        
        /* Accessibility enhancements */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        }
        
        .skip-link:focus {
            top: 6px;
        }
        
        /* Focus indicators */
        .form-group select:focus,
        .form-group input:focus,
        .btn:focus {
            outline: 3px solid #3498db;
            outline-offset: 2px;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .btn {
                border: 2px solid #000;
            }
            
            .metric-card {
                border: 2px solid #000;
            }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .btn {
                transition: none;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1a1a1a;
                color: #e0e0e0;
            }
            
            .header,
            .sidebar,
            .gilt-table,
            .metric-card {
                background: #2d2d2d;
                color: #e0e0e0;
            }
            
            .form-group select,
            .form-group input {
                background: #3d3d3d;
                color: #e0e0e0;
                border-color: #555;
            }
        }
        
        /* Focus management for screen readers */
        .loading[aria-live="polite"] {
            /* Ensure screen readers announce loading state */
        }
        
        /* Table accessibility */
        .data-table {
            border-collapse: collapse;
            width: 100%;
        }
        
        .data-table th,
        .data-table td {
            border: 1px solid #e0e0e0;
            padding: 12px;
            text-align: left;
        }
        
        .data-table th {
            background: #f8f9fa;
            font-weight: 600;
        }
        
        /* Error state accessibility */
        .error {
            border: 2px solid #e74c3c;
            border-radius: 4px;
        }
        
        /* Loading state accessibility */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .loading::before {
            content: "";
            width: 20px;
            height: 20px;
            border: 3px solid #e0e0e0;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Ensure interactive elements are large enough */
        .btn,
        .form-group select,
        .form-group input {
            min-height: 44px;
            min-width: 44px;
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
        
        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <div class="container">
        <header class="header" role="banner">
            <h1 id="main-title">💷 UK Gilt Tax Efficiency Analyser</h1>
            <p id="app-description">Analyse the tax efficiency of UK gilt investments for your specific tax situation</p>
        </header>
        
        <div class="main-content">
            <aside class="sidebar" role="complementary" aria-labelledby="settings-heading">
                <h3 id="settings-heading">💷 Tax Settings</h3>
                <form role="form" aria-label="Tax calculation settings">
                    <div class="form-group">
                        <label for="taxBracket">Select Your Tax Bracket</label>
                        <select id="taxBracket" aria-describedby="tax-bracket-help" aria-required="true">
                            <option value="basic_rate">Basic Rate (20%)</option>
                            <option value="higher_rate">Higher Rate (40%)</option>
                            <option value="additional_rate" selected>Additional Rate (45%)</option>
                        </select>
                        <div id="tax-bracket-help" class="sr-only">Choose your marginal income tax rate for accurate calculations</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="investmentAmount">Investment Amount (£)</label>
                        <input type="number" 
                               id="investmentAmount" 
                               value="10000" 
                               min="100" 
                               max="10000000" 
                               step="1000"
                               aria-describedby="investment-help"
                               aria-required="true">
                        <div id="investment-help" class="sr-only">Enter the amount you want to invest in pounds sterling</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="savingsRate">Current Savings Rate (%)</label>
                        <input type="number" 
                               id="savingsRate" 
                               value="4.5" 
                               min="0" 
                               max="20" 
                               step="0.1"
                               aria-describedby="savings-help"
                               aria-required="true">
                        <div id="savings-help" class="sr-only">Enter your current savings account interest rate for comparison</div>
                    </div>
                    
                    <div class="tax-info" id="taxInfo" role="region" aria-labelledby="tax-info-heading">
                        <h4 id="tax-info-heading">Your Tax Settings:</h4>
                        <div id="taxDetails" aria-live="polite">
                            <p><strong>Income Tax Rate:</strong> <span id="current-tax-rate">45%</span></p>
                            <p><strong>Personal Savings Allowance:</strong> <span id="current-psa">£0</span></p>
                            <p><strong>Capital Gains Tax on Gilts:</strong> <span id="current-cgt">0% (exempt)</span></p>
                        </div>
                    </div>
                    
                    <button class="btn" 
                            id="refreshData" 
                            type="button"
                            aria-describedby="refresh-help">
                        <span aria-hidden="true">🔄</span> Refresh Data
                    </button>
                    <div id="refresh-help" class="sr-only">Click to refresh gilt market data</div>
                </form>
            </aside>
            
            <main class="gilt-table" id="main-content" role="main" aria-labelledby="results-heading">
                <h2 id="results-heading">📊 Available Gilts</h2>
                <div id="loading" 
                     class="loading" 
                     role="status" 
                     aria-live="polite" 
                     aria-label="Loading gilt data">
                    <span class="sr-only">Loading gilt market data, please wait...</span>
                    Loading gilt data...
                </div>
                <div id="error" 
                     class="error" 
                     role="alert" 
                     aria-live="assertive" 
                     style="display: none;">
                </div>
                <div id="giltData" 
                     style="display: none;" 
                     role="region" 
                     aria-labelledby="data-table-heading">
                    <h3 id="data-table-heading" class="sr-only">Gilt investment data table</h3>
                </div>
                <div id="metrics" 
                     class="metrics" 
                     style="display: none;" 
                     role="region" 
                     aria-labelledby="metrics-heading">
                    <h3 id="metrics-heading" class="sr-only">Key investment metrics</h3>
                </div>
            </main>
        </div>
    </div>
    
    <script>
        let currentGiltData = [];
        let currentSettings = {
            taxBracket: 'additional_rate',
            investmentAmount: 10000,
            savingsRate: 4.5
        };
        
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
            
            // Keyboard navigation support
            document.addEventListener('keydown', handleKeyboardNavigation);
            
            // Form validation and accessibility
            const inputs = document.querySelectorAll('input[type="number"], select');
            inputs.forEach(input => {
                input.addEventListener('invalid', handleInvalidInput);
                input.addEventListener('blur', validateInput);
            });
            
            // Announce page readiness to screen readers
            announceToScreenReader('Page loaded. Use the settings on the left to configure your tax bracket and investment amount.');
        }
        
        function handleKeyboardNavigation(event) {
            // Allow Escape key to close error messages
            if (event.key === 'Escape') {
                const errorDiv = document.getElementById('error');
                if (errorDiv.style.display !== 'none') {
                    errorDiv.style.display = 'none';
                    announceToScreenReader('Error message dismissed');
                }
            }
        }
        
        function handleInvalidInput(event) {
            const input = event.target;
            const errorMsg = getValidationMessage(input);
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', input.id + '-error');
            announceToScreenReader('Input error: ' + errorMsg);
        }
        
        function validateInput(event) {
            const input = event.target;
            if (input.checkValidity()) {
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
            }
        }
        
        function getValidationMessage(input) {
            if (input.id === 'investmentAmount') {
                return 'Investment amount must be between £100 and £10,000,000';
            } else if (input.id === 'savingsRate') {
                return 'Savings rate must be between 0% and 20%';
            }
            return 'Please enter a valid value';
        }
        
        function announceToScreenReader(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            // Remove after announcement
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        }
        
        function updateTaxSettings() {
            const taxBracket = document.getElementById('taxBracket').value;
            currentSettings.taxBracket = taxBracket;
            
            const taxInfo = {
                'basic_rate': { rate: 20, psa: 1000, name: 'Basic Rate' },
                'higher_rate': { rate: 40, psa: 500, name: 'Higher Rate' },
                'additional_rate': { rate: 45, psa: 0, name: 'Additional Rate' }
            };
            
            const info = taxInfo[taxBracket];
            
            // Update individual elements for screen readers
            document.getElementById('current-tax-rate').textContent = info.rate + '%';
            document.getElementById('current-psa').textContent = '£' + info.psa.toLocaleString();
            document.getElementById('current-cgt').textContent = '0% (exempt)';
            
            // Announce the change to screen readers
            announceToScreenReader(\`Tax bracket updated to \${info.name} with \${info.rate}% income tax rate and £\${info.psa.toLocaleString()} Personal Savings Allowance\`);
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function updateInvestmentAmount() {
            const input = document.getElementById('investmentAmount');
            const value = parseFloat(input.value);
            
            if (value >= 100 && value <= 10000000) {
                currentSettings.investmentAmount = value;
                input.removeAttribute('aria-invalid');
                
                if (currentGiltData.length > 0) {
                    calculateTaxEfficiency();
                }
                
                // Announce significant changes
                if (value >= 100000) {
                    announceToScreenReader(\`Investment amount updated to £\${value.toLocaleString()}\`);
                }
            } else {
                input.setAttribute('aria-invalid', 'true');
                announceToScreenReader('Please enter a valid investment amount between £100 and £10,000,000');
            }
        }
        
        function updateSavingsRate() {
            const input = document.getElementById('savingsRate');
            const value = parseFloat(input.value);
            
            if (value >= 0 && value <= 20) {
                currentSettings.savingsRate = value;
                input.removeAttribute('aria-invalid');
                
                if (currentGiltData.length > 0) {
                    calculateTaxEfficiency();
                }
                
                announceToScreenReader(\`Savings rate updated to \${value}%\`);
            } else {
                input.setAttribute('aria-invalid', 'true');
                announceToScreenReader('Please enter a valid savings rate between 0% and 20%');
            }
        }
        
        async function loadGiltData() {
            const loadingDiv = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            const dataDiv = document.getElementById('giltData');
            const metricsDiv = document.getElementById('metrics');
            const refreshBtn = document.getElementById('refreshData');
            
            // Update button state
            refreshBtn.disabled = true;
            refreshBtn.setAttribute('aria-busy', 'true');
            refreshBtn.textContent = 'Loading...';
            
            // Show loading state
            loadingDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            dataDiv.style.display = 'none';
            metricsDiv.style.display = 'none';
            
            // Announce loading to screen readers
            announceToScreenReader('Loading gilt market data, please wait...');
            
            try {
                const response = await fetch('/api/gilt-data');
                if (!response.ok) {
                    throw new Error(\`Failed to fetch gilt data: \${response.status} \${response.statusText}\`);
                }
                
                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error);
                }
                
                currentGiltData = data;
                
                loadingDiv.style.display = 'none';
                dataDiv.style.display = 'block';
                metricsDiv.style.display = 'block';
                
                calculateTaxEfficiency();
                
                // Announce success
                announceToScreenReader(\`Gilt data loaded successfully. Found \${data.length} gilts available for analysis.\`);
                
            } catch (error) {
                loadingDiv.style.display = 'none';
                errorDiv.style.display = 'block';
                errorDiv.textContent = \`Error loading gilt data: \${error.message}\`;
                errorDiv.setAttribute('role', 'alert');
                
                // Announce error to screen readers
                announceToScreenReader(\`Error loading data: \${error.message}\`);
            } finally {
                // Reset button state
                refreshBtn.disabled = false;
                refreshBtn.removeAttribute('aria-busy');
                refreshBtn.innerHTML = '<span aria-hidden="true">🔄</span> Refresh Data';
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
                displayResults(results);
                
            } catch (error) {
                console.error('Error calculating tax efficiency:', error);
            }
        }
        
        function displayResults(results) {
            const dataDiv = document.getElementById('giltData');
            const metricsDiv = document.getElementById('metrics');
            
            // Display metrics
            const bestGilt = results.reduce((best, gilt) => 
                gilt.afterTaxYield > best.afterTaxYield ? gilt : best, results[0]);
            
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
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                            <th style="padding: 12px; text-align: left; border-right: 1px solid #e0e0e0;">Name</th>
                            <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">Coupon Rate</th>
                            <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">Current Yield</th>
                            <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">After-Tax Yield</th>
                            <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">Equivalent Savings Rate</th>
                            <th style="padding: 12px; text-align: right;">Years to Maturity</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${results.map(gilt => \`
                            <tr style="border-bottom: 1px solid #e0e0e0;">
                                <td style="padding: 12px; border-right: 1px solid #e0e0e0;">\${gilt.name}</td>
                                <td style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${gilt.couponRate.toFixed(2)}%</td>
                                <td style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${gilt.currentYield.toFixed(2)}%</td>
                                <td style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0; font-weight: bold; color: #27ae60;">\${gilt.afterTaxYield.toFixed(2)}%</td>
                                <td style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${gilt.equivalentSavingsRate.toFixed(2)}%</td>
                                <td style="padding: 12px; text-align: right;">\${gilt.yearsToMaturity.toFixed(1)}</td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
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