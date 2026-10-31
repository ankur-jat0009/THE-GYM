import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Maximize2, Minimize2, QrCode, MapPin, Phone, Dumbbell, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

interface GymQRModalProps {
  onClose: () => void;
}

export const GymQRModal: React.FC<GymQRModalProps> = ({ onClose }) => {
  const [qrData, setQrData] = useState<{
    qr_payload: string;
    code: string;
    gym_name: string;
    location: string;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGymQR = async () => {
      try {
        setLoading(true);
        const res = await api.get<any>('/attendance/gym-qr');
        setQrData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGymQR();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const payload = qrData?.qr_payload || JSON.stringify({
    gym: "THE GYM",
    branch: "Badshahpur, Sector 69, Gurugram",
    action: "ATTENDANCE_CHECKIN",
    code: "THE_GYM_OFFICIAL_CHECKIN_2026"
  });

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md ${isFullscreen ? 'p-0' : ''}`}>
      <div
        className={`relative w-full ${
          isFullscreen
            ? 'h-full max-w-none rounded-none border-none p-8 flex flex-col justify-center items-center bg-[#07090e]'
            : 'max-w-md rounded-3xl bg-gym-surface border border-gym-border shadow-2xl p-6 sm:p-8'
        } text-center overflow-hidden flex flex-col items-center`}
      >
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gym-lime/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Control Bar */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl bg-gym-card hover:bg-neutral-800 text-slate-300 hover:text-white border border-gym-border transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Front Desk Display"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-gym-card hover:bg-neutral-800 text-slate-300 hover:text-white border border-gym-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gym Header Branding */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gym-lime flex items-center justify-center text-black font-black shadow-glow-lime-sm">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <h2 className="font-heading font-black text-2xl text-white tracking-wider">THE GYM</h2>
            <p className="text-[10px] font-bold text-gym-lime uppercase tracking-widest -mt-1">
              Official Check-In Pass
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-xs mb-6">
          Display at the gym reception desk or entrance wall. Members scan this QR code with their mobile device to record attendance.
        </p>

        {/* QR Code Presentation Box */}
        <div className="p-5 rounded-3xl bg-white shadow-glow-lime flex flex-col items-center justify-center border-4 border-black/10">
          {loading ? (
            <div className="w-64 h-64 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-gym-lime border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <QRCodeSVG
              value={payload}
              size={isFullscreen ? 320 : 230}
              level="H"
              includeMargin={false}
            />
          )}
        </div>

        {/* Verification Tag */}
        <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gym-card border border-gym-border text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-gym-lime" />
          <span className="font-mono text-[11px] font-bold text-white tracking-wider">
            CODE: THE_GYM_OFFICIAL_CHECKIN_2026
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-xs">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gym-lime hover:bg-gym-limeHover text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-lime-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print QR Poster</span>
          </button>
        </div>

        {/* Footer Address */}
        <div className="mt-5 text-[11px] text-slate-500 leading-tight max-w-xs">
          Neelkanth Enclave, Near Ekta Hospital, Badshahpur, Sector 69, Gurugram
        </div>
      </div>
    </div>
  );
};
