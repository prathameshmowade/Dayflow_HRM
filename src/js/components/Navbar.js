import { store } from '../state/store.js';
import { AuthService } from '../services/authService.js';
import { AttendanceService } from '../services/attendanceService.js';
import { ChangePasswordModalComponent } from './ChangePasswordModal.js';

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
              <span>Dayflow <span style="font-weight: 500; font-size: 0.85rem; color: var(--text-secondary); opacity: 0.85;">&bull; ${company.name || 'Enterprise'}</span></span>
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

                <button class="dropdown-item" id="dropdown-change-password">
                  <span>&#128273;</span> Change Password
                </button>

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