import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SolarCalculator from '../components/SolarCalculator'
import Icon from '../components/Icon'

const services = [
  {
    icon: 'plug',
    color: 'bg-gen',
    title: 'Generator subscriptions',
    text: 'Compare fixed fees and kWh prices of neighbourhood generators, then subscribe to the plan that fits your amps.',
    points: ['5 A to 20 A plans', 'Monthly bill estimate', 'Subscriber ratings'],
  },
  {
    icon: 'sun',
    color: 'bg-solar',
    title: 'Solar systems',
    text: 'Size panels and batteries for your home and request a free survey from certified installers.',
    points: ['Interactive calculator', 'Packages with batteries', 'Payback estimate'],
  },
  {
    icon: 'clock',
    color: 'bg-grid',
    title: 'Power schedules',
    text: 'See when the state grid, the generator and the sun cover your area, hour by hour.',
    points: ['24-hour supply view', 'Next change alert', 'Six areas covered'],
  },
  {
    icon: 'receipt',
    color: 'bg-ink',
    title: 'Usage and bills',
    text: 'Track how much you use from each source and what each month costs you.',
    points: ['Monthly breakdown', 'Bill history', 'Daily load profile'],
  },
]

// What each ampere level can run at the same time
const ampGuide = [
  { amps: '5 A', watts: '1,100 W', runs: 'Fridge, lights, router, TV, laptops' },
  { amps: '10 A', watts: '2,200 W', runs: 'Everything above plus washing machine or water heater' },
  { amps: '15 A', watts: '3,300 W', runs: 'A full home with one air conditioner' },
  { amps: '20 A', watts: '4,400 W', runs: 'Large homes, two air conditioners or a small shop' },
]

export default function Services() {
  const { hash } = useLocation()

  // allow links like /services#calculator to jump to the calculator
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
  }, [hash])

  return (
    <>
      <PageHeader
        title="Everything your home needs to stay powered"
        intro="Four services built around the way electricity actually works in Lebanon: a few grid hours, a generator for the rest, and the sun when you can use it."
      />

      <section className="container-page grid gap-6 py-16 md:grid-cols-2">
        {services.map((s) => (
          <article key={s.title} className="flex gap-5 rounded-lg border border-line bg-white p-6">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white ${s.color}`}>
              <Icon name={s.icon} className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-mute">{s.text}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {s.points.map((p) => (
                  <li key={p} className="rounded-full bg-paper px-3 py-1 text-xs font-medium">{p}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section id="calculator" className="container-page scroll-mt-24 py-8">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Solar calculator</h2>
        <p className="mt-3 max-w-2xl text-lg text-mute">
          Find the system size and budget for the appliances you want to keep running.
        </p>
        <div className="mt-8">
          <SolarCalculator />
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Which ampere level do you need?</h2>
        <p className="mt-3 max-w-2xl text-lg text-mute">
          Generator subscriptions are sold by amps. Here is what each level can run at the same time on 220 V.
        </p>
        <div className="mt-8 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-paper text-mute">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Plan</th>
                <th scope="col" className="px-5 py-3 font-semibold">Max load</th>
                <th scope="col" className="px-5 py-3 font-semibold">What it runs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ampGuide.map((row) => (
                <tr key={row.amps}>
                  <th scope="row" className="px-5 py-4 text-base font-bold">{row.amps}</th>
                  <td className="whitespace-nowrap px-5 py-4">{row.watts}</td>
                  <td className="px-5 py-4 text-mute">{row.runs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/providers?type=generator" className="btn-ink mt-8">
          Compare generator plans
        </Link>
      </section>
    </>
  )
}