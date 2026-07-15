import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { BookOpen, Zap, Shield, Terminal, ChevronRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const docSections = [
  {
    icon: Zap,
    title: 'Getting Started',
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
    borderColor: 'border-accent-cyan/20',
    items: [
      'Creating your Black Cypher account',
      'Navigating the Dashboard',
      'Understanding Free vs Pro access',
      'Setting up your profile',
    ]
  },
  {
    icon: BookOpen,
    title: 'Courses & Roadmap',
    color: 'text-accent-violet',
    bgColor: 'bg-accent-violet/10',
    borderColor: 'border-accent-violet/20',
    items: [
      'CEH v9 / v10 / v13 curriculum overview',
      'Learning path progression guide',
      'Accessing course materials & books',
      'Submitting assignments & CTF tasks',
    ]
  },
  {
    icon: Terminal,
    title: 'Live Doubt Sessions',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
    items: [
      'How Saturday & Sunday sessions work',
      'Getting the Google Meet link',
      'What to prepare for doubt sessions',
      'Extending your doubt session plan',
    ]
  },
  {
    icon: Award,
    title: 'Certificates',
    color: 'text-accent-emerald',
    bgColor: 'bg-accent-emerald/10',
    borderColor: 'border-accent-emerald/20',
    items: [
      'Certificate eligibility criteria',
      'Cryptographic verification system',
      'Downloading & sharing certificates',
      'Certificate verification by employers',
    ]
  },
  {
    icon: Shield,
    title: 'Billing & Subscriptions',
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
    borderColor: 'border-accent-cyan/20',
    items: [
      'Understanding Pro Operator plan',
      'Monthly vs Yearly pricing',
      'Renewal & extension options',
      'Campus booking process for institutions',
    ]
  },
];

const faqs = [
  {
    q: 'Is the Free tier really free?',
    a: 'Yes! Free Recruit gives you access to the first 2 roadmap modules, basic cheatsheets, and community forum — no credit card required.'
  },
  {
    q: 'When do doubt sessions happen?',
    a: 'Live doubt sessions happen every Saturday and Sunday via Google Meet. Session links appear on your dashboard when active. Each session is 2+ hours with direct trainer access.'
  },
  {
    q: 'Can my college book a workshop?',
    a: 'Absolutely! We offer institutional campus bookings ranging from 1-week bootcamps to 3-month programs. Visit the Pricing page and scroll to Campus Bookings.'
  },
  {
    q: 'Are certificates industry-recognized?',
    a: 'Our completion certificates are cryptographically verified and tied to your Black Cypher training record. Campus program certificates include exam verification.'
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />

      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-7 h-7 text-accent-cyan" />
            </div>
            <span className="text-[10px] font-mono text-accent-cyan font-bold tracking-widest uppercase">Platform Docs</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">
              Documentation
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Everything you need to know about using the Black Cypher platform effectively.
            </p>
          </RevealItem>

          {/* Doc sections grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {docSections.map((section) => (
              <RevealItem key={section.title}>
                <div className={`p-6 rounded-2xl bg-surface-900/40 border ${section.borderColor} backdrop-blur-md hover:border-opacity-60 transition-all`}>
                  <div className={`w-10 h-10 rounded-xl ${section.bgColor} border ${section.borderColor} flex items-center justify-center mb-4`}>
                    <section.icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <h3 className="font-heading text-base font-bold text-white mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 cursor-pointer transition-colors">
                        <ChevronRight className={`w-3.5 h-3.5 ${section.color} shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </div>

          {/* FAQ */}
          <RevealItem>
            <h2 className="font-heading text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-surface-900/40 border border-white/[0.06] backdrop-blur-md">
                  <h3 className="font-heading font-bold text-white mb-2 flex items-center gap-2">
                    <span className="text-accent-cyan font-mono text-sm">Q{i + 1}.</span>
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed ml-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </RevealItem>

          {/* CTA */}
          <RevealItem className="mt-12 text-center">
            <p className="text-slate-400 mb-4">Still have questions?</p>
            <Link to="/contact">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-cyan text-black font-bold text-sm hover:bg-cyan-300 transition-colors">
                Contact Support <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </RevealItem>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
