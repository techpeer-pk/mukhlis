export function toTitleCase(str) {
  if (!str) return ''
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

export function toCapitalized(str) {
  if (!str) return ''
  const s = String(str).trim()
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
