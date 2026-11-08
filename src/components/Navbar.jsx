import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import Icon from './Icon'
import { useLang } from '../i18n/LanguageContext'

const links = [
  { to: '/', key: 'home' },
  { to: '/providers', key: 'providers' },
  { to: '/services', key: 'services' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { t, lang, toggle } = useLang()

  // close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname])

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-ink text-white' : 'text-ink hover:bg-white'
    }`

  // button that switches the whole site between English and Arabic
  const langButton = (
    <button
      type="button"
      onClick={toggle}
      lang={lang === 'en' ? 'ar' : 'en'}
      aria-label={t('nav.switchLabel')}
      className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink hover:border-ink"
    >
      {t('nav.switchTo')}
    </button>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-3" aria-label="Main">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {t(`nav.${l.key}`)}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {langButton}
          <NavLink to="/dashboard" className="btn-sun py-2">
            <Icon name="gauge" className="h-4 w-4" />
            {t('nav.dashboard')}
          </NavLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {langButton}
          <button
            className="rounded-md p-2 text-ink"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-paper md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {t(`nav.${l.key}`)}
              </NavLink>
            ))}
            <NavLink to="/dashboard" className="btn-sun mt-2">
              <Icon name="gauge" className="h-4 w-4" />
              {t('nav.dashboard')}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}
