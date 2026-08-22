import { store } from '../state/store.js';
import { AuthService } from '../services/authService.js';

export class ChangePasswordModalComponent {
  static render() {
    const state = store.getState();
    const currentUser = state.currentUser;

    if (!currentUser) return '';

    return `
      <div id="change-password-modal" class="modal-backdrop">
        <div class="modal-card" style="max-width: 480px;">
          <div class="modal-header">
            <div class="flex items-center gap-3">
              <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
                &#128274;
              </div>
              <div>
                <h3 class="modal-title">Change Password</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">
                  Account: <strong>${currentUser.name}</strong> (<span style="font-family: var(--font-mono); color: var(--primary);">${currentUser.loginId}</span>)
                </p>
              </div>
            </div>
            <button class="modal-close-btn" aria-label="Close modal" style="font-size: 1.35rem; line-height: 1; color: var(--text-muted); background: none; border: none; cursor: pointer;">&times;</button>
          </div>

          <form id="change-password-form">
            <div class="modal-body">
              <!-- Error feedback container -->
              <div id="change-password-alert" class="hidden" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1.2rem; background: #fee2e2; border: 1px solid #f87171; color: #b91c1c; display: none; align-items: center; gap: 0.5rem;">
                <span id="change-password-alert-icon">&#9888;</span>
                <span id="change-password-alert-msg"></span>
              </div>
