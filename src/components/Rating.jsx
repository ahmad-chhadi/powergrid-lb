import Icon from './Icon'
import { useLang } from '../i18n/LanguageContext'

export default function Rating({ value, size = 'h-4 w-4' }) {
  const { t } = useLang()
  return (
    <span className="inline-flex items-center gap-1" aria-label={t('rating', { value })}>
      <Icon name="star" filled className={`${size} text-sun`} />
      <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>
    </span>
  )
}
