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
    // Get applicable tax rates
    const incomeTaxRate = this.taxRates[taxpayerType];
    
    // Calculate after-tax coupon yield
    const afterTaxCouponYield = couponRate * (1 - incomeTaxRate);
    
    // Calculate capital gains component (if any)
    let capitalGainsYield = 0;
    if (cleanPrice !== null && cleanPrice !== 100) {
      const capitalGainPerYear = (100 - cleanPrice) / yearsToMaturity;
      // Capital gains on gilts are tax-free in the UK
      capitalGainsYield = capitalGainPerYear;
    }
    
    // Total after-tax yield
    const totalAfterTaxYield = afterTaxCouponYield + capitalGainsYield;
    
    return totalAfterTaxYield;
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
      const afterTaxYield = this.calculateAfterTaxYield(
        gilt.currentYield,
        gilt.yearsToMaturity,
        gilt.couponRate,
        taxpayerType,
        gilt.dirtyPrice,
        gilt.cleanPrice
      );
      
      const equivalentSavingsRate = this.calculateEquivalentSavingsRate(afterTaxYield, taxpayerType);
      const savingsAfterTaxRate = this.calculateSavingsAfterTax(savingsRate, investmentAmount, taxpayerType);
      const taxAdvantage = this.calculateTaxAdvantage(afterTaxYield, savingsAfterTaxRate);
      const annualAdvantage = this.calculateAnnualAdvantage(taxAdvantage, investmentAmount);
      
      results.push({
        ...gilt,
        afterTaxYield: afterTaxYield,
        equivalentSavingsRate: equivalentSavingsRate,
        taxAdvantage: taxAdvantage,
        annualAdvantage: annualAdvantage
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