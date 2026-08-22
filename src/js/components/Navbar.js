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