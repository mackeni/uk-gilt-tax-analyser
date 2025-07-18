import os
import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Date, Boolean, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta, date
import logging
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

class Gilt(Base):
    __tablename__ = 'gilts'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    epic = Column(String(20), nullable=True)
    isin = Column(String(12), unique=True, nullable=False)
    coupon_rate = Column(Float, nullable=False)
    current_yield = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    clean_price = Column(Float, nullable=False)
    accrued_interest = Column(Float, nullable=False)
    maturity_date = Column(Date, nullable=False)
    first_coupon_date = Column(Date, nullable=True)
    last_coupon_date = Column(Date, nullable=True)
    coupon_frequency = Column(Integer, default=2)  # Semi-annual = 2
    classification = Column(String(20), default='Conventional')
    is_active = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

class CouponPayment(Base):
    __tablename__ = 'coupon_payments'
    
    id = Column(Integer, primary_key=True)
    gilt_id = Column(Integer, nullable=False)
    payment_date = Column(Date, nullable=False)
    coupon_amount = Column(Float, nullable=False)
    ex_dividend_date = Column(Date, nullable=True)
    is_paid = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DatabaseManager:
    def __init__(self):
        self.database_url = os.getenv('DATABASE_URL')
        if not self.database_url:
            raise ValueError("DATABASE_URL environment variable not set")
        
        self.engine = create_engine(self.database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
        # Create tables
        Base.metadata.create_all(bind=self.engine)
        logger.info("Database tables created/verified")
    
    def get_session(self):
        return self.SessionLocal()
    
    def populate_gilt_data(self, gilt_data_list):
        """Populate database with gilt data"""
        session = self.get_session()
        
        try:
            # Clear existing data
            session.query(CouponPayment).delete()
            session.query(Gilt).delete()
            session.commit()  # Commit the deletions first
            
            for gilt_data in gilt_data_list:
                # Generate EPIC from name (allow duplicates)
                epic = gilt_data.get('EPIC', gilt_data['Name'][:15].replace(' ', '_'))
                
                gilt = Gilt(
                    name=gilt_data['Name'],
                    epic=epic,
                    isin=gilt_data['ISIN'],
                    coupon_rate=gilt_data['Coupon Rate'],
                    current_yield=gilt_data['Current Yield'],
                    price=gilt_data['Price'],
                    clean_price=gilt_data.get('Clean Price', gilt_data['Price']),
                    accrued_interest=gilt_data.get('Accrued Interest', 0),
                    maturity_date=gilt_data['Maturity Date'].date() if isinstance(gilt_data['Maturity Date'], datetime) else gilt_data['Maturity Date'],
                    classification=gilt_data.get('Classification', 'Conventional'),
                    coupon_frequency=2  # Semi-annual payments
                )
                
                session.add(gilt)
                session.flush()  # Get the ID
                
                # Generate coupon payment dates
                coupon_dates = self._generate_coupon_dates(gilt.maturity_date, gilt.coupon_rate)
                
                for payment_date in coupon_dates:
                    if payment_date >= date.today():  # Only future payments
                        coupon_payment = CouponPayment(
                            gilt_id=gilt.id,
                            payment_date=payment_date,
                            coupon_amount=gilt.coupon_rate / 2,  # Semi-annual payment
                            ex_dividend_date=payment_date - timedelta(days=7)  # Approximate ex-div date
                        )
                        session.add(coupon_payment)
            
            session.commit()
            logger.info(f"Successfully populated {len(gilt_data_list)} gilts with coupon schedules")
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error populating gilt data: {e}")
            raise
        finally:
            session.close()
    
    def _generate_coupon_dates(self, maturity_date, coupon_rate):
        """Generate coupon payment dates for a gilt based on actual UK gilt conventions"""
        if coupon_rate == 0:
            return []  # No coupons for zero-coupon bonds
        
        payment_dates = []
        
        # UK gilts pay on specific dates - calculate based on actual gilt conventions
        # Most gilts pay in January, March, June, September
        
        if maturity_date.month in [1, 7]:  # January/July maturities
            payment_months = [1, 7]
        elif maturity_date.month in [3, 9]:  # March/September maturities
            payment_months = [3, 9]
        elif maturity_date.month in [6, 12]:  # June/December maturities
            payment_months = [6, 12]
        else:  # Other maturities
            payment_months = [maturity_date.month, (maturity_date.month + 6) % 12 or 12]
        
        # Generate dates from today until maturity
        current_year = date.today().year
        maturity_year = maturity_date.year
        
        for year in range(current_year, maturity_year + 1):
            for month in payment_months:
                # Use the day from maturity date for consistency
                try:
                    payment_date = date(year, month, maturity_date.day)
                except ValueError:
                    # Handle edge case where day doesn't exist in month (e.g., Feb 31)
                    # Use last day of month instead
                    if month == 2:
                        payment_date = date(year, month, 28 if year % 4 != 0 else 29)
                    elif month in [4, 6, 9, 11]:
                        payment_date = date(year, month, 30)
                    else:
                        payment_date = date(year, month, 31)
                
                # Only include future dates up to maturity
                if payment_date <= maturity_date and payment_date >= date.today():
                    payment_dates.append(payment_date)
        
        return sorted(payment_dates)
    
    def get_all_gilts(self):
        """Get all gilts from database"""
        session = self.get_session()
        try:
            gilts = session.query(Gilt).filter(Gilt.is_active == True).all()
            return gilts
        finally:
            session.close()
    
    def get_gilt_with_coupons(self, gilt_id):
        """Get gilt with its coupon payment schedule"""
        session = self.get_session()
        try:
            gilt = session.query(Gilt).filter(Gilt.id == gilt_id).first()
            if gilt:
                coupons = session.query(CouponPayment).filter(
                    CouponPayment.gilt_id == gilt_id
                ).order_by(CouponPayment.payment_date).all()
                return gilt, coupons
            return None, []
        finally:
            session.close()
    
    def get_gilts_dataframe(self):
        """Convert gilt data to pandas DataFrame with coupon schedule details"""
        session = self.get_session()
        try:
            query = """
            SELECT 
                g.id,
                g.name,
                g.epic,
                g.isin,
                g.coupon_rate,
                g.current_yield,
                g.price,
                g.clean_price,
                g.accrued_interest,
                (g.clean_price + g.accrued_interest) as dirty_price,
                g.maturity_date,
                g.classification,
                COUNT(cp.id) as remaining_coupons,
                MIN(cp.payment_date) as next_coupon_date,
                MAX(cp.payment_date) as final_coupon_date
            FROM gilts g
            LEFT JOIN coupon_payments cp ON g.id = cp.gilt_id 
                AND cp.payment_date >= CURRENT_DATE
            WHERE g.is_active = true
            GROUP BY g.id, g.name, g.epic, g.isin, g.coupon_rate, g.current_yield, 
                     g.price, g.clean_price, g.accrued_interest, g.maturity_date, g.classification
            ORDER BY g.maturity_date
            """
            
            df = pd.read_sql_query(query, self.engine)
            
            # Convert date columns
            df['maturity_date'] = pd.to_datetime(df['maturity_date'])
            df['next_coupon_date'] = pd.to_datetime(df['next_coupon_date'])
            df['final_coupon_date'] = pd.to_datetime(df['final_coupon_date'])
            
            # Rename columns to match existing code
            df = df.rename(columns={
                'id': 'ID',
                'name': 'Name',
                'epic': 'EPIC',
                'isin': 'ISIN',
                'coupon_rate': 'Coupon Rate',
                'current_yield': 'Current Yield',
                'price': 'Price',
                'clean_price': 'Clean Price',
                'accrued_interest': 'Accrued Interest',
                'dirty_price': 'Dirty Price',
                'maturity_date': 'Maturity Date',
                'classification': 'Classification',
                'remaining_coupons': 'Remaining Coupons',
                'next_coupon_date': 'Next Coupon Date',
                'final_coupon_date': 'Final Coupon Date'
            })
            
            return df
            
        finally:
            session.close()
    
    def update_gilt_price(self, isin, new_price, new_yield):
        """Update gilt price and yield"""
        session = self.get_session()
        try:
            gilt = session.query(Gilt).filter(Gilt.isin == isin).first()
            if gilt:
                gilt.price = new_price
                gilt.current_yield = new_yield
                gilt.last_updated = datetime.utcnow()
                session.commit()
                return True
            return False
        except Exception as e:
            session.rollback()
            logger.error(f"Error updating gilt price: {e}")
            return False
        finally:
            session.close()
    
    def get_coupon_dates(self, gilt_id: int) -> list:
        """Get all future coupon payment dates for a gilt"""
        session = self.get_session()
        try:
            coupon_payments = session.query(CouponPayment).filter(
                CouponPayment.gilt_id == gilt_id,
                CouponPayment.payment_date >= date.today()
            ).order_by(CouponPayment.payment_date).all()
            
            return [cp.payment_date for cp in coupon_payments]
        finally:
            session.close()