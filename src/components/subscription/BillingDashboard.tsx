import { CreditCard, Calendar, Receipt, ArrowUpRight } from 'lucide-react';
import { Card, Badge } from '../ui';
import { mockUser } from '../../data/mock';

const invoices = [
  { id: 'INV-003', date: 'May 15, 2026', amount: '₹2,999.00', status: 'paid' },
  { id: 'INV-002', date: 'Apr 15, 2026', amount: '₹2,999.00', status: 'paid' },
  { id: 'INV-001', date: 'Mar 15, 2026', amount: '₹2,999.00', status: 'paid' },
];

export function BillingDashboard() {
  const planName = mockUser.subscription === 'pro' ? 'Operator' : 'Commander';

  return (
    <div className="space-y-5">
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-body-sm font-semibold text-white">Current Plan</h3>
          <Badge variant="cyan">{planName}</Badge>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-surface-800 border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-caption text-slate-500">Monthly Cost</span>
            </div>
            <div className="text-heading-sm font-heading font-bold text-white">₹2,999.00</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-800 border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-caption text-slate-500">Next Billing</span>
            </div>
            <div className="text-heading-sm font-heading font-bold text-white">Jun 15</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-800 border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-caption text-slate-500">Payment Method</span>
            </div>
            <div className="text-heading-sm font-heading font-bold text-white">Visa ****4242</div>
          </div>
        </div>
      </Card>

      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-body-sm font-semibold text-white">Invoice History</h3>
          <button className="text-caption text-accent-cyan hover:text-cyan-300 transition-colors flex items-center gap-1">
            View All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-body-sm text-white">{invoice.id}</div>
                  <div className="text-caption text-slate-500">{invoice.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-slate-300">{invoice.amount}</span>
                <Badge variant="emerald">{invoice.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
