/**
 * UK Tax Calculator - Cloudflare Worker Version
 * Calculate tax implications for UK gilt investments
 */

export class TaxCalculator {
  constructor() {
    // UK tax rates for 2025/26
    this.taxRates = {
      additional_rate: 0.45,
      higher_rate: 0.40,
      basic_rate: 0.20,
      cgt_rate_higher: 0.20,
      cgt_rate_basic: 0.10
    };
    
    // Personal Savings Allowance
    this.psa = {
      additional_rate: 0,      // No PSA for additional rate taxpayers
      higher_rate: 500,        // £500 PSA for higher rate taxpayers
      basic_rate: 1000         // £1,000 PSA for basic rate taxpayers
    };
    
    // Current tax year thresholds
    this.thresholds = {
      basic_rate_limit: 37700,
      higher_rate_limit: 125140,
      personal_allowance: 12570,
      cgt_allowance: 3000
    };
  }

  calculateAfterTaxYield(currentYield, yearsToMaturity, couponRate, taxpayerType = 'additional_rate', dirtyPrice = null, cleanPrice = null) {
    // Ensure we have valid input values
    if (!couponRate || couponRate === 0) {
      return 0;
    }
    
    // Get applicable tax rates
    const incomeTaxRate = this.taxRates[taxpayerType] || this.taxRates['additional_rate'];
    
    // Calculate after-tax coupon yield (coupons are taxed as income)
    const afterTaxCouponYield = couponRate * (1 - incomeTaxRate);
    
    // Calculate capital gains component (if any)
    let capitalGainsYield = 0;
    if (cleanPrice && cleanPrice !== 100 && yearsToMaturity > 0) {
      const capitalGainPerYear = (100 - cleanPrice) / yearsToMaturity;
      // Capital gains on gilts are tax-free in the UK
      capitalGainsYield = capitalGainPerYear;
    }
    
    // Total after-tax yield
    const totalAfterTaxYield = afterTaxCouponYield + capitalGainsYield;
    
    return Math.max(0, totalAfterTaxYield);
  }

  calculateEquivalentSavingsRate(afterTaxYield, taxpayerType = 'additional_rate') {
    const incomeTaxRate = this.taxRates[taxpayerType];
    
    // Calculate the gross savings rate needed to match the gilt's after-tax return
    const equivalentSavingsRate = afterTaxYield / (1 - incomeTaxRate);
    
    return equivalentSavingsRate;
  }

  calculateSavingsAfterTax(savingsRate, investmentAmount, taxpayerType = 'additional_rate') {
    const incomeTaxRate = this.taxRates[taxpayerType];
    const personalSavingsAllowance = this.psa[taxpayerType];
    
    // Calculate annual interest
    const annualInterest = investmentAmount * (savingsRate / 100);
    
    // Apply Personal Savings Allowance
    if (annualInterest <= personalSavingsAllowance) {
      // All interest within PSA - no tax
      return savingsRate;
    } else {
      // Interest above PSA is taxed
      const taxableInterest = annualInterest - personalSavingsAllowance;
      const taxOnInterest = taxableInterest * incomeTaxRate;
      const netInterest = annualInterest - taxOnInterest;
      return (netInterest / investmentAmount) * 100;
    }
  }

  calculateTaxAdvantage(giltAfterTaxYield, savingsAfterTaxRate) {
    return giltAfterTaxYield - savingsAfterTaxRate;
  }

  calculateAnnualAdvantage(taxAdvantage, investmentAmount) {
    return investmentAmount * (taxAdvantage / 100);
  }

  getTaxBracketInfo(taxpayerType) {
    const mapping = {
      'basic_rate': {
        name: 'Basic Rate (20%)',
        rate: 20,
        psa: 1000,
        description: 'This tool helps UK basic rate taxpayers analyse the tax efficiency of UK gilt investments with your £1,000 Personal Savings Allowance.'
      },
      'higher_rate': {
        name: 'Higher Rate (40%)',
        rate: 40,
        psa: 500,
        description: 'This tool helps UK higher rate taxpayers analyse the tax efficiency of UK gilt investments with your £500 Personal Savings Allowance.'
      },
      'additional_rate': {
        name: 'Additional Rate (45%)',
        rate: 45,
        psa: 0,
        description: 'This tool helps UK additional rate taxpayers analyse the tax efficiency of UK gilt investments with no Personal Savings Allowance.'
      }
    };
    
    return mapping[taxpayerType] || mapping['additional_rate'];
  }

  calculateDetailedTaxAnalysis(giltData, investmentAmount, taxpayerType, savingsRate) {
    const results = [];
    
    for (const gilt of giltData) {
      // Calculate years to maturity if not present
      let yearsToMaturity = gilt.yearsToMaturity;
      if (!yearsToMaturity && gilt.maturityDate) {
        const now = new Date();
        const maturity = new Date(gilt.maturityDate);
        yearsToMaturity = Math.max(0, (maturity - now) / (1000 * 60 * 60 * 24 * 365.25));
      }
      
      // Ensure we have valid values
      const validYears = yearsToMaturity || 1;
      const validDirtyPrice = gilt.dirtyPrice || gilt.cleanPrice || 100;
      const validCleanPrice = gilt.cleanPrice || 100;
      
      const afterTaxYield = this.calculateAfterTaxYield(
        gilt.currentYield || 0,
        validYears,
        gilt.couponRate || 0,
        taxpayerType,
        validDirtyPrice,
        validCleanPrice
      );
      
      const equivalentSavingsRate = this.calculateEquivalentSavingsRate(afterTaxYield, taxpayerType);
      const savingsAfterTaxRate = this.calculateSavingsAfterTax(savingsRate, investmentAmount, taxpayerType);
      const taxAdvantage = this.calculateTaxAdvantage(afterTaxYield, savingsAfterTaxRate);
      const annualAdvantage = this.calculateAnnualAdvantage(taxAdvantage, investmentAmount);
      
      results.push({
        ...gilt,
        yearsToMaturity: validYears,
        afterTaxYield: afterTaxYield || 0,
        equivalentSavingsRate: equivalentSavingsRate || 0,
        taxAdvantage: taxAdvantage || 0,
        annualAdvantage: annualAdvantage || 0
      });
    }
    
    return results;
  }

  calculateCouponTax(couponPayment, taxpayerType) {
    const incomeTaxRate = this.taxRates[taxpayerType];
    return couponPayment * incomeTaxRate;
  }

  calculateAfterTaxCoupon(couponPayment, taxpayerType) {
    const tax = this.calculateCouponTax(couponPayment, taxpayerType);
    return couponPayment - tax;
  }
}