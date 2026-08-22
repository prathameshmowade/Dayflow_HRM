import { store } from '../state/store.js';
import { TimeOffService } from '../services/timeoffService.js';
import { formatDate } from '../utils/formatters.js';
import { showToast } from '../utils/notifications.js';
import { Icons } from '../utils/icons.js';

export class TimeOffViewComponent {
  static render() {
    const state = store.getState();
    const { currentUser, leaveRequests } = state;
    if (!currentUser) return '';

    const isAdmin = currentUser.role === 'admin';
    const quota = TimeOffService.getLeaveQuota(currentUser.id);
    const pendingRequests = TimeOffService.getPendingRequests();
    const myRequests = TimeOffService.getEmployeeRequests(currentUser.id);
    const displayRequests = isAdmin ? leaveRequests : myRequests;

    return `
      <div class="container timeoff-container">
        <div style="margin-bottom: 1.5rem;">
          <h1 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">
            ${isAdmin ? 'Time Off & Leave Governance' : 'My Leave Management'}
          </h1>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
            ${isAdmin ? 'Review employee time-off applications and manage organization leave policies' : 'Apply for paid time off, sick leave, and track approval status'}
          </p>
        </div>

        <!-- Quota Cards -->
        <div class="timeoff-quota-grid">
          <div class="quota-card">
            <div class="quota-card-label">Paid Leave (Annual)</div>
            <div class="quota-card-val" style="color: var(--primary);">${quota.paid.remaining} <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ ${quota.paid.total} Left</span></div>
          </div>
          <div class="quota-card">
            <div class="quota-card-label">Sick Leave</div>
            <div class="quota-card-val" style="color: var(--secondary);">${quota.sick.remaining} <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ ${quota.sick.total} Left</span></div>
          </div>
          <div class="quota-card">
            <div class="quota-card-label">Casual Leave</div>
            <div class="quota-card-val" style="color: #d97706;">${quota.casual.remaining} <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ ${quota.casual.total} Left</span></div>
          </div>
        </div>

        <div class="timeoff-main-layout">
          <!-- Left Column: Submit New Leave Request -->
          <div>
            <div class="timeoff-form-box">
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; color: var(--text-primary);">
                Apply for Time Off
              </h3>

              <form id="apply-leave-form">
                <div class="form-group">
                  <label class="form-label" for="leave-type">Leave Category *</label>
                  <select id="leave-type" class="form-select" required>
                    <option value="Paid Leave">Paid Annual Leave</option>
                    <option value="Sick Leave">Sick / Medical Leave</option>
                    <option value="Casual Leave">Casual / Personal Leave</option>
                  </select>
                </div>

                <div class="flex gap-4">
                  <div class="form-group w-full">
                    <label class="form-label" for="leave-start">Start Date *</label>
                    <input type="date" id="leave-start" class="form-input" required />
                  </div>
                  <div class="form-group w-full">
                    <label class="form-label" for="leave-end">End Date *</label>
                    <input type="date" id="leave-end" class="form-input" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="leave-reason">Reason / Remarks *</label>
                  <textarea id="leave-reason" class="form-textarea" rows="3" placeholder="Briefly describe the reason for time off..." required></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-full" style="padding: 0.7rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                  Submit Leave Request ${Icons.arrowRight(14)}
                </button>
              </form>
            </div>
          </div>

          <!-- Right Column: Approvals (if Admin) & Leave History -->
          <div>
            ${isAdmin ? `
              <!-- Admin Pending Approvals Queue -->
              <div style="margin-bottom: 2rem;">
                <div class="flex items-center justify-between" style="margin-bottom: 1rem;">
                  <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                    <span>${Icons.hourglass(16)}</span> Pending Approvals Queue
                    <span class="badge badge-pending">${pendingRequests.length}</span>
                  </h3>
                </div>

                ${pendingRequests.length > 0 ? pendingRequests.map(req => `
                  <div class="approval-card">
                    <div class="approval-emp-info">
                      <div>
                        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${req.employeeName}</div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.1rem;">
                          <strong>${req.type}</strong> &bull; ${formatDate(req.startDate)} to ${formatDate(req.endDate)} (${req.days} Day${req.days > 1 ? 's' : ''})
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem; font-style: italic;">
                          "${req.reason}"
                        </div>
                      </div>
                    </div>

                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm btn-approve-leave" data-leaveid="${req.id}" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                        ${Icons.check(14)} Approve
                      </button>
                      <button class="btn btn-danger btn-sm btn-reject-leave" data-leaveid="${req.id}" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                        ${Icons.x(14)} Reject
                      </button>
                    </div>
                  </div>
                `).join('') : `
                  <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                    <span style="color: var(--status-present);">${Icons.checkCircle(16)}</span> All leave requests have been reviewed and approved!
                  </div>
                `}
              </div>
            ` : ''}

            <!-- All Requests / History Table -->
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">
                ${isAdmin ? 'All Organization Leave Requests' : 'My Leave Applications History'}
              </h3>

              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      ${isAdmin ? '<th>Employee</th>' : ''}
                      <th>Type</th>
                      <th>Period</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(isAdmin ? leaveRequests : myRequests).map(req => `
                      <tr>
                        ${isAdmin ? `<td><strong>${req.employeeName}</strong></td>` : ''}
                        <td>${req.type}</td>
                        <td>${formatDate(req.startDate)} &rarr; ${formatDate(req.endDate)}</td>
                        <td><strong>${req.days}</strong></td>
                        <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                          ${req.reason}
                        </td>
                        <td>
                          <span class="badge badge-${req.status}">
                            ${req.status === 'approved' ? '✓ Approved' : req.status === 'rejected' ? '✕ Rejected' : '⏳ Pending'}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static attachEvents() {
    // Apply leave form submission
    const form = document.getElementById('apply-leave-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const state = store.getState();
        const type = document.getElementById('leave-type').value;
        const startDate = document.getElementById('leave-start').value;
        const endDate = document.getElementById('leave-end').value;
        const reason = document.getElementById('leave-reason').value;

        TimeOffService.applyLeave({
          employeeId: state.currentUser.id,
          type,
          startDate,
          endDate,
          reason
        });

        form.reset();
      });
    }

    // Approve triggers
    document.querySelectorAll('.btn-approve-leave').forEach(btn => {
      btn.addEventListener('click', () => {
        const leaveId = btn.getAttribute('data-leaveid');
        TimeOffService.approveLeave(leaveId);
      });
    });

    // Reject triggers
    document.querySelectorAll('.btn-reject-leave').forEach(btn => {
      btn.addEventListener('click', () => {
        const leaveId = btn.getAttribute('data-leaveid');
        const reason = prompt('Reason for rejection:', 'Operational requirements');
        if (reason !== null) {
          TimeOffService.rejectLeave(leaveId, reason);
        }
      });
    });
  }
}
