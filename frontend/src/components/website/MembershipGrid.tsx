import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MembershipPlan } from '../../types';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const MembershipGrid: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        // Pure dynamic API fetch from backend - never hardcoded!
        const data = await api.get<MembershipPlan[]>('/membership-plans');
        setPlans(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load membership plans.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <section id="plans" className="py-24 bg-gym-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
            CHOOSE YOUR MEMBERSHIP PLAN
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            Simple, honest pricing with full gym access and no hidden surprise fees.
          </p>
        </div>

        {/* Dynamic Plans Loading / Error States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-gym-card animate-pulse border border-gym-border" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-sm text-red-400 bg-gym-card rounded-xl border border-gym-border">
            {error}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-400">
            No active membership plans found. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all ${
                  plan.is_popular
                    ? 'glass-panel-lime border-gym-lime shadow-glow-lime'
                    : 'bg-gym-card border border-gym-border hover:border-gym-lime/40'
                }`}
              >
                {/* Popular Pill Badge */}
                {plan.is_popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gym-lime text-black text-xs font-extrabold flex items-center gap-1 shadow-lg tracking-wide uppercase">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-heading font-black text-xl text-white tracking-wide">
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className="text-xs text-slate-400 mt-2 min-h-[36px] line-clamp-2">
                      {plan.description}
                    </p>
                  )}

                  {/* Pricing Display */}
                  <div className="mt-6 mb-6 pb-6 border-b border-gym-border/60">
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-black text-4xl sm:text-5xl text-white">
                        {formatCurrency(plan.price)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gym-lime block mt-1">
                      {plan.duration_months} Month{plan.duration_months > 1 ? 's' : ''} ({plan.duration_days} Days)
                    </span>
                  </div>

                  {/* Features Bullet List */}
                  <ul className="space-y-3 text-xs text-slate-300 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-gym-lime shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select / Join CTA */}
                <Link
                  to="/register"
                  className={`w-full py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    plan.is_popular
                      ? 'bg-gym-lime text-black hover:bg-gym-limeHover shadow-glow-lime-sm font-extrabold'
                      : 'bg-gym-surface hover:bg-gym-card text-white border border-gym-border hover:border-gym-lime/40'
                  }`}
                >
                  <span>Select Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
