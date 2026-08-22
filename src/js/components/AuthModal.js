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