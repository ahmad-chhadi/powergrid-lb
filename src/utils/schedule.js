// Helpers for working with 24-hour supply schedules.

export function countHours(schedule) {
  const totals = { E: 0, G: 0, S: 0, '-': 0 }
  for (const ch of schedule) totals[ch] += 1
  return totals
}

export const hourLabel = (h) => `${String(h % 24).padStart(2, '0')}:00`

// Next hour (from `now`) at which the source changes
export function nextChange(schedule, now) {
  const current = schedule[now]
  for (let i = 1; i < 24; i++) {
    const h = (now + i) % 24
    if (schedule[h] !== current) return { hour: h, source: schedule[h] }
  }
  return null
}

// money(18) -> "$18", money(9.5) -> "$9.50", money(93, 2) -> "$93.00" (fixed decimals for tables)
export const money = (n, decimals = n % 1 ? 2 : 0) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
