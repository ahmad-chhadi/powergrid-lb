import { useState } from 'react'
import { money } from '../utils/schedule'
import { useLang } from '../i18n/LanguageContext'

// Typical household appliances: power in watts and default hours of use per day.
// Their names come from en.js / ar.js (calc.appliances.<id>).
const APPLIANCES = [
  { id: 'fridge', watts: 150, hours: 24, on: true },
  { id: 'lights', watts: 80, hours: 6, on: true },
  { id: 'router', watts: 15, hours: 24, on: true },
  { id: 'tv', watts: 100, hours: 5, on: true },
  { id: 'laptop', watts: 65, hours: 6, on: true },
  { id: 'washer', watts: 500, hours: 1, on: false },
  { id: 'heater', watts: 1500, hours: 1.5, on: false },
  { id: 'ac', watts: 1200, hours: 4, on: false },
]

// Assumptions used by the estimate (kept visible to the user below the result)
const SUN_HOURS = 5 // average peak sun hours per day in Lebanon
const LOSSES = 0.8 // inverter, wiring and heat losses
const PANEL_WATTS = 550
const NIGHT_SHARE = 0.5 // part of daily use that happens after sunset
const PRICE = { perKw: 700, perBatteryKwh: 300, install: 400 }
const GENERATOR_KWH = 0.42

export default function SolarCalculator() {
  const { t } = useLang()
  const [items, setItems] = useState(APPLIANCES)

  const toggle = (id) => setItems((list) => list.map((a) => (a.id === id ? { ...a, on: !a.on } : a)))
  const setHours = (id, hours) => setItems((list) => list.map((a) => (a.id === id ? { ...a, hours } : a)))

  const dailyKwh = items.filter((a) => a.on).reduce((sum, a) => sum + (a.watts * a.hours) / 1000, 0)
  const systemKw = Math.max(1, Math.ceil((dailyKwh / (SUN_HOURS * LOSSES)) * 10) / 10)
  const panels = Math.ceil((systemKw * 1000) / PANEL_WATTS)
  const batteryKwh = Math.max(5, Math.ceil((dailyKwh * NIGHT_SHARE) / LOSSES / 5) * 5)
  const cost = Math.round(systemKw * PRICE.perKw + batteryKwh * PRICE.perBatteryKwh + PRICE.install)
  const monthlySaving = dailyKwh * 30 * GENERATOR_KWH * 0.85
  const payback = monthlySaving > 0 ? Math.ceil(cost / monthlySaving) : 0

  return (
    <div className="grid overflow-hidden rounded-xl border border-line bg-white lg:grid-cols-[1.2fr_1fr]">
      <div className="p-5 sm:p-8">
        <h3 className="text-xl font-bold">{t('calc.question')}</h3>
        <p className="mt-1 text-sm text-mute">{t('calc.hint')}</p>
        <ul className="mt-6 divide-y divide-line">
          {items.map((a) => {
            const name = t(`calc.appliances.${a.id}`)
            return (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <input
                  id={`ap-${a.id}`}
                  type="checkbox"
                  checked={a.on}
                  onChange={() => toggle(a.id)}
                  className="h-4 w-4 accent-solar"
                />
                <label htmlFor={`ap-${a.id}`} className="flex-1 cursor-pointer">
                  <span className="block text-sm font-medium">{name}</span>
                  <span className="text-xs text-mute">{a.watts} W</span>
                </label>
                <label className="sr-only" htmlFor={`h-${a.id}`}>{t('calc.hoursFor', { name })}</label>
                <input
                  id={`h-${a.id}`}
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={a.hours}
                  disabled={!a.on}
                  onChange={(e) => setHours(a.id, Math.min(24, Math.max(0, Number(e.target.value))))}
                  className="field w-20 py-1.5 text-end disabled:opacity-40"
                />
                <span className="w-10 text-xs text-mute">{t('calc.hDay')}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="bg-night p-5 text-white sm:p-8" aria-live="polite">
        <p className="text-sm text-white/60">{t('calc.usesAbout')}</p>
        <p className="text-5xl font-extrabold" style={{ fontStretch: '120%' }}>
          {dailyKwh.toFixed(1)} <span className="text-2xl font-bold text-white/60">{t('calc.kwhDay')}</span>
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
          <Result label={t('calc.systemSize')} value={`${systemKw} kW`} />
          <Result label={t('calc.panels')} value={panels} />
          <Result label={t('calc.battery')} value={`${batteryKwh} kWh`} />
          <Result label={t('calc.cost')} value={money(cost)} highlight />
          <Result label={t('calc.savings')} value={t('calc.perMonth', { value: money(Math.round(monthlySaving)) })} />
          <Result label={t('calc.payback')} value={payback ? t('calc.months', { n: payback }) : '—'} />
        </dl>

        <p className="mt-8 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/50">
          {t('calc.note', { sun: SUN_HOURS, eff: LOSSES * 100, price: money(GENERATOR_KWH) })}
        </p>
      </div>
    </div>
  )
}

function Result({ label, value, highlight }) {
  return (
    <div>
      <dt className="text-xs text-white/55">{label}</dt>
      <dd className={`mt-1 text-xl font-bold ${highlight ? 'text-sun' : ''}`}>{value}</dd>
    </div>
  )
}
