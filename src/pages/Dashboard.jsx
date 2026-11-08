import { Link } from 'react-router-dom'
import { StackedBars, LoadChart } from '../components/Charts'
import SupplyStrip from '../components/SupplyStrip'
import Icon from '../components/Icon'
import { areas, getArea } from '../data/areas'
import { monthlyUsage, hourlyLoad, bills, TARIFF } from '../data/usage'
import { money } from '../utils/schedule'
import { usePower } from '../context/PowerContext'

export default function Dashboard() {
  const { areaId, setArea, subscription, cancel } = usePower()
  const area = getArea(areaId) ?? areas[0]

  const thisMonth = monthlyUsage[monthlyUsage.length - 1]
  const lastMonth = monthlyUsage[monthlyUsage.length - 2]
  const total = thisMonth.E + thisMonth.G + thisMonth.S
  const lastTotal = lastMonth.E + lastMonth.G + lastMonth.S
  const cost = thisMonth.E * TARIFF.E + thisMonth.G * TARIFF.G
  const solarShare = Math.round((thisMonth.S / total) * 100)
  const change = Math.round(((total - lastTotal) / lastTotal) * 100)
  const due = bills.filter((b) => b.status === 'Due').reduce((s, b) => s + b.amount, 0)

  const stats = [
    { label: 'Used this month', value: `${total} kWh`, note: `${change > 0 ? '+' : ''}${change}% vs last month` },
    { label: 'Estimated cost', value: money(Math.round(cost)), note: 'Grid and generator only' },
    { label: 'From solar', value: `${solarShare}%`, note: `${thisMonth.S} kWh free energy` },
    { label: 'Amount due', value: money(due), note: due ? 'Pay before the 10th' : 'All bills paid' },
  ]

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold sm:text-5xl">My dashboard</h1>
            <p className="mt-2 text-mute">Sample household data for November 2026.</p>
          </div>
          <div>
            <label htmlFor="dash-area" className="label">My area</label>
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
        {subscription ? (
          <section className="flex flex-col gap-4 rounded-lg border-l-4 border-gen bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-sun">
                <Icon name={subscription.type === 'solar' ? 'sun' : 'plug'} />
              </span>
              <div>
                <p className="text-sm text-mute">
                  {subscription.type === 'solar' ? 'Site survey requested' : 'Active subscription'}
                </p>
                <p className="text-lg font-bold">
                  {subscription.providerName}, {subscription.plan}
                </p>
                <p className="text-sm text-mute">
                  {subscription.type === 'solar'
                    ? `Package price ${money(subscription.price)}`
                    : `About ${money(subscription.monthly)} per month`}
                  {' '}since {new Date(subscription.startedAt).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/providers/${subscription.providerId}`} className="btn-ghost py-2">View provider</Link>
              <button type="button" onClick={cancel} className="btn py-2 text-cut hover:bg-cut/10">
                {subscription.type === 'solar' ? 'Cancel request' : 'Unsubscribe'}
              </button>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-4 rounded-lg border border-dashed border-ink/30 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold">You haven’t chosen a provider yet</p>
              <p className="text-mute">Compare generator plans or solar packages in {area.name} and subscribe in one click.</p>
            </div>
            <Link to={`/providers?area=${area.id}`} className="btn-sun shrink-0">Find a provider</Link>
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
          <h2 className="text-lg font-bold">Today in {area.name}</h2>
          <div className="mt-8">
            <SupplyStrip schedule={area.schedule} now={new Date().getHours()} animate={false} />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">Consumption by source</h2>
            <p className="mb-4 text-sm text-mute">Select a month to see its breakdown.</p>
            <StackedBars data={monthlyUsage} />
          </section>
          <section className="rounded-lg border border-line bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">Average daily load (kW)</h2>
            <p className="mb-4 text-sm text-mute">The band underneath shows which source covers each hour.</p>
            <LoadChart values={hourlyLoad} schedule={area.schedule} />
          </section>
        </div>

        {/* Bills */}
        <section className="rounded-lg border border-line bg-white">
          <h2 className="p-5 text-lg font-bold sm:p-6">Bills</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-y border-line bg-paper text-mute">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Bill</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Month</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Generator kWh</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[...bills].sort((a, b) => b.id.localeCompare(a.id)).map((b) => (
                  <tr key={b.id}>
                    <td className="px-5 py-4 font-medium sm:px-6">{b.id}</td>
                    <td className="px-5 py-4">{b.month}</td>
                    <td className="px-5 py-4 text-right">{b.kwh}</td>
                    <td className="px-5 py-4 text-right font-semibold">{money(b.amount)}</td>
                    <td className="px-5 py-4 sm:px-6">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          b.status === 'Paid' ? 'bg-solar/12 text-[#0b6e67]' : 'bg-cut/10 text-cut'
                        }`}
                      >
                        {b.status}
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