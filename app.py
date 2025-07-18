import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from gilt_data import GiltDataFetcher
from tax_calculator import TaxCalculator
from coupon_scheduler import CouponScheduler
from utils import format_currency, format_percentage, calculate_years_to_maturity, calculate_additional_metrics
from database import DatabaseManager

# Page configuration
st.set_page_config(
    page_title="UK Gilt Tax Efficiency Analyzer",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Initialize session state
if 'gilt_data' not in st.session_state:
    st.session_state.gilt_data = None
if 'selected_gilts' not in st.session_state:
    st.session_state.selected_gilts = []
if 'data_loaded' not in st.session_state:
    st.session_state.data_loaded = False

# Initialize data fetcher, calculator, and database
@st.cache_resource
def get_data_fetcher():
    return GiltDataFetcher()

@st.cache_resource
def get_tax_calculator():
    return TaxCalculator()

@st.cache_resource
def get_database_manager():
    return DatabaseManager()

@st.cache_resource
def get_coupon_scheduler():
    return CouponScheduler()

gilt_fetcher = get_data_fetcher()
tax_calc = get_tax_calculator()
db_manager = get_database_manager()
coupon_scheduler = get_coupon_scheduler()

# Main title and description
st.title("🏦 UK Gilt Tax Efficiency Analyzer")

# Sidebar for user inputs
st.sidebar.header("Tax Settings")

# Income tax rate selection
tax_bracket = st.sidebar.selectbox(
    "Select Your Tax Bracket",
    options=["Basic Rate (20%)", "Higher Rate (40%)", "Additional Rate (45%)"],
    index=2,  # Default to Additional Rate
    help="Choose your marginal income tax rate for accurate calculations"
)

# Map selection to tax rates and PSA
tax_rate_mapping = {
    "Basic Rate (20%)": {"rate": 0.20, "psa": 1000, "type": "basic_rate"},
    "Higher Rate (40%)": {"rate": 0.40, "psa": 500, "type": "higher_rate"},
    "Additional Rate (45%)": {"rate": 0.45, "psa": 0, "type": "additional_rate"}
}

selected_tax_info = tax_rate_mapping[tax_bracket]
tax_rate = selected_tax_info["rate"]
psa = selected_tax_info["psa"]
taxpayer_type = selected_tax_info["type"]

st.sidebar.markdown(f"""
**Your Tax Settings:**
- Income Tax Rate: {tax_rate*100:.0f}%
- Personal Savings Allowance: £{psa:,}
- Capital Gains Tax on Gilts: 0% (exempt)
""")

# Dynamic description based on selected tax bracket
tax_bracket_descriptions = {
    "Basic Rate (20%)": {
        "title": "For Basic Rate Taxpayers (20% Tax Band)",
        "description": "This tool helps UK basic rate taxpayers analyze the tax efficiency of UK gilt investments with your £1,000 Personal Savings Allowance."
    },
    "Higher Rate (40%)": {
        "title": "For Higher Rate Taxpayers (40% Tax Band)", 
        "description": "This tool helps UK higher rate taxpayers analyze the tax efficiency of UK gilt investments with your £500 Personal Savings Allowance."
    },
    "Additional Rate (45%)": {
        "title": "For Additional Rate Taxpayers (45% Tax Band)",
        "description": "This tool helps UK additional rate taxpayers analyze the tax efficiency of UK gilt investments with no Personal Savings Allowance."
    }
}

selected_description = tax_bracket_descriptions[tax_bracket]
st.markdown(f"""
**{selected_description['title']}**

{selected_description['description']}

Key advantages of gilts for taxpayers:
- **Capital Gains Tax Exempt**: No CGT on gilt price appreciation
- **Predictable Returns**: Fixed coupon payments and known maturity value
- **Tax Efficiency**: Optimized after-tax returns using actual coupon schedules
""")

# Additional settings
st.sidebar.subheader("Investment Settings")
investment_amount = st.sidebar.number_input(
    "Investment Amount (£)",
    min_value=100.0,
    max_value=10000000.0,
    value=10000.0,
    step=1000.0,
    help="Amount you plan to invest"
)

# Savings comparison rate
savings_rate = st.sidebar.number_input(
    "Current Savings Rate (%)",
    min_value=0.0,
    max_value=10.0,
    value=4.5,
    step=0.1,
    help="Current savings account interest rate for comparison"
)





# Data loading section
st.header("📊 UK Gilt Data")

# Auto-load data on first visit
if not st.session_state.data_loaded:
    with st.spinner("Loading gilt data..."):
        try:
            # Try to load from database first
            st.session_state.gilt_data = db_manager.get_gilts_dataframe()
            
            if st.session_state.gilt_data.empty:
                # If database is empty, fetch fresh data and populate
                fresh_data = gilt_fetcher.get_gilt_data()
                if fresh_data is not None and not fresh_data.empty:
                    db_manager.populate_gilt_data(fresh_data.to_dict('records'))
                    st.session_state.gilt_data = db_manager.get_gilts_dataframe()
                else:
                    # Use sample data as fallback
                    sample_data = gilt_fetcher.get_sample_data()
                    db_manager.populate_gilt_data(sample_data.to_dict('records'))
                    st.session_state.gilt_data = db_manager.get_gilts_dataframe()
            
            st.session_state.data_loaded = True
            
            if st.session_state.gilt_data is not None and not st.session_state.gilt_data.empty:
                st.success(f"✅ Loaded {len(st.session_state.gilt_data)} gilts automatically")
            else:
                st.warning("⚠️ No data loaded - check data sources")
                
        except Exception as e:
            st.error(f"Auto-loading failed: {str(e)}")
            # Fallback to sample data
            sample_data = gilt_fetcher.get_sample_data()
            st.session_state.gilt_data = sample_data
            st.session_state.data_loaded = True

# Data refresh button
col1, col2, col3 = st.columns([1, 1, 2])
with col1:
    if st.button("🔄 Refresh Data", type="primary"):
        st.session_state.gilt_data = None
        st.session_state.data_loaded = False  # Reset auto-load flag
        with st.spinner("Fetching latest gilt data..."):
            try:
                # Clear any cached data first
                try:
                    gilt_fetcher.get_gilt_data.clear()
                except AttributeError:
                    # Cache clear method may not be available, continue anyway
                    pass
                
                # Try to get fresh data from external sources
                fresh_data = gilt_fetcher.get_gilt_data()
                
                if fresh_data is not None and not fresh_data.empty:
                    # Update database with fresh data
                    db_manager.populate_gilt_data(fresh_data.to_dict('records'))
                    st.session_state.gilt_data = db_manager.get_gilts_dataframe()
                    st.success(f"✅ Refreshed with {len(st.session_state.gilt_data)} gilts from live sources")
                else:
                    # Fall back to sample data
                    sample_data = gilt_fetcher.get_sample_data()
                    db_manager.populate_gilt_data(sample_data.to_dict('records'))
                    st.session_state.gilt_data = db_manager.get_gilts_dataframe()
                    st.warning("⚠️ Live data unavailable - refreshed with sample data")
                    
                st.session_state.data_loaded = True
                st.rerun()
                
            except Exception as e:
                st.error(f"Refresh failed: {str(e)}")
                st.session_state.gilt_data = gilt_fetcher.get_sample_data()
                st.session_state.data_loaded = True

with col2:
    if st.button("📊 Load from Database"):
        st.session_state.gilt_data = db_manager.get_gilts_dataframe()
        st.info("Data loaded from database")



# Display gilt data
if st.session_state.gilt_data is not None and not st.session_state.gilt_data.empty:
    df = st.session_state.gilt_data.copy()
    
    # Calculate additional metrics efficiently
    df = calculate_additional_metrics(df)
    
    # Calculate after-tax yields using detailed coupon schedules
    @st.cache_data(ttl=60)  # Cache for 1 minute
    def calculate_enhanced_after_tax_yield(row):
        try:
            # Create gilt info for coupon scheduler
            gilt_info = {
                'maturity_date': row['Maturity Date'],
                'coupon_rate': row['Coupon Rate'],
                'face_value': 100.0
            }
            
            # Generate detailed coupon schedule
            coupon_schedule = coupon_scheduler.generate_coupon_schedule(gilt_info)
            
            if coupon_schedule:
                # Use schedule-based calculation for accurate analysis with dirty price
                dirty_price = row.get('Dirty Price', row.get('Price', 100))
                
                # Use the new schedule-based yield calculation with dirty price
                return tax_calc._calculate_schedule_based_yield(
                    coupon_schedule, dirty_price, tax_rate=tax_rate, taxpayer_type=taxpayer_type
                )
            else:
                # No coupons - use simple calculation
                return tax_calc.calculate_after_tax_yield(
                    row['Current Yield'], row['Years to Maturity'], row['Coupon Rate'], taxpayer_type
                )
        except Exception as e:
            # Fallback to simple calculation
            return tax_calc.calculate_after_tax_yield(
                row['Current Yield'], row['Years to Maturity'], row['Coupon Rate'], taxpayer_type
            )
    
    df['After-Tax Yield'] = df.apply(calculate_enhanced_after_tax_yield, axis=1)
    df['Equivalent Savings Rate'] = df['After-Tax Yield'] / (1 - tax_rate)
    
    # Filter and sort options
    st.subheader("Filter Options")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        min_yield = st.slider("Minimum Yield (%)", 0.0, 10.0, 0.0, 0.1)
        max_yield = st.slider("Maximum Yield (%)", 0.0, 15.0, 15.0, 0.1)
    
    with col2:
        min_maturity = st.slider("Minimum Years to Maturity", 0.0, 50.0, 0.0, 0.5)
        max_maturity = st.slider("Maximum Years to Maturity", 0.0, 50.0, 3.0, 0.5)
    
    with col3:
        sort_by = st.selectbox("Sort by", [
            "After-Tax Yield", "Current Yield", "Years to Maturity", 
            "Equivalent Savings Rate", "Coupon Rate"
        ])
        sort_order = st.selectbox("Sort Order", ["Descending", "Ascending"])
    
    # Apply filters
    filtered_df = df[
        (df['Current Yield'] >= min_yield) & 
        (df['Current Yield'] <= max_yield) &
        (df['Years to Maturity'] >= min_maturity) &
        (df['Years to Maturity'] <= max_maturity)
    ]
    
    # Sort data
    ascending = sort_order == "Ascending"
    filtered_df = filtered_df.sort_values(sort_by, ascending=ascending)
    
    # Display filtered data
    st.subheader(f"Available Gilts ({len(filtered_df)} found)")
    
    # Create display dataframe
    display_columns = ['Name', 'Coupon Rate', 'Current Yield', 'After-Tax Yield', 
                      'Equivalent Savings Rate', 'Maturity Date', 'Years to Maturity', 'Dirty Price']
    
    # Add coupon information if available
    if 'Next Coupon Date' in filtered_df.columns:
        display_columns.extend(['Next Coupon Date', 'Remaining Coupons'])
    
    display_df = filtered_df[display_columns].copy()
    
    # Format display columns
    display_df['Coupon Rate'] = display_df['Coupon Rate'].apply(lambda x: f"{x:.3f}%")
    display_df['Current Yield'] = display_df['Current Yield'].apply(lambda x: f"{x:.3f}%")
    display_df['After-Tax Yield'] = display_df['After-Tax Yield'].apply(lambda x: f"{x:.3f}%")
    display_df['Equivalent Savings Rate'] = display_df['Equivalent Savings Rate'].apply(lambda x: f"{x:.3f}%")
    display_df['Maturity Date'] = display_df['Maturity Date'].apply(lambda x: x.strftime("%d %b %Y"))
    display_df['Years to Maturity'] = display_df['Years to Maturity'].apply(lambda x: f"{x:.1f}")
    display_df['Dirty Price'] = display_df['Dirty Price'].apply(lambda x: f"£{x:.6f}")
    
    # Format coupon information if available
    if 'Next Coupon Date' in display_df.columns:
        display_df['Next Coupon Date'] = display_df['Next Coupon Date'].apply(
            lambda x: x.strftime('%d %b %Y') if pd.notna(x) else 'N/A'
        )
    if 'Remaining Coupons' in display_df.columns:
        display_df['Remaining Coupons'] = display_df['Remaining Coupons'].apply(
            lambda x: f"{int(x)}" if pd.notna(x) else '0'
        )
    
    # Interactive table with selection
    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True
    )
    
    # Quick insights section
    st.subheader("⚡ Quick Insights")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if len(filtered_df) > 0:
            best_after_tax = filtered_df.loc[filtered_df['After-Tax Yield'].idxmax()]
            st.metric(
                "Best After-Tax Yield",
                f"{best_after_tax['After-Tax Yield']:.3f}%",
                f"{best_after_tax['Name']}"
            )
        else:
            st.metric("Best After-Tax Yield", "N/A", "No gilts found")
    
    with col2:
        if len(filtered_df) > 0:
            highest_equivalent = filtered_df.loc[filtered_df['Equivalent Savings Rate'].idxmax()]
            st.metric(
                "Best Equivalent Savings Rate",
                f"{highest_equivalent['Equivalent Savings Rate']:.3f}%",
                f"{highest_equivalent['Name']}"
            )
        else:
            st.metric("Best Equivalent Savings Rate", "N/A", "No gilts found")
    
    # Tax efficiency comparison
    if not filtered_df.empty:
        st.subheader("💰 Tax Efficiency Comparison")
        
        best_yield = filtered_df['After-Tax Yield'].max()
        
        # Calculate savings account after-tax return with PSA consideration
        savings_interest_annual = investment_amount * (savings_rate / 100)
        
        # Apply Personal Savings Allowance
        if savings_interest_annual <= psa:
            # All interest within PSA - no tax
            savings_after_tax_rate = savings_rate
        else:
            # Interest above PSA is taxed
            taxable_interest = savings_interest_annual - psa
            tax_on_interest = taxable_interest * tax_rate
            net_interest = savings_interest_annual - tax_on_interest
            savings_after_tax_rate = (net_interest / investment_amount) * 100
        
        best_gilt_advantage = best_yield - savings_after_tax_rate
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric(
                "Your Savings Account",
                f"{savings_after_tax_rate:.3f}%",
                f"After {tax_rate*100:.0f}% tax & PSA"
            )
            
            # PSA impact explanation
            if psa > 0:
                st.caption(f"""
                PSA: £{psa:,} tax-free
                Interest: £{savings_interest_annual:.2f}
                PSA {'fully used' if savings_interest_annual > psa else 'available'}
                """)
            else:
                st.caption("No Personal Savings Allowance")
        
        with col2:
            st.metric(
                "Best Gilt After-Tax",
                f"{best_yield:.3f}%",
                f"{best_gilt_advantage:+.3f}% vs savings"
            )
            
            # Show annual advantage
            gilt_annual_return = investment_amount * (best_yield / 100)
            savings_annual_return = investment_amount * (savings_after_tax_rate / 100)
            annual_advantage = gilt_annual_return - savings_annual_return
            
            st.caption(f"""
            Annual advantage: £{annual_advantage:+.2f}
            On £{investment_amount:,.0f} investment
            """)
    
    # Gilt selection for comparison
    st.subheader("🔍 Detailed Analysis")
    selected_gilt_names = st.multiselect(
        "Select gilts to analyze:",
        options=filtered_df['Name'].tolist(),
        default=filtered_df['Name'].head(3).tolist() if len(filtered_df) >= 3 else filtered_df['Name'].tolist(),
        help="Choose up to 5 gilts for detailed comparison"
    )
    
    if selected_gilt_names:
        selected_data = filtered_df[filtered_df['Name'].isin(selected_gilt_names)]
        
        # Tax efficiency comparison
        st.subheader("💰 Tax Efficiency Analysis")
        
        # Add calculation methodology explanation
        with st.expander("📖 How After-Tax Yields Are Calculated", expanded=False):
            st.markdown("""
            **Our Schedule-Based Calculation Method:**
            
            1. **Generate Actual Payment Schedule**: Create detailed coupon payment dates based on UK gilt conventions
            2. **Calculate Tax on Each Payment**: Apply your selected tax rate to each coupon payment
            3. **Sum After-Tax Cash Flows**: Total all net coupons plus tax-free principal repayment
            4. **Calculate Total Return Ratio**: Divide total after-tax return by **dirty price** (includes accrued interest)
            5. **Annualize the Return**: Use compound annual growth rate formula: ((Total Return Ratio)^(1/Years) - 1) × 100
            
            **Why This Method Is More Accurate:**
            - Uses actual payment dates rather than simplified annual calculations
            - **Uses dirty price** (clean price + accrued interest) for true purchase cost
            - Accounts for precise timing of tax payments
            - Includes capital gains tax exemption for gilts
            - Provides exact equivalent savings rate needed to match gilt returns
            
            **Dirty Price vs Clean Price:**
            - **Clean Price**: Quoted price excluding accrued interest
            - **Dirty Price**: Actual purchase cost including accrued interest
            - **Why Dirty Price**: Reflects true cost of investment for accurate yield calculation
            
            **Your Tax Settings:**
            - Income tax rate: {tax_rate*100:.0f}%
            - Personal Savings Allowance: £{psa:,}
            - Capital Gains Tax on gilts: 0% (exempt)
            - Taxpayer type: {taxpayer_type.replace('_', ' ').title()}
            """)
        
        st.markdown("---")
        
        for idx, row in selected_data.iterrows():
            with st.expander(f"📋 {row['Name']} - Detailed Analysis"):
                # Generate detailed coupon schedule for this gilt
                gilt_info = {
                    'maturity_date': row['Maturity Date'],
                    'coupon_rate': row['Coupon Rate'],
                    'face_value': 100.0
                }
                
                coupon_schedule = coupon_scheduler.generate_coupon_schedule(gilt_info)
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.markdown("**Gilt Details:**")
                    st.write(f"• Coupon Rate: {row['Coupon Rate']:.3f}%")
                    st.write(f"• Current Yield: {row['Current Yield']:.3f}%")
                    st.write(f"• Maturity Date: {row['Maturity Date'].strftime('%d %B %Y')}")
                    st.write(f"• Years to Maturity: {row['Years to Maturity']:.1f}")
                    
                    # Calculate detailed coupon schedule and show calculations
                    if coupon_schedule:
                        after_tax_schedule = coupon_scheduler.calculate_after_tax_cash_flows(
                            coupon_schedule, tax_rate=tax_rate
                        )
                        schedule_summary = coupon_scheduler.get_schedule_summary(after_tax_schedule)
                        
                        st.markdown("**Coupon Schedule Analysis (per £100 nominal):**")
                        st.write(f"• Total Gross Coupons: £{schedule_summary['total_gross_coupons']:.6f}")
                        st.write(f"• Total Coupon Tax ({tax_rate*100:.0f}%): £{schedule_summary['total_coupon_tax']:.6f}")
                        st.write(f"• Total After-Tax Coupons: £{schedule_summary['total_after_tax_coupons']:.6f}")
                        st.write(f"• Principal Return: £{schedule_summary['total_principal']:.6f}")
                        st.write(f"• **Total After-Tax Return: £{schedule_summary['total_after_tax_cash_flows']:.6f}**")
                        
                        # Show detailed payment schedule
                        st.markdown("**Payment Schedule:**")
                        for i, payment in enumerate(coupon_schedule[:5]):  # Show first 5 payments
                            payment_date = payment['payment_date'].strftime('%d %b %Y')
                            coupon_amount = payment['coupon_amount']
                            tax_amount = coupon_amount * tax_rate
                            net_amount = coupon_amount - tax_amount
                            principal = payment.get('principal_amount', 0)
                            
                            if principal > 0:
                                st.write(f"• {payment_date}: £{coupon_amount:.6f} coupon - £{tax_amount:.6f} tax = £{net_amount:.6f} + £{principal:.6f} principal")
                            else:
                                st.write(f"• {payment_date}: £{coupon_amount:.6f} coupon - £{tax_amount:.6f} tax = £{net_amount:.6f}")
                        
                        if len(coupon_schedule) > 5:
                            st.write(f"• ... and {len(coupon_schedule) - 5} more payments")
                    else:
                        # Zero-coupon gilt
                        purchase_price = row.get('Price', 100)
                        capital_gain_per_100 = 100 - purchase_price
                        
                        st.markdown("**Zero-Coupon Analysis (per £100 nominal):**")
                        st.write(f"• Purchase Price: £{purchase_price:.6f}")
                        st.write(f"• Maturity Value: £100.000000")
                        st.write(f"• Capital Gain: £{capital_gain_per_100:.6f}")
                        st.write(f"• Capital Gains Tax: £0.000000 (Exempt)")
                        st.write(f"• **Total Return: £{capital_gain_per_100:.6f}**")
                
                with col2:
                    st.markdown("**Tax Analysis:**")
                    st.write(f"• After-Tax Yield: {row['After-Tax Yield']:.3f}%")
                    st.write(f"• Equivalent Savings Rate: {row['Equivalent Savings Rate']:.3f}%")
                    
                    # Calculate tax efficiency metrics
                    gross_yield = row['Current Yield']
                    tax_on_yield = gross_yield * tax_rate
                    st.write(f"• Tax on Yield ({tax_rate*100:.0f}%): {tax_on_yield:.3f}%")
                    st.write(f"• Tax Efficiency: {(row['After-Tax Yield'] / gross_yield * 100):.1f}%")
                    
                    # Detailed yield calculation breakdown
                    st.markdown("**After-Tax Yield Calculation Method:**")
                    
                    if coupon_schedule:
                        # Schedule-based yield calculation with detailed steps using dirty price
                        dirty_price = row.get('Dirty Price', row.get('Price', 100))
                        clean_price = row.get('Clean Price', row.get('Price', 100))
                        accrued_interest = row.get('Accrued Interest', 0)
                        total_after_tax_return = schedule_summary['total_after_tax_cash_flows']
                        years_to_maturity = row['Years to Maturity']
                        
                        st.markdown("**Step 1: Calculate Total After-Tax Cash Flows**")
                        st.write(f"• Clean Price: £{clean_price:.6f}")
                        st.write(f"• Accrued Interest: £{accrued_interest:.6f}")
                        st.write(f"• **Dirty Price (Total Purchase Cost): £{dirty_price:.6f}**")
                        st.write(f"• Total Gross Coupons: £{schedule_summary['total_gross_coupons']:.6f}")
                        st.write(f"• Tax on Coupons ({tax_rate*100:.0f}%): £{schedule_summary['total_coupon_tax']:.6f}")
                        st.write(f"• Net Coupons: £{schedule_summary['total_after_tax_coupons']:.6f}")
                        st.write(f"• Principal Return: £{schedule_summary['total_principal']:.6f}")
                        st.write(f"• **Total After-Tax Return: £{total_after_tax_return:.6f}**")
                        
                        st.markdown("**Step 2: Calculate Total Return Ratio (Using Dirty Price)**")
                        total_return_ratio = total_after_tax_return / dirty_price
                        st.write(f"• Total Return Ratio = £{total_after_tax_return:.6f} ÷ £{dirty_price:.6f} = {total_return_ratio:.6f}")
                        
                        st.markdown("**Step 3: Annualize the Return**")
                        st.write(f"• Years to Maturity: {years_to_maturity:.6f}")
                        st.write(f"• Formula: ((Total Return Ratio)^(1/Years) - 1) × 100")
                        annualized_yield = ((total_return_ratio ** (1/years_to_maturity)) - 1) * 100
                        st.write(f"• Calculation: (({total_return_ratio:.6f})^(1/{years_to_maturity:.6f}) - 1) × 100")
                        st.write(f"• **After-Tax Yield: {annualized_yield:.3f}%**")
                        
                        # Show equivalent savings rate calculation
                        st.markdown("**Step 4: Calculate Equivalent Savings Rate**")
                        equivalent_rate = annualized_yield / (1 - tax_rate)
                        st.write(f"• Formula: After-Tax Yield ÷ (1 - Tax Rate)")
                        st.write(f"• Calculation: {annualized_yield:.3f}% ÷ (1 - {tax_rate:.2f}) = {equivalent_rate:.3f}%")
                        st.write(f"• **Equivalent Savings Rate: {equivalent_rate:.3f}%**")
                        
                    else:
                        # Zero-coupon yield calculation with detailed steps using dirty price
                        dirty_price = row.get('Dirty Price', row.get('Price', 100))
                        clean_price = row.get('Clean Price', row.get('Price', 100))
                        accrued_interest = row.get('Accrued Interest', 0)
                        capital_gain_per_100 = 100 - dirty_price
                        
                        st.markdown("**Step 1: Calculate Capital Gain (Using Dirty Price)**")
                        st.write(f"• Clean Price: £{clean_price:.6f}")
                        
                        # Show accrued interest calculation details
                        with st.expander("🔍 Accrued Interest Calculation Details"):
                            try:
                                # Get the accrued interest calculation breakdown
                                coupon_rate = row['Coupon Rate']
                                maturity_date = row['Maturity Date']
                                
                                from datetime import datetime, timedelta
                                today = datetime.now().date()
                                maturity_date_obj = maturity_date.date() if isinstance(maturity_date, datetime) else maturity_date
                                
                                # Show the calculation logic
                                st.write("**UK Gilt Accrued Interest Calculation:**")
                                st.write(f"• Coupon Rate: {coupon_rate:.6f}%")
                                st.write(f"• Semi-Annual Coupon: £{coupon_rate/2:.6f} per £100")
                                st.write(f"• Maturity Date: {maturity_date_obj.strftime('%d %b %Y')}")
                                st.write(f"• Today's Date: {today.strftime('%d %b %Y')}")
                                
                                # Calculate coupon dates (simplified approximation)
                                # UK gilts typically pay on the same day and month as maturity
                                year = today.year
                                month = maturity_date_obj.month
                                day = maturity_date_obj.day
                                
                                # Find approximate last coupon date
                                try:
                                    # Try 6 months before maturity date in current year
                                    if month <= 6:
                                        last_coupon_approx = datetime(year - 1, month + 6, day).date()
                                    else:
                                        last_coupon_approx = datetime(year, month - 6, day).date()
                                    
                                    if last_coupon_approx > today:
                                        # Go back another 6 months
                                        if month <= 6:
                                            last_coupon_approx = datetime(year - 1, month, day).date()
                                        else:
                                            last_coupon_approx = datetime(year - 1, month - 6, day).date()
                                    
                                    days_since_last = (today - last_coupon_approx).days
                                    days_in_period = 182  # Approximate 6 months
                                    accrued_fraction = days_since_last / days_in_period
                                    
                                    st.write(f"• Approximate Last Coupon Date: {last_coupon_approx.strftime('%d %b %Y')}")
                                    st.write(f"• Days Since Last Coupon: {days_since_last}")
                                    st.write(f"• Days in Coupon Period: {days_in_period}")
                                    st.write(f"• Accrued Fraction: {accrued_fraction:.6f}")
                                    st.write(f"• **Accrued Interest: £{coupon_rate/2:.6f} × {accrued_fraction:.6f} = £{accrued_interest:.6f} per £100**")
                                    
                                except Exception as e:
                                    st.write(f"• Calculation uses simplified approximation")
                                    st.write(f"• Estimated accrued interest: £{accrued_interest:.6f} per £100")
                                    
                            except Exception as e:
                                st.write(f"• Accrued Interest: £{accrued_interest:.6f} per £100 (estimated)")
                        
                        st.write(f"• Accrued Interest: £{accrued_interest:.6f}")
                        st.write(f"• **Dirty Price (Total Purchase Cost): £{dirty_price:.6f}**")
                        st.write(f"• Maturity Value: £100.000000")
                        st.write(f"• Capital Gain: £100.000000 - £{dirty_price:.6f} = £{capital_gain_per_100:.6f}")
                        st.write(f"• Tax on Capital Gain: £0.000000 (Gilts are CGT exempt)")
                        
                        st.markdown("**Step 2: Calculate Annualized Yield**")
                        st.write(f"• Years to Maturity: {row['Years to Maturity']:.6f}")
                        capital_gain_yield = (capital_gain_per_100 / dirty_price / row['Years to Maturity']) * 100
                        st.write(f"• Simple Annualized Yield: £{capital_gain_per_100:.6f} ÷ £{dirty_price:.6f} ÷ {row['Years to Maturity']:.6f} × 100")
                        st.write(f"• **After-Tax Yield: {capital_gain_yield:.3f}%**")
                        
                        # Show equivalent savings rate calculation
                        st.markdown("**Step 3: Calculate Equivalent Savings Rate**")
                        equivalent_rate = capital_gain_yield / (1 - tax_rate)
                        st.write(f"• Formula: After-Tax Yield ÷ (1 - Tax Rate)")
                        st.write(f"• Calculation: {capital_gain_yield:.3f}% ÷ (1 - {tax_rate:.2f}) = {equivalent_rate:.3f}%")
                        st.write(f"• **Equivalent Savings Rate: {equivalent_rate:.3f}%**")
        
        # Visual comparison
        st.subheader("📊 Visual Comparison")
        
        # Create comparison chart
        chart_data = selected_data[['Name', 'Current Yield', 'After-Tax Yield', 'Equivalent Savings Rate']].copy()
        
        fig = go.Figure()
        
        fig.add_trace(go.Bar(
            name='Current Yield',
            x=chart_data['Name'],
            y=chart_data['Current Yield'],
            marker_color='lightblue'
        ))
        
        fig.add_trace(go.Bar(
            name='After-Tax Yield',
            x=chart_data['Name'],
            y=chart_data['After-Tax Yield'],
            marker_color='darkblue'
        ))
        
        fig.add_trace(go.Bar(
            name='Equivalent Savings Rate',
            x=chart_data['Name'],
            y=chart_data['Equivalent Savings Rate'],
            marker_color='orange'
        ))
        
        fig.update_layout(
            title="Gilt Yield Comparison",
            xaxis_title="Gilt",
            yaxis_title="Yield (%)",
            barmode='group',
            height=500
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Summary table with schedule-based analysis
        st.subheader("📈 Summary Table (Schedule-Based Analysis)")
        summary_df = selected_data[['Name', 'Current Yield', 'After-Tax Yield', 'Equivalent Savings Rate']].copy()

        
        # Add tax efficiency ranking based on schedule-based yields
        summary_df['Tax Efficiency Rank'] = summary_df['After-Tax Yield'].rank(ascending=False, method='dense').astype(int)
        
        # Format summary table
        for col in ['Current Yield', 'After-Tax Yield', 'Equivalent Savings Rate']:
            summary_df[col] = summary_df[col].apply(lambda x: f"{x:.3f}%")
        
        st.dataframe(summary_df, use_container_width=True, hide_index=True)
        
        # Add note about schedule-based calculations
        st.info("💡 **Note:** All after-tax yields are calculated using detailed coupon payment schedules with actual payment dates, providing more accurate tax efficiency analysis than simple annual calculations.")
        
        # Best gilt recommendation using schedule-based analysis
        st.subheader("🏆 Best Gilt Recommendation (Schedule-Based Analysis)")
        best_gilt = selected_data.loc[selected_data['After-Tax Yield'].idxmax()]
        
        # Generate detailed schedule for best gilt
        best_gilt_info = {
            'maturity_date': best_gilt['Maturity Date'],
            'coupon_rate': best_gilt['Coupon Rate'],
            'face_value': 100.0
        }
        
        best_coupon_schedule = coupon_scheduler.generate_coupon_schedule(best_gilt_info)
        
        col1, col2 = st.columns(2)
        with col1:
            st.success(f"**Most Tax Efficient:** {best_gilt['Name']}")
            st.write(f"After-tax yield (schedule-based): {best_gilt['After-Tax Yield']:.3f}%")
            st.write(f"Equivalent savings rate needed: {best_gilt['Equivalent Savings Rate']:.3f}%")
        
        with col2:
            if best_coupon_schedule:
                after_tax_schedule = coupon_scheduler.calculate_after_tax_cash_flows(
                    best_coupon_schedule, tax_rate=tax_rate
                )
                schedule_summary = coupon_scheduler.get_schedule_summary(after_tax_schedule)
                
                st.info("**Schedule-Based Return Analysis (per £100 nominal)**")
                st.write(f"Total gross coupon income: £{schedule_summary['total_gross_coupons']:,.6f}")
                st.write(f"Total tax on coupons: £{schedule_summary['total_coupon_tax']:,.6f}")
                st.write(f"Total net coupon income: £{schedule_summary['total_after_tax_coupons']:,.6f}")
                st.write(f"Principal repayment: £{schedule_summary['total_principal']:,.6f}")
                st.write(f"**Total net return: £{schedule_summary['total_after_tax_cash_flows']:,.6f}**")
            else:
                st.info("Zero-coupon gilt - no coupon income")
        
        # Breakeven analysis
        st.subheader("⚖️ Breakeven Analysis")
        
        # Calculate breakeven rates for top 3 gilts
        top_3_gilts = selected_data.nlargest(3, 'After-Tax Yield')
        
        breakeven_data = []
        for idx, row in top_3_gilts.iterrows():
            breakeven_rate = tax_calc.calculate_breakeven_savings_rate(
                row.to_dict(),
                row['Years to Maturity'],
                taxpayer_type
            )
            breakeven_data.append({
                'Gilt': row['Name'],
                'After-Tax Yield': f"{row['After-Tax Yield']:.3f}%",
                'Breakeven Savings Rate': f"{breakeven_rate:.3f}%",
                'Breakeven Rate': f"{breakeven_rate:.3f}%"
            })
        
        breakeven_df = pd.DataFrame(breakeven_data)
        st.dataframe(breakeven_df, use_container_width=True, hide_index=True)
        
        st.markdown("""
        **Breakeven Analysis Explanation:**
        - The breakeven savings rate is the gross interest rate a savings account would need to offer to match the gilt's after-tax return
        - The current advantage shows how much better each gilt is compared to your specified savings rate
        - A positive advantage means the gilt is better than the savings account
        """)
        
        # Detailed Coupon Schedule Analysis
        st.subheader("💰 Detailed Coupon Schedule Analysis")
        
        # Select gilt for detailed analysis
        gilt_names = selected_data['Name'].tolist()
        selected_gilt_name = st.selectbox(
            "Select gilt for detailed coupon schedule analysis:",
            gilt_names,
            key="detailed_analysis_gilt"
        )
        
        if selected_gilt_name:
            selected_gilt_row = selected_data[selected_data['Name'] == selected_gilt_name].iloc[0]
            
            # Generate detailed coupon schedule
            gilt_info = {
                'maturity_date': selected_gilt_row['Maturity Date'],
                'coupon_rate': selected_gilt_row['Coupon Rate'],
                'face_value': 100.0
            }
            
            coupon_schedule = coupon_scheduler.generate_coupon_schedule(gilt_info)
            
            if coupon_schedule:
                # Calculate after-tax cash flows
                after_tax_schedule = coupon_scheduler.calculate_after_tax_cash_flows(
                    coupon_schedule, tax_rate=0.45
                )
                
                # Get schedule summary
                schedule_summary = coupon_scheduler.get_schedule_summary(after_tax_schedule)
                
                # Display schedule overview
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    st.metric("Total Payments", schedule_summary['number_of_payments'])
                with col2:
                    st.metric("First Payment", schedule_summary['first_payment_date'].strftime('%d %b %Y'))
                with col3:
                    st.metric("Final Payment", schedule_summary['final_payment_date'].strftime('%d %b %Y'))
                with col4:
                    st.metric("Total After-Tax Return", f"£{schedule_summary['total_after_tax_cash_flows']:.6f}")
                
                # Detailed payment schedule table
                st.subheader("📅 Complete Payment Schedule")
                
                # Create DataFrame for display
                schedule_df = pd.DataFrame(after_tax_schedule)
                schedule_df['payment_date'] = schedule_df['payment_date'].apply(lambda x: x.strftime('%d %b %Y'))
                
                # Format amounts for display
                display_schedule = schedule_df[[
                    'payment_date', 'days_to_payment', 'coupon_amount', 
                    'coupon_tax', 'after_tax_coupon', 'principal_amount', 'after_tax_total'
                ]].copy()
                
                display_schedule.columns = [
                    'Payment Date', 'Days to Payment', 'Gross Coupon (£)', 
                    'Tax Paid (£)', 'Net Coupon (£)', 'Principal (£)', 'Total Net (£)'
                ]
                
                # Format currency columns
                currency_cols = ['Gross Coupon (£)', 'Tax Paid (£)', 'Net Coupon (£)', 'Principal (£)', 'Total Net (£)']
                for col in currency_cols:
                    display_schedule[col] = display_schedule[col].apply(lambda x: f"£{x:.6f}")
                
                st.dataframe(display_schedule, use_container_width=True, hide_index=True)
                
                # Tax analysis summary
                st.subheader("📊 Tax Analysis Summary")
                col1, col2 = st.columns(2)
                
                with col1:
                    st.write("**Income Tax Analysis:**")
                    st.write(f"Total Gross Coupon Income: £{schedule_summary['total_gross_coupons']:.6f}")
                    st.write(f"Total Tax Paid (45%): £{schedule_summary['total_coupon_tax']:.6f}")
                    st.write(f"Total Net Coupon Income: £{schedule_summary['total_after_tax_coupons']:.6f}")
                    st.write(f"Effective Tax Rate: {(schedule_summary['total_coupon_tax'] / schedule_summary['total_gross_coupons'] * 100):.1f}%")
                
                with col2:
                    st.write("**Capital Gains Analysis:**")
                    purchase_price = selected_gilt_row.get('Price', 100)
                    capital_gain = schedule_summary['total_principal'] - purchase_price
                    st.write(f"Purchase Price: £{purchase_price:.6f}")
                    st.write(f"Redemption Value: £{schedule_summary['total_principal']:.6f}")
                    st.write(f"Capital Gain/Loss: £{capital_gain:.6f}")
                    st.write(f"Capital Gains Tax: £0.000000 (Exempt)")
                
                # Yield calculation details
                st.subheader("💷 Yield Calculation Details")
                
                st.write(f"**Per £100 Nominal Investment:**")
                st.write(f"Total Gross Coupon Income: £{schedule_summary['total_gross_coupons']:,.6f}")
                st.write(f"Total Tax Paid: £{schedule_summary['total_coupon_tax']:,.6f}")
                st.write(f"Total Net Coupon Income: £{schedule_summary['total_after_tax_coupons']:,.6f}")
                st.write(f"Principal Repayment: £{schedule_summary['total_principal']:,.6f}")
                st.write(f"**Total After-Tax Return: £{schedule_summary['total_after_tax_cash_flows']:,.6f}**")
                
                # Annualized return
                years_to_maturity = (schedule_summary['final_payment_date'] - pd.Timestamp.now().date()).days / 365.25
                if years_to_maturity > 0:
                    purchase_price = selected_gilt_row.get('Price', 100)
                    total_return_pct = (schedule_summary['total_after_tax_cash_flows'] / purchase_price - 1) * 100
                    annualized_return = ((schedule_summary['total_after_tax_cash_flows'] / purchase_price) ** (1/years_to_maturity) - 1) * 100
                    st.write(f"Total Return: {total_return_pct:.6f}%")
                    st.write(f"Annualized After-Tax Return: {annualized_return:.6f}%")
            else:
                st.info("No coupon payments scheduled for this gilt (zero-coupon bond)")
        
        # Export functionality
        st.subheader("📤 Export Analysis")
        
        # Prepare export data
        export_data = selected_data.copy()
        export_data['Analysis Date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Convert to CSV
        csv = export_data.to_csv(index=False)
        
        st.download_button(
            label="📥 Download Analysis as CSV",
            data=csv,
            file_name=f"gilt_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            mime="text/csv"
        )

else:
    st.error("Unable to load gilt data. Please try refreshing or check your internet connection.")

# Educational section
st.header("📚 Understanding Gilt Taxation")

with st.expander("💡 Tax Advantages of Gilts for Additional Rate Taxpayers"):
    st.markdown("""
    ### Key Tax Benefits:
    
    **1. Capital Gains Tax Exemption**
    - Gilts are completely exempt from CGT
    - Any capital appreciation is tax-free
    - Particularly beneficial for higher rate taxpayers who would otherwise pay 20% CGT
    
    **2. Predictable Tax Treatment**
    - Only the coupon payments are subject to income tax
    - No unexpected tax liabilities from capital gains
    - Known tax burden throughout the investment period
    
    **3. Tax Efficiency vs Savings**
    - Additional rate taxpayers receive 0% Personal Savings Allowance
    - All savings interest is taxed at 45%
    - Gilts often provide better after-tax returns than savings accounts
    
    ### Important Considerations:
    - Interest payments are fully taxable at your marginal rate (45%)
    - No CGT exemption applies to gilt funds or ETFs
    - Consider ISA allowances first (£20,000 annual limit)
    - Gilt prices can fluctuate before maturity
    """)

with st.expander("🧮 How the Calculations Work"):
    st.markdown("""
    ### After-Tax Yield Calculation:
    
    **For Gilts:**
    - Coupon income is taxed at 45%
    - Capital gains/losses are tax-free
    - After-tax yield = Coupon rate × (1 - 0.45) + Capital appreciation
    
    **For Savings Accounts:**
    - All interest is taxed at 45%
    - No Personal Savings Allowance for additional rate taxpayers
    - After-tax yield = Gross rate × (1 - 0.45)
    
    **Equivalent Savings Rate:**
    - The gross savings rate needed to match the gilt's after-tax return
    - Calculation: Gilt after-tax yield ÷ (1 - 0.45)
    
    ### Example:
    A gilt yielding 4% with 3 years to maturity:
    - Annual coupon: 4% × (1 - 0.45) = 2.2% after tax
    - Equivalent savings rate: 2.2% ÷ (1 - 0.45) = 4.0%
    """)

# Footer
st.markdown("---")
st.markdown("""
**Disclaimer:** This tool is for educational purposes only and should not be considered as financial advice. 
Tax rules may change, and individual circumstances vary. Please consult with a qualified financial advisor 
and tax professional before making investment decisions.

**Data Sources:** UK DMO, Financial data providers. Data may be delayed and should be verified before trading.
""")
