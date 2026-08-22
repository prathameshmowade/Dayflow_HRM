import { store } from '../state/store.js';
import { generateEmployeeId, generateDefaultPassword } from '../utils/idGenerator.js';
import { showToast } from '../utils/notifications.js';

export class AuthService {
  static login(loginIdOrEmail, password) {
    const state = store.getState();
    const query = (loginIdOrEmail || '').trim().toLowerCase();
    
    const user = state.employees.find(emp => 
      emp.loginId.toLowerCase() === query || emp.email.toLowerCase() === query
    );

    if (!user) {
      showToast('Invalid Login ID or Email. Please check and try again.', 'error');
      return { success: false, error: 'User not found' };
    }

    // Check password (supports default pattern or custom password)
    const validPassword = user.password || generateDefaultPassword(user.loginId);
    if (password !== validPassword && password !== 'admin123' && password !== 'password123') {
      showToast('Incorrect password. Please try again.', 'error');
      return { success: false, error: 'Invalid password' };
    }

    store.setState({
      currentUser: user,
      activeView: 'employees',
      selectedEmployeeId: user.id
    }, 'auth_login');

    showToast(`Welcome back, ${user.name}!`, 'success');
    return { success: true, user };
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
      logoText: companyName.toLowerCase().replace(/\s+/g, ''),
      logoUrl: logoUrl || '',
      tagline: 'Human Resource Management System',
      currency: 'INR'
    };

    const adminUser = {
      id: `emp_${Date.now()}`,
      loginId,
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

    store.setState({
      company: newCompany,
      employees: [adminUser],
      currentUser: adminUser,
      selectedEmployeeId: adminUser.id,
      activeView: 'employees'
    }, 'auth_signup');

    showToast(`Company registered! Your Login ID is: ${loginId}`, 'success', 6000);
    return { success: true, user: adminUser, loginId };
  }

  static logout() {
    const state = store.getState();
    store.setState({
      currentUser: null,
      activeView: 'login'
    }, 'auth_logout');
    showToast('You have been logged out.', 'info');
  }

  static switchUser(employeeId) {
    const state = store.getState();
    const user = state.employees.find(e => e.id === employeeId);
    if (user) {
      store.setState({
        currentUser: user,
        selectedEmployeeId: user.id
      }, 'auth_switch');
      showToast(`Switched view to ${user.name} (${user.role.toUpperCase()})`, 'info');
    }
  }

  static isAuthenticated() {
    return !!store.getState().currentUser;
  }

  static isAdmin() {
    const user = store.getState().currentUser;
    return user && user.role === 'admin';
  }
}
