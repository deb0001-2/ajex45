(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const V=[{id:"EMP-001",name:"Sarah Jenkins",email:"sarah.jenkins@odoo.co",department:"Human Resources",role:"HR Director",manager:"Executive Board",skills:["Talent Strategy","Compensation & Benefits","Conflict Resolution","Performance Management"],experience:"10 Years",contact:"+1 (555) 019-2834",emergencyContact:"John Jenkins (+1 555-019-2835)",bloodGroup:"A+",status:"Active",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",profileCompletion:100,hireDate:"2021-03-15",streak:14,salaryBreakdown:{basic:8500,bonus:1500,tax:1200,pf:800,deductions:200,net:8800}},{id:"EMP-002",name:"Rahul Sharma",email:"rahul.sharma@odoo.co",department:"Engineering",role:"Senior Frontend Engineer",manager:"Priya Nair",skills:["HTML5","CSS3","JavaScript","React","Vite","UI/UX Architecture"],experience:"5 Years",contact:"+91 98765 43210",emergencyContact:"Sunita Sharma (+91 98765 43211)",bloodGroup:"O+",status:"Active",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",profileCompletion:92,hireDate:"2023-01-10",streak:8,salaryBreakdown:{basic:6500,bonus:800,tax:800,pf:600,deductions:100,net:5800}},{id:"EMP-003",name:"Aisha Patel",email:"aisha.patel@odoo.co",department:"Product & Design",role:"Lead UI/UX Designer",manager:"Sofia Rodriguez",skills:["Figma","Design Systems","Prototyping","User Research","Wireframing"],experience:"7 Years",contact:"+44 20 7946 0958",emergencyContact:"Karan Patel (+44 20 7946 0959)",bloodGroup:"B+",status:"Remote",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",profileCompletion:95,hireDate:"2022-06-01",streak:12,salaryBreakdown:{basic:7200,bonus:1e3,tax:950,pf:700,deductions:50,net:6500}},{id:"EMP-004",name:"David Chen",email:"david.chen@odoo.co",department:"Engineering",role:"Senior Backend Developer",manager:"Priya Nair",skills:["Python","Node.js","PostgreSQL","Odoo Framework","REST APIs","Docker"],experience:"6 Years",contact:"+1 (555) 014-9988",emergencyContact:"Mei Chen (+1 555-014-9989)",bloodGroup:"AB-",status:"Active",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",profileCompletion:88,hireDate:"2022-11-15",streak:5,salaryBreakdown:{basic:6800,bonus:700,tax:850,pf:620,deductions:150,net:5880}},{id:"EMP-005",name:"Sofia Rodriguez",email:"sofia.rodriguez@odoo.co",department:"Product & Design",role:"VP of Product",manager:"Executive Board",skills:["Product Roadmap","SaaS Strategy","Agile Leadership","Market Analysis"],experience:"12 Years",contact:"+34 911 23 45 67",emergencyContact:"Mateo Rodriguez (+34 911 23 45 68)",bloodGroup:"O-",status:"Active",avatar:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",profileCompletion:100,hireDate:"2020-08-01",streak:22,salaryBreakdown:{basic:9500,bonus:2e3,tax:1500,pf:900,deductions:300,net:8800}},{id:"EMP-006",name:"Liam Johnson",email:"liam.johnson@odoo.co",department:"Human Resources",role:"Talent Acquisition Lead",manager:"Sarah Jenkins",skills:["Technical Recruiting","Sourcing","Employer Branding","Negotiation"],experience:"4 Years",contact:"+1 (555) 012-3456",emergencyContact:"Emma Johnson (+1 555-012-3457)",bloodGroup:"A-",status:"On Leave",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",profileCompletion:85,hireDate:"2023-09-01",streak:0,salaryBreakdown:{basic:5200,bonus:500,tax:550,pf:480,deductions:80,net:4590}},{id:"EMP-007",name:"Priya Nair",email:"priya.nair@odoo.co",department:"Engineering",role:"VP of Engineering",manager:"Executive Board",skills:["Cloud Architecture","AWS","CI/CD","Kubernetes","Engineering Leadership"],experience:"11 Years",contact:"+91 91234 56789",emergencyContact:"Rajesh Nair (+91 91234 56780)",bloodGroup:"B-",status:"Active",avatar:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",profileCompletion:100,hireDate:"2021-01-20",streak:18,salaryBreakdown:{basic:9600,bonus:1800,tax:1450,pf:920,deductions:200,net:8830}},{id:"EMP-008",name:"Marcus Aurelius",email:"marcus.aurelius@odoo.co",department:"Finance & Operations",role:"Finance Director",manager:"Executive Board",skills:["Corporate Finance","Payroll Tax","Financial Reporting","Budgeting"],experience:"9 Years",contact:"+39 06 123456",emergencyContact:"Faustina Aurelia (+39 06 123457)",bloodGroup:"O+",status:"Active",avatar:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",profileCompletion:90,hireDate:"2022-02-15",streak:15,salaryBreakdown:{basic:8200,bonus:1200,tax:1100,pf:780,deductions:150,net:7370}},{id:"EMP-009",name:"Yuki Tanaka",email:"yuki.tanaka@odoo.co",department:"Engineering",role:"QA Automation Lead",manager:"Priya Nair",skills:["Selenium","Playwright","Cypress","Python Test automation","Load Testing"],experience:"5 Years",contact:"+81 90 1234 5678",emergencyContact:"Kenji Tanaka (+81 90 1234 5679)",bloodGroup:"A+",status:"Active",avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",profileCompletion:87,hireDate:"2023-04-01",streak:6,salaryBreakdown:{basic:5800,bonus:600,tax:700,pf:540,deductions:100,net:5060}},{id:"EMP-010",name:"Amara Okeke",email:"amara.okeke@odoo.co",department:"Product & Design",role:"Senior Product Manager",manager:"Sofia Rodriguez",skills:["Product Analytics","SQL","Scrum Master","User Interviewing","Jira"],experience:"6 Years",contact:"+234 803 123 4567",emergencyContact:"Chinedu Okeke (+234 803 123 4568)",bloodGroup:"B+",status:"Remote",avatar:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",profileCompletion:94,hireDate:"2023-02-28",streak:11,salaryBreakdown:{basic:7e3,bonus:900,tax:900,pf:650,deductions:120,net:6230}}],Y={"EMP-001":{casual:12,sick:10,annual:18,maternity:0},"EMP-002":{casual:8,sick:7,annual:12,maternity:0},"EMP-003":{casual:10,sick:6,annual:15,maternity:0},"EMP-004":{casual:9,sick:8,annual:11,maternity:0},"EMP-005":{casual:14,sick:11,annual:20,maternity:0},"EMP-006":{casual:5,sick:4,annual:8,maternity:0},"EMP-007":{casual:11,sick:10,annual:17,maternity:0},"EMP-008":{casual:8,sick:9,annual:14,maternity:0},"EMP-009":{casual:7,sick:7,annual:11,maternity:0},"EMP-010":{casual:10,sick:8,annual:13,maternity:0}},W=[{id:"LV-101",employeeId:"EMP-006",employeeName:"Liam Johnson",type:"Sick Leave",startDate:"2026-07-01",endDate:"2026-07-06",days:5,reason:"Severe fever and flu recovery",status:"Approved",appliedDate:"2026-06-30",comments:[{sender:"Sarah Jenkins",text:"Approved. Rest well and upload medical certificate if extended.",date:"2026-06-30"}]},{id:"LV-102",employeeId:"EMP-002",employeeName:"Rahul Sharma",type:"Casual Leave",startDate:"2026-07-15",endDate:"2026-07-17",days:3,reason:"Family gathering event in home town",status:"Pending",appliedDate:"2026-07-03",comments:[]},{id:"LV-103",employeeId:"EMP-003",employeeName:"Aisha Patel",type:"Annual Leave",startDate:"2026-08-01",endDate:"2026-08-10",days:7,reason:"Summer vacation and wellness break",status:"Pending",appliedDate:"2026-07-02",comments:[]},{id:"LV-104",employeeId:"EMP-004",employeeName:"David Chen",type:"Casual Leave",startDate:"2026-06-20",endDate:"2026-06-21",days:1.5,reason:"Personal banking appointments",status:"Approved",appliedDate:"2026-06-18",comments:[{sender:"Sarah Jenkins",text:"Approved. Please sync with QA lead Yuki prior to leave.",date:"2026-06-18"}]},{id:"LV-105",employeeId:"EMP-009",employeeName:"Yuki Tanaka",type:"Sick Leave",startDate:"2026-07-10",endDate:"2026-07-11",days:1,reason:"Routine dental checkup and post-treatment rest",status:"Pending",appliedDate:"2026-07-03",comments:[]}],K=[{employeeId:"EMP-001",checkIn:"08:45 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!1},{employeeId:"EMP-002",checkIn:"09:05 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!1},{employeeId:"EMP-003",checkIn:"09:12 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!1},{employeeId:"EMP-004",checkIn:"09:45 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!0},{employeeId:"EMP-005",checkIn:"08:30 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!1},{employeeId:"EMP-007",checkIn:"09:55 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!0},{employeeId:"EMP-008",checkIn:"08:50 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!1},{employeeId:"EMP-009",checkIn:"10:15 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!0},{employeeId:"EMP-010",checkIn:"09:02 AM",checkOut:"",date:"2026-07-04",status:"Present",isLate:!1}],Q=(()=>{const e={},n=new Date("2026-05-01"),t=new Date("2026-07-04"),a=new Date(n);for(;a<=t;){const s=a.toISOString().split("T")[0],o=a.getDay();if(o===0||o===6)e[s]=0;else{const d=Math.random();d<.8?e[s]=4:d<.9?e[s]=2:e[s]=1}a.setDate(a.getDate()+1)}return e})(),X=[{id:"A-1",title:"Odoo x Adamas University Hackathon Finals",content:"The final presentation commences today! Ensure your workspaces are verified and ready by 1:00 PM.",category:"General",date:"2026-07-04"},{id:"A-2",title:"New Health Insurance Plan Upgrades",content:"HR is rolling out upgraded medical and dental coverages starting next month. Please check your document vault for details.",category:"Benefits",date:"2026-07-02"},{id:"A-3",title:"Global Wellness Friday",content:"Friendly reminder that next Friday is global mental wellness day. All servers down, team activities encouraged.",category:"Events",date:"2026-06-28"}],Z=[{name:"Independence Day",date:"2026-07-04",daysLeft:0},{name:"Global Wellness Day",date:"2026-07-10",daysLeft:6},{name:"Labour Day",date:"2026-09-07",daysLeft:65},{name:"Thanksgiving",date:"2026-11-26",daysLeft:145},{name:"Christmas Holiday",date:"2026-12-25",daysLeft:174}],ee=[{id:"M-1",title:"Daily Engineering Sync",time:"10:00 AM",attendees:12,room:"Virtual Room A"},{id:"M-2",title:"SaaS Product Roadmap Review",time:"11:30 AM",attendees:5,room:"Executive Board Room"},{id:"M-3",title:"HR Weekly Touchpoint",time:"03:00 PM",attendees:4,room:"HR Lounge"}];class te{constructor(){this.init()}init(){localStorage.getItem("hrms_employees")||localStorage.setItem("hrms_employees",JSON.stringify(V)),localStorage.getItem("hrms_leaves")||localStorage.setItem("hrms_leaves",JSON.stringify(W)),localStorage.getItem("hrms_leave_balance")||localStorage.setItem("hrms_leave_balance",JSON.stringify(Y)),localStorage.getItem("hrms_attendance")||localStorage.setItem("hrms_attendance",JSON.stringify(K)),localStorage.getItem("hrms_heatmap")||localStorage.setItem("hrms_heatmap",JSON.stringify(Q)),localStorage.getItem("hrms_announcements")||localStorage.setItem("hrms_announcements",JSON.stringify(X))}getEmployees(){return JSON.parse(localStorage.getItem("hrms_employees"))}saveEmployees(n){localStorage.setItem("hrms_employees",JSON.stringify(n))}addEmployee(n){const t=this.getEmployees(),a=`EMP-0${t.length+1}`,s={id:a,...n,avatar:n.avatar||`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(n.name)}`,profileCompletion:80,streak:0,hireDate:new Date().toISOString().split("T")[0],status:"Active",salaryBreakdown:{basic:parseInt(n.salary)||5e3,bonus:Math.round((parseInt(n.salary)||5e3)*.15),tax:Math.round((parseInt(n.salary)||5e3)*.12),pf:Math.round((parseInt(n.salary)||5e3)*.08),deductions:0,net:Math.round((parseInt(n.salary)||5e3)*.95)}};t.push(s),this.saveEmployees(t);const o=this.getLeaveBalances();return o[a]={casual:10,sick:8,annual:12,maternity:0},this.saveLeaveBalances(o),s}getAttendance(){return JSON.parse(localStorage.getItem("hrms_attendance"))}saveAttendance(n){localStorage.setItem("hrms_attendance",JSON.stringify(n))}getHeatmap(){return JSON.parse(localStorage.getItem("hrms_heatmap"))}saveHeatmap(n){localStorage.setItem("hrms_heatmap",JSON.stringify(n))}getLeaves(){return JSON.parse(localStorage.getItem("hrms_leaves"))}saveLeaves(n){localStorage.setItem("hrms_leaves",JSON.stringify(n))}getLeaveBalances(){return JSON.parse(localStorage.getItem("hrms_leave_balance"))}saveLeaveBalances(n){localStorage.setItem("hrms_leave_balance",JSON.stringify(n))}applyLeave(n){const t=this.getLeaves(),s={id:`LV-${Math.floor(100+Math.random()*900)}`,status:"Pending",appliedDate:new Date().toISOString().split("T")[0],comments:[],...n};return t.unshift(s),this.saveLeaves(t),s}getAnnouncements(){return JSON.parse(localStorage.getItem("hrms_announcements"))}getHolidays(){return Z}getMeetings(){return ee}getStats(){const n=this.getEmployees(),t=this.getAttendance(),a=this.getLeaves(),s="2026-07-04",o=t.filter(g=>g.date===s&&g.status==="Present"),d=t.filter(g=>g.date===s&&g.status==="Present"&&g.isLate),p=a.filter(g=>g.status==="Pending"),i=n.filter(g=>g.status==="On Leave"),l=n.length,y=o.length,u=l-y-i.length,c=l>0?Math.round(y/(l-i.length)*100):100;return{totalEmployees:l,presentToday:y,absentToday:Math.max(0,u),pendingLeaves:p.length,lateCheckins:d.length,attendanceRate:c,birthdaysToday:2}}}const m=new te;function v(e,n="success"){const t=document.getElementById("toasts-container");if(!t)return;const a=document.createElement("div");a.className=`toast toast-${n}`;let s="";n==="success"?s='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>':n==="error"?s='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>':s='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',a.innerHTML=`
    <span class="flex-center" style="color: inherit;">${s}</span>
    <span style="font-size: 0.8125rem; font-weight: 500;">${e}</span>
  `,t.appendChild(a),setTimeout(()=>{a.style.animation="toast-slide-in 0.3s reverse forwards cubic-bezier(0.16, 1, 0.3, 1)",a.addEventListener("animationend",()=>{a.remove()})},4e3)}function ae(e){let t=0;for(let o=0;o<e.length;o++)t=e.charCodeAt(o)+((t<<5)-t);const a=(o,d)=>{if(o<4&&d<4||o>10&&d<4||o<4&&d>10)return o===0||o===3||d===0||d===3||o===1&&d===1||o===2&&d===2;if(o===5||d===5)return o%2===0||d%2===0;const p=Math.sin(t+o*12.9898+d*78.233)*43758.5453;return p-Math.floor(p)>.48};let s='<svg viewBox="0 0 15 15" width="100%" height="100%" shape-rendering="crispEdges" style="display: block;">';s+='<rect width="15" height="15" fill="#FFFFFF"/>';for(let o=0;o<15;o++)for(let d=0;d<15;d++)a(d,o)&&(s+=`<rect x="${d}" y="${o}" width="1" height="1" fill="#111827"/>`);return s+="</svg>",s}function P(e,n,t){let a="data:text/csv;charset=utf-8,";a+=n.join(",")+`
`,t.forEach(d=>{const p=n.map(i=>`"${(""+(d[i]!==void 0?d[i]:"")).replace(/"/g,'""')}"`);a+=p.join(",")+`
`});const s=encodeURI(a),o=document.createElement("a");o.setAttribute("href",s),o.setAttribute("download",e),document.body.appendChild(o),o.click(),document.body.removeChild(o),v(`Successfully exported ${e}`)}function ne(e,n){const t=window.open("","_blank"),a=`$${e.salaryBreakdown.net.toLocaleString()}`,s=`
    <html>
      <head>
        <title>Payslip - ${e.name} (${n})</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #111827; line-height: 1.6; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #714B67; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #714B67; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
          .details-card { background: #F8FAFC; border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; }
          .details-title { font-weight: bold; margin-bottom: 10px; text-transform: uppercase; font-size: 11px; color: #6B7280; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .table th { background: #714B67; color: white; padding: 12px; text-align: left; }
          .table td { padding: 12px; border-bottom: 1px solid #E5E7EB; }
          .total-row { font-weight: bold; font-size: 18px; color: #714B67; background: #F4EFF3; }
          .footer { text-align: center; font-size: 11px; color: #6B7280; margin-top: 50px; border-top: 1px solid #E5E7EB; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">ODOO HRMS</div>
            <div style="font-size: 12px; color: #6B7280;">Premium Enterprise Suite</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: bold;">PAYSLIP CONFIRMATION</div>
            <div style="font-size: 12px; color: #6B7280;">Statement Period: ${n}</div>
          </div>
        </div>
        
        <div class="details">
          <div class="details-card">
            <div class="details-title">EMPLOYEE DETAILS</div>
            <div><strong>Name:</strong> ${e.name}</div>
            <div><strong>Employee ID:</strong> ${e.id}</div>
            <div><strong>Role:</strong> ${e.role}</div>
            <div><strong>Department:</strong> ${e.department}</div>
          </div>
          <div class="details-card">
            <div class="details-title">PAYMENT SUMMARY</div>
            <div><strong>Salary Period:</strong> ${n}</div>
            <div><strong>Payment Date:</strong> 2026-07-01</div>
            <div><strong>Status:</strong> Completed (Direct Deposit)</div>
          </div>
        </div>
        
        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Earnings</th>
              <th style="text-align: right;">Deductions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Monthly Salary</td>
              <td style="text-align: right;">$${e.salaryBreakdown.basic.toLocaleString()}</td>
              <td></td>
            </tr>
            <tr>
              <td>Performance Bonus</td>
              <td style="text-align: right;">$${e.salaryBreakdown.bonus.toLocaleString()}</td>
              <td></td>
            </tr>
            <tr>
              <td>Income Tax</td>
              <td></td>
              <td style="text-align: right;">$${e.salaryBreakdown.tax.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Provident Fund (PF)</td>
              <td></td>
              <td style="text-align: right;">$${e.salaryBreakdown.pf.toLocaleString()}</td>
            </tr>
            ${e.salaryBreakdown.deductions>0?`
            <tr>
              <td>Other Deductions</td>
              <td></td>
              <td style="text-align: right;">$${e.salaryBreakdown.deductions.toLocaleString()}</td>
            </tr>`:""}
            <tr class="total-row">
              <td>Net Take-home Salary</td>
              <td colspan="2" style="text-align: right;">${a}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          This is a system generated statement of salary credit and does not require a physical signature.<br/>
          Odoo HRMS Operations © 2026. All rights reserved.
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        <\/script>
      </body>
    </html>
  `;t.document.write(s),t.document.close(),v(`Initiated print for ${e.name}'s payslip`)}function w(){window.confetti?window.confetti({particleCount:100,spread:70,origin:{y:.6},colors:["#714B67","#3B82F6","#22C55E","#8B5CF6"]}):v("Congratulations! 🎉")}let h={};function x(){const e=document.body.classList.contains("dark-theme");return{text:e?"#94A3B8":"#6B7280",grid:e?"rgba(255, 255, 255, 0.08)":"rgba(17, 24, 39, 0.05)",brandPrimary:"#714B67",brandPrimaryLight:e?"rgba(113, 75, 103, 0.2)":"rgba(113, 75, 103, 0.1)",accentSecondary:"#3B82F6",accentSecondaryLight:"rgba(59, 130, 246, 0.1)"}}function I(e){h[e]&&(h[e].destroy(),delete h[e])}function R(e){I(e);const n=document.getElementById(e);if(!n)return;const t=x(),a=n.getContext("2d");h[e]=new Chart(a,{type:"line",data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets:[{label:"Attendance Rate (%)",data:[92,94,97,95,93,85,88],borderColor:t.brandPrimary,backgroundColor:t.brandPrimaryLight,fill:!0,tension:.4,borderWidth:2,pointBackgroundColor:t.brandPrimary,pointBorderColor:"#fff",pointHoverRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:t.text}},y:{min:70,max:100,grid:{color:t.grid},ticks:{color:t.text,stepSize:10}}}}})}function O(e){I(e);const n=document.getElementById(e);if(!n)return;const t=x(),a=n.getContext("2d");h[e]=new Chart(a,{type:"doughnut",data:{labels:["Casual Leave","Sick Leave","Annual Leave","Maternity"],datasets:[{data:[14,8,22,2],backgroundColor:["#714B67","#3B82F6","#22C55E","#F59E0B"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{color:t.text,boxWidth:12,font:{family:"Inter"}}}},cutout:"75%"}})}function N(e){I(e);const n=document.getElementById(e);if(!n)return;const t=x(),a=n.getContext("2d");h[e]=new Chart(a,{type:"bar",data:{labels:["Engineering","Product & Design","Human Resources","Finance & Ops"],datasets:[{label:"Employees",data:[4,3,2,1],backgroundColor:["#714B67","#3B82F6","#8B5CF6","#06B6D4"],borderRadius:6,borderWidth:0,maxBarThickness:40}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{x:{grid:{display:!1},ticks:{color:t.text}},y:{grid:{color:t.grid},ticks:{color:t.text,stepSize:1}}}}})}function H(e){I(e);const n=document.getElementById(e);if(!n)return;const t=x(),a=n.getContext("2d");h[e]=new Chart(a,{type:"line",data:{labels:["Jan","Feb","Mar","Apr","May","Jun"],datasets:[{label:"Basic Pay",data:[45e3,48e3,48e3,52e3,52e3,56e3],borderColor:t.brandPrimary,backgroundColor:t.brandPrimaryLight,tension:.3,borderWidth:2},{label:"Total Deductions",data:[6500,6800,7100,7800,7500,8100],borderColor:"#EF4444",backgroundColor:"rgba(239, 68, 68, 0.1)",tension:.3,borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top",labels:{color:t.text}}},scales:{x:{grid:{display:!1},ticks:{color:t.text}},y:{grid:{color:t.grid},ticks:{color:t.text}}}}})}function U(e){I(e);const n=document.getElementById(e);if(!n)return;const t=x(),a=n.getContext("2d");h[e]=new Chart(a,{type:"pie",data:{labels:["Female","Male","Non-binary"],datasets:[{data:[50,40,10],backgroundColor:["#714B67","#3B82F6","#EEF2F7"],borderWidth:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom",labels:{color:t.text}}}}})}function se(){Object.keys(h).forEach(e=>{e==="attendance-trend-chart"&&R(e),e==="leave-dist-chart"&&O(e),e==="dept-chart"&&N(e),e==="payroll-chart"&&H(e),e==="gender-chart"&&U(e)})}let r={currentUser:null,currentRole:null,activeView:"dashboard",checkInTimer:null};document.addEventListener("DOMContentLoaded",()=>{oe(),Se(),ce(),j()});function oe(){document.getElementById("switch-to-employee-btn").addEventListener("click",()=>{B("employee")}),document.getElementById("switch-to-admin-btn").addEventListener("click",()=>{B("admin")}),document.getElementById("admin-login-form").addEventListener("submit",ie),document.getElementById("employee-login-form").addEventListener("submit",de),document.getElementById("continue-to-admin-dashboard").addEventListener("click",()=>{$()}),document.getElementById("continue-to-employee-dashboard").addEventListener("click",()=>{$(),pe()}),document.getElementById("logout-btn-trigger").addEventListener("click",le),document.querySelectorAll(".nav-item").forEach(t=>{t.addEventListener("click",a=>{a.preventDefault();const s=t.getAttribute("data-view");L(s)})}),document.getElementById("theme-toggle-btn").addEventListener("click",Ae),document.getElementById("settings-theme-select").addEventListener("change",t=>{A(t.target.value==="dark")}),document.addEventListener("keydown",t=>{(t.metaKey||t.ctrlKey)&&t.key==="k"&&(t.preventDefault(),document.getElementById("global-search-input").focus())}),document.getElementById("global-search-input").addEventListener("input",t=>{const a=t.target.value;Te(a)}),document.getElementById("search-directory-field").addEventListener("input",b),document.getElementById("filter-dept-field").addEventListener("change",b),document.getElementById("filter-status-field").addEventListener("change",b),document.getElementById("export-directory-csv").addEventListener("click",fe),document.getElementById("add-employee-quick-btn").addEventListener("click",()=>E("modal-add-employee")),document.getElementById("add-employee-btn").addEventListener("click",()=>E("modal-add-employee")),document.getElementById("add-employee-form").addEventListener("submit",he),document.getElementById("apply-leave-btn").addEventListener("click",()=>E("modal-apply-leave")),document.getElementById("apply-leave-form").addEventListener("submit",xe),document.getElementById("emp-checkin-btn").addEventListener("click",_),document.getElementById("emp-checkout-btn").addEventListener("click",ge),document.getElementById("view-my-digital-id-btn").addEventListener("click",()=>{J(r.currentUser)}),document.querySelectorAll(".close-modal-btn").forEach(t=>{t.addEventListener("click",()=>{const a=t.getAttribute("data-modal");k(a)})}),document.getElementById("payroll-employee-select").addEventListener("change",t=>{G(t.target.value)}),document.getElementById("download-payslip-pdf-btn").addEventListener("click",Be),document.addEventListener("click",t=>{if(t.target.classList.contains("document-download-trigger")){const a=t.target.getAttribute("data-doc");Le(a)}}),document.getElementById("document-upload-mock-btn").addEventListener("click",()=>{v("Mock Upload: Drag & Drop file to vault successful!","info")}),document.getElementById("save-settings-btn").addEventListener("click",()=>{v("System configurations saved successfully!")})}function B(e){const n=document.getElementById("admin-login-view"),t=document.getElementById("employee-login-view");e==="admin"?(n.style.display="flex",t.style.display="none"):(n.style.display="none",t.style.display="flex")}function ie(e){e.preventDefault();const n=document.getElementById("admin-email").value,t=document.getElementById("admin-password").value;n==="sarah.jenkins@odoo.co"&&t==="admin123"?(r.currentRole="admin",r.currentUser=m.getEmployees().find(a=>a.id==="EMP-001"),F()):v("Invalid Admin credentials. Try admin123.","error")}function de(e){e.preventDefault();const n=document.getElementById("employee-email").value,t=document.getElementById("employee-password").value,a=m.getEmployees().find(s=>s.email.toLowerCase()===n.toLowerCase());a&&t==="employee123"?(r.currentRole="employee",r.currentUser=a,F(a.name)):v("Invalid credentials. Try employee123.","error")}function F(e){document.getElementById("auth-overlay").classList.remove("auth-active");const n=document.getElementById("loader-overlay");n.classList.add("loader-active");const t=["VERIFYING SECURITY SIGNATURES...","SYNCHRONIZING ENTERPRISE DIRECTORY...","CALCULATING ATTENDANCE HEATMAPS...","GENERATING CRYPTOGRAPHIC DIGITAL IDS..."];let a=0;const s=setInterval(()=>{a<t.length?(document.getElementById("loader-message").innerText=t[a],a++):(clearInterval(s),n.classList.remove("loader-active"),re())},400)}function re(){if(document.getElementById("welcome-overlay").classList.add("welcome-active"),r.currentRole==="admin"){document.getElementById("admin-welcome-box").style.display="block",document.getElementById("employee-welcome-box").style.display="none";const n=m.getStats();document.getElementById("welcome-total-employees").innerText=n.totalEmployees,document.getElementById("welcome-present-employees").innerText=n.presentToday,document.getElementById("welcome-leave-requests").innerText=n.pendingLeaves,document.getElementById("welcome-birthdays").innerText=n.birthdaysToday}else{document.getElementById("admin-welcome-box").style.display="none";const n=document.getElementById("employee-welcome-box");n.style.display="block",document.getElementById("employee-welcome-title").innerText=`Good Morning, ${r.currentUser.name.split(" ")[0]} 👋`,document.getElementById("welcome-employee-streak").innerText=`${r.currentUser.streak} Days`;const t=m.getLeaveBalances()[r.currentUser.id],a=t?t.casual+t.sick+t.annual:0;document.getElementById("welcome-employee-leaves").innerText=`${a} Days`}}function $(){document.getElementById("welcome-overlay").classList.remove("welcome-active"),document.getElementById("app-container").classList.add("app-active"),document.getElementById("sidebar-avatar").src=r.currentUser.avatar,document.getElementById("sidebar-name").innerText=r.currentUser.name,document.getElementById("sidebar-role").innerText=r.currentUser.role,document.getElementById("header-avatar").src=r.currentUser.avatar,document.getElementById("header-name").innerText=r.currentUser.name.split(" ")[0];const e=document.getElementById("nav-item-employees"),n=document.getElementById("nav-item-analytics");r.currentRole==="admin"?(document.getElementById("admin-dashboard-layout").style.display="block",document.getElementById("employee-dashboard-layout").style.display="none",e.style.display="flex",n.style.display="flex"):(document.getElementById("admin-dashboard-layout").style.display="none",document.getElementById("employee-dashboard-layout").style.display="block",e.style.display="flex",n.style.display="none",ue()),L("dashboard"),v(`Authenticated successfully as ${r.currentRole}`),lucide.createIcons()}function le(){r.currentUser=null,r.currentRole=null,r.checkInTimer&&clearInterval(r.checkInTimer),document.getElementById("app-container").classList.remove("app-active"),document.getElementById("auth-overlay").classList.add("auth-active"),document.getElementById("admin-login-form").reset(),document.getElementById("employee-login-form").reset(),B("admin"),v("Logged out of session","info")}function L(e){r.activeView=e,document.querySelectorAll(".nav-item").forEach(a=>{a.getAttribute("data-view")===e?a.classList.add("active"):a.classList.remove("active")}),document.querySelectorAll(".page-view").forEach(a=>{a.id===`view-${e}`?a.classList.add("active"):a.classList.remove("active")}),e==="dashboard"?r.currentRole==="admin"?me():T():e==="employees"?z():e==="attendance"?Ee():e==="leaves"?S():e==="payroll"?ke():e==="analytics"&&we(),lucide.createIcons()}function ce(){B("admin")}function me(){const e=m.getStats();document.getElementById("stat-total-headcount").innerText=e.totalEmployees,document.getElementById("stat-present-today").innerText=e.presentToday,document.getElementById("stat-pending-leaves").innerText=e.pendingLeaves,document.getElementById("stat-attendance-rate").innerText=`${e.attendanceRate}%`,setTimeout(()=>{R("attendance-trend-chart"),O("leave-dist-chart")},100);const n=document.getElementById("dashboard-recent-activities"),t=m.getAttendance(),a=m.getEmployees(),s="2026-07-04",o=t.filter(c=>c.date===s);o.length===0?n.innerHTML=`
      <div class="empty-state" style="padding: 12px 0;">
        <p>No activity logs recorded today yet.</p>
      </div>
    `:n.innerHTML=o.slice(0,5).map(c=>{const g=a.find(q=>q.id===c.employeeId),f=c.isLate?'<span class="badge badge-danger btn-sm" style="font-size: 0.65rem;">LATE</span>':"";return`
        <div class="detail-item">
          <div class="detail-item-left">
            <img src="${g.avatar}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;">
            <div class="detail-item-text">
              <h5>${g.name}</h5>
              <p>${g.role} • ${c.checkIn}</p>
            </div>
          </div>
          <div class="flex-center" style="gap:6px;">
            ${f}
            <span class="badge badge-success">CHECKED IN</span>
          </div>
        </div>
      `}).join("");const d=document.getElementById("dashboard-announcements"),p=m.getAnnouncements();d.innerHTML=p.slice(0,3).map(c=>{let g="var(--brand-primary)";return c.category==="Benefits"&&(g="var(--accent-secondary)"),c.category==="Events"&&(g="var(--success)"),`
      <div class="announcement-card" style="border-left-color: ${g};">
        <div class="flex-center" style="justify-content:space-between; margin-bottom:4px;">
          <h6>${c.title}</h6>
          <span style="font-size:0.6rem; color:var(--text-secondary);">${c.date}</span>
        </div>
        <p>${c.content}</p>
      </div>
    `}).join("");const i=document.getElementById("dashboard-events-calendar"),l=m.getHolidays().slice(0,2),y=m.getMeetings().slice(0,2);let u="";l.forEach(c=>{u+=`
      <div class="detail-item">
        <div class="detail-item-left">
          <div class="flex-center" style="width:30px; height:30px; background:rgba(245, 158, 11, 0.1); color:var(--warning); border-radius:6px;">
            <i data-lucide="palm-tree" style="width:16px; height:16px;"></i>
          </div>
          <div class="detail-item-text">
            <h5>${c.name}</h5>
            <p>Holiday • ${c.date}</p>
          </div>
        </div>
        <span class="badge badge-warning">${c.daysLeft===0?"Today":`in ${c.daysLeft}d`}</span>
      </div>
    `}),y.forEach(c=>{u+=`
      <div class="detail-item">
        <div class="detail-item-left">
          <div class="flex-center" style="width:30px; height:30px; background:rgba(59, 130, 246, 0.1); color:var(--accent-secondary); border-radius:6px;">
            <i data-lucide="video" style="width:16px; height:16px;"></i>
          </div>
          <div class="detail-item-text">
            <h5>${c.title}</h5>
            <p>${c.time} • ${c.room}</p>
          </div>
        </div>
        <span class="badge badge-info">Meeting</span>
      </div>
    `}),i.innerHTML=u}function ue(){document.getElementById("emp-hero-avatar").src=r.currentUser.avatar,document.getElementById("emp-hero-greeting").innerText=`Good Morning, ${r.currentUser.name.split(" ")[0]} 👋`,document.getElementById("emp-hero-role").innerText=`${r.currentUser.role} • ${r.currentUser.department} Department`,document.getElementById("emp-streak-value").innerText=`${r.currentUser.streak} Days`;const e=m.getLeaveBalances()[r.currentUser.id],n=e?e.casual+e.sick+e.annual:0;document.getElementById("emp-leaves-value").innerText=`${n} Days`,document.getElementById("emp-salary-value").innerText=`$${r.currentUser.salaryBreakdown.net.toLocaleString()}`;const t=document.getElementById("emp-meetings-list");t.innerHTML=m.getMeetings().map(s=>`
    <div class="detail-item">
      <div class="detail-item-left">
        <div class="flex-center" style="width:28px; height:28px; background:rgba(59,130,246,0.1); color:var(--accent-secondary); border-radius:6px;"><i data-lucide="clock" style="width:14px; height:14px;"></i></div>
        <div class="detail-item-text">
          <h5>${s.title}</h5>
          <p>${s.time} • ${s.room}</p>
        </div>
      </div>
      <button class="btn btn-outline btn-sm">Join Call</button>
    </div>
  `).join("");const a=document.getElementById("emp-holidays-list");a.innerHTML=m.getHolidays().slice(0,3).map(s=>`
    <div class="detail-item">
      <div class="detail-item-left">
        <div class="flex-center" style="width:28px; height:28px; background:rgba(34,197,94,0.1); color:var(--success); border-radius:6px;"><i data-lucide="calendar" style="width:14px; height:14px;"></i></div>
        <div class="detail-item-text">
          <h5>${s.name}</h5>
          <p>${s.date}</p>
        </div>
      </div>
      <span class="badge badge-success">${s.daysLeft===0?"Today":`in ${s.daysLeft}d`}</span>
    </div>
  `).join("")}function T(){const e=m.getAttendance(),n="2026-07-04",t=e.find(d=>d.employeeId===r.currentUser.id&&d.date===n),a=document.getElementById("emp-clock-status-badge"),s=document.getElementById("emp-checkin-btn"),o=document.getElementById("emp-checkout-btn");t?t.checkOut===""?(a.innerText="CHECKED IN",a.className="badge badge-success",s.disabled=!0,o.disabled=!1,ye(t.checkIn)):(a.innerText="COMPLETED DAY",a.className="badge badge-info",s.disabled=!0,o.disabled=!0,D(`Checked Out at ${t.checkOut}`)):(a.innerText="OUT OF OFFICE",a.className="badge badge-brand",s.disabled=!1,o.disabled=!0,D()),lucide.createIcons()}function pe(){const e=m.getAttendance(),n="2026-07-04";e.find(a=>a.employeeId===r.currentUser.id&&a.date===n)||_()}function _(){const e=m.getAttendance(),n="2026-07-04",t=new Date;let a=t.getHours(),s=t.getMinutes();const o=a>=12?"PM":"AM";a=a%12,a=a||12,s=s<10?"0"+s:s;const d=`${a}:${s} ${o}`,p=t.getHours()>9||t.getHours()===9&&t.getMinutes()>30,i={employeeId:r.currentUser.id,checkIn:d,checkOut:"",date:n,status:"Present",isLate:p};e.push(i),m.saveAttendance(e);const l=m.getEmployees(),y=l.findIndex(c=>c.id===r.currentUser.id);y!==-1&&(l[y].streak+=1,m.saveEmployees(l),r.currentUser.streak+=1,document.getElementById("emp-streak-value").innerText=`${r.currentUser.streak} Days`);const u=m.getHeatmap();u[n]=4,m.saveHeatmap(u),w(),v("Check-in successful! Have a wonderful day."),T()}function ge(){const e=m.getAttendance(),n="2026-07-04",t=e.findIndex(a=>a.employeeId===r.currentUser.id&&a.date===n);if(t!==-1){const a=new Date;let s=a.getHours(),o=a.getMinutes();const d=s>=12?"PM":"AM";s=s%12,s=s||12,o=o<10?"0"+o:o;const p=`${s}:${o} ${d}`;e[t].checkOut=p,m.saveAttendance(e),v("Check-out successful! Thank you for your work."),T()}}function ye(e){r.checkInTimer&&clearInterval(r.checkInTimer);const n=ve(e);r.checkInTimer=setInterval(()=>{const t=new Date-n,a=Math.floor(t/36e5),s=Math.floor(t%36e5/6e4),o=Math.floor(t%6e4/1e3),d=p=>String(p).padStart(2,"0");document.getElementById("live-running-clock").innerText=`${d(a)}:${d(s)}:${d(o)}`,document.getElementById("live-running-date").innerText=`Active Shift In: ${e}`},1e3)}function D(e){r.checkInTimer&&clearInterval(r.checkInTimer),j()}function j(){const e=document.getElementById("live-running-clock"),n=document.getElementById("live-running-date");if(!e)return;const t=()=>{const a=new Date;e.innerText=a.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),n.innerText=a.toLocaleDateString([],{weekday:"long",year:"numeric",month:"long",day:"numeric"})};t(),r.checkInTimer=setInterval(t,1e3)}function ve(e){const[n,t]=e.split(" ");let[a,s]=n.split(":");a=parseInt(a),s=parseInt(s),t==="PM"&&a<12&&(a+=12),t==="AM"&&a===12&&(a=0);const o=new Date;return o.setHours(a,s,0,0),o}function z(){const e=document.getElementById("add-employee-btn");r.currentRole==="admin"?e.style.display="inline-flex":e.style.display="none",b()}function b(){const e=document.getElementById("search-directory-field").value.toLowerCase(),n=document.getElementById("filter-dept-field").value,t=document.getElementById("filter-status-field").value,a=m.getEmployees(),s=document.getElementById("directory-cards-container"),o=a.filter(i=>{const l=i.name.toLowerCase().includes(e)||i.role.toLowerCase().includes(e)||i.skills.some(c=>c.toLowerCase().includes(e)),y=n==="All"||i.department===n,u=t==="All"||i.status===t;return l&&y&&u});if(o.length===0){s.innerHTML=`
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i data-lucide="users-round" class="empty-state-icon" style="width:48px; height:48px;"></i>
        <h4>No employees found</h4>
        <p>Try refining your search terms or selecting different filters.</p>
      </div>
    `,lucide.createIcons();return}s.innerHTML=o.map(i=>{const l=i.skills.slice(0,3).map(f=>`<span class="badge badge-brand" style="font-size:0.65rem;">${f}</span>`).join(""),y=i.skills.length-3,u=y>0?`<span class="badge badge-brand" style="font-size:0.65rem;">+${y} more</span>`:"";let c="badge-success";i.status==="Remote"&&(c="badge-info"),i.status==="On Leave"&&(c="badge-warning");let g="";return r.currentRole==="admin"?g=`
        <button class="btn btn-outline btn-sm view-badge-btn" data-id="${i.id}"><i data-lucide="qr-code" style="width:12px; height:12px;"></i> Badge</button>
        <button class="btn btn-primary btn-sm edit-employee-btn" data-id="${i.id}" style="padding: 6px 10px;"><i data-lucide="edit-3" style="width:12px; height:12px;"></i> Details</button>
      `:g=`
        <button class="btn btn-outline btn-sm view-badge-btn" style="width:100%;" data-id="${i.id}"><i data-lucide="qr-code" style="width:12px; height:12px;"></i> View Digital Badge</button>
      `,`
      <div class="card employee-card">
        <span class="badge ${c} status-indicator-badge">${i.status.toUpperCase()}</span>
        <img src="${i.avatar}" alt="${i.name}" class="employee-card-avatar">
        <h4 class="employee-card-name">${i.name}</h4>
        <p class="employee-card-role">${i.role} • <span style="opacity:0.8;">${i.id}</span></p>
        
        <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:8px;">
          Dept: <strong>${i.department}</strong>
        </div>

        <div class="employee-card-tags">
          ${l}
          ${u}
        </div>

        <div class="progress-bar-container" style="margin-bottom: 8px;" title="Profile completion: ${i.profileCompletion}%">
          <div class="progress-bar-fill" style="width: ${i.profileCompletion}%;"></div>
        </div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); text-align: left; margin-bottom: 12px;">Profile Completion: ${i.profileCompletion}%</div>

        <div class="employee-card-actions">
          ${g}
        </div>
      </div>
    `}).join(""),s.querySelectorAll(".view-badge-btn").forEach(i=>{i.addEventListener("click",()=>{const l=a.find(y=>y.id===i.getAttribute("data-id"));J(l)})}),s.querySelectorAll(".edit-employee-btn").forEach(i=>{i.addEventListener("click",()=>{const l=a.find(y=>y.id===i.getAttribute("data-id"));be(l)})}),lucide.createIcons()}function he(e){e.preventDefault();const n=document.getElementById("new-emp-name").value,t=document.getElementById("new-emp-email").value,a=document.getElementById("new-emp-dept").value,s=document.getElementById("new-emp-role").value,o=document.getElementById("new-emp-salary").value,d=document.getElementById("new-emp-blood").value,p=document.getElementById("new-emp-manager").value,i={name:n,email:t,department:a,role:s,salary:o,bloodGroup:d,manager:p,skills:["General Operations","Communication","Time Management"]},l=m.addEmployee(i);w(),v(`Onboarded ${l.name} successfully!`),k("modal-add-employee"),document.getElementById("add-employee-form").reset(),z()}function fe(){const e=m.getEmployees();P("employee_directory.csv",["id","name","email","department","role","manager","status","hireDate","bloodGroup"],e)}function be(e){v(`Profile details: Manager is ${e.manager}. Experience: ${e.experience}.`,"info")}function J(e){document.getElementById("badge-front-avatar").src=e.avatar,document.getElementById("badge-front-name").innerText=e.name,document.getElementById("badge-front-role").innerText=e.role,document.getElementById("badge-front-id").innerText=e.id,document.getElementById("badge-front-blood").innerText=e.bloodGroup,document.getElementById("badge-back-manager").innerText=e.manager,document.getElementById("badge-back-hired").innerText=e.hireDate;const n=`VERIFICATION CODE: ODOO-HR-${e.id} | NAME: ${e.name} | SIGNATURE: SHA256-5432B`;document.getElementById("badge-back-qr").innerHTML=ae(n),E("modal-digital-id")}function Ee(){const e=m.getHeatmap(),n=document.getElementById("attendance-heatmap-grid");n.innerHTML="",Object.keys(e).sort().slice(-189).forEach(u=>{const c=e[u],g=document.createElement("div");g.className=`heatmap-day heatmap-w${c}`,g.title=`${u}: workforce activity weight ${c}`,n.appendChild(g)});const s=document.getElementById("attendance-live-log-table"),o=m.getAttendance(),d=m.getEmployees(),p="2026-07-04",i=o.filter(u=>u.date===p);i.length===0?s.innerHTML=`
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-secondary);">No check-in entries recorded for today.</td>
      </tr>
    `:s.innerHTML=i.map(u=>{const c=d.find(f=>f.id===u.employeeId);u.isLate;const g=u.checkIn+(u.isLate?" (Late)":"");return`
        <tr>
          <td>
            <div class="flex-center" style="justify-content: flex-start; gap: 10px;">
              <img src="${c.avatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
              <strong>${c.name}</strong>
            </div>
          </td>
          <td>${g}</td>
          <td>${u.checkOut||'<span style="opacity:0.5;">--:--</span>'}</td>
          <td><span class="badge ${c.status==="Remote"?"badge-info":"badge-brand"}">${c.status==="Remote"?"Remote":"Office"}</span></td>
          <td><span class="badge ${u.checkOut?"badge-info":"badge-success"}">${u.checkOut?"COMPLETED":"ACTIVE"}</span></td>
        </tr>
      `}).join("");const l=document.getElementById("attendance-late-arrivals-list"),y=i.filter(u=>u.isLate);y.length===0?l.innerHTML=`
      <div class="empty-state" style="padding: 24px 0;">
        <i data-lucide="check" class="empty-state-icon" style="width: 30px; height:30px; color:var(--success); opacity:1;"></i>
        <h4>100% On-time Arrival</h4>
        <p>No late arrivals recorded today.</p>
      </div>
    `:l.innerHTML=y.map(u=>{const c=d.find(g=>g.id===u.employeeId);return`
        <div class="detail-item">
          <div class="detail-item-left">
            <img src="${c.avatar}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">
            <div class="detail-item-text">
              <h5>${c.name}</h5>
              <p>${c.role} • In: ${u.checkIn}</p>
            </div>
          </div>
          <span class="badge badge-danger">LATE</span>
        </div>
      `}).join(""),document.getElementById("download-attendance-report-btn").onclick=()=>{P("attendance_journal.csv",["employeeId","date","checkIn","checkOut","status","isLate"],o)}}function S(){const e=document.getElementById("leave-balances-container"),n=m.getLeaveBalances()[r.currentUser.id];n&&(e.innerHTML=`
      <div class="card stat-card">
        <span class="stat-card-title">Casual Leave Balance</span>
        <div class="stat-card-value">${n.casual} Days</div>
        <div class="stat-card-sub">Allocated: 12 Days</div>
        <div class="stat-card-icon" style="color:var(--success);"><i data-lucide="umbrella" style="width:24px; height:24px;"></i></div>
      </div>
      <div class="card stat-card">
        <span class="stat-card-title">Sick Leave Balance</span>
        <div class="stat-card-value">${n.sick} Days</div>
        <div class="stat-card-sub">Allocated: 10 Days</div>
        <div class="stat-card-icon" style="color:var(--brand-primary);"><i data-lucide="activity" style="width:24px; height:24px;"></i></div>
      </div>
      <div class="card stat-card">
        <span class="stat-card-title">Annual Vacation Balance</span>
        <div class="stat-card-value">${n.annual} Days</div>
        <div class="stat-card-sub">Allocated: 20 Days</div>
        <div class="stat-card-icon" style="color:var(--accent-secondary);"><i data-lucide="plane" style="width:24px; height:24px;"></i></div>
      </div>
    `);const t=document.getElementById("leave-history-title"),a=document.getElementById("leave-history-table-body"),s=m.getLeaves(),o=r.currentRole==="admin"?s:s.filter(l=>l.employeeId===r.currentUser.id);t.innerText=r.currentRole==="admin"?"Workforce Time-Off Applications":"My Time-Off Applications",o.length===0?a.innerHTML=`
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-secondary); padding:24px 0;">No leave request logs found.</td>
      </tr>
    `:a.innerHTML=o.map(l=>{let y="badge-warning";l.status==="Approved"&&(y="badge-success"),l.status==="Rejected"&&(y="badge-danger");let u="";return r.currentRole==="admin"&&l.status==="Pending"?u=`<button class="btn btn-primary btn-sm assess-leave-btn" data-id="${l.id}">Assess</button>`:u=`<button class="btn btn-outline btn-sm view-leave-detail" data-id="${l.id}">View</button>`,`
        <tr style="cursor: pointer;" class="leave-row-tr" data-id="${l.id}">
          <td><strong>${l.employeeName}</strong></td>
          <td>${l.type}</td>
          <td>${l.startDate} to ${l.endDate}</td>
          <td>${l.days} Days</td>
          <td><span class="badge ${y}">${l.status}</span></td>
          <td>${u}</td>
        </tr>
      `}).join(""),a.querySelectorAll(".leave-row-tr").forEach(l=>{l.addEventListener("click",y=>{y.target.tagName!=="BUTTON"&&C(l.getAttribute("data-id"))})}),a.querySelectorAll(".assess-leave-btn").forEach(l=>{l.addEventListener("click",()=>{Ie(l.getAttribute("data-id"))})}),a.querySelectorAll(".view-leave-detail").forEach(l=>{l.addEventListener("click",()=>{C(l.getAttribute("data-id"))})}),lucide.createIcons()}function xe(e){e.preventDefault();const n=document.getElementById("leave-type-field").value,t=document.getElementById("leave-start-date").value,a=document.getElementById("leave-end-date").value,s=document.getElementById("leave-reason").value,o=new Date(t),d=new Date(a),p=Math.abs(d-o),i=Math.ceil(p/(1e3*60*60*24))+1;if(d<o){v("Invalid end date selected","error");return}const l={employeeId:r.currentUser.id,employeeName:r.currentUser.name,type:n,startDate:t,endDate:a,days:i,reason:s};m.applyLeave(l),v("Leave request submitted for approval"),k("modal-apply-leave"),document.getElementById("apply-leave-form").reset(),S()}function C(e){const n=document.getElementById("leave-timeline-container"),a=m.getLeaves().find(p=>p.id===e);if(!a)return;let s=`
    <div class="timeline-step success">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-title-row">
          <h6>Application Submitted</h6>
          <span class="timeline-date">${a.appliedDate}</span>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary);">Reason: "${a.reason}"</p>
      </div>
    </div>
  `;a.comments.length>0&&a.comments.forEach(p=>{s+=`
        <div class="timeline-step success">
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <div class="timeline-title-row">
              <h6>Comment by ${p.sender}</h6>
              <span class="timeline-date">${p.date}</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-secondary);">"${p.text}"</p>
          </div>
        </div>
      `});let o=a.status==="Pending"?"active":"success",d=a.status==="Pending"?"Pending Executive Review":`Request ${a.status}`;s+=`
    <div class="timeline-step ${o}">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-title-row">
          <h6>${d}</h6>
        </div>
        <p style="font-size:0.75rem; color:var(--text-secondary);">Final status determined by Director.</p>
      </div>
    </div>
  `,n.innerHTML=s}function Ie(e){const t=m.getLeaves().find(o=>o.id===e);if(!t)return;const a=document.getElementById("leave-approval-details-box");a.innerHTML=`
    <div><strong>Applicant:</strong> ${t.employeeName} (${t.employeeId})</div>
    <div><strong>Type:</strong> ${t.type}</div>
    <div><strong>Period:</strong> ${t.startDate} to ${t.endDate} (${t.days} Days)</div>
    <div><strong>Reason:</strong> "${t.reason}"</div>
  `;const s=document.getElementById("leave-approval-footer-actions");s.innerHTML=`
    <button class="btn btn-outline close-modal-btn" data-modal="modal-leave-approval">Cancel</button>
    <button class="btn btn-danger reject-leave-trigger-btn" data-id="${t.id}">Reject</button>
    <button class="btn btn-primary approve-leave-trigger-btn" data-id="${t.id}">Approve Request</button>
  `,s.querySelector(".close-modal-btn").onclick=()=>k("modal-leave-approval"),s.querySelector(".approve-leave-trigger-btn").onclick=()=>{M(t.id,"Approved")},s.querySelector(".reject-leave-trigger-btn").onclick=()=>{M(t.id,"Rejected")},E("modal-leave-approval")}function M(e,n){const t=document.getElementById("leave-assess-comment").value,a=m.getLeaves(),s=a.findIndex(o=>o.id===e);if(s!==-1){if(a[s].status=n,t.trim()!==""&&a[s].comments.push({sender:r.currentUser.name,text:t,date:new Date().toISOString().split("T")[0]}),n==="Approved"){const o=a[s].employeeId,d=a[s].type,p=a[s].days,i=m.getLeaveBalances();i[o]&&(d==="Casual Leave"&&(i[o].casual=Math.max(0,i[o].casual-p)),d==="Sick Leave"&&(i[o].sick=Math.max(0,i[o].sick-p)),d==="Annual Leave"&&(i[o].annual=Math.max(0,i[o].annual-p)),m.saveLeaveBalances(i))}m.saveLeaves(a),w(),v(`Leave request ${n}`),k("modal-leave-approval"),document.getElementById("leave-assess-comment").value="",S()}}function ke(){const e=document.getElementById("payroll-employee-select"),n=m.getEmployees();r.currentRole==="admin"?(e.disabled=!1,e.innerHTML=n.map(a=>`<option value="${a.id}">${a.name} (${a.id})</option>`).join("")):(e.disabled=!0,e.innerHTML=`<option value="${r.currentUser.id}">${r.currentUser.name}</option>`),G(e.value),setTimeout(()=>{H("payroll-chart")},100);const t=document.getElementById("payroll-ledger-list");t.innerHTML=`
    <div class="detail-item">
      <div class="detail-item-left">
        <div class="flex-center" style="width:28px; height:28px; background:rgba(34,197,94,0.1); color:var(--success); border-radius:6px;"><i data-lucide="check" style="width:14px; height:14px;"></i></div>
        <div class="detail-item-text">
          <h5>July 2026 Batch Payroll</h5>
          <p>Direct Deposit • July 1, 2026</p>
        </div>
      </div>
      <span class="badge badge-success">CREDITED</span>
    </div>
    <div class="detail-item">
      <div class="detail-item-left">
        <div class="flex-center" style="width:28px; height:28px; background:rgba(34,197,94,0.1); color:var(--success); border-radius:6px;"><i data-lucide="check" style="width:14px; height:14px;"></i></div>
        <div class="detail-item-text">
          <h5>June 2026 Batch Payroll</h5>
          <p>Direct Deposit • June 1, 2026</p>
        </div>
      </div>
      <span class="badge badge-success">CREDITED</span>
    </div>
  `,lucide.createIcons()}function G(e){const n=m.getEmployees().find(s=>s.id===e),t=document.getElementById("payroll-breakdown-details-box");if(!n)return;const a=n.salaryBreakdown;t.innerHTML=`
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">
        <span>Basic Salary Credit</span>
        <strong>$${a.basic.toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">
        <span>Incentive & Performance Bonus</span>
        <strong style="color:var(--success)">+$${a.bonus.toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">
        <span>Provident Fund (PF) Deduction</span>
        <strong style="color:var(--danger)">-$${a.pf.toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; border-bottom: 1px solid var(--border-color); padding-bottom:8px;">
        <span>Income Tax withholding</span>
        <strong style="color:var(--danger)">-$${a.tax.toLocaleString()}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:1.125rem; font-weight:700; padding-top:8px;">
        <span>Net Take-home Salary</span>
        <span class="text-gradient">$${a.net.toLocaleString()}</span>
      </div>
    </div>
  `}function Be(){const e=document.getElementById("payroll-employee-select"),n=m.getEmployees().find(t=>t.id===e.value);n&&ne(n,"July 2026")}function Le(e){const n=document.getElementById("loader-overlay");n.classList.add("loader-active"),document.getElementById("loader-message").innerText="AUDITING DOWNLOAD TRANSACTIONS...",setTimeout(()=>{n.classList.remove("loader-active");const t=document.createElement("a");t.href="data:text/plain;charset=utf-8,Mock Encrypted File Contents",t.download=e,document.body.appendChild(t),t.click(),document.body.removeChild(t),v(`Secured transaction. Downloaded ${e} successfully.`)},1200)}function we(){setTimeout(()=>{N("dept-chart"),U("gender-chart")},100)}function Te(e){if(e.trim()==="")return;const n=e.toLowerCase(),a=["dashboard","employees","attendance","leaves","payroll","documents","settings"].find(o=>o.startsWith(n));if(a){v(`Route shortcut found: navigating to ${a}`,"info"),L(a),document.getElementById("global-search-input").value="",document.getElementById("global-search-input").blur();return}const s=m.getEmployees().find(o=>o.name.toLowerCase().includes(n));s&&(v("Employee match found: redirects to directory","info"),L("employees"),document.getElementById("search-directory-field").value=s.name,b(),document.getElementById("global-search-input").value="",document.getElementById("global-search-input").blur())}function E(e){const n=document.getElementById(e);n&&n.classList.add("active")}function k(e){const n=document.getElementById(e);n&&n.classList.remove("active")}function Se(){const e=localStorage.getItem("hrms_theme"),n=window.matchMedia("(prefers-color-scheme: dark)").matches;A(e==="dark"||!e&&n)}function Ae(){const e=document.body.classList.contains("dark-theme");A(!e)}function A(e){const n=document.getElementById("theme-toggle-icon"),t=document.getElementById("settings-theme-select");e?(document.body.classList.add("dark-theme"),localStorage.setItem("hrms_theme","dark"),n&&n.setAttribute("data-lucide","sun"),t&&(t.value="dark")):(document.body.classList.remove("dark-theme"),localStorage.setItem("hrms_theme","light"),n&&n.setAttribute("data-lucide","moon"),t&&(t.value="light")),lucide.createIcons(),se()}
