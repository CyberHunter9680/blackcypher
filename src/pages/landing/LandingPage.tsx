import { Navbar, Footer } from '../../components/layout';
import { Hero, Features, Pricing, Testimonials, CertificateShowcase, CTA, AboutTeam } from '../../components/landing';
import { RoadmapComponent } from '../../components/landing/RoadmapComponent';
import { AIChatbot } from '../../components/ai/AIChatbot';

export default function LandingPage() {
  return (
    <div className="bg-surface-900 min-h-screen relative overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <div id="roadmap-section" className="max-w-7xl mx-auto px-6 py-12">
        <RoadmapComponent />
      </div>
      <AboutTeam />
      <CertificateShowcase />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
      <AIChatbot />
    </div>
  );
}


