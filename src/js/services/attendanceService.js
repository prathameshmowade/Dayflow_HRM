import { store } from '../state/store.js';
import { calculateHoursDifference, formatTime12 } from '../utils/formatters.js';
import { showToast } from '../utils/notifications.js';

export class AttendanceService {
  static checkIn(employeeId) {
    const state = store.getState();
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toTimeString().substring(0, 5); // '09:30'

    // Check if record exists for today
    const existingIndex = state.attendanceRecords.findIndex(
      r => r.employeeId === employeeId && r.date === todayStr
    );

    let updatedRecords = [...state.attendanceRecords];

    if (existingIndex >= 0) {
      updatedRecords[existingIndex] = {
        ...updatedRecords[existingIndex],
        checkIn: nowTimeStr,
        status: 'present'
      };
    } else {
      updatedRecords.push({
        id: `att_${Date.now()}`,
        employeeId,
        date: todayStr,
        checkIn: nowTimeStr,
        checkOut: null,
        workHours: '00:00',
        extraHours: '00:00',
        status: 'present'
      });
    }

    // Update employee status to 'present'
    const updatedEmployees = state.employees.map(emp => {
      if (emp.id === employeeId) return { ...emp, status: 'present' };
      return emp;
    });

    store.setState({
      attendanceRecords: updatedRecords,
      employees: updatedEmployees,
      checkInState: {
        isCheckedIn: true,
        checkInTime: formatTime12(nowTimeStr),
        timestamp: Date.now()
      }
    }, 'attendance_checkin');

    showToast(`Checked in successfully at ${formatTime12(nowTimeStr)}!`, 'success');
  }

  static checkOut(employeeId) {
    const state = store.getState();
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toTimeString().substring(0, 5); // '18:30'

    const existingIndex = state.attendanceRecords.findIndex(
      r => r.employeeId === employeeId && r.date === todayStr
    );

    let updatedRecords = [...state.attendanceRecords];

    if (existingIndex >= 0) {
      const rec = updatedRecords[existingIndex];
      const { workHours, extraHours } = calculateHoursDifference(rec.checkIn || '09:00', nowTimeStr);
      
      updatedRecords[existingIndex] = {
        ...rec,
        checkOut: nowTimeStr,
        workHours,
        extraHours,
        status: 'present'
      };
    } else {
      updatedRecords.push({
        id: `att_${Date.now()}`,
        employeeId,
        date: todayStr,
        checkIn: '09:00',
        checkOut: nowTimeStr,
        workHours: '08:00',
        extraHours: '00:00',
        status: 'present'
      });
    }

    store.setState({
      attendanceRecords: updatedRecords,
      checkInState: {
        isCheckedIn: false,
        checkInTime: null,
        timestamp: null
      }
    }, 'attendance_checkout');

    showToast(`Checked out successfully at ${formatTime12(nowTimeStr)}!`, 'info');
  }

  static getMonthlyAttendance(employeeId, year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
    const state = store.getState();
    const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

    const records = state.attendanceRecords.filter(
      r => r.employeeId === employeeId && r.date.startsWith(monthPrefix)
    );

    const daysPresent = records.filter(r => r.status === 'present').length;
    const totalWorkingDays = 22; // Standard monthly working days

    return {
      records,
      daysPresent,
      currentCount: records.length,
      totalWorkingDays
    };
  }

  static getOrgDailyAttendance(dateString = new Date().toISOString().split('T')[0]) {
    const state = store.getState();
    return state.employees.map(emp => {
      const record = state.attendanceRecords.find(
        r => r.employeeId === emp.id && r.date === dateString
      );

      const leave = state.leaveRequests.find(
        l => l.employeeId === emp.id && 
             l.status === 'approved' && 
             dateString >= l.startDate && 
             dateString <= l.endDate
      );

      let effectiveStatus = emp.status;
      if (leave) {
        effectiveStatus = 'leave';
      } else if (record && record.checkIn) {
        effectiveStatus = 'present';
      }

      return {
        employee: emp,
        checkIn: record?.checkIn || '--:--',
        checkOut: record?.checkOut || '--:--',
        workHours: record?.workHours || '00:00',
        extraHours: record?.extraHours || '00:00',
        status: effectiveStatus,
        leaveReason: leave?.reason || null
      };
    });
  }
}
