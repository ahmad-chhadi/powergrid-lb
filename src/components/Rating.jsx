import Icon from './Icon'

export default function Rating({ value, size = 'h-4 w-4' }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      <Icon name="star" filled className={`${size} text-sun`} />
      <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>
    </span>
  )
}