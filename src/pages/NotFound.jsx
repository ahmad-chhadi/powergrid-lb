import { Link } from 'react-router-dom'
import SupplyStrip from '../components/SupplyStrip'

export default function NotFound() {
  return (
    <section className="container-page py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-7xl font-extrabold" style={{ fontStretch: '125%' }}>404</p>
        <h1 className="mt-4 text-3xl font-extrabold">This page is in a power cut</h1>
        <p className="mt-3 text-mute">The address doesn’t match any page. Head back home and pick up from there.</p>
        <div className="mt-10">
          <SupplyStrip schedule="------------------------" now={null} showTotals={false} animate={false} />
        </div>
        <Link to="/" className="btn-ink mt-10">Back to home</Link>
      </div>
    </section>
  )
}