/**
 * UK Gilt Coupon Scheduler - Cloudflare Worker Version
 * Generate coupon payment schedules for UK gilts
 */

import { addMonths, addDays, isSameDay, isWeekend } from 'date-fns';

export class CouponScheduler {
  constructor() {
    // UK holidays should be loaded from an authentic data source
    // No hardcoded holiday data - implement proper holiday calendar API
    this.ukHolidays = [];
  }

  generateCouponSchedule(giltInfo) {
    const { maturityDate, couponRate, faceValue = 100 } = giltInfo;
    const maturity = new Date(maturityDate);
    const today = new Date();
    
    // UK gilts typically pay coupons semi-annually
    const couponFrequency = 2; // payments per year
    const couponAmount = (couponRate / couponFrequency) * (faceValue / 100);
    
    const schedule = [];
    let currentDate = new Date(maturity);
    
    // Generate payment dates working backwards from maturity
    // Use exact 6-month intervals based on the maturity date pattern
    while (currentDate > today) {
      const paymentDate = this.adjustForBusinessDay(new Date(currentDate));
      const daysToPayment = Math.floor((paymentDate - today) / (1000 * 60 * 60 * 24));
      
      schedule.unshift({
        paymentDate: paymentDate,
        daysToPayment: daysToPayment,
        couponAmount: couponAmount,
        principalAmount: isSameDay(paymentDate, maturity) ? faceValue : 0,
        totalPayment: couponAmount + (isSameDay(paymentDate, maturity) ? faceValue : 0)
      });
      
      // Move to exactly 6 months earlier (same day of month, 6 months prior)
      currentDate = addMonths(currentDate, -6);
    }
    
    return schedule;
  }

  calculateAfterTaxCashFlows(schedule, taxRate) {
    return schedule.map(payment => {
      const couponTax = payment.couponAmount * taxRate;
      const afterTaxCoupon = payment.couponAmount - couponTax;
      const afterTaxTotal = afterTaxCoupon + payment.principalAmount;
      
      return {
        ...payment,
        couponTax: couponTax,
        afterTaxCoupon: afterTaxCoupon,
        afterTaxTotal: afterTaxTotal
      };
    });
  }

  getScheduleSummary(afterTaxSchedule) {
    if (!afterTaxSchedule || afterTaxSchedule.length === 0) {
      return null;
    }
    
    const numberOfPayments = afterTaxSchedule.length;
    const firstPayment = afterTaxSchedule[0];
    const finalPayment = afterTaxSchedule[afterTaxSchedule.length - 1];
    
    const totalCoupons = afterTaxSchedule.reduce((sum, payment) => sum + payment.couponAmount, 0);
    const totalAfterTaxCoupons = afterTaxSchedule.reduce((sum, payment) => sum + payment.afterTaxCoupon, 0);
    const totalTax = afterTaxSchedule.reduce((sum, payment) => sum + payment.couponTax, 0);
    const totalPrincipal = afterTaxSchedule.reduce((sum, payment) => sum + payment.principalAmount, 0);
    
    return {
      numberOfPayments: numberOfPayments,
      firstPaymentDate: firstPayment.paymentDate,
      finalPaymentDate: finalPayment.paymentDate,
      totalCoupons: totalCoupons,
      totalAfterTaxCoupons: totalAfterTaxCoupons,
      totalTax: totalTax,
      totalPrincipal: totalPrincipal,
      totalAfterTaxReturn: totalAfterTaxCoupons + totalPrincipal
    };
  }

  adjustForBusinessDay(date) {
    // Move to next business day if weekend
    let adjustedDate = new Date(date);
    
    while (isWeekend(adjustedDate) || this.isUKHoliday(adjustedDate)) {
      adjustedDate = addDays(adjustedDate, 1);
    }
    
    return adjustedDate;
  }

  isUKHoliday(date) {
    const dateStr = date.toISOString().split('T')[0];
    return this.ukHolidays.includes(dateStr);
  }

  calculateAccruedInterest(couponRate, lastPaymentDate, nextPaymentDate, settlementDate = null) {
    if (!settlementDate) {
      settlementDate = new Date();
    }
    
    const lastPayment = new Date(lastPaymentDate);
    const nextPayment = new Date(nextPaymentDate);
    
    // Exact day count - Actual/Actual convention for UK gilts
    const daysSinceLastPayment = Math.floor((settlementDate - lastPayment) / (1000 * 60 * 60 * 24));
    const totalDaysInPeriod = Math.floor((nextPayment - lastPayment) / (1000 * 60 * 60 * 24));
    
    // Precise accrued fraction
    const accruedFraction = daysSinceLastPayment / totalDaysInPeriod;
    
    // Semi-annual coupon payment
    const semiAnnualCoupon = couponRate / 2;
    const accruedInterest = semiAnnualCoupon * accruedFraction;
    
    return accruedInterest;
  }

  calculateDirtyPrice(cleanPrice, accruedInterest) {
    return cleanPrice + accruedInterest;
  }

  calculateUnitsOwned(investmentAmount, dirtyPrice) {
    return (investmentAmount / dirtyPrice) * 100;
  }

  scalePaymentsToInvestment(schedule, investmentAmount, dirtyPrice) {
    const unitsOwned = this.calculateUnitsOwned(investmentAmount, dirtyPrice);
    const scalingFactor = unitsOwned / 100;
    
    return schedule.map(payment => ({
      ...payment,
      couponAmount: payment.couponAmount * scalingFactor,
      couponTax: payment.couponTax * scalingFactor,
      afterTaxCoupon: payment.afterTaxCoupon * scalingFactor,
      principalAmount: payment.principalAmount * scalingFactor,
      afterTaxTotal: payment.afterTaxTotal * scalingFactor,
      totalPayment: payment.totalPayment * scalingFactor
    }));
  }
}