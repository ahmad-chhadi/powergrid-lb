import { Link } from 'react-router-dom'
import SupplyStrip from '../components/SupplyStrip'
import { useLang } from '../i18n/LanguageContext'
import { usePageTitle } from '../utils/usePageTitle'

export default function NotFound() {
  const { t } = useLang()
  usePageTitle('404')
  return (
    <section className="container-page py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-7xl font-extrabold" style={{ fontStretch: '125%' }}>404</p>
        <h1 className="mt-4 text-3xl font-extrabold">{t('notFound.title')}</h1>
        <p className="mt-3 text-mute">{t('notFound.text')}</p>
        <div className="mt-10">
          <SupplyStrip schedule="------------------------" now={null} showTotals={false} animate={false} />
        </div>
        <Link to="/" className="btn-ink mt-10">{t('notFound.back')}</Link>
      </div>
    </section>
  )
}
