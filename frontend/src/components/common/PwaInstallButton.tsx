import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share, PlusSquare } from 'lucide-react';

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
    } else if (isIos) {
      setShowIosModal(true);
    } else {
      // Fallback instructions for desktop or Android if prompt was dismissed
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

      {/* iOS / General Install Help Dialog */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-gym-surface border border-gym-border p-6 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gym-lime/10 text-gym-lime flex items-center justify-center mx-auto border border-gym-lime/30 shadow-glow-lime-sm">
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-heading font-black text-lg text-white uppercase tracking-wide">
                Install THE GYM App
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Install on your phone home screen for instant 1-tap access and camera check-ins.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gym-card border border-gym-border text-left space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gym-lime text-black font-bold flex items-center justify-center text-[11px] shrink-0">
                  1
                </span>
                <p>
                  In your mobile browser (Safari on iPhone, Chrome on Android), tap the{' '}
                  <strong className="text-white">Share</strong> or <strong className="text-white">Menu (⋮)</strong> button.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gym-lime text-black font-bold flex items-center justify-center text-[11px] shrink-0">
                  2
                </span>
                <p>
                  Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> or{' '}
                  <strong className="text-white">"Install app"</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-gym-lime text-black font-bold flex items-center justify-center text-[11px] shrink-0">
                  3
                </span>
                <p>
                  Tap <strong className="text-white">Add</strong>. THE GYM icon is now installed on your device!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider hover:bg-gym-limeHover shadow-glow-lime-sm transition-all"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
