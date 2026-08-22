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