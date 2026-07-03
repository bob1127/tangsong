export function formatMetalPrice(price: number): string {
  if (price <= 0) return "—"
  return price.toLocaleString()
}

export function formatMetalUpdateTime(
  iso: string | null | undefined
): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString("zh-TW")
}
