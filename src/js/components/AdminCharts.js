import { store } from '../state/store.js';
import { formatCurrencyINR } from '../utils/formatters.js';
import { Icons } from '../utils/icons.js';

export class AdminChartsComponent {
  static activeChartTab = 'overview'; // 'overview' | 'departments' | 'attendance'

  static render(employees, leaveRequests, attendanceRecords) {
    const state = store.getState();
    const totalEmployees = employees.length;
    
    // 1. Calculate Presence Metrics
    const presentCount = employees.filter(e => e.status === 'present').length;
    const leaveCount = employees.filter(e => e.status === 'leave').length;
    const absentCount = employees.filter(e => e.status === 'absent').length;
    const presenceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

    // 2. Department Distribution & Payroll Breakdown
    const deptMap = {};
    employees.forEach(emp => {
      const dept = emp.department || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { count: 0, totalWage: 0, employees: [] };
      }
      deptMap[dept].count += 1;
      const wage = emp.salary?.monthWage || 50000;
      deptMap[dept].totalWage += wage;
      deptMap[dept].employees.push(emp);
    });

    const deptColors = {
      'Engineering': '#017E84',
      'Human Resources': '#714B67',
      'Finance & Accounts': '#f59e0b',
      'Design': '#ec4899',
      'Marketing': '#6366f1',
      'Operations': '#10b981',
      'Executive Board': '#8b5cf6'
    };

    const totalMonthlyPayroll = Object.values(deptMap).reduce((acc, d) => acc + d.totalWage, 0);
    const pendingLeaveCount = (leaveRequests || []).filter(r => r.status === 'pending').length;

    // SVG Donut calculation for Department Distribution
    let accumulatedAngle = 0;
    const donutSlices = Object.entries(deptMap).map(([dept, data], idx) => {
      const percentage = totalEmployees > 0 ? (data.count / totalEmployees) : 0;
      const strokeDash = `${percentage * 283} 283`;
      const strokeOffset = -accumulatedAngle * 2.83;
      accumulatedAngle += percentage * 100;
      const color = deptColors[dept] || '#94a3b8';

      return {
        dept,
        count: data.count,
        percentage: Math.round(percentage * 100),
        totalWage: data.totalWage,
        color,
        strokeDash,
        strokeOffset
      };
    });

    // 7-day attendance simulation for trend bar chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    const trendData = [
      { day: 'Mon', present: Math.max(1, totalEmployees - 1), leave: 1, absent: 0 },
      { day: 'Tue', present: totalEmployees, leave: 0, absent: 0 },
      { day: 'Wed', present: Math.max(1, totalEmployees - 2), leave: 1, absent: 1 },
      { day: 'Thu', present: totalEmployees, leave: 0, absent: 0 },
      { day: 'Fri', present: Math.max(1, totalEmployees - 1), leave: 1, absent: 0 },
      { day: 'Sat', present: Math.max(1, Math.round(totalEmployees * 0.7)), leave: 0, absent: totalEmployees - Math.round(totalEmployees * 0.7) },
      { day: 'Today', present: presentCount, leave: leaveCount, absent: absentCount }
    ];

    return `
      <div class="admin-analytics-wrapper">
        <!-- Analytics Header & KPI Stats Strip -->
        <div class="analytics-kpi-grid">
          <!-- Card 1: Total Headcount -->
          <div class="kpi-metric-card">
            <div class="kpi-card-header">
              <span class="kpi-label">Total Workforce</span>
              <span class="kpi-icon-badge" style="background: rgba(113, 75, 103, 0.12); color: var(--primary);">
                ${Icons.users(18)}
              </span>
            </div>
            <div class="kpi-value-row">
              <span class="kpi-main-val">${totalEmployees}</span>
              <span class="kpi-pill success">+100% Active</span>
            </div>
            <div class="kpi-subtext">Across ${Object.keys(deptMap).length} operational departments</div>
          </div>

          <!-- Card 2: Presence Rate -->
          <div class="kpi-metric-card">
            <div class="kpi-card-header">
              <span class="kpi-label">Today's Attendance</span>
              <span class="kpi-icon-badge" style="background: rgba(16, 185, 129, 0.12); color: #10b981;">
                ${Icons.clock(18)}
              </span>
            </div>
            <div class="kpi-value-row">
              <span class="kpi-main-val" style="color: #10b981;">${presenceRate}%</span>
              <span class="kpi-pill present">${presentCount} Present</span>
            </div>
            <div class="kpi-subtext">${leaveCount} on leave &bull; ${absentCount} unannounced</div>
          </div>

          <!-- Card 3: Monthly Compensation CTC -->
          <div class="kpi-metric-card">
            <div class="kpi-card-header">
              <span class="kpi-label">Monthly Payroll</span>
              <span class="kpi-icon-badge" style="background: rgba(1, 126, 132, 0.12); color: var(--secondary);">
                ${Icons.dollarSign(18)}
              </span>
            </div>
            <div class="kpi-value-row">
              <span class="kpi-main-val" style="font-size: 1.35rem;">${formatCurrencyINR(totalMonthlyPayroll)}</span>
            </div>
            <div class="kpi-subtext">Avg. ${formatCurrencyINR(totalEmployees > 0 ? Math.round(totalMonthlyPayroll / totalEmployees) : 0)} / employee</div>
          </div>

          <!-- Card 4: Action Queue -->
          <div class="kpi-metric-card">
            <div class="kpi-card-header">
              <span class="kpi-label">Pending Reviews</span>
              <span class="kpi-icon-badge" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
                ${Icons.hourglass(18)}
              </span>
            </div>
            <div class="kpi-value-row">
              <span class="kpi-main-val" style="color: ${pendingLeaveCount > 0 ? '#f59e0b' : 'var(--text-primary)'};">${pendingLeaveCount}</span>
              <span class="kpi-pill ${pendingLeaveCount > 0 ? 'warning' : 'neutral'}">${pendingLeaveCount > 0 ? 'Action Req.' : 'Clear'}</span>
            </div>
            <div class="kpi-subtext">Leave requests awaiting authorization</div>
          </div>
        </div>

        <!-- Interactive Charts Row -->
        <div class="analytics-charts-grid">
          <!-- Chart 1: Department Distribution Donut -->
          <div class="chart-box">
            <div class="chart-box-header">
              <div>
                <h3 class="chart-title">Workforce by Department</h3>
                <p class="chart-subtitle">Team allocation & operational spread</p>
              </div>
              <span class="chart-badge">${Object.keys(deptMap).length} Teams</span>
            </div>

            <div class="donut-chart-container">
              <!-- SVG Donut Chart -->
              <div class="donut-svg-wrapper">
                <svg viewBox="0 0 100 100" class="donut-chart-svg">
                  <circle class="donut-ring-bg" cx="50" cy="50" r="45" />
                  ${donutSlices.map(slice => `
                    <circle 
                      class="donut-segment interactive-slice" 
                      cx="50" 
                      cy="50" 
                      r="45"
                      stroke="${slice.color}" 
                      stroke-dasharray="${slice.strokeDash}" 
                      stroke-dashoffset="${slice.strokeOffset}"
                      data-dept="${slice.dept}"
                      data-count="${slice.count}"
                      data-pct="${slice.percentage}"
                    />
                  `).join('')}
                </svg>
                <div class="donut-center-label">
                  <span class="donut-center-val">${totalEmployees}</span>
                  <span class="donut-center-sub">Total Staff</span>
                </div>
              </div>

              <!-- Interactive Legend -->
              <div class="chart-legend-list">
                ${donutSlices.map(slice => `
                  <div class="legend-row-item interactive-dept-trigger" data-dept="${slice.dept}" title="Filter by ${slice.dept}">
                    <div class="legend-row-left">
                      <span class="legend-color-dot" style="background: ${slice.color};"></span>
                      <span class="legend-dept-name">${slice.dept}</span>
                    </div>
                    <div class="legend-row-right">
                      <span class="legend-count-pill">${slice.count}</span>
                      <span class="legend-pct-text">${slice.percentage}%</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Chart 2: Weekly Presence & Attendance Pulse -->
          <div class="chart-box">
            <div class="chart-box-header">
              <div>
                <h3 class="chart-title">Attendance & Presence Pulse</h3>
                <p class="chart-subtitle">Daily office presence velocity (7-day trend)</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="status-indicator-legend"><span class="dot dot-green"></span> Present</span>
                <span class="status-indicator-legend"><span class="dot dot-blue"></span> Leave</span>
              </div>
            </div>

            <div class="attendance-pulse-chart">
              <div class="pulse-bars-wrapper">
                ${trendData.map(item => {
                  const maxH = Math.max(1, totalEmployees);
                  const presentH = Math.round((item.present / maxH) * 100);
                  const leaveH = Math.round((item.leave / maxH) * 100);
                  const isToday = item.day === 'Today';

                  return `
                    <div class="pulse-bar-column ${isToday ? 'highlight-today' : ''}" title="${item.day}: ${item.present} Present, ${item.leave} On Leave">
                      <div class="pulse-bar-track">
                        <div class="pulse-bar-fill leave-fill" style="height: ${leaveH}%;"></div>
                        <div class="pulse-bar-fill present-fill" style="height: ${presentH}%;"></div>
                      </div>
                      <span class="pulse-day-label">${item.day}</span>
                      <span class="pulse-count-label">${item.present}/${totalEmployees}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Chart 3: Department Payroll Budget Allocation -->
          <div class="chart-box chart-box-full">
            <div class="chart-box-header">
              <div>
                <h3 class="chart-title">Monthly Payroll Budget Allocation by Department</h3>
                <p class="chart-subtitle">Total compensation distribution & average salary comparison</p>
              </div>
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--primary); font-size: 0.95rem;">
                Total: ${formatCurrencyINR(totalMonthlyPayroll)}/mo
              </span>
            </div>

            <div class="payroll-bars-grid">
              ${donutSlices.map(slice => {
                const pctOfPayroll = totalMonthlyPayroll > 0 ? Math.round((slice.totalWage / totalMonthlyPayroll) * 100) : 0;
                const avgWage = slice.count > 0 ? Math.round(slice.totalWage / slice.count) : 0;

                return `
                  <div class="payroll-dept-progress-row">
                    <div class="payroll-row-meta">
                      <div class="flex items-center gap-2">
                        <span class="legend-color-dot" style="background: ${slice.color};"></span>
                        <strong style="color: var(--text-primary); font-size: 0.85rem;">${slice.dept}</strong>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">(${slice.count} staff)</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Avg: ${formatCurrencyINR(avgWage)}</span>
                        <strong style="font-size: 0.85rem; color: var(--primary); font-family: var(--font-mono);">${formatCurrencyINR(slice.totalWage)}</strong>
                        <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); width: 35px; text-align: right;">${pctOfPayroll}%</span>
                      </div>
                    </div>
                    <div class="progress-track-bg">
                      <div class="progress-track-fill" style="width: ${pctOfPayroll}%; background: ${slice.color};"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static attachEvents() {
    // Click on legend item or donut slice to filter the department immediately!
    document.querySelectorAll('.interactive-dept-trigger').forEach(item => {
      item.addEventListener('click', () => {
        const dept = item.getAttribute('data-dept');
        const deptSelect = document.getElementById('filter-department');
        if (deptSelect && dept) {
          deptSelect.value = dept;
          deptSelect.dispatchEvent(new Event('change'));
        }
      });
    });
  }
}
