import { AthleteDashboard } from '@/features/AthleteDashboard'
import { RecruiterDashboard } from '@/features/RecruiterDashboard'
import { useSession } from '@/state/session'

export default function Home() {
  const { role } = useSession()
  return role === 'recruiter' ? <RecruiterDashboard /> : <AthleteDashboard />
}
