export function parseErrorMessage(raw: string): string {
  const minMatch = raw.match(/Amount ([\d.]+)\s+\S+ is below minimum ([\d.]+)/);
  if (minMatch) {
    return `Minimum transaction amount is $${(Math.floor(parseFloat(minMatch[2]) * 1000) / 1000).toFixed(3)}`;
  }
  const maxMatch = raw.match(/exceeds maximum ([\d.]+)/i);
  if (maxMatch) {
    return `Maximum transaction amount is $${(Math.floor(parseFloat(maxMatch[1]) * 1000) / 1000).toFixed(3)}`;
  }
  if (/insufficient/i.test(raw)) {
    return 'Insufficient balance for this transaction';
  }
  if (/timeout|timed out/i.test(raw)) {
    return 'Transaction timed out. Please try again.';
  }
  // Strip token addresses (base58 strings 32+ chars)
  return raw.replace(/[1-9A-HJ-NP-Za-km-z]{32,}/g, 'USD1').replace(/\s+/g, ' ');
}
