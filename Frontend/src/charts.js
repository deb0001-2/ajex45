// Chart rendering utilities for Premium HRMS using Chart.js

let activeCharts = {};

// Helper to get CSS variables for Chart styling dynamically
function getChartTheme() {
  const isDark = document.body.classList.contains("dark-theme");
  return {
    text: isDark ? "#94A3B8" : "#6B7280",
    grid: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(17, 24, 39, 0.05)",
    brandPrimary: "#714B67",
    brandPrimaryLight: isDark ? "rgba(113, 75, 103, 0.2)" : "rgba(113, 75, 103, 0.1)",
    accentSecondary: "#3B82F6",
    accentSecondaryLight: "rgba(59, 130, 246, 0.1)"
  };
}

// Destroy existing chart helper
function destroyChart(canvasId) {
  if (activeCharts[canvasId]) {
    activeCharts[canvasId].destroy();
    delete activeCharts[canvasId];
  }
}

// 1. Dashboard: Daily Attendance Trend
export function renderAttendanceTrendChart(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const theme = getChartTheme();
  const ctx = canvas.getContext("2d");

  activeCharts[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Attendance Rate (%)",
        data: [92, 94, 97, 95, 93, 85, 88],
        borderColor: theme.brandPrimary,
        backgroundColor: theme.brandPrimaryLight,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: theme.brandPrimary,
        pointBorderColor: "#fff",
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: theme.text }
        },
        y: {
          min: 70,
          max: 100,
          grid: { color: theme.grid },
          ticks: { color: theme.text, stepSize: 10 }
        }
      }
    }
  });
}

// 2. Dashboard: Leave Type Distribution
export function renderLeaveDistributionChart(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const theme = getChartTheme();
  const ctx = canvas.getContext("2d");

  activeCharts[canvasId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Casual Leave", "Sick Leave", "Annual Leave", "Maternity"],
      datasets: [{
        data: [14, 8, 22, 2],
        backgroundColor: ["#714B67", "#3B82F6", "#22C55E", "#F59E0B"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: theme.text, boxWidth: 12, font: { family: "Inter" } }
        }
      },
      cutout: "75%"
    }
  });
}

// 3. Analytics: Department Headcounts
export function renderDepartmentChart(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const theme = getChartTheme();
  const ctx = canvas.getContext("2d");

  activeCharts[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Engineering", "Product & Design", "Human Resources", "Finance & Ops"],
      datasets: [{
        label: "Employees",
        data: [4, 3, 2, 1],
        backgroundColor: ["#714B67", "#3B82F6", "#8B5CF6", "#06B6D4"],
        borderRadius: 6,
        borderWidth: 0,
        maxBarThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: theme.text }
        },
        y: {
          grid: { color: theme.grid },
          ticks: { color: theme.text, stepSize: 1 }
        }
      }
    }
  });
}

// 4. Analytics: Monthly Payroll History
export function renderPayrollChart(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const theme = getChartTheme();
  const ctx = canvas.getContext("2d");

  activeCharts[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Basic Pay",
          data: [45000, 48000, 48000, 52000, 52000, 56000],
          borderColor: theme.brandPrimary,
          backgroundColor: theme.brandPrimaryLight,
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: "Total Deductions",
          data: [6500, 6800, 7100, 7800, 7500, 8100],
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.3,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { color: theme.text }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: theme.text }
        },
        y: {
          grid: { color: theme.grid },
          ticks: { color: theme.text }
        }
      }
    }
  });
}

// 5. Analytics: Gender Distribution
export function renderGenderChart(canvasId) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const theme = getChartTheme();
  const ctx = canvas.getContext("2d");

  activeCharts[canvasId] = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Female", "Male", "Non-binary"],
      datasets: [{
        data: [50, 40, 10],
        backgroundColor: ["#714B67", "#3B82F6", "#EEF2F7"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: theme.text }
        }
      }
    }
  });
}

// Trigger redraw of all active charts (for theme switching)
export function updateAllCharts() {
  Object.keys(activeCharts).forEach(canvasId => {
    if (canvasId === "attendance-trend-chart") renderAttendanceTrendChart(canvasId);
    if (canvasId === "leave-dist-chart") renderLeaveDistributionChart(canvasId);
    if (canvasId === "dept-chart") renderDepartmentChart(canvasId);
    if (canvasId === "payroll-chart") renderPayrollChart(canvasId);
    if (canvasId === "gender-chart") renderGenderChart(canvasId);
  });
}
