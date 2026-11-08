import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SolarCalculator from '../components/SolarCalculator'
import Icon from '../components/Icon'
import { useLang } from '../i18n/LanguageContext'

// icon and colour for each service card; the text comes from translations.js
const serviceStyles = [
  { icon: 'plug', color: 'bg-gen' },
  { icon: 'sun', color: 'bg-solar' },
  { icon: 'clock', color: 'bg-grid' },
  { icon: 'receipt', color: 'bg-ink' },
]

// What each ampere level can run at the same time
const ampLevels = [
  { amps: '5 A', watts: '1,100 W' },
  { amps: '10 A', watts: '2,200 W' },
  { amps: '15 A', watts: '3,300 W' },
  { amps: '20 A', watts: '4,400 W' },
]

export default function Services() {
  const { t } = useLang()
  const { hash } = useLocation()
  const services = t('services.items')
  const ampRuns = t('services.ampRuns')

  // allow links like /services#calculator to jump to the calculator
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
  }, [hash])

  return (
    <>
      <PageHeader title={t('services.title')} intro={t('services.intro')} />

      <section className="container-page grid gap-6 py-16 md:grid-cols-2">
        {services.map((s, i) => (
          <article key={s.title} className="flex gap-5 rounded-lg border border-line bg-white p-6">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white ${serviceStyles[i].color}`}>
              <Icon name={serviceStyles[i].icon} className="h-6 w-6" />
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
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t('services.calcTitle')}</h2>
        <p className="mt-3 max-w-2xl text-lg text-mute">{t('services.calcIntro')}</p>
        <div className="mt-8">
          <SolarCalculator />
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t('services.ampTitle')}</h2>
        <p className="mt-3 max-w-2xl text-lg text-mute">{t('services.ampIntro')}</p>
        <div className="mt-8 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[520px] text-start text-sm">
            <thead className="bg-paper text-mute">
              <tr>
                <th scope="col" className="px-5 py-3 text-start font-semibold">{t('services.table.plan')}</th>
                <th scope="col" className="px-5 py-3 text-start font-semibold">{t('services.table.maxLoad')}</th>
                <th scope="col" className="px-5 py-3 text-start font-semibold">{t('services.table.runs')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ampLevels.map((row, i) => (
                <tr key={row.amps}>
                  <th scope="row" className="whitespace-nowrap px-5 py-4 text-start text-base font-bold">{row.amps}</th>
                  <td className="whitespace-nowrap px-5 py-4">{row.watts}</td>
                  <td className="px-5 py-4 text-mute">{ampRuns[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link to="/providers?type=generator" className="btn-ink mt-8">
          {t('services.compare')}
        </Link>
      </section>
    </>
  )
}
