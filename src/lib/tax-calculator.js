/**
 * UK Tax Calculator - Cloudflare Worker Version
 * Calculate tax implications for UK gilts
 */

export class TaxCalculator {
  constructor() {
    // Simplified tax rates for 2025/26
    this.rates = {
      basic_rate: { income: 0.20, psa: 1000 },
      higher_rate: { income: 0.40, psa: 500 },
      additional_rate: { income: 0.45, psa: 0 }
    };
  }

  async calculateAfterTaxYieldWithSchedule(gilt, taxpayerType = 'additional_rate', investmentAmount = 10000) {
    const { CouponScheduler } = await import('./coupon-scheduler.js');
    const scheduler = new CouponScheduler();
    
    // Generate detailed coupon schedule
    const couponSchedule = scheduler.generateCouponSchedule({
      maturityDate: gilt.maturityDate,
      couponRate: gilt.couponRate,
      faceValue: 100
    });
    
    if (!couponSchedule || couponSchedule.length === 0) {
      return this.calculateAfterTaxYield(gilt.currentYield, gilt.yearsToMaturity, gilt.couponRate, taxpayerType, gilt.dirtyPrice, gilt.cleanPrice);
    }
    
    // Get tax rate
    const taxInfo = this.rates[taxpayerType] || this.rates['additional_rate'];
    const incomeTaxRate = taxInfo.income;
    
    // Calculate units owned with 2-decimal rounding
    const dirtyPrice = gilt.dirtyPrice || gilt.cleanPrice;
    const unitsOwned = Math.round((investmentAmount / dirtyPrice) * 100) / 100;
    
    // Calculate after-tax cash flows for actual schedule
    const afterTaxSchedule = couponSchedule.map(payment => {
      const scaledCouponAmount = payment.couponAmount * unitsOwned;
      const scaledPrincipalAmount = Math.round(payment.principalAmount * unitsOwned * 100) / 100;
      const couponTax = Math.round(scaledCouponAmount * incomeTaxRate * 100) / 100;
      const afterTaxCoupon = scaledCouponAmount - couponTax;
      
      return {
        paymentDate: payment.paymentDate,
        daysToPayment: payment.daysToPayment,
        grossCouponAmount: scaledCouponAmount,
        couponTax: couponTax,
        afterTaxCouponAmount: afterTaxCoupon,
        principalAmount: scaledPrincipalAmount, // Tax-free
        totalAfterTaxPayment: afterTaxCoupon + scaledPrincipalAmount,
        isMaturity: payment.principalAmount > 0
      };
    });
    
    // Calculate total returns
    const totalGrossCoupons = afterTaxSchedule.reduce((sum, p) => sum + p.grossCouponAmount, 0);
    const totalCouponTax = afterTaxSchedule.reduce((sum, p) => sum + p.couponTax, 0);
    const totalAfterTaxCoupons = afterTaxSchedule.reduce((sum, p) => sum + p.afterTaxCouponAmount, 0);
    const totalPrincipal = afterTaxSchedule.reduce((sum, p) => sum + p.principalAmount, 0);
    const totalAfterTaxReturn = totalAfterTaxCoupons + totalPrincipal;
    
    // Calculate IRR (Internal Rate of Return) for accurate yield
    const irrYield = this.calculateIRR(investmentAmount, afterTaxSchedule);
    const annualizedAfterTaxYield = irrYield * 100;
    
    // Calculate total return for summary
    const totalReturn = (totalAfterTaxReturn - investmentAmount) / investmentAmount;
    
    return {
      afterTaxYield: Math.max(0, annualizedAfterTaxYield),
      schedule: afterTaxSchedule,
      summary: {
        investmentAmount,
        totalGrossCoupons,
        totalCouponTax,
        totalAfterTaxCoupons,
        totalPrincipal,
        totalAfterTaxReturn,
        totalReturn: totalReturn * 100,
        annualizedReturn: annualizedAfterTaxYield,
        effectiveTaxRate: totalGrossCoupons > 0 ? totalCouponTax / totalGrossCoupons * 100 : 0
      }
    };
  }

  calculateAfterTaxYield(currentYield, yearsToMaturity, couponRate, taxpayerType = 'additional_rate', dirtyPrice = null, cleanPrice = null) {
    // Ensure we have valid input values
    if (!couponRate || couponRate === 0) {
      return 0;
    }
    
    // Get applicable tax rates
    const taxInfo = this.rates[taxpayerType] || this.rates['additional_rate'];
    const incomeTaxRate = taxInfo.income;
    
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
    const taxInfo = this.rates[taxpayerType] || this.rates['additional_rate'];
    const incomeTaxRate = taxInfo.income;

    // Calculate the gross savings rate needed to match the gilt's after-tax return
    const equivalentSavingsRate = afterTaxYield / (1 - incomeTaxRate);

    return equivalentSavingsRate;
  }

  calculateSavingsAfterTax(savingsRate, investmentAmount, taxpayerType = 'additional_rate') {
    const taxInfo = this.rates[taxpayerType] || this.rates['additional_rate'];
    const incomeTaxRate = taxInfo.income;
    const personalSavingsAllowance = taxInfo.psa;
    
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

  calculateIRR(initialInvestment, cashFlowSchedule, maxIterations = 100, tolerance = 1e-7) {
    // IRR calculation using Newton-Raphson method
    // Finds the discount rate where NPV = 0
    
    if (!cashFlowSchedule || cashFlowSchedule.length === 0) {
      return 0;
    }
    
    // Convert cash flows to time-based array
    const cashFlows = [-initialInvestment]; // Initial investment as negative cash flow
    const timePoints = [0]; // Time 0 for initial investment
    
    // Add all payment cash flows with their timing
    cashFlowSchedule.forEach(payment => {
      const timeInYears = payment.daysToPayment / 365.25; // Convert days to years
      cashFlows.push(payment.totalAfterTaxPayment);
      timePoints.push(timeInYears);
    });
    
    // Initial guess for IRR (10%)
    let rate = 0.10;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let dnpv = 0; // Derivative of NPV
      
      // Calculate NPV and its derivative
      for (let j = 0; j < cashFlows.length; j++) {
        const timePoint = timePoints[j];
        const discountFactor = Math.pow(1 + rate, timePoint);
        
        npv += cashFlows[j] / discountFactor;
        dnpv -= (cashFlows[j] * timePoint) / Math.pow(1 + rate, timePoint + 1);
      }
      
      // Check for convergence
      if (Math.abs(npv) < tolerance) {
        return rate;
      }
      
      // Newton-Raphson iteration
      if (Math.abs(dnpv) < tolerance) {
        break; // Avoid division by zero
      }
      
      rate = rate - npv / dnpv;
      
      // Keep rate within reasonable bounds
      if (rate < -0.99) rate = -0.99;
      if (rate > 10) rate = 10;
    }
    
    // If IRR calculation fails, fallback to simple method
    const totalCashFlow = cashFlows.slice(1).reduce((sum, cf) => sum + cf, 0);
    const totalReturn = (totalCashFlow - initialInvestment) / initialInvestment;
    const avgTimeToPayment = timePoints.slice(1).reduce((sum, time) => sum + time, 0) / (timePoints.length - 1);
    
    return avgTimeToPayment > 0 ? totalReturn / avgTimeToPayment : 0;
  }

  getTaxBracketInfo(taxpayerType) {
    const mapping = {
      'basic_rate': {
        name: 'Basic Rate (20%)',
        rate: 20,
        psa: 1000,
        description: 'This tool helps UK basic rate taxpayers analyse the tax efficiency of UK gilts with your £1,000 Personal Savings Allowance.'
      },
      'higher_rate': {
        name: 'Higher Rate (40%)',
        rate: 40,
        psa: 500,
        description: 'This tool helps UK higher rate taxpayers analyse the tax efficiency of UK gilts with your £500 Personal Savings Allowance.'
      },
      'additional_rate': {
        name: 'Additional Rate (45%)',
        rate: 45,
        psa: 0,
        description: 'This tool helps UK additional rate taxpayers analyse the tax efficiency of UK gilts with no Personal Savings Allowance.'
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
    const taxInfo = this.rates[taxpayerType] || this.rates['additional_rate'];
    return couponPayment * taxInfo.income;
  }

  calculateAfterTaxCoupon(couponPayment, taxpayerType) {
    const tax = this.calculateCouponTax(couponPayment, taxpayerType);
    return couponPayment - tax;
  }
}