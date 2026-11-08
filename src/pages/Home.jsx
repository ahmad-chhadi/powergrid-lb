import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SupplyStrip from '../components/SupplyStrip'
import ProviderCard from '../components/ProviderCard'
import Icon from '../components/Icon'
import { areas, getArea, SOURCES } from '../data/areas'
import { providers } from '../data/providers'
import { hourLabel, nextChange } from '../utils/schedule'
import { usePower } from '../context/PowerContext'

// current hour, refreshed every minute
function useCurrentHour() {
  const [hour, setHour] = useState(new Date().getHours())
  useEffect(() => {
    const t = setInterval(() => setHour(new Date().getHours()), 60_000)
    return () => clearInterval(t)
  }, [])
  return hour
}

const features = [
  {
    icon: 'plug',
    title: 'Compare generator subscriptions',
    text: 'See the monthly fee for 5, 10 or 15 amps and the price per kWh for every provider in your area.',
    to: '/providers',
    cta: 'Browse providers',
  },
  {
    icon: 'sun',
    title: 'Size a solar system',
    text: 'List the appliances you run and get the panels, battery and budget you need, with the payback time.',
    to: '/services#calculator',
    cta: 'Open the calculator',
  },
  {
    icon: 'gauge',
    title: 'Follow your usage and bills',
    text: 'One dashboard for grid, generator and solar hours, monthly consumption and what you owe.',
    to: '/dashboard',
    cta: 'View dashboard',
  },
]

const steps = [
  { title: 'Pick your area', text: 'Choose your town to load today’s grid and generator hours.' },
  { title: 'Compare providers', text: 'Filter by type, price and rating, then open a provider for full plans.' },
  { title: 'Subscribe and track', text: 'Choose a plan and follow consumption and bills from your dashboard.' },
]

export default function Home() {
  const { areaId, setArea } = usePower()
  const area = getArea(areaId) ?? areas[0]
  const now = useCurrentHour()
  const current = SOURCES[area.schedule[now]]
  const next = nextChange(area.schedule, now)
  const local = providers.filter((p) => p.area === area.id).slice(0, 3)
  const featured = local.length ? local : providers.slice(0, 3)

  return (
    <>
      {/* Hero: today's power in the user's area */}
      <section className="bg-night text-white">
        <div className="container-page pb-14 pt-14 sm:pt-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Know when the power comes back. Pay less while it’s out.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              PowerGrid LB shows today’s grid and generator hours for your area, compares local subscriptions
              and helps you plan solar, so your home is never in the dark by surprise.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-white/10 bg-night-2 p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/60">Power today in</p>
                <label htmlFor="area" className="sr-only">Choose your area</label>
                <select
                  id="area"
                  value={area.id}
                  onChange={(e) => setArea(e.target.value)}
                  className="mt-1 cursor-pointer rounded-md border border-white/20 bg-night px-3 py-2 text-xl font-bold text-white focus:border-sun focus:outline-none"
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-night px-4 py-3">
                <span className={`now-dot h-2.5 w-2.5 rounded-full ${current.key === '-' ? 'bg-cut' : current.color}`} />
                <div className="text-sm leading-snug">
                  <p className="font-semibold">
                    {current.key === '-' ? 'No power right now' : `${current.name} is on now`}
                  </p>
                  {next && (
                    <p className="text-white/60">
                      {SOURCES[next.source].name} from {hourLabel(next.hour)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <SupplyStrip key={area.id} schedule={area.schedule} now={now} dark />
            </div>
            <p className="mt-5 border-t border-white/10 pt-4 text-sm text-white/55">{area.note}</p>
          </div>
        </div>
      </section>

      {/* What the platform does */}
      <section className="container-page py-20">
        <h2 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">
          Three problems every Lebanese household knows
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {features.map((f) => (
            <article key={f.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-sun">
                <Icon name={f.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-bold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-mute">{f.text}</p>
              <Link to={f.to} className="mt-4 inline-block text-sm font-semibold text-grid hover:underline">
                {f.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* How it works: a real sequence, so it is numbered */}
      <section className="bg-white">
        <div className="container-page py-20">
          <h2 className="text-3xl font-extrabold sm:text-4xl">How it works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative border-t-4 border-ink pt-6">
                <span className="text-5xl font-extrabold text-line" style={{ fontStretch: '125%' }}>
                  {i + 1}
                </span>
                <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mt-1 leading-relaxed text-mute">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Providers near the user */}
      <section className="container-page py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Providers in {area.name}</h2>
            <p className="mt-2 text-mute">Ratings come from subscribers in the same area.</p>
          </div>
          <Link to={`/providers?area=${area.id}`} className="btn-ghost self-start sm:self-auto">
            See all in {area.name}
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      </section>

      {/* Solar call to action */}
      <section className="container-page">
        <div className="grid overflow-hidden rounded-xl bg-ink text-white md:grid-cols-[1.3fr_1fr]">
          <div className="p-8 sm:p-12">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Every hour of sun is an hour you don’t pay the generator.</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-white/70">
              Our calculator turns your appliance list into a system size, a budget and the number of months it
              takes to pay for itself.
            </p>
            <Link to="/services#calculator" className="btn-sun mt-8">
              <Icon name="sun" className="h-4 w-4" />
              Calculate my solar system
            </Link>
          </div>
          <div className="relative hidden min-h-64 bg-solar md:block" aria-hidden="true">
            {/* stylised solar panel grid */}
            <div className="absolute inset-8 grid grid-cols-4 grid-rows-3 gap-1.5 rotate-[-8deg]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-sm border border-white/30 bg-[#0d7f78]" />
              ))}
            </div>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sun" />
          </div>
        </div>
      </section>
    </>
  )
}