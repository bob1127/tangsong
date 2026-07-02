export function formatMetalPrice(price: number): string {
  if (price <= 0) return "—"
  return price.toLocaleString()
}
