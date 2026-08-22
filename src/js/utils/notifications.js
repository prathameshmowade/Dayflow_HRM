import { Icons } from './icons.js';

/**
 * Toast Notification System
 */
export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? Icons.checkCircle(16) : type === 'error' ? Icons.xCircle(16) : type === 'warning' ? Icons.alertTriangle(16) : Icons.info(16);
  
  toast.innerHTML = `
    <span class="toast-icon" style="display: flex; align-items: center;">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close" style="display: flex; align-items: center; justify-content: center; cursor: pointer; background: none; border: none;">${Icons.x(14)}</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const timer = setTimeout(() => {
    removeToast(toast);
  }, duration);

  function removeToast(el) {
    clearTimeout(timer);
    el.classList.remove('show');
    el.classList.add('hide');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 250);
  }
}
