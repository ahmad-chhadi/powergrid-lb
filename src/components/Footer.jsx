import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-24 bg-night text-white/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Power hours, generator subscriptions and solar planning for homes in Lebanon, in one place.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-sun" to="/providers">Find a provider</Link></li>
            <li><Link className="hover:text-sun" to="/services">Solar calculator</Link></li>
            <li><Link className="hover:text-sun" to="/dashboard">My dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-sun" to="/about">About us</Link></li>
            <li><Link className="hover:text-sun" to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-white/50">
          © {new Date().getFullYear()} PowerGrid LB. CSCI426 project by Ahmad Chhadi. Provider data shown is sample data.
        </p>
      </div>
    </footer>
  )
}