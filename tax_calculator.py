import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional

class TaxCalculator:
    """
    Calculate tax implications for UK gilt investments
    Focused on additional rate taxpayers (45% tax band)
    """
    
    def __init__(self):
        # UK tax rates for 2025/26
        self.tax_rates = {
            'additional_rate': 0.45,
            'higher_rate': 0.40,
            'basic_rate': 0.20,
            'cgt_rate_higher': 0.20,
            'cgt_rate_basic': 0.10
        }
        
        # Personal Savings Allowance
        self.psa = {
            'additional_rate': 0,      # No PSA for additional rate taxpayers
            'higher_rate': 500,        # £500 PSA for higher rate taxpayers
            'basic_rate': 1000         # £1,000 PSA for basic rate taxpayers
        }
        
        # Current tax year thresholds
        self.thresholds = {
            'basic_rate_limit': 37700,
            'higher_rate_limit': 125140,
            'personal_allowance': 12570,
            'cgt_allowance': 3000
        }
    
    def calculate_after_tax_yield(self, current_yield: float, years_to_maturity: float, 
                                 coupon_rate: float, taxpayer_type: str = 'additional_rate',
                                 next_coupon_date: Optional[datetime] = None,
                                 remaining_coupons: int = None, 
                                 dirty_price: float = None, clean_price: float = None,
                                 coupon_dates: List[datetime] = None) -> float:
        """
        Calculate the after-tax yield for a gilt investment using actual coupon payment dates
        
        Args:
            current_yield: Current yield percentage
            years_to_maturity: Years until maturity
            coupon_rate: Annual coupon rate percentage
            taxpayer_type: Type of taxpayer (additional_rate, higher_rate, basic_rate)
            next_coupon_date: Next coupon payment date
            remaining_coupons: Number of remaining coupons
            dirty_price: Current dirty price (including accrued interest)
            clean_price: Current clean price (excluding accrued interest)
            coupon_dates: List of all future coupon payment dates
        
        Returns:
            After-tax yield percentage
        """
        
        # Get tax rate for the taxpayer type
        tax_rate = self.tax_rates[taxpayer_type]
        
        # If we have detailed coupon information, use present value calculation
        if coupon_dates and dirty_price and clean_price:
            return self._calculate_present_value_after_tax_yield(
                coupon_rate, dirty_price, clean_price, coupon_dates, tax_rate
            )
        
        # Fallback to simplified calculation
        # For gilts, only the coupon payments are taxable
        # Capital gains are exempt from CGT
        
        # Annual coupon income (taxable)
        annual_coupon_after_tax = coupon_rate * (1 - tax_rate)
        
        # Calculate capital appreciation (tax-free)
        # This is simplified - in reality, would need current price and par value
        capital_component = current_yield - coupon_rate
        
        # Adjust for timing of coupon payments if provided
        if next_coupon_date and remaining_coupons:
            # More accurate calculation considering actual payment timing
            # This is a simplified version - full implementation would discount each payment
            days_to_next_coupon = (next_coupon_date - datetime.now()).days
            coupon_timing_factor = max(0.95, 1 - (days_to_next_coupon / 365) * 0.05)
            annual_coupon_after_tax *= coupon_timing_factor
        
        # Total after-tax yield
        after_tax_yield = annual_coupon_after_tax + capital_component
        
        return after_tax_yield
    
    def _calculate_present_value_after_tax_yield(self, coupon_rate: float, dirty_price: float, 
                                               clean_price: float, coupon_dates: List[datetime], 
                                               tax_rate: float) -> float:
        """
        Calculate after-tax yield using present value of future cash flows with actual coupon dates
        
        Args:
            coupon_rate: Annual coupon rate percentage
            dirty_price: Current dirty price (including accrued interest)
            clean_price: Current clean price (excluding accrued interest)
            coupon_dates: List of future coupon payment dates
            tax_rate: Tax rate to apply to coupon income
        
        Returns:
            After-tax yield percentage
        """
        
        if not coupon_dates:
            return 0.0
            
        # Assume £100 face value for calculations
        face_value = 100.0
        today = datetime.now()
        
        # Calculate semi-annual coupon payment (most UK gilts pay twice yearly)
        semi_annual_coupon = (coupon_rate / 2)
        after_tax_coupon = semi_annual_coupon * (1 - tax_rate)
        
        # Sort coupon dates to ensure chronological order
        future_coupon_dates = [cd for cd in coupon_dates if cd > today]
        future_coupon_dates.sort()
        
        if not future_coupon_dates:
            return 0.0
            
        # Calculate total after-tax cash flows
        total_after_tax_coupons = 0.0
        
        # Sum all future coupon payments (after tax)
        for coupon_date in future_coupon_dates:
            total_after_tax_coupons += after_tax_coupon
        
        # Principal repayment at maturity (tax-free)
        maturity_date = max(future_coupon_dates)
        principal_repayment = face_value  # Tax-free return of capital
        
        # Total after-tax cash flows
        total_after_tax_cash_flows = total_after_tax_coupons + principal_repayment
        
        # Calculate years to maturity
        days_to_maturity = (maturity_date - today).days
        years_to_maturity = days_to_maturity / 365.25
        
        # Calculate after-tax yield to maturity using IRR method with actual payment dates
        if years_to_maturity > 0 and dirty_price > 0:
            # Use Newton-Raphson method to find IRR (Internal Rate of Return)
            # This gives us the exact yield considering actual coupon payment timing
            
            def npv_function(rate):
                """Calculate NPV for a given discount rate"""
                npv = -dirty_price  # Initial investment (negative cash flow)
                
                # Add present value of each coupon payment
                for coupon_date in future_coupon_dates:
                    days_to_payment = (coupon_date - today).days
                    years_to_payment = days_to_payment / 365.25
                    
                    if years_to_payment > 0:
                        pv_coupon = after_tax_coupon / ((1 + rate) ** years_to_payment)
                        npv += pv_coupon
                
                # Add present value of principal repayment
                pv_principal = principal_repayment / ((1 + rate) ** years_to_maturity)
                npv += pv_principal
                
                return npv
            
            def npv_derivative(rate):
                """Calculate derivative of NPV function"""
                derivative = 0.0
                
                # Derivative of coupon payments
                for coupon_date in future_coupon_dates:
                    days_to_payment = (coupon_date - today).days
                    years_to_payment = days_to_payment / 365.25
                    
                    if years_to_payment > 0:
                        derivative -= (years_to_payment * after_tax_coupon) / ((1 + rate) ** (years_to_payment + 1))
                
                # Derivative of principal repayment
                derivative -= (years_to_maturity * principal_repayment) / ((1 + rate) ** (years_to_maturity + 1))
                
                return derivative
            
            # Newton-Raphson method to find IRR
            rate = 0.05  # Initial guess (5%)
            tolerance = 1e-6
            max_iterations = 100
            
            for i in range(max_iterations):
                npv = npv_function(rate)
                if abs(npv) < tolerance:
                    break
                
                derivative = npv_derivative(rate)
                if abs(derivative) < tolerance:
                    break
                
                rate = rate - npv / derivative
                
                # Keep rate within reasonable bounds
                rate = max(-0.5, min(0.5, rate))
            
            after_tax_yield = rate * 100
        else:
            after_tax_yield = 0.0
        
        return max(0.0, after_tax_yield)
    
    def get_detailed_cash_flow_breakdown(self, coupon_rate: float, dirty_price: float, 
                                       coupon_dates: List[datetime], 
                                       taxpayer_type: str = 'additional_rate') -> dict:
        """
        Get detailed breakdown of cash flows and tax calculations
        
        Args:
            coupon_rate: Annual coupon rate percentage
            dirty_price: Current dirty price
            coupon_dates: List of future coupon payment dates
            taxpayer_type: Type of taxpayer
            
        Returns:
            Dictionary with detailed cash flow breakdown
        """
        
        tax_rate = self.tax_rates[taxpayer_type]
        face_value = 100.0
        today = datetime.now()
        
        # Calculate coupon payments
        semi_annual_coupon = coupon_rate / 2
        after_tax_coupon = semi_annual_coupon * (1 - tax_rate)
        
        # Future coupon dates
        future_coupon_dates = [cd for cd in coupon_dates if cd > today]
        future_coupon_dates.sort()
        
        # Build cash flow breakdown
        cash_flows = []
        total_gross_coupons = 0
        total_tax_paid = 0
        total_net_coupons = 0
        
        for coupon_date in future_coupon_dates:
            days_to_payment = (coupon_date - today).days
            years_to_payment = days_to_payment / 365.25
            
            gross_coupon = semi_annual_coupon
            tax_on_coupon = gross_coupon * tax_rate
            net_coupon = gross_coupon - tax_on_coupon
            
            total_gross_coupons += gross_coupon
            total_tax_paid += tax_on_coupon
            total_net_coupons += net_coupon
            
            cash_flows.append({
                'date': coupon_date,
                'days_to_payment': days_to_payment,
                'years_to_payment': years_to_payment,
                'gross_coupon': gross_coupon,
                'tax_paid': tax_on_coupon,
                'net_coupon': net_coupon
            })
        
        # Principal repayment
        maturity_date = max(future_coupon_dates) if future_coupon_dates else today
        days_to_maturity = (maturity_date - today).days
        years_to_maturity = days_to_maturity / 365.25
        
        # Capital gain/loss (tax-free)
        capital_gain_loss = face_value - dirty_price
        
        return {
            'purchase_price': dirty_price,
            'face_value': face_value,
            'coupon_rate': coupon_rate,
            'tax_rate': tax_rate * 100,
            'cash_flows': cash_flows,
            'total_gross_coupons': total_gross_coupons,
            'total_tax_paid': total_tax_paid,
            'total_net_coupons': total_net_coupons,
            'principal_repayment': face_value,
            'capital_gain_loss': capital_gain_loss,
            'capital_gain_tax': 0.0,  # Gilts are CGT-exempt
            'total_net_return': total_net_coupons + capital_gain_loss,
            'years_to_maturity': years_to_maturity,
            'number_of_coupons': len(cash_flows)
        }
    
    def calculate_precise_after_tax_yield(self, gilt_data: Dict, coupon_dates: List[datetime],
                                        taxpayer_type: str = 'additional_rate') -> Dict:
        """
        Calculate precise after-tax yield considering actual coupon payment dates
        
        Args:
            gilt_data: Dictionary containing gilt information
            coupon_dates: List of future coupon payment dates
            taxpayer_type: Type of taxpayer
        
        Returns:
            Dictionary with detailed yield calculations
        """
        
        tax_rate = self.tax_rates[taxpayer_type]
        current_price = gilt_data['Price']
        coupon_rate = gilt_data['Coupon Rate']
        maturity_date = gilt_data['Maturity Date']
        
        # Calculate present value of after-tax coupon payments
        coupon_payment = coupon_rate / 2  # Semi-annual payment
        coupon_after_tax = coupon_payment * (1 - tax_rate)
        
        present_value_coupons = 0
        discount_rate = 0.04  # Risk-free rate for discounting
        
        today = datetime.now()
        
        for payment_date in coupon_dates:
            if isinstance(payment_date, datetime):
                days_to_payment = (payment_date - today).days
            else:
                days_to_payment = (datetime.combine(payment_date, datetime.min.time()) - today).days
            
            years_to_payment = days_to_payment / 365.25
            
            if years_to_payment > 0:
                # Discount future coupon payments
                discount_factor = (1 + discount_rate) ** (-years_to_payment)
                present_value_coupons += coupon_after_tax * discount_factor
        
        # Capital gain/loss at maturity (tax-free)
        if isinstance(maturity_date, datetime):
            days_to_maturity = (maturity_date - today).days
        else:
            days_to_maturity = (datetime.combine(maturity_date, datetime.min.time()) - today).days
        
        years_to_maturity = days_to_maturity / 365.25
        
        if years_to_maturity > 0:
            # Assuming redemption at par (100)
            capital_gain = 100 - current_price
            discount_factor = (1 + discount_rate) ** (-years_to_maturity)
            present_value_capital = capital_gain * discount_factor
        else:
            present_value_capital = 0
        
        # Total present value
        total_present_value = present_value_coupons + present_value_capital
        
        # Calculate yield to maturity after tax
        if years_to_maturity > 0:
            after_tax_yield = ((total_present_value / current_price) ** (1/years_to_maturity) - 1) * 100
        else:
            after_tax_yield = 0
        
        return {
            'after_tax_yield': after_tax_yield,
            'present_value_coupons': present_value_coupons,
            'present_value_capital': present_value_capital,
            'total_present_value': total_present_value,
            'years_to_maturity': years_to_maturity,
            'remaining_coupon_payments': len([d for d in coupon_dates if 
                                           (d if isinstance(d, datetime) else datetime.combine(d, datetime.min.time())) > today])
        }
    
    def calculate_equivalent_savings_rate(self, after_tax_yield: float, 
                                        taxpayer_type: str = 'additional_rate') -> float:
        """
        Calculate the equivalent gross savings account rate needed to match gilt return
        
        Args:
            after_tax_yield: After-tax yield from gilt
            taxpayer_type: Type of taxpayer
        
        Returns:
            Required gross savings rate to match gilt return
        """
        
        tax_rate = self.tax_rates[taxpayer_type]
        psa = self.psa[taxpayer_type]
        
        # For additional rate taxpayers, PSA is £0
        # So all savings income is taxed at 45%
        
        if taxpayer_type == 'additional_rate':
            # All savings income taxed at 45%
            equivalent_rate = after_tax_yield / (1 - tax_rate)
        else:
            # Would need to account for PSA for other taxpayer types
            # This is simplified for additional rate focus
            equivalent_rate = after_tax_yield / (1 - tax_rate)
        
        return equivalent_rate
    
    def calculate_total_return(self, investment_amount: float, gilt_data: Dict, 
                             taxpayer_type: str = 'additional_rate') -> Dict:
        """
        Calculate total return for a gilt investment
        
        Args:
            investment_amount: Amount invested
            gilt_data: Dictionary containing gilt information
            taxpayer_type: Type of taxpayer
        
        Returns:
            Dictionary with return calculations
        """
        
        coupon_rate = gilt_data['Coupon Rate']
        current_yield = gilt_data['Current Yield']
        years_to_maturity = gilt_data['Years to Maturity']
        current_price = gilt_data['Price']
        
        # Calculate annual coupon payments
        annual_coupon = investment_amount * (coupon_rate / 100)
        
        # Calculate tax on coupon payments
        tax_rate = self.tax_rates[taxpayer_type]
        annual_tax = annual_coupon * tax_rate
        annual_net_coupon = annual_coupon - annual_tax
        
        # Calculate total coupon income over investment period
        total_coupon_gross = annual_coupon * years_to_maturity
        total_coupon_tax = annual_tax * years_to_maturity
        total_coupon_net = annual_net_coupon * years_to_maturity
        
        # Calculate capital gain/loss at maturity (tax-free for gilts)
        # Assuming redemption at par (100)
        capital_gain = investment_amount * ((100 - current_price) / 100)
        
        # Total return
        total_return_gross = total_coupon_gross + capital_gain
        total_return_net = total_coupon_net + capital_gain  # Capital gain is tax-free
        
        return {
            'investment_amount': investment_amount,
            'annual_coupon_gross': annual_coupon,
            'annual_coupon_tax': annual_tax,
            'annual_coupon_net': annual_net_coupon,
            'total_coupon_gross': total_coupon_gross,
            'total_coupon_tax': total_coupon_tax,
            'total_coupon_net': total_coupon_net,
            'capital_gain': capital_gain,
            'total_return_gross': total_return_gross,
            'total_return_net': total_return_net,
            'effective_yield': (total_return_net / investment_amount) * 100 / years_to_maturity
        }
    
    def compare_with_savings(self, gilt_return: Dict, savings_rate: float, 
                           years: float, taxpayer_type: str = 'additional_rate') -> Dict:
        """
        Compare gilt investment with savings account
        
        Args:
            gilt_return: Return dictionary from calculate_total_return
            savings_rate: Gross savings account rate
            years: Investment period in years
            taxpayer_type: Type of taxpayer
        
        Returns:
            Comparison dictionary
        """
        
        investment_amount = gilt_return['investment_amount']
        tax_rate = self.tax_rates[taxpayer_type]
        
        # Calculate savings account returns
        savings_gross_annual = investment_amount * (savings_rate / 100)
        savings_tax_annual = savings_gross_annual * tax_rate
        savings_net_annual = savings_gross_annual - savings_tax_annual
        
        # Total savings returns
        savings_total_gross = savings_gross_annual * years
        savings_total_tax = savings_tax_annual * years
        savings_total_net = savings_net_annual * years
        
        # Calculate advantage
        gilt_advantage = gilt_return['total_return_net'] - savings_total_net
        gilt_advantage_percentage = (gilt_advantage / investment_amount) * 100
        
        return {
            'savings_rate': savings_rate,
            'savings_annual_gross': savings_gross_annual,
            'savings_annual_tax': savings_tax_annual,
            'savings_annual_net': savings_net_annual,
            'savings_total_gross': savings_total_gross,
            'savings_total_tax': savings_total_tax,
            'savings_total_net': savings_total_net,
            'gilt_advantage_amount': gilt_advantage,
            'gilt_advantage_percentage': gilt_advantage_percentage,
            'gilt_total_net': gilt_return['total_return_net'],
            'gilt_effective_yield': gilt_return['effective_yield'],
            'savings_effective_yield': (savings_total_net / investment_amount) * 100 / years
        }
    
    def calculate_breakeven_savings_rate(self, gilt_data: Dict, years_to_maturity: float,
                                       taxpayer_type: str = 'additional_rate') -> float:
        """
        Calculate the savings rate needed to match gilt returns
        
        Args:
            gilt_data: Dictionary containing gilt information
            years_to_maturity: Years until maturity
            taxpayer_type: Type of taxpayer
        
        Returns:
            Breakeven savings rate
        """
        
        after_tax_yield = self.calculate_after_tax_yield(
            gilt_data['Current Yield'], 
            years_to_maturity, 
            gilt_data['Coupon Rate'],
            taxpayer_type
        )
        
        return self.calculate_equivalent_savings_rate(after_tax_yield, taxpayer_type)
    
    def get_tax_explanation(self, taxpayer_type: str = 'additional_rate') -> str:
        """
        Get explanation of tax treatment for the taxpayer type
        
        Args:
            taxpayer_type: Type of taxpayer
        
        Returns:
            Explanation string
        """
        
        if taxpayer_type == 'additional_rate':
            return f"""
            **Additional Rate Taxpayer (45% tax band):**
            
            **Gilt Taxation:**
            • Coupon payments: Taxed at 45% income tax rate
            • Capital gains: Completely exempt from CGT
            • Personal Savings Allowance: £0 (no tax-free savings income)
            
            **Savings Account Taxation:**
            • All interest: Taxed at 45% income tax rate
            • No tax-free allowance available
            
            **Key Advantage:**
            Gilts benefit from CGT exemption, making them particularly attractive
            for higher rate taxpayers compared to other investments.
            """
        
        # Add explanations for other taxpayer types if needed
        return "Tax explanation not available for this taxpayer type."
