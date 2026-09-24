import { AthleteDiscover } from '@/features/AthleteDiscover'
import { RecruiterDiscover } from '@/features/RecruiterDiscover'
import { useSession } from '@/state/session'

/** Recruiters scout athletes; athletes browse programs, camps and coaches. */
export default function Discover() {
  const { role } = useSession()
  return role === 'recruiter' ? <RecruiterDiscover /> : <AthleteDiscover />
}
