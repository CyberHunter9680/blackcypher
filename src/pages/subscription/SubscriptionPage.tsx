import { useState, useEffect, useCallback } from 'react';
import { Navbar, Footer } from '../../components/layout';
import { CheckoutModal } from '../../components/subscription';
import { SectionReveal, RevealItem } from '../../components/shared';
import { motion } from 'framer-motion';
import { Shield, Users, Check, Video, FileText, CheckCircle2, Award, Zap, Terminal, Lock, ShoppingBag } from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

// Local high-fidelity data representations for plans

const doubtExtensions = [
  {
    id: 'm-1',
    name: '1-Month Crisis Clearance',
    price: 1999,
    duration: '1 month',
    desc: 'Perfect for urgent debugging. 4 weekends (8 sessions) of dedicated 1-on-1 expert troubleshooting.',
    popular: false,
    badge: 'Crisis Support'
  },
  {
    id: 'm-2',
    name: '2-Month Operations Extension',
    price: 3499,
    duration: '2 months',
    desc: 'Our recommended baseline. 8 weekends (16 sessions) of comprehensive exploit analysis and sandbox debugging support.',
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'm-3',
    name: '3-Month Strategic Retainer',
    price: 4999,
    duration: '3 months',
    desc: 'Unrestricted cyber backup. 12 weekends (24 sessions) of continuous advanced roadmap mentorship and live guidance.',
    popular: false,
    badge: 'Maximum Value'
  }
];

const campusBookings = [
  {
    id: 's-1',
    name: '1-Week Intensive Bootcamp',
    price: 14999,
    details: '5 Action Days (2 hours/day) focusing on essential threat intelligence, networking defense hygiene, and OSINT methodology.',
    level: 'Tactical Entry',
    features: ['1-Week Cyber Training Roadmap', 'Introduction to Penetration Testing', 'Student Participation Certificates']
  },
  {
    id: 's-2',
    name: '1-Month Campus Alliance',
    price: 49999,
    details: '4-Week structured threat hunt. Deep dives into web-app security, database pentesting, and live simulated CTF exams.',
    level: 'Intermediate Vanguard',
    features: ['1-Week Cyber Training Roadmap', 'Interactive Pentest Labs Setups', 'Certified Exam Vouchers for Top 10%']
  },
  {
    id: 's-3',
    name: '2-Month Cyber Vanguard Campaign',
    price: 89999,
    details: '8-Week elite team preparation. Practical red-teaming simulations, advanced hardware exploits, sandbox drills, and network hygiene logs.',
    level: 'Advanced Red-Teamer',
    features: ['1-Week Cyber Training Roadmap', 'Personalized Institutional Sandbox', 'Individual Student Performance Reports']
  },
  {
    id: 's-4',
    name: '3-Month Sovereign Program',
    price: 129999,
    details: '12-Week ultimate security overhaul. Zero-trust architecture orchestration, custom API security modeling, and intensive team exercises.',
    level: 'Institutional Mastery',
    features: ['1-Week Cyber Training Roadmap', 'Dedicated Mentor for 90 Days', 'Official Alliance Plaque & Certifications']
  }
];

export default function SubscriptionPage() {
  const { dbUser } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [yearly, setYearly] = useState(false);

  // Load custom pricing from localStorage if available, else use defaults
  const [plans] = useState(() => {
    const saved = localStorage.getItem('blackcypher_subscription_plans');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.coreTiers && parsed.doubtExtensions && parsed.campusBookings) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      coreTiers: [
        {
          id: 'free',
          name: 'Free Recruit',
          monthlyPrice: 0,
          yearlyPrice: 0,
          badge: 'Level 1 Clearance',
          description: 'Perfect for beginners starting their journey into defensive cybersecurity and foundational computing.',
          features: [
            'Access to Public Learning Roadmaps',
            'Basic Cyber Manuals & Cheatsheets',
            '3 Starter Practical CTF Modules',
            'Community Security Forum Access',
            'Standard System Profile Badge'
          ],
          cta: 'Initiate Recruit Protocol',
          highlighted: false,
          color: 'cyan'
        },
        {
          id: 'pro',
          name: 'Pro Operator',
          monthlyPrice: 2999,
          yearlyPrice: 18999,
          badge: 'Elite Operator',
          description: 'Our flagship training track. Unlock premium materials, advanced sandboxes, and personalized doubt sessions.',
          features: [
            'Complete Cyber Course Library (CEH v10, CEH v13)',
            'Premium PDF Handbooks & Lab Guide Downloads',
            'Includes 1 Month of Live Weekend Doubt Support',
            'Access to Advanced Sandbox Practice Arenas',
            'Exclusive Elite Profile Badge & 500 XP Welcome',
            'Prioritized Security Intel Advisories Feed',
            'Direct Discord Operator Channel Integration'
          ],
          cta: 'Acquire Pro Clearance',
          highlighted: true,
          color: 'cyan'
        }
      ],
      doubtExtensions,
      campusBookings
    };
  });

  const [selectedPlan, setSelectedPlan] = useState(() => {
    const saved = localStorage.getItem('blackcypher_subscription_plans');
    let proPrice = 2999;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.coreTiers?.[1]?.monthlyPrice !== undefined) {
          proPrice = parsed.coreTiers[1].monthlyPrice;
        }
      } catch (e) {}
    }
    return { name: 'Pro Operator', price: proPrice, interval: 'month' };
  });
  
  // Invoices — fetched dynamically from the database
  interface DBInvoice {
    id: number;
    booking_type: string;
    plan_duration: string;
    amount_paid: number;
    created_at: string;
    status: string;
    receipt_url: string | null;
    contact_name: string;
  }
  const [invoices, setInvoices] = useState<DBInvoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  const fetchInvoices = useCallback(async () => {
    if (!dbUser) return;
    setInvoicesLoading(true);
    try {
      const res = await fetch(`/api/bookings?uid=${dbUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to fetch invoices:', err);
    } finally {
      setInvoicesLoading(false);
    }
  }, [dbUser]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleSelectPlan = (name: string, price: number, interval: string) => {
    setSelectedPlan({ name, price, interval });
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (_receiptUrl?: string) => {
    // Refresh invoice list from DB after a successful checkout
    fetchInvoices();
  };

  return (
    <div className="min-h-screen bg-[#030612] text-white selection:bg-accent-cyan/30 relative">
      <Navbar />
      
      {/* Cyberpunk background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-accent-violet/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-accent-emerald/5 rounded-full blur-3xl pointer-events-none" />

      <main className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto z-10">
        
        {/* Banner Section */}
        <SectionReveal>
          <RevealItem className="text-center mb-20">
            <span className="text-caption font-mono font-medium text-accent-cyan uppercase tracking-widest bg-accent-cyan/10 border border-accent-cyan/25 px-3 py-1 rounded-full">
              BLACK CYPHER SECURE PRICING
            </span>
            <h1 className="font-heading text-4xl md:text-display-md font-bold mt-4 mb-4 tracking-tight">
              Pricing Deck & Services Hub
            </h1>
            <p className="text-body-lg text-slate-400 max-w-2xl mx-auto">
              Configure your cyber clearance level, upgrade live Sat/Sun weekend doubt troubleshooting meet plans, or deploy campus security bootcamps.
            </p>
          </RevealItem>
        </SectionReveal>

        {/* ================= SECTION 1: CORE SUBSCRIPTION PLANS ================= */}
        <SectionReveal>
          <div className="mb-24">
            <RevealItem className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold text-white flex items-center justify-center gap-2.5">
                <Shield className="w-6 h-6 text-accent-cyan" />
                1. Core Learning Clearances
              </h2>
              <p className="text-slate-400 text-sm mt-1.5 max-w-xl mx-auto">
                Acquire student licenses to unlock the interactive cybersecurity course handbooks and specialized sandboxes.
              </p>
            </RevealItem>

            {/* Year Toggle */}
            <RevealItem className="flex items-center justify-center gap-3 mb-12">
              <span className={cn('text-body-sm font-mono font-semibold', !yearly ? 'text-accent-cyan' : 'text-slate-500')}>Monthly Access</span>
              <button
                onClick={() => setYearly(!yearly)}
                className={cn(
                  'relative w-12 h-6 rounded-full transition-colors border border-white/[0.1]',
                  yearly ? 'bg-accent-cyan' : 'bg-surface-800'
                )}
              >
                <motion.div
                  animate={{ x: yearly ? 26 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={cn("absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white", yearly ? "bg-surface-950" : "bg-white")}
                />
              </button>
              <span className={cn('text-body-sm font-mono font-semibold', yearly ? 'text-accent-cyan' : 'text-slate-500')}>
                Yearly Deployment
              </span>
              {yearly && <Badge variant="emerald" className="animate-pulse">30% Threat Intel Discount</Badge>}
            </RevealItem>

            {/* Core Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.coreTiers.map((tier: any) => (
                <RevealItem key={tier.id} className="h-full">
                  <div
                    className={cn(
                      'relative rounded-2xl p-8 flex flex-col h-full bg-[#070b19]/65 border backdrop-blur-md transition-all duration-500',
                      tier.highlighted
                        ? 'border-accent-cyan/40 shadow-[0_0_35px_rgba(6,182,212,0.12)]'
                        : 'border-white/[0.06] hover:border-white/[0.15]'
                    )}
                  >
                    {tier.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-accent-cyan text-surface-950 px-3.5 py-1 rounded-full shadow-glow-cyan">
                          {tier.badge}
                        </span>
                      </div>
                    )}

                    <div className="mb-6 relative">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Security Clearance Level</span>
                      <h3 className="font-heading text-2xl font-bold text-white mt-1">{tier.name}</h3>
                      <p className="text-body-xs text-slate-400 mt-2 leading-relaxed min-h-[72px]">{tier.description}</p>
                      
                      <div className="mt-4 flex items-baseline gap-0.5 flex-wrap">
                        <span className="font-sans text-2xl sm:text-3xl lg:text-4xl font-medium text-white mr-1 select-none">₹</span>
                        <span className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                          {yearly ? tier.yearlyPrice?.toLocaleString() : tier.monthlyPrice?.toLocaleString()}
                        </span>
                        {tier.monthlyPrice > 0 && (
                          <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
                            /{yearly ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      {yearly && tier.monthlyPrice > 0 && (
                        <p className="text-caption text-accent-cyan mt-1.5 font-mono">
                          <span className="font-sans mr-0.5">₹</span>{Math.round(tier.yearlyPrice / 12).toLocaleString()}/mo billed annually
                        </p>
                      )}
                    </div>

                    <ul className="space-y-4 mb-10 flex-1 border-t border-white/[0.06] pt-6">
                      {tier.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-3 text-body-sm text-slate-300">
                          {feature.includes('Live Weekend') ? (
                            <Zap className="w-4.5 h-4.5 text-accent-violet shrink-0 mt-0.5 animate-pulse" />
                          ) : (
                            <Check className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
                          )}
                          <span className={cn("font-mono text-xs leading-relaxed", feature.includes('Live Weekend') && "text-accent-violet font-bold")}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={tier.highlighted ? 'primary' : 'outline'}
                      size="lg"
                      glow={tier.highlighted ? 'cyan' : 'none'}
                      className="w-full uppercase font-bold tracking-widest text-xs"
                      onClick={() => handleSelectPlan(
                        tier.name, 
                        yearly ? tier.yearlyPrice : tier.monthlyPrice, 
                        yearly ? 'year' : 'month'
                      )}
                    >
                      {tier.cta}
                    </Button>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* ================= SECTION 2: CAMPUS BOOKING INTEGRATIONS ================= */}
        <SectionReveal>
          <div className="mb-24 relative">
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-accent-emerald/10 rounded-full blur-3xl pointer-events-none" />
            
            <RevealItem className="text-center mb-10">
              <Badge variant="emerald" className="font-mono mb-2">Institutional Packages</Badge>
              <h2 className="font-heading text-2xl font-bold text-white flex items-center justify-center gap-2.5">
                <Users className="w-6 h-6 text-accent-emerald" />
                2. School & College Campus Bookings
              </h2>
              <p className="text-slate-400 text-sm mt-1.5 max-w-xl mx-auto">
                Deploy customized live security workshops on campus. All plans below include a structured 1-week cyber training roadmap.
              </p>
            </RevealItem>

            {/* Campaign Inclusions Banner */}
            <RevealItem className="max-w-5xl mx-auto mb-12">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl border border-white/[0.04] bg-[#030a08]/30 backdrop-blur-md">
                  <Award className="w-5 h-5 text-accent-emerald mb-3" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Custom Syllabi</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5 font-sans">
                    We coordinate with your department guides to structure the exact vulnerability, API security, or reverse engineering topics you need.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/[0.04] bg-[#030a08]/30 backdrop-blur-md">
                  <Zap className="w-5 h-5 text-accent-emerald mb-3" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1-Week Free Roadmap</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5 font-sans">
                    All packages automatically feature our proprietary 1-week beginner cybersecurity starter roadmap integrated for all attendees.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/[0.04] bg-[#030a08]/30 backdrop-blur-md">
                  <Shield className="w-5 h-5 text-accent-emerald mb-3" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Vulnerability Labs</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5 font-sans">
                    Interactive cloud pentesting sandbox allocations are provided to students during the campaign duration to capture live flags.
                  </p>
                </div>
              </div>
            </RevealItem>

            {/* Grid of Seminar packages */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {plans.campusBookings.map((s: any) => (
                <RevealItem key={s.id}>
                  <div 
                    className="p-5 rounded-2xl border border-white/[0.06] hover:border-accent-emerald/30 transition-all duration-300 flex flex-col justify-between h-full bg-[#03080c]/60 shadow-[0_0_20px_rgba(16,185,129,0.02)]"
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-accent-emerald font-bold tracking-widest uppercase bg-accent-emerald/10 px-2 py-0.5 rounded border border-accent-emerald/20">
                          {s.level}
                        </span>
                      </div>
                      <h4 className="font-heading text-sm font-bold text-white mt-3 leading-snug">{s.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed min-h-[60px]">{s.details}</p>
                      
                      <ul className="space-y-2.5 my-5 border-t border-white/[0.06] pt-4 text-[10px] font-mono text-slate-400">
                        {s.features.map((f: string) => (
                          <li key={f} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">Alliance Cost</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-sans text-sm font-medium text-white select-none">₹</span>
                          <span className="text-xl font-bold text-white font-mono">{s.price?.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="font-mono text-[9px] py-2 border-accent-emerald/25 text-accent-emerald hover:bg-accent-emerald hover:text-surface-950 transition-colors uppercase tracking-wider font-bold"
                        onClick={() => handleSelectPlan(s.name, s.price, 'one-time')}
                      >
                        Book Campaign
                      </Button>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* ================= SECTION 4: COMMAND BILLING & MANIFESTS ================= */}
        {dbUser ? (
          <div className="mt-24 border-t border-white/[0.06] pt-16">
            <SectionReveal>
              <RevealItem className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white tracking-wide">Command Billing &amp; Manifests</h2>
                  <p className="text-body-sm text-slate-400 mt-1">Review active transaction keys and generate deployment receipts</p>
                </div>
                <Badge variant="cyan" className="font-mono">Security Clearances Secure</Badge>
              </RevealItem>

              {invoicesLoading ? (
                <RevealItem>
                  <div className="rounded-2xl border border-white/[0.06] bg-surface-900/30 p-12 flex flex-col items-center text-center gap-4">
                    <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm font-mono">Loading transaction manifests...</p>
                  </div>
                </RevealItem>
              ) : invoices.length === 0 ? (
                <RevealItem>
                  <div className="rounded-2xl border border-white/[0.06] bg-surface-900/30 p-12 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-500">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white">No Purchases Found</h3>
                    <p className="text-slate-500 text-sm font-mono max-w-sm">
                      You haven't made any purchases yet. Once you subscribe or book a session, your transaction manifests will appear here.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setCheckoutOpen(true)}>
                      View Plans
                    </Button>
                  </div>
                </RevealItem>
              ) : (
              <RevealItem>
                <div className="surface-card rounded-2xl border border-white/[0.06] overflow-hidden bg-surface-900/30">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#070a16] border-b border-white/[0.06]">
                          <th className="p-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Booking ID</th>
                          <th className="p-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Service Class</th>
                          <th className="p-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Plan Duration</th>
                          <th className="p-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Amount Paid</th>
                          <th className="p-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Authorization Date</th>
                          <th className="p-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Secure Clearance</th>
                          <th className="p-4 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 text-xs font-mono font-bold text-accent-cyan">BLKCYPH-{inv.id}</td>
                            <td className="p-4 text-xs font-mono text-white">
                              {inv.booking_type === 'session_school' ? 'Institutional Booking' : 'Training / Subscription'}
                            </td>
                            <td className="p-4 text-xs font-mono text-slate-300">{inv.plan_duration || '—'}</td>
                            <td className="p-4 text-xs font-mono font-bold text-white">₹{parseFloat(String(inv.amount_paid)).toLocaleString()}</td>
                            <td className="p-4 text-xs font-mono text-slate-400">
                              {new Date(inv.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                                <CheckCircle2 className="w-3 h-3" />
                                {inv.status || 'pending'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {inv.receipt_url ? (
                                <a
                                  href={inv.receipt_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-slate-300 hover:bg-accent-cyan hover:text-surface-950 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  Manifest
                                </a>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-600">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </RevealItem>
              )}
            </SectionReveal>
          </div>
        ) : null}
      </main>

      <Footer />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        interval={selectedPlan.interval}
        onSuccess={(receiptUrl) => handleCheckoutSuccess(receiptUrl)}
      />
    </div>
  );
}
