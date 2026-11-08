import { countHours, hourLabel } from '../utils/schedule'
import { useLang } from '../i18n/LanguageContext'
import { useData } from '../i18n/useData'

// 24 cells, one per hour, coloured by the power source for that hour.
export default function SupplyStrip({ schedule, now, dark = false, animate = true, showTotals = true }) {
  const { t } = useLang()
  const { source } = useData()
  const totals = countHours(schedule)
  const labelColor = dark ? 'text-white/55' : 'text-mute'
  const describe = t('strip.describe', { E: totals.E, G: totals.G, S: totals.S, off: totals['-'] })

  return (
    <div>
      {/* time always runs left to right (00:00 -> 24:00), even on the Arabic page */}
      <div className="relative" dir="ltr">
        <div className="flex h-16 gap-[3px] sm:h-20" role="img" aria-label={describe}>
          {schedule.split('').map((s, h) => (
            <div
              key={h}
              title={`${hourLabel(h)}: ${source(s).name}`}
              className={`flex-1 rounded-[3px] ${source(s).color} ${animate ? 'cell-on' : ''} ${
                h === now ? (dark ? 'ring-2 ring-white ring-offset-2 ring-offset-night' : 'ring-2 ring-ink ring-offset-2') : ''
              }`}
              style={animate ? { animationDelay: `${h * 35}ms` } : undefined}
            />
          ))}
        </div>
        {now != null && (
          <div
            className="pointer-events-none absolute -top-6 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${((now + 0.5) / 24) * 100}%` }}
          >
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${dark ? 'bg-white text-night' : 'bg-ink text-white'}`}>
              {t('strip.now')}
            </span>
          </div>
        )}
        <div className={`mt-2 flex justify-between text-[11px] ${labelColor}`}>
          {[0, 6, 12, 18, 24].map((h) => (
            <span key={h}>{hourLabel(h)}</span>
          ))}
        </div>
      </div>

      {showTotals && (
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['E', 'G', 'S', '-'].map((k) => (
            <div key={k} className="flex items-center gap-2.5">
              <span className={`h-3.5 w-3.5 shrink-0 rounded-sm ${source(k).color} ${k === '-' ? 'border border-cut/40' : ''}`} />
              <div className="leading-tight">
                <dt className={`text-xs ${labelColor}`}>{source(k).name}</dt>
                <dd className={`text-sm font-semibold ${dark ? 'text-white' : 'text-ink'}`}>
                  {t('strip.hours', { n: totals[k] })}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
