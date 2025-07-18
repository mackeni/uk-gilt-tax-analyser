# UK Gilt Tax Efficiency Analyzer

## Overview

This is a Streamlit web application designed to help UK additional rate taxpayers (45% tax band) analyze the tax efficiency of UK gilt investments compared to savings accounts. The application provides tools to calculate after-tax yields, compare investment options, and visualize tax implications for high-rate taxpayers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Streamlit - Python-based web framework for data applications
- **UI Components**: Interactive widgets including sidebars, charts, and data tables
- **Visualization**: Plotly Express and Plotly Graph Objects for interactive charts
- **State Management**: Streamlit session state for maintaining user selections and cached data

### Backend Architecture
- **Language**: Python
- **Structure**: Modular design with separate components for data fetching, tax calculations, and utilities
- **Caching**: Streamlit's `@st.cache_resource` decorator for performance optimization
- **Data Processing**: Pandas for data manipulation and NumPy for numerical computations

## Key Components

### 1. Main Application (`app.py`)
- **Purpose**: Entry point and UI orchestration
- **Features**: 
  - Page configuration and layout management
  - Session state initialization
  - User interface components and navigation
  - Integration of data fetcher and tax calculator

### 2. Gilt Data Fetcher (`gilt_data.py`)
- **Purpose**: Retrieve UK gilt market data
- **Data Sources**: 
  - UK Debt Management Office (DMO) - primary source
  - Tradeweb - secondary source
  - DividendData - backup source
- **Fallback Strategy**: Sample data when real-time data is unavailable
- **Error Handling**: Graceful degradation with user notifications

### 3. Tax Calculator (`tax_calculator.py`)
- **Purpose**: Calculate tax implications for gilt investments
- **Tax Rates**: Current UK tax rates for 2025/26
  - Additional rate: 45%
  - Higher rate: 40%
  - Basic rate: 20%
  - CGT rates: 20% (higher), 10% (basic)
- **Features**:
  - Personal Savings Allowance calculations
  - After-tax yield computations
  - Tax efficiency comparisons

### 4. Utilities (`utils.py`)
- **Purpose**: Common formatting and calculation functions
- **Functions**:
  - Currency formatting with appropriate scaling (K, M)
  - Percentage formatting
  - Date calculations for maturity periods

## Data Flow

1. **User Input**: Tax settings and preferences via Streamlit sidebar
2. **Data Fetching**: Gilt data retrieved from external sources or sample data
3. **Tax Calculations**: After-tax yields computed based on user's tax bracket
4. **Visualization**: Interactive charts and tables displaying results
5. **Comparison**: Side-by-side analysis of gilt vs. savings account returns

## External Dependencies

### Data Sources
- **UK Debt Management Office (DMO)**: Primary source for gilt data
- **Tradeweb**: Secondary market data source
- **DividendData**: Backup gilt price and yield information

### Python Libraries
- **Streamlit**: Web application framework
- **Pandas**: Data manipulation and analysis
- **Plotly**: Interactive visualization
- **NumPy**: Numerical computations
- **Requests**: HTTP requests for data fetching

## Deployment Strategy

### Development Environment
- **Platform**: Replit-compatible Python environment
- **Dependencies**: Managed via requirements.txt (implied)
- **Local Testing**: Streamlit development server

### Production Considerations
- **Caching**: Implemented via Streamlit's caching mechanisms
- **Error Handling**: Graceful fallbacks and user notifications
- **Performance**: Optimized data fetching and calculation caching
- **Scalability**: Stateless design with session state management

### Key Architectural Decisions

1. **Modular Design**: Separated concerns into distinct modules for maintainability
2. **Streamlit Choice**: Selected for rapid prototyping and built-in UI components
3. **Fallback Data**: Implemented sample data to ensure application functionality
4. **Tax Focus**: Specifically designed for UK additional rate taxpayers
5. **Real-time Data**: Attempted integration with live market data sources
6. **Caching Strategy**: Utilized Streamlit's caching for performance optimization

## Recent Changes

### July 18, 2025 - Approximation Removal and Precision Enhancement

- **Eliminated All Approximations**: Removed all approximations, estimates, and simplified calculations throughout the codebase
- **Precise Accrued Interest**: Replaced 25% estimate with exact Actual/Actual day count calculations using real coupon dates
- **Exact Coupon Date Calculations**: Removed arbitrary 90-day and 182-day approximations, using actual gilt payment conventions
- **Enhanced Error Handling**: Failed calculations return zero instead of estimates to maintain data integrity
- **Authentic Data Integration**: All calculations now use precise gilt market conventions and authentic data sources
- **Performance Maintained**: Precision improvements implemented with efficient caching to maintain speed

### July 18, 2025 - Sample Data Removal and Real Data Requirements

- **Sample Data Removal**: Completely removed all sample/fallback data to ensure application only uses authentic UK gilt market data
- **Real Data Enforcement**: Application now requires successful connection to external UK gilt data sources
- **Enhanced Error Handling**: Clear messaging when real data is unavailable with troubleshooting guidance
- **Data Source Transparency**: Explicit documentation of authentic data sources (DMO, DividendData)
- **Improved User Communication**: Better explanation of real data requirements and troubleshooting steps

### July 18, 2025 - Auto-Loading and Tax Rate Flexibility

- **Automatic Data Loading**: Application now automatically loads gilt data on startup for better user experience
- **Tax Rate Selection**: Added dropdown to choose between Basic Rate (20%), Higher Rate (40%), and Additional Rate (45%)
- **Personal Savings Allowance Integration**: Dynamic PSA calculation (£1,000 for basic, £500 for higher, £0 for additional rate)
- **Enhanced Tax Efficiency Analysis**: Comprehensive comparison considering PSA and selected tax rates
- **Streamlined Interface**: Removed unnecessary summary metrics and improved data refresh functionality
- **Performance Optimizations**: Added caching decorators and LRU caching for faster calculations

### July 18, 2025 - Precision Enhancements and Accurate Dirty Price Implementation
- **6 Decimal Place Precision**: All money calculations now display with 6 decimal places for enhanced accuracy
- **Corrected Accrued Interest Calculation**: Implemented proper UK gilt accrued interest methodology
  - Uses actual day count convention (Actual/Actual)
  - Calculates exact days since last coupon payment
  - Applies proper semi-annual coupon payment schedule
  - Returns monetary amounts (£X.XXXXXX per £100) instead of percentages
- **Accurate Dirty Price Calculations**: Clean price + accrued interest = dirty price with proper mathematical implementation
- **Enhanced Calculation Transparency**: Detailed breakdown shows coupon dates, accrued fractions, and step-by-step calculations
- **Realistic Market Values**: Accrued interest values now reflect actual gilt market conditions

### July 17, 2025 - Schedule-Based Analysis System
- **Enhanced Coupon Scheduler**: Comprehensive system generating actual UK gilt coupon payment dates
- **Schedule-Based Tax Calculations**: All yield calculations now use detailed coupon schedules with actual payment dates
- **Accurate Present Value Analysis**: Present value calculations using actual payment timing
- **Complete Payment Schedule Display**: Shows every coupon payment date, amount, and tax impact
- **Investment Scaling**: Accurate projections for any investment amount using schedule-based returns

### Coupon Scheduler Features
- **UK Gilt Conventions**: Follows semi-annual payment patterns based on maturity dates
- **Business Day Adjustments**: Proper handling of weekends and holidays
- **Tax Timing Effects**: Accounts for when taxes are paid on coupon income
- **Principal Repayment**: Tracks tax-free principal return at maturity

### Schedule-Based Analysis Benefits
- **Precision**: Uses actual payment dates instead of simplified annual calculations
- **Accuracy**: Accounts for timing differences in coupon payments
- **Transparency**: Shows complete breakdown of each payment and tax impact
- **Scalability**: Accurate projections for any investment amount

### Database Integration
- **PostgreSQL Database**: Persistent storage for gilt data and coupon schedules
- **Coupon Payment Tracking**: Individual payment dates and amounts
- **Error Handling**: Graceful fallbacks and data validation

### Technical Implementation
- **CouponScheduler Class**: Generates detailed payment schedules
- **Schedule-Based Yield Calculation**: Enhanced tax calculator using actual payment timing
- **Present Value Analysis**: Discount future cash flows using market rates
- **Investment Return Projections**: Accurate scaling for different investment amounts

This architecture delivers precise tax efficiency analysis for UK additional rate taxpayers using actual coupon payment schedules, providing significantly more accurate results than simplified annual calculations.