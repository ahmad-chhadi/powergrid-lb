import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SupplyStrip from '../components/SupplyStrip'
import { useLang } from '../i18n/LanguageContext'
import { usePageTitle } from '../utils/usePageTitle'

export default function About() {
  const { t, lang } = useLang()
  usePageTitle(t('nav.about'))
  const values = t('about.values')
  const timeline = t('about.timeline')

  return (
    <>
      <PageHeader title={t('about.title')} intro={t('about.intro')} />

      <section className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-extrabold">{t('about.problemTitle')}</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-mute">
            <p>{t('about.problem1')}</p>
            <p>{t('about.problem2')}</p>
          </div>
        </div>
        <figure className="rounded-xl bg-night p-6 sm:p-8">
          <figcaption className="mb-10 text-sm text-white/60">{t('about.typicalDay')}</figcaption>
          <SupplyStrip schedule="GGGGGGEEEESSSSSSGGGGGG--" now={null} dark animate={false} />
        </figure>
      </section>

      <section className="bg-white">
        <div className="container-page py-16">
          <h2 className="text-3xl font-extrabold">{t('about.valuesTitle')}</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="border-s-4 border-sun ps-5">
                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-mute">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-3xl font-extrabold">{t('about.whoTitle')}</h2>
          <div className="mt-6 flex items-center gap-4">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-xl font-extrabold text-sun"
              aria-hidden="true"
            >
              {lang === 'ar' ? 'أ ش' : 'AC'}
            </span>
            <div>
              <p className="text-lg font-bold">{t('about.name')}</p>
              <p className="text-mute">{t('about.role')}</p>
            </div>
          </div>
          <p className="mt-6 leading-relaxed text-mute">{t('about.bio')}</p>
          <Link to="/contact" className="btn-ink mt-8">{t('about.getInTouch')}</Link>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold">{t('about.timelineTitle')}</h2>
          <ol className="mt-6 space-y-0">
            {timeline.map((item, i) => {
              const isLast = i === timeline.length - 1 // the last item has not happened yet
              return (
                <li key={item.when} className="relative flex gap-5 pb-8 last:pb-0">
                  {!isLast && <span className="absolute start-[7px] top-5 h-full w-0.5 bg-line" />}
                  <span className={`relative mt-1.5 h-4 w-4 shrink-0 rounded-full border-4 ${isLast ? 'border-line bg-white' : 'border-sun bg-ink'}`} />
                  <div>
                    <p className="text-sm font-semibold text-mute">{item.when}</p>
                    <p className="mt-0.5 font-medium">{item.what}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </>
  )
}
