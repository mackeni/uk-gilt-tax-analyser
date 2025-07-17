import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Union, Optional

def format_currency(amount: float, currency: str = "£") -> str:
    """
    Format currency amount with appropriate symbols and commas
    
    Args:
        amount: Numeric amount
        currency: Currency symbol
    
    Returns:
        Formatted currency string
    """
    if pd.isna(amount):
        return "N/A"
    
    if abs(amount) >= 1000000:
        return f"{currency}{amount/1000000:.2f}M"
    elif abs(amount) >= 1000:
        return f"{currency}{amount/1000:.1f}K"
    else:
        return f"{currency}{amount:,.2f}"

def format_percentage(percentage: float, decimal_places: int = 2) -> str:
    """
    Format percentage with appropriate decimal places
    
    Args:
        percentage: Percentage value
        decimal_places: Number of decimal places
    
    Returns:
        Formatted percentage string
    """
    if pd.isna(percentage):
        return "N/A"
    
    return f"{percentage:.{decimal_places}f}%"

def calculate_years_to_maturity(maturity_date: datetime, 
                               reference_date: Optional[datetime] = None) -> float:
    """
    Calculate years to maturity from reference date
    
    Args:
        maturity_date: Maturity date of the gilt
        reference_date: Reference date (defaults to today)
    
    Returns:
        Years to maturity as float
    """
    if reference_date is None:
        reference_date = datetime.now()
    
    if pd.isna(maturity_date):
        return np.nan
    
    # Ensure maturity_date is datetime
    if isinstance(maturity_date, str):
        maturity_date = pd.to_datetime(maturity_date)
    
    time_difference = maturity_date - reference_date
    years = time_difference.days / 365.25
    
    return max(0, years)  # Ensure non-negative

def calculate_accrued_interest(coupon_rate: float, last_payment_date: datetime,
                             settlement_date: Optional[datetime] = None) -> float:
    """
    Calculate accrued interest for a gilt
    
    Args:
        coupon_rate: Annual coupon rate as percentage
        last_payment_date: Date of last coupon payment
        settlement_date: Settlement date (defaults to today)
    
    Returns:
        Accrued interest amount
    """
    if settlement_date is None:
        settlement_date = datetime.now()
    
    days_since_payment = (settlement_date - last_payment_date).days
    days_in_period = 365  # Simplified - actual calculation would consider payment frequency
    
    accrued = (coupon_rate / 100) * (days_since_payment / days_in_period)
    
    return accrued

def validate_investment_amount(amount: float, min_amount: float = 100,
                             max_amount: float = 10000000) -> bool:
    """
    Validate investment amount is within reasonable bounds
    
    Args:
        amount: Investment amount to validate
        min_amount: Minimum allowed amount
        max_amount: Maximum allowed amount
    
    Returns:
        True if valid, False otherwise
    """
    if pd.isna(amount):
        return False
    
    return min_amount <= amount <= max_amount

def calculate_compound_return(principal: float, rate: float, years: float,
                            compounding_frequency: int = 1) -> float:
    """
    Calculate compound return
    
    Args:
        principal: Initial investment amount
        rate: Annual interest rate (as decimal)
        years: Number of years
        compounding_frequency: Number of times interest compounds per year
    
    Returns:
        Final amount after compound interest
    """
    if compounding_frequency == 0:
        # Continuous compounding
        return principal * np.exp(rate * years)
    else:
        return principal * (1 + rate/compounding_frequency) ** (compounding_frequency * years)

def parse_gilt_name(gilt_name: str) -> dict:
    """
    Parse gilt name to extract coupon rate and maturity year
    
    Args:
        gilt_name: Name of the gilt (e.g., "Treasury 4% 2030")
    
    Returns:
        Dictionary with parsed information
    """
    import re
    
    # Pattern to match gilt names like "Treasury 4% 2030" or "Treasury 4.25% 2030"
    pattern = r'Treasury\s+([\d.]+)%\s+(\d{4})'
    match = re.search(pattern, gilt_name)
    
    if match:
        coupon_rate = float(match.group(1))
        maturity_year = int(match.group(2))
        return {
            'coupon_rate': coupon_rate,
            'maturity_year': maturity_year,
            'is_treasury': True
        }
    
    return {
        'coupon_rate': None,
        'maturity_year': None,
        'is_treasury': False
    }

def calculate_duration(coupon_rate: float, years_to_maturity: float,
                      yield_to_maturity: float) -> float:
    """
    Calculate modified duration of a gilt
    
    Args:
        coupon_rate: Annual coupon rate (as percentage)
        years_to_maturity: Years until maturity
        yield_to_maturity: Yield to maturity (as percentage)
    
    Returns:
        Modified duration
    """
    # Simplified duration calculation
    # In practice, this would be more complex for semi-annual payments
    
    if yield_to_maturity == 0:
        return years_to_maturity
    
    ytm_decimal = yield_to_maturity / 100
    coupon_decimal = coupon_rate / 100
    
    # Macaulay duration approximation
    macaulay_duration = (1 + ytm_decimal) / ytm_decimal - \
                       (1 + ytm_decimal + years_to_maturity * (coupon_decimal - ytm_decimal)) / \
                       (coupon_decimal * ((1 + ytm_decimal) ** years_to_maturity - 1) + ytm_decimal)
    
    # Modified duration
    modified_duration = macaulay_duration / (1 + ytm_decimal)
    
    return modified_duration

def get_business_days(start_date: datetime, end_date: datetime) -> int:
    """
    Calculate number of business days between two dates
    
    Args:
        start_date: Start date
        end_date: End date
    
    Returns:
        Number of business days
    """
    return len(pd.bdate_range(start_date, end_date))

def format_date(date: datetime, format_string: str = "%d %B %Y") -> str:
    """
    Format date for display
    
    Args:
        date: Date to format
        format_string: Format string
    
    Returns:
        Formatted date string
    """
    if pd.isna(date):
        return "N/A"
    
    return date.strftime(format_string)

def calculate_tax_efficiency_score(after_tax_yield: float, equivalent_savings_rate: float,
                                 current_savings_rate: float) -> float:
    """
    Calculate a tax efficiency score for comparison
    
    Args:
        after_tax_yield: After-tax yield from gilt
        equivalent_savings_rate: Equivalent gross savings rate
        current_savings_rate: Current market savings rate
    
    Returns:
        Tax efficiency score (higher is better)
    """
    if current_savings_rate == 0:
        return float('inf')
    
    # Score based on how much better gilt is than current savings rates
    savings_after_tax = current_savings_rate * 0.55  # Assuming 45% tax
    advantage = after_tax_yield - savings_after_tax
    
    # Normalize to 0-100 scale
    score = min(100, max(0, 50 + (advantage * 10)))
    
    return score

def export_to_csv(data: pd.DataFrame, filename: str) -> str:
    """
    Export dataframe to CSV format
    
    Args:
        data: DataFrame to export
        filename: Filename for the export
    
    Returns:
        CSV string
    """
    return data.to_csv(index=False)

def get_market_status() -> dict:
    """
    Get current market status information
    
    Returns:
        Dictionary with market status
    """
    current_time = datetime.now()
    
    # London market hours: 8:00 AM to 4:30 PM BST
    market_open = current_time.replace(hour=8, minute=0, second=0, microsecond=0)
    market_close = current_time.replace(hour=16, minute=30, second=0, microsecond=0)
    
    is_weekday = current_time.weekday() < 5  # Monday = 0, Sunday = 6
    is_market_hours = market_open <= current_time <= market_close
    
    return {
        'is_open': is_weekday and is_market_hours,
        'next_open': market_open + timedelta(days=1) if not is_weekday or current_time > market_close else market_open,
        'last_close': market_close if current_time > market_close else market_close - timedelta(days=1),
        'status': 'Open' if is_weekday and is_market_hours else 'Closed'
    }
