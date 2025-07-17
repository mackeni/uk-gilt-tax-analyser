import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np
from gilt_data import GiltDataFetcher
from tax_calculator import TaxCalculator
from utils import format_currency, format_percentage, calculate_years_to_maturity

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

# Initialize data fetcher and calculator
@st.cache_resource
def get_data_fetcher():
    return GiltDataFetcher()

@st.cache_resource
def get_tax_calculator():
    return TaxCalculator()

gilt_fetcher = get_data_fetcher()
tax_calc = get_tax_calculator()

# Main title and description
st.title("🏦 UK Gilt Tax Efficiency Analyzer")
st.markdown("""
**For Additional Rate Taxpayers (45% Tax Band)**

This tool helps UK additional rate taxpayers analyze the tax efficiency of UK gilts compared to savings accounts.
Key advantages of gilts for higher rate taxpayers:
- **Capital Gains Tax Exempt**: No CGT on gilt price appreciation
- **Predictable Returns**: Fixed coupon payments and known maturity value
- **Tax Efficiency**: Often better after-tax returns than savings accounts
""")

# Sidebar for user inputs
st.sidebar.header("Tax Settings")
st.sidebar.markdown("""
**Additional Rate Taxpayer Assumptions:**
- Income Tax Rate: 45%
- Personal Savings Allowance: £0
- Capital Gains Tax on Gilts: 0% (exempt)
""")

# Investment parameters
st.sidebar.header("Investment Parameters")
investment_amount = st.sidebar.number_input(
    "Investment Amount (£)",
    min_value=1000,
    max_value=10000000,
    value=100000,
    step=1000,
    help="Amount you plan to invest in gilts"
)

comparison_savings_rate = st.sidebar.slider(
    "Current Savings Account Rate (%)",
    min_value=0.0,
    max_value=10.0,
    value=4.5,
    step=0.1,
    help="Current gross interest rate on savings accounts for comparison"
)

# Data loading section
st.header("📊 UK Gilt Data")

# Data refresh button
col1, col2, col3 = st.columns([1, 1, 2])
with col1:
    if st.button("🔄 Refresh Gilt Data", type="primary"):
        st.session_state.gilt_data = None
        with st.spinner("Fetching latest gilt data..."):
            st.session_state.gilt_data = gilt_fetcher.get_gilt_data()
        st.success("Data refreshed!")

with col2:
    if st.button("📥 Load Sample Data"):
        st.session_state.gilt_data = gilt_fetcher.get_sample_data()
        st.info("Sample data loaded for demonstration")

# Load data if not already loaded
if st.session_state.gilt_data is None:
    with st.spinner("Loading gilt data..."):
        st.session_state.gilt_data = gilt_fetcher.get_gilt_data()

# Display gilt data
if st.session_state.gilt_data is not None and not st.session_state.gilt_data.empty:
    df = st.session_state.gilt_data.copy()
    
    # Calculate additional metrics
    df['Years to Maturity'] = df['Maturity Date'].apply(calculate_years_to_maturity)
    df['After-Tax Yield'] = df.apply(lambda row: tax_calc.calculate_after_tax_yield(
        row['Current Yield'], row['Years to Maturity'], row['Coupon Rate']
    ), axis=1)
    df['Equivalent Savings Rate'] = df['After-Tax Yield'] / (1 - 0.45)
    
    # Filter and sort options
    st.subheader("Filter Options")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        min_yield = st.slider("Minimum Yield (%)", 0.0, 10.0, 0.0, 0.1)
        max_yield = st.slider("Maximum Yield (%)", 0.0, 15.0, 15.0, 0.1)
    
    with col2:
        min_maturity = st.slider("Minimum Years to Maturity", 0.0, 50.0, 0.0, 0.5)
        max_maturity = st.slider("Maximum Years to Maturity", 0.0, 50.0, 50.0, 0.5)
    
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
    display_df = filtered_df[[
        'Name', 'Coupon Rate', 'Current Yield', 'After-Tax Yield', 
        'Equivalent Savings Rate', 'Maturity Date', 'Years to Maturity'
    ]].copy()
    
    # Format display columns
    display_df['Coupon Rate'] = display_df['Coupon Rate'].apply(lambda x: f"{x:.3f}%")
    display_df['Current Yield'] = display_df['Current Yield'].apply(lambda x: f"{x:.3f}%")
    display_df['After-Tax Yield'] = display_df['After-Tax Yield'].apply(lambda x: f"{x:.3f}%")
    display_df['Equivalent Savings Rate'] = display_df['Equivalent Savings Rate'].apply(lambda x: f"{x:.3f}%")
    display_df['Years to Maturity'] = display_df['Years to Maturity'].apply(lambda x: f"{x:.1f}")
    
    # Interactive table with selection
    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True
    )
    
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
        
        for idx, row in selected_data.iterrows():
            with st.expander(f"📋 {row['Name']} - Detailed Analysis"):
                col1, col2 = st.columns(2)
                
                with col1:
                    st.markdown("**Gilt Details:**")
                    st.write(f"• Coupon Rate: {row['Coupon Rate']:.3f}%")
                    st.write(f"• Current Yield: {row['Current Yield']:.3f}%")
                    st.write(f"• Maturity Date: {row['Maturity Date'].strftime('%d %B %Y')}")
                    st.write(f"• Years to Maturity: {row['Years to Maturity']:.1f}")
                    
                    # Calculate returns for investment amount
                    annual_income = investment_amount * (row['Coupon Rate'] / 100)
                    annual_tax = annual_income * 0.45
                    annual_net_income = annual_income - annual_tax
                    
                    st.markdown("**Annual Returns:**")
                    st.write(f"• Gross Income: {format_currency(annual_income)}")
                    st.write(f"• Tax (45%): {format_currency(annual_tax)}")
                    st.write(f"• Net Income: {format_currency(annual_net_income)}")
                
                with col2:
                    st.markdown("**Tax Comparison:**")
                    st.write(f"• After-Tax Yield: {row['After-Tax Yield']:.3f}%")
                    st.write(f"• Equivalent Savings Rate: {row['Equivalent Savings Rate']:.3f}%")
                    
                    # Compare with current savings rate
                    savings_after_tax = comparison_savings_rate * (1 - 0.45)
                    advantage = row['After-Tax Yield'] - savings_after_tax
                    
                    st.markdown("**vs Current Savings Account:**")
                    st.write(f"• Savings Rate: {comparison_savings_rate:.1f}%")
                    st.write(f"• Savings After-Tax: {savings_after_tax:.3f}%")
                    
                    if advantage > 0:
                        st.success(f"• Gilt Advantage: +{advantage:.3f}%")
                    else:
                        st.error(f"• Gilt Disadvantage: {advantage:.3f}%")
        
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
        
        # Add horizontal line for current savings rate
        fig.add_hline(
            y=comparison_savings_rate,
            line_dash="dash",
            line_color="red",
            annotation_text=f"Current Savings Rate: {comparison_savings_rate:.1f}%"
        )
        
        fig.update_layout(
            title="Gilt Yield Comparison",
            xaxis_title="Gilt",
            yaxis_title="Yield (%)",
            barmode='group',
            height=500
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Summary table
        st.subheader("📈 Summary Table")
        summary_df = selected_data[['Name', 'Current Yield', 'After-Tax Yield', 'Equivalent Savings Rate']].copy()
        summary_df['Savings Advantage'] = summary_df['After-Tax Yield'] - (comparison_savings_rate * (1 - 0.45))
        
        # Format summary table
        for col in ['Current Yield', 'After-Tax Yield', 'Equivalent Savings Rate', 'Savings Advantage']:
            summary_df[col] = summary_df[col].apply(lambda x: f"{x:.3f}%")
        
        st.dataframe(summary_df, use_container_width=True, hide_index=True)
        
        # Export functionality
        st.subheader("📤 Export Analysis")
        
        # Prepare export data
        export_data = selected_data.copy()
        export_data['Investment Amount'] = investment_amount
        export_data['Comparison Savings Rate'] = comparison_savings_rate
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
