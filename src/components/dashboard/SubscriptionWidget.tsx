import { Crown, ArrowRight, Zap } from 'lucide-react';
import { Card, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export function SubscriptionWidget() {
  const { subscription } = useAuth();

  const tier = subscription?.tier ?? 'free';
  const planName = tier === 'pro' ? 'Pro Operator' : 'Free Recruit';
  const isPro = tier === 'pro';

  const trainingPlan = subscription?.active_training_plan ?? 'none';
  const meetExpiry = subscription?.meet_plan_expiry;
  const trainingExpiry = subscription?.training_plan_expiry;

  return (
    <Card variant="glass" className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isPro ? 'bg-accent-cyan/10 border-accent-cyan/20' : 'bg-accent-violet/10 border-accent-violet/20'}`}>
          <Crown className={`w-5 h-5 ${isPro ? 'text-accent-cyan' : 'text-accent-violet'}`} />
        </div>
        <div>
          <h3 className="text-body-sm font-semibold text-white">{planName}</h3>
          <p className="text-caption text-slate-500">{isPro ? 'Active Pro Access' : 'Free Tier'}</p>
        </div>
      </div>

      {isPro && (
        <div className="space-y-2 mb-4">
          {trainingPlan !== 'none' && (
            <div className="flex justify-between text-caption">
              <span className="text-slate-500">Training Plan</span>
              <span className="text-accent-cyan capitalize">{trainingPlan.replace('_', ' ')}</span>
            </div>
          )}
          {meetExpiry && (
            <div className="flex justify-between text-caption">
              <span className="text-slate-500">Meet Access Until</span>
              <span className="text-slate-300">{new Date(meetExpiry).toLocaleDateString()}</span>
            </div>
          )}
          {trainingExpiry && (
            <div className="flex justify-between text-caption">
              <span className="text-slate-500">Training Expires</span>
              <span className="text-slate-300">{new Date(trainingExpiry).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}

      {!isPro && (
        <div className="mb-4 p-3 rounded-lg bg-accent-cyan/5 border border-accent-cyan/10">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-caption font-semibold text-accent-cyan">Upgrade to Pro</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Unlock all courses, live weekend doubt sessions & premium books.
          </p>
        </div>
      )}

      <Link to="/subscription">
        <Button variant="outline" size="sm" className="w-full">
          {isPro ? 'Manage Subscription' : 'View Plans'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </Link>
    </Card>
  );
}
