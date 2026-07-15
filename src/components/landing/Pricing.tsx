import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, School } from 'lucide-react';
import { Button, Badge } from '../ui';
import { SectionReveal, RevealItem } from '../shared';
import { mockPricingTiers } from '../../data/mock';
import { cn } from '../../lib/utils';
import { SessionBookingModal } from './SessionBookingModal';

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Load core pricing tiers dynamically from localStorage if present
  const [plans] = useState(() => {
    const saved = localStorage.getItem('blackcypher_subscription_plans');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.coreTiers) {
          return parsed.coreTiers;
        }
      } catch (e) {}
    }
    return mockPricingTiers;
  });

  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <span className="text-caption font-medium text-accent-cyan uppercase tracking-widest">Pricing</span>
            <h2 className="font-heading text-3xl md:text-display-sm font-bold text-white mt-3 mb-4">
              Invest in your security career
            </h2>
            <p className="text-body-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Choose the plan that matches your ambition. All plans include access to our community.
            </p>

            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-surface-800 border border-white/[0.06]">
              <button
                onClick={() => setYearly(false)}
                className={cn(
                  'px-4 py-2 rounded-lg text-body-sm font-medium transition-all',
                  !yearly ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn(
                  'px-4 py-2 rounded-lg text-body-sm font-medium transition-all flex items-center gap-2',
                  yearly ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                )}
              >
                Yearly
                <Badge variant="emerald">Save 30%</Badge>
              </button>
            </div>
          </RevealItem>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((tier: any) => (
              <RevealItem key={tier.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'relative rounded-2xl p-6 h-full flex flex-col',
                    tier.highlighted
                      ? 'bg-surface-800/80 border-2 border-accent-cyan/30 shadow-glow-cyan'
                      : 'surface-card'
                  )}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="cyan">{tier.badge}</Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-heading text-heading-sm font-semibold text-white">{tier.name}</h3>
                    <div className="mt-3 flex items-baseline gap-0.5 flex-wrap">
                      <span className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-white mr-1 select-none">₹</span>
                      <span className="font-heading text-3xl sm:text-4xl lg:text-display font-bold text-white">
                        {yearly ? tier.yearlyPrice?.toLocaleString() : tier.monthlyPrice?.toLocaleString()}
                      </span>
                      {tier.monthlyPrice > 0 && (
                        <span className="text-body-sm text-slate-500">
                          /{yearly ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {yearly && tier.monthlyPrice > 0 && (
                      <p className="text-caption text-slate-500 mt-1">
                        <span className="font-sans mr-0.5">₹</span>{Math.round(tier.yearlyPrice / 12).toLocaleString()}/month billed annually
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature: string) => (
                      <li key={feature} className="flex items-start gap-3 text-body-sm text-slate-300">
                        <Check className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={tier.highlighted ? 'primary' : 'outline'}
                    size="lg"
                    glow={tier.highlighted ? 'cyan' : 'none'}
                    className="w-full"
                    onClick={() => {
                      if (tier.id === 'enterprise') {
                        setBookingOpen(true);
                      } else {
                        // Redirect or open sign in
                        window.location.href = '/dashboard';
                      }
                    }}
                  >
                    {tier.id === 'enterprise' ? 'Book Institutional Session' : tier.cta}
                  </Button>
                </motion.div>
              </RevealItem>
            ))}
          </div>

          {/* Educational Institutional Custom Bootcamp Banner */}
          <RevealItem className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl bg-surface-950 border border-white/[0.08] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center shrink-0">
                  <School className="w-6 h-6 text-accent-violet" />
                </div>
                <div>
                  <h3 className="font-heading text-body-lg font-bold text-white uppercase tracking-wider">
                    School & College Cyber Security Workshops
                  </h3>
                  <p className="text-body-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
                    Book certified 1-Week, 1-Month, 2-Month, or 3-Month practical training programs for your school or college students. Access live hacker demonstrations, defense sandboxes, dual-branded certificates, and generate printable receipts instantly.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                glow="violet"
                onClick={() => setBookingOpen(true)}
                className="px-6 py-3 bg-accent-violet text-white font-semibold shrink-0 uppercase tracking-wider text-caption"
              >
                Launch Booking Portal
              </Button>
            </div>
          </RevealItem>
        </SectionReveal>
      </div>

      <SessionBookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}

