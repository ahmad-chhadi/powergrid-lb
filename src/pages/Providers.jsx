import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ProviderCard from '../components/ProviderCard'
import Icon from '../components/Icon'
import { areas } from '../data/areas'
import { providers, startingPrice } from '../data/providers'

const types = [
  { value: 'all', label: 'All' },
  { value: 'generator', label: 'Generators' },
  { value: 'solar', label: 'Solar installers' },
]

const sorts = {
  rating: { label: 'Highest rated', fn: (a, b) => b.rating - a.rating },
  price: { label: 'Lowest price', fn: (a, b) => startingPrice(a) - startingPrice(b) },
  hours: { label: 'Most hours per day', fn: (a, b) => b.hoursPerDay - a.hoursPerDay },
}

export default function Providers() {
  // Filters live in the URL (?q=&area=&type=&sort=) so a filtered list can be shared or bookmarked.
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const area = params.get('area') ?? 'all'
  const type = params.get('type') ?? 'all'
  const sort = params.get('sort') ?? 'rating'

  const update = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const text = q.trim().toLowerCase()
    return providers
      .filter((p) => area === 'all' || p.area === area)
      .filter((p) => type === 'all' || p.type === type)
      .filter((p) => !text || p.name.toLowerCase().includes(text) || p.summary.toLowerCase().includes(text))
      .sort(sorts[sort]?.fn ?? sorts.rating.fn)
  }, [q, area, type, sort])

  return (
    <>
      <PageHeader
        title="Find a provider"
        intro="Generator networks and solar installers across Lebanon, with plans, prices and subscriber ratings."
      />

      <section className="container-page py-10">
        {/* Filters */}
        <div className="grid gap-4 rounded-lg border border-line bg-white p-4 sm:p-5 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <label htmlFor="q" className="label">Search</label>
            <div className="relative">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
              <input
                id="q"
                type="search"
                value={q}
                onChange={(e) => update('q', e.target.value, '')}
                placeholder="Provider name or keyword"
                className="field pl-9"
              />
            </div>
          </div>
          <div>
            <label htmlFor="area" className="label">Area</label>
            <select id="area" value={area} onChange={(e) => update('area', e.target.value, 'all')} className="field">
              <option value="all">All areas</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="label">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => update('sort', e.target.value, 'rating')} className="field">
              {Object.entries(sorts).map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
            </select>
          </div>
          <fieldset className="lg:col-span-3">
            <legend className="sr-only">Provider type</legend>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => update('type', t.value, 'all')}
                  aria-pressed={type === t.value}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    type === t.value ? 'border-ink bg-ink text-white' : 'border-line bg-paper text-ink hover:border-ink'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <p className="mt-6 text-sm text-mute" aria-live="polite">
          {results.length} {results.length === 1 ? 'provider' : 'providers'} found
        </p>

        {results.length ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-line bg-white px-6 py-14 text-center">
            <h2 className="text-xl font-bold">No provider matches these filters</h2>
            <p className="mt-2 text-mute">Try another area, or clear the search to see every provider.</p>
            <button type="button" onClick={() => setParams({})} className="btn-ink mt-6">
              Clear filters
            </button>
          </div>
        )}
      </section>
    </>
  )
}