import { Link } from 'react-router-dom'
import { getArea } from '../data/areas'
import { startingPrice } from '../data/providers'
import { money } from '../utils/schedule'
import Icon from './Icon'
import Rating from './Rating'

export default function ProviderCard({ provider }) {
  const area = getArea(provider.area)
  const isGen = provider.type === 'generator'

  return (
    <Link
      to={`/providers/${provider.id}`}
      className="group flex flex-col rounded-lg border border-line bg-white p-5 transition-colors hover:border-ink"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isGen ? 'bg-gen/15 text-[#8a5a12]' : 'bg-solar/12 text-[#0b6e67]'
          }`}
        >
          <Icon name={isGen ? 'plug' : 'sun'} className="h-3.5 w-3.5" />
          {isGen ? 'Generator' : 'Solar installer'}
        </span>
        <Rating value={provider.rating} />
      </div>

      <h3 className="mt-4 text-lg font-bold group-hover:underline">{provider.name}</h3>
      <p className="mt-1 flex items-center gap-1 text-sm text-mute">
        <Icon name="pin" className="h-4 w-4" />
        {area?.name}
      </p>
      <p className="mb-5 mt-3 line-clamp-2 text-sm leading-relaxed text-mute">{provider.summary}</p>

      <div className="mt-auto flex items-end justify-between border-t border-line pt-4">
        <div>
          <p className="text-xs text-mute">{isGen ? 'From, per month' : 'Packages from'}</p>
          <p className="text-xl font-bold">{money(startingPrice(provider))}</p>
        </div>
        <p className="text-right text-xs text-mute">
          {isGen ? `${provider.hoursPerDay} h/day supply` : `${provider.packages.length} packages`}
        </p>
      </div>
    </Link>
  )
}