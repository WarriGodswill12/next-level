import type { Href } from 'expo-router'
import type { Role } from '@/state/session'

/** First onboarding step for each side. */
export const onboardingStart = (role: Role | null): Href =>
  role === 'recruiter' ? '/onboarding/recruiter/organization' : '/onboarding/athlete/sport'
