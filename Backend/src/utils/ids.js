function nextEmployeeId(employees) {
  const nums = employees
    .map((e) => parseInt(String(e.id).replace("EMP-", ""), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `EMP-${String(max + 1).padStart(3, "0")}`;
}

module.exports = { nextEmployeeId };
