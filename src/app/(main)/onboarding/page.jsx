import React from 'react'
import OnboardingForm from './_components/onboarding-form'
import { industries } from '@/constants/industries'
import { getUserOnboardingStatus } from '../../../../actions/user'
import { redirect } from 'next/navigation'

const OnboardingPage = async () => {
  // check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights = await getIndustryInsights();

  if (isOnboarded) {
    redirect("/dashboard")
  }
  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  )
}

export default OnboardingPage