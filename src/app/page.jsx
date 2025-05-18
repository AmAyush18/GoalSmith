import FaqSection from '@/components/faq'
import FeatureSection from '@/components/features'
import HeroSection from '@/components/hero'
import StatisticsSection from '@/components/statistics'
import TestimonialSection from '@/components/testimonials'
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
        <TestimonialSection />
        <FaqSection />
    </div>
  )
}

export default Home