export function formatMetalPrice(price: number): string {
  if (price <= 0) return "—"
  return price.toLocaleString()
}

export function formatMetalFinancial(price: number): string {
  if (price <= 0 && price !== 0) return "—"
  return price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
