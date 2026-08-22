import { store } from '../state/store.js';
import { PayrollService } from '../services/payrollService.js';
import { formatCurrencyINR, formatDate } from '../utils/formatters.js';
import { Icons } from '../utils/icons.js';

export class PayrollViewComponent {
  static selectedMonth = new Date().getMonth() + 1;
  static selectedYear = new Date().getFullYear();

  static render() {
    const state = store.getState();
    const { currentUser, selectedEmployeeId } = state;
    if (!currentUser) return '';

    const isAdmin = currentUser.role === 'admin';
    const targetEmpId = isAdmin ? (selectedEmployeeId || currentUser.id) : currentUser.id;
    const payslip = PayrollService.generateEmployeePayslip(targetEmpId, this.selectedMonth, this.selectedYear);

    return `
      <div class="container payroll-container">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">
              Payroll & Compensation
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
              Attendance-linked compensation breakdown and digital payslip statements
            </p>
          </div>

          <div class="flex gap-2 items-center">
            <button id="btn-print-payslip" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
              ${Icons.printer(14)} Print / Export Payslip
            </button>
          </div>
        </div>

        ${isAdmin ? this.renderAdminOrgPayroll() : ''}

        <!-- Itemized Payslip Card -->
        <div class="payslip-card" id="printable-payslip">
          <div class="payslip-header">
            <div>
              <div class="payslip-company-title">${payslip.company.name}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                ${payslip.company.tagline} &bull; Tax ID: 27AABCO1234F1Z5
              </div>
            </div>
            <div style="text-align: right;">
              <span class="payslip-period-badge">Payslip for ${payslip.monthName} ${payslip.year}</span>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 0.4rem;">
                Ref: ${payslip.payslipId}
              </div>
            </div>
          </div>

          <!-- Employee & Bank Info Grid -->
          <div class="payslip-meta-grid">
            <div>
              <div style="margin-bottom: 0.4rem;">
                <span style="color: var(--text-muted); width: 100px; display: inline-block;">Employee Name:</span>
                <strong>${payslip.employee.name}</strong>
              </div>
              <div style="margin-bottom: 0.4rem;">
                <span style="color: var(--text-muted); width: 100px; display: inline-block;">Login ID:</span>
                <code style="font-family: var(--font-mono); color: var(--primary); font-weight: 700;">${payslip.employee.loginId}</code>
              </div>
              <div style="margin-bottom: 0.4rem;">
                <span style="color: var(--text-muted); width: 100px; display: inline-block;">Designation:</span>
                <span>${payslip.employee.designation}</span>
              </div>
              <div>
                <span style="color: var(--text-muted); width: 100px; display: inline-block;">Department:</span>
                <span>${payslip.employee.department}</span>
              </div>
            </div>

            <div>
              <div style="margin-bottom: 0.4rem;">
                <span style="color: var(--text-muted); width: 110px; display: inline-block;">Bank Name:</span>
                <span>${payslip.employee.privateInfo?.bankName || 'HDFC Bank'}</span>
              </div>
              <div style="margin-bottom: 0.4rem;">
                <span style="color: var(--text-muted); width: 110px; display: inline-block;">Account No:</span>
                <span>${payslip.employee.privateInfo?.accountNumber || '••••••••••'}</span>
              </div>
              <div style="margin-bottom: 0.4rem;">
                <span style="color: var(--text-muted); width: 110px; display: inline-block;">PAN / UAN:</span>
                <span>${payslip.employee.privateInfo?.panNo || '••••'} / ${payslip.employee.privateInfo?.uanNo || '••••'}</span>
              </div>
              <div>
                <span style="color: var(--text-muted); width: 110px; display: inline-block;">Payable Days:</span>
                <strong style="color: var(--primary);">${payslip.payableDays} / ${payslip.workingDays} Days</strong>
                ${payslip.unpaidLeaves > 0 ? `<span style="font-size: 0.75rem; color: var(--status-offline);">(${payslip.unpaidLeaves} unpaid leave)</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Earnings vs Deductions Tables Grid -->
          <div class="payslip-tables-grid">
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 0.75rem;">
                Earnings Breakdown
              </h4>
              <table class="payslip-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th style="text-align: right;">Amount (INR ₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td style="text-align: right; font-weight: 600;">${formatCurrencyINR(payslip.earnings.basicSalary)}</td>
                  </tr>
                  <tr>
                    <td>House Rent Allowance (HRA)</td>
                    <td style="text-align: right; font-weight: 600;">${formatCurrencyINR(payslip.earnings.hra)}</td>
                  </tr>
                  <tr>
                    <td>Standard Allowance</td>
                    <td style="text-align: right; font-weight: 600;">${formatCurrencyINR(payslip.earnings.standardAllowance)}</td>
                  </tr>
                  <tr>
                    <td>Performance Bonus</td>
                    <td style="text-align: right; font-weight: 600;">${formatCurrencyINR(payslip.earnings.performanceBonus)}</td>
                  </tr>
                  <tr>
                    <td>Leave Travel Allowance</td>
                    <td style="text-align: right; font-weight: 600;">${formatCurrencyINR(payslip.earnings.lta)}</td>
                  </tr>
                  <tr>
                    <td>Fixed Balancing Allowance</td>
                    <td style="text-align: right; font-weight: 600;">${formatCurrencyINR(payslip.earnings.fixedAllowance)}</td>
                  </tr>
                  <tr style="background: var(--bg-subtle);">
                    <td><strong>Gross Total Earnings</strong></td>
                    <td style="text-align: right; font-weight: 800; color: var(--primary);">${formatCurrencyINR(payslip.earnings.totalGross)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 0.75rem;">
                Deductions Breakdown
              </h4>
              <table class="payslip-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th style="text-align: right;">Amount (INR ₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Provident Fund (Employee 12%)</td>
                    <td style="text-align: right; font-weight: 600; color: var(--status-offline);">&minus; ${formatCurrencyINR(payslip.deductions.pfEmployee)}</td>
                  </tr>
                  <tr>
                    <td>Professional Tax (PT)</td>
                    <td style="text-align: right; font-weight: 600; color: var(--status-offline);">&minus; ${formatCurrencyINR(payslip.deductions.professionalTax)}</td>
                  </tr>
                  <tr style="background: var(--bg-subtle);">
                    <td><strong>Total Deductions</strong></td>
                    <td style="text-align: right; font-weight: 800; color: var(--status-offline);">&minus; ${formatCurrencyINR(payslip.deductions.totalDeductions)}</td>
                  </tr>
                </tbody>
              </table>

              <div style="margin-top: 1.5rem; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-secondary);">
                <strong>Note:</strong> Net salary reflects deductions for unexcused absences or unpaid leaves per automated attendance sync policy.
              </div>
            </div>
          </div>

          <!-- Net Pay Payout Banner -->
          <div class="payslip-net-box">
            <div>
              <div style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; opacity: 0.9;">Total Net Salary Disbursed</div>
              <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 0.2rem;">Direct Transfer to ${payslip.employee.privateInfo?.bankName || 'Registered Account'}</div>
            </div>
            <div class="payslip-net-amount">${formatCurrencyINR(payslip.netPayout)}</div>
          </div>
        </div>
      </div>
    `;
  }

  static renderAdminOrgPayroll() {
    const state = store.getState();
    const summary = PayrollService.getOrgPayrollSummary(this.selectedMonth, this.selectedYear);

    return `
      <div style="margin-bottom: 2.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">
          Organization Payroll Ledger (Admin Control)
        </h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Base Monthly Wage</th>
                <th>Payable Days</th>
                <th>Gross Earnings</th>
                <th>Total Deductions</th>
                <th>Net Disbursed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${summary.map(row => `
                <tr style="${row.employee.id === state.selectedEmployeeId ? 'background: #fdf6fa;' : ''}">
                  <td>
                    <div class="flex items-center gap-2">
                      <img src="${row.employee.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" />
                      <strong>${row.employee.name}</strong>
                    </div>
                  </td>
                  <td>${formatCurrencyINR(row.monthWage)}</td>
                  <td><strong>${row.payableDays} / 22</strong></td>
                  <td>${formatCurrencyINR(row.gross)}</td>
                  <td style="color: var(--status-offline);">&minus; ${formatCurrencyINR(row.deductions)}</td>
                  <td style="font-weight: 800; color: var(--status-present);">${formatCurrencyINR(row.netPayout)}</td>
                  <td>
                    <button class="btn btn-outline btn-sm btn-inspect-payslip" data-empid="${row.employee.id}">
                      Inspect Payslip
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  static attachEvents() {
    // Print payslip
    const printBtn = document.getElementById('btn-print-payslip');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Inspect payslip trigger for Admins
    document.querySelectorAll('.btn-inspect-payslip').forEach(btn => {
      btn.addEventListener('click', () => {
        const empId = btn.getAttribute('data-empid');
        store.setState({ selectedEmployeeId: empId }, 'inspect_payslip');
      });
    });
  }
}
