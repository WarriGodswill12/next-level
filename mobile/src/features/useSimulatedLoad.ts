import { useCallback, useEffect, useState } from 'react'

/**
 * Loading flag with a simulated fetch, so skeleton states are exercised.
 * TODO(backend): replace with the real query's loading state.
 */
export function useSimulatedLoad(ms = 900) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])

  const refresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), ms)
  }, [ms])

  return { loading, refreshing, refresh }
}
