import pandas as pd
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import time
import streamlit as st
import re
from bs4 import BeautifulSoup
from functools import lru_cache

class GiltDataFetcher:
    """Fetches UK gilt data from various sources"""
    
    def __init__(self):
        self.base_urls = {
            'dmo': 'https://www.dmo.gov.uk/data/',
            'tradeweb': 'https://www.tradeweb.com/',
            'dividenddata': 'https://www.dividenddata.co.uk/uk-gilts-prices-yields.py'
        }
        self.max_years_default = 3  # Default maximum maturity filter
    
    @st.cache_data(ttl=300, hash_funcs={type(None): lambda _: None})  # Cache for 5 minutes
    def get_gilt_data(_self) -> pd.DataFrame:
        """
        Fetch current gilt data from available sources
        """
        try:
            # Try to get real data from DividendData first
            df = _self._fetch_from_dividenddata()
            if df is not None and not df.empty:
                return df
            
            # Try DMO as fallback
            df = _self._fetch_from_dmo()
            if df is not None and not df.empty:
                return df
            
            # If real data fails, return empty dataframe
            st.error("Unable to fetch real-time data. Please check your internet connection or try again later.")
            return pd.DataFrame()
            
        except Exception as e:
            st.error(f"Error fetching gilt data: {str(e)}")
            return pd.DataFrame()
    
    def _fetch_from_dividenddata(self) -> Optional[pd.DataFrame]:
        """
        Fetch data from DividendData website
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(self.base_urls['dividenddata'], headers=headers, timeout=10)
            response.raise_for_status()
            
            # For now, since the direct scraping isn't working, return None
            # This will fallback to sample data
            return None
                
        except Exception as e:
            print(f"DividendData fetch error: {e}")
            return None
    
    def _parse_maturity_date(self, date_str: str) -> datetime:
        """
        Parse maturity date from various formats
        """
        try:
            # Handle formats like "07-Sep-2025" or "22-Oct-2025"
            if '-' in date_str:
                return datetime.strptime(date_str, '%d-%b-%Y')
            
            # Handle other formats
            date_patterns = [
                '%d %b %Y',
                '%d %B %Y',
                '%Y-%m-%d',
                '%d/%m/%Y'
            ]
            
            for pattern in date_patterns:
                try:
                    return datetime.strptime(date_str, pattern)
                except ValueError:
                    continue
            
            # Default to a future date if parsing fails
            return datetime.now() + timedelta(days=365)
            
        except Exception:
            return datetime.now() + timedelta(days=365)
    
    def _fetch_from_dmo(self) -> Optional[pd.DataFrame]:
        """
        Attempt to fetch data from UK DMO
        """
        try:
            # This would typically connect to DMO API or scrape data
            # For now, we'll simulate the structure and return sample data
            # In a real implementation, this would parse DMO's gilt data
            
            # Simulate API delay
            time.sleep(1)
            
            # Return None to indicate real data fetch failed
            return None
            
        except Exception as e:
            print(f"DMO fetch error: {e}")
            return None
    

    
    @lru_cache(maxsize=128)
    def _calculate_accrued_interest_cached(self, coupon_rate, maturity_date_str):
        """Cached version of accrued interest calculation"""
        try:
            maturity_date = datetime.fromisoformat(maturity_date_str).date()
            
            # UK gilts typically pay semi-annually
            # Calculate the last coupon date before today
            today = datetime.now().date()
            
            # Find the last coupon payment date
            # UK gilts typically pay on the same day and month as maturity, 6 months earlier
            last_coupon_date = self._get_last_coupon_date(maturity_date, today)
            next_coupon_date = self._get_next_coupon_date(maturity_date, today)
            
            # Calculate days since last coupon payment
            days_since_last_coupon = (today - last_coupon_date).days
            days_in_coupon_period = (next_coupon_date - last_coupon_date).days
            
            # Calculate accrued interest using actual day count
            # UK gilts use Actual/Actual day count convention
            accrued_fraction = days_since_last_coupon / days_in_coupon_period
            
            # Semi-annual coupon payment per £100 nominal (not percentage)
            semi_annual_coupon_pounds = coupon_rate / 2  # This gives us £X per £100
            
            # Accrued interest in pounds per £100 nominal
            accrued_interest_pounds = semi_annual_coupon_pounds * accrued_fraction
            
            return accrued_interest_pounds
            
        except Exception as e:
            # Fallback to simplified calculation if date parsing fails
            # Conservative estimate: 25% of the way through a 6-month period
            return (coupon_rate / 2) * 0.25  # Conservative estimate in pounds per £100

    def _calculate_accrued_interest(self, row):
        """Calculate accrued interest based on days since last coupon payment"""
        try:
            coupon_rate = row['Coupon Rate']
            maturity_date = row['Maturity Date']
            
            # Convert to string for caching
            if isinstance(maturity_date, datetime):
                maturity_date_str = maturity_date.isoformat()
            else:
                maturity_date_str = maturity_date.isoformat()
            
            return self._calculate_accrued_interest_cached(coupon_rate, maturity_date_str)
            
        except Exception as e:
            # Fallback to simplified calculation if date parsing fails
            # Conservative estimate: 25% of the way through a 6-month period
            return (row['Coupon Rate'] / 2) * 0.25  # Conservative estimate in pounds per £100
    
    def _get_last_coupon_date(self, maturity_date, today):
        """Get the last coupon payment date before today"""
        # UK gilts typically pay on the same day and month as maturity
        year = today.year
        month = maturity_date.month
        day = maturity_date.day
        
        # Try current year first
        try:
            candidate_date = datetime(year, month, day).date()
            if candidate_date <= today:
                return candidate_date
        except ValueError:
            # Handle cases like Feb 29 in non-leap years
            candidate_date = datetime(year, month, min(day, 28)).date()
            if candidate_date <= today:
                return candidate_date
        
        # Try 6 months earlier
        try:
            if month <= 6:
                candidate_date = datetime(year - 1, month + 6, day).date()
            else:
                candidate_date = datetime(year, month - 6, day).date()
            if candidate_date <= today:
                return candidate_date
        except ValueError:
            candidate_date = datetime(year if month > 6 else year - 1, 
                                    (month - 6) if month > 6 else (month + 6), 
                                    min(day, 28)).date()
            if candidate_date <= today:
                return candidate_date
        
        # Fallback: 3 months ago
        return today - timedelta(days=90)
    
    def _get_next_coupon_date(self, maturity_date, today):
        """Get the next coupon payment date after today"""
        # UK gilts typically pay on the same day and month as maturity
        year = today.year
        month = maturity_date.month
        day = maturity_date.day
        
        # Try current year first
        try:
            candidate_date = datetime(year, month, day).date()
            if candidate_date > today:
                return candidate_date
        except ValueError:
            # Handle cases like Feb 29 in non-leap years
            candidate_date = datetime(year, month, min(day, 28)).date()
            if candidate_date > today:
                return candidate_date
        
        # Try 6 months later
        try:
            if month <= 6:
                candidate_date = datetime(year, month + 6, day).date()
            else:
                candidate_date = datetime(year + 1, month - 6, day).date()
            if candidate_date > today:
                return candidate_date
        except ValueError:
            candidate_date = datetime(year + 1 if month > 6 else year, 
                                    (month + 6) if month <= 6 else (month - 6), 
                                    min(day, 28)).date()
            if candidate_date > today:
                return candidate_date
        
        # Fallback: 3 months from now
        return today + timedelta(days=90)
    
    def get_gilt_details(self, isin: str) -> Dict:
        """
        Get detailed information for a specific gilt
        """
        # This would typically fetch detailed data from DMO or other sources
        # For now, return basic structure
        return {
            'isin': isin,
            'payment_dates': [],
            'redemption_date': None,
            'minimum_amount': 100,
            'denomination': 100
        }
    
    def validate_gilt_data(self, df: pd.DataFrame) -> bool:
        """
        Validate the gilt data structure
        """
        required_columns = [
            'Name', 'Coupon Rate', 'Current Yield', 'Price', 'Maturity Date'
        ]
        
        return all(col in df.columns for col in required_columns)
