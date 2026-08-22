/**
 * Salary Calculation Engine
 * Auto-computes standard HR salary components based on monthly wage.
 */
export class SalaryService {
  static calculateSalaryComponents(monthlyWage, customConfig = {}) {
    const wage = Math.max(0, Number(monthlyWage) || 0);
    const yearlyWage = wage * 12;

    // Formulas per enterprise standard:
    // 1. Basic: 50% of Monthly Wage
    const basicSalary = wage * 0.50;

    // 2. HRA: 50% of Basic Salary
    const hra = basicSalary * 0.50;

    // 3. Standard Allowance: 16.67% of Wage (approx) or predetermined
    const standardAllowance = wage * (16.67 / 100);

    // 4. Performance Bonus: 8.33% of Basic Salary
    const performanceBonus = basicSalary * (8.333 / 100);

    // 5. Leave Travel Allowance (LTA): 8.33% of Basic Salary
    const lta = basicSalary * (8.333 / 100);

    // 6. Fixed Allowance: Balancing figure (Wage - Sum of other components)
    const otherComponentsSum = basicSalary + hra + standardAllowance + performanceBonus + lta;
    const fixedAllowance = Math.max(0, wage - otherComponentsSum);

    // 7. Provident Fund (PF): 12% of Basic Salary
    const pfRate = (customConfig.pfRate !== undefined ? customConfig.pfRate : 12) / 100;
    const pfEmployee = basicSalary * pfRate;
    const pfEmployer = basicSalary * pfRate;

    // 8. Professional Tax: Flat ₹200/month
    const professionalTax = customConfig.professionalTax !== undefined ? Number(customConfig.professionalTax) : 200;

    // Gross & Net Take Home
    const grossEarnings = basicSalary + hra + standardAllowance + performanceBonus + lta + fixedAllowance;
    const totalDeductions = pfEmployee + professionalTax;
    const netSalary = Math.max(0, grossEarnings - totalDeductions);

    return {
      monthWage: Math.round(wage * 100) / 100,
      yearlyWage: Math.round(yearlyWage * 100) / 100,
      workingDaysPerWeek: customConfig.workingDaysPerWeek || 5,
      breakTimeHrs: customConfig.breakTimeHrs || 1,
      basicSalary: Math.round(basicSalary * 100) / 100,
      hra: Math.round(hra * 100) / 100,
      standardAllowance: Math.round(standardAllowance * 100) / 100,
      performanceBonus: Math.round(performanceBonus * 100) / 100,
      lta: Math.round(lta * 100) / 100,
      fixedAllowance: Math.round(fixedAllowance * 100) / 100,
      pfEmployee: Math.round(pfEmployee * 100) / 100,
      pfEmployer: Math.round(pfEmployer * 100) / 100,
      professionalTax: Math.round(professionalTax * 100) / 100,
      grossEarnings: Math.round(grossEarnings * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      netSalary: Math.round(netSalary * 100) / 100
    };
  }

  static updateEmployeeSalary(store, employeeId, monthlyWage, config = {}) {
    const state = store.getState();
    const updatedSalary = this.calculateSalaryComponents(monthlyWage, config);

    const updatedEmployees = state.employees.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          salary: updatedSalary
        };
      }
      return emp;
    });

    store.setState({ employees: updatedEmployees }, 'salary_updated');
    return updatedSalary;
  }
}
