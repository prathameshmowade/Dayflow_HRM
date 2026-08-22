import { store } from '../state/store.js';
import { showToast } from '../utils/notifications.js';

export class TimeOffService {
  static applyLeave({ employeeId, type, startDate, endDate, reason }) {
    const state = store.getState();
    const employee = state.employees.find(e => e.id === employeeId);

    if (!startDate || !endDate) {
      showToast('Please select both start date and end date.', 'error');
      return { success: false };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      showToast('End date cannot be earlier than start date.', 'error');
      return { success: false };
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newRequest = {
      id: `leave_${Date.now()}`,
      employeeId,
      employeeName: employee ? employee.name : 'Employee',
      type: type || 'Paid Leave',
      startDate,
      endDate,
      days: diffDays,
      reason: reason || 'Personal Leave',
      status: 'pending',
      adminComment: '',
      appliedAt: new Date().toISOString()
    };

    store.setState({
      leaveRequests: [newRequest, ...state.leaveRequests]
    }, 'leave_applied');

    showToast(`Leave request submitted for ${diffDays} day(s)! Awaiting approval.`, 'success');
    return { success: true, request: newRequest };
  }

  static approveLeave(leaveId, adminComment = 'Approved') {
    const state = store.getState();
    let targetEmployeeId = null;

    const updatedRequests = state.leaveRequests.map(req => {
      if (req.id === leaveId) {
        targetEmployeeId = req.employeeId;
        return {
          ...req,
          status: 'approved',
          adminComment: adminComment || 'Approved by HR Lead'
        };
      }
      return req;
    });

    // Update employee status to 'leave' if leave covers today
    const todayStr = new Date().toISOString().split('T')[0];
    const targetLeave = state.leaveRequests.find(r => r.id === leaveId);
    
    let updatedEmployees = [...state.employees];
    if (targetLeave && todayStr >= targetLeave.startDate && todayStr <= targetLeave.endDate) {
      updatedEmployees = state.employees.map(emp => {
        if (emp.id === targetEmployeeId) {
          return { ...emp, status: 'leave' };
        }
        return emp;
      });
    }

    store.setState({
      leaveRequests: updatedRequests,
      employees: updatedEmployees
    }, 'leave_approved');

    showToast('Leave request approved successfully!', 'success');
  }

  static rejectLeave(leaveId, adminComment = 'Declined due to operational requirements') {
    const state = store.getState();
    const updatedRequests = state.leaveRequests.map(req => {
      if (req.id === leaveId) {
        return {
          ...req,
          status: 'rejected',
          adminComment: adminComment || 'Rejected by Admin'
        };
      }
      return req;
    });

    store.setState({
      leaveRequests: updatedRequests
    }, 'leave_rejected');

    showToast('Leave request was rejected.', 'info');
  }

  static getEmployeeLeaves(employeeId) {
    const state = store.getState();
    return state.leaveRequests.filter(req => req.employeeId === employeeId);
  }

  static getAllLeaveRequests() {
    const state = store.getState();
    return state.leaveRequests;
  }
}
