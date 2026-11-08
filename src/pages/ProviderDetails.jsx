import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SupplyStrip from '../components/SupplyStrip'
import Icon from '../components/Icon'
import Rating from '../components/Rating'
import { getArea } from '../data/areas'
import { getProvider } from '../data/providers'
import { money } from '../utils/schedule'
import { usePower } from '../context/PowerContext'

export default function ProviderDetails() {
  // the :id part of the URL decides which provider is shown
  const { id } = useParams()
  const provider = getProvider(id)

  if (!provider) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="text-3xl font-extrabold">This provider is not listed</h1>
        <p className="mt-3 text-mute">The link may be outdated. Browse the full list to find another provider.</p>
        <Link to="/providers" className="btn-ink mt-8">Back to providers</Link>
      </section>
    )
  }

  const area = getArea(provider.area)
  const isGen = provider.type === 'generator'

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-page py-10 sm:py-14">
          <Link to="/providers" className="inline-flex items-center gap-1.5 text-sm font-medium text-mute hover:text-ink">
            <Icon name="arrowLeft" className="h-4 w-4" />
            All providers
          </Link>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`text-sm font-semibold ${isGen ? 'text-[#8a5a12]' : 'text-[#0b6e67]'}`}>
                {isGen ? 'Generator network' : 'Solar installer'} in {area.name}
              </p>
              <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{provider.name}</h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-mute">{provider.summary}</p>
            </div>
            <dl className="grid shrink-0 grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-mute">Rating</dt>
                <dd className="mt-1"><Rating value={provider.rating} /></dd>
              </div>
              <div>
                <dt className="text-mute">{isGen ? 'Supply' : 'Sun hours'}</dt>
                <dd className="mt-1 font-semibold">{provider.hoursPerDay} h/day</dd>
              </div>
              <div>
                <dt className="text-mute">Since</dt>
                <dd className="mt-1 font-semibold">{provider.since}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold">What’s included</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {provider.features.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-md bg-white p-4">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-solar" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Typical day in {area.name}</h2>
            <p className="mt-2 text-mute">
              {isGen
                ? 'Amber hours are covered by this generator when the state grid is off.'
                : 'Teal hours are when panels produce. A battery carries that energy into the evening.'}
            </p>
            <div className="mt-8 rounded-lg border border-line bg-white p-5">
              <SupplyStrip schedule={area.schedule} now={null} animate={false} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">What subscribers say</h2>
            <ul className="mt-5 divide-y divide-line rounded-lg border border-line bg-white">
              {provider.reviews.map((r) => (
                <li key={r.name} className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{r.name}</p>
                    <Rating value={r.rating} />
                  </div>
                  <p className="mt-2 leading-relaxed text-mute">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* on phones the plan picker comes first; on large screens it sits on the right */}
        <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
          {isGen ? <GeneratorPlans provider={provider} /> : <SolarPackages provider={provider} />}
          <a
            href={`tel:${provider.phone.replace(/\s/g, '')}`}
            className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-mute hover:text-ink"
          >
            <Icon name="phone" className="h-4 w-4" />
            {provider.phone}
          </a>
        </aside>
      </section>
    </>
  )
}

function GeneratorPlans({ provider }) {
  const { subscription, subscribe } = usePower()
  const [planIndex, setPlanIndex] = useState(1 < provider.plans.length ? 1 : 0)
  const [kwh, setKwh] = useState(150)
  const plan = provider.plans[planIndex]
  const monthly = plan.fee + kwh * plan.kwh
  const subscribed = subscription?.providerId === provider.id

  return (
    <div className="rounded-lg border-2 border-ink bg-white p-6">
      <h2 className="text-xl font-bold">Choose your plan</h2>
      <fieldset className="mt-5">
        <legend className="label">Ampere level</legend>
        <div className="grid grid-cols-4 gap-2">
          {provider.plans.map((p, i) => (
            <button
              key={p.amps}
              type="button"
              onClick={() => setPlanIndex(i)}
              aria-pressed={i === planIndex}
              className={`rounded-md border py-2.5 text-sm font-semibold ${
                i === planIndex ? 'border-gen bg-gen text-night' : 'border-line hover:border-ink'
              }`}
            >
              {p.amps} A
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="kwh" className="label flex justify-between">
          <span>Expected use per month</span>
          <span className="font-semibold">{kwh} kWh</span>
        </label>
        <input
          id="kwh"
          type="range"
          min="50"
          max="400"
          step="10"
          value={kwh}
          onChange={(e) => setKwh(Number(e.target.value))}
          className="w-full accent-gen"
        />
      </div>

      <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-mute">Fixed fee ({plan.amps} A)</dt>
          <dd>{money(plan.fee)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-mute">{kwh} kWh × {money(plan.kwh)}</dt>
          <dd>{money(kwh * plan.kwh)}</dd>
        </div>
        <div className="flex items-baseline justify-between pt-2">
          <dt className="font-semibold">Estimated monthly bill</dt>
          <dd className="text-2xl font-extrabold">{money(Math.round(monthly * 100) / 100)}</dd>
        </div>
      </dl>

      {subscribed ? (
        <div className="mt-6 rounded-md bg-solar/10 p-4 text-sm">
          <p className="font-semibold text-[#0b6e67]">You’re subscribed to {subscription.plan}.</p>
          <Link to="/dashboard" className="mt-1 inline-block font-semibold text-grid hover:underline">
            Open your dashboard
          </Link>
        </div>
      ) : (
        <button
          type="button"
          className="btn-sun mt-6 w-full"
          onClick={() =>
            subscribe({
              providerId: provider.id,
              providerName: provider.name,
              type: 'generator',
              plan: `${plan.amps} A plan`,
              monthly: Math.round(monthly * 100) / 100,
            })
          }
        >
          Subscribe to {plan.amps} A
        </button>
      )}
    </div>
  )
}

function SolarPackages({ provider }) {
  const { subscription, subscribe } = usePower()
  const [index, setIndex] = useState(0)
  const pkg = provider.packages[index]
  const requested = subscription?.providerId === provider.id

  return (
    <div className="rounded-lg border-2 border-ink bg-white p-6">
      <h2 className="text-xl font-bold">Choose a package</h2>
      <div className="mt-5 space-y-2">
        {provider.packages.map((p, i) => (
          <label
            key={p.name}
            className={`flex cursor-pointer items-center justify-between rounded-md border p-4 ${
              i === index ? 'border-solar bg-solar/8' : 'border-line hover:border-ink'
            }`}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="package"
                checked={i === index}
                onChange={() => setIndex(i)}
                className="accent-solar"
              />
              <span>
                <span className="block font-semibold">{p.name}</span>
                <span className="text-sm text-mute">{p.kw} kW panels, {p.battery} kWh battery</span>
              </span>
            </span>
            <span className="font-bold">{money(p.price)}</span>
          </label>
        ))}
      </div>
      <p className="mt-5 text-sm leading-relaxed text-mute">
        A {pkg.kw} kW system produces about {Math.round(pkg.kw * 5 * 30)} kWh a month in Lebanese sun.
      </p>

      {requested ? (
        <div className="mt-6 rounded-md bg-solar/10 p-4 text-sm">
          <p className="font-semibold text-[#0b6e67]">Site survey requested for the {subscription.plan}.</p>
          <Link to="/dashboard" className="mt-1 inline-block font-semibold text-grid hover:underline">
            Open your dashboard
          </Link>
        </div>
      ) : (
        <button
          type="button"
          className="btn-ink mt-6 w-full"
          onClick={() =>
            subscribe({
              providerId: provider.id,
              providerName: provider.name,
              type: 'solar',
              plan: `${pkg.name} package`,
              monthly: 0,
              price: pkg.price,
            })
          }
        >
          Request a free site survey
        </button>
      )}
    </div>
  )
}