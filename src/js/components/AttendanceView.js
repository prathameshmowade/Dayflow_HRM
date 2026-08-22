import { store } from '../state/store.js';
import { AttendanceService } from '../services/attendanceService.js';
import { formatDate } from '../utils/formatters.js';

export class AttendanceViewComponent {
  static selectedDate = new Date().toISOString().split('T')[0];

  static render() {
    const state = store.getState();
    const { currentUser } = state;
    if (!currentUser) return '';

    const isAdmin = currentUser.role === 'admin';

    return `
      <div class="container attendance-container">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">
              ${isAdmin ? 'Organization Attendance Ledger' : 'My Attendance & Working Hours'}
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
              ${isAdmin ? 'Real-time daily presence tracking for all employees' : 'Monthly overview and daily check-in logs'}
            </p>
          </div>

          <!-- Date Selector -->
          <div class="date-navigator">
            <button id="att-prev-day" class="date-nav-btn" title="Previous Day">&larr;</button>
            <span class="current-date-badge" id="att-current-date-label">${formatDate(this.selectedDate)}</span>
            <button id="att-next-day" class="date-nav-btn" title="Next Day">&rarr;</button>
            <button id="att-today-btn" class="btn btn-outline btn-sm" style="margin-left: 0.5rem;">Today</button>
          </div>
        </div>

        ${isAdmin ? this.renderAdminView() : this.renderEmployeeView()}
      </div>
    `;
  }

  static renderEmployeeView() {
    const state = store.getState();
    const { currentUser } = state;
    const monthlyData = AttendanceService.getMonthlyAttendance(currentUser.id);

    return `
      <!-- Employee Top Counters -->
      <div class="attendance-summary-cards">
        <div class="att-card">
          <div class="att-card-label">Count of Days Present</div>
          <div class="att-card-val" style="color: var(--status-present);">${monthlyData.daysPresent}</div>
        </div>
        <div class="att-card">
          <div class="att-card-label">Current Logged Records</div>
          <div class="att-card-val" style="color: var(--secondary);">${monthlyData.currentCount}</div>
        </div>
        <div class="att-card">
          <div class="att-card-label">Total Monthly Working Days</div>
          <div class="att-card-val">${monthlyData.totalWorkingDays}</div>
        </div>
      </div>

      <!-- Employee Attendance Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Work Hours</th>
              <th>Extra Hours (OT)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${monthlyData.records.length > 0 ? monthlyData.records.map(rec => `
              <tr>
                <td><strong>${formatDate(rec.date)}</strong></td>
                <td>${rec.checkIn || '--:--'}</td>
                <td>${rec.checkOut || '--:--'}</td>
                <td><span class="hours-pill">${rec.workHours || '00:00'} hrs</span></td>
                <td>
                  <span class="hours-pill ${rec.extraHours !== '00:00' ? 'hours-overtime' : ''}">
                    ${rec.extraHours || '00:00'} hrs
                  </span>
                </td>
                <td>
                  <span class="badge badge-${rec.status}">${rec.status}</span>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                  No attendance records found for this period. Use the Systray clock to Check In!
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;
  }

  static renderAdminView() {
    const orgDailyData = AttendanceService.getOrgDailyAttendance(this.selectedDate);

    const presentCount = orgDailyData.filter(d => d.status === 'present').length;
    const leaveCount = orgDailyData.filter(d => d.status === 'leave').length;
    const absentCount = orgDailyData.filter(d => d.status === 'absent').length;

    return `
      <!-- Admin Metric Counters -->
      <div class="attendance-summary-cards">
        <div class="att-card">
          <div class="att-card-label">Present Today</div>
          <div class="att-card-val" style="color: var(--status-present);">${presentCount}</div>
        </div>
        <div class="att-card">
          <div class="att-card-label">On Leave</div>
          <div class="att-card-val" style="color: var(--status-leave);">${leaveCount}</div>
        </div>
        <div class="att-card">
          <div class="att-card-label">Absent / Not Checked In</div>
          <div class="att-card-val" style="color: var(--status-absent);">${absentCount}</div>
        </div>
        <div class="att-card">
          <div class="att-card-label">Total Headcount</div>
          <div class="att-card-val">${orgDailyData.length}</div>
        </div>
      </div>

      <!-- Admin Organization Attendance Ledger Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Login ID</th>
              <th>Department</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Work Hours</th>
              <th>Extra Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${orgDailyData.map(row => `
              <tr>
                <td>
                  <div class="flex items-center gap-2">
                    <img src="${row.employee.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                    <div>
                      <div style="font-weight: 700;">${row.employee.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${row.employee.designation}</div>
                    </div>
                  </div>
                </td>
                <td><code style="font-family: var(--font-mono); color: var(--primary); font-size: 0.8rem;">${row.employee.loginId}</code></td>
                <td>${row.employee.department}</td>
                <td>${row.checkIn}</td>
                <td>${row.checkOut}</td>
                <td><span class="hours-pill">${row.workHours} hrs</span></td>
                <td>
                  <span class="hours-pill ${row.extraHours !== '00:00' ? 'hours-overtime' : ''}">
                    ${row.extraHours} hrs
                  </span>
                </td>
                <td>
                  <span class="badge badge-${row.status}">
                    ${row.status === 'present' ? '🟢 Present' : row.status === 'leave' ? '✈️ Leave' : '🟡 Absent'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  static attachEvents() {
    const prevBtn = document.getElementById('att-prev-day');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const d = new Date(this.selectedDate);
        d.setDate(d.getDate() - 1);
        this.selectedDate = d.toISOString().split('T')[0];
        store.emit('date_change');
      });
    }

    const nextBtn = document.getElementById('att-next-day');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const d = new Date(this.selectedDate);
        d.setDate(d.getDate() + 1);
        this.selectedDate = d.toISOString().split('T')[0];
        store.emit('date_change');
      });
    }

    const todayBtn = document.getElementById('att-today-btn');
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        this.selectedDate = new Date().toISOString().split('T')[0];
        store.emit('date_change');
      });
    }
  }
}
