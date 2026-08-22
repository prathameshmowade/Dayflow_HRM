import { store } from './state/store.js';
import { NavbarComponent } from './components/Navbar.js';
import { AuthModalComponent } from './components/AuthModal.js';
import { EmployeeGridComponent } from './components/EmployeeGrid.js';
import { EmployeeModalComponent } from './components/EmployeeModal.js';
import { ProfileViewComponent } from './components/ProfileView.js';
import { AttendanceViewComponent } from './components/AttendanceView.js';
import { TimeOffViewComponent } from './components/TimeOffView.js';
import { PayrollViewComponent } from './components/PayrollView.js';

class App {
  constructor() {
    this.appRoot = document.getElementById('app');
    this.init();
  }

  init() {
    // Subscribe to all state mutations to re-render UI reactively
    store.subscribe('*', () => this.render());

    // Initial render
    this.render();
  }

  render() {
    const state = store.getState();
    const { currentUser, activeView } = state;

    // 1. If not authenticated, render Auth Modal
    if (!currentUser || activeView === 'login') {
      this.appRoot.innerHTML = AuthModalComponent.render();
      AuthModalComponent.attachEvents();
      return;
    }

    // 2. Main Authenticated App Layout
    let viewContent = '';

    switch (activeView) {
      case 'profile':
        viewContent = ProfileViewComponent.render();
        break;
      case 'attendance':
        viewContent = AttendanceViewComponent.render();
        break;
      case 'timeoff':
        viewContent = TimeOffViewComponent.render();
        break;
      case 'payroll':
        viewContent = PayrollViewComponent.render();
        break;
      case 'employees':
      default:
        viewContent = EmployeeGridComponent.render();
        break;
    }

    this.appRoot.innerHTML = `
      ${NavbarComponent.render()}
      <main id="main-content" style="flex: 1;">
        ${viewContent}
      </main>
      ${EmployeeModalComponent.render()}
      
      <!-- Footer -->
      <footer style="border-top: 1px solid var(--border-color); padding: 1.5rem 0; background: var(--bg-surface); margin-top: auto; text-align: center; font-size: 0.85rem; color: var(--text-muted);">
        <div class="container flex justify-between items-center" style="flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <strong>Dayflow HRM</strong> &bull; Built with pride by <strong>Team Pragati 2.0</strong>
          </div>
          <div>
            Prathamesh Mowade &bull; Yash Kapse &bull; Dhanshree Bhorkar &bull; Neha Ashok Musale
          </div>
        </div>
      </footer>
    `;

    // Attach Component Event Listeners
    NavbarComponent.attachEvents();
    EmployeeModalComponent.attachEvents();

    if (activeView === 'employees') {
      EmployeeGridComponent.attachEvents();
    } else if (activeView === 'profile') {
      ProfileViewComponent.attachEvents();
    } else if (activeView === 'attendance') {
      AttendanceViewComponent.attachEvents();
    } else if (activeView === 'timeoff') {
      TimeOffViewComponent.attachEvents();
    } else if (activeView === 'payroll') {
      PayrollViewComponent.attachEvents();
    }
  }
}

// Bootstrap Dayflow HRM application on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
