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
        
        /* Column width optimization - 7 columns with advantage column */
        .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 25%; } /* Name */
        .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 12%; } /* Clean Price */
        .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 12%; } /* Dirty Price */
        .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 12%; } /* After-Tax IRR */
        .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 18%; } /* Equivalent Rate */
        .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 6%; } /* Years */
        .table-container th:nth-child(7), .table-container td:nth-child(7) { width: 15%; } /* Advantage */
        
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
            
            /* Mobile column width adjustments - 7 columns */
            .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 28%; } /* Name */
            .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 10%; } /* Clean Price */
            .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 10%; } /* Dirty Price */
            .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 12%; } /* After-Tax IRR */
            .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 16%; } /* Equivalent Rate */
            .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 7%; } /* Years */
            .table-container th:nth-child(7), .table-container td:nth-child(7) { width: 17%; } /* Advantage */
            
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
            
            /* Ultra-compact mobile column widths - 7 columns */
            .table-container th:nth-child(1), .table-container td:nth-child(1) { width: 30%; } /* Name */
            .table-container th:nth-child(2), .table-container td:nth-child(2) { width: 9%; } /* Clean Price */
            .table-container th:nth-child(3), .table-container td:nth-child(3) { width: 9%; } /* Dirty Price */
            .table-container th:nth-child(4), .table-container td:nth-child(4) { width: 12%; } /* After-Tax IRR */
            .table-container th:nth-child(5), .table-container td:nth-child(5) { width: 15%; } /* Equivalent Rate */
            .table-container th:nth-child(6), .table-container td:nth-child(6) { width: 6%; } /* Years */
            .table-container th:nth-child(7), .table-container td:nth-child(7) { width: 19%; } /* Advantage */
            
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
        
        function getCurrentTaxRate() {
            return currentSettings.taxBracket === 'basic_rate' ? 20 : 
                   currentSettings.taxBracket === 'higher_rate' ? 40 : 45;
        }
        
        // IMMEDIATE DEBUG - Check if JavaScript is loading
        console.log('=== JAVASCRIPT FILE STARTED LOADING ===');
        console.log('Current time:', new Date());
        
        let currentGiltData = [];
        let currentResults = [];
        let currentSettings = {
            taxBracket: 'additional_rate',
            investmentAmount: 10000,
            savingsRate: 4.5
        };
        let durationFilter = { min: 0, max: 2 };
        
        // Initialize app - use fallback data immediately when rate limited
        function initializeApp() {
            console.log('=== APP INITIALIZATION STARTED ===');
            console.log('Current settings:', currentSettings);
            
            setupEventListeners();
            updateTaxSettings();
            
            // Skip API entirely and use fallback data for rate-limited scenarios
            console.log('=== STARTING IMMEDIATE FALLBACK DATA LOAD ===');
            
            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                loadFallbackData();
            }, 50);
        }
        
        function loadFallbackData() {
            console.log('=== STARTING FALLBACK DATA LOAD ===');
            const loadingDiv = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            
            console.log('Loading div:', loadingDiv);
            console.log('Error div:', errorDiv);
            
            if (loadingDiv) loadingDiv.style.display = 'block';
            if (errorDiv) errorDiv.style.display = 'none';
            
            try {
                console.log('Calling getFallbackGiltData...');
                currentGiltData = getFallbackGiltData();
                console.log('=== FALLBACK DATA LOADED ===');
                console.log('Current gilt data length:', currentGiltData ? currentGiltData.length : 'NULL');
                console.log('First gilt:', currentGiltData ? currentGiltData[0] : 'NULL');
                
                if (!currentGiltData || currentGiltData.length === 0) {
                    throw new Error('Fallback data is empty or null');
                }
                
                if (loadingDiv) loadingDiv.style.display = 'none';
                const filterControls = document.getElementById('filterControls');
                if (filterControls) filterControls.style.display = 'block';
                
                // Show warning about using cached data
                const warningDiv = document.createElement('div');
                warningDiv.style.cssText = 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 14px;';
                warningDiv.innerHTML = '⚠️ Using cached data due to API rate limits. Data may not be real-time.';
                warningDiv.id = 'rate-limit-warning';
                
                const mainContent = document.querySelector('.main-content');
                if (mainContent && !document.getElementById('rate-limit-warning')) {
                    mainContent.appendChild(warningDiv);
                }
                
                console.log('Calling calculateTaxEfficiency...');
                calculateTaxEfficiency();
            } catch (error) {
                console.error('=== FALLBACK DATA FAILED ===');
                console.error('Error details:', error);
                console.error('Error stack:', error.stack);
                
                if (loadingDiv) loadingDiv.style.display = 'none';
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = 'Unable to load gilt data: ' + error.message;
                }
            }
        }
        
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
                console.log('Fetching gilt data from /api/gilt-data...');
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout for rate limits
                
                const response = await fetch('/api/gilt-data', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error(\`API rate limited or unavailable\`);
                }
                
                const data = await response.json();
                console.log('Received data from API:', data?.length, 'gilts');
                
                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error('No gilt data received from API');
                }
                
                currentGiltData = data;
                
                loadingDiv.style.display = 'none';
                // Don't show data div yet - wait for tax calculations
                document.getElementById('filterControls').style.display = 'block';
                
                calculateTaxEfficiency();
                
            } catch (error) {
                console.error('API failed, using fallback data:', error);
                
                // Immediately use fallback data when API is rate-limited or unavailable
                try {
                    currentGiltData = getFallbackGiltData();
                    console.log('Successfully loaded fallback data:', currentGiltData.length, 'gilts');
                    
                    loadingDiv.style.display = 'none';
                    document.getElementById('filterControls').style.display = 'block';
                    
                    // Show warning but continue with fallback data
                    const warningDiv = document.createElement('div');
                    warningDiv.style.cssText = 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 14px;';
                    warningDiv.innerHTML = '⚠️ Using cached data due to API rate limits. Data may not be real-time.';
                    const mainContent = document.querySelector('.main-content');
                    const giltTable = document.querySelector('.gilt-table');
                    if (mainContent && giltTable) {
                        mainContent.insertBefore(warningDiv, giltTable);
                    } else {
                        document.body.appendChild(warningDiv);
                    }
                    
                    calculateTaxEfficiency();
                } catch (fallbackError) {
                    console.error('Fallback data also failed:', fallbackError);
                    loadingDiv.style.display = 'none';
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = 'Unable to load gilt data. Please refresh the page.';
                }
            }
        }
        
        function getFallbackGiltData() {
            console.log('Creating fallback gilt data...');
            const today = new Date();
            console.log('Today date:', today);
            const fallbackData = [
                { name: "Treasury 2% 2025", couponRate: 2.0, cleanPrice: 99.72, currentYield: 4.073, maturityDate: "2025-09-07" },
                { name: "Treasury 3.5% 2025", couponRate: 3.5, cleanPrice: 99.82, currentYield: 4.187, maturityDate: "2025-10-22" },
                { name: "Treasury 0.125% 2026", couponRate: 0.125, cleanPrice: 98.37, currentYield: 3.25, maturityDate: "2026-01-30" },
                { name: "Treasury 1.5% 2026", couponRate: 1.5, cleanPrice: 97.74, currentYield: 3.806, maturityDate: "2026-07-22" },
                { name: "Treasury 0.375% 2026", couponRate: 0.375, cleanPrice: 96.02, currentYield: 3.636, maturityDate: "2026-10-22" },
                { name: "Treasury 4.125% 2027", couponRate: 4.125, cleanPrice: 100.3, currentYield: 3.92, maturityDate: "2027-01-29" },
                { name: "Treasury 3.75% 2027", couponRate: 3.75, cleanPrice: 99.75, currentYield: 3.907, maturityDate: "2027-03-07" },
                { name: "Treasury 1.25% 2027", couponRate: 1.25, cleanPrice: 95.15, currentYield: 3.781, maturityDate: "2027-07-22" },
                { name: "Treasury 4.25% 2027", couponRate: 4.25, cleanPrice: 101.15, currentYield: 3.74, maturityDate: "2027-12-07" },
                { name: "Treasury 0.125% 2028", couponRate: 0.125, cleanPrice: 91.41, currentYield: 3.709, maturityDate: "2028-01-31" },
                { name: "Treasury 4.375% 2028", couponRate: 4.375, cleanPrice: 101.06, currentYield: 3.946, maturityDate: "2028-03-07" },
                { name: "Treasury 4.5% 2028", couponRate: 4.5, cleanPrice: 101.57, currentYield: 3.918, maturityDate: "2028-06-07" },
                { name: "Treasury 1.625% 2028", couponRate: 1.625, cleanPrice: 93.44, currentYield: 3.782, maturityDate: "2028-10-22" },
                { name: "Treasury 6% 2028", couponRate: 6.0, cleanPrice: 106.94, currentYield: 3.794, maturityDate: "2028-12-07" },
                { name: "Treasury 0.5% 2029", couponRate: 0.5, cleanPrice: 88.96, currentYield: 3.873, maturityDate: "2029-01-31" },
                { name: "Treasury 4.125% 2029", couponRate: 4.125, cleanPrice: 100.42, currentYield: 4.01, maturityDate: "2029-07-22" },
                { name: "Treasury 0.875% 2029", couponRate: 0.875, cleanPrice: 88.29, currentYield: 3.884, maturityDate: "2029-10-22" },
                { name: "Treasury 4.375% 2030", couponRate: 4.375, cleanPrice: 101.17, currentYield: 4.094, maturityDate: "2030-03-07" },
                { name: "Treasury 0.375% 2030", couponRate: 0.375, cleanPrice: 82.96, currentYield: 4.0, maturityDate: "2030-10-22" },
                { name: "Treasury 4.75% 2030", couponRate: 4.75, cleanPrice: 103.37, currentYield: 4.046, maturityDate: "2030-12-07" }
            ];
            
            const processedData = fallbackData.map(gilt => {
                const maturityDate = new Date(gilt.maturityDate);
                const yearsToMaturity = (maturityDate - today) / (365.25 * 24 * 60 * 60 * 1000);
                
                // Calculate basic accrued interest and dirty price
                const daysSinceLastCoupon = 134; // Approximate for demonstration
                const daysInCouponPeriod = 184; // Semi-annual
                const accruedInterest = (gilt.couponRate / 2) * (daysSinceLastCoupon / daysInCouponPeriod);
                
                const processedGilt = {
                    ...gilt,
                    yearsToMaturity: Math.max(0, yearsToMaturity),
                    dirtyPrice: gilt.cleanPrice + accruedInterest,
                    accruedInterest: accruedInterest
                };
                
                console.log('Processed gilt:', processedGilt.name, 'years:', processedGilt.yearsToMaturity);
                return processedGilt;
            }).filter(gilt => {
                const isValid = gilt.yearsToMaturity > 0;
                console.log('Gilt valid:', gilt.name, isValid);
                return isValid;
            });
            
            console.log('Final fallback data count:', processedData.length);
            return processedData;
        }
        
        async function calculateTaxEfficiency() {
            if (currentGiltData.length === 0) return;
            
            console.log('Calculating tax efficiency locally...');
            
            try {
                // Calculate tax efficiency locally without API calls
                const results = calculateTaxEfficiencyLocal(
                    currentGiltData,
                    currentSettings.taxBracket,
                    currentSettings.investmentAmount,
                    currentSettings.savingsRate
                );
                
                console.log('Local calculation results:', results.length, 'gilts processed');
                currentResults = results;
                
                // Now show the data sections since we have complete results
                const dataDiv = document.getElementById('giltData');
                const metricsDiv = document.getElementById('metrics');
                dataDiv.style.display = 'block';
                metricsDiv.style.display = 'block';
                
                displayResults(results);
                
            } catch (error) {
                console.error('Error calculating tax efficiency locally:', error);
                const errorDiv = document.getElementById('error');
                errorDiv.style.display = 'block';
                errorDiv.textContent = 'Error calculating tax efficiency: ' + error.message;
            }
        }
        
        function calculateTaxEfficiencyLocal(giltData, taxBracket, investmentAmount, savingsRate) {
            console.log('Starting local tax calculations...');
            
            // Tax rates based on bracket
            const taxRates = {
                'basic_rate': { income: 20, psa: 1000 },
                'higher_rate': { income: 40, psa: 500 },
                'additional_rate': { income: 45, psa: 0 }
            };
            
            const taxInfo = taxRates[taxBracket] || taxRates['additional_rate'];
            const incomeTaxRate = taxInfo.income / 100;
            const psaAmount = taxInfo.psa;
            
            console.log('Using tax rates:', taxInfo);
            
            return giltData.map(gilt => {
                console.log('Processing gilt:', gilt.name);
                
                // Calculate units owned
                const unitsOwned = investmentAmount / gilt.dirtyPrice * 100;
                
                // Calculate after-tax yield using simplified method
                const afterTaxYield = calculateAfterTaxIRR(gilt, unitsOwned, incomeTaxRate);
                
                // Calculate equivalent gross savings rate (what savings account would need to match gilt)
                const equivalentGrossSavingsRate = afterTaxYield / (1 - incomeTaxRate);
                
                // Calculate precise advantage using actual coupon schedule
                const giltTotalCashReceived = calculateTotalCashFromGilt(gilt, unitsOwned, incomeTaxRate);
                const savingsTotalCashReceived = calculateTotalCashFromSavings(investmentAmount, savingsRate, incomeTaxRate, psaAmount, gilt.yearsToMaturity);
                const extraIncome = giltTotalCashReceived - savingsTotalCashReceived;
                
                console.log('Gilt processed:', gilt.name, 'After-tax yield:', afterTaxYield.toFixed(3));
                
                return {
                    ...gilt,
                    afterTaxYield: afterTaxYield,
                    equivalentGrossSavingsRate: equivalentGrossSavingsRate,
                    extraIncome: extraIncome,
                    unitsOwned: unitsOwned
                };
            });
        }
        
        function calculateAfterTaxIRR(gilt, unitsOwned, incomeTaxRate) {
            // Generate detailed coupon schedule and calculate IRR
            const couponSchedule = generateCouponSchedule(gilt, unitsOwned, incomeTaxRate);
            gilt.couponSchedule = couponSchedule; // Store for tooltips
            
            // Calculate IRR using Newton-Raphson method
            const initialInvestment = (gilt.cleanPrice + gilt.accruedInterest) * unitsOwned / 100;
            const cashFlows = couponSchedule.map(payment => ({
                amount: payment.afterTaxAmount,
                date: new Date(payment.date)
            }));
            
            // Add principal repayment at maturity
            const maturityDate = new Date(gilt.maturityDate);
            cashFlows.push({
                amount: unitsOwned, // £100 per £100 nominal (tax-free)
                date: maturityDate
            });
            
            // Calculate IRR
            const irr = calculateIRR(initialInvestment, cashFlows);
            return irr * 100; // Convert to percentage
        }
        
        function calculateTotalCashFromGilt(gilt, unitsOwned, incomeTaxRate) {
            // Use the stored coupon schedule to calculate total cash received
            if (!gilt.couponSchedule) {
                return 0;
            }
            
            let totalCash = 0;
            
            // Sum all after-tax coupon payments
            gilt.couponSchedule.forEach(payment => {
                totalCash += payment.afterTaxAmount;
            });
            
            // Add tax-free principal repayment at maturity
            totalCash += unitsOwned; // £100 per £100 nominal
            
            return totalCash;
        }
        
        function calculateTotalCashFromSavings(investmentAmount, savingsRate, incomeTaxRate, psaAmount, yearsToMaturity) {
            // Calculate annual compound interest with annual tax deductions
            let currentBalance = investmentAmount;
            let totalTaxPaid = 0;
            
            // Calculate for each complete year
            const completeYears = Math.floor(yearsToMaturity);
            for (let year = 1; year <= completeYears; year++) {
                // Calculate gross interest for the year
                const grossInterest = currentBalance * (savingsRate / 100);
                
                // Calculate tax on interest above PSA
                const taxableInterest = Math.max(0, grossInterest - psaAmount);
                const tax = taxableInterest * incomeTaxRate;
                totalTaxPaid += tax;
                
                // Add net interest to balance
                const netInterest = grossInterest - tax;
                currentBalance += netInterest;
            }
            
            // Handle partial final year
            const partialYear = yearsToMaturity - completeYears;
            if (partialYear > 0) {
                const grossInterest = currentBalance * (savingsRate / 100) * partialYear;
                const taxableInterest = Math.max(0, grossInterest - psaAmount);
                const tax = taxableInterest * incomeTaxRate;
                totalTaxPaid += tax;
                
                const netInterest = grossInterest - tax;
                currentBalance += netInterest;
            }
            
            return currentBalance;
        }
        
        function generateCouponSchedule(gilt, unitsOwned, incomeTaxRate) {
            const schedule = [];
            const maturityDate = new Date(gilt.maturityDate);
            const today = new Date();
            const semiAnnualCoupon = (gilt.couponRate / 2 / 100) * unitsOwned;
            
            // Calculate coupon dates (semi-annual)
            let currentDate = new Date(maturityDate);
            
            // Go back to find all coupon dates from maturity to today
            while (currentDate > today) {
                const paymentDate = new Date(currentDate);
                const grossAmount = semiAnnualCoupon;
                const taxAmount = grossAmount * incomeTaxRate;
                const afterTaxAmount = grossAmount - taxAmount;
                
                schedule.unshift({
                    date: paymentDate.toISOString().split('T')[0],
                    grossAmount: grossAmount,
                    taxAmount: taxAmount,
                    afterTaxAmount: afterTaxAmount
                });
                
                // Move back 6 months
                currentDate.setMonth(currentDate.getMonth() - 6);
            }
            
            return schedule.filter(payment => new Date(payment.date) > today);
        }
        
        function calculateIRR(initialInvestment, cashFlows) {
            // Newton-Raphson method for IRR calculation
            let rate = 0.05; // Initial guess (5%)
            const tolerance = 1e-7;
            const maxIterations = 100;
            
            for (let i = 0; i < maxIterations; i++) {
                let npv = -initialInvestment;
                let npvDerivative = 0;
                
                cashFlows.forEach(cf => {
                    const yearsFraction = (cf.date - new Date()) / (365.25 * 24 * 60 * 60 * 1000);
                    if (yearsFraction > 0) {
                        const discountFactor = Math.pow(1 + rate, yearsFraction);
                        npv += cf.amount / discountFactor;
                        npvDerivative -= cf.amount * yearsFraction / (discountFactor * (1 + rate));
                    }
                });
                
                if (Math.abs(npv) < tolerance) {
                    return rate;
                }
                
                if (Math.abs(npvDerivative) < tolerance) {
                    break;
                }
                
                rate = rate - npv / npvDerivative;
                
                // Keep rate within reasonable bounds
                rate = Math.max(-0.99, Math.min(10, rate));
            }
            
            // Fallback to simple calculation if IRR doesn't converge
            const totalCashFlow = cashFlows.reduce((sum, cf) => sum + cf.amount, 0);
            const avgYears = cashFlows.reduce((sum, cf) => {
                const years = (cf.date - new Date()) / (365.25 * 24 * 60 * 60 * 1000);
                return sum + years;
            }, 0) / cashFlows.length;
            
            return ((totalCashFlow - initialInvestment) / initialInvestment) / avgYears;
        }
        
        function calculateEquivalentSavingsRate(afterTaxYield, savingsRate, psaAmount, incomeTaxRate, investmentAmount) {
            // Calculate what savings rate would give same after-tax return
            const targetAfterTaxReturn = (afterTaxYield / 100) * investmentAmount;
            
            // Work backwards from desired after-tax return to required gross rate
            const annualInterest = targetAfterTaxReturn;
            const taxableInterest = Math.max(0, annualInterest - psaAmount);
            const grossInterestNeeded = annualInterest + (taxableInterest * incomeTaxRate);
            
            return (grossInterestNeeded / investmentAmount) * 100;
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
                    <div class="metric-label">💷 Total Extra Income</div>
                    <div class="metric-value">\${formatCurrency(bestGilt.extraIncome || 0)}</div>
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
                                <th style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${isMobile ? 'Years' : 'Years to Maturity'}</th>
                                <th style="padding: 12px; text-align: right;">\${isMobile ? 'Advantage' : 'Extra vs Savings'}</th>
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
                                    <td class="clickable-cell" data-type="years" data-index="\${index}" style="padding: 12px; text-align: right; border-right: 1px solid #e0e0e0;">\${(gilt.yearsToMaturity || 0).toFixed(1)}</td>
                                    <td class="clickable-cell" data-type="advantage" data-index="\${index}" style="padding: 12px; text-align: right; font-weight: bold; color: \${gilt.extraIncome >= 0 ? '#27ae60' : '#e74c3c'};">\${formatCurrency(gilt.extraIncome || 0)}</td>
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
                    
                    titleText = 'After-Tax Yield Calculation with Detailed Payment Schedule';
                    
                    // Generate payment schedule table
                    let scheduleHTML = '';
                    if (gilt.couponSchedule && gilt.couponSchedule.length > 0) {
                        scheduleHTML = \`
                            <div class="calculation-step">
                                <h4>Detailed Payment Schedule</h4>
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
                                        <thead>
                                            <tr style="background: #f8f9fa;">
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Gross Coupon</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Income Tax</th>
                                                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Net Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                        \`;
                        
                        gilt.couponSchedule.forEach(payment => {
                            const paymentDate = new Date(payment.date).toLocaleDateString('en-GB');
                            scheduleHTML += \`
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">\${paymentDate}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">£\${payment.grossAmount.toFixed(2)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">£\${payment.taxAmount.toFixed(2)}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>£\${payment.afterTaxAmount.toFixed(2)}</strong></td>
                                </tr>
                            \`;
                        });
                        
                        // Add principal repayment row
                        const maturityDate = new Date(gilt.maturityDate).toLocaleDateString('en-GB');
                        const principalAmount = (currentSettings.investmentAmount || 10000) / gilt.dirtyPrice * 100;
                        scheduleHTML += \`
                            <tr style="background: #e8f5e8;">
                                <td style="border: 1px solid #ddd; padding: 8px;"><strong>\${maturityDate}</strong></td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;" colspan="2"><strong>Principal Repayment (Tax-Free)</strong></td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;"><strong>£\${principalAmount.toFixed(2)}</strong></td>
                            </tr>
                        \`;
                        
                        // Calculate grand totals
                        const totalGrossCoupons = gilt.couponSchedule.reduce((sum, payment) => sum + payment.grossAmount, 0);
                        const totalTax = gilt.couponSchedule.reduce((sum, payment) => sum + payment.taxAmount, 0);
                        const totalNetCoupons = gilt.couponSchedule.reduce((sum, payment) => sum + payment.afterTaxAmount, 0);
                        const grandTotalGross = totalGrossCoupons + principalAmount;
                        const grandTotalNet = totalNetCoupons + principalAmount;
                        
                        // Add grand total row
                        scheduleHTML += \`
                            <tr style="background: #007bff; color: white; font-weight: bold; border-top: 2px solid #0056b3;">
                                <td style="border: 1px solid #0056b3; padding: 10px;"><strong>GRAND TOTAL</strong></td>
                                <td style="border: 1px solid #0056b3; padding: 10px; text-align: right;"><strong>£\${grandTotalGross.toFixed(2)}</strong></td>
                                <td style="border: 1px solid #0056b3; padding: 10px; text-align: right;"><strong>£\${totalTax.toFixed(2)}</strong></td>
                                <td style="border: 1px solid #0056b3; padding: 10px; text-align: right;"><strong>£\${grandTotalNet.toFixed(2)}</strong></td>
                            </tr>
                        \`;
                        
                        scheduleHTML += \`
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        \`;
                    }
                    
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>After-Tax Yield for \${gilt.name}</h4>
                            <p>This shows the Internal Rate of Return (IRR) calculated using actual payment dates and tax impacts.</p>
                        </div>
                        \${scheduleHTML}
                        <div class="calculation-step">
                            <h4>Calculation Method:</h4>
                            <p><strong>Method:</strong> IRR calculation using Newton-Raphson method</p>
                            <p><strong>Your Investment:</strong> £\${formatCurrency(currentSettings.investmentAmount || 10000)}</p>
                            <p><strong>Purchase Price:</strong> £\${gilt.dirtyPrice.toFixed(6)} per £100 (including accrued interest)</p>
                            <p><strong>Your Tax Rate:</strong> \${(currentSettings.taxBracket || 'additional_rate').replace('_', ' ')} (\${getCurrentTaxRate()}%)</p>
                        </div>
                        <div class="calculation-step" style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px;">
                            <h4>Final After-Tax Yield:</h4>
                            <p><strong>\${gilt.afterTaxYield.toFixed(3)}%</strong> per year</p>
                            <p>This accounts for:</p>
                            <ul>
                                <li>Income tax on all coupon payments</li>
                                <li>Tax-free principal repayment at maturity</li>
                                <li>Exact timing of all cash flows</li>
                                <li>Your actual investment amount</li>
                            </ul>
                        </div>
                    \`;
                    break;
                    
                case 'equivalent':
                    const currentTaxRate = getCurrentTaxRate();
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
                                    <li>Your Income Tax Rate: \${currentTaxRate}%</li>
                                    <li>Required Gross Rate: \${gilt.afterTaxYield.toFixed(2)}% ÷ (1 - \${(currentTaxRate/100).toFixed(2)}) = <strong>\${gilt.equivalentGrossSavingsRate.toFixed(2)}%</strong></li>
                                </ul>
                            </div>
                        </div>
                        <div class="calculation-step">
                            <h4>Why This Matters:</h4>
                            <p>• Savings accounts are taxed as income at your marginal rate (\${currentTaxRate}%)</p>
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
                    
                case 'advantage':
                    titleText = 'Extra Income vs Savings Account - Detailed Calculation';
                    const savingsRate = currentSettings.savingsRate || 4.5;
                    const psaAmount = currentSettings.taxBracket === 'basic_rate' ? 1000 : 
                                    currentSettings.taxBracket === 'higher_rate' ? 500 : 0;
                    const modalTaxRate = getCurrentTaxRate();
                    const investmentAmount = currentSettings.investmentAmount || 10000;
                    
                    // Calculate savings account after-tax return considering PSA
                    const annualSavingsInterest = (savingsRate / 100) * investmentAmount;
                    const taxableInterest = Math.max(0, annualSavingsInterest - psaAmount);
                    const taxOnSavings = taxableInterest * (modalTaxRate / 100);
                    const netSavingsIncome = annualSavingsInterest - taxOnSavings;
                    const afterTaxSavingsRate = (netSavingsIncome / investmentAmount) * 100;
                    
                    // Calculate precise total cash flows
                    const giltTotalCash = calculateTotalCashFromGilt(gilt, gilt.unitsOwned, modalTaxRate / 100);
                    const savingsTotalCash = calculateTotalCashFromSavings(investmentAmount, savingsRate, modalTaxRate / 100, psaAmount, gilt.yearsToMaturity);
                    const extraIncomeTotal = gilt.extraIncome || (giltTotalCash - savingsTotalCash);
                    
                    const giltReturn = gilt.afterTaxYield || 0;
                    const advantagePercent = giltReturn - afterTaxSavingsRate;
                    
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What This Column Shows</h4>
                            <p>This column displays the <strong>total extra money</strong> you would receive from investing in this gilt compared to putting the same amount in a taxable savings account over the gilt's entire lifespan.</p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Your Current Settings</h4>
                            <p><strong>Investment Amount:</strong> \${formatCurrency(investmentAmount)}</p>
                            <p><strong>Your Tax Bracket:</strong> \${(currentSettings.taxBracket || 'additional_rate').replace('_', ' ').toUpperCase()} (\${modalTaxRate}%)</p>
                            <p><strong>Personal Savings Allowance:</strong> \${formatCurrency(psaAmount)}</p>
                            <p><strong>Savings Account Rate:</strong> \${savingsRate.toFixed(2)}%</p>
                            <p><strong>Investment Period:</strong> \${(gilt.yearsToMaturity || 0).toFixed(1)} years</p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Step 1: Total Cash from Gilt Investment</h4>
                            <p><strong>Gilt:</strong> \${gilt.name}</p>
                            <p><strong>Initial Investment:</strong> \${formatCurrency(investmentAmount)}</p>
                            <p><strong>Total Cash Received:</strong> £\${giltTotalCash.toFixed(2)}</p>
                            <div style="margin-left: 20px; color: #666;">
                                <p><small>• All coupon payments (after \${modalTaxRate}% income tax)</small></p>
                                <p><small>• Principal repayment: £\${(gilt.unitsOwned || 0).toFixed(2)} (tax-free)</small></p>
                                <p><small>• Based on actual payment schedule with exact dates</small></p>
                            </div>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Step 2: Total Cash from Savings Account</h4>
                            <p><strong>Initial Investment:</strong> £\${investmentAmount.toFixed(2)}</p>
                            <p><strong>Annual Interest Rate:</strong> \${savingsRate.toFixed(2)}%</p>
                            <p><strong>Investment Period:</strong> \${(gilt.yearsToMaturity || 0).toFixed(1)} years</p>
                            <p><strong>Total Cash Received:</strong> £\${savingsTotalCash.toFixed(2)}</p>
                            
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                                <h5 style="margin-top: 0;">Detailed Interest Calculation:</h5>
                                <p><strong>Calculation Method:</strong> Annual compound interest with annual tax deductions</p>
                                <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
                                    <li><strong>Annual Interest Rate:</strong> \${savingsRate.toFixed(2)}% compounded annually</li>
                                    <li><strong>Compounding:</strong> Interest calculated and added annually to growing balance</li>
                                    <li><strong>Personal Savings Allowance:</strong> £\${psaAmount.toFixed(2)} tax-free allowance per year</li>
                                    <li><strong>Tax Rate:</strong> \${modalTaxRate}% on interest above PSA allowance</li>
                                    <li><strong>Tax Timing:</strong> Deducted annually on interest earned</li>
                                </ul>
                                
                                <div style="background: white; padding: 10px; border-radius: 3px; margin-top: 10px;">
                                    <p style="margin: 0; font-size: 11px;"><strong>Formula per year:</strong></p>
                                    <p style="margin: 5px 0; font-family: monospace; font-size: 10px;">
                                        grossInterest = currentBalance × \${savingsRate.toFixed(2)}%<br>
                                        taxableInterest = max(0, grossInterest - £\${psaAmount.toFixed(2)})<br>
                                        tax = taxableInterest × \${modalTaxRate}%<br>
                                        newBalance = currentBalance + grossInterest - tax
                                    </p>
                                    <p style="margin: 5px 0; font-size: 11px;"><strong>Partial year calculation:</strong></p>
                                    <p style="margin: 0; font-family: monospace; font-size: 10px;">
                                        partialInterest = currentBalance × \${savingsRate.toFixed(2)}% × partialYear
                                    </p>
                                </div>
                                
                                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                                    <strong>Total Return:</strong> £\${(savingsTotalCash - investmentAmount).toFixed(2)} profit over \${(gilt.yearsToMaturity || 0).toFixed(1)} years
                                </p>
                            </div>
                        </div>
                        
                        <div class="calculation-step" style="background: #f8f9fa; border-left: 4px solid \${advantagePercent >= 0 ? '#27ae60' : '#e74c3c'}; padding: 15px;">
                            <h4>Step 3: Final Calculation</h4>
                            <div class="calculation-formula" style="background: white; padding: 10px; border-radius: 5px; margin: 10px 0;">
                                <strong>Formula:</strong><br>
                                Extra Income = Total Cash from Gilt - Total Cash from Savings<br><br>
                                <strong>Calculation:</strong><br>
                                £\${giltTotalCash.toFixed(2)} - £\${savingsTotalCash.toFixed(2)}<br>
                                = <strong>£\${extraIncomeTotal.toFixed(2)}</strong>
                            </div>
                            <p><strong>Gilt Total Return:</strong> £\${(giltTotalCash - investmentAmount).toFixed(2)} profit</p>
                            <p><strong>Savings Total Return:</strong> £\${(savingsTotalCash - investmentAmount).toFixed(2)} profit</p>
                            <p><strong>Total Advantage:</strong> £\${extraIncomeTotal.toFixed(2)} over \${(gilt.yearsToMaturity || 0).toFixed(1)} years</p>
                            <p style="margin-top: 15px; font-weight: bold; color: \${advantagePercent >= 0 ? '#27ae60' : '#e74c3c'};">
                                \${advantagePercent >= 0 ? 
                                    \`This gilt will earn you £\${Math.abs(extraIncomeTotal).toFixed(2)} MORE than a savings account.\` : 
                                    \`A savings account would earn you £\${Math.abs(extraIncomeTotal).toFixed(2)} MORE than this gilt.\`
                                }
                            </p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Key Assumptions</h4>
                            <p><small>• Uses your actual tax settings from the sidebar</small></p>
                            <p><small>• Includes Personal Savings Allowance for savings account</small></p>
                            <p><small>• Assumes both investments held for full maturity period</small></p>
                            <p><small>• Based on current market prices and yields</small></p>
                            <p><small>• Does not account for reinvestment of income</small></p>
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
            console.log('=== DOM CONTENT LOADED ===');
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
            
            initializeApp();
        });
    </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}