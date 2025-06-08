export const matchesConstraints = (params, constraints) => {
  return Object.entries(constraints).every(([paramName, regex]) => {
    const value = params[paramName];
    const pattern = new RegExp(`^${regex}$`);
    return value && pattern.test(value);
  });
}
