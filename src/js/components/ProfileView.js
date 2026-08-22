import { store } from '../state/store.js';
import { EmployeeService } from '../services/employeeService.js';
import { SalaryService } from '../services/salaryService.js';
import { formatCurrencyINR, formatDate } from '../utils/formatters.js';

export class ProfileViewComponent {
  static activeTab = 'resume'; // 'resume' | 'private' | 'salary'

  static render() {
    const state = store.getState();
    const { employees, selectedEmployeeId, currentUser } = state;
    const employee = employees.find(e => e.id === selectedEmployeeId) || currentUser;
    if (!employee) return '';

    const isAdmin = currentUser && currentUser.role === 'admin';
    const isOwnProfile = currentUser && currentUser.id === employee.id;

    const salary = employee.salary || SalaryService.calculateSalaryComponents(50000);

    return `
      <div class="container">
        <div style="margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
          <button id="btn-back-to-grid" class="btn btn-outline btn-sm">
            &larr; Back to Employees
          </button>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Mode: <strong>${isAdmin ? 'Admin Edit Mode' : (isOwnProfile ? 'Employee Self-Service' : 'View-Only Mode')}</strong>
          </div>
        </div>

        <div class="profile-view-card">
          <!-- Profile Top Header Grid -->
          <div class="profile-header-grid">
            <div class="profile-avatar-container">
              <img src="${employee.avatar}" alt="${employee.name}" class="profile-avatar-large" />
              ${(isAdmin || isOwnProfile) ? `
                <div class="profile-avatar-edit-badge" title="Change Avatar" id="btn-edit-avatar">&#9998;</div>
              ` : ''}
            </div>

            <div class="profile-primary-meta">
              <h2 class="profile-name-title">${employee.name}</h2>
              <div class="profile-meta-row">
                <span class="profile-meta-label">Login ID:</span>
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--primary);">${employee.loginId}</span>
              </div>
              <div class="profile-meta-row">
                <span class="profile-meta-label">Email:</span>
                <span>${employee.email}</span>
              </div>
              <div class="profile-meta-row">
                <span class="profile-meta-label">Mobile:</span>
                <span>${employee.phone || '--'}</span>
              </div>
            </div>

            <div class="profile-org-meta">
              <div class="profile-meta-row">
                <span class="profile-meta-label">Company:</span>
                <strong>${state.company.name}</strong>
              </div>
              <div class="profile-meta-row">
                <span class="profile-meta-label">Department:</span>
                <span>${employee.department}</span>
              </div>
              <div class="profile-meta-row">
                <span class="profile-meta-label">Manager:</span>
                <span>${employee.manager || 'HR Lead'}</span>
              </div>
              <div class="profile-meta-row">
                <span class="profile-meta-label">Location:</span>
                <span>${employee.location || 'Nagpur, India'}</span>
              </div>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div class="tabs-nav">
            <button class="tab-btn ${this.activeTab === 'resume' ? 'active' : ''}" data-tab="resume">
              Resume
            </button>
            <button class="tab-btn ${this.activeTab === 'private' ? 'active' : ''}" data-tab="private">
              Private Info
            </button>
            ${isAdmin ? `
              <button class="tab-btn ${this.activeTab === 'salary' ? 'active' : ''}" data-tab="salary" style="color: #b45309;">
                &#128274; Salary Info (Admin Only)
              </button>
            ` : ''}
          </div>

          <!-- Tab 1: Resume -->
          <div id="tab-content-resume" class="${this.activeTab === 'resume' ? '' : 'hidden'}">
            <div class="resume-grid">
              <div>
                <div class="resume-section-box">
                  <div class="section-box-header">
                    <span class="section-box-title">&#128221; About</span>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                    ${employee.about || 'No description provided.'}
                  </p>
                </div>

                <div class="resume-section-box">
                  <div class="section-box-header">
                    <span class="section-box-title">&#10084;&#65039; What I love about my job</span>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                    ${employee.jobLove || 'Collaborating with great minds.'}
                  </p>
                </div>

                <div class="resume-section-box">
                  <div class="section-box-header">
                    <span class="section-box-title">&#127912; My interests and hobbies</span>
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
                    ${employee.hobbies || 'Continuous learning and technology.'}
                  </p>
                </div>
              </div>

              <div>
                <div class="resume-section-box">
                  <div class="section-box-header">
                    <span class="section-box-title">&#9889; Skills</span>
                    ${isAdmin || isOwnProfile ? `<button id="btn-add-skill" class="btn btn-outline btn-sm">+ Add Skill</button>` : ''}
                  </div>
                  <div class="tag-cloud">
                    ${(employee.skills || []).map(skill => `<span class="tag-chip">${skill}</span>`).join('')}
                  </div>
                </div>

                <div class="resume-section-box">
                  <div class="section-box-header">
                    <span class="section-box-title">&#127891; Certifications</span>
                    ${isAdmin || isOwnProfile ? `<button id="btn-add-cert" class="btn btn-outline btn-sm">+ Add Certification</button>` : ''}
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${(employee.certifications || []).map(cert => `
                      <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); padding: 0.35rem 0.5rem; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        &#10003; ${cert}
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Private Info -->
          <div id="tab-content-private" class="${this.activeTab === 'private' ? '' : 'hidden'}">
            <div class="private-info-grid">
              <div>
                <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary);">Personal Details</h4>
                <div class="form-group">
                  <label class="form-label">Date of Birth</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.dob || '1998-01-01'}" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">Residing Address</label>
                  <input type="text" id="edit-address" class="form-input" value="${employee.privateInfo?.address || ''}" ${(!isAdmin && !isOwnProfile) ? 'disabled' : ''} />
                </div>
                <div class="form-group">
                  <label class="form-label">Nationality</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.nationality || 'Indian'}" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">Personal Email</label>
                  <input type="email" id="edit-personal-email" class="form-input" value="${employee.privateInfo?.personalEmail || ''}" ${(!isAdmin && !isOwnProfile) ? 'disabled' : ''} />
                </div>
                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.gender || 'Not Specified'}" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">Date of Joining</label>
                  <input type="text" class="form-input" value="${formatDate(employee.joiningDate)}" disabled />
                </div>
              </div>

              <div>
                <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary);">Bank & Regulatory Details</h4>
                <div class="form-group">
                  <label class="form-label">Bank Name</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.bankName || 'HDFC Bank'}" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">Account Number</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.accountNumber || '••••••••••'}" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">IFSC Code</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.ifscCode || 'HDFC0001234'}" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">PAN Number</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.panNo || '••••••••••'}" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">UAN Number</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.uanNo || '••••••••••••'}" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">Employee Code</label>
                  <input type="text" class="form-input" value="${employee.privateInfo?.empCode || employee.loginId}" disabled />
                </div>
              </div>
            </div>

            ${(isAdmin || isOwnProfile) ? `
              <div style="margin-top: 1.5rem; text-align: right;">
                <button id="btn-save-private-info" class="btn btn-primary">Save Profile Changes</button>
              </div>
            ` : ''}
          </div>

          <!-- Tab 3: Salary Info (Admin Only) -->
          ${isAdmin ? `
            <div id="tab-content-salary" class="${this.activeTab === 'salary' ? '' : 'hidden'}">
              <div class="salary-banner-admin-only">
                <span>&#128274;</span> <strong>Admin Restricted Area:</strong> Salary Information is strictly confidential and managed exclusively by HR Administrators.
              </div>

              <!-- Top Metrics -->
              <div class="salary-top-metrics">
                <div class="metric-box">
                  <div class="metric-label">Monthly Wage</div>
                  <div class="metric-value">${formatCurrencyINR(salary.monthWage)}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Yearly Wage</div>
                  <div class="metric-value">${formatCurrencyINR(salary.yearlyWage)}</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Working Days / Week</div>
                  <div class="metric-value">${salary.workingDaysPerWeek} Days</div>
                </div>
                <div class="metric-box">
                  <div class="metric-label">Break Time</div>
                  <div class="metric-value">${salary.breakTimeHrs} hr/day</div>
                </div>
              </div>

              <!-- Interactive Dynamic Wage Modifier -->
              <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <div>
                  <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">Update Defined Base Monthly Wage</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">All salary components, allowances and PF contributions will dynamically recalculate.</div>
                </div>
                <div class="flex gap-2 items-center">
                  <input type="number" id="input-modify-wage" class="form-input" style="width: 160px; font-weight: 700;" value="${salary.monthWage}" min="10000" step="1000" />
                  <button id="btn-recalculate-salary" class="btn btn-primary btn-sm">Update & Recalculate</button>
                </div>
              </div>

              <!-- Detailed Component Table Breakdown -->
              <div class="salary-breakdown-grid">
                <div>
                  <h4 style="font-weight: 700; margin-bottom: 1rem; color: var(--primary);">Salary Components & Allowances</h4>
                  <table class="salary-table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Basic Salary</strong>
                          <span class="salary-component-desc">50% of monthly wage</span>
                        </td>
                        <td style="text-align: right; font-weight: 700;">${formatCurrencyINR(salary.basicSalary)}</td>
                        <td style="text-align: right; color: var(--text-muted); font-size: 0.8rem;">50.00%</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>House Rent Allowance (HRA)</strong>
                          <span class="salary-component-desc">50% of basic salary</span>
                        </td>
                        <td style="text-align: right; font-weight: 700;">${formatCurrencyINR(salary.hra)}</td>
                        <td style="text-align: right; color: var(--text-muted); font-size: 0.8rem;">50.00% (Basic)</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Standard Allowance</strong>
                          <span class="salary-component-desc">Predetermined fixed allowance</span>
                        </td>
                        <td style="text-align: right; font-weight: 700;">${formatCurrencyINR(salary.standardAllowance)}</td>
                        <td style="text-align: right; color: var(--text-muted); font-size: 0.8rem;">16.67%</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Performance Bonus</strong>
                          <span class="salary-component-desc">8.33% of basic salary</span>
                        </td>
                        <td style="text-align: right; font-weight: 700;">${formatCurrencyINR(salary.performanceBonus)}</td>
                        <td style="text-align: right; color: var(--text-muted); font-size: 0.8rem;">8.33% (Basic)</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Leave Travel Allowance (LTA)</strong>
                          <span class="salary-component-desc">8.33% of basic salary</span>
                        </td>
                        <td style="text-align: right; font-weight: 700;">${formatCurrencyINR(salary.lta)}</td>
                        <td style="text-align: right; color: var(--text-muted); font-size: 0.8rem;">8.33% (Basic)</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Fixed Allowance</strong>
                          <span class="salary-component-desc">Balancing amount = Wage &minus; Sum(Components)</span>
                        </td>
                        <td style="text-align: right; font-weight: 700; color: var(--primary);">${formatCurrencyINR(salary.fixedAllowance)}</td>
                        <td style="text-align: right; color: var(--text-muted); font-size: 0.8rem;">Balancing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 style="font-weight: 700; margin-bottom: 1rem; color: var(--primary);">Statutory Deductions & Contributions</h4>
                  <table class="salary-table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Provident Fund (Employee)</strong>
                          <span class="salary-component-desc">12% deducted from basic</span>
                        </td>
                        <td style="text-align: right; font-weight: 700; color: var(--status-offline);">&minus; ${formatCurrencyINR(salary.pfEmployee)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Provident Fund (Employer)</strong>
                          <span class="salary-component-desc">12% contributed by company</span>
                        </td>
                        <td style="text-align: right; font-weight: 700;">${formatCurrencyINR(salary.pfEmployer)}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Professional Tax (PT)</strong>
                          <span class="salary-component-desc">Flat statutory deduction</span>
                        </td>
                        <td style="text-align: right; font-weight: 700; color: var(--status-offline);">&minus; ${formatCurrencyINR(salary.professionalTax)}</td>
                      </tr>
                      <tr style="background: var(--bg-subtle);">
                        <td style="padding: 1rem 0.5rem;">
                          <strong style="font-size: 1rem;">Net Estimated Payout</strong>
                        </td>
                        <td style="text-align: right; font-weight: 800; font-size: 1.15rem; color: var(--status-present); padding: 1rem 0.5rem;">
                          ${formatCurrencyINR(salary.netSalary || (salary.monthWage - salary.pfEmployee - salary.professionalTax))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  static attachEvents() {
    // Back to grid
    const backBtn = document.getElementById('btn-back-to-grid');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        store.setState({ activeView: 'employees' }, 'back_to_grid');
      });
    }

    // Tabs navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.getAttribute('data-tab');
        store.emit('tab_change');
      });
    });

    // Save Private Info
    const savePrivateBtn = document.getElementById('btn-save-private-info');
    if (savePrivateBtn) {
      savePrivateBtn.addEventListener('click', () => {
        const state = store.getState();
        const address = document.getElementById('edit-address')?.value;
        const personalEmail = document.getElementById('edit-personal-email')?.value;
        const isAdmin = state.currentUser?.role === 'admin';

        EmployeeService.updateEmployeeProfile(state.selectedEmployeeId, {
          address,
          personalEmail
        }, isAdmin);
      });
    }

    // Recalculate Salary (Admin only)
    const recalcBtn = document.getElementById('btn-recalculate-salary');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', () => {
        const state = store.getState();
        const newWage = Number(document.getElementById('input-modify-wage')?.value);
        SalaryService.updateEmployeeSalary(store, state.selectedEmployeeId, newWage);
      });
    }
  }
}
