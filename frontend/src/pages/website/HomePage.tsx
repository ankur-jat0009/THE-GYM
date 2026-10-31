import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { HeroSection } from '../../components/website/HeroSection';
import { TestimonialsSection } from '../../components/website/TestimonialsSection';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  CreditCard,
  Activity,
  Sparkles,
  MapPin,
  ArrowRight,
  Star,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const exploreCards = [
    {
      title: 'About THE GYM',
      desc: 'Our modern fitness facility, training philosophy, and supportive community in Gurugram.',
      path: '/about',
      badge: 'Our Story',
      image: '/images/about-gym.jpg',
      icon: <Dumbbell className="w-6 h-6 text-gym-lime" />,
      colorBorder: 'border-gym-lime/40 hover:border-gym-lime',
      glow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(204,255,0,0.25)]',
    },
    {
      title: 'Membership Plans',
      desc: 'Dynamic monthly, quarterly, and annual plans with zero hidden fees and digital receipts.',
      path: '/plans',
      badge: 'Pricing & Perks',
      image: '/images/plans-banner.jpg',
      icon: <CreditCard className="w-6 h-6 text-cyan-400" />,
      colorBorder: 'border-cyan-500/40 hover:border-cyan-400',
      glow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(6,182,212,0.25)]',
    },
    {
      title: 'Workout Programs',
      desc: '5 structured routine splits: Fat Loss, Muscle Gain, Strength, General Fitness & Beginners.',
      path: '/workouts',
      badge: 'Training Splits',
      image: '/images/workout-hero.jpg',
      icon: <Activity className="w-6 h-6 text-purple-400" />,
      colorBorder: 'border-purple-500/40 hover:border-purple-400',
      glow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(168,85,247,0.25)]',
    },
    {
      title: 'Why Choose Us',
      desc: 'Heavy free weights, clean air-cooled environment, and verified 5.0 Google member reviews.',
      path: '/why-us',
      badge: 'The Advantage',
      image: '/images/why-us-hero.jpg',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      colorBorder: 'border-amber-500/40 hover:border-amber-400',
      glow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(245,158,11,0.25)]',
    },
    {
      title: 'Location & Map',
      desc: 'Neelkanth Enclave, Plot No. 9, Badshahpur, Sector 69, Gurugram near Ekta Hospital.',
      path: '/location',
      badge: 'Badshahpur',
      image: '/images/location-gym.jpg',
      icon: <MapPin className="w-6 h-6 text-rose-400" />,
      colorBorder: 'border-rose-500/40 hover:border-rose-400',
      glow: 'group-hover:shadow-[0_10px_35px_-5px_rgba(244,63,94,0.25)]',
    },
  ];

  return (
    <div className="min-h-screen bg-gym-bg text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Animated Hero Section with Desktop & Mobile Pictures */}
        <HeroSection />

        {/* Section: Explore Dedicated Gym Pages with Real Photography */}
        <section className="py-20 bg-gym-surface/40 border-t border-gym-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-4">
                Explore THE GYM
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
                EXPERIENCE OUR FITNESS FACILITY
              </h2>
              <p className="text-slate-400 mt-4 text-sm sm:text-base">
                Discover our training floor, transparent pricing, structured workout programs, and member community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exploreCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Link
                    to={card.path}
                    className={`relative overflow-hidden rounded-2xl bg-gym-card border ${card.colorBorder} ${card.glow} transition-all duration-500 hover:-translate-y-1.5 group h-full flex flex-col justify-between shadow-xl min-h-[300px]`}
                  >
                    {/* Background Photo with dark gradient overlay */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-35 group-hover:opacity-45"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gym-card via-gym-card/85 to-black/70" />
                    </div>

                    <div className="relative z-10 p-7 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div className="w-12 h-12 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-center border border-gym-border/80 group-hover:scale-110 transition-transform shadow-md">
                            {card.icon}
                          </div>
                          <span className="text-[11px] font-black text-white uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-gym-border/70">
                            {card.badge}
                          </span>
                        </div>
                        <h3 className="font-heading font-black text-2xl text-white mb-2.5 group-hover:text-gym-lime transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                          {card.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-black text-gym-lime group-hover:translate-x-1.5 transition-transform uppercase tracking-wider">
                        <span>Explore Page</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Verified Google Member Reviews */}
        <TestimonialsSection />

        {/* Fast Action Join Banner */}
        <section className="py-20 bg-gym-bg border-t border-gym-border/60 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-gym-surface via-gym-card to-gym-surface border border-gym-lime/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gym-lime/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="inline-flex items-center gap-2 text-yellow-400 mb-4 bg-black/60 px-4 py-1.5 rounded-full border border-gym-border">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
                <span className="text-white font-extrabold text-xs ml-1">5.0 Star Google Rating</span>
              </div>

              <h3 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase mb-4">
                JOIN THE GYM GURUGRAM TODAY
              </h3>
              <p className="text-slate-300 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                Take the first step toward your fitness journey. Digital attendance, transparent fees, and quality equipment in Badshahpur, Sector 69.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime hover:bg-gym-limeHover transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <span>Register as Member</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  to="/plans"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gym-surface hover:bg-gym-card text-white border border-gym-border text-xs font-bold uppercase tracking-wider transition-all"
                >
                  View Membership Plans
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
