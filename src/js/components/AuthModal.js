import { AuthService } from '../services/authService.js';
import { store } from '../state/store.js';

export class AuthModalComponent {
  static mode = 'signin'; // 'signin' | 'signup'

  static render() {
    const isSignup = this.mode === 'signup';

    return `
      <div class="modal-backdrop active" style="z-index: 10000; background: linear-gradient(135deg, rgba(113, 75, 103, 0.9) 0%, rgba(1, 126, 132, 0.9) 100%);">
        <div class="modal-card" style="max-width: 480px; box-shadow: var(--shadow-xl); border: 1px solid rgba(255,255,255,0.2);">
          <div class="modal-header" style="text-align: center; justify-content: center; flex-direction: column; gap: 0.5rem; border: none; padding-top: 2rem;">
            <div class="brand-logo-badge" style="font-size: 1.2rem; padding: 0.4rem 1rem;">odoo / dayflow</div>
            <h2 class="modal-title" style="font-size: 1.5rem; margin-top: 0.5rem;">
              ${isSignup ? 'Register Your Company' : 'Welcome to Dayflow HRM'}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              ${isSignup ? 'Set up your organization and admin credentials' : 'Every workday, perfectly aligned.'}
            </p>
          </div>

          <div class="modal-body" style="padding: 1.5rem 2rem;">
            ${isSignup ? this.renderSignupForm() : this.renderSigninForm()}
          </div>
        </div>
      </div>
    `;
  }

  static renderSigninForm() {
    return `
      <form id="signin-form">
        <div class="form-group">
          <label class="form-label" for="signin-login-id">Login ID or Work Email</label>
          <input type="text" id="signin-login-id" class="form-input" placeholder="e.g. OIPRMO20220001 or prathamesh@odooindia.com" required value="OIPRMO20220001" />
        </div>

        <div class="form-group">
          <label class="form-label" for="signin-password">Password</label>
          <input type="password" id="signin-password" class="form-input" placeholder="••••••••" required value="OIPRMO20220001@2026" />
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-size: 0.8rem;">
          <span style="color: var(--text-muted);">Default password: <code>[LoginID]@2026</code></span>
        </div>

        <button type="submit" class="btn btn-primary w-full" style="padding: 0.75rem; font-size: 1rem;">
          Sign In &rarr;
        </button>

        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-secondary);">
          Don't have an Account? 
          <a href="#" id="toggle-to-signup" style="font-weight: 700; color: var(--primary);">Sign Up</a>
        </div>

        <!-- Quick Demo Profiles Pill Container -->
        <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px dashed var(--border-color); text-align: center;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
            ⚡ Quick Demo Accounts
          </div>
          <div class="flex gap-2 justify-center" style="flex-wrap: wrap;">
            <button type="button" class="btn btn-outline btn-sm demo-autofill" data-login="OIPRMO20220001" data-pass="OIPRMO20220001@2026">
              👑 Prathamesh (Admin)
            </button>
            <button type="button" class="btn btn-outline btn-sm demo-autofill" data-login="OIYAKA20230002" data-pass="OIYAKA20230002@2026">
              💻 Yash (Employee)
            </button>
            <button type="button" class="btn btn-outline btn-sm demo-autofill" data-login="OIDHBH20230003" data-pass="OIDHBH20230003@2026">
              📊 Dhanshree (Employee)
            </button>
            <button type="button" class="btn btn-outline btn-sm demo-autofill" data-login="OINEMU20240004" data-pass="OINEMU20240004@2026">
              📋 Neha (Employee)
            </button>
          </div>
        </div>
      </form>
    `;
  }

  static renderSignupForm() {
    return `
      <form id="signup-form">
        <div class="form-group">
          <label class="form-label" for="signup-company">Company Name</label>
          <input type="text" id="signup-company" class="form-input" placeholder="e.g. Odoo India" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="signup-name">Admin Full Name</label>
          <input type="text" id="signup-name" class="form-input" placeholder="e.g. John Doe" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="signup-email">Work Email</label>
          <input type="email" id="signup-email" class="form-input" placeholder="admin@company.com" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="signup-phone">Phone Number</label>
          <input type="tel" id="signup-phone" class="form-input" placeholder="+91 98765 43210" />
        </div>

        <div class="form-group">
          <label class="form-label" for="signup-password">Password</label>
          <input type="password" id="signup-password" class="form-input" placeholder="••••••••" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="signup-confirm-password">Confirm Password</label>
          <input type="password" id="signup-confirm-password" class="form-input" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn btn-primary w-full" style="padding: 0.75rem; font-size: 1rem; margin-top: 0.5rem;">
          Sign Up & Initialize Company &rarr;
        </button>

        <div style="text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-secondary);">
          Already have an account? 
          <a href="#" id="toggle-to-signin" style="font-weight: 700; color: var(--primary);">Sign In</a>
        </div>
      </form>
    `;
  }

  static attachEvents() {
    // Toggle sign in / sign up
    const toSignup = document.getElementById('toggle-to-signup');
    if (toSignup) {
      toSignup.addEventListener('click', (e) => {
        e.preventDefault();
        this.mode = 'signup';
        store.emit('auth_mode_change');
      });
    }

    const toSignin = document.getElementById('toggle-to-signin');
    if (toSignin) {
      toSignin.addEventListener('click', (e) => {
        e.preventDefault();
        this.mode = 'signin';
        store.emit('auth_mode_change');
      });
    }

    // Demo autofills
    document.querySelectorAll('.demo-autofill').forEach(btn => {
      btn.addEventListener('click', () => {
        const login = btn.getAttribute('data-login');
        const pass = btn.getAttribute('data-pass');
        const loginInput = document.getElementById('signin-login-id');
        const passInput = document.getElementById('signin-password');
        if (loginInput) loginInput.value = login;
        if (passInput) passInput.value = pass;
      });
    });

    // Handle signin submission
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
      signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginId = document.getElementById('signin-login-id').value;
        const password = document.getElementById('signin-password').value;
        AuthService.login(loginId, password);
      });
    }

    // Handle signup submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const companyName = document.getElementById('signup-company').value;
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
          alert('Passwords do not match.');
          return;
        }

        AuthService.signupCompany({ companyName, name, email, phone, password });
      });
    }
  }
}
