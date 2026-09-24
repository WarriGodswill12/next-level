import { useTheme } from '@/theme/ThemeProvider'
import { IconChip } from './IconChip'

/** Sun/moon chip that flips the app theme. */
export function ThemeToggle({ tone = 'theme' }: { tone?: 'theme' | 'brand' }) {
  const { scheme, toggle } = useTheme()
  return (
    <IconChip
      tone={tone}
      icon={scheme === 'dark' ? 'sunny-outline' : 'moon-outline'}
      label={scheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onPress={toggle}
    />
  )
}
