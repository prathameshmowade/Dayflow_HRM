/**
 * Generates automated employee login ID in format:
 * [Company Code 2 chars] + [Name Code 4 chars] + [Year 4 chars] + [Serial 4 chars]
 * Example: Odoo India + John Doe (2022) -> OIJODO20220001
 */
export function generateEmployeeId(companyName, firstName, lastName, joiningYear, serialNumber = 1) {
  const companyCode = (companyName || 'DF')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 2)
    .toUpperCase()
    .padEnd(2, 'X');

  const fnCode = (firstName || 'EM')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 2)
    .toUpperCase()
    .padEnd(2, 'X');

  const lnCode = (lastName || 'PL')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 2)
    .toUpperCase()
    .padEnd(2, 'X');

  const year = String(joiningYear || new Date().getFullYear());
  const serial = String(serialNumber).padStart(4, '0');

  return `${companyCode}${fnCode}${lnCode}${year}${serial}`;
}

export function generateDefaultPassword(loginId) {
  return `${loginId}@2026`;
}
