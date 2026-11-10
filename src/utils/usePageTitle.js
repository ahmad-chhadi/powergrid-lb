import { useEffect } from 'react'

// Sets the browser tab title for the current page, e.g. "Providers | PowerGrid LB".
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | PowerGrid LB` : 'PowerGrid LB'
  }, [title])
}
