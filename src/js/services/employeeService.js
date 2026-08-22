import { store } from '../state/store.js';
import { generateEmployeeId, generateDefaultPassword } from '../utils/idGenerator.js';
import { SalaryService } from './salaryService.js';
import { showToast } from '../utils/notifications.js';

export class EmployeeService {
  static getAllEmployees() {
    return store.getState().employees;
  }

  static getEmployeeById(id) {
    return store.getState().employees.find(e => e.id === id);
  }

  static createEmployee({
    firstName,
    lastName,
    email,
    phone,
    designation,
    department,
    manager,
    location,
    monthWage,
    role = 'employee'
  }) {
    const state = store.getState();
    const company = state.company;
    const currentYear = new Date().getFullYear();
    const nextSerial = state.employees.length + 1;

    const loginId = generateEmployeeId(company.name, firstName, lastName, currentYear, nextSerial);
    const defaultPassword = generateDefaultPassword(loginId);
    const salary = SalaryService.calculateSalaryComponents(monthWage || 50000);

    const newEmp = {
      id: `emp_${Date.now()}`,
      loginId,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone: phone || '',
      password: defaultPassword,
      role,
      designation: designation || 'Associate',
      department: department || 'General',
      manager: manager || 'HR Lead',
      location: location || 'Nagpur, India',
      joiningDate: new Date().toISOString().split('T')[0],
      joiningYear: currentYear,
      serialNumber: nextSerial,
      status: 'present',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstName + lastName)}`,
      about: `Team member in ${department} department.`,
      jobLove: 'Excited to contribute to organizational success and collaborative growth.',
      hobbies: 'Technology, reading, and sports.',
      skills: ['Teamwork', 'Communication', department],
      certifications: ['Professional Associate'],
      privateInfo: {
        dob: '2000-01-01',
        address: location || 'Nagpur, MH',
        nationality: 'Indian',
        personalEmail: email,
        gender: 'Not Specified',
        maritalStatus: 'Single',
        bankName: 'HDFC Bank',
        accountNumber: '50100' + Math.floor(100000000 + Math.random() * 900000000),
        ifscCode: 'HDFC0001234',
        panNo: 'PAN' + Math.floor(10000 + Math.random() * 90000) + 'X',
        uanNo: '100' + Math.floor(100000000 + Math.random() * 900000000),
        empCode: `${company.code}-${String(nextSerial).padStart(3, '0')}`
      },
      salary
    };

    store.setState({
      employees: [newEmp, ...state.employees]
    }, 'employee_created');

    showToast(`Employee ${newEmp.name} created! Generated Login ID: ${loginId}`, 'success', 6000);
    return newEmp;
  }

  static updateEmployeeProfile(employeeId, partialData, isAdmin = false) {
    const state = store.getState();
    const updatedEmployees = state.employees.map(emp => {
      if (emp.id === employeeId) {
        if (isAdmin) {
          return {
            ...emp,
            ...partialData,
            name: partialData.firstName && partialData.lastName ? `${partialData.firstName} ${partialData.lastName}` : emp.name
          };
        } else {
          // Employee limited editing permissions
          return {
            ...emp,
            phone: partialData.phone !== undefined ? partialData.phone : emp.phone,
            avatar: partialData.avatar !== undefined ? partialData.avatar : emp.avatar,
            about: partialData.about !== undefined ? partialData.about : emp.about,
            jobLove: partialData.jobLove !== undefined ? partialData.jobLove : emp.jobLove,
            hobbies: partialData.hobbies !== undefined ? partialData.hobbies : emp.hobbies,
            privateInfo: {
              ...emp.privateInfo,
              address: partialData.address !== undefined ? partialData.address : emp.privateInfo.address,
              personalEmail: partialData.personalEmail !== undefined ? partialData.personalEmail : emp.privateInfo.personalEmail
            }
          };
        }
      }
      return emp;
    });

    store.setState({ employees: updatedEmployees }, 'employee_updated');
    showToast('Profile updated successfully!', 'success');
  }
}
