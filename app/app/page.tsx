'use client'
import { LandingHeader } from './components/LandingHeader'
import { LandingFooter } from './components/LandingFooter'
import { HeroSection } from './components/public/HeroSection'
import { FeaturesSection } from './components/public/FeaturesSection'
import { PropertyOverviewSection } from './components/public/PropertyOverviewSection'
import { PropertyTypesSection } from './components/public/PropertyTypesSection'
import { TechniciansSection } from './components/public/TechniciansSection'
import { HowItWorksSection } from './components/public/HowItWorksSection'
import { VideoSection } from './components/public/VideoSection'
import { PricingSection } from './components/public/PricingSection'
import { CtaSection } from './components/public/CtaSection'

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <VideoSection />
      <PricingSection />
      <PropertyOverviewSection />
      <PropertyTypesSection />
      {/* <TechniciansSection /> */}
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
