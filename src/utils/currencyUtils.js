/**
 * Formatea un valor numérico a moneda colombiana (COP)
 * @param {number} amount
 * @returns {string} Ejemplo: "$ 25.000"
 */
export function formatCOP(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$ 0';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
