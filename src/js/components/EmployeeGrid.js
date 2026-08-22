import { store } from '../state/store.js';

export class EmployeeGridComponent {
  static searchQuery = '';
  static departmentFilter = 'all';

  static render() {
    const state = store.getState();
    const { employees, currentUser } = state;
    const isAdmin = currentUser && currentUser.role === 'admin';

    // Filter employees
    const filteredEmployees = employees.filter(emp => {
      const matchesSearch = !this.searchQuery || 
        emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.loginId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesDept = this.departmentFilter === 'all' || emp.department === this.departmentFilter;

      return matchesSearch && matchesDept;
    });

    const departments = ['all', ...new Set(employees.map(e => e.department))];

    return `
      <div class="container dashboard-container">
        <div class="dashboard-toolbar">
          <div class="toolbar-left">
            <h1 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-right: 0.5rem;">
              Employees
            </h1>
            ${isAdmin ? `
              <button id="btn-new-employee" class="btn btn-primary btn-sm">
                <span>+</span> New Employee
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
            <span class="search-icon">&#128269;</span>
            <input type="text" id="search-employee-input" placeholder="Search by name, ID or department..." value="${this.searchQuery}" />
          </div>
        </div>

        <!-- 3x3 Kanban Employee Grid -->
        <div class="employee-grid">
          ${filteredEmployees.map(emp => {
            // Status Icon/Dot indicator per specifications:
            // 🟢 Present: Green dot
            // ✈️ Leave: Airplane icon
            // 🟡 Absent: Yellow dot
            let statusBadge = '';
            if (emp.status === 'present') {
              statusBadge = `<span class="status-dot dot-green" title="Present in office"></span>`;
            } else if (emp.status === 'leave') {
              statusBadge = `<span title="On approved leave" style="font-size: 1.1rem; line-height: 1;">✈️</span>`;
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
