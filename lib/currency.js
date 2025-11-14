export function formatCurrency(value) {
  if (!value && value !== 0) return "$0.00"
  const numValue = typeof value === "string" ? parseFloat(value) : value
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(numValue)
}

export function parseCurrency(value) {
  if (!value) return ""
  const cleanValue = value.replace(/[^0-9.]/g, "")
  return cleanValue
}

export function handleCurrencyInput(e, callback) {
  const value = e.target.value
  const cleanValue = parseCurrency(value)
  
  if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
    callback(cleanValue)
  }
}

export function displayCurrency(value) {
  if (!value) return ""
  const numValue = parseFloat(value)
  if (isNaN(numValue)) return ""
  return formatCurrency(numValue)
}
