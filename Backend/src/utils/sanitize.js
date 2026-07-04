function sanitizeEmployee(emp) {
  if (!emp) return emp;
  const { password, ...rest } = emp;
  return rest;
}

module.exports = { sanitizeEmployee };
