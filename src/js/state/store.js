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
      yearlyWage: 1020000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      basicSalary: 42500,
      hra: 21250,
      standardAllowance: 7083.33,
      performanceBonus: 3540.25,
      lta: 3540.25,
      fixedAllowance: 7086.17,
      pfEmployee: 5100,
      pfEmployer: 5100,
      professionalTax: 200
    }
  },
  {
    id: 'emp_2',
    loginId: 'OIYAKA20230002',
    firstName: 'Yash',
    lastName: 'Kapse',
    name: 'Yash Kapse',
    email: 'yash@odooindia.com',
    phone: '+91 91234 56780',
    role: 'employee',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    manager: 'Prathamesh Mowade',
    location: 'Nagpur, India',
    joiningDate: '2023-04-10',
    joiningYear: 2023,
    serialNumber: 2,
    status: 'present',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    about: 'Frontend specialist crafting aesthetic, micro-animated user interfaces and clean component design systems.',
    jobLove: 'Transforming complex business logic into intuitive and stunning user experiences.',
    hobbies: 'UI Design prototyping, coffee brewing, and music production.',
    skills: ['Vanilla CSS', 'JavaScript ES6+', 'React', 'UI/UX Design', 'Performance Tuning'],
    certifications: ['Meta Frontend Developer Professional', 'Google Mobile Web Specialist'],
    privateInfo: {
      dob: '1999-08-24',
      address: '22 Civil Lines, Nagpur, MH 440001',
      nationality: 'Indian',
      personalEmail: 'yashkapse3154@gmail.com',
      gender: 'Male',
      maritalStatus: 'Single',
      bankName: 'State Bank of India',
      accountNumber: '30492817492019',
      ifscCode: 'SBIN0004567',
      panNo: 'BNMPK9876Q',
      uanNo: '100876543210',
      empCode: 'OI-002'
    },
    salary: {
      monthWage: 65000,
      yearlyWage: 780000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      basicSalary: 32500,
      hra: 16250,
      standardAllowance: 5417,
      performanceBonus: 2707.25,
      lta: 2707.25,
      fixedAllowance: 5418.50,
      pfEmployee: 3900,
      pfEmployer: 3900,
      professionalTax: 200
    }
  },
  {
    id: 'emp_3',
    loginId: 'OIDHBH20230003',
    firstName: 'Dhanshree',
    lastName: 'Bhorkar',
    name: 'Dhanshree Bhorkar',
    email: 'dhanshree@odooindia.com',
    phone: '+91 97654 32109',
    role: 'employee',
    designation: 'Financial Systems & Profile Specialist',
    department: 'Finance & Accounts',
    manager: 'Prathamesh Mowade',
    location: 'Nagpur, India',
    joiningDate: '2023-06-01',
    joiningYear: 2023,
    serialNumber: 3,
    status: 'leave',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    about: 'Specialized in payroll computation, statutory tax compliance, and structured employee records management.',
    jobLove: 'Ensuring financial clarity and zero-error automated payroll pipelines for our team.',
    hobbies: 'Financial analytics, badminton, and landscape photography.',
    skills: ['Payroll Engines', 'Financial Modeling', 'Statutory Tax', 'Data Integrity', 'Excel VBA'],
    certifications: ['Certified Payroll Specialist (CPP)', 'CFA Level 1'],
    privateInfo: {
      dob: '2000-02-18',
      address: '88 Ramdaspeth, Nagpur, MH 440010',
      nationality: 'Indian',
      personalEmail: 'dhanshree010@gmail.com',
      gender: 'Female',
      maritalStatus: 'Single',
      bankName: 'ICICI Bank',
      accountNumber: '00293847562019',
      ifscCode: 'ICIC0000987',
      panNo: 'CKLPB5643Z',
      uanNo: '100765432198',
      empCode: 'OI-003'
    },
    salary: {
      monthWage: 55000,
      yearlyWage: 660000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      basicSalary: 27500,
      hra: 13750,
      standardAllowance: 4583.50,
      performanceBonus: 2290.75,
      lta: 2290.75,
      fixedAllowance: 4585.00,
      pfEmployee: 3300,
      pfEmployer: 3300,
      professionalTax: 200
    }
  },
  {
    id: 'emp_4',
    loginId: 'OINEMU20240004',
    firstName: 'Neha',
    lastName: 'Musale',
    name: 'Neha Ashok Musale',
    email: 'neha@odooindia.com',
    phone: '+91 99887 66554',
    role: 'employee',
    designation: 'HR Operations & Compliance Lead',
    department: 'Human Resources',
    manager: 'Prathamesh Mowade',
    location: 'Nagpur, India',
    joiningDate: '2024-01-10',
    joiningYear: 2024,
    serialNumber: 4,
    status: 'present',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    about: 'Focused on workforce attendance governance, leave policy workflows, and corporate people operations.',
    jobLove: 'Building an empathetic and highly structured work culture with seamless day-to-day operations.',
    hobbies: 'Debating, reading literature, and volunteering in tech communities.',
    skills: ['Attendance Auditing', 'Leave Policies', 'Labor Law', 'Conflict Resolution', 'People Operations'],
    certifications: ['SHRM Certified Professional (SHRM-CP)', 'HR Analytics Specialist'],
    privateInfo: {
      dob: '2001-11-05',
      address: '14 Dharampeth, Nagpur, MH 440010',
      nationality: 'Indian',
      personalEmail: 'nehamusale11@gmail.com',
      gender: 'Female',
      maritalStatus: 'Single',
      bankName: 'Axis Bank',
      accountNumber: '91802938475610',
      ifscCode: 'UTIB0001029',
      panNo: 'QAZWS9876X',
      uanNo: '100654321098',
      empCode: 'OI-004'
    },
    salary: {
      monthWage: 50000,
      yearlyWage: 600000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      basicSalary: 25000,
      hra: 12500,
      standardAllowance: 4167,
      performanceBonus: 2083.50,
      lta: 2083.50,
      fixedAllowance: 2918,
      pfEmployee: 3000,
      pfEmployer: 3000,
      professionalTax: 200
    }
  },
  {
    id: 'emp_5',
    loginId: 'OIRASH20240005',
    firstName: 'Rahul',
    lastName: 'Sharma',
    name: 'Rahul Sharma',
    email: 'rahul@odooindia.com',
    phone: '+91 98765 43210',
    role: 'employee',
    designation: 'Backend Software Engineer',
    department: 'Engineering',
    manager: 'Yash Kapse',
    location: 'Nagpur, India',
    joiningDate: '2024-02-01',
    joiningYear: 2024,
    serialNumber: 5,
    status: 'absent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    about: 'Database specialist and API developer building scalable cloud infrastructure.',
    jobLove: 'Architecting resilient backend systems and microservices.',
    hobbies: 'Cycling, gaming, and tech blogging.',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Redis'],
    certifications: ['AWS Certified Developer Associate'],
    privateInfo: {
      dob: '1998-04-14',
      address: '77 Wardha Road, Nagpur, MH 440015',
      nationality: 'Indian',
      personalEmail: 'rahul.sharma@gmail.com',
      gender: 'Male',
      maritalStatus: 'Single',
      bankName: 'Kotak Mahindra Bank',
      accountNumber: '60192837465019',
      ifscCode: 'KKBK0000678',
      panNo: 'PLOKI8765R',
      uanNo: '100543210987',
      empCode: 'OI-005'
    },
    salary: {
      monthWage: 48000,
      yearlyWage: 576000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      basicSalary: 24000,
      hra: 12000,
      standardAllowance: 4000,
      performanceBonus: 2000,
      lta: 2000,
      fixedAllowance: 4000,
      pfEmployee: 2880,
      pfEmployer: 2880,
      professionalTax: 200
    }
  },
  {
    id: 'emp_6',
    loginId: 'OIANKU20240006',
    firstName: 'Ananya',
    lastName: 'Kumar',
    name: 'Ananya Kumar',
    email: 'ananya@odooindia.com',
    phone: '+91 97650 12345',
    role: 'employee',
    designation: 'Product Designer',
    department: 'Design',
    manager: 'Yash Kapse',
    location: 'Nagpur, India',
    joiningDate: '2024-03-15',
    joiningYear: 2024,
    serialNumber: 6,
    status: 'present',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    about: 'Passionate about accessibility, user research, and seamless design systems.',
    jobLove: 'Crafting delight for everyday enterprise users.',
    hobbies: 'Digital painting, typography, and swimming.',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility'],
    certifications: ['Nielsen Norman UX Master Certified'],
    privateInfo: {
      dob: '2001-07-22',
      address: '102 Shankar Nagar, Nagpur, MH 440010',
      nationality: 'Indian',
      personalEmail: 'ananya.ux@gmail.com',
      gender: 'Female',
      maritalStatus: 'Single',
      bankName: 'HDFC Bank',
      accountNumber: '50100982347102',
      ifscCode: 'HDFC0001234',
      panNo: 'MNBVC3456T',
      uanNo: '100432109876',
      empCode: 'OI-006'
    },
    salary: {
      monthWage: 45000,
      yearlyWage: 540000,
      workingDaysPerWeek: 5,
      breakTimeHrs: 1,
      basicSalary: 22500,
      hra: 11250,
      standardAllowance: 3750,
      performanceBonus: 1875,
      lta: 1875,
      fixedAllowance: 3750,
      pfEmployee: 2700,
      pfEmployer: 2700,
      professionalTax: 200
    }
  }
];

class Store {
  constructor() {
    this.subscribers = new Map();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        if (parsed && Array.isArray(parsed.employees) && parsed.employees.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }

    // Default initial seed state
    const todayStr = new Date().toISOString().split('T')[0];