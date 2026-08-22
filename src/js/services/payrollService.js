import { store } from '../state/store.js';
import { SalaryService } from './salaryService.js';

export class PayrollService {
  static generateEmployeePayslip(employeeId, month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
    const state = store.getState();
    const employee = state.employees.find(e => e.id === employeeId);
    if (!employee) return null;

    const salary = employee.salary || SalaryService.calculateSalaryComponents(50000);
    const totalWorkingDays = 22; // standard monthly working days

    // Calculate unpaid leaves in current month
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
    const unpaidLeaves = state.leaveRequests
      .filter(l => l.employeeId === employeeId && 
                   l.status === 'approved' && 
                   l.type === 'Unpaid Leave' && 
                   l.startDate.startsWith(monthPrefix))
      .reduce((sum, l) => sum + (l.days || 0), 0);

    // Calculate attended days
    const attendedDays = state.attendanceRecords
      .filter(r => r.employeeId === employeeId && 
                   r.date.startsWith(monthPrefix) && 
                   r.status === 'present').length;

    // Payable days calculation
    const payableDays = Math.max(0, totalWorkingDays - unpaidLeaves);
    const prorationRatio = payableDays / totalWorkingDays;

    // Prorate earnings
    const proratedGross = Math.round(salary.monthWage * prorationRatio * 100) / 100;
    const proratedBasic = Math.round(salary.basicSalary * prorationRatio * 100) / 100;
    const proratedHra = Math.round(salary.hra * prorationRatio * 100) / 100;
    const proratedStandard = Math.round(salary.standardAllowance * prorationRatio * 100) / 100;
    const proratedBonus = Math.round(salary.performanceBonus * prorationRatio * 100) / 100;
    const proratedLta = Math.round(salary.lta * prorationRatio * 100) / 100;
    const proratedFixed = Math.round(salary.fixedAllowance * prorationRatio * 100) / 100;

    // Deductions
    const pfEmployee = salary.pfEmployee;
    const professionalTax = salary.professionalTax;
    const totalDeductions = pfEmployee + professionalTax;
    const netPayout = Math.max(0, Math.round((proratedGross - totalDeductions) * 100) / 100);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return {
      payslipId: `PS-${year}${String(month).padStart(2, '0')}-${employee.loginId}`,
      monthName: monthNames[month - 1],
      year,
      employee,
      company: state.company,
      workingDays: totalWorkingDays,
      payableDays,
      attendedDays,
      unpaidLeaves,
      earnings: {
        basicSalary: proratedBasic,
        hra: proratedHra,
        standardAllowance: proratedStandard,
        performanceBonus: proratedBonus,
        lta: proratedLta,
        fixedAllowance: proratedFixed,
        totalGross: proratedGross
      },
      deductions: {
        pfEmployee,
        professionalTax,
        totalDeductions
      },
      netPayout,
      generatedAt: new Date().toISOString()
    };
  }

  static getOrgPayrollSummary(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
    const state = store.getState();
    return state.employees.map(emp => {
      const payslip = this.generateEmployeePayslip(emp.id, month, year);
      return {
        employee: emp,
        monthWage: emp.salary?.monthWage || 50000,
        payableDays: payslip.payableDays,
        gross: payslip.earnings.totalGross,
        deductions: payslip.deductions.totalDeductions,
        netPayout: payslip.netPayout
      };
    });
  }
}
