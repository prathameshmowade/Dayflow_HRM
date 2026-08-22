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