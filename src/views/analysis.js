/**
 * Analysis Page View - Cloudflare Worker Version
 * Detailed analysis page for gilt comparisons
 */

export async function renderAnalysisPage(request, env) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detailed Analysis - UK Gilt Tax Efficiency Analyser</title>
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
        
        .summary-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .summary-label {
            color: #7f8c8d;
            font-size: 0.9em;
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
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-button">← Back to Main Analysis</a>
        
        <header class="header">
            <h1>💷 Detailed Gilt Analysis</h1>
            <p>Comprehensive coupon schedule and tax analysis</p>
        </header>
        
        <div class="analysis-section">
            <h3>💷 Coupon Schedule Analysis</h3>
            <p>Select a gilt to view its detailed payment schedule and tax implications.</p>
            
            <div class="schedule-summary" id="scheduleSummary" style="display: none;">
                <!-- Schedule summary will be populated here -->
            </div>
            
            <div class="coupon-schedule">
                <div id="scheduleTable">
                    <p>Loading analysis...</p>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // This would be populated with actual analysis data
        // For now, showing the structure
        document.addEventListener('DOMContentLoaded', function() {
            // In a real implementation, this would load from API
            loadAnalysisData();
        });
        
        async function loadAnalysisData() {
            try {
                // Fetch authentic gilt data from API
                const response = await fetch('/api/gilt-data');
                const giltData = await response.json();
                
                if (!giltData || giltData.length === 0) {
                    throw new Error('No authentic gilt data available');
                }
                
                // Use first gilt for demonstration of coupon schedule
                const firstGilt = giltData[0];
                
                // Import coupon scheduler module
                const { CouponScheduler } = await import('../lib/coupon-scheduler.js');
                const scheduler = new CouponScheduler();
                
                // Generate authentic coupon schedule
                const schedule = scheduler.generateCouponSchedule(firstGilt);
                
                if (!schedule || schedule.length === 0) {
                    throw new Error('Failed to generate authentic coupon schedule from gilt data');
                }
                
                displaySchedule(schedule);
            } catch (error) {
                const container = document.getElementById('scheduleTable');
                container.innerHTML = '';
                const p = document.createElement('p');
                p.textContent = 'Error loading analysis: ' + error.message;
                container.appendChild(p);
            }
        }
        
        function displaySchedule(schedule) {
            const summaryDiv = document.getElementById('scheduleSummary');
            const tableDiv = document.getElementById('scheduleTable');
            
            // Calculate summary
            const totalPayments = schedule.length;
            const totalCoupons = schedule.reduce((sum, p) => sum + p.couponAmount, 0);
            const totalAfterTax = schedule.reduce((sum, p) => sum + p.afterTaxTotal, 0);
            const totalTax = schedule.reduce((sum, p) => sum + p.couponTax, 0);
            
            // Display summary
            summaryDiv.innerHTML = \`
                <div class="summary-card">
                    <div class="summary-label">📅 Total Payments</div>
                    <div class="summary-value">\${totalPayments}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">💷 Total Coupons</div>
                    <div class="summary-value">£\${totalCoupons.toFixed(2)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">💷 Total After-Tax</div>
                    <div class="summary-value">£\${totalAfterTax.toFixed(2)}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">💷 Total Tax</div>
                    <div class="summary-value">£\${totalTax.toFixed(2)}</div>
                </div>
            \`;
            
            summaryDiv.style.display = 'grid';
            
            // Display table
            const tableHTML = \`
                <table>
                    <thead>
                        <tr>
                            <th>Payment Date</th>
                            <th>Days to Payment</th>
                            <th>Gross Coupon (£)</th>
                            <th>Tax Paid (£)</th>
                            <th>Net Coupon (£)</th>
                            <th>Principal (£)</th>
                            <th>Total Net (£)</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${schedule.map(payment => \`
                            <tr>
                                <td>\${new Date(payment.paymentDate).toLocaleDateString('en-GB')}</td>
                                <td>\${payment.daysToPayment}</td>
                                <td>£\${payment.couponAmount.toFixed(2)}</td>
                                <td>£\${payment.couponTax.toFixed(2)}</td>
                                <td>£\${payment.afterTaxCoupon.toFixed(2)}</td>
                                <td>£\${payment.principalAmount.toFixed(2)}</td>
                                <td style="font-weight: bold; color: #27ae60;">£\${payment.afterTaxTotal.toFixed(2)}</td>
                            </tr>
                        \`).join('')}
                    </tbody>
                </table>
            \`;
            
            tableDiv.innerHTML = tableHTML;
        }
    </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',

      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; media-src 'none'; frame-src 'none'; frame-ancestors 'none';",
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), fullscreen=(self), sync-xhr=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Origin-Agent-Cluster': '?1',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Clear-Site-Data': '"cache", "cookies", "storage"'
    }
  });
}