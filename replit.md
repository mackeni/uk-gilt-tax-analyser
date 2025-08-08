# UK Gilt Tax Efficiency Analyser

## Overview

This is a Cloudflare Worker application designed to help UK additional rate taxpayers (45% tax band) analyse the tax efficiency of UK gilt investments compared to savings accounts. The application provides tools to calculate after-tax yields, compare investment options, and visualise tax implications for high-rate taxpayers. It focuses on precise tax efficiency analysis using actual coupon payment schedules and market data, offering a robust tool for financial comparison.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Pure HTML/CSS/JavaScript
- **UI Components**: Interactive web components with responsive design, including mobile optimization with touch-friendly interfaces.
- **Visualization**: Native JavaScript with interactive modals, tables, and detailed tooltips for calculation explanations and payment schedules.
- **State Management**: Client-side state management with local storage persistence.
- **UI/UX Decisions**: British Pound icons (💷) and British English spelling ("Analyser", "optimisation") are used throughout. Color-coded sections with yellow for account charges and green for coupons.

### Backend Architecture
- **Runtime**: Cloudflare Workers (JavaScript V8 engine) for serverless edge computing.
- **Structure**: Modular JavaScript libraries for Gilt Data Fetching, Tax Calculation, Coupon Scheduling, and Utility functions.
- **Caching**: Edge caching and local browser storage, with a two-tier caching strategy (standard and TTL cache) for performance optimization.
- **Data Processing**: Native JavaScript with client-side financial calculations, including IRR (Internal Rate of Return) methodology using Newton-Raphson for after-tax yield, and precise UK gilt accrued interest calculations.

### Key Architectural Decisions
- **Modular Design**: Separation of concerns into distinct modules for maintainability.
- **Client-Side Processing**: Core tax efficiency calculations and UI logic are entirely client-side, enabling a pure Cloudflare Worker architecture.
- **Fallback Data**: Comprehensive fallback data with 37 UK government bonds ensures application functionality even when live data APIs are rate-limited or blocked.
- **Tax Focus**: Specifically designed for UK additional rate taxpayers with dynamic PSA calculations and tax rate selection.
- **Real-time/Authentic Data**: Prioritization of live market data from financial APIs, with a robust fallback to static authentic data when APIs are unavailable.
- **Precision**: Elimination of approximations; calculations adhere to UK gilt market conventions (e.g., Actual/Actual day count, semi-annual coupon payments).
- **Security**: Implementation of modern security headers including CSP `frame-ancestors 'none'`, HSTS, COEP, COOP, and CORP.

### Feature Specifications
- **Live Gilt Data System**: Multi-tier data fetching with live API integration (Alpha Vantage, Finnhub, FMP) and authenticated fallback to verified DividendData.co.uk prices.
- **Real-Time Price Updates**: Automatic daily refresh of gilt prices using current market yields and proper yield curve mathematics.
- **Tax Calculator**: Calculates tax implications for gilt investments based on current UK tax rates (2025/26), including Personal Savings Allowance and after-tax yield computations.
- **Coupon Scheduler**: Generates detailed UK gilt coupon payment dates, accounting for semi-annual patterns and business day adjustments.
- **IRR Calculations**: Utilizes Newton-Raphson method for precise after-tax yield calculations, incorporating dealing charges and monthly account charges.
- **PSA Confirmation System**: Allows users to confirm or customize their Personal Savings Allowance.
- **Dealing Charge Modeling**: Configurable dealing charge with a default of £5, affecting investment cost and IRR calculations.
- **Monthly Account Charge Schedule**: Detailed display of monthly account charges, their calculation based on gilt value, and impact on net returns.
- **Duration Filtering and Sorting**: Gilts displayed in increasing duration order with a dual-range slider filter for years to maturity.
- **Interactive Explanations**: Clickable table cells and modal windows provide step-by-step breakdowns of calculations and financial concepts.
- **Data Source Attribution**: Clear indication of data source (live APIs vs verified historical) with timestamps for transparency.

## External Dependencies

- **Cloudflare Workers Runtime**: Core platform for deployment and execution.
- **Finnhub API**: Primary source for real-time gilt data.
- **Alpha Vantage API**: Secondary financial data source for treasury yields.
- **Financial Modeling Prep API**: Tertiary financial data source.
- **DividendData**: Historical source for authentic UK gilt prices (used for static fallback data when APIs are blocked).
- **Native JavaScript**: All calculations and UI interactions are built using native JavaScript.
- **Date-fns**: JavaScript library for date manipulation and formatting.
- **Fetch API**: For HTTP requests to external data sources.