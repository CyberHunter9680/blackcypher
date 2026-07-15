import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button, Badge } from '../ui';
import { mockPricingTiers } from '../../data/mock';
import { cn } from '../../lib/utils';

export function PricingCards() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={cn('text-body-sm font-medium', !yearly ? 'text-white' : 'text-slate-500')}>Monthly</span>
        <button
          onClick={() => setYearly(!yearly)}
          className={cn(
            'relative w-12 h-6 rounded-full transition-colors',
            yearly ? 'bg-accent-cyan' : 'bg-surface-600'
          )}
        >
          <motion.div
            animate={{ x: yearly ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white"
          />
        </button>
        <span className={cn('text-body-sm font-medium', yearly ? 'text-white' : 'text-slate-500')}>
          Yearly
        </span>
        {yearly && <Badge variant="emerald">Save 30%</Badge>}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {mockPricingTiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className={cn(
              'relative rounded-2xl p-6 flex flex-col h-full',
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
                  <span className="font-sans mr-0.5">₹</span>{Math.round(tier.yearlyPrice / 12).toLocaleString()}/mo billed annually
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature) => (
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
            >
              {tier.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
