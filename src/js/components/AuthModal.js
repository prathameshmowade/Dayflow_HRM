import { AuthService } from '../services/authService.js';
import { store } from '../state/store.js';

export class AuthModalComponent {
  static mode = 'signin'; // 'signin' | 'signup'

  static render() {
    const isSignup = this.mode === 'signup';

    return `
      <div class="auth-page-wrapper">
        <!-- Background HR Interview Image Layer with Gaussian Blur -->
        <div class="auth-image-bg"></div>

        <!-- Subtle Ambient Gradient Overlay -->
        <div class="auth-gradient-overlay"></div>

        <!-- Centered Login / Registration Card -->
        <div class="auth-centered-card ${isSignup ? 'signup-mode' : ''}">
          <div class="auth-card-header">
            <div class="brand-logo-badge" style="font-size: 1.25rem; padding: 0.35rem 1.25rem; box-shadow: 0 4px 12px rgba(113, 75, 103, 0.25); display: inline-block;">
              dayflow
            </div>
            <h2 style="font-size: 1.55rem; font-weight: 800; color: var(--text-primary); margin-top: 0.75rem; letter-spacing: -0.4px;">
              ${isSignup ? 'Register Your Organization' : 'Welcome to Dayflow HRM'}
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
              ${isSignup ? 'Initialize your company workspace & administrator profile' : 'Every workday, perfectly aligned.'}
            </p>
          </div>

          <div class="auth-card-body">
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

        <div style="text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: var(--text-secondary);">
          Don't have an Account? 
          <a href="#" id="toggle-to-signup" style="font-weight: 700; color: var(--primary);">Sign Up</a>
        </div>

        <!-- Quick Demo Profiles Pill Container -->
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px dashed var(--border-color); text-align: center;">