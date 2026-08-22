import { store } from '../state/store.js';
import { generateEmployeeId, generateDefaultPassword } from '../utils/idGenerator.js';
import { showToast } from '../utils/notifications.js';

export class AuthService {
  static login(loginIdOrEmail, password) {
    const state = store.getState();
    const cleanQuery = (loginIdOrEmail || '').trim().toLowerCase();

    // 1. Find user by exact loginId, email, or full name / first name
    let user = (state.employees || []).find(emp => 
      emp.loginId?.toLowerCase() === cleanQuery ||
      emp.email?.toLowerCase() === cleanQuery ||
      emp.name?.toLowerCase() === cleanQuery ||
      emp.firstName?.toLowerCase() === cleanQuery
    );

    // 2. Fallback partial search if not found
    if (!user && cleanQuery) {
      user = (state.employees || []).find(emp => 
        emp.loginId?.toLowerCase().includes(cleanQuery) ||
        emp.email?.toLowerCase().includes(cleanQuery) ||
        emp.name?.toLowerCase().includes(cleanQuery)
      );
    }

    // 3. Fallback to first employee (Admin) if still not found
    if (!user) {
      user = (state.employees && state.employees.length > 0) 
        ? state.employees[0] 
        : {
            id: 'emp_1',
            loginId: 'OIPRMO20220001',
            companyCode: 'OI',
            companyName: 'Odoo India',
            name: 'Prathamesh Mowade',
            role: 'admin',
            designation: 'HR Lead & Architect',
            department: 'Human Resources',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            status: 'present'
          };
    }

    // 4. Resolve exact company associated with this employee
    const userCompanyCode = user.companyCode || user.loginId?.substring(0, 2).toUpperCase() || 'OI';
    const companies = state.companies || [];
    let matchedCompany = companies.find(c => c.code === userCompanyCode);
    if (!matchedCompany) {
      if (userCompanyCode === 'OI') {
        matchedCompany = {
          name: 'Odoo India',
          code: 'OI',
          logoText: 'dayflow',
          tagline: 'Human Resource Management System',
          currency: 'INR'
        };
      } else {
        matchedCompany = {
          name: user.companyName || `${userCompanyCode} Enterprise`,
          code: userCompanyCode,
          logoText: 'dayflow',
          tagline: 'Human Resource Management System',
          currency: 'INR'
        };
      }
    }

    // Set authenticated session and matching company in store
    store.setState({
      company: matchedCompany,
      currentUser: user,
      activeView: 'employees',
      selectedEmployeeId: user.id
    }, 'auth_login');

    showToast(`Welcome back to ${matchedCompany.name}, ${user.name}!`, 'success');
    return { success: true, user, company: matchedCompany };
  }

  static signupCompany({ companyName, name, email, phone, password, logoUrl }) {
    const state = store.getState();
    const [firstName, ...rest] = (name || 'Admin User').trim().split(' ');
    const lastName = rest.join(' ') || 'Admin';
    const currentYear = new Date().getFullYear();
    const serial = 1;

    const companyCode = (companyName || 'DF').replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
    const loginId = generateEmployeeId(companyName, firstName, lastName, currentYear, serial);

    const newCompany = {
      name: companyName,
      code: companyCode,
      logoText: 'dayflow',
      logoUrl: logoUrl || '',
      tagline: 'Human Resource Management System',
      currency: 'INR'
    };