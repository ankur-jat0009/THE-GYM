import React from 'react';
import { MapPin, Phone, Navigation, PhoneCall, Star } from 'lucide-react';

export const LocationContact: React.FC = () => {
  const address = "Neelkanth Enclave, Plot No. 9, Gali No. 1, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram, Haryana – 122101";
  const phone = "+91 99929 63807";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("THE GYM Badshahpur Sector 69 Gurugram")}`;

  return (
    <section id="location" className="py-24 bg-gym-bg border-t border-gym-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gym-lime/10 text-gym-lime border border-gym-lime/30 text-xs font-bold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Find Us in Gurugram
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase">
            VISIT THE GYM
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            Drop in for a walk-through of our equipment and start your workout journey today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Details Card */}
          <div className="lg:col-span-5 rounded-2xl bg-gym-card border border-gym-border p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-black text-2xl text-white">THE GYM</h3>
                <span className="text-sm font-bold text-gym-lime">Badshahpur</span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-gym-surface flex items-center justify-center text-gym-lime shrink-0 mt-0.5 border border-gym-border">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Gym Address</h5>
                    <p className="text-slate-200 mt-1 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-gym-surface flex items-center justify-center text-gym-lime shrink-0 mt-0.5 border border-gym-border">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Phone Contact</h5>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-white hover:text-gym-lime font-bold text-base mt-1 block transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-gym-surface flex items-center justify-center text-gym-lime shrink-0 mt-0.5 border border-gym-border">
                    <Star className="w-5 h-5 fill-gym-lime" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Google Rating</h5>
                    <p className="text-slate-200 font-semibold mt-1 flex items-center gap-1.5">
                      <span className="text-gym-lime font-bold">5.0 / 5.0</span>
                      <span className="text-slate-400 text-xs">(9 verified reviews)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8 mt-8 border-t border-gym-border/70">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="py-3 px-4 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gym-limeHover transition-all shadow-glow-lime-sm"
              >
                <PhoneCall className="w-4 h-4" />
                Call Gym
              </a>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-gym-surface hover:bg-gym-card text-white border border-gym-border hover:border-gym-lime/40 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-4 h-4 text-gym-lime" />
                Get Directions
              </a>
            </div>

          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7 rounded-2xl bg-gym-card border border-gym-border overflow-hidden shadow-xl min-h-[380px] relative">
            <iframe
              title="THE GYM Location Google Map"
              src={`https://maps.google.com/maps?q=92XV%2B7R%20Gurugram&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
