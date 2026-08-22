import { store } from '../state/store.js';
import { AuthService } from '../services/authService.js';
import { AttendanceService } from '../services/attendanceService.js';

export class NavbarComponent {
  static render() {
    const state = store.getState();
    const { company, currentUser, activeView, checkInState } = state;

    if (!currentUser) return '';

    const isAdmin = currentUser.role === 'admin';
    const isCheckedIn = checkInState.isCheckedIn;

    return `
      <header class="navbar">
        <div class="nav-container">
          <div class="flex items-center">
            <a href="#employees" class="nav-brand" data-nav="employees">
              <span class="brand-logo-badge">${company.logoText || 'dayflow'}</span>
              <span>Dayflow</span>
            </a>

            <nav class="nav-links">
              <button class="nav-item ${activeView === 'employees' ? 'active' : ''}" data-nav="employees">
                Employees
              </button>
              <button class="nav-item ${activeView === 'attendance' ? 'active' : ''}" data-nav="attendance">
                Attendance
              </button>
              <button class="nav-item ${activeView === 'timeoff' ? 'active' : ''}" data-nav="timeoff">
                Time Off
              </button>
              <button class="nav-item ${activeView === 'payroll' ? 'active' : ''}" data-nav="payroll">
                Payroll
              </button>
            </nav>
          </div>

          <div class="nav-actions">
            <!-- Header Systray: Live Check In / Check Out Clock Widget -->
            <div class="systray-clock-widget">
              <div class="systray-status-indicator">
                <span class="status-dot ${isCheckedIn ? 'dot-green' : 'dot-red'}"></span>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">
                  ${isCheckedIn ? `Since ${checkInState.checkInTime || '09:30 AM'}` : 'Clocked Out'}
                </span>
              </div>
              <button id="systray-clock-btn" class="btn btn-sm btn-clock ${isCheckedIn ? 'btn-clock-out' : 'btn-clock-in'}">
                ${isCheckedIn ? 'Check Out &rarr;' : 'Check IN &rarr;'}
              </button>
            </div>

            <!-- Profile Dropdown -->
            <div class="user-menu-wrapper">
              <button id="nav-user-btn" class="user-avatar-btn" aria-haspopup="true">
                <img src="${currentUser.avatar}" alt="${currentUser.name}" class="user-avatar-img" />
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">${currentUser.firstName}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">&#9662;</span>
              </button>

              <div id="nav-user-dropdown" class="user-menu-dropdown">
                <div class="dropdown-header">
                  <div class="dropdown-user-name">${currentUser.name}</div>
                  <div class="dropdown-user-role">${currentUser.designation} &bull; <strong>${currentUser.role.toUpperCase()}</strong></div>
                  <div style="font-size: 0.75rem; color: var(--primary); font-family: var(--font-mono); margin-top: 0.2rem;">${currentUser.loginId}</div>
                </div>

                <button class="dropdown-item" id="dropdown-my-profile">
                  <span>&#128100;</span> My Profile
                </button>

                <div style="padding: 0.4rem 1rem; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                  Switch User (Demo)
                </div>
                ${state.employees.map(emp => `
                  <button class="dropdown-item switch-user-item" data-empid="${emp.id}" style="${emp.id === currentUser.id ? 'font-weight: 700; color: var(--primary);' : ''}">
                    <span class="status-dot ${emp.status === 'present' ? 'dot-green' : emp.status === 'leave' ? 'dot-blue' : 'dot-yellow'}"></span>
                    ${emp.name} (${emp.role})
                  </button>
                `).join('')}

                <div style="border-top: 1px solid var(--border-color); margin-top: 0.3rem;"></div>
                <button class="dropdown-item danger" id="dropdown-logout">
                  <span>&#128682;</span> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  static attachEvents() {
    // Navigation links
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-nav');
        store.setState({ activeView: view }, 'nav_change');
      });
    });

    // Systray Clock Toggle
    const clockBtn = document.getElementById('systray-clock-btn');
    if (clockBtn) {
      clockBtn.addEventListener('click', () => {
        const state = store.getState();
        if (state.checkInState.isCheckedIn) {
          AttendanceService.checkOut(state.currentUser.id);
        } else {
          AttendanceService.checkIn(state.currentUser.id);
        }
      });
    }

    // User Dropdown toggle
    const userBtn = document.getElementById('nav-user-btn');
    const dropdown = document.getElementById('nav-user-dropdown');
    if (userBtn && dropdown) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('active');
      });
    }

    // My Profile trigger
    const profileBtn = document.getElementById('dropdown-my-profile');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        const state = store.getState();
        store.setState({
          activeView: 'profile',
          selectedEmployeeId: state.currentUser.id
        }, 'view_profile');
      });
    }

    // User switcher triggers
    document.querySelectorAll('.switch-user-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const empId = e.currentTarget.getAttribute('data-empid');
        AuthService.switchUser(empId);
      });
    });

    // Logout
    const logoutBtn = document.getElementById('dropdown-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AuthService.logout();
      });
    }
  }
}
