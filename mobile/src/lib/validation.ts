export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string }

/** Four-bar strength meter: length, mixed case, number, symbol. */
export function passwordStrength(pw: string): Strength {
  if (!pw) return { score: 0, label: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['Too short', 'Weak', 'Fair', 'Strong', 'Elite']
  return { score: score as Strength['score'], label: pw.length < 8 ? labels[0] : labels[score] }
}
