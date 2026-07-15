import { useState, useEffect } from 'react';
import { School, Download } from 'lucide-react';
import { Card, Badge } from '../ui';
import { useAuth } from '../../hooks/useAuth';

interface Booking {
  id: number;
  institute_name: string | null;
  contact_name: string;
  plan_duration: string | null;
  amount_paid: string;
  receipt_url: string | null;
  booking_date: string | null;
  status: 'pending' | 'approved' | 'completed';
  created_at: string;
}

export function BookedSessions() {
  const { dbUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!dbUser) return;
      try {
        const res = await fetch(`/api/bookings?uid=${dbUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [dbUser]);

  if (loading) {
    return null; // hide or render nothing during parent load
  }

  if (bookings.length === 0) {
    return null; // Don't clutter the dashboard if they haven't booked anything
  }

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center gap-2.5 mb-4 select-none">
        <School className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-body-sm font-semibold text-white uppercase tracking-wider">Booked Hacking Bootcamps</h3>
      </div>

      <div className="space-y-3 font-mono">
        {bookings.map((b) => (
          <div key={b.id} className="p-3 bg-surface-900 border border-white/[0.04] rounded-lg flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-wide truncate">
                {b.institute_name || 'Individual Operator Bootcamp'}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                Amount Paid: <span className="text-accent-cyan">₹{parseFloat(b.amount_paid).toLocaleString()} INR</span> &middot; Duration: {b.plan_duration || '1 Month'}
              </p>
              {b.booking_date && (
                <p className="text-[9px] text-slate-500 mt-0.5">
                  Scheduled Start: {new Date(b.booking_date).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  b.status === 'approved' 
                    ? 'emerald' 
                    : b.status === 'completed' 
                    ? 'cyan' 
                    : 'neutral'
                }
                className="text-[9px] uppercase font-semibold py-0.5"
              >
                {b.status}
              </Badge>
              
              {b.receipt_url && (
                <a href={b.receipt_url} target="_blank" rel="noopener noreferrer">
                  <button className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-accent-cyan/10 border border-white/[0.06] hover:border-accent-cyan/20 flex items-center justify-center text-slate-400 hover:text-accent-cyan transition-all cursor-pointer">
                    <Download className="w-4 h-4" />
                  </button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
