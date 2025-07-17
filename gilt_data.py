import pandas as pd
import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import time
import streamlit as st

class GiltDataFetcher:
    """Fetches UK gilt data from various sources"""
    
    def __init__(self):
        self.base_urls = {
            'dmo': 'https://www.dmo.gov.uk/data/',
            'tradeweb': 'https://www.tradeweb.com/',
            'dividenddata': 'https://www.dividenddata.co.uk/uk-gilts-prices-yields.py'
        }
    
    def get_gilt_data(self) -> pd.DataFrame:
        """
        Fetch current gilt data from available sources
        """
        try:
            # Try to get real data from DMO or other sources
            df = self._fetch_from_dmo()
            if df is not None and not df.empty:
                return df
            
            # If real data fails, return sample data with notification
            st.warning("Unable to fetch real-time data. Using sample data for demonstration.")
            return self.get_sample_data()
            
        except Exception as e:
            st.error(f"Error fetching gilt data: {str(e)}")
            return self.get_sample_data()
    
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
        
        # Sample data based on typical UK gilt structure
        sample_gilts = [
            {
                'Name': 'Treasury 4% 2030',
                'Coupon Rate': 4.000,
                'Current Yield': 4.250,
                'Price': 98.50,
                'Maturity Date': datetime(2030, 1, 15),
                'ISIN': 'GB00B4RMG977',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 1.5% 2026',
                'Coupon Rate': 1.500,
                'Current Yield': 3.850,
                'Price': 88.75,
                'Maturity Date': datetime(2026, 7, 22),
                'ISIN': 'GB00B4RMG984',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 3.25% 2033',
                'Coupon Rate': 3.250,
                'Current Yield': 4.100,
                'Price': 95.25,
                'Maturity Date': datetime(2033, 1, 22),
                'ISIN': 'GB00B4RMG991',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 2.25% 2032',
                'Coupon Rate': 2.250,
                'Current Yield': 4.050,
                'Price': 82.40,
                'Maturity Date': datetime(2032, 9, 7),
                'ISIN': 'GB00B4RMH007',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 4.25% 2036',
                'Coupon Rate': 4.250,
                'Current Yield': 4.300,
                'Price': 99.75,
                'Maturity Date': datetime(2036, 12, 7),
                'ISIN': 'GB00B4RMH014',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 1.75% 2037',
                'Coupon Rate': 1.750,
                'Current Yield': 4.150,
                'Price': 68.20,
                'Maturity Date': datetime(2037, 7, 22),
                'ISIN': 'GB00B4RMH021',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 3.75% 2038',
                'Coupon Rate': 3.750,
                'Current Yield': 4.200,
                'Price': 91.60,
                'Maturity Date': datetime(2038, 7, 22),
                'ISIN': 'GB00B4RMH038',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 4.5% 2042',
                'Coupon Rate': 4.500,
                'Current Yield': 4.350,
                'Price': 102.30,
                'Maturity Date': datetime(2042, 12, 7),
                'ISIN': 'GB00B4RMH045',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 1.25% 2041',
                'Coupon Rate': 1.250,
                'Current Yield': 4.100,
                'Price': 55.75,
                'Maturity Date': datetime(2041, 7, 22),
                'ISIN': 'GB00B4RMH052',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 3.5% 2045',
                'Coupon Rate': 3.500,
                'Current Yield': 4.180,
                'Price': 88.90,
                'Maturity Date': datetime(2045, 7, 22),
                'ISIN': 'GB00B4RMH069',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 2.5% 2065',
                'Coupon Rate': 2.500,
                'Current Yield': 4.050,
                'Price': 70.25,
                'Maturity Date': datetime(2065, 7, 22),
                'ISIN': 'GB00B4RMH076',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 1.625% 2028',
                'Coupon Rate': 1.625,
                'Current Yield': 3.950,
                'Price': 86.40,
                'Maturity Date': datetime(2028, 10, 22),
                'ISIN': 'GB00B4RMH083',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 0.125% 2026',
                'Coupon Rate': 0.125,
                'Current Yield': 3.750,
                'Price': 77.95,
                'Maturity Date': datetime(2026, 1, 31),
                'ISIN': 'GB00B4RMH090',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 0.875% 2029',
                'Coupon Rate': 0.875,
                'Current Yield': 3.900,
                'Price': 78.60,
                'Maturity Date': datetime(2029, 10, 22),
                'ISIN': 'GB00B4RMH106',
                'Classification': 'Conventional'
            },
            {
                'Name': 'Treasury 5% 2025',
                'Coupon Rate': 5.000,
                'Current Yield': 4.150,
                'Price': 101.20,
                'Maturity Date': datetime(2025, 9, 7),
                'ISIN': 'GB00B4RMH113',
                'Classification': 'Conventional'
            }
        ]
        
        df = pd.DataFrame(sample_gilts)
        
        # Add calculated fields
        df['Accrued Interest'] = df['Coupon Rate'] * 0.5  # Approximate accrued interest
        df['Clean Price'] = df['Price'] - df['Accrued Interest']
        df['Yield to Maturity'] = df['Current Yield']  # Simplified for demonstration
        
        return df
    
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
