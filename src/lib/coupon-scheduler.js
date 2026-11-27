/**
 * UK Gilt Coupon Scheduler - Cloudflare Worker Version
 * Generate coupon payment schedules for UK gilts
 */

import { addMonths, addDays, isWeekend } from 'date-fns';

export class CouponScheduler {
  constructor() {
    // Simplified - no hardcoded holidays
  }

  generateCouponSchedule(giltInfo) {
    const { maturityDate, couponRate, faceValue = 100 } = giltInfo;
    const maturity = new Date(maturityDate);
    const today = new Date();
    
    // UK gilts typically pay coupons semi-annually
    const couponFrequency = 2; // payments per year
    const couponAmount = (couponRate / couponFrequency) * (faceValue / 100);
    
    const schedule = [];

    // Generate payment dates working backwards from maturity. Each nominal
    // date is computed from maturity itself (k * 6 months earlier) rather
    // than from the previous date, so month-end maturities don't drift
    // (31 Mar -> 30 Sep -> 30 Mar ...). Whether a payment is still due is
    // judged on the business-day-adjusted date, which is when it's paid.
    // Build newest-first via push, then reverse once at the end.
    for (let k = 0; ; k++) {
      const nominalDate = addMonths(maturity, -6 * k);
      const paymentDate = this.adjustForBusinessDay(new Date(nominalDate));
      if (paymentDate <= today) break;

      const daysToPayment = Math.floor((paymentDate - today) / (1000 * 60 * 60 * 24));
      const principalAmount = k === 0 ? faceValue : 0;

      schedule.push({
        paymentDate: paymentDate,
        daysToPayment: daysToPayment,
        couponAmount: couponAmount,
        principalAmount: principalAmount,
        totalPayment: couponAmount + principalAmount
      });
    }

    return schedule.reverse();
  }

  calculateAfterTaxCashFlows(schedule, taxRate) {
    return schedule.map(payment => {
      const couponTax = Math.round(payment.couponAmount * taxRate * 100) / 100;
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
    // Move to next business day if weekend (simplified)
    let adjustedDate = new Date(date);
    
    while (isWeekend(adjustedDate)) {
      adjustedDate = addDays(adjustedDate, 1);
    }
    
    return adjustedDate;
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
}