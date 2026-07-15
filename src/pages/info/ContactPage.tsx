import { useState } from 'react';
import { Navbar, Footer } from '../../components/layout';
import { SectionReveal, RevealItem } from '../../components/shared';
import { Mail, Phone, MapPin, Send, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Contact error:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'admin@blackcypher.org', href: 'mailto:admin@blackcypher.org' },
    { icon: Phone, label: 'WhatsApp', value: '+91 XXXXX XXXXX', href: '#' },
    { icon: MapPin, label: 'Location', value: 'India (Remote-First)', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-violet/30 to-transparent" />

      <Navbar />

      <main className="relative pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <SectionReveal>
          <RevealItem className="text-center mb-16">
            <div className="w-14 h-14 rounded-2xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-accent-violet" />
            </div>
            <span className="text-[10px] font-mono text-accent-violet font-bold tracking-widest uppercase">Get in Touch</span>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4 tracking-tight">Contact <span className="text-accent-violet">Us</span></h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Have a question, partnership inquiry, or need support? We're here to help.</p>
          </RevealItem>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact info */}
            <RevealItem>
              <div className="space-y-5">
                <h2 className="font-heading text-xl font-bold text-white mb-6">Direct Channels</h2>
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-center gap-4 p-5 rounded-2xl bg-surface-900/40 border border-white/[0.06] hover:border-accent-violet/30 transition-all group backdrop-blur-md">
                    <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center group-hover:bg-accent-violet/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent-violet" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">{label}</div>
                      <div className="text-sm font-semibold text-white mt-0.5">{value}</div>
                    </div>
                  </a>
                ))}

                <div className="mt-6 p-5 rounded-2xl bg-accent-cyan/5 border border-accent-cyan/15 backdrop-blur-md">
                  <Shield className="w-5 h-5 text-accent-cyan mb-2" />
                  <h3 className="text-sm font-bold text-white mb-1">Response Time</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">We typically respond within <span className="text-accent-cyan">24-48 hours</span> on weekdays. For urgent issues, use WhatsApp.</p>
                </div>
              </div>
            </RevealItem>

            {/* Contact form */}
            <RevealItem>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-4 p-8 rounded-2xl bg-accent-emerald/5 border border-accent-emerald/20"
                >
                  <CheckCircle2 className="w-12 h-12 text-accent-emerald" />
                  <h3 className="font-heading text-xl font-bold text-white">Message Sent!</h3>
                  <p className="text-slate-400 text-sm">We'll get back to you within 24-48 hours. Thank you for reaching out!</p>
                  <Button variant="outline" size="sm" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="font-heading text-xl font-bold text-white mb-6">Send a Message</h2>
                  {[
                    { field: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                    { field: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                    { field: 'subject', label: 'Subject', type: 'text', placeholder: 'Course inquiry / Partnership / Support' },
                  ].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[field as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-accent-violet/40 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-sans"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Message</label>
                    <textarea
                      placeholder="Tell us how we can help..."
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-accent-violet/40 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-600 font-sans resize-none"
                    />
                  </div>
                  <Button variant="primary" glow="violet" type="submit" loading={loading} className="w-full gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              )}
            </RevealItem>
          </div>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
