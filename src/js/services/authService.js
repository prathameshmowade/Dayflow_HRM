import { store } from '../state/store.js';
import { generateEmployeeId, generateDefaultPassword } from '../utils/idGenerator.js';
import { showToast } from '../utils/notifications.js';

export class AuthService {
  static login(loginIdOrEmail, password) {
    const state = store.getState();
    const cleanQuery = (loginIdOrEmail || '').trim().toLowerCase();