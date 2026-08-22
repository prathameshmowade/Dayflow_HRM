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