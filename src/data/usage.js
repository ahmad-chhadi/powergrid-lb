// Sample household usage for the dashboard (kWh per month, split by source).
export const monthlyUsage = [
  { month: 'Jun', E: 62, G: 168, S: 120 },
  { month: 'Jul', E: 55, G: 190, S: 132 },
  { month: 'Aug', E: 48, G: 205, S: 138 },
  { month: 'Sep', E: 66, G: 172, S: 118 },
  { month: 'Oct', E: 71, G: 150, S: 96 },
  { month: 'Nov', E: 74, G: 141, S: 80 },
]

// average load in kW for each hour of a typical day
export const hourlyLoad = [
  0.6, 0.5, 0.5, 0.4, 0.4, 0.5, 0.9, 1.3, 1.1, 0.9, 0.8, 1.0,
  1.4, 1.2, 1.0, 0.9, 1.1, 1.5, 1.9, 2.2, 2.0, 1.6, 1.1, 0.8,
]

export const bills = [
  { id: 'B-1106', month: 'October 2026', kwh: 150, amount: 93.0, status: 'Paid' },
  { id: 'B-1094', month: 'September 2026', kwh: 172, amount: 102.24, status: 'Paid' },
  { id: 'B-1081', month: 'August 2026', kwh: 205, amount: 116.1, status: 'Paid' },
  { id: 'B-1117', month: 'November 2026', kwh: 141, amount: 89.22, status: 'Due' },
]

// tariffs used for cost estimates
export const TARIFF = { E: 0.27, G: 0.42, S: 0 }