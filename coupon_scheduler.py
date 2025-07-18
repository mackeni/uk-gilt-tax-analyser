import pandas as pd
from datetime import datetime, date, timedelta
from typing import List, Dict, Tuple
import calendar
from functools import lru_cache

class CouponScheduler:
    """
    Generate detailed coupon payment schedules for UK gilts based on actual market conventions
    """
    
    def __init__(self):
        # UK gilt coupon payment conventions
        self.uk_gilt_conventions = {
            'frequency': 2,  # Semi-annual payments
            'day_count': 'ACT/ACT',  # Actual/Actual day count
            'business_day_convention': 'Modified Following'
        }
    
    @lru_cache(maxsize=64)
    def _generate_coupon_schedule_cached(self, maturity_date_str: str, coupon_rate: float, face_value: float) -> List[Dict]:
        """Cached version of coupon schedule generation"""
        maturity_date = datetime.fromisoformat(maturity_date_str).date()
        
        # No coupons for zero-coupon gilts
        if coupon_rate == 0:
            return []
        
        # Calculate semi-annual coupon amount per £100 nominal
        semi_annual_coupon = (coupon_rate / 2.0)
        
        # Generate payment dates
        payment_dates = self._generate_payment_dates(maturity_date)
        
        # Create detailed schedule
        schedule = []
        today = date.today()
        
        for i, payment_date in enumerate(payment_dates):
            if payment_date >= today:
                # Check if this is the final payment (includes principal)
                is_final_payment = payment_date == maturity_date
                
                payment_info = {
                    'payment_date': payment_date,
                    'coupon_amount': semi_annual_coupon,
                    'principal_amount': 100.0 if is_final_payment else 0.0,  # Per £100 nominal
                    'total_payment': semi_annual_coupon + (100.0 if is_final_payment else 0.0),
                    'days_to_payment': (payment_date - today).days,
                    'period_number': i + 1,
                    'is_final': is_final_payment
                }
                
                schedule.append(payment_info)
        
        return schedule

    def generate_coupon_schedule(self, gilt_info: Dict) -> List[Dict]:
        """
        Generate complete coupon payment schedule for a gilt
        
        Args:
            gilt_info: Dictionary containing gilt information
            
        Returns:
            List of dictionaries with coupon payment details
        """
        
        maturity_date = gilt_info['maturity_date']
        coupon_rate = gilt_info['coupon_rate']
        face_value = gilt_info.get('face_value', 100.0)
        
        # Convert to date object if needed
        if isinstance(maturity_date, str):
            maturity_date = pd.to_datetime(maturity_date).date()
        elif isinstance(maturity_date, pd.Timestamp):
            maturity_date = maturity_date.date()
        
        # Use cached version for efficiency
        return self._generate_coupon_schedule_cached(
            maturity_date.isoformat(), 
            coupon_rate, 
            face_value
        )
    
    def _generate_payment_dates(self, maturity_date: date) -> List[date]:
        """
        Generate coupon payment dates based on UK gilt conventions
        
        Args:
            maturity_date: Maturity date of the gilt
            
        Returns:
            List of payment dates
        """
        
        payment_dates = []
        
        # Determine payment months based on maturity month
        # UK gilts typically follow these patterns:
        if maturity_date.month in [3, 9]:  # March/September
            payment_months = [3, 9]
        elif maturity_date.month in [6, 12]:  # June/December
            payment_months = [6, 12]
        elif maturity_date.month in [1, 7]:  # January/July
            payment_months = [1, 7]
        elif maturity_date.month in [4, 10]:  # April/October
            payment_months = [4, 10]
        elif maturity_date.month in [5, 11]:  # May/November
            payment_months = [5, 11]
        else:  # February, August - less common
            payment_months = [2, 8] if maturity_date.month == 2 else [8, 2]
        
        # Generate dates from current year to maturity year
        current_year = date.today().year
        maturity_year = maturity_date.year
        
        for year in range(current_year, maturity_year + 1):
            for month in payment_months:
                try:
                    # Try to use same day as maturity
                    payment_date = date(year, month, maturity_date.day)
                    
                    # Adjust for business day convention if needed
                    payment_date = self._adjust_for_business_day(payment_date)
                    
                    # Only include dates up to maturity and not in the past
                    if payment_date <= maturity_date and payment_date >= date.today():
                        payment_dates.append(payment_date)
                        
                except ValueError:
                    # Handle cases where day doesn't exist in month (e.g., Feb 31)
                    # Use last day of month
                    last_day = calendar.monthrange(year, month)[1]
                    payment_date = date(year, month, min(maturity_date.day, last_day))
                    payment_date = self._adjust_for_business_day(payment_date)
                    
                    if payment_date <= maturity_date and payment_date >= date.today():
                        payment_dates.append(payment_date)
        
        return sorted(list(set(payment_dates)))  # Remove duplicates and sort
    
    def _adjust_for_business_day(self, payment_date: date) -> date:
        """
        Adjust payment date for business day convention (Modified Following)
        
        Args:
            payment_date: Original payment date
            
        Returns:
            Adjusted payment date
        """
        
        # Simple implementation - move to next business day if weekend
        while payment_date.weekday() >= 5:  # Saturday = 5, Sunday = 6
            payment_date = payment_date + timedelta(days=1)
        
        return payment_date
    
    def calculate_after_tax_cash_flows(self, schedule: List[Dict], tax_rate: float = 0.45) -> List[Dict]:
        """
        Calculate after-tax cash flows for each payment in the schedule
        
        Args:
            schedule: Coupon payment schedule
            tax_rate: Tax rate to apply to coupon income
            
        Returns:
            Schedule with after-tax calculations
        """
        
        enhanced_schedule = []
        
        for payment in schedule:
            # Tax on coupon income
            coupon_tax = payment['coupon_amount'] * tax_rate
            after_tax_coupon = payment['coupon_amount'] - coupon_tax
            
            # Principal repayment is tax-free
            after_tax_principal = payment['principal_amount']
            
            # Total after-tax cash flow
            after_tax_total = after_tax_coupon + after_tax_principal
            
            enhanced_payment = payment.copy()
            enhanced_payment.update({
                'coupon_tax': coupon_tax,
                'after_tax_coupon': after_tax_coupon,
                'after_tax_principal': after_tax_principal,
                'after_tax_total': after_tax_total
            })
            
            enhanced_schedule.append(enhanced_payment)
        
        return enhanced_schedule
    
    def get_schedule_summary(self, schedule: List[Dict]) -> Dict:
        """
        Get summary statistics for the coupon schedule
        
        Args:
            schedule: Enhanced coupon payment schedule
            
        Returns:
            Dictionary with summary statistics
        """
        
        if not schedule:
            return {}
        
        total_gross_coupons = sum(p['coupon_amount'] for p in schedule)
        total_coupon_tax = sum(p.get('coupon_tax', 0) for p in schedule)
        total_after_tax_coupons = sum(p.get('after_tax_coupon', 0) for p in schedule)
        total_principal = sum(p['principal_amount'] for p in schedule)
        total_after_tax_cash_flows = sum(p.get('after_tax_total', 0) for p in schedule)
        
        return {
            'number_of_payments': len(schedule),
            'first_payment_date': schedule[0]['payment_date'],
            'final_payment_date': schedule[-1]['payment_date'],
            'total_gross_coupons': total_gross_coupons,
            'total_coupon_tax': total_coupon_tax,
            'total_after_tax_coupons': total_after_tax_coupons,
            'total_principal': total_principal,
            'total_after_tax_cash_flows': total_after_tax_cash_flows,
            'average_days_between_payments': sum(p['days_to_payment'] for p in schedule) / len(schedule)
        }