import { LandingNavbar } from "@/components/landing/navbar"
import { LandingFooter } from "@/components/landing/footer"
import { HeroSection } from "@/components/landing/home/hero-section"
import { FeaturesSection } from "@/components/landing/home/features-section"
import { PromotionsSection } from "@/components/landing/home/promotions-section"
import { CTASection } from "@/components/landing/home/cta-section"

export default function HomePage() {
  return (
    <>
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <PromotionsSection />
      <CTASection />
      <LandingFooter />
    </>
  )
}
