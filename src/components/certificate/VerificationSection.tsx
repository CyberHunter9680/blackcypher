import { QrCode, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Card, Button } from '../ui';
import type { Certificate } from '../../types';

interface VerificationSectionProps {
  certificate: Certificate;
}

export function VerificationSection({ certificate }: VerificationSectionProps) {
  const [copied, setCopied] = useState(false);

  const dynamicVerifyUrl = `${window.location.origin}/verify/${certificate.hash}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dynamicVerifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card variant="glass" className="p-6">
      <h3 className="text-body-sm font-semibold text-white mb-4">Verification</h3>

      <div className="space-y-4">
        {/* QR Code placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-surface-700 border border-white/[0.06] flex items-center justify-center shrink-0">
            <QrCode className="w-10 h-10 text-slate-500" />
          </div>
          <div>
            <p className="text-body-sm text-slate-300 mb-1">Scan to verify</p>
            <p className="text-caption text-slate-500">
              This QR code links to the certificate verification page with tamper-proof validation.
            </p>
          </div>
        </div>

        {/* Verification URL */}
        <div className="p-3 rounded-xl bg-surface-800 border border-white/[0.06]">
          <div className="flex items-center justify-between gap-3">
            <code className="text-caption text-slate-400 truncate flex-1">
              {dynamicVerifyUrl}
            </code>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Hash ID */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800 border border-white/[0.06]">
          <div>
            <div className="text-caption text-slate-500">Secure Hash ID</div>
            <code className="text-caption text-slate-300 font-mono">{certificate.hash}</code>
          </div>
          <a href={dynamicVerifyUrl} className="text-accent-cyan hover:text-cyan-300 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </Card>
  );
}

