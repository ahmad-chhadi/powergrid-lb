import { useMemo } from 'react'
import { areas as baseAreas, SOURCES } from '../data/areas'
import { providers as baseProviders } from '../data/providers'
import { areasAr, providersAr } from './dataAr'
import { useLang } from './LanguageContext'

// Returns areas and providers in the current language.
// The English data stays in src/data; Arabic text comes from dataAr.js and replaces it when lang is 'ar'.
export function useData() {
  const { lang, t } = useLang()

  return useMemo(() => {
    const ar = lang === 'ar'

    const areas = baseAreas.map((a) => (ar ? { ...a, ...areasAr[a.id] } : a))

    const providers = baseProviders.map((p) => {
      const tr = providersAr[p.id] ?? {}
      // search works in both languages
      const search = [p.name, p.summary, tr.name, tr.summary].join(' ').toLowerCase()
      if (!ar) return { ...p, search }
      return {
        ...p,
        name: tr.name ?? p.name,
        summary: tr.summary ?? p.summary,
        features: tr.features ?? p.features,
        reviews: p.reviews.map((r, i) => ({ ...r, ...tr.reviews?.[i] })),
        packages: p.packages?.map((k, i) => ({ ...k, name: tr.packages?.[i] ?? k.name })),
        search,
      }
    })

    // power source with its translated name: source('G').name -> "Generator" / "المولّد"
    const source = (key) => ({ ...SOURCES[key], name: t(`sources.${key === '-' ? 'off' : key}`) })

    return {
      areas,
      providers,
      getArea: (id) => areas.find((a) => a.id === id),
      getProvider: (id) => providers.find((p) => p.id === id),
      source,
    }
  }, [lang, t])
}

// The subscription is saved as numbers (amps or package index), so its name can be shown in either language.
export function planLabel(subscription, provider, t) {
  if (subscription.type === 'solar') {
    return t('details.packageName', { name: provider.packages[subscription.packageIndex].name })
  }
  return t('details.planName', { amps: subscription.amps })
}
