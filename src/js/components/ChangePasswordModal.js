import { store } from '../state/store.js';
import { AuthService } from '../services/authService.js';
import { Icons } from '../utils/icons.js';

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
              <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                ${Icons.lock(20)}
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
                <span id="change-password-alert-icon" style="display: flex; align-items: center;">${Icons.alertTriangle(16)}</span>
                <span id="change-password-alert-msg"></span>
              </div>

              <!-- Current Password -->
              <div class="form-group">
                <label class="form-label" for="cp-current-pass">Current Password *</label>
                <div class="password-input-wrapper">
                  <input 
                    type="password" 
                    id="cp-current-pass" 
                    class="form-input password-field" 
                    placeholder="Enter current password" 
                    required 
                    autocomplete="current-password"
                  />
                  <button type="button" class="password-toggle-btn" data-target="cp-current-pass" title="Toggle visibility" aria-label="Show or hide password">
                    <span class="eye-icon">${Icons.eye(16)}</span>
                  </button>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
                  Default initial password: <code>${currentUser.loginId}@2026</code>
                </div>
              </div>

              <!-- New Password -->
              <div class="form-group">
                <label class="form-label" for="cp-new-pass">New Password *</label>
                <div class="password-input-wrapper">
                  <input 
                    type="password" 
                    id="cp-new-pass" 
                    class="form-input password-field" 
                    placeholder="Enter new password (min. 6 characters)" 
                    required 
                    minlength="6"
                    autocomplete="new-password"
                  />
                  <button type="button" class="password-toggle-btn" data-target="cp-new-pass" title="Toggle visibility" aria-label="Show or hide password">
                    <span class="eye-icon">${Icons.eye(16)}</span>
                  </button>
                </div>
                <!-- Password Strength Meter -->
                <div id="cp-strength-meter" style="margin-top: 0.4rem; display: none;">
                  <div style="display: flex; gap: 4px; height: 4px; margin-bottom: 0.35rem;">
                    <div id="strength-bar-1" style="flex: 1; height: 100%; border-radius: 2px; background: #e2e8f0; transition: background 0.3s;"></div>
                    <div id="strength-bar-2" style="flex: 1; height: 100%; border-radius: 2px; background: #e2e8f0; transition: background 0.3s;"></div>
                    <div id="strength-bar-3" style="flex: 1; height: 100%; border-radius: 2px; background: #e2e8f0; transition: background 0.3s;"></div>
                    <div id="strength-bar-4" style="flex: 1; height: 100%; border-radius: 2px; background: #e2e8f0; transition: background 0.3s;"></div>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted);">
                    <span>Strength: <strong id="strength-label" style="color: var(--text-secondary);">Weak</strong></span>
                    <span id="strength-rule-hint">Min. 6 chars</span>
                  </div>
                </div>
              </div>

              <!-- Confirm New Password -->
              <div class="form-group" style="margin-bottom: 0.5rem;">
                <label class="form-label" for="cp-confirm-pass">Confirm New Password *</label>
                <div class="password-input-wrapper">
                  <input 
                    type="password" 
                    id="cp-confirm-pass" 
                    class="form-input password-field" 
                    placeholder="Re-enter new password" 
                    required 
                    minlength="6"
                    autocomplete="new-password"
                  />
                  <button type="button" class="password-toggle-btn" data-target="cp-confirm-pass" title="Toggle visibility" aria-label="Show or hide password">
                    <span class="eye-icon">${Icons.eye(16)}</span>
                  </button>
                </div>
                <div id="cp-match-status" style="font-size: 0.75rem; margin-top: 0.35rem; display: none;"></div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
              <button type="submit" id="btn-submit-change-password" class="btn btn-primary">
                Update Password ${Icons.arrowRight(14)}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  static open() {
    const modal = document.getElementById('change-password-modal');
    if (!modal) return;

    // Reset fields and alerts
    const form = document.getElementById('change-password-form');
    if (form) form.reset();

    const alertBox = document.getElementById('change-password-alert');
    if (alertBox) alertBox.style.display = 'none';

    const matchStatus = document.getElementById('cp-match-status');
    if (matchStatus) matchStatus.style.display = 'none';

    const strengthMeter = document.getElementById('cp-strength-meter');
    if (strengthMeter) strengthMeter.style.display = 'none';

    // Reset password inputs back to type="password"
    modal.querySelectorAll('.password-field').forEach(input => {
      input.type = 'password';
    });
    modal.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.innerHTML = `<span class="eye-icon">${Icons.eye(16)}</span>`;
      btn.style.opacity = '0.7';
    });

    modal.classList.add('active');

    // Auto-focus current password field
    setTimeout(() => {
      const currentInput = document.getElementById('cp-current-pass');
      if (currentInput) currentInput.focus();
    }, 100);
  }

  static close() {
    const modal = document.getElementById('change-password-modal');
    if (modal) modal.classList.remove('active');
  }

  static attachEvents() {
    const modal = document.getElementById('change-password-modal');
    if (!modal) return;

    // Close buttons handler (Close icon and Cancel button)
    modal.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    });

    // Close when clicking directly on backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.close();
      }
    });

    // Password visibility toggle buttons
    modal.querySelectorAll('.password-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const targetInput = document.getElementById(targetId);
        if (!targetInput) return;

        if (targetInput.type === 'password') {
          targetInput.type = 'text';
          btn.innerHTML = `<span class="eye-icon">${Icons.eyeOff(16)}</span>`;
          btn.style.opacity = '1';
        } else {
          targetInput.type = 'password';
          btn.innerHTML = `<span class="eye-icon">${Icons.eye(16)}</span>`;
          btn.style.opacity = '0.7';
        }
      });
    });

    // Real-time strength calculator
    const newPassInput = document.getElementById('cp-new-pass');
    const strengthMeter = document.getElementById('cp-strength-meter');
    const strengthLabel = document.getElementById('strength-label');
    const b1 = document.getElementById('strength-bar-1');
    const b2 = document.getElementById('strength-bar-2');
    const b3 = document.getElementById('strength-bar-3');
    const b4 = document.getElementById('strength-bar-4');

    const confirmPassInput = document.getElementById('cp-confirm-pass');
    const matchStatus = document.getElementById('cp-match-status');

    if (newPassInput) {
      newPassInput.addEventListener('input', () => {
        const val = newPassInput.value;
        if (!val) {
          if (strengthMeter) strengthMeter.style.display = 'none';
          return;
        }

        if (strengthMeter) strengthMeter.style.display = 'block';

        let score = 0;
        if (val.length >= 6) score++;
        if (val.length >= 10) score++;
        if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score++;

        const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
        const labels = ['Weak', 'Fair', 'Good', 'Strong'];

        [b1, b2, b3, b4].forEach((bar, idx) => {
          if (bar) {
            bar.style.background = idx < score ? colors[score - 1] : '#e2e8f0';
          }
        });

        if (strengthLabel) {
          strengthLabel.textContent = labels[score - 1] || 'Weak';
          strengthLabel.style.color = colors[score - 1] || '#ef4444';
        }

        checkPasswordMatch();
      });
    }

    function checkPasswordMatch() {
      if (!confirmPassInput || !matchStatus) return;
      const newPass = newPassInput?.value || '';
      const confirmPass = confirmPassInput.value || '';

      if (!confirmPass) {
        matchStatus.style.display = 'none';
        return;
      }

      matchStatus.style.display = 'block';
      if (newPass === confirmPass) {
        matchStatus.innerHTML = `<span style="color: #10b981; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">${Icons.checkCircle(14)} Passwords match</span>`;
      } else {
        matchStatus.innerHTML = `<span style="color: #ef4444; font-weight: 600; display: inline-flex; align-items: center; gap: 0.3rem;">${Icons.xCircle(14)} Passwords do not match</span>`;
      }
    }

    if (confirmPassInput) {
      confirmPassInput.addEventListener('input', checkPasswordMatch);
    }

    // Form submit handler
    const form = document.getElementById('change-password-form');
    const alertBox = document.getElementById('change-password-alert');
    const alertMsg = document.getElementById('change-password-alert-msg');

    function showAlert(msg) {
      if (!alertBox || !alertMsg) return;
      alertMsg.textContent = msg;
      alertBox.style.display = 'flex';
    }

    function hideAlert() {
      if (alertBox) alertBox.style.display = 'none';
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAlert();

        const state = store.getState();
        const currentUser = state.currentUser;
        if (!currentUser) return;

        const currentPass = document.getElementById('cp-current-pass')?.value || '';
        const newPass = document.getElementById('cp-new-pass')?.value || '';
        const confirmPass = document.getElementById('cp-confirm-pass')?.value || '';

        if (!currentPass) {
          showAlert('Please enter your current password.');
          return;
        }

        if (newPass.length < 6) {
          showAlert('New password must be at least 6 characters long.');
          return;
        }

        if (newPass !== confirmPass) {
          showAlert('New passwords do not match. Please re-check.');
          return;
        }

        if (newPass === currentPass) {
          showAlert('New password cannot be the same as your current password.');
          return;
        }

        const result = AuthService.changePassword(currentUser.id, currentPass, newPass);
        if (result.success) {
          ChangePasswordModalComponent.close();
          form.reset();
        } else {
          showAlert(result.message || 'Failed to update password. Please check your credentials.');
        }
      });
    }
  }
}
