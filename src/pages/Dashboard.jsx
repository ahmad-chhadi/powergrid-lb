import { Link } from 'react-router-dom'
import { StackedBars, LoadChart } from '../components/Charts'
import SupplyStrip from '../components/SupplyStrip'
import Icon from '../components/Icon'
import { monthlyUsage, hourlyLoad, bills, TARIFF } from '../data/usage'
import { money } from '../utils/schedule'
import { usePower } from '../context/PowerContext'
import { useLang } from '../i18n/LanguageContext'
import { useData, planLabel } from '../i18n/useData'
import { usePageTitle } from '../utils/usePageTitle'

export default function Dashboard() {
  const { t } = useLang()
  usePageTitle(t('nav.dashboard'))
  const { areas, getArea, getProvider } = useData()
  const { areaId, setArea, subscription, cancel } = usePower()
  const area = getArea(areaId) ?? areas[0]
  const subProvider = subscription ? getProvider(subscription.providerId) : null

  const thisMonth = monthlyUsage[monthlyUsage.length - 1]
  const lastMonth = monthlyUsage[monthlyUsage.length - 2]
  const total = thisMonth.E + thisMonth.G + thisMonth.S
  const lastTotal = lastMonth.E + lastMonth.G + lastMonth.S
  const cost = thisMonth.E * TARIFF.E + thisMonth.G * TARIFF.G
  const solarShare = Math.round((thisMonth.S / total) * 100)
  const change = Math.round(((total - lastTotal) / lastTotal) * 100)
  const due = bills.filter((b) => b.status === 'Due').reduce((s, b) => s + b.amount, 0)

  const stats = [
    { label: t('dashboard.used'), value: `${total} kWh`, note: t('dashboard.vsLast', { change: `${change > 0 ? '+' : ''}${change}` }) },
    { label: t('dashboard.estCost'), value: money(Math.round(cost)), note: t('dashboard.gridGenOnly') },
    { label: t('dashboard.fromSolar'), value: `${solarShare}%`, note: t('dashboard.freeEnergy', { n: thisMonth.S }) },
    { label: t('dashboard.due'), value: money(due), note: due ? t('dashboard.payBefore') : t('dashboard.allPaid') },
  ]

  // "October 2026" -> "تشرين الأول 2026" in Arabic
  const billMonth = (text) => {
    const [month, year] = text.split(' ')
    return `${t(`months.${month}`)} ${year}`
  }

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold sm:text-5xl">{t('dashboard.title')}</h1>
            <p className="mt-2 text-mute">{t('dashboard.sample')}</p>
          </div>
          <div>
            <label htmlFor="dash-area" className="label">{t('dashboard.myArea')}</label>
            <select id="dash-area" value={area.id} onChange={(e) => setArea(e.target.value)} className="field w-48">
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="container-page space-y-6 py-10">
        {/* Subscription */}
        {subscription && subProvider ? (
          <section className="flex flex-col gap-4 rounded-lg border-s-4 border-gen bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ink text-sun">
                <Icon name={subscription.type === 'solar' ? 'sun' : 'plug'} />
              </span>
              <div>
                <p className="text-sm text-mute">
                  {subscription.type === 'solar' ? t('dashboard.surveyRequested') : t('dashboard.active')}
                </p>
                <p className="text-lg font-bold">
                  {t('dashboard.subLine', { provider: subProvider.name, plan: planLabel(subscription, subProvider, t) })}
                </p>
                <p className="text-sm text-mute">
                  {subscription.type === 'solar'
                    ? t('dashboard.packagePrice', { price: money(subscription.price) })
                    : t('dashboard.aboutMonth', { price: money(subscription.monthly) })}{' '}
                  {t('dashboard.since', { date: new Date(subscription.startedAt).toLocaleDateString('en-GB') })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/providers/${subscription.providerId}`} className="btn-ghost py-2">
                {t('dashboard.viewProvider')}
              </Link>
              <button type="button" onClick={cancel} className="btn py-2 text-cut hover:bg-cut/10">
                {subscription.type === 'solar' ? t('dashboard.cancelRequest') : t('dashboard.unsubscribe')}
              </button>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-4 rounded-lg border border-dashed border-ink/30 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold">{t('dashboard.noProviderTitle')}</p>
              <p className="text-mute">{t('dashboard.noProviderText', { area: area.name })}</p>
            </div>
            <Link to={`/providers?area=${area.id}`} className="btn-sun shrink-0">{t('dashboard.findProvider')}</Link>
          </section>
        )}

        {/* Key numbers */}
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-5">
              <p className="text-sm text-mute">{s.label}</p>
              <p className="mt-1 text-2xl font-extrabold sm:text-3xl" style={{ fontStretch: '115%' }}>{s.value}</p>
              <p className="mt-1 text-xs text-mute">{s.note}</p>
            </div>
          ))}
        </section>

        {/* Today */}
        <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold">{t('dashboard.today', { area: area.name })}</h2>
          <div className="mt-8">
            <SupplyStrip schedule={area.schedule} now={new Date().getHours()} animate={false} />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">{t('dashboard.bySource')}</h2>
            <p className="mb-4 text-sm text-mute">{t('dashboard.selectMonth')}</p>
            <StackedBars data={monthlyUsage} />
          </section>
          <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">{t('dashboard.dailyLoad')}</h2>
            <p className="mb-4 text-sm text-mute">{t('dashboard.bandNote')}</p>
            <LoadChart values={hourlyLoad} schedule={area.schedule} />
          </section>
        </div>

        {/* Bills */}
        <section className="rounded-lg border border-line bg-white">
          <h2 className="p-5 text-lg font-bold sm:p-6">{t('dashboard.bills')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-start text-sm">
              <thead className="border-y border-line bg-paper text-mute">
                <tr>
                  <th scope="col" className="px-5 py-3 text-start font-semibold sm:px-6">{t('dashboard.cols.bill')}</th>
                  <th scope="col" className="px-5 py-3 text-start font-semibold">{t('dashboard.cols.month')}</th>
                  <th scope="col" className="px-5 py-3 text-end font-semibold">{t('dashboard.cols.kwh')}</th>
                  <th scope="col" className="px-5 py-3 text-end font-semibold">{t('dashboard.cols.amount')}</th>
                  <th scope="col" className="px-5 py-3 text-start font-semibold sm:px-6">{t('dashboard.cols.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[...bills].sort((a, b) => b.id.localeCompare(a.id)).map((b) => (
                  <tr key={b.id}>
                    <td className="px-5 py-4 font-medium sm:px-6">{b.id}</td>
                    <td className="px-5 py-4">{billMonth(b.month)}</td>
                    <td className="px-5 py-4 text-end">{b.kwh}</td>
                    <td className="px-5 py-4 text-end font-semibold">{money(b.amount, 2)}</td>
                    <td className="px-5 py-4 sm:px-6">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          b.status === 'Paid' ? 'bg-solar/12 text-[#0b6e67]' : 'bg-cut/10 text-cut'
                        }`}
                      >
                        {t(`dashboard.status.${b.status}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
