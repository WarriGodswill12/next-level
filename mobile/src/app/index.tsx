import { Redirect } from 'expo-router'
import { useSession } from '@/state/session'

export default function Index() {
  const { signedIn, onboarded } = useSession()
  if (signedIn && onboarded) return <Redirect href="/home" />
  return <Redirect href="/welcome" />
}
