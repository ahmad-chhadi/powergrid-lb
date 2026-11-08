// Helpers for working with 24-hour supply schedules.

export function countHours(schedule) {
  const totals = { E: 0, G: 0, S: 0, '-': 0 }
  for (const ch of schedule) totals[ch] += 1
  return totals
}

// Groups consecutive hours with the same source: "EEGG" -> [{source:'E',from:0,to:2}, ...]
export function toBlocks(schedule) {
  const blocks = []
  for (let h = 0; h < schedule.length; h++) {
    const s = schedule[h]
    const last = blocks[blocks.length - 1]
    if (last && last.source === s) last.to = h + 1
    else blocks.push({ source: s, from: h, to: h + 1 })
  }
  return blocks
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

export const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: n % 1 ? 2 : 0 })