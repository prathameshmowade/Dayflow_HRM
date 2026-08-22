# 🏢 Dayflow HRM

> **Every workday, perfectly aligned.** — A modern, full-featured Human Resource Management System built with pure Vanilla JavaScript, HTML & CSS.

🔗 **Live Demo:** [https://dayflow-hrm.vercel.app](https://dayflow-hrm.vercel.app)

---

## 👥 Team Information

**Team Name:** Pragati 2.0

| # | Member | GitHub | Role |
|---|--------|--------|------|
| 1 | **Prathamesh Mowade** | [@prathameshmowade](https://github.com/prathameshmowade) | HR Lead & Architect |
| 2 | **Yash Kapse** | [@Yash-k10](https://github.com/Yash-k10) | Senior Frontend Engineer |
| 3 | **Dhanshree Bhorkar** | [@Dhanshree010](https://github.com/Dhanshree010) | Financial Systems Specialist |
| 4 | **Neha Ashok Musale** | [@NehaMusale11](https://github.com/NehaMusale11) | HR Operations Lead |

---

## 📖 What is Dayflow HRM?

**Dayflow HRM** is a comprehensive, single-page Human Resource Management System designed to streamline everyday HR workflows — from employee onboarding and attendance tracking to leave management, payroll processing, and profile management.

Built entirely with **Vanilla JavaScript (ES6+ Modules)**, **HTML5**, and **CSS3** — no frameworks, no build tools — just clean, modular, production-ready code served as a static site.

---

## ✨ Key Features

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | Secure login & signup with auto-generated Login IDs, default passwords, and change password functionality |
| 👤 **Employee Profiles** | Rich profile cards with resume, private info, avatar management, and role-based access (Admin / Self-Service) |
| 📋 **Employee Directory** | Searchable, filterable grid of all employees with status indicators and quick profile access |
| ⏰ **Attendance Tracking** | Real-time check-in/check-out clock widget, daily attendance ledger, and monthly statistics |
| 🏖️ **Time Off / Leave** | Leave request submission, quota counters, and admin approval/rejection queue |
| 💰 **Payroll** | Itemized salary breakdown, CTC computation, printable payslips, and admin compensation ledger |
| 🔑 **Change Password** | Secure password change modal with strength meter, visibility toggles, and real-time validation |

---

## 🔐 Login & Signup Process

### How to Sign In

1. Open the app at [https://dayflow-hrm.vercel.app](https://dayflow-hrm.vercel.app)
2. You'll see the **Sign In** page
3. Enter your **Login ID** (or Work Email) and **Password**
4. Click **Sign In →**

**Default Credentials Format:**
- **Login ID:** Auto-generated in format `[CompanyCode][FirstName2][LastName2][Year][Serial]`
  - Example: `OIPRMO20220001` (Odoo India → Prathamesh Mowade → 2022 → #0001)
- **Default Password:** `[LoginID]@2026`
  - Example: `OIPRMO20220001@2026`

#### 🚀 Quick Demo Accounts

| Account | Login ID | Password | Role |
|---------|----------|----------|------|
| 👑 Prathamesh | `OIPRMO20220001` | `OIPRMO20220001@2026` | Admin |
| 💻 Yash | `OIYAKA20230002` | `OIYAKA20230002@2026` | Employee |
| 📊 Dhanshree | `OIDHBH20230003` | `OIDHBH20230003@2026` | Employee |
| 📋 Neha | `OINEMU20240004` | `OINEMU20240004@2026` | Employee |

### How to Sign Up (Register New Organization)

1. Click **Sign Up** on the login page
2. Fill in:
   - **Company Name** — Your organization name
   - **Admin Full Name** — Your name (becomes the first admin)
   - **Work Email** — Admin email address
   - **Phone Number** — Contact number
   - **Password** & **Confirm Password**
3. Click **Sign Up & Initialize Company →**
4. The system auto-generates your Login ID and sets up the entire company workspace

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vanilla JavaScript (ES6+ Modules), HTML5, CSS3 |
| **State Management** | Custom reactive store with `localStorage` persistence |
| **Styling** | Pure CSS with CSS Custom Properties (design tokens) |
| **Typography** | Plus Jakarta Sans + JetBrains Mono (Google Fonts) |
| **Deployment** | Vercel (Static Site) |
| **Version Control** | Git + GitHub |

### Project Structure

```
HR_SYSTEM/
├── index.html                          # Entry point
├── package.json                        # Project config & scripts
├── src/
│   ├── assets/
│   │   └── hr_interview_bg.jpg         # Auth page background
│   ├── js/
│   │   ├── app.js                      # Main app shell & router
│   │   ├── components/
│   │   │   ├── AuthModal.js            # Login & Signup forms
│   │   │   ├── ChangePasswordModal.js  # Change password modal
│   │   │   ├── EmployeeGrid.js         # Employee directory grid
│   │   │   ├── EmployeeModal.js        # New employee creation form
│   │   │   ├── Navbar.js               # Top navigation bar & dropdown
│   │   │   ├── ProfileView.js          # Employee profile (Resume/Private/Salary)
│   │   │   ├── AttendanceView.js       # Attendance tracking module
│   │   │   ├── TimeOffView.js          # Leave management module
│   │   │   └── PayrollView.js          # Payroll & salary module
│   │   ├── services/
│   │   │   ├── authService.js          # Authentication & password logic
│   │   │   ├── employeeService.js      # Employee CRUD operations
│   │   │   ├── attendanceService.js    # Check-in/out management
│   │   │   ├── timeoffService.js       # Leave request handling
│   │   │   ├── payrollService.js       # Payroll computation
│   │   │   └── salaryService.js        # Salary component calculator
│   │   ├── state/
│   │   │   └── store.js                # Reactive state store + seed data
│   │   └── utils/
│   │       ├── formatters.js           # Currency & date formatters
│   │       ├── idGenerator.js          # Login ID & password generator
│   │       └── notifications.js        # Toast notification system
│   └── styles/
│       ├── variables.css               # Design tokens & CSS variables
│       ├── base.css                    # Reset & base styles
│       ├── components.css              # Buttons, forms, modals, badges
│       ├── navbar.css                  # Navigation & dropdown styles
│       ├── dashboard.css               # Employee grid layout
│       ├── profile.css                 # Profile view styles
│       ├── attendance.css              # Attendance module styles
│       ├── timeoff.css                 # Leave module styles
│       └── payroll.css                 # Payroll module styles
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16+) or **Python 3** installed
- **Git** installed

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/prathameshmowade/Dayflow_HRM.git

# Navigate into the project directory
cd Dayflow_HRM

# Start the development server
npm start
```

The app will be available at `http://localhost:3000`

### Alternative (Python)
```bash
python -m http.server 3000
```

---

## 🔒 Role-Based Access

| Feature | Admin | Employee |
|---------|-------|----------|
| View all employees | ✅ | ✅ |
| Create new employees | ✅ | ❌ |
| Edit any profile | ✅ | Own profile only |
| View salary info | ✅ All employees | ❌ |
| Approve/reject leave | ✅ | ❌ |
| View attendance ledger | ✅ All employees | Own records |
| Change own password | ✅ | ✅ |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <strong>Team Pragati 2.0</strong><br>
  Prathamesh Mowade • Yash Kapse • Dhanshree Bhorkar • Neha Ashok Musale
</p>
