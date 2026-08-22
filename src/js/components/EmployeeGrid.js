import { store } from '../state/store.js';
import { Icons } from '../utils/icons.js';

export class EmployeeGridComponent {
  static searchQuery = '';
  static departmentFilter = 'all';

  static render() {
    const state = store.getState();
    const { employees, currentUser } = state;
    const isAdmin = currentUser && currentUser.role === 'admin';

    // Filter employees belonging to active company workspace
    const activeCompanyCode = state.company?.code || 'OI';
    const companyEmployees = employees.filter(emp => {
      const empCompanyCode = emp.companyCode || emp.loginId?.substring(0, 2).toUpperCase() || 'OI';
      return empCompanyCode === activeCompanyCode;
    });

    const targetEmployees = companyEmployees.length > 0 ? companyEmployees : employees;

    // Filter employees by search and department
    const filteredEmployees = targetEmployees.filter(emp => {
      const matchesSearch = !this.searchQuery || 
        emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.loginId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesDept = this.departmentFilter === 'all' || emp.department === this.departmentFilter;

      return matchesSearch && matchesDept;
    });

    const departments = ['all', ...new Set(targetEmployees.map(e => e.department))];

    return `
      <div class="container dashboard-container">
        <div class="dashboard-toolbar">
          <div class="toolbar-left">
            <h1 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-right: 0.5rem;">
              Employees
            </h1>
            ${isAdmin ? `
              <button id="btn-new-employee" class="btn btn-primary btn-sm">
                ${Icons.plus(14)} New Employee
              </button>
            ` : ''}

            <select id="filter-department" class="form-select" style="width: auto; padding: 0.4rem 0.8rem; font-size: 0.85rem;">
              ${departments.map(d => `
                <option value="${d}" ${this.departmentFilter === d ? 'selected' : ''}>
                  ${d === 'all' ? 'All Departments' : d}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="toolbar-search">
            <span class="search-icon" style="display: flex; align-items: center;">${Icons.search(15)}</span>
            <input type="text" id="search-employee-input" placeholder="Search by name, ID or department..." value="${this.searchQuery}" />
          </div>
        </div>

        <!-- 3x3 Kanban Employee Grid -->
        <div class="employee-grid">
          ${filteredEmployees.map(emp => {
            let statusBadge = '';
            if (emp.status === 'present') {
              statusBadge = `<span class="status-dot dot-green" title="Present"></span>`;
            } else if (emp.status === 'leave') {
              statusBadge = `<span class="status-dot dot-blue" title="On Leave"></span>`;
            } else {
              statusBadge = `<span class="status-dot dot-yellow" title="Absent"></span>`;
            }

            return `
              <div class="employee-card" data-empid="${emp.id}">
                <div class="card-status-badge">
                  ${statusBadge}
                </div>

                <div class="card-avatar-wrapper">
                  <img src="${emp.avatar}" alt="${emp.name}" class="card-avatar" />
                  <div class="card-info">
                    <div class="card-name">${emp.name}</div>
                    <div class="card-designation">${emp.designation}</div>
                    <div class="card-department">${emp.department}</div>
                  </div>
                </div>

                <div class="card-footer-details">
                  <span class="card-login-id">${emp.loginId}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${emp.location}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  static attachEvents() {
    // Search input
    const searchInput = document.getElementById('search-employee-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        store.emit('filter_change');
      });
    }

    // Department filter
    const deptSelect = document.getElementById('filter-department');
    if (deptSelect) {
      deptSelect.addEventListener('change', (e) => {
        this.departmentFilter = e.target.value;
        store.emit('filter_change');
      });
    }

    // Click Card -> Opens View-Only Profile Mode
    document.querySelectorAll('.employee-card').forEach(card => {
      card.addEventListener('click', () => {
        const empId = card.getAttribute('data-empid');
        store.setState({
          selectedEmployeeId: empId,
          activeView: 'profile'
        }, 'view_employee_profile');
      });
    });

    // "New Employee" Modal Trigger (Admin only)
    const newEmpBtn = document.getElementById('btn-new-employee');
    if (newEmpBtn) {
      newEmpBtn.addEventListener('click', () => {
        const modal = document.getElementById('new-employee-modal');
        if (modal) modal.classList.add('active');
      });
    }
  }
}
