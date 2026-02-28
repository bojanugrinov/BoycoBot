export function formatBalance(amount: number) {
  return amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
}
