import FeatureSection from '@/components/features'
import HeroSection from '@/components/hero'
import StatisticsSection from '@/components/statistics'
import WorkingSection from '@/components/working'
import React from 'react'

const Home = () => {
  return (
    <div>
      <div className="grid-background" />
        <HeroSection />
        <FeatureSection />
        <StatisticsSection />
        <WorkingSection />
    </div>
  )
}

export default Home