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
        
        .range-container input[type="number"] {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .range-container input[type="number"]:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
        }
        
        .range-info {
            margin-top: 10px;
            color: #7f8c8d;
        }
        
        .clickable-cell {
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .clickable-cell:hover {
            background-color: #f8f9fa;
        }
        
        /* Ensure table structure is preserved */
        .table-container table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }
        
        .table-container td, .table-container th {
            vertical-align: middle;
            padding: 8px 6px;
        }
        
        /* Column width optimization - 6 columns without coupon */
        .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 30%; } /* Name */
        .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 15%; } /* Clean Price */
        .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 15%; } /* Dirty Price */
        .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 15%; } /* After-Tax IRR */
        .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 20%; } /* Equivalent Rate */
        .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 5%; } /* Years */
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        
        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 30px;
            border-radius: 10px;
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 15px;
        }
        
        .modal-title {
            font-size: 1.4em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .close {
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close:hover {
            color: #000;
        }
        
        .calculation-step {
            margin-bottom: 15px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }
        
        .calculation-formula {
            font-family: 'Courier New', monospace;
            background-color: #e8f4f8;
            padding: 10px;
            border-radius: 3px;
            margin: 10px 0;
        }
        
        /* Schedule tooltip styles */
        .schedule-tooltip {
            max-width: 100%;
        }
        
        .schedule-summary {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #28a745;
        }
        
        .schedule-summary p {
            margin: 5px 0;
            font-weight: 500;
        }
        
        .payment-schedule {
            overflow-x: auto;
            margin: 20px 0;
        }
        
        .payment-schedule table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            background: white;
        }
        
        .payment-schedule th {
            background-color: #f8f9fa;
            padding: 8px 6px;
            text-align: left;
            border: 1px solid #dee2e6;
            font-weight: bold;
            font-size: 11px;
        }
        
        .payment-schedule td {
            padding: 6px;
            border: 1px solid #dee2e6;
            text-align: right;
        }
        
        .payment-schedule td:first-child {
            text-align: left;
        }
        
        .maturity-payment {
            background-color: #fff3cd;
            font-weight: bold;
        }
        
        .schedule-notes {
            background-color: #f1f3f4;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
        }
        
        .schedule-notes p {
            margin: 2px 0;
            font-size: 12px;
            color: #6c757d;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .main-content {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .sidebar {
                order: 2;
                padding: 15px;
            }
            
            .gilt-table {
                order: 1;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                font-size: 14px;
                margin-bottom: 5px;
            }
            
            .form-group select,
            .form-group input {
                font-size: 16px; /* Prevent zoom on iOS */
                padding: 12px;
                width: 100%;
                box-sizing: border-box;
            }
            
            .btn {
                font-size: 16px;
                padding: 12px 20px;
                width: 100%;
                margin-bottom: 10px;
            }
            
            .tax-info {
                font-size: 14px;
                padding: 12px;
            }
            
            .metrics {
                grid-template-columns: 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .metric-card {
                padding: 15px;
                text-align: center;
            }
            
            .metric-label {
                font-size: 12px;
            }
            
            .metric-value {
                font-size: 20px;
            }
            
            .metric-subtitle {
                font-size: 11px;
            }
            
            .filter-controls {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .range-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                justify-content: center;
            }
            
            .range-container input {
                width: 70px;
                font-size: 14px;
            }
            
            .range-container label {
                font-size: 14px;
                margin: 0;
            }
            
            .table-container {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .table-container table {
                min-width: 750px;
                font-size: 12px;
            }
            
            .table-container th {
                font-size: 11px;
                padding: 6px 4px;
                white-space: nowrap;
            }
            
            .table-container td {
                padding: 6px 4px;
                font-size: 12px;
            }
            
            .table-container td:first-child {
                font-size: 11px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            /* Mobile column width adjustments - 6 columns */
            .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 35%; } /* Name */
            .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 12%; } /* Clean Price */
            .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 12%; } /* Dirty Price */
            .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 15%; } /* After-Tax IRR */
            .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 18%; } /* Equivalent Rate */
            .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 8%; } /* Years */
            
            .clickable-cell {
                min-height: 44px; /* Touch target size */
                cursor: pointer;
                position: relative;
            }
            
            .clickable-cell:hover {
                background-color: #f8f9fa;
            }
            
            /* Modal improvements for mobile */
            .modal-content {
                width: 95%;
                max-width: 400px;
                margin: 5% auto;
                max-height: 85vh;
                overflow-y: auto;
            }
            
            .calculation-step {
                margin-bottom: 12px;
                padding: 12px;
            }
            
            .calculation-formula {
                font-size: 13px;
                padding: 8px;
                word-wrap: break-word;
            }
            
            .schedule-tooltip .payment-schedule table {
                font-size: 10px;
            }
            
            .schedule-tooltip .payment-schedule th,
            .schedule-tooltip .payment-schedule td {
                padding: 4px 3px;
            }
            
            .loading, .error {
                font-size: 14px;
                padding: 20px 15px;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 5px;
            }
            
            h1 {
                font-size: 22px;
                text-align: center;
                margin-bottom: 15px;
            }
            
            h3 {
                font-size: 18px;
                margin-bottom: 15px;
            }
            
            .metrics {
                grid-template-columns: 1fr;
                gap: 8px;
            }
            
            .metric-card {
                padding: 12px;
            }
            
            .metric-value {
                font-size: 18px;
            }
            
            .range-container {
                flex-direction: column;
                gap: 8px;
            }
            
            .range-container > div {
                display: flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                justify-content: center;
            }
            
            .table-container table {
                min-width: 650px;
                font-size: 11px;
            }
            
            .table-container th {
                font-size: 9px;
                padding: 4px 3px;
            }
            
            .table-container td {
                padding: 4px 3px;
                font-size: 10px;
            }
            
            .table-container td:first-child {
                font-size: 9px;
            }
            
            /* Ultra-compact mobile column widths - 6 columns */
            .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 38%; } /* Name */
            .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 12%; } /* Clean Price */
            .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 12%; } /* Dirty Price */
            .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 15%; } /* After-Tax IRR */
            .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 16%; } /* Equivalent Rate */
            .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 7%; } /* Years */
            
            .modal-content {
                width: 98%;
                margin: 2% auto;
                padding: 15px;
                max-height: 90vh;
            }
            
            .close {
                font-size: 24px;
                top: 10px;
                right: 15px;
            }
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
        
        @media (max-width: 768px) {
            table {
                font-size: 12px;
            }
            
            th, td {
                padding: 8px 4px;
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
                padding: 6px 3px;
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
                            <div>
                                <label for="durationMin">Min:</label>
                                <input type="number" id="durationMin" min="0" max="45" value="0" step="0.5">
                                <span>years</span>
                            </div>
                            <div>
                                <label for="durationMax">Max:</label>
                                <input type="number" id="durationMax" min="0" max="45" value="2" step="0.5">
                                <span>years</span>
                            </div>
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
        // Utility functions (inline to avoid module import issues)
        function formatCurrency(amount, currency = '£') {
            if (isNaN(amount) || amount === null || amount === undefined) {
                return 'N/A';
            }
            if (Math.abs(amount) >= 1000000) {
                return currency + (amount / 1000000).toFixed(2) + 'M';
            } else if (Math.abs(amount) >= 1000) {
                return currency + (amount / 1000).toFixed(1) + 'K';
            } else {
                return currency + amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        }

        function formatPercentage(percentage, decimalPlaces = 2) {
            if (isNaN(percentage) || percentage === null || percentage === undefined) {
                return 'N/A';
            }
            return percentage.toFixed(decimalPlaces) + '%';
        }

        function formatCouponRate(rate) {
            if (isNaN(rate) || rate === null || rate === undefined) {
                return 'N/A';
            }
            
            // Format with max 3 decimal places, removing trailing zeros
            const formatted = rate.toFixed(3).replace(/\\.?0+$/, '');
            return formatted + '%';
        }
        
        let currentGiltData = [];
        let currentResults = [];
        let currentSettings = {
            taxBracket: 'additional_rate',
            investmentAmount: 10000,
            savingsRate: 4.5
        };
        let durationFilter = { min: 0, max: 2 };
        
        // Initialize app (moved to end after modal creation)
        
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
            const minInput = document.getElementById('durationMin');
            const maxInput = document.getElementById('durationMax');
            let minValue = parseFloat(minInput.value) || 0;
            let maxValue = parseFloat(maxInput.value) || 45;
            
            // Ensure values are within bounds
            minValue = Math.max(0, Math.min(45, minValue));
            maxValue = Math.max(0, Math.min(45, maxValue));
            
            // Ensure min doesn't exceed max
            if (minValue > maxValue) {
                minValue = maxValue;
                minInput.value = minValue;
            }
            
            // Ensure max doesn't go below min
            if (maxValue < minValue) {
                maxValue = minValue;
                maxInput.value = maxValue;
            }
            
            // Update filter values
            durationFilter.min = minValue;
            durationFilter.max = maxValue;
            
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
                // Don't show data div yet - wait for tax calculations
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
                
                // Now show the data sections since we have complete results
                const dataDiv = document.getElementById('giltData');
                const metricsDiv = document.getElementById('metrics');
                dataDiv.style.display = 'block';
                metricsDiv.style.display = 'block';
                
                displayResults(results);
                
            } catch (error) {
                console.error('Error calculating tax efficiency:', error);
                const errorDiv = document.getElementById('error');
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Error calculating tax efficiency: ' + error.message;
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
                (gilt.afterTaxYield || 0) > (best.afterTaxYield || 0) ? gilt : best, sortedResults[0]);
            
            metricsDiv.innerHTML = \`
                <div class="metric-card">
                    <div class="metric-label">💷 Best After-Tax Yield</div>
                    <div class="metric-value">\${(bestGilt.afterTaxYield || 0).toFixed(2)}%</div>
                    <div class="metric-subtitle">\${bestGilt.name}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">💷 Best Equivalent Gross Savings Rate</div>
                    <div class="metric-value">\${(bestGilt.equivalentGrossSavingsRate || 0).toFixed(2)}%</div>
                    <div class="metric-subtitle">\${bestGilt.name}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">💷 Annual Tax Advantage</div>
                    <div class="metric-value">£\${(bestGilt.annualAdvantage || 0).toFixed(0)}</div>
                    <div class="metric-subtitle">vs. savings account</div>
                </div>
            \`;
            
            // Display table with mobile-optimized headers
            const isMobile = window.innerWidth <= 768;
            const tableHTML = \`
                <div class="table-container">
                    <table>
                        <thead>
                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                                <th style="padding: 12px; text-align: left; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Gilt' : 'Name'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Clean £' : 'Clean Price'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Dirty £' : 'Dirty Price'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'After-Tax' : 'After-Tax IRR'}</th>
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Equiv Rate' : 'Equivalent Gross Savings Rate'}</th>
                                <th style="padding: 12px; text-align: right;">\${isMobile ? 'Years' : 'Years to Maturity'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${sortedResults.map((gilt, index) => \`
                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                    <td class="clickable-cell" data-type="name" data-index="\${index}" style="padding: 12px; border-right: 1px solid #e0e0e0; font-weight: 500; text-align: left;">\${gilt.name}</td>
                                    <td class="clickable-cell" data-type="clean-price" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">£\${(gilt.cleanPrice || 0).toFixed(2)}</td>
                                    <td class="clickable-cell" data-type="dirty-price" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">£\${(gilt.dirtyPrice || gilt.cleanPrice || 0).toFixed(2)}</td>
                                    <td class="clickable-cell" data-type="after-tax" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0; font-weight: bold; color: #27ae60;">\${(gilt.afterTaxYield || 0).toFixed(2)}%</td>
                                    <td class="clickable-cell" data-type="equivalent" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${(gilt.equivalentGrossSavingsRate || 0).toFixed(2)}%</td>
                                    <td class="clickable-cell" data-type="years" data-index="\${index}" style="padding: 12px; text-align: right;">\${(gilt.yearsToMaturity || 0).toFixed(1)}</td>
                                </tr>
                            \`).join('')}
                        </tbody>
                    </table>
                </div>
            \`;
            
            dataDiv.innerHTML = tableHTML;
            
            // Add click event listeners to clickable cells
            document.querySelectorAll('.clickable-cell').forEach(cell => {
                cell.addEventListener('click', function() {
                    const type = this.dataset.type;
                    const index = parseInt(this.dataset.index);
                    const gilt = sortedResults[index];
                    showCalculationModal(type, gilt);
                });
            });
        }
        
        function showCalculationModal(type, gilt) {
            const modal = document.getElementById('calculationModal');
            const title = document.getElementById('modalTitle');
            const content = document.getElementById('modalContent');
            
            let titleText = '';
            let contentHTML = '';
            
            switch(type) {
                case 'coupon':
                    titleText = 'Coupon Rate';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What is the Coupon Rate?</h4>
                            <p>The coupon rate is the annual interest rate paid by the gilt, expressed as a percentage of the nominal (face) value.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Coupon Rate = \${formatCouponRate(gilt.couponRate)}
                            </div>
                            <p>This means the gilt pays \${gilt.couponRate}% of its £100 nominal value annually as interest, split into two semi-annual payments.</p>
                            <p><strong>Annual coupon payment per £100:</strong> £\${gilt.couponRate.toFixed(2)}</p>
                        </div>
                    \`;
                    break;
                    
                case 'clean-price':
                    titleText = 'Clean Price';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What is the Clean Price?</h4>
                            <p>The clean price is the market price of the gilt excluding accrued interest. This is the quoted price you see in markets.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Clean Price = £\${gilt.cleanPrice.toFixed(2)} per £100 nominal
                            </div>
                            <p>This is the base trading price before adding any accrued interest since the last coupon payment.</p>
                            \${gilt.cleanPrice > 100 ? '<p><strong>Premium Bond:</strong> Trading above par value (£100).</p>' : 
                              gilt.cleanPrice < 100 ? '<p><strong>Discount Bond:</strong> Trading below par value (£100).</p>' : 
                              '<p><strong>Par Bond:</strong> Trading at exactly par value (£100).</p>'}
                        </div>
                    \`;
                    break;
                    
                case 'dirty-price':
                    titleText = 'Dirty Price';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What is the Dirty Price?</h4>
                            <p>The dirty price is the total price you pay, including both the clean price and accrued interest since the last coupon payment.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>Calculation:</h4>
                            <div class="calculation-formula">
                                Dirty Price = Clean Price + Accrued Interest
                            </div>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Clean Price = £\${gilt.cleanPrice.toFixed(2)}
                            </div>
                            <div class="calculation-formula">
                                Accrued Interest = £\${(gilt.dirtyPrice - gilt.cleanPrice).toFixed(2)}
                            </div>
                            <div class="calculation-formula">
                                <strong>Dirty Price = £\${gilt.dirtyPrice.toFixed(2)} per £100 nominal</strong>
                            </div>
                            <p>This is the actual amount you pay when purchasing the gilt, as you compensate the seller for interest earned since the last payment.</p>
                        </div>
                    \`;
                    break;
                    
                case 'current-yield':
                    titleText = 'Current Yield';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>Current Yield Calculation</h4>
                            <p>Current yield shows the annual return based on the current market price, not the nominal value.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>Formula:</h4>
                            <div class="calculation-formula">
                                Current Yield = (Annual Coupon Payment ÷ Current Price) × 100
                            </div>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Current Yield = (£\${gilt.couponRate.toFixed(2)} ÷ £\${gilt.cleanPrice.toFixed(2)}) × 100 = \${gilt.currentYield.toFixed(2)}%
                            </div>
                            <p>The current yield reflects the actual return you get based on today's market price.</p>
                        </div>
                    \`;
                    break;
                    
                case 'after-tax':
                    const taxRate = currentSettings.taxBracket === 'additional_rate' ? 45 : 
                                   currentSettings.taxBracket === 'higher_rate' ? 40 : 20;
                    
                    titleText = 'After-Tax Yield with Detailed Schedule';
                    
                    // Check if we have schedule details from the API
                    if (gilt.scheduleTooltip) {
                        contentHTML = gilt.scheduleTooltip;
                    } else {
                        // Fallback to basic calculation
                        contentHTML = \`
                            <div class="calculation-step">
                                <h4>After-Tax Yield Calculation</h4>
                                <p>Shows your actual return after paying income tax on coupon payments. Capital gains on gilts are tax-free.</p>
                            </div>
                            <div class="calculation-step">
                                <h4>Formula:</h4>
                                <div class="calculation-formula">
                                    After-Tax Yield = Coupon Rate × (1 - Tax Rate) + Capital Gains Yield
                                </div>
                            </div>
                            <div class="calculation-step">
                                <h4>For \${gilt.name} (Tax Rate: \${taxRate}%):</h4>
                                <div class="calculation-formula">
                                    After-Tax Coupon = \${gilt.couponRate.toFixed(2)}% × (1 - 0.\${taxRate}) = \${(gilt.couponRate * (1 - taxRate/100)).toFixed(2)}%
                                </div>
                                \${gilt.cleanPrice !== 100 ? \`
                                    <div class="calculation-formula">
                                        Capital Gains = (\${((100 - gilt.cleanPrice) / gilt.yearsToMaturity).toFixed(2)}% per year, tax-free)
                                    </div>
                                \` : ''}
                                <div class="calculation-formula">
                                    <strong>Total After-Tax Yield = \${gilt.afterTaxYield.toFixed(2)}%</strong>
                                </div>
                                <p><em>Note: Detailed coupon schedule calculation unavailable. Please refresh data for complete schedule details.</em></p>
                            </div>
                        \`;
                    }
                    break;
                    
                case 'equivalent':
                    titleText = 'Equivalent Gross Savings Rate';
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>Equivalent Gross Savings Rate</h4>
                            <p>The gross interest rate a savings account would need to match this gilt's after-tax return.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>How It's Calculated:</h4>
                            <div class="calculation-formula">
                                Formula: After-Tax IRR ÷ (1 - Income Tax Rate)
                            </div>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                                <p><strong>Example Calculation:</strong></p>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>Gilt After-Tax IRR: \${gilt.afterTaxYield.toFixed(2)}%</li>
                                    <li>Your Income Tax Rate: \${(taxRate * 100).toFixed(0)}%</li>
                                    <li>Required Gross Rate: \${gilt.afterTaxYield.toFixed(2)}% ÷ (1 - \${taxRate.toFixed(2)}) = <strong>\${gilt.equivalentGrossSavingsRate.toFixed(2)}%</strong></li>
                                </ul>
                            </div>
                        </div>
                        <div class="calculation-step">
                            <h4>Why This Matters:</h4>
                            <p>• Savings accounts are taxed as income at your marginal rate (\${(taxRate * 100).toFixed(0)}%)</p>
                            <p>• Gilt coupons are also taxed as income, but capital gains are tax-free</p>
                            <p>• This calculation shows what savings rate you'd need to match the gilt's performance</p>
                            <p>• If current savings rates are below \${gilt.equivalentGrossSavingsRate.toFixed(2)}%, this gilt offers better value</p>
                        </div>
                    \`;
                    break;
                    
                case 'years':
                    titleText = 'Years to Maturity';
                    const maturityDate = new Date(gilt.maturityDate);
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>Years to Maturity Calculation</h4>
                            <p>Time remaining until the gilt matures and pays back the £100 nominal value.</p>
                        </div>
                        <div class="calculation-step">
                            <h4>For \${gilt.name}:</h4>
                            <div class="calculation-formula">
                                Maturity Date: \${maturityDate.toLocaleDateString('en-GB')}
                            </div>
                            <div class="calculation-formula">
                                Years to Maturity: \${gilt.yearsToMaturity.toFixed(1)} years
                            </div>
                            <p>This gilt will mature in approximately \${gilt.yearsToMaturity.toFixed(1)} years, at which point you'll receive £100 per £100 nominal value held.</p>
                        </div>
                    \`;
                    break;
            }
            
            title.textContent = titleText;
            content.innerHTML = contentHTML;
            modal.style.display = 'block';
        }
        
        // Add modal HTML and event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Create modal HTML
            const modalHTML = \`
                <div id="calculationModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <span id="modalTitle" class="modal-title"></span>
                            <span class="close">&times;</span>
                        </div>
                        <div id="modalContent"></div>
                    </div>
                </div>
            \`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Close modal functionality
            const modal = document.getElementById('calculationModal');
            const closeBtn = document.querySelector('.close');
            
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            setupEventListeners();
            loadGiltData();
        });
    </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}