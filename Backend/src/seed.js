const { hashPassword } = require("./utils/auth");

const ADMIN_PASSWORD = "admin123";
const EMPLOYEE_PASSWORD = "employee123";

function buildEmployees() {
  const raw = [
    { id: "EMP-001", name: "Sarah Jenkins", email: "sarah.jenkins@odoo.co", department: "Human Resources", role: "HR Director", manager: "Executive Board", skills: ["Talent Strategy", "Compensation & Benefits", "Conflict Resolution", "Performance Management"], experience: "10 Years", contact: "+1 (555) 019-2834", emergencyContact: "John Jenkins (+1 555-019-2835)", bloodGroup: "A+", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", profileCompletion: 100, hireDate: "2021-03-15", streak: 14, isAdmin: true, salaryBreakdown: { basic: 8500, bonus: 1500, tax: 1200, pf: 800, deductions: 200, net: 8800 } },
    { id: "EMP-002", name: "Rahul Sharma", email: "rahul.sharma@odoo.co", department: "Engineering", role: "Senior Frontend Engineer", manager: "Priya Nair", skills: ["HTML5", "CSS3", "JavaScript", "React", "Vite", "UI/UX Architecture"], experience: "5 Years", contact: "+91 98765 43210", emergencyContact: "Sunita Sharma (+91 98765 43211)", bloodGroup: "O+", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", profileCompletion: 92, hireDate: "2023-01-10", streak: 8, isAdmin: false, salaryBreakdown: { basic: 6500, bonus: 800, tax: 800, pf: 600, deductions: 100, net: 5800 } },
    { id: "EMP-003", name: "Aisha Patel", email: "aisha.patel@odoo.co", department: "Product & Design", role: "Lead UI/UX Designer", manager: "Sofia Rodriguez", skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"], experience: "7 Years", contact: "+44 20 7946 0958", emergencyContact: "Karan Patel (+44 20 7946 0959)", bloodGroup: "B+", status: "Remote", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", profileCompletion: 95, hireDate: "2022-06-01", streak: 12, isAdmin: false, salaryBreakdown: { basic: 7200, bonus: 1000, tax: 950, pf: 700, deductions: 50, net: 6500 } },
    { id: "EMP-004", name: "David Chen", email: "david.chen@odoo.co", department: "Engineering", role: "Senior Backend Developer", manager: "Priya Nair", skills: ["Python", "Node.js", "PostgreSQL", "Odoo Framework", "REST APIs", "Docker"], experience: "6 Years", contact: "+1 (555) 014-9988", emergencyContact: "Mei Chen (+1 555-014-9989)", bloodGroup: "AB-", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", profileCompletion: 88, hireDate: "2022-11-15", streak: 5, isAdmin: false, salaryBreakdown: { basic: 6800, bonus: 700, tax: 850, pf: 620, deductions: 150, net: 5880 } },
    { id: "EMP-005", name: "Sofia Rodriguez", email: "sofia.rodriguez@odoo.co", department: "Product & Design", role: "VP of Product", manager: "Executive Board", skills: ["Product Roadmap", "SaaS Strategy", "Agile Leadership", "Market Analysis"], experience: "12 Years", contact: "+34 911 23 45 67", emergencyContact: "Mateo Rodriguez (+34 911 23 45 68)", bloodGroup: "O-", status: "Active", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150", profileCompletion: 100, hireDate: "2020-08-01", streak: 22, isAdmin: false, salaryBreakdown: { basic: 9500, bonus: 2000, tax: 1500, pf: 900, deductions: 300, net: 8800 } },
    { id: "EMP-006", name: "Liam Johnson", email: "liam.johnson@odoo.co", department: "Human Resources", role: "Talent Acquisition Lead", manager: "Sarah Jenkins", skills: ["Technical Recruiting", "Sourcing", "Employer Branding", "Negotiation"], experience: "4 Years", contact: "+1 (555) 012-3456", emergencyContact: "Emma Johnson (+1 555-012-3457)", bloodGroup: "A-", status: "On Leave", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", profileCompletion: 85, hireDate: "2023-09-01", streak: 0, isAdmin: false, salaryBreakdown: { basic: 5200, bonus: 500, tax: 550, pf: 480, deductions: 80, net: 4590 } },
    { id: "EMP-007", name: "Priya Nair", email: "priya.nair@odoo.co", department: "Engineering", role: "VP of Engineering", manager: "Executive Board", skills: ["Cloud Architecture", "AWS", "CI/CD", "Kubernetes", "Engineering Leadership"], experience: "11 Years", contact: "+91 91234 56789", emergencyContact: "Rajesh Nair (+91 91234 56780)", bloodGroup: "B-", status: "Active", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", profileCompletion: 100, hireDate: "2021-01-20", streak: 18, isAdmin: false, salaryBreakdown: { basic: 9600, bonus: 1800, tax: 1450, pf: 920, deductions: 200, net: 8830 } },
    { id: "EMP-008", name: "Marcus Aurelius", email: "marcus.aurelius@odoo.co", department: "Finance & Operations", role: "Finance Director", manager: "Executive Board", skills: ["Corporate Finance", "Payroll Tax", "Financial Reporting", "Budgeting"], experience: "9 Years", contact: "+39 06 123456", emergencyContact: "Faustina Aurelia (+39 06 123457)", bloodGroup: "O+", status: "Active", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", profileCompletion: 90, hireDate: "2022-02-15", streak: 15, isAdmin: false, salaryBreakdown: { basic: 8200, bonus: 1200, tax: 1100, pf: 780, deductions: 150, net: 7370 } },
    { id: "EMP-009", name: "Yuki Tanaka", email: "yuki.tanaka@odoo.co", department: "Engineering", role: "QA Automation Lead", manager: "Priya Nair", skills: ["Selenium", "Playwright", "Cypress", "Python Test automation", "Load Testing"], experience: "5 Years", contact: "+81 90 1234 5678", emergencyContact: "Kenji Tanaka (+81 90 1234 5679)", bloodGroup: "A+", status: "Active", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", profileCompletion: 87, hireDate: "2023-04-01", streak: 6, isAdmin: false, salaryBreakdown: { basic: 5800, bonus: 600, tax: 700, pf: 540, deductions: 100, net: 5060 } },
    { id: "EMP-010", name: "Amara Okeke", email: "amara.okeke@odoo.co", department: "Product & Design", role: "Senior Product Manager", manager: "Sofia Rodriguez", skills: ["Product Analytics", "SQL", "Scrum Master", "User Interviewing", "Jira"], experience: "6 Years", contact: "+234 803 123 4567", emergencyContact: "Chinedu Okeke (+234 803 123 4568)", bloodGroup: "B+", status: "Remote", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", profileCompletion: 94, hireDate: "2023-02-28", streak: 11, isAdmin: false, salaryBreakdown: { basic: 7000, bonus: 900, tax: 900, pf: 650, deductions: 120, net: 6230 } },
  ];

  return raw.map((emp) => ({
    ...emp,
    password: hashPassword(emp.isAdmin ? ADMIN_PASSWORD : EMPLOYEE_PASSWORD),
  }));
}

function buildLeaveBalances() {
  return {
    "EMP-001": { casual: 12, sick: 10, annual: 18, maternity: 0 },
    "EMP-002": { casual: 8, sick: 7, annual: 12, maternity: 0 },
    "EMP-003": { casual: 10, sick: 6, annual: 15, maternity: 0 },
    "EMP-004": { casual: 9, sick: 8, annual: 11, maternity: 0 },
    "EMP-005": { casual: 14, sick: 11, annual: 20, maternity: 0 },
    "EMP-006": { casual: 5, sick: 4, annual: 8, maternity: 0 },
    "EMP-007": { casual: 11, sick: 10, annual: 17, maternity: 0 },
    "EMP-008": { casual: 8, sick: 9, annual: 14, maternity: 0 },
    "EMP-009": { casual: 7, sick: 7, annual: 11, maternity: 0 },
    "EMP-010": { casual: 10, sick: 8, annual: 13, maternity: 0 },
  };
}

function buildLeaves() {
  return [
    { id: "LV-101", employeeId: "EMP-006", employeeName: "Liam Johnson", type: "Sick Leave", startDate: "2026-07-01", endDate: "2026-07-06", days: 5, reason: "Severe fever and flu recovery", status: "Approved", appliedDate: "2026-06-30", comments: [{ sender: "Sarah Jenkins", text: "Approved. Rest well and upload medical certificate if extended.", date: "2026-06-30" }] },
    { id: "LV-102", employeeId: "EMP-002", employeeName: "Rahul Sharma", type: "Casual Leave", startDate: "2026-07-15", endDate: "2026-07-17", days: 3, reason: "Family gathering event in home town", status: "Pending", appliedDate: "2026-07-03", comments: [] },
    { id: "LV-103", employeeId: "EMP-003", employeeName: "Aisha Patel", type: "Annual Leave", startDate: "2026-08-01", endDate: "2026-08-10", days: 7, reason: "Summer vacation and wellness break", status: "Pending", appliedDate: "2026-07-02", comments: [] },
    { id: "LV-104", employeeId: "EMP-004", employeeName: "David Chen", type: "Casual Leave", startDate: "2026-06-20", endDate: "2026-06-21", days: 1.5, reason: "Personal banking appointments", status: "Approved", appliedDate: "2026-06-18", comments: [{ sender: "Sarah Jenkins", text: "Approved. Please sync with QA lead Yuki prior to leave.", date: "2026-06-18" }] },
    { id: "LV-105", employeeId: "EMP-009", employeeName: "Yuki Tanaka", type: "Sick Leave", startDate: "2026-07-10", endDate: "2026-07-11", days: 1, reason: "Routine dental checkup and post-treatment rest", status: "Pending", appliedDate: "2026-07-03", comments: [] },
  ];
}

function buildAttendance() {
  const today = new Date().toISOString().split("T")[0];
  return [
    { employeeId: "EMP-001", checkIn: "08:45 AM", checkOut: "", date: today, status: "Present", isLate: false },
    { employeeId: "EMP-002", checkIn: "09:05 AM", checkOut: "", date: today, status: "Present", isLate: false },
    { employeeId: "EMP-003", checkIn: "09:12 AM", checkOut: "", date: today, status: "Present", isLate: false },
    { employeeId: "EMP-004", checkIn: "09:45 AM", checkOut: "", date: today, status: "Present", isLate: true },
    { employeeId: "EMP-005", checkIn: "08:30 AM", checkOut: "", date: today, status: "Present", isLate: false },
    { employeeId: "EMP-007", checkIn: "09:55 AM", checkOut: "", date: today, status: "Present", isLate: true },
    { employeeId: "EMP-008", checkIn: "08:50 AM", checkOut: "", date: today, status: "Present", isLate: false },
    { employeeId: "EMP-009", checkIn: "10:15 AM", checkOut: "", date: today, status: "Present", isLate: true },
    { employeeId: "EMP-010", checkIn: "09:02 AM", checkOut: "", date: today, status: "Present", isLate: false },
    // EMP-006 is on leave today
  ];
}

// GitHub-style heatmap: last 65 days ending today, weekends blank, weekdays randomized.
function buildHeatmap() {
  const data = {};
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 65);

  const cur = new Date(start);
  while (cur <= end) {
    const dateStr = cur.toISOString().split("T")[0];
    const day = cur.getDay();
    if (day === 0 || day === 6) {
      data[dateStr] = 0; // Weekend
    } else {
      const rand = Math.random();
      if (rand < 0.8) data[dateStr] = 4; // Full day
      else if (rand < 0.9) data[dateStr] = 2; // Half day
      else data[dateStr] = 1; // Absent / low activity
    }
    cur.setDate(cur.getDate() + 1);
  }
  return data;
}

function buildAnnouncements() {
  return [
    { id: "A-1", title: "Odoo x Adamas University Hackathon Finals", content: "The final presentation commences today! Ensure your workspaces are verified and ready by 1:00 PM.", category: "General", date: "2026-07-04" },
    { id: "A-2", title: "New Health Insurance Plan Upgrades", content: "HR is rolling out upgraded medical and dental coverages starting next month. Please check your document vault for details.", category: "Benefits", date: "2026-07-02" },
    { id: "A-3", title: "Global Wellness Friday", content: "Friendly reminder that next Friday is global mental wellness day. All servers down, team activities encouraged.", category: "Events", date: "2026-06-28" },
  ];
}

function buildHolidays() {
  // daysLeft is recomputed dynamically on each request; stored value is just a seed default.
  return [
    { name: "Independence Day", date: "2026-07-04" },
    { name: "Global Wellness Day", date: "2026-07-10" },
    { name: "Labour Day", date: "2026-09-07" },
    { name: "Thanksgiving", date: "2026-11-26" },
    { name: "Christmas Holiday", date: "2026-12-25" },
  ];
}

function buildMeetings() {
  return [
    { id: "M-1", title: "Daily Engineering Sync", time: "10:00 AM", attendees: 12, room: "Virtual Room A" },
    { id: "M-2", title: "SaaS Product Roadmap Review", time: "11:30 AM", attendees: 5, room: "Executive Board Room" },
    { id: "M-3", title: "HR Weekly Touchpoint", time: "03:00 PM", attendees: 4, room: "HR Lounge" },
  ];
}

function seed() {
  return {
    employees: buildEmployees(),
    leaves: buildLeaves(),
    leaveBalances: buildLeaveBalances(),
    attendance: buildAttendance(),
    heatmap: buildHeatmap(),
    announcements: buildAnnouncements(),
    holidays: buildHolidays(),
    meetings: buildMeetings(),
  };
}

module.exports = seed;
