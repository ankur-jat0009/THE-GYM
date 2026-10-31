import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share, PlusSquare, Sparkles } from 'lucide-react';

interface PwaInstallButtonProps {
  variant?: 'lime' | 'surface';
  className?: string;
  label?: string;
}

export const PwaInstallButton: React.FC<PwaInstallButtonProps> = ({
  variant = 'surface',
  className = '',
  label = 'Download App',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (PWA installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) {
      alert('THE GYM app is already installed on your device!');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowIosModal(true);
    }
  };

  const baseStyles =
    variant === 'lime'
      ? 'bg-gym-lime hover:bg-gym-limeHover text-black shadow-glow-lime-sm font-black'
      : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-gym-lime font-bold';

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md group ${baseStyles} ${className}`}
        title="Install THE GYM as a mobile app on Android, iOS, or Desktop"
      >
        <Smartphone className="w-4 h-4 text-gym-lime group-hover:scale-110 transition-transform" />
        <span>{isInstalled ? 'App Installed ✓' : label}</span>
        {!isInstalled && <Download className="w-3.5 h-3.5 opacity-70 group-hover:translate-y-0.5 transition-transform" />}
      </button>

      {/* Deep Dark Black Install Dialog */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl bg-black border border-neutral-800 p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-center space-y-4">
            
            {/* Top accent hairline glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gym-lime/50 to-transparent rounded-t-3xl" />

            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-gym-lime flex items-center justify-center mx-auto border border-neutral-800 shadow-glow-lime-sm">
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-bold text-gym-lime uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                PWA Mobile App
              </div>
              <h3 className="font-heading font-black text-xl text-white uppercase tracking-wide">
                Download THE GYM App
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Install directly on your phone home screen for instant camera check-ins and offline receipts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 text-left space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gym-lime text-black font-extrabold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-snug">
                  In your phone browser (<strong className="text-white">Safari</strong> on iPhone or <strong className="text-white">Chrome</strong> on Android), tap the{' '}
                  <strong className="text-white">Share</strong> or <strong className="text-white">Menu (⋮)</strong> button.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gym-lime text-black font-extrabold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <p className="leading-snug">
                  Scroll down and tap <strong className="text-gym-lime">"Add to Home Screen"</strong> or{' '}
                  <strong className="text-gym-lime">"Install App"</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gym-lime text-black font-extrabold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-snug">
                  Tap <strong className="text-white">Add</strong>. THE GYM icon will appear on your device like a native app!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-3 rounded-xl bg-gym-lime hover:bg-gym-limeHover text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
