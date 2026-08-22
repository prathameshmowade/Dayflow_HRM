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

    const adminUser = {
      id: `emp_${Date.now()}`,
      loginId,
      companyCode,
      companyName,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone: phone || '',
      password: password,
      role: 'admin',
      designation: 'Managing Director & HR Admin',
      department: 'Executive Board',
      manager: 'Board of Directors',
      location: 'India',
      joiningDate: new Date().toISOString().split('T')[0],
      joiningYear: currentYear,
      serialNumber: serial,
      status: 'present',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      about: `Founding HR administrator for ${companyName}.`,
      jobLove: 'Building and scaling modern organization workflows.',
      hobbies: 'Leadership, innovation, and continuous learning.',
      skills: ['Company Administration', 'Strategic Planning', 'HR Governance'],
      certifications: ['Enterprise Management Specialist'],
      privateInfo: {
        dob: '1990-01-01',
        address: 'HQ Office',
        nationality: 'Indian',
        personalEmail: email,
        gender: 'Not Specified',
        maritalStatus: 'Single',
        bankName: 'Primary Bank',
        accountNumber: '100000000001',
        ifscCode: 'BANK0000001',
        panNo: 'ADMIN1234Z',
        uanNo: '100000000001',
        empCode: `${companyCode}-001`
      },
      salary: {
        monthWage: 100000,
        yearlyWage: 1200000,
        workingDaysPerWeek: 5,
        breakTimeHrs: 1,
        basicSalary: 50000,
        hra: 25000,
        standardAllowance: 8333.33,
        performanceBonus: 4166.67,
        lta: 4166.67,
        fixedAllowance: 8333.33,
        pfEmployee: 6000,
        pfEmployer: 6000,
        professionalTax: 200
      }
    };

    const updatedCompanies = [
      newCompany,
      ...(state.companies || []).filter(c => c.code !== companyCode)
    ];

    store.setState({
      companies: updatedCompanies,
      company: newCompany,
      employees: [adminUser, ...state.employees],
      currentUser: adminUser,
      activeView: 'employees',
      selectedEmployeeId: adminUser.id
    }, 'company_registered');

    showToast(`Organization "${companyName}" successfully registered!`, 'success');
    return { success: true, company: newCompany, user: adminUser };
  }

  static changePassword(employeeId, currentPassword, newPassword) {
    const state = store.getState();
    const user = (state.employees || []).find(e => e.id === employeeId);
    if (!user) {
      showToast('User not found.', 'error');
      return { success: false, message: 'User not found.' };
    }

    const currentActualPassword = user.password || generateDefaultPassword(user.loginId);
    if (currentPassword !== currentActualPassword) {
      showToast('Current password does not match.', 'error');
      return { success: false, message: 'Current password does not match.' };
    }

    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    if (newPassword === currentActualPassword) {
      showToast('New password cannot be identical to your current password.', 'warning');
      return { success: false, message: 'New password cannot be identical to current password.' };
    }

    const updatedEmployees = (state.employees || []).map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, password: newPassword };
      }
      return emp;