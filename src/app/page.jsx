import FeatureSection from '@/components/features'
import HeroSection from '@/components/hero'
import React from 'react'

const Home = () => {
  return (
    <div>
      <div className="grid-background" />
        <HeroSection />
        <FeatureSection />
    </div>
  )
}

export default Home