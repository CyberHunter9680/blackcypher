import { ArrowRight } from 'lucide-react';
import { Button } from '../ui';
import { SectionReveal, RevealItem, FloatingOrb } from '../shared';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <FloatingOrb color="cyan" size={400} className="top-0 left-1/4" />
      <FloatingOrb color="violet" size={300} className="bottom-0 right-1/4" />

      <div className="max-w-4xl mx-auto px-6">
        <SectionReveal>
          <RevealItem className="text-center">
            <div className="surface-card p-12 md:p-16 rounded-3xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/[0.04] via-transparent to-accent-violet/[0.04]" />
              <div className="relative z-10">
                <h2 className="font-heading text-3xl md:text-display-sm font-bold text-white mb-4">
                  Ready to begin your mission?
                </h2>
                <p className="text-body-lg text-slate-400 max-w-xl mx-auto mb-8">
                  Join 50,000+ security professionals who trust NullTrace Academy to advance their careers.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/subscription">
                    <Button variant="primary" size="lg" glow="cyan">
                      Start Free Today
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg">
                      Explore Courses
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </RevealItem>
        </SectionReveal>
      </div>
    </section>
  );
}
