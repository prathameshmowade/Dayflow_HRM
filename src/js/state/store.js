/**
 * Central Reactive State Store with LocalStorage persistence
 */

const STORAGE_KEY = 'dayflow_hrm_state_v1';

const DEFAULT_COMPANIES = [
  {
    name: 'Odoo India',
    code: 'OI',
    logoText: 'dayflow',
    tagline: 'Human Resource Management System',
    currency: 'INR'
  }
];

const DEFAULT_COMPANY = DEFAULT_COMPANIES[0];

const DEFAULT_EMPLOYEES = [
  {
    id: 'emp_1',
    loginId: 'OIPRMO20220001',
    companyCode: 'OI',
    companyName: 'Odoo India',
    firstName: 'Prathamesh',
    lastName: 'Mowade',
    name: 'Prathamesh Mowade',
    email: 'prathamesh@odooindia.com',
    phone: '+91 98234 56789',
    role: 'admin',
    designation: 'HR Lead & Architect',
    department: 'Human Resources',
    manager: 'Management Board',
    location: 'Nagpur, India',
    joiningDate: '2022-01-15',
    joiningYear: 2022,
    serialNumber: 1,
    status: 'present', // 'present' | 'leave' | 'absent'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    about: 'Passionate full-stack developer and HR operations architect dedicated to building high efficiency workflow tools.',
    jobLove: 'Empowering teams with seamless digital tooling and transparent organizational alignment.',
    hobbies: 'Chess, reading system design architecture, and open-source hacking.',
    skills: ['HR Operations', 'System Architecture', 'Node.js', 'PostgreSQL', 'Team Leadership'],
    certifications: ['Certified HR Management Professional (CHRP)', 'Scrum Master Certified (CSM)'],
    privateInfo: {
      dob: '1996-05-12',
      address: 'Plot 45, IT Park Road, Nagpur, MH 440022',
      nationality: 'Indian',
      personalEmail: 'prathamesh.personal@gmail.com',
      gender: 'Male',
      maritalStatus: 'Single',
      bankName: 'HDFC Bank',
      accountNumber: '50100439281920',
      ifscCode: 'HDFC0001234',
      panNo: 'ABCDE1234F',
      uanNo: '100982345678',
      empCode: 'OI-001'
    },
    salary: {
      monthWage: 85000,