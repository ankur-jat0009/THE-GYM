import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Sparkles, Dumbbell } from 'lucide-react';
import { api } from '../../services/api';

interface MemberScannerModalProps {
  onClose: () => void;
  onSuccessCheckin?: () => void;
}

export const MemberScannerModal: React.FC<MemberScannerModalProps> = ({ onClose, onSuccessCheckin }) => {
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const handleScanSuccess = async (decodedText: string) => {
    if (loading) return;

    try {
      setLoading(true);
      setScanError(null);

      // Stop scanner camera
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        setCameraActive(false);
      }

      const res = await api.post<any>('/attendance/member-checkin', {
        qr_payload: decodedText,
      });

      setScanResult(res);
      if (onSuccessCheckin) onSuccessCheckin();
    } catch (err: any) {
      setScanError(err.message || 'Check-in failed. Please scan the official THE GYM entrance QR code.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScanSuccess(manualCode.trim());
  };

  const startCamera = async () => {
    setScanResult(null);
    setScanError(null);
    try {
      const qrScanner = new Html5Qrcode('member-qr-reader-container');
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleScanSuccess,
        () => {}
      );
      setCameraActive(true);
    } catch (err: any) {
      setScanError('Camera permission not granted or device camera unavailable. You can enter the gym check-in code below.');
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-gym-surface border border-gym-border shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gym-border bg-gym-card">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gym-lime flex items-center justify-center text-black font-black">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
                Scan Gym QR Pass
              </h3>
              <p className="text-[11px] text-slate-400">Point your camera at the front desk QR code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* Success Check-in Screen */}
          {scanResult && (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-heading font-black text-xl text-white">
                  Checked In Successfully!
                </h4>
                <p className="text-xs text-emerald-300 mt-1">
                  {scanResult.message || 'Your daily workout attendance is recorded.'}
                </p>
                {scanResult.check_in_time && (
                  <p className="text-xs font-mono font-bold text-white mt-2 bg-black/40 py-1 px-3 rounded-full inline-block border border-white/10">
                    Checked in at {scanResult.check_in_time}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gym-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow-lime-sm hover:bg-gym-limeHover transition-all mt-3"
              >
                Done • Start Workout
              </button>
            </div>
          )}

          {/* Scanner Viewport */}
          {!scanResult && (
            <div className="relative">
              <div
                id="member-qr-reader-container"
                className="w-full aspect-square rounded-2xl overflow-hidden bg-black border-2 border-gym-border relative shadow-inner"
              />

              {loading && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-2xl z-10">
                  <RefreshCw className="w-8 h-8 text-gym-lime animate-spin" />
                  <span className="text-xs font-bold text-white tracking-wide">Recording attendance...</span>
                </div>
              )}
            </div>
          )}

          {/* Error Notice */}
          {scanError && !scanResult && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{scanError}</span>
                <button
                  onClick={startCamera}
                  className="mt-2 block text-gym-lime hover:underline font-bold text-[11px]"
                >
                  Retry Camera Scan
                </button>
              </div>
            </div>
          )}

          {/* Manual Code Fallback */}
          {!scanResult && (
            <div className="pt-2 border-t border-gym-border/60">
              <p className="text-[11px] text-slate-400 mb-2 text-center">
                Can't scan? Enter the gym check-in code directly:
              </p>
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. THE_GYM_OFFICIAL_CHECKIN_2026"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-gym-lime"
                />
                <button
                  type="submit"
                  disabled={loading || !manualCode.trim()}
                  className="px-4 py-2 rounded-xl bg-gym-lime hover:bg-gym-limeHover text-black text-xs font-bold transition-all disabled:opacity-50"
                >
                  Submit
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
