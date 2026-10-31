import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { api } from '../../services/api';

interface QRScannerModalProps {
  onClose: () => void;
  onSuccessCheckin?: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose, onSuccessCheckin }) => {
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const handleScanSuccess = async (decodedText: string) => {
    // Prevent duplicate triggers while processing
    if (loading) return;

    try {
      setLoading(true);
      setScanError(null);
      // Stop scanner temporarily to freeze camera
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        setCameraActive(false);
      }

      const res = await api.post<any>('/attendance/scan', {
        qr_payload: decodedText,
        method: 'QR_SCAN',
      });

      setScanResult(res);
      if (onSuccessCheckin) onSuccessCheckin();
    } catch (err: any) {
      setScanError(err.message || 'Verification failed. Invalid or expired QR code.');
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
      const qrScanner = new Html5Qrcode('qr-reader-container');
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleScanSuccess,
        () => {} // Suppress continuous frame scan misses
      );
      setCameraActive(true);
    } catch (err: any) {
      setScanError('Camera access denied or unavailable. You can use the manual search fallback below.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-gym-surface border border-gym-border shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gym-border bg-gym-card">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-gym-lime" />
            <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
              Gym Entry Attendance Scanner
            </h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="p-6 flex flex-col items-center">
          
          {/* Success Result Banner */}
          {scanResult && (
            <div className="w-full mb-6 p-4 rounded-xl bg-gym-lime/10 border border-gym-lime/40 text-left animate-in fade-in zoom-in-95">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-gym-lime shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-heading font-black text-white text-base">
                    {scanResult.customer?.full_name}
                  </h4>
                  <p className="text-xs text-gym-lime font-bold mt-0.5">
                    {scanResult.message}
                  </p>
                  <div className="mt-2 text-xs text-slate-300 space-y-1">
                    <div><strong>Plan:</strong> {scanResult.customer?.membership_plan}</div>
                    <div><strong>Time:</strong> {scanResult.attendance?.time} ({scanResult.attendance?.date})</div>
                  </div>
                  {scanResult.customer?.membership_warning && (
                    <div className="mt-2.5 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-[11px] font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{scanResult.customer.membership_warning}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setScanResult(null);
                  startCamera();
                }}
                className="w-full mt-4 py-2 rounded-lg bg-gym-lime text-black font-extrabold text-xs uppercase tracking-wider"
              >
                Scan Next Member
              </button>
            </div>
          )}

          {/* Error Banner */}
          {scanError && (
            <div className="w-full mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-left flex items-start gap-3 text-red-400 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-white mb-0.5">Attendance Scan Notification</p>
                <p className="leading-relaxed">{scanError}</p>
                <button
                  onClick={() => {
                    setScanError(null);
                    startCamera();
                  }}
                  className="mt-3 px-3 py-1.5 rounded bg-gym-card text-white font-bold border border-gym-border hover:bg-gym-surface text-[11px]"
                >
                  Try Scanning Again
                </button>
              </div>
            </div>
          )}

          {/* Camera Frame Container */}
          {!scanResult && (
            <div className="w-full relative">
              <div
                id="qr-reader-container"
                className="w-full max-w-[320px] aspect-square mx-auto rounded-2xl overflow-hidden bg-black border-2 border-gym-border relative"
              />
              <p className="text-center text-[11px] text-slate-400 mt-3">
                Align the customer's phone QR code within the frame to verify entry.
              </p>
            </div>
          )}

          {/* Manual Input Fallback */}
          <div className="w-full mt-6 pt-6 border-t border-gym-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Manual QR Payload Search (Fallback)
            </h4>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder='Paste raw QR payload or test JSON...'
                className="flex-1 px-3 py-2 rounded-xl bg-gym-card border border-gym-border text-white text-xs focus:outline-none focus:border-gym-lime"
              />
              <button
                type="submit"
                disabled={loading || !manualCode.trim()}
                className="px-4 py-2 rounded-xl bg-gym-lime text-black font-bold text-xs uppercase tracking-wider disabled:opacity-50"
              >
                Verify
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
