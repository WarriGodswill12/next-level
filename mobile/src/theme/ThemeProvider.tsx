import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import { darkColors, lightColors, shadows } from '@/design/tokens'
import type { ThemeColors } from '@/design/tokens'

export type ThemePreference = 'system' | 'light' | 'dark'
export type Scheme = 'light' | 'dark'

type ThemeContextValue = {
  scheme: Scheme
  preference: ThemePreference
  colors: ThemeColors
  setPreference: (p: ThemePreference) => void
  /** Flips between light and dark (leaving "system"). */
  toggle: () => void
}

const STORAGE_KEY = 'nl.theme-preference'
const ThemeContext = createContext<ThemeContextValue | null>(null)

/** User-facing theme toggle, persisted on device; "system" follows the OS. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme() === 'dark' ? 'dark' : 'light'
  const [preference, setPref] = useState<ThemePreference>('system')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => {
        if (v === 'light' || v === 'dark' || v === 'system') setPref(v)
      })
      .catch(() => {})
  }, [])

  const setPreference = useCallback((p: ThemePreference) => {
    setPref(p)
    AsyncStorage.setItem(STORAGE_KEY, p).catch(() => {})
  }, [])

  const scheme: Scheme = preference === 'system' ? system : preference

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      preference,
      colors: scheme === 'dark' ? darkColors : lightColors,
      setPreference,
      toggle: () => setPreference(scheme === 'dark' ? 'light' : 'dark'),
    }),
    [scheme, preference, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

/** The semantic colour set for the active theme — build StyleSheets from this. */
export function useThemeColors() {
  return useTheme().colors
}

/** Card shadow in light mode; none in dark, where surfaces already separate by tone. */
export function useElevation() {
  return useTheme().scheme === 'light' ? shadows.card : null
}
