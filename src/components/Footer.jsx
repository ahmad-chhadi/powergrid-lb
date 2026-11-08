import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useLang } from '../i18n/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="mt-24 bg-night text-white/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{t('footer.tagline')}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{t('footer.explore')}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-sun" to="/providers">{t('footer.findProvider')}</Link></li>
            <li><Link className="hover:text-sun" to="/services">{t('footer.solarCalc')}</Link></li>
            <li><Link className="hover:text-sun" to="/dashboard">{t('footer.myDashboard')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{t('footer.company')}</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-sun" to="/about">{t('footer.aboutUs')}</Link></li>
            <li><Link className="hover:text-sun" to="/contact">{t('footer.contact')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-white/50">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
