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