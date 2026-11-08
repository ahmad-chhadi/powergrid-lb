// Lightweight SVG charts written by hand (no chart library needed).
import { useState } from 'react'

const SOURCE_FILL = { E: '#2f6feb', G: '#e8a33d', S: '#13a89e' }
const SOURCE_NAME = { E: 'State grid', G: 'Generator', S: 'Solar' }

// Stacked bars: monthly kWh split by source
export function StackedBars({ data }) {
  const [active, setActive] = useState(data.length - 1)
  const W = 560
  const H = 240
  const pad = { top: 16, right: 8, bottom: 28, left: 36 }
  const max = Math.ceil(Math.max(...data.map((d) => d.E + d.G + d.S)) / 100) * 100
  const innerH = H - pad.top - pad.bottom
  const slot = (W - pad.left - pad.right) / data.length
  const barW = Math.min(44, slot * 0.56)
  const y = (v) => pad.top + innerH - (v / max) * innerH
  const ticks = [0, max / 2, max]
  const d = data[active]

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <p>
          <span className="font-semibold">{d.month}</span>
          <span className="text-mute"> total {d.E + d.G + d.S} kWh</span>
        </p>
        <p className="flex gap-4">
          {['E', 'G', 'S'].map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SOURCE_FILL[k] }} />
              <span className="text-mute">{SOURCE_NAME[k]}</span>
              <span className="font-semibold">{d[k]}</span>
            </span>
          ))}
        </p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Monthly consumption by source">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="#dde2e9" />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#5b6577">{t}</text>
          </g>
        ))}
        {data.map((row, i) => {
          const x = pad.left + slot * i + (slot - barW) / 2
          let base = 0
          return (
            <g
              key={row.month}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              tabIndex={0}
              className="cursor-pointer outline-none"
              aria-label={`${row.month}: ${row.E + row.G + row.S} kWh`}
            >
              <rect x={pad.left + slot * i} y={pad.top} width={slot} height={innerH} fill={i === active ? '#f4f6f8' : 'transparent'} />
              {['E', 'G', 'S'].map((k) => {
                const top = y(base + row[k])
                const h = y(base) - top
                base += row[k]
                return <rect key={k} x={x} y={top + 1} width={barW} height={Math.max(0, h - 2)} rx="2" fill={SOURCE_FILL[k]} />
              })}
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="12" fill={i === active ? '#172033' : '#5b6577'} fontWeight={i === active ? 700 : 400}>
                {row.month}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Area line: average load in kW through the day
export function LoadChart({ values, schedule }) {
  const W = 560
  const H = 200
  const pad = { top: 12, right: 8, bottom: 40, left: 36 }
  const max = Math.ceil(Math.max(...values) * 2) / 2
  const innerW = W - pad.left - pad.right
  const innerH = H - pad.top - pad.bottom
  const x = (i) => pad.left + (i / (values.length - 1)) * innerW
  const y = (v) => pad.top + innerH - (v / max) * innerH
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L${x(values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
  const peak = values.indexOf(Math.max(...values))
  const cellW = innerW / 24

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Daily load, peak ${values[peak]} kW at ${peak}:00`}>
      {[0, max / 2, max].map((t) => (
        <g key={t}>
          <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="#dde2e9" />
          <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#5b6577">{t}</text>
        </g>
      ))}
      <path d={area} fill="#2f6feb" opacity="0.12" />
      <path d={line} fill="none" stroke="#2f6feb" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx={x(peak)} cy={y(values[peak])} r="5" fill="#fff" stroke="#2f6feb" strokeWidth="2.5" />
      <text x={x(peak)} y={y(values[peak]) - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#172033">
        Peak {values[peak]} kW
      </text>
      {/* source band under the chart: which source covered each hour */}
      {schedule &&
        schedule.split('').map((s, i) => (
          <rect
            key={i}
            x={pad.left + i * cellW + 0.5}
            y={H - pad.bottom + 10}
            width={cellW - 1}
            height="8"
            rx="1.5"
            fill={SOURCE_FILL[s] ?? '#d64545'}
            opacity={s === '-' ? 0.5 : 1}
          />
        ))}
      {[0, 6, 12, 18].map((h) => (
        <text key={h} x={pad.left + h * cellW} y={H - 6} fontSize="11" fill="#5b6577">
          {String(h).padStart(2, '0')}:00
        </text>
      ))}
    </svg>
  )
}