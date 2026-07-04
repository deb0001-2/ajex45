// Helper Utilities for Premium HRMS

// 1. Toast Notifications System
export function showToast(message, type = "success") {
  const container = document.getElementById("toasts-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  // Decide icon based on type
  let icon = "";
  if (type === "success") {
    icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "error") {
    icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <span class="flex-center" style="color: inherit;">${icon}</span>
    <span style="font-size: 0.8125rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    toast.style.animation = "toast-slide-in 0.3s reverse forwards cubic-bezier(0.16, 1, 0.3, 1)";
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 4000);
}

// 2. Seeded QR Code Generator (SVG matrix builder)
export function generateQR(text) {
  // Mini pseudo-random QR generator that generates a stable 15x15 barcode matrix
  // based on the string seed, ensuring zero external library failures.
  const size = 15;
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const getBit = (x, y) => {
    // Standard static alignment patterns for QR Code
    if (
      (x < 4 && y < 4) || // Top-Left Finder
      (x > size - 5 && y < 4) || // Top-Right Finder
      (x < 4 && y > size - 5) // Bottom-Left Finder
    ) {
      return (x === 0 || x === 3 || y === 0 || y === 3) || (x === 1 && y === 1) || (x === 2 && y === 2);
    }
    // Timing patterns
    if (x === 5 || y === 5) {
      return (x % 2 === 0) || (y % 2 === 0);
    }
    // Pseudo random matrix modules seeded by text hash
    const seed = Math.sin(hash + x * 12.9898 + y * 78.233) * 43758.5453;
    return (seed - Math.floor(seed)) > 0.48;
  };

  let svgContent = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" shape-rendering="crispEdges" style="display: block;">`;
  // Background
  svgContent += `<rect width="${size}" height="${size}" fill="#FFFFFF"/>`;
  // Dark blocks
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (getBit(x, y)) {
        svgContent += `<rect x="${x}" y="${y}" width="1" height="1" fill="#111827"/>`;
      }
    }
  }
  svgContent += `</svg>`;
  return svgContent;
}

// 3. Export to CSV Utility
export function exportToCSV(filename, headers, dataArray) {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Headers
  csvContent += headers.join(",") + "\n";
  
  // Rows
  dataArray.forEach(row => {
    const csvRow = headers.map(header => {
      const field = row[header] !== undefined ? row[header] : "";
      const escaped = ("" + field).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvContent += csvRow.join(",") + "\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`Successfully exported ${filename}`);
}

// 4. Print & Export Payslip PDF Simulation
export function printPayslip(employee, payrollMonth) {
  const printWindow = window.open("", "_blank");
  const netText = `$${employee.salaryBreakdown.net.toLocaleString()}`;
  
  const content = `
    <html>
      <head>
        <title>Payslip - ${employee.name} (${payrollMonth})</title>
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
            <div style="font-size: 12px; color: #6B7280;">Statement Period: ${payrollMonth}</div>
          </div>
        </div>
        
        <div class="details">
          <div class="details-card">
            <div class="details-title">EMPLOYEE DETAILS</div>
            <div><strong>Name:</strong> ${employee.name}</div>
            <div><strong>Employee ID:</strong> ${employee.id}</div>
            <div><strong>Role:</strong> ${employee.role}</div>
            <div><strong>Department:</strong> ${employee.department}</div>
          </div>
          <div class="details-card">
            <div class="details-title">PAYMENT SUMMARY</div>
            <div><strong>Salary Period:</strong> ${payrollMonth}</div>
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
              <td style="text-align: right;">$${employee.salaryBreakdown.basic.toLocaleString()}</td>
              <td></td>
            </tr>
            <tr>
              <td>Performance Bonus</td>
              <td style="text-align: right;">$${employee.salaryBreakdown.bonus.toLocaleString()}</td>
              <td></td>
            </tr>
            <tr>
              <td>Income Tax</td>
              <td></td>
              <td style="text-align: right;">$${employee.salaryBreakdown.tax.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Provident Fund (PF)</td>
              <td></td>
              <td style="text-align: right;">$${employee.salaryBreakdown.pf.toLocaleString()}</td>
            </tr>
            ${employee.salaryBreakdown.deductions > 0 ? `
            <tr>
              <td>Other Deductions</td>
              <td></td>
              <td style="text-align: right;">$${employee.salaryBreakdown.deductions.toLocaleString()}</td>
            </tr>` : ""}
            <tr class="total-row">
              <td>Net Take-home Salary</td>
              <td colspan="2" style="text-align: right;">${netText}</td>
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
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  showToast(`Initiated print for ${employee.name}'s payslip`);
}

// 5. Trigger Confetti
export function triggerCelebration() {
  if (window.confetti) {
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#714B67", "#3B82F6", "#22C55E", "#8B5CF6"]
    });
  } else {
    // Simple visual feedback if offline / CDN blocks
    showToast("Congratulations! 🎉");
  }
}
