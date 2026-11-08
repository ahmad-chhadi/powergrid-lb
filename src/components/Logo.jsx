import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="PowerGrid LB home">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={light ? '#F4F6F8' : '#0F1C2E'} />
        <path d="M18 5 9 18h6l-2 9 9-13h-6z" fill="#F2B705" />
      </svg>
      <span
        className={`text-lg font-extrabold ${light ? 'text-white' : 'text-ink'}`}
        style={{ fontStretch: '118%' }}
      >
        PowerGrid<span className="text-sun"> LB</span>
      </span>
    </Link>
  )
}