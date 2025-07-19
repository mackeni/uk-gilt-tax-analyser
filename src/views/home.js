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
            
            .controls-section {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .sidebar {
                padding: 15px;
            }
            
            .gilt-table {
                padding: 15px;
            }
            
            /* Mobile summary layout */
            .metric-card div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
            }
            
            .metric-card {
                padding: 20px 15px !important;
            }
            
            .metric-card div[style*="font-size: 1.3em"] {
                font-size: 1.1em !important;
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
            <!-- Controls Section - Top -->
            <div class="controls-section">
                <div class="sidebar">
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
                    
                    <h3>💸 Transaction Costs</h3>
                    <div class="form-group">
                        <label for="brokerType">Broker Type</label>
                        <select id="brokerType">
                            <option value="low_cost" selected>Low Cost (£5 per trade)</option>
                            <option value="percentage">Percentage Based (0.1%)</option>
                            <option value="traditional">Traditional (£11.95 per trade)</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    
                    <div id="customCosts" style="display: none;">
                        <div class="form-group">
                            <label for="purchaseFee">Purchase Fee (£)</label>
                            <input type="number" id="purchaseFee" value="5" min="0" max="100" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="saleFee">Sale Fee (£)</label>
                            <input type="number" id="saleFee" value="5" min="0" max="100" step="0.01">
                        </div>
                        <div class="form-group">
                            <label for="percentageFee">Percentage Fee (%)</label>
                            <input type="number" id="percentageFee" value="0" min="0" max="2" step="0.01">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="bidAskSpread">Bid-Ask Spread (%)</label>
                        <input type="number" id="bidAskSpread" value="0.05" min="0" max="1" step="0.01">
                        <small style="color: #666; font-size: 0.8em;">Typical: 0.02-0.1% for liquid gilts</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="annualHoldingFee">Annual Holding Fee (%)</label>
                        <input type="number" id="annualHoldingFee" value="0" min="0" max="1" step="0.01">
                        <small style="color: #666; font-size: 0.8em;">Some brokers charge custody fees</small>
                    </div>
                    
                    <div class="tax-info" id="taxInfo">
                        <h4>Your Tax Settings:</h4>
                        <div id="taxDetails">
                            <p><strong>Income Tax Rate:</strong> 45%</p>
                            <p><strong>Personal Savings Allowance:</strong> £0</p>
                            <p><strong>Capital Gains Tax on Gilts:</strong> 0% (exempt)</p>
                        </div>
                    </div>
                </div>
                
                <div class="sidebar">
                    <h3>🔧 Controls</h3>
                    <button class="btn" id="refreshData" style="width: 100%; margin-bottom: 20px;">🔄 Refresh Data</button>
                    
                    <div id="filterControls" class="filter-controls" style="display: none;">
                        <div class="form-group">
                            <label for="durationRange">Filter by Duration (Years):</label>
                            <div class="range-container">
                                <div>
                                    <label for="durationMin">Min:</label>
                                    <input type="number" id="durationMin" min="0" max="45" value="0" step="0.5">
                                </div>
                                <div>
                                    <label for="durationMax">Max:</label>
                                    <input type="number" id="durationMax" min="0" max="45" value="2" step="0.5">
                                </div>
                            </div>
                            <div class="range-info">
                                <small>Showing <span id="filteredCount">0</span> of <span id="totalCount">0</span> gilts</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Summary Section - Middle -->
            <div class="metrics" id="metrics" style="display: none;"></div>
            
            <!-- Table Section - Bottom -->
            <main class="gilt-table">
                <h3>📊 Available Gilts</h3>
                
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
            
            // Always show full amount with exactly 2 decimal places
            return currency + amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        
        function getTransactionCosts() {
            const brokerType = document.getElementById('brokerType').value;
            const investmentAmount = parseFloat(document.getElementById('investmentAmount').value) || 10000;
            const bidAskSpread = parseFloat(document.getElementById('bidAskSpread').value) || 0.05;
            const annualHoldingFee = parseFloat(document.getElementById('annualHoldingFee').value) || 0;
            
            let purchaseFee = 0;
            let saleFee = 0;
            let percentageFee = 0;
            
            switch (brokerType) {
                case 'low_cost':
                    purchaseFee = 5;
                    saleFee = 5;
                    break;
                case 'percentage':
                    percentageFee = 0.1;
                    break;
                case 'traditional':
                    purchaseFee = 11.95;
                    saleFee = 11.95;
                    break;
                case 'custom':
                    purchaseFee = parseFloat(document.getElementById('purchaseFee').value) || 0;
                    saleFee = parseFloat(document.getElementById('saleFee').value) || 0;
                    percentageFee = parseFloat(document.getElementById('percentageFee').value) || 0;
                    break;
            }
            
            // Calculate total transaction costs
            const percentageCost = (percentageFee / 100) * investmentAmount;
            const bidAskCost = (bidAskSpread / 100) * investmentAmount;
            
            return {
                purchaseFee: purchaseFee + percentageCost,
                saleFee: saleFee + percentageCost,
                bidAskCost: bidAskCost,
                annualHoldingFeeRate: annualHoldingFee / 100,
                totalPurchaseCost: purchaseFee + percentageCost + (bidAskCost / 2), // Half spread on purchase
                totalSaleCost: saleFee + percentageCost + (bidAskCost / 2), // Half spread on sale
                brokerType: brokerType
            };
        }
        
        function getCurrentTaxRate() {
            return currentSettings.taxBracket === 'basic_rate' ? 20 : 
                   currentSettings.taxBracket === 'higher_rate' ? 40 : 45;
        }
        
        // Import consolidated utility functions synchronously at runtime
        let utilsLoaded = false;
        let utils = {};
        
        async function ensureUtilsLoaded() {
            if (!utilsLoaded) {
                utils = await import('../lib/utils.js');
                utilsLoaded = true;
                console.log('Consolidated utility functions loaded');
            }
            return utils;
        }
        
        // Enhanced utility functions with caching and error checking
        function calculateYearsToMaturity(maturityDate, referenceDate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateYearsToMaturity(maturityDate, referenceDate);
        }
        
        function calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateAccruedInterest(couponRate, lastPaymentDate, settlementDate);
        }
        
        function calculateDirtyPrice(cleanPrice, accruedInterest) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateDirtyPrice(cleanPrice, accruedInterest);
        }
        
        function findLastCouponDate(maturityDate, referenceDate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.findLastCouponDate(maturityDate, referenceDate);
        }
        
        function findNextCouponDate(maturityDate, referenceDate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.findNextCouponDate(maturityDate, referenceDate);
        }
        
        function getTaxRateInfo(taxBracket) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.getTaxRateInfo(taxBracket);
        }
        
        function calculateUnitsOwned(investmentAmount, dirtyPrice) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateUnitsOwned(investmentAmount, dirtyPrice);
        }
        
        function calculateEquivalentGrossSavingsRate(afterTaxYield, incomeTaxRate) {
            if (!utilsLoaded) throw new Error('Utils not loaded yet');
            return utils.calculateEquivalentGrossSavingsRate(afterTaxYield, incomeTaxRate);
        }
        
        // Cache for complex calculations
        const complexCalculationCache = new Map();
        
        function getCachedComplexCalculation(key, calculationFn, ...args) {
            // Optimize cache key generation for common patterns
            let cacheKey;
            if (args.length === 1 && typeof args[0] === 'number') {
                cacheKey = key + '_' + args[0];
            } else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
                cacheKey = key + '_' + args[0] + '_' + args[1];
            } else if (args.length === 1 && args[0] && typeof args[0].name === 'string') {
                // For gilt objects, use name as key component
                cacheKey = key + '_' + args[0].name + '_' + (args[0].dirtyPrice || 0);
            } else {
                cacheKey = key + '_' + JSON.stringify(args);
            }
            
            if (complexCalculationCache.has(cacheKey)) {
                return complexCalculationCache.get(cacheKey);
            }
            
            const result = calculationFn(...args);
            complexCalculationCache.set(cacheKey, result);
            
            // Efficient cache cleanup
            if (complexCalculationCache.size > 500) {
                let deleteCount = 0;
                for (const [k] of complexCalculationCache) {
                    complexCalculationCache.delete(k);
                    if (++deleteCount >= 100) break;
                }
            }
            
            return result;
        }
        
        function getCacheStats() {
            if (!utilsLoaded) return null;
            const utilsStats = utils.getCacheStats ? utils.getCacheStats() : null;
            return {
                utilsCache: utilsStats,
                complexCache: { size: complexCalculationCache.size },
                total: (utilsStats?.cacheSize || 0) + complexCalculationCache.size
            };
        }
        
        function clearAllCaches() {
            complexCalculationCache.clear();
            if (utilsLoaded && utils.clearCache) {
                utils.clearCache();
            }
            console.log('All caches cleared');
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
                const controlsSection = document.querySelector('.controls-section');
                if (mainContent && controlsSection && !document.getElementById('rate-limit-warning')) {
                    mainContent.insertBefore(warningDiv, controlsSection);
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
        
        async function updateTaxSettings() {
            const taxBracket = document.getElementById('taxBracket').value;
            currentSettings.taxBracket = taxBracket;
            
            const taxInfo = {
                'basic_rate': { rate: 20, psa: 1000, description: 'Basic Rate taxpayers typically receive £1,000 PSA' },
                'higher_rate': { rate: 40, psa: 500, description: 'Higher Rate taxpayers typically receive £500 PSA' },
                'additional_rate': { rate: 45, psa: 0, description: 'Additional Rate taxpayers receive no PSA' }
            };
            
            const info = taxInfo[taxBracket];
            
            // Ask for PSA confirmation when tax rate changes
            const currentPSA = currentSettings.psaAmount;
            const suggestedPSA = info.psa;
            
            let confirmedPSA = suggestedPSA;
            
            // Only ask for confirmation if this is a meaningful change and PSA is relevant
            if (currentPSA !== suggestedPSA && (currentPSA !== undefined || suggestedPSA > 0)) {
                confirmedPSA = await showPSAChoiceModal(taxBracket, suggestedPSA, info.description);
            }
            
            // Store the confirmed PSA amount
            currentSettings.psaAmount = confirmedPSA;
            
            document.getElementById('taxDetails').innerHTML = \`
                <p><strong>Income Tax Rate:</strong> \${info.rate}%</p>
                <p><strong>Personal Savings Allowance:</strong> £\${confirmedPSA.toLocaleString()}</p>
                <p><strong>Capital Gains Tax on Gilts:</strong> 0% (exempt)</p>
                \${confirmedPSA !== suggestedPSA ? 
                    '<p style="color: #e67e22; font-size: 12px; margin-top: 5px;"><strong>Custom PSA:</strong> Using your specified allowance</p>' : 
                    ''
                }
            \`;
            
            if (currentGiltData.length > 0) {
                calculateTaxEfficiency();
            }
        }
        
        function showPSAChoiceModal(taxBracket, suggestedPSA, description) {
            return new Promise((resolve) => {
                // Create modal HTML
                const modalHTML = \`
                    <div id="psaModal" style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 10000;
                    ">
                        <div style="
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                            max-width: 500px;
                            width: 90%;
                            text-align: center;
                        ">
                            <h3 style="margin: 0 0 20px 0; color: #2c3e50;">Personal Savings Allowance Confirmation</h3>
                            <div style="margin: 20px 0; text-align: left; line-height: 1.5;">
                                <p><strong>Tax Bracket:</strong> \${taxBracket.replace('_', ' ').toUpperCase()}</p>
                                <p><strong>Standard PSA:</strong> £\${suggestedPSA.toLocaleString()}</p>
                                <p style="margin: 15px 0; color: #555;">\${description}</p>
                            </div>
                            <p style="margin: 20px 0; font-weight: bold;">Do you have your full Personal Savings Allowance available?</p>
                            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                                <button id="psaStandard" style="
                                    background: #27ae60;
                                    color: white;
                                    border: none;
                                    padding: 12px 20px;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    font-size: 16px;
                                    font-weight: bold;
                                ">Standard Amount (£\${suggestedPSA.toLocaleString()})</button>
                                <button id="psaNil" style="
                                    background: #e74c3c;
                                    color: white;
                                    border: none;
                                    padding: 12px 20px;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    font-size: 16px;
                                    font-weight: bold;
                                ">Nil Available (£0)</button>
                            </div>
                        </div>
                    </div>
                \`;
                
                // Add modal to page
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                
                // Add event listeners
                document.getElementById('psaStandard').addEventListener('click', function() {
                    document.getElementById('psaModal').remove();
                    resolve(suggestedPSA);
                });
                
                document.getElementById('psaNil').addEventListener('click', function() {
                    document.getElementById('psaModal').remove();
                    resolve(0);
                });
            });
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
            
            // Ensure utils are loaded first
            await ensureUtilsLoaded();
            
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
                    currentGiltData = await getFallbackGiltData();
                    console.log('Successfully loaded fallback data:', currentGiltData.length, 'gilts');
                    
                    loadingDiv.style.display = 'none';
                    document.getElementById('filterControls').style.display = 'block';
                    
                    // Show warning but continue with fallback data
                    const warningDiv = document.createElement('div');
                    warningDiv.id = 'api-warning';
                    warningDiv.style.cssText = 'background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 14px;';
                    warningDiv.innerHTML = '⚠️ Using cached data due to API rate limits. Data may not be real-time.';
                    const mainContent = document.querySelector('.main-content');
                    const controlsSection = document.querySelector('.controls-section');
                    if (mainContent && controlsSection && !document.getElementById('api-warning')) {
                        mainContent.insertBefore(warningDiv, controlsSection);
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
        
        async function getFallbackGiltData() {
            console.log('Creating fallback gilt data...');
            
            // Ensure utils are loaded before processing fallback data
            await ensureUtilsLoaded();
            
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
            
            // Pre-calculate common values once for all gilts
            const todayTime = today.getTime();
            const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
            
            const processedData = fallbackData.map(gilt => {
                // Optimized years calculation avoiding expensive date operations
                const maturityTime = new Date(gilt.maturityDate).getTime();
                const yearsToMaturity = Math.max(0, (maturityTime - todayTime) / msPerYear);
                
                // Calculate basic accrued interest using consolidated function with caching
                const lastPaymentDate = getCachedComplexCalculation('fallbackLastCoupon', findLastCouponDate, gilt.maturityDate, today);
                const accruedInterest = getCachedComplexCalculation('fallbackAccrued', calculateAccruedInterest, gilt.couponRate, lastPaymentDate, today);
                const dirtyPrice = gilt.cleanPrice + (accruedInterest || 0);
                
                const processedGilt = {
                    ...gilt,
                    yearsToMaturity: Math.max(0, yearsToMaturity),
                    dirtyPrice: dirtyPrice,
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
                const results = await calculateTaxEfficiencyLocal(
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
        
        async function calculateTaxEfficiencyLocal(giltData, taxBracket, investmentAmount, savingsRate) {
            console.log('Starting local tax calculations...');
            console.log('Gilt data type:', typeof giltData, 'Is array:', Array.isArray(giltData), 'Length:', giltData?.length);
            
            // Ensure giltData is an array
            if (!Array.isArray(giltData)) {
                console.error('giltData is not an array:', giltData);
                return [];
            }
            
            // Ensure utils are loaded
            await ensureUtilsLoaded();
            
            // Use consolidated tax rate function
            const taxInfo = getTaxRateInfo(taxBracket);
            const incomeTaxRate = taxInfo.income / 100;
            
            // Use confirmed PSA amount if available, otherwise use standard
            const psaAmount = currentSettings.psaAmount !== undefined ? currentSettings.psaAmount : taxInfo.psa;
            
            // Get transaction costs
            const transactionCosts = getTransactionCosts();
            
            console.log('Using tax rates:', taxInfo);
            console.log('Using transaction costs:', transactionCosts);
            
            return giltData.map(gilt => {
                // Use cached calculations for expensive operations
                const unitsOwned = getCachedComplexCalculation('unitsOwned', calculateUnitsOwned, investmentAmount, gilt.dirtyPrice);
                
                // Calculate after-tax yield using IRR method with transaction costs
                const afterTaxYield = getCachedComplexCalculation('afterTaxIRR', calculateAfterTaxIRRWithCosts, gilt, unitsOwned, incomeTaxRate, transactionCosts);
                
                // Use cached equivalent rate calculation
                const equivalentGrossSavingsRate = getCachedComplexCalculation('equivalentRate', calculateEquivalentGrossSavingsRate, afterTaxYield, incomeTaxRate);
                
                // Calculate precise advantage using actual coupon schedule with transaction costs
                const giltTotalCashReceived = getCachedComplexCalculation('giltCash', calculateTotalCashFromGiltWithCosts, gilt, unitsOwned, incomeTaxRate, transactionCosts);
                const savingsTotalCashReceived = getCachedComplexCalculation('savingsCash', calculateTotalCashFromSavings, investmentAmount, savingsRate, incomeTaxRate, psaAmount, gilt.yearsToMaturity);
                const extraIncome = giltTotalCashReceived - savingsTotalCashReceived;
                
                // Return optimized object creation (avoid spread operator for performance)
                return {
                    name: gilt.name,
                    couponRate: gilt.couponRate,
                    cleanPrice: gilt.cleanPrice,
                    currentYield: gilt.currentYield,
                    maturityDate: gilt.maturityDate,
                    yearsToMaturity: gilt.yearsToMaturity,
                    dirtyPrice: gilt.dirtyPrice,
                    accruedInterest: gilt.accruedInterest,
                    couponSchedule: gilt.couponSchedule,
                    afterTaxYield: afterTaxYield,
                    equivalentGrossSavingsRate: equivalentGrossSavingsRate,
                    extraIncome: extraIncome,
                    unitsOwned: unitsOwned
                };
            });
        }
        
        function calculateAfterTaxIRRWithCosts(gilt, unitsOwned, incomeTaxRate, transactionCosts) {
            // Generate detailed coupon schedule and calculate IRR
            const couponSchedule = generateCouponSchedule(gilt, unitsOwned, incomeTaxRate);
            gilt.couponSchedule = couponSchedule; // Store for tooltips
            
            // Calculate initial investment including purchase costs
            const baseInvestment = (gilt.cleanPrice + gilt.accruedInterest) * unitsOwned / 100;
            const purchaseCosts = transactionCosts.totalPurchaseCost;
            const initialInvestment = baseInvestment + purchaseCosts;
            
            // Add annual holding fees to coupon schedule
            const holdingFeePerYear = baseInvestment * transactionCosts.annualHoldingFeeRate;
            
            const cashFlows = couponSchedule.map(payment => ({
                amount: payment.afterTaxAmount - (holdingFeePerYear / 2), // Deduct half-yearly holding fee
                date: new Date(payment.date)
            }));
            
            // Add principal repayment at maturity minus sale costs
            const maturityDate = new Date(gilt.maturityDate);
            const principalRepayment = unitsOwned - transactionCosts.totalSaleCost;
            cashFlows.push({
                amount: principalRepayment, // Principal minus sale costs
                date: maturityDate
            });
            
            // Calculate IRR
            const irr = calculateIRR(initialInvestment, cashFlows);
            return irr * 100; // Convert to percentage
        }
        
        function calculateAfterTaxIRR(gilt, unitsOwned, incomeTaxRate) {
            // Legacy function for backward compatibility
            const dummyCosts = {
                totalPurchaseCost: 0,
                totalSaleCost: 0,
                annualHoldingFeeRate: 0
            };
            return calculateAfterTaxIRRWithCosts(gilt, unitsOwned, incomeTaxRate, dummyCosts);
        }
        
        function calculateTotalCashFromGiltWithCosts(gilt, unitsOwned, incomeTaxRate, transactionCosts) {
            // Calculate total cash received including all transaction costs
            if (!gilt.couponSchedule || gilt.couponSchedule.length === 0) {
                return unitsOwned - transactionCosts.totalPurchaseCost - transactionCosts.totalSaleCost;
            }
            
            const baseInvestment = (gilt.cleanPrice + gilt.accruedInterest) * unitsOwned / 100;
            const holdingFeePerYear = baseInvestment * transactionCosts.annualHoldingFeeRate;
            const totalHoldingFees = holdingFeePerYear * gilt.yearsToMaturity;
            
            // Single-pass calculation with optimized loop
            let totalCash = -transactionCosts.totalPurchaseCost; // Start with purchase costs (negative)
            
            // Add coupon payments minus holding fees
            for (let i = 0; i < gilt.couponSchedule.length; i++) {
                totalCash += gilt.couponSchedule[i].afterTaxAmount;
            }
            
            // Add principal repayment minus sale costs and holding fees
            totalCash += unitsOwned - transactionCosts.totalSaleCost - totalHoldingFees;
            
            return totalCash;
        }
        
        function calculateTotalCashFromGilt(gilt, unitsOwned, incomeTaxRate) {
            // Legacy function for backward compatibility
            const dummyCosts = {
                totalPurchaseCost: 0,
                totalSaleCost: 0,
                annualHoldingFeeRate: 0
            };
            return calculateTotalCashFromGiltWithCosts(gilt, unitsOwned, incomeTaxRate, dummyCosts);
        }
        
        function calculateTotalCashFromSavings(investmentAmount, savingsRate, incomeTaxRate, psaAmount, yearsToMaturity) {
            // Pre-calculate constants to avoid repeated calculations
            const msPerDay = 24 * 60 * 60 * 1000;
            const savingsRateDecimal = savingsRate / 100;
            const totalDays = Math.round(yearsToMaturity * 365.25);
            const completeYears = Math.floor(totalDays / 365);
            const remainingDays = totalDays - (completeYears * 365);
            
            let currentBalance = investmentAmount;
            
            // Process complete years in batch
            if (completeYears > 0) {
                for (let year = 1; year <= completeYears; year++) {
                    const grossInterest = currentBalance * savingsRateDecimal;
                    const taxableInterest = Math.max(0, grossInterest - psaAmount);
                    const tax = taxableInterest * incomeTaxRate;
                    currentBalance += (grossInterest - tax);
                }
            }
            
            // Handle remaining days if any
            if (remainingDays > 0) {
                const dailyRate = savingsRateDecimal / 365;
                const grossInterest = currentBalance * dailyRate * remainingDays;
                const partialYearFraction = remainingDays / 365;
                const availablePSAPartialYear = psaAmount * partialYearFraction;
                const taxableInterest = Math.max(0, grossInterest - availablePSAPartialYear);
                const tax = taxableInterest * incomeTaxRate;
                currentBalance += (grossInterest - tax);
            }
            
            return currentBalance;
        }
        
        function generateCouponSchedule(gilt, unitsOwned, incomeTaxRate) {
            const maturityTime = new Date(gilt.maturityDate).getTime();
            const todayTime = new Date().getTime();
            const semiAnnualCoupon = (gilt.couponRate / 2 / 100) * unitsOwned;
            const schedule = [];
            
            // Pre-calculate values to avoid repeated calculations
            const sixMonthsMs = 6 * 30.44 * 24 * 60 * 60 * 1000; // Average 6 months
            let currentTime = maturityTime;
            
            // Build schedule forward to avoid unshift operations
            const tempSchedule = [];
            while (currentTime > todayTime) {
                const grossAmount = semiAnnualCoupon;
                const taxAmount = grossAmount * incomeTaxRate;
                
                tempSchedule.push({
                    date: new Date(currentTime).toISOString().split('T')[0],
                    grossAmount: grossAmount,
                    taxAmount: taxAmount,
                    afterTaxAmount: grossAmount - taxAmount
                });
                
                currentTime -= sixMonthsMs;
            }
            
            // Reverse once and filter in single pass
            for (let i = tempSchedule.length - 1; i >= 0; i--) {
                const payment = tempSchedule[i];
                if (new Date(payment.date).getTime() > todayTime) {
                    schedule.push(payment);
                }
            }
            
            return schedule;
        }
        
        function calculateIRR(initialInvestment, cashFlows) {
            // Pre-compute constants and years fractions once
            const nowTime = Date.now();
            const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
            const tolerance = 1e-7;
            const maxIterations = 50; // Reduced from 100 for efficiency
            
            // Pre-calculate years fractions and filter positive cash flows
            const validCashFlows = [];
            let totalCashFlow = 0;
            let totalWeightedYears = 0;
            
            for (let i = 0; i < cashFlows.length; i++) {
                const cf = cashFlows[i];
                const yearsFraction = (cf.date.getTime() - nowTime) / msPerYear;
                if (yearsFraction > 0) {
                    validCashFlows.push({
                        amount: cf.amount,
                        years: yearsFraction
                    });
                    totalCashFlow += cf.amount;
                    totalWeightedYears += yearsFraction;
                }
            }
            
            if (validCashFlows.length === 0) {
                return 0; // No valid future cash flows
            }
            
            // Newton-Raphson method with optimized calculations
            let rate = 0.05; // Initial guess (5%)
            
            for (let i = 0; i < maxIterations; i++) {
                let npv = -initialInvestment;
                let npvDerivative = 0;
                const onePlusRate = 1 + rate;
                
                // Single loop with optimized calculations
                for (let j = 0; j < validCashFlows.length; j++) {
                    const cf = validCashFlows[j];
                    const discountFactor = Math.pow(onePlusRate, cf.years);
                    const discountedValue = cf.amount / discountFactor;
                    
                    npv += discountedValue;
                    npvDerivative -= discountedValue * cf.years / onePlusRate;
                }
                
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
            
            // Optimized fallback calculation
            const avgYears = totalWeightedYears / validCashFlows.length;
            return avgYears > 0 ? ((totalCashFlow - initialInvestment) / initialInvestment) / avgYears : 0;
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
            
            // Combined filtering, sorting, and best gilt finding in single pass
            const sortedResults = [];
            let bestGilt = null;
            let bestYield = -Infinity;
            
            for (let i = 0; i < results.length; i++) {
                const gilt = results[i];
                if (gilt.yearsToMaturity >= durationFilter.min && gilt.yearsToMaturity <= durationFilter.max) {
                    // Insert in sorted position (optimized for small arrays)
                    let insertIndex = sortedResults.length;
                    for (let j = sortedResults.length - 1; j >= 0; j--) {
                        if (sortedResults[j].yearsToMaturity <= gilt.yearsToMaturity) {
                            break;
                        }
                        insertIndex = j;
                    }
                    sortedResults.splice(insertIndex, 0, gilt);
                    
                    // Track best gilt during processing
                    const yield = gilt.afterTaxYield || 0;
                    if (yield > bestYield) {
                        bestYield = yield;
                        bestGilt = gilt;
                    }
                }
            }
            
            // Update filter count display
            document.getElementById('filteredCount').textContent = sortedResults.length;
            document.getElementById('totalCount').textContent = results.length;
            
            // Display metrics (from filtered results)
            if (sortedResults.length === 0) {
                metricsDiv.innerHTML = '<div class="metric-card"><div class="metric-label">No gilts match your duration filter</div></div>';
                dataDiv.innerHTML = '<p style="text-align: center; padding: 20px; color: #7f8c8d;">No gilts found within the selected duration range. Adjust the filter above.</p>';
                return;
            }
            
            // Use already computed bestGilt from sorting loop
            if (!bestGilt && sortedResults.length > 0) {
                bestGilt = sortedResults[0];
                for (let i = 1; i < sortedResults.length; i++) {
                    if ((sortedResults[i].afterTaxYield || 0) > (bestGilt.afterTaxYield || 0)) {
                        bestGilt = sortedResults[i];
                    }
                }
            }
            
            metricsDiv.innerHTML = \`
                <div class="metric-card" style="grid-column: 1 / -1; text-align: center; padding: 30px;">
                    <div class="metric-label" style="font-size: 1.2em; margin-bottom: 15px;">💷 Best Investment Summary</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 20px;">
                        <div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Best Gilt</div>
                            <div style="font-size: 1.1em; font-weight: bold; color: #2c3e50;">\${bestGilt.name}</div>
                            <div style="font-size: 1.3em; font-weight: bold; color: #27ae60; margin-top: 5px;">\${(bestGilt.afterTaxYield || 0).toFixed(2)}%</div>
                        </div>
                        <div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Equivalent Savings Rate</div>
                            <div style="font-size: 1.3em; font-weight: bold; color: #3498db;">\${(bestGilt.equivalentGrossSavingsRate || 0).toFixed(2)}%</div>
                            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">needed in savings account</div>
                        </div>
                        <div>
                            <div style="font-size: 0.9em; color: #666; margin-bottom: 5px;">Extra Income</div>
                            <div style="font-size: 1.3em; font-weight: bold; color: #e67e22;">\${formatCurrency(bestGilt.extraIncome || 0)}</div>
                            <div style="font-size: 0.8em; color: #666; margin-top: 5px;">vs. typical savings over \${Math.floor(bestGilt.yearsToMaturity)} \${Math.floor(bestGilt.yearsToMaturity) === 1 ? 'year' : 'years'} \${Math.round((bestGilt.yearsToMaturity % 1) * 365)} days</div>
                        </div>
                    </div>
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
            console.log('Adding click listeners to cells...');
            document.querySelectorAll('.clickable-cell').forEach(cell => {
                console.log('Adding listener to cell:', cell.dataset.type);
                cell.addEventListener('click', function() {
                    console.log('Cell clicked:', this.dataset.type, this.dataset.index);
                    const type = this.dataset.type;
                    const index = parseInt(this.dataset.index);
                    const gilt = sortedResults[index];
                    console.log('Calling showCalculationModal with:', type, gilt);
                    showCalculationModal(type, gilt);
                });
            });
        }
        
        function showCalculationModal(type, gilt) {
            console.log('showCalculationModal called with type:', type, 'gilt:', gilt?.name);
            const modal = document.getElementById('calculationModal');
            const title = document.getElementById('modalTitle');
            const content = document.getElementById('modalContent');
            
            console.log('Modal elements found:', !!modal, !!title, !!content);
            
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
                    
                    // Calculate precise total cash flows
                    const giltTotalCash = calculateTotalCashFromGilt(gilt, gilt.unitsOwned, modalTaxRate / 100);
                    const savingsTotalCash = calculateTotalCashFromSavings(investmentAmount, savingsRate, modalTaxRate / 100, psaAmount, gilt.yearsToMaturity);
                    
                    // Calculate actual after-tax savings rate based on total returns
                    const savingsReturn = savingsTotalCash - investmentAmount;
                    const afterTaxSavingsRate = Math.pow(savingsTotalCash / investmentAmount, 1 / gilt.yearsToMaturity) - 1;
                    
                    const extraIncomeTotal = gilt.extraIncome || (giltTotalCash - savingsTotalCash);
                    
                    const giltReturn = gilt.afterTaxYield || 0;
                    const advantagePercent = giltReturn - (afterTaxSavingsRate * 100);
                    
                    contentHTML = \`
                        <div class="calculation-step">
                            <h4>What This Column Shows</h4>
                            <p>This column displays the <strong>total extra money</strong> you would receive from investing in this gilt compared to putting the same amount in a taxable savings account over the gilt's entire lifespan.</p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Your Current Settings</h4>
                            <p><strong>Investment Amount:</strong> £\${investmentAmount.toFixed(2)}</p>
                            <p><strong>Your Tax Bracket:</strong> \${(currentSettings.taxBracket || 'additional_rate').replace('_', ' ').toUpperCase()} (\${modalTaxRate}%)</p>
                            <p><strong>Personal Savings Allowance:</strong> \${formatCurrency(psaAmount)}</p>
                            <p><strong>Savings Account Rate:</strong> \${savingsRate.toFixed(2)}%</p>
                            <p><strong>Investment Period:</strong> \${(gilt.yearsToMaturity || 0).toFixed(2)} years</p>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Step 1: Total Cash from Gilt Investment</h4>
                            <p><strong>Gilt:</strong> \${gilt.name}</p>
                            <p><strong>Initial Investment:</strong> £\${investmentAmount.toFixed(2)}</p>
                            <p><strong>Total Cash Received:</strong> £\${giltTotalCash.toFixed(2)}</p>
                            <div style="margin-left: 20px; color: #666;">
                                <p><small>• All coupon payments (after \${modalTaxRate}% income tax)</small></p>
                                <p><small>• Principal repayment: £\${(gilt.unitsOwned || 0).toFixed(2)} (tax-free)</small></p>
                                <p><small>• Based on actual payment schedule with exact dates</small></p>
                                <p><small>• Includes all transaction costs (broker fees, bid-ask spread, holding fees)</small></p>
                            </div>
                        </div>
                        
                        <div class="calculation-step">
                            <h4>Step 2: Total Cash from Savings Account</h4>
                            <p><strong>Initial Investment:</strong> £\${investmentAmount.toFixed(2)}</p>
                            <p><strong>Annual Interest Rate:</strong> \${savingsRate.toFixed(2)}%</p>
                            <p><strong>Investment Period:</strong> \${(() => {
                                const today = new Date();
                                const endDate = new Date(today.getTime() + ((gilt.yearsToMaturity || 0) * 365.25 * 24 * 60 * 60 * 1000));
                                const totalDays = Math.round((endDate - today) / (24 * 60 * 60 * 1000));
                                const years = Math.floor(totalDays / 365);
                                const remainingDays = totalDays % 365;
                                return years + ' years + ' + remainingDays + ' days (' + totalDays + ' total days)';
                            })()} </p>
                            <p><strong>Total Cash Received:</strong> £\${savingsTotalCash.toFixed(2)}</p>
                            
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                                <h5 style="margin-top: 0;">Detailed Interest Calculation:</h5>
                                <p><strong>Calculation Method:</strong> Annual compound interest with proportional PSA</p>
                                <ul style="margin: 10px 0; padding-left: 20px; font-size: 12px;">
                                    <li><strong>Annual Interest Rate:</strong> \${savingsRate.toFixed(2)}% compounded annually</li>
                                    <li><strong>Compounding:</strong> Interest calculated and added annually to growing balance</li>
                                    <li><strong>Day Calculation:</strong> Uses actual calendar days (365 days = 1 year)</li>
                                    <li><strong>Personal Savings Allowance:</strong> £\${psaAmount.toFixed(2)} tax-free allowance per tax year (April 6 - April 5)</li>
                                    <li><strong>PSA Reset:</strong> Full PSA allowance available each tax year</li>
                                    <li><strong>Partial Year PSA:</strong> PSA pro-rated based on actual days for partial years</li>
                                    <li><strong>Tax Rate:</strong> \${modalTaxRate}% on interest above available PSA allowance</li>
                                    <li><strong>Tax Timing:</strong> Deducted annually on interest earned</li>
                                    <li><strong>Transaction Costs:</strong> No trading fees or custody charges assumed for savings</li>
                                </ul>
                                
                                <div style="background: white; padding: 10px; border-radius: 3px; margin-top: 10px;">
                                    <p style="margin: 0; font-size: 11px;"><strong>Year-by-Year Breakdown:</strong></p>
                                    <div style="font-family: monospace; font-size: 10px; margin: 5px 0;" id="savingsBreakdown">
                                    </div>
                                </div>
                                
                                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                                    <strong>Total Return:</strong> £\${(savingsTotalCash - investmentAmount).toFixed(2)} profit over \${(gilt.yearsToMaturity || 0).toFixed(2)} years
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
                            <p><strong>Total Advantage:</strong> £\${extraIncomeTotal.toFixed(2)} over \${(gilt.yearsToMaturity || 0).toFixed(2)} years</p>
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
            
            // If this is the savings breakdown, populate the year-by-year section
            if (type === 'advantage' && gilt) {
                setTimeout(() => {
                    const breakdownDiv = document.getElementById('savingsBreakdown');
                    if (breakdownDiv) {
                        // Use the same variables as defined above for consistency
                        const savingsRateLocal = currentSettings.savingsRate || 4.5;
                        // Use confirmed PSA amount if available
                        const psaAmountLocal = currentSettings.psaAmount !== undefined ? 
                                             currentSettings.psaAmount : 
                                             (currentSettings.taxBracket === 'basic_rate' ? 1000 : 
                                              currentSettings.taxBracket === 'higher_rate' ? 500 : 0);
                        const modalTaxRateLocal = getCurrentTaxRate();
                        const investmentAmountLocal = currentSettings.investmentAmount || 10000;
                        
                        let breakdown = '';
                        let balance = investmentAmountLocal;
                        const completeYears = Math.floor(gilt.yearsToMaturity);
                        
                        // Calculate using actual calendar days
                        const today = new Date();
                        const endDate = new Date(today.getTime() + (gilt.yearsToMaturity * 365.25 * 24 * 60 * 60 * 1000));
                        const totalDays = Math.round((endDate - today) / (24 * 60 * 60 * 1000));
                        const actualCompleteYears = Math.floor(totalDays / 365);
                        
                        for (let year = 1; year <= actualCompleteYears; year++) {
                            const grossInterest = balance * (savingsRateLocal / 100);
                            
                            // PSA resets each tax year (April 6 - April 5)
                            const availablePSAThisYear = psaAmountLocal;
                            const psaUsed = Math.min(grossInterest, availablePSAThisYear);
                            const taxableInterest = Math.max(0, grossInterest - availablePSAThisYear);
                            const tax = taxableInterest * (modalTaxRateLocal / 100);
                            const netInterest = grossInterest - tax;
                            balance += netInterest;
                            
                            breakdown += 'Year ' + year + ' (365 days): £' + balance.toFixed(2) + 
                                       ' (gross: £' + grossInterest.toFixed(2) + 
                                       ', PSA used: £' + psaUsed.toFixed(2) + 
                                       ', taxable: £' + taxableInterest.toFixed(2) + 
                                       ', tax: £' + tax.toFixed(2) + ')<br>';
                        }
                        
                        const remainingDays = totalDays - (actualCompleteYears * 365);
                        if (remainingDays > 0) {
                            const dailyRate = savingsRateLocal / 100 / 365;
                            const grossInterest = balance * dailyRate * remainingDays;
                            const partialYearFraction = remainingDays / 365;
                            const availablePSAPartialYear = psaAmountLocal * partialYearFraction;
                            
                            // Check if we're in a new tax year for PSA calculation
                            const psaUsed = Math.min(grossInterest, availablePSAPartialYear);
                            const taxableInterest = Math.max(0, grossInterest - availablePSAPartialYear);
                            const tax = taxableInterest * (modalTaxRateLocal / 100);
                            const netInterest = grossInterest - tax;
                            balance += netInterest;
                            
                            breakdown += 'Remaining ' + remainingDays + ' days: £' + balance.toFixed(2) + 
                                       ' (gross: £' + grossInterest.toFixed(2) + 
                                       ', PSA available: £' + availablePSAPartialYear.toFixed(2) + 
                                       ', PSA used: £' + psaUsed.toFixed(2) + 
                                       ', taxable: £' + taxableInterest.toFixed(2) + 
                                       ', tax: £' + tax.toFixed(2) + ')';
                        }
                        
                        breakdownDiv.innerHTML = breakdown;
                    }
                }, 100);
            }
            
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
            
            // Add cache management and debug buttons
            addCacheManagementButtons();
            
            initializeApp();
        });
        
        function handleBrokerTypeChange() {
            const brokerType = document.getElementById('brokerType').value;
            const customCosts = document.getElementById('customCosts');
            
            if (brokerType === 'custom') {
                customCosts.style.display = 'block';
            } else {
                customCosts.style.display = 'none';
            }
            
            // Recalculate with new transaction costs
            calculateTaxEfficiency();
        }
        
        // Initialize application and set up all event listeners
        function initializeApp() {
            console.log('=== INITIALIZING APPLICATION ===');
            
            // Set up transaction cost event listeners
            document.getElementById('brokerType').addEventListener('change', handleBrokerTypeChange);
            document.getElementById('bidAskSpread').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            document.getElementById('annualHoldingFee').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            document.getElementById('purchaseFee').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            document.getElementById('saleFee').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            document.getElementById('percentageFee').addEventListener('input', debounce(() => calculateTaxEfficiency(), 500));
            
            // Set up other event listeners (existing ones)
            document.getElementById('taxBracket').addEventListener('change', updateTaxSettings);
            document.getElementById('investmentAmount').addEventListener('input', updateInvestmentAmount);
            document.getElementById('savingsRate').addEventListener('input', () => {
                updateSavingsRate();
                calculateTaxEfficiency();
            });
            document.getElementById('refreshData').addEventListener('click', loadGiltData);
            
            // Set up duration filter event listeners
            document.getElementById('durationMin').addEventListener('input', handleDurationFilterChange);
            document.getElementById('durationMax').addEventListener('input', handleDurationFilterChange);
            
            console.log('Event listeners set up successfully');
            
            // Load initial data
            loadGiltData();
        });
        
        function addCacheManagementButtons() {
            // Add debug info and cache stats buttons
            const debugButton = document.createElement('button');
            debugButton.textContent = '📊 Debug';
            debugButton.className = 'cache-debug-button';
            debugButton.style.cssText = 'margin: 2px; padding: 6px 12px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; cursor: pointer; font-size: 12px;';
            debugButton.onclick = () => {
                console.log('=== DEBUG INFO ===');
                console.log('Current gilt data:', currentGiltData?.length || 0, 'items');
                console.log('Current results:', currentResults?.length || 0, 'items');
                console.log('Current settings:', currentSettings);
                console.log('Duration filter:', durationFilter);
                const stats = getCacheStats();
                console.log('Cache stats:', stats);
                if (stats) {
                    alert('Cache Stats:\\nUtils Cache: ' + (stats.utilsCache?.cacheSize || 0) + ' items\\nComplex Cache: ' + stats.complexCache.size + ' items\\nTotal Items: ' + stats.total + '\\nHit Rate: ' + (stats.utilsCache?.hitRate * 100 || 0).toFixed(1) + '%');
                }
                console.log('==================');
            };
            
            const cacheButton = document.createElement('button');
            cacheButton.textContent = '🗑️ Clear Cache';
            cacheButton.className = 'cache-clear-button';
            cacheButton.style.cssText = 'margin: 2px; padding: 6px 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; cursor: pointer; font-size: 12px;';
            cacheButton.onclick = () => {
                clearAllCaches();
                alert('All caches cleared! Calculations will be recomputed on next update.');
            };
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000; display: flex; flex-direction: column;';
            buttonContainer.appendChild(debugButton);
            buttonContainer.appendChild(cacheButton);
            document.body.appendChild(buttonContainer);
        }
    </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}