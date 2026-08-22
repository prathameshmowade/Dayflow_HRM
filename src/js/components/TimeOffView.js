import { store } from '../state/store.js';
import { TimeOffService } from '../services/timeoffService.js';
import { formatDate } from '../utils/formatters.js';

export class TimeOffViewComponent {
  static render() {
    const state = store.getState();
    const { currentUser, leaveRequests } = state;
    if (!currentUser) return '';

    const isAdmin = currentUser.role === 'admin';
    const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
    const myRequests = leaveRequests.filter(r => r.employeeId === currentUser.id);

    return `
      <div class="container timeoff-container">
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">
            Time Off & Leave Management
          </h1>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
            Submit time off requests and monitor approval workflows
          </p>
        </div>

        <div class="timeoff-layout-grid">
          <!-- Left Column: Apply for Leave & Balance Chips -->
          <div>
            <div class="leave-balance-card" style="margin-bottom: 1.5rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">Leave Quota Balance</h3>
              <div class="leave-balance-grid">
                <div class="leave-chip">
                  <div class="leave-chip-count">14</div>
                  <div class="leave-chip-label">Paid Leave</div>
                </div>
                <div class="leave-chip">
                  <div class="leave-chip-count">7</div>
                  <div class="leave-chip-label">Sick Leave</div>
                </div>
                <div class="leave-chip">
                  <div class="leave-chip-count">&infin;</div>
                  <div class="leave-chip-label">Unpaid Leave</div>
                </div>
              </div>
            </div>

            <!-- Apply Leave Card -->
            <div class="leave-balance-card">
              <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--primary); margin-bottom: 1.25rem;">
                Apply for Time Off
              </h3>
              <form id="apply-leave-form">
                <div class="form-group">
                  <label class="form-label" for="leave-type">Leave Category *</label>
                  <select id="leave-type" class="form-select" required>
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                <div class="flex gap-2">
                  <div class="form-group w-full">
                    <label class="form-label" for="leave-start">Start Date *</label>
                    <input type="date" id="leave-start" class="form-input" required value="${new Date().toISOString().split('T')[0]}" />
                  </div>
                  <div class="form-group w-full">
                    <label class="form-label" for="leave-end">End Date *</label>
                    <input type="date" id="leave-end" class="form-input" required value="${new Date().toISOString().split('T')[0]}" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="leave-reason">Reason / Remarks *</label>
                  <textarea id="leave-reason" class="form-textarea" rows="3" placeholder="Briefly describe the reason for time off..." required></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-full" style="padding: 0.7rem;">
                  Submit Leave Request &rarr;
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
                    <span>&#9203;</span> Pending Approvals Queue
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
                      <button class="btn btn-success btn-sm btn-approve-leave" data-leaveid="${req.id}">
                        &#10003; Approve
                      </button>
                      <button class="btn btn-danger btn-sm btn-reject-leave" data-leaveid="${req.id}">
                        &#10005; Reject
                      </button>
                    </div>
                  </div>
                `).join('') : `
                  <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                    &#10003; All leave requests have been reviewed and approved!
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
