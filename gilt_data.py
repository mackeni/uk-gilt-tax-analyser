import pandas as pd
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import time
import streamlit as st
import re
from bs4 import BeautifulSoup

class GiltDataFetcher:
    """Fetches UK gilt data from various sources"""
    
    def __init__(self):
        self.base_urls = {
            'dmo': 'https://www.dmo.gov.uk/data/',
            'tradeweb': 'https://www.tradeweb.com/',
            'dividenddata': 'https://www.dividenddata.co.uk/uk-gilts-prices-yields.py'
        }
        self.max_years_default = 3  # Default maximum maturity filter
    
    def get_gilt_data(self) -> pd.DataFrame:
        """
        Fetch current gilt data from available sources
        """
        try:
            # Try to get real data from DividendData first
            df = self._fetch_from_dividenddata()
            if df is not None and not df.empty:
                return df
            
            # Try DMO as fallback
            df = self._fetch_from_dmo()
            if df is not None and not df.empty:
                return df
            
            # If real data fails, return sample data with notification
            st.warning("Unable to fetch real-time data. Using sample data for demonstration.")
            return self.get_sample_data()
            
        except Exception as e:
            st.error(f"Error fetching gilt data: {str(e)}")
            return self.get_sample_data()
    
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
    
    def get_sample_data(self) -> pd.DataFrame:
        """
        Provide sample gilt data for demonstration
        Note: This is only used when real data is unavailable
        """
        
        # Sample data based on current UK gilt market (July 2025)
        sample_gilts = [
            {
                'Name': '2% Treasury Gilt 2025',
                'Coupon Rate': 2.000,
                'Current Yield': 4.136,
                'Price': 99.70,
                'Maturity Date': datetime(2025, 9, 7),
                'ISIN': 'GB00B4RMG901',
                'Classification': 'Conventional'
            },
            {
                'Name': '3.5% Treasury Gilt 2025',
                'Coupon Rate': 3.500,
                'Current Yield': 4.173,
                'Price': 99.82,
                'Maturity Date': datetime(2025, 10, 22),
                'ISIN': 'GB00B4RMG902',
                'Classification': 'Conventional'
            },
            {
                'Name': '0.125% Treasury Gilt 2026',
                'Coupon Rate': 0.125,
                'Current Yield': 3.256,
                'Price': 98.35,
                'Maturity Date': datetime(2026, 1, 30),
                'ISIN': 'GB00B4RMG903',
                'Classification': 'Conventional'
            },
            {
                'Name': '1.5% Treasury Gilt 2026',
                'Coupon Rate': 1.500,
                'Current Yield': 3.783,
                'Price': 97.75,
                'Maturity Date': datetime(2026, 7, 22),
                'ISIN': 'GB00B4RMG904',
                'Classification': 'Conventional'
            },
            {
                'Name': '0.375% Treasury Gilt 2026',
                'Coupon Rate': 0.375,
                'Current Yield': 3.613,
                'Price': 96.03,
                'Maturity Date': datetime(2026, 10, 22),
                'ISIN': 'GB00B4RMH001',
                'Classification': 'Conventional'
            },
            {
                'Name': '4.125% Treasury Gilt 2027',
                'Coupon Rate': 4.125,
                'Current Yield': 3.900,
                'Price': 100.33,
                'Maturity Date': datetime(2027, 1, 29),
                'ISIN': 'GB00B4RMH007',
                'Classification': 'Conventional'
            },
            {
                'Name': '1.625% Treasury Gilt 2028',
                'Coupon Rate': 1.625,
                'Current Yield': 3.772,
                'Price': 93.46,
                'Maturity Date': datetime(2028, 10, 22),
                'ISIN': 'GB00B4RMH014',
                'Classification': 'Conventional'
            },
            {
                'Name': '0.875% Treasury Gilt 2029',
                'Coupon Rate': 0.875,
                'Current Yield': 3.864,
                'Price': 88.35,
                'Maturity Date': datetime(2029, 10, 22),
                'ISIN': 'GB00B4RMH021',
                'Classification': 'Conventional'
            },
            {
                'Name': '4.375% Treasury Gilt 2030',
                'Coupon Rate': 4.375,
                'Current Yield': 4.071,
                'Price': 101.27,
                'Maturity Date': datetime(2030, 3, 7),
                'ISIN': 'GB00B4RMH038',
                'Classification': 'Conventional'
            },
            {
                'Name': '4% Treasury Gilt 2031',
                'Coupon Rate': 4.000,
                'Current Yield': 4.237,
                'Price': 98.70,
                'Maturity Date': datetime(2031, 10, 22),
                'ISIN': 'GB00B4RMH045',
                'Classification': 'Conventional'
            },
            {
                'Name': '1% Treasury Gilt 2032',
                'Coupon Rate': 1.000,
                'Current Yield': 4.227,
                'Price': 81.73,
                'Maturity Date': datetime(2032, 1, 31),
                'ISIN': 'GB00B4RMH052',
                'Classification': 'Conventional'
            },
            {
                'Name': '3.25% Treasury Gilt 2033',
                'Coupon Rate': 3.250,
                'Current Yield': 4.395,
                'Price': 92.72,
                'Maturity Date': datetime(2033, 1, 31),
                'ISIN': 'GB00B4RMH069',
                'Classification': 'Conventional'
            },
            {
                'Name': '4.25% Treasury Gilt 2036',
                'Coupon Rate': 4.250,
                'Current Yield': 4.740,
                'Price': 95.94,
                'Maturity Date': datetime(2036, 3, 7),
                'ISIN': 'GB00B4RMH076',
                'Classification': 'Conventional'
            },
            {
                'Name': '1.75% Treasury Gilt 2037',
                'Coupon Rate': 1.750,
                'Current Yield': 4.849,
                'Price': 71.81,
                'Maturity Date': datetime(2037, 9, 7),
                'ISIN': 'GB00B4RMH083',
                'Classification': 'Conventional'
            },
            {
                'Name': '4.25% Treasury Gilt 2039',
                'Coupon Rate': 4.250,
                'Current Yield': 5.041,
                'Price': 92.06,
                'Maturity Date': datetime(2039, 9, 7),
                'ISIN': 'GB00B4RMH090',
                'Classification': 'Conventional'
            },
            {
                'Name': '1.25% Treasury Gilt 2041',
                'Coupon Rate': 1.250,
                'Current Yield': 5.154,
                'Price': 57.36,
                'Maturity Date': datetime(2041, 10, 22),
                'ISIN': 'GB00B4RMH106',
                'Classification': 'Conventional'
            },
            {
                'Name': '4.5% Treasury Gilt 2042',
                'Coupon Rate': 4.500,
                'Current Yield': 5.238,
                'Price': 91.64,
                'Maturity Date': datetime(2042, 12, 7),
                'ISIN': 'GB00B4RMH113',
                'Classification': 'Conventional'
            },
            {
                'Name': '3.5% Treasury Gilt 2045',
                'Coupon Rate': 3.500,
                'Current Yield': 5.350,
                'Price': 77.76,
                'Maturity Date': datetime(2045, 1, 22),
                'ISIN': 'GB00B4RMH120',
                'Classification': 'Conventional'
            },
            {
                'Name': '4.25% Treasury Gilt 2049',
                'Coupon Rate': 4.250,
                'Current Yield': 5.433,
                'Price': 84.11,
                'Maturity Date': datetime(2049, 12, 7),
                'ISIN': 'GB00B4RMH137',
                'Classification': 'Conventional'
            },
            {
                'Name': '1.25% Treasury Gilt 2051',
                'Coupon Rate': 1.250,
                'Current Yield': 5.425,
                'Price': 42.14,
                'Maturity Date': datetime(2051, 7, 31),
                'ISIN': 'GB00B4RMH144',
                'Classification': 'Conventional'
            },
            {
                'Name': '2.5% Treasury Gilt 2065',
                'Coupon Rate': 2.500,
                'Current Yield': 5.327,
                'Price': 53.41,
                'Maturity Date': datetime(2065, 7, 22),
                'ISIN': 'GB00B4RMH151',
                'Classification': 'Conventional'
            }
        ]
        
        df = pd.DataFrame(sample_gilts)
        
        # Add calculated fields
        df['Accrued Interest'] = df.apply(lambda row: self._calculate_accrued_interest(row), axis=1)
        df['Clean Price'] = df['Price']  # Store original price as clean price
        df['Dirty Price'] = df['Price'] + df['Accrued Interest']  # Price is clean price, dirty = clean + accrued
        df['Yield to Maturity'] = df['Current Yield']  # Simplified for demonstration
        
        return df
    
    def _calculate_accrued_interest(self, row):
        """Calculate accrued interest based on days since last coupon payment"""
        try:
            coupon_rate = row['Coupon Rate']
            maturity_date = row['Maturity Date']
            
            # UK gilts typically pay semi-annually
            # Calculate the last coupon date before today
            today = datetime.now().date()
            maturity_date_obj = maturity_date.date() if isinstance(maturity_date, datetime) else maturity_date
            
            # Find the last coupon payment date
            # UK gilts typically pay on the same day and month as maturity, 6 months earlier
            last_coupon_date = self._get_last_coupon_date(maturity_date_obj, today)
            next_coupon_date = self._get_next_coupon_date(maturity_date_obj, today)
            
            # Calculate days since last coupon payment
            days_since_last_coupon = (today - last_coupon_date).days
            days_in_coupon_period = (next_coupon_date - last_coupon_date).days
            
            # Calculate accrued interest using actual day count
            # UK gilts use Actual/Actual day count convention
            accrued_fraction = days_since_last_coupon / days_in_coupon_period
            semi_annual_coupon = coupon_rate / 2
            
            return semi_annual_coupon * accrued_fraction
            
        except Exception as e:
            # Fallback to simplified calculation if date parsing fails
            return (row['Coupon Rate'] / 2) * 0.25  # Conservative estimate
    
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
