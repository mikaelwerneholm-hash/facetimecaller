export function normalizePhoneNumber(raw: string): string {
  if (!raw.trim()) return ''

  // Strip formatting: spaces, dashes, dots, parentheses
  let n = raw.replace(/[\s\-\.\(\)]/g, '')

  if (n.startsWith('0046')) return '+46' + n.slice(4)
  if (n.startsWith('00')) return '+' + n.slice(2)
  if (n.startsWith('0')) return '+46' + n.slice(1)

  return n
}

export function isValidPhoneNumber(normalized: string): boolean {
  if (!normalized) return false
  if (!normalized.startsWith('+')) return false
  const digits = normalized.slice(1)
  return /^\d{7,14}$/.test(digits)
}

export function buildFaceTimeUrl(normalized: string): string {
  return `facetime://${normalized}`
}
