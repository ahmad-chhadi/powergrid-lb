import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SupplyStrip from '../components/SupplyStrip'

const values = [
  {
    title: 'Clear prices',
    text: 'Every plan shows its fixed fee and its price per kWh, so two providers can be compared fairly.',
  },
  {
    title: 'Local first',
    text: 'Schedules and providers are organised by area, because power in Nabatieh is not the same as power in Beirut.',
  },
  {
    title: 'Cleaner energy',
    text: 'Each solar hour replaces diesel. We show the savings so families can plan the switch.',
  },
]

const timeline = [
  { when: 'Sep 2026', what: 'Idea and research on how households pay for electricity' },
  { when: 'Oct 2026', what: 'Interface design, area schedules and provider data model' },
  { when: 'Nov 2026', what: 'React front end, solar calculator and dashboard (Phase 1)' },
  { when: 'Next', what: 'Back end with real accounts, providers and meter readings (Phase 2)' },
]

export default function About() {
  return (
    <>
      <PageHeader
        title="Built for homes that live on three power sources"
        intro="Most Lebanese households pay for the state grid, a neighbourhood generator and, more and more, solar panels. PowerGrid LB puts all three in one view."
      />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-extrabold">The problem</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-mute">
            <p>
              In many areas the state grid supplies only a few hours a day. Families fill the gaps with generator
              subscriptions, priced in amps and kilowatt-hours that change from one provider to the next.
            </p>
            <p>
              Nobody knows exactly when the power will switch, which provider is fairer, or whether solar panels
              would pay off. The information exists, but it is scattered across WhatsApp groups and paper bills.
            </p>
          </div>
        </div>
        <figure className="rounded-xl bg-night p-6 sm:p-8">
          <figcaption className="mb-10 text-sm text-white/60">A typical day in Nabatieh</figcaption>
          <SupplyStrip schedule="GGGGGGEEEESSSSSSGGGGGG--" now={null} dark animate={false} />
        </figure>
      </section>

      <section className="bg-white">
        <div className="container-page py-16">
          <h2 className="text-3xl font-extrabold">What we stand for</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="border-l-4 border-sun pl-5">
                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-mute">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-3xl font-extrabold">Who’s behind it</h2>
          <div className="mt-6 flex items-center gap-4">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-xl font-extrabold text-sun"
              aria-hidden="true"
            >
              AC
            </span>
            <div>
              <p className="text-lg font-bold">Ahmad Chhadi</p>
              <p className="text-mute">Computer Science student, LIU Nabatieh</p>
            </div>
          </div>
          <p className="mt-6 leading-relaxed text-mute">
            PowerGrid LB is my project for CSCI426 Advanced Web Programming. It is a front-end prototype: providers,
            schedules and bills are sample data that a back end will replace in Phase 2.
          </p>
          <Link to="/contact" className="btn-ink mt-8">Get in touch</Link>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold">Project timeline</h2>
          <ol className="mt-6 space-y-0">
            {timeline.map((t, i) => (
              <li key={t.when} className="relative flex gap-5 pb-8 last:pb-0">
                {i < timeline.length - 1 && <span className="absolute left-[7px] top-5 h-full w-0.5 bg-line" />}
                <span className={`relative mt-1.5 h-4 w-4 shrink-0 rounded-full border-4 ${t.when === 'Next' ? 'border-line bg-white' : 'border-sun bg-ink'}`} />
                <div>
                  <p className="text-sm font-semibold text-mute">{t.when}</p>
                  <p className="mt-0.5 font-medium">{t.what}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}