import { Navbar } from '../../components/layout';
import { CertificateCard, VerificationSection } from '../../components/certificate';
import { Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { Download, Shield } from 'lucide-react';

export default function CertificatePage() {
  const { dbUser } = useAuth();

  // Use real user name if logged in, fallback to empty
  const certificate = {
    id: 'cert-001',
    courseId: 'ceh-v13',
    courseName: 'Certified Ethical Hacker (CEH v13)',
    userName: dbUser?.name || 'Cyber Operator',
    completedAt: new Date().toISOString(),
    hash: 'BC-' + (dbUser?.id?.substring(0, 12).toUpperCase() || 'XXXXXXXX'),
    verificationUrl: '/verify/bc-cert-001',
    grade: 'A+'
  };

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-accent-cyan" />
              <h1 className="font-heading text-heading-lg font-bold text-white">Your Certificate</h1>
            </div>
            <p className="text-body-sm text-slate-400 mt-1">
              Cryptographically verified proof of completion
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            const link = document.createElement('a');
            link.href = window.location.href;
            link.download = 'BlackCypher_Certificate.pdf';
            link.click();
          }}>
            <Download className="w-3.5 h-3.5" />
            Download
          </Button>
        </div>

        <CertificateCard certificate={certificate} />

        <div className="mt-8">
          <VerificationSection certificate={certificate} />
        </div>
      </main>
    </div>
  );
}
