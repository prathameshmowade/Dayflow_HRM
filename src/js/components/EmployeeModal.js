import { store } from '../state/store.js';
import { EmployeeService } from '../services/employeeService.js';
import { generateEmployeeId } from '../utils/idGenerator.js';
import { formatCurrencyINR } from '../utils/formatters.js';
import { Icons } from '../utils/icons.js';

export class EmployeeModalComponent {
  static render() {
    const state = store.getState();
    const company = state.company;
    const currentYear = new Date().getFullYear();
    const nextSerial = state.employees.length + 1;

    return `
      <div id="new-employee-modal" class="modal-backdrop">
        <div class="modal-card" style="max-width: 650px;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Create New Employee</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
                System automatically provisions Login ID and default credentials
              </p>
            </div>
            <button class="modal-close-btn" style="font-size: 1.25rem; color: var(--text-muted);">&times;</button>
          </div>

          <form id="new-employee-form">
            <div class="modal-body">
              <!-- Live Generated Login ID Preview Banner -->
              <div style="background: var(--primary-light); border: 1px solid var(--primary); border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">
                    Auto-Provisioned Login ID
                  </div>
                  <div id="live-generated-id" style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 800; color: var(--primary);">
                    ${generateEmployeeId(company.name, 'John', 'Doe', currentYear, nextSerial)}
                  </div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: right;">
                  Format: <code>[CO][FN][LN][YR][SR]</code>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="form-group w-full">
                  <label class="form-label" for="new-fn">First Name *</label>
                  <input type="text" id="new-fn" class="form-input live-id-trigger" placeholder="e.g. John" required />
                </div>
                <div class="form-group w-full">
                  <label class="form-label" for="new-ln">Last Name *</label>
                  <input type="text" id="new-ln" class="form-input live-id-trigger" placeholder="e.g. Doe" required />
                </div>
              </div>

              <div class="flex gap-4">
                <div class="form-group w-full">
                  <label class="form-label" for="new-email">Work Email *</label>
                  <input type="email" id="new-email" class="form-input" placeholder="john.doe@company.com" required />
                </div>
                <div class="form-group w-full">
                  <label class="form-label" for="new-phone">Mobile Phone</label>
                  <input type="tel" id="new-phone" class="form-input" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div class="flex gap-4">
                <div class="form-group w-full">
                  <label class="form-label" for="new-designation">Job Title / Designation *</label>
                  <input type="text" id="new-designation" class="form-input" placeholder="e.g. Senior Software Engineer" required />
                </div>
                <div class="form-group w-full">
                  <label class="form-label" for="new-department">Department *</label>
                  <select id="new-department" class="form-select" required>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div class="flex gap-4">
                <div class="form-group w-full">
                  <label class="form-label" for="new-wage">Monthly Wage (INR ₹) *</label>
                  <input type="number" id="new-wage" class="form-input" value="50000" min="10000" step="1000" required />
                </div>
                <div class="form-group w-full">
                  <label class="form-label" for="new-role">System Role *</label>
                  <select id="new-role" class="form-select" required>
                    <option value="employee">Regular Employee (Self-Service)</option>
                    <option value="admin">Admin / HR Officer (Full Access)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
              <button type="submit" class="btn btn-primary" style="display: flex; align-items: center; gap: 0.4rem;">
                Create & Issue Credentials ${Icons.arrowRight(14)}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  static attachEvents() {
    const modal = document.getElementById('new-employee-modal');
    if (!modal) return;

    // Close buttons
    modal.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    });

    // Real-time ID generation preview
    const fnInput = document.getElementById('new-fn');
    const lnInput = document.getElementById('new-ln');
    const liveIdDisplay = document.getElementById('live-generated-id');

    function updateLiveId() {
      const state = store.getState();
      const company = state.company;
      const fn = fnInput?.value || 'John';
      const ln = lnInput?.value || 'Doe';
      const currentYear = new Date().getFullYear();
      const nextSerial = state.employees.length + 1;
      if (liveIdDisplay) {
        liveIdDisplay.textContent = generateEmployeeId(company.name, fn, ln, currentYear, nextSerial);
      }
    }

    if (fnInput) fnInput.addEventListener('input', updateLiveId);
    if (lnInput) lnInput.addEventListener('input', updateLiveId);

    // Handle Form Submit
    const form = document.getElementById('new-employee-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = document.getElementById('new-fn').value;
        const lastName = document.getElementById('new-ln').value;
        const email = document.getElementById('new-email').value;
        const phone = document.getElementById('new-phone').value;
        const designation = document.getElementById('new-designation').value;
        const department = document.getElementById('new-department').value;
        const monthWage = Number(document.getElementById('new-wage').value);
        const role = document.getElementById('new-role').value;

        EmployeeService.createEmployee({
          firstName,
          lastName,
          email,
          phone,
          designation,
          department,
          monthWage,
          role
        });

        modal.classList.remove('active');
        form.reset();
      });
    }
  }
}
