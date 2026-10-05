import React, { useState } from 'react';
import { X, Activity, Cpu, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { sound } from '../utils/audio';

interface ReactorModalProps {
  visible: boolean;
  onClose: () => void;
  region: string;
}

export const ReactorModal: React.FC<ReactorModalProps> = ({ visible, onClose, region }) => {
  const [scanning, setScanning] = useState(false);
  const [score, setScore] = useState(988);

  if (!visible) return null;

  const handleScan = () => {
    sound.playTacticalAlert();
    setScanning(true);
    setTimeout(() => {
      sound.playDispatch();
      setScore(Math.floor(Math.random() * 20) + 980);
      setScanning(false);
    }, 1800);
  };

  const metrics = [
    { label: 'INTEGRIDADE DO PROTOCOLO', val: '99.8%', width: '99.8%' },
    { label: 'LATÊNCIA DO ENCLAVE', val: '22ms', width: '92%' },
    { label: 'CAPACIDADE SOBERANA', val: '96.4%', width: '96.4%' },
    { label: 'REDE TÁTICA ATIVA', val: '142 OPS', width: '88%' },
    { label: 'COBERTURA GEOPOLÍTICA', val: `SETOR ${region}`, width: '100%' },
    { label: 'BLINDAGEM ZERO-TRUST', val: 'SHA-512', width: '100%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md bg-[#0a0a0e] border border-white/20 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Rank Header (Original Build 4.1 Spec) */}
        <div className="bg-yellow-500 py-3 px-5 flex items-center justify-between text-black font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 stroke-[2.5]" />
            <span className="text-xs font-black tracking-widest uppercase">
              REATOR SOBERANO // RANK OPERACIONAL
            </span>
          </div>
          <span className="text-sm font-black tracking-widest bg-black text-yellow-400 px-2 py-0.5 rounded">
            OMEGA-1
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick(300);
            onClose();
          }}
          className="absolute top-12 right-4 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Reactor Matrix Body */}
        <div className="p-6 space-y-4 font-mono">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
            <Cpu className="w-4 h-4 text-yellow-500" />
            <span className="tracking-widest uppercase text-[10px]">DIAGNÓSTICO DA INFRAESTRUTURA</span>
          </div>

          <div className="space-y-3.5">
            {metrics.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400 font-bold tracking-wider">{m.label}</span>
                  <span className="text-white font-black">{m.val}</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: m.width }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Score Total Container (Build 4.1 Spec) */}
          <div className="border-t border-white/10 pt-4 mt-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block">
                SCORE TÁTICO CONSOLIDADO
              </span>
              <span className="text-xs text-zinc-500 font-mono">STATUS DE PRONTIDÃO: MÁXIMA</span>
            </div>
            <span className="text-3xl font-black text-yellow-500 font-mono tracking-tighter shadow-sm">
              {score}
            </span>
          </div>

          {/* Tactical Scan Button (Build 4.1 Spec) */}
          <button
            onClick={handleScan}
            disabled={scanning}
            className="w-full mt-4 py-3.5 bg-white hover:bg-zinc-200 active:scale-[0.99] text-black font-mono font-black text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>EXECUTANDO VARREDURA...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                <span>EXECUTAR VARREDURA TÁTICA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
