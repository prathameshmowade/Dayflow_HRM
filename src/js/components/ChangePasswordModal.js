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