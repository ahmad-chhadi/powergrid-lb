import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import Icon from './Icon'

const links = [
  { to: '/', label: 'Home' },
  { to: '/providers', label: 'Providers' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // close the mobile menu whenever the route changes
  useEffect(() => setOpen(false), [pathname])

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-ink text-white' : 'text-ink hover:bg-white'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <NavLink to="/dashboard" className="btn-sun py-2">
            <Icon name="gauge" className="h-4 w-4" />
            My dashboard
          </NavLink>
        </div>

        <button
          className="rounded-md p-2 text-ink md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-paper md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/dashboard" className="btn-sun mt-2">
              <Icon name="gauge" className="h-4 w-4" />
              My dashboard
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}