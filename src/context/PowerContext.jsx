import { createContext, useContext, useEffect, useState } from 'react'

// Shared app state: the user's area and their current subscription.
// Saved in localStorage so it survives a page refresh.
const PowerContext = createContext(null)
const STORAGE_KEY = 'powergrid-lb'

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved) return saved
  } catch {
    /* storage unavailable: fall back to defaults */
  }
  return { areaId: 'nabatieh', subscription: null }
}

export function PowerProvider({ children }) {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const value = {
    areaId: state.areaId,
    subscription: state.subscription,
    setArea: (areaId) => setState((s) => ({ ...s, areaId })),
    subscribe: (subscription) =>
      setState((s) => ({ ...s, subscription: { ...subscription, startedAt: new Date().toISOString() } })),
    cancel: () => setState((s) => ({ ...s, subscription: null })),
  }

  return <PowerContext.Provider value={value}>{children}</PowerContext.Provider>
}

export function usePower() {
  const ctx = useContext(PowerContext)
  if (!ctx) throw new Error('usePower must be used inside PowerProvider')
  return ctx
}