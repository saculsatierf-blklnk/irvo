import React, { useState, useEffect } from 'react';
import { ScanFace, FileText, Camera, ArrowRight, X, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { sound } from '../utils/audio';

interface KYCModalProps {
  visible: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export const KYCModal: React.FC<KYCModalProps> = ({ visible, onClose, onVerified }) => {
  const [stage, setStage] = useState<'options' | 'camera_sim' | 'analyzing' | 'approved'>('options');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStage('options');
      setScanProgress(0);
    }
  }, [visible]);

  if (!visible) return null;

  const startAnalysis = () => {
    sound.playTacticalAlert();
    setStage('analyzing');
    setScanProgress(15);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            sound.playDispatch();
            setStage('approved');
            setTimeout(() => {
              onVerified();
            }, 1600);
          }, 400);
          return 100;
        }
        return prev + 18;
      });
    }, 400);
  };

  const handleStartLiveness = () => {
    sound.playRadarPing();
    setStage('camera_sim');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#121217] border border-zinc-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Tactical Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-yellow-500 to-emerald-500" />

        {/* Close Button */}
        {stage !== 'analyzing' && stage !== 'approved' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STAGE 1: OPTIONS */}
        {stage === 'options' && (
          <div>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
                <ScanFace className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-white text-lg font-bold tracking-wide">
                Verificação de Identidade Tática
              </h2>
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                Para ativar o perfil profissional <span className="text-yellow-500 font-bold">IRVO PRO</span>,
                validamos suas credenciais técnicas e biometria facial de alta fidelidade.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={startAnalysis}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-semibold text-sm block">Anexar Documento Digital</span>
                  <span className="text-zinc-400 text-[11px] block">PDF do CREA, CRM, OAB, ANAC ou Certificação Técnica</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={handleStartLiveness}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-800/80 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-semibold text-sm block">Biometria Facial (Liveness)</span>
                  <span className="text-zinc-400 text-[11px] block">Verificação biométrica 3D com inteligência anti-spoof</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="text-red-400 hover:text-red-300 text-xs font-mono font-bold tracking-wider uppercase transition-colors"
              >
                CANCELAR PROCEDIMENTO
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: CAMERA LIVENESS SIMULATOR */}
        {stage === 'camera_sim' && (
          <div className="flex flex-col items-center text-center">
            <h3 className="text-white text-base font-bold mb-1">PROVA DE VIDA EM TEMPO REAL</h3>
            <p className="text-zinc-400 text-xs mb-4">Posicione seu rosto dentro do retículo biométrico</p>

            <div className="w-64 h-64 rounded-full border-2 border-emerald-500/50 relative overflow-hidden bg-zinc-950 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
              {/* Scanning Laser Line */}
              <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_15px_#22c55e] animate-bounce opacity-80" />
              
              {/* Silhouette Reticle */}
              <div className="w-40 h-52 border border-emerald-400/30 rounded-[80px] flex items-center justify-center">
                <ScanFace className="w-24 h-24 text-emerald-500/40" />
              </div>

              {/* Angle Brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
            </div>

            <button
              onClick={startAnalysis}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-mono font-bold text-xs rounded-xl tracking-widest uppercase transition-all shadow-lg"
            >
              CAPTURAR E VALIDAR BIOMETRIA
            </button>
          </div>
        )}

        {/* STAGE 3: ANALYZING */}
        {stage === 'analyzing' && (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin flex items-center justify-center mb-6">
              <Cpu className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            
            <h3 className="text-emerald-400 font-mono font-bold text-lg tracking-wider">
              IA ANALISANDO CREDENCIAIS...
            </h3>
            
            <p className="text-zinc-400 text-xs mt-2 max-w-xs leading-relaxed">
              Cruzando telemetria biométrica e registros oficiais junto às bases regulatórias federais...
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs bg-zinc-900 h-2 rounded-full overflow-hidden mt-6 border border-zinc-800">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 mt-2">{scanProgress}% CONCLUÍDO</span>
          </div>
        )}

        {/* STAGE 4: APPROVED */}
        {stage === 'approved' && (
          <div className="py-8 flex flex-col items-center text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="text-white font-bold text-lg tracking-wide">
              ACESSO CONCEDIDO
            </h3>
            <p className="text-zinc-300 text-xs mt-2 max-w-xs leading-relaxed">
              Identidade Tática Confirmada com Sucesso.<br />
              <span className="text-yellow-500 font-bold">Bem-vindo à Rede Operacional IRVO PRO.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
