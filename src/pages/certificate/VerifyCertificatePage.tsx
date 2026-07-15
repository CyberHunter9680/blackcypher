import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Award, FileCheck, ExternalLink, Calendar, User, Search } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';

interface CertificateData {
  hash_id: string;
  student_name: string;
  course_title: string;
  issue_date: string;
  email: string;
}

export default function VerifyCertificatePage() {
  const { id } = useParams<{ id: string }>();
  const [searchId, setSearchId] = useState(id || '');
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const [error, setError] = useState('');

  const verifyCertificate = async (hashId: string) => {
    if (!hashId.trim()) return;
    setLoading(true);
    setError('');
    setCertData(null);
    try {
      const res = await fetch(`/api/verify?hash_id=${hashId}`);
      const data = await res.json();
      if (res.ok && data.valid) {
        setCertData(data.certificate);
      } else {
        setError(data.error || 'The entered Certificate Hash ID is not registered.');
      }
    } catch (err) {
      setError('System handshake timeout. Unable to verify credentials with Neon ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      verifyCertificate(id);
    }
  }, [id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      verifyCertificate(searchId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#04060e] text-slate-300 font-mono flex flex-col justify-between selection:bg-accent-cyan/20">
      
      {/* Reticle / Cyberpunk background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,254,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,254,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Tactical Header */}
      <header className="h-16 border-b border-white/[0.06] bg-surface-900/40 backdrop-blur-xl flex items-center justify-between px-6 z-10 select-none">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan/25 transition-all">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-white font-bold uppercase tracking-widest text-xs">
            Black Cypher Ledger
          </span>
        </Link>
        <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest">
          Student Portal
        </Link>
      </header>

      {/* Main Validation Console */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 max-w-2xl w-full mx-auto">
        <div className="w-full space-y-6">
          
          {/* Headline */}
          <div className="text-center select-none">
            <Award className="w-12 h-12 text-accent-cyan mx-auto mb-3 drop-shadow-[0_0_10px_rgba(0,242,254,0.3)] animate-pulse" />
            <h1 className="text-base font-bold text-white uppercase tracking-widest">
              Verifiable Public Credentials Registry
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
              Validating authentic course completions against cryptographical nodes
            </p>
          </div>

          {/* Search Box */}
          <Card variant="glass" className="p-5 border-white/[0.06]">
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Input Certificate Secure Hash ID:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. mock-hash-id-xyz"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="flex-1 bg-surface-950 border border-white/[0.08] focus:border-accent-cyan rounded-lg px-3 py-2 text-xs text-white outline-none transition-all placeholder:text-slate-700"
                />
                <Button
                  type="submit"
                  variant="primary"
                  glow="cyan"
                  className="bg-accent-cyan text-black px-4 rounded-lg flex items-center gap-1 font-bold text-xs uppercase font-mono shrink-0"
                >
                  <Search className="w-3.5 h-3.5" /> Validate
                </Button>
              </div>
            </form>
          </Card>

          {/* Verification Results Panel */}
          {loading && (
            <div className="glass p-12 text-center text-xs text-slate-500 animate-pulse border border-white/[0.06] rounded-2xl">
              ⚡ CONNECTING TO SECURE LEDGER NODES AND RUNNING INTEGRITY CHECKS...
            </div>
          )}

          {!loading && certData && (
            <Card variant="glass" className="border-accent-emerald/30 p-6 relative overflow-hidden shadow-glow-emerald/5">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-emerald to-emerald-400"></div>
              
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-accent-emerald">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-accent-emerald uppercase font-bold tracking-widest">
                      Ledger Status: Verified
                    </span>
                    <span className="block text-[8px] text-slate-500 mt-0.5">
                      HASH VALIDATED &bull; SYSTEM STABLE
                    </span>
                  </div>
                </div>
                <Badge variant="emerald" className="text-[8px] font-bold uppercase py-0.5">
                  Clearance Approved
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-black/40 border border-white/[0.04] rounded-xl">
                    <span className="text-[8px] text-slate-500 uppercase block mb-1 flex items-center gap-1">
                      <User className="w-2.5 h-2.5 text-accent-cyan" /> Recipient Name
                    </span>
                    <span className="text-white text-xs font-bold font-sans">{certData.student_name}</span>
                  </div>

                  <div className="p-3 bg-black/40 border border-white/[0.04] rounded-xl">
                    <span className="text-[8px] text-slate-500 uppercase block mb-1 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-accent-cyan" /> Issuance Date
                    </span>
                    <span className="text-white text-xs font-bold font-sans">
                      {new Date(certData.issue_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-black/40 border border-white/[0.04] rounded-xl">
                  <span className="text-[8px] text-slate-500 uppercase block mb-1">Target Training Path / Course Title:</span>
                  <span className="text-white text-xs font-bold font-sans">{certData.course_title}</span>
                </div>

                <div className="p-3 bg-[#02040a] border border-[#00ff66]/20 rounded-xl">
                  <span className="text-[8px] text-[#00ff66]/60 uppercase block mb-1">Cryptographical Node Signature Hash:</span>
                  <code className="text-[#00ff66] text-[10px] break-all">{certData.hash_id}</code>
                </div>
              </div>
            </Card>
          )}

          {!loading && error && (
            <Card variant="glass" className="border-red-500/20 p-6 relative overflow-hidden shadow-glow-red/5">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500"></div>
              <div className="flex gap-3">
                <ShieldAlert className="w-8 h-8 text-red-400 shrink-0" />
                <div>
                  <span className="font-bold text-white text-xs uppercase block tracking-wider">
                    VALIDATION PROTOCOL FAILED
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2">
                    {error} Check if the hash is typed correctly, or contact support for certification ledger auditing.
                  </p>
                </div>
              </div>
            </Card>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-white/[0.04] flex items-center justify-center text-[9px] text-slate-600 uppercase tracking-widest bg-black/20 select-none">
        Black Cypher Security &bull; Verifiable credentials verification engine v1.4
      </footer>
    </div>
  );
}
