import React, { useState } from 'react';
import { Check, Lock, ShieldCheck, Award } from 'lucide-react';
import { ServiceItem, ServiceTier } from '../types';
import { calculateSovereignPrice, formatCurrency, TIERS } from '../constants/data';
import { sound } from '../utils/audio';

interface ServiceCardProps {
  srv: ServiceItem;
  region: string;
  onRequest: (srv: ServiceItem, tier: ServiceTier, price: number) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ srv, region, onRequest }) => {
  const [checked, setChecked] = useState<number[]>([]);
  const [selectedTier, setSelectedTier] = useState<ServiceTier>('standard');

  const tierMultiplier = TIERS[selectedTier].multiplier;
  const finalPrice = calculateSovereignPrice(srv.basePrice, region, tierMultiplier);
  const isReady = checked.length === srv.checklist.length;

  const toggleCheck = (idx: number) => {
    sound.playCheck();
    if (checked.includes(idx)) {
      setChecked(checked.filter(i => i !== idx));
    } else {
      setChecked([...checked, idx]);
    }
  };

  const handleSelectTier = (tier: ServiceTier) => {
    sound.playClick(700);
    setSelectedTier(tier);
  };

  return (
    <div className="bg-[#0e0e11]/90 backdrop-blur border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all shadow-xl">
      {/* Header: Title and Price */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-white text-base font-semibold tracking-wide flex items-center gap-2">
            {srv.name}
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
            UNIDADE: {srv.unit}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-wider block">
            ESTIMADO ({region})
          </span>
          <span className="text-white font-mono font-bold text-lg tracking-tight">
            {formatCurrency(finalPrice)}
          </span>
        </div>
      </div>

      {/* Tier Selector Pills */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950/80 rounded-lg border border-zinc-800/80 mb-4">
        {(Object.keys(TIERS) as ServiceTier[]).map(t => {
          const tier = TIERS[t];
          const isSelected = selectedTier === t;
          return (
            <button
              key={t}
              onClick={() => handleSelectTier(t)}
              className={`py-1.5 px-2 rounded text-[10px] font-mono tracking-wider transition-all flex flex-col items-center ${
                isSelected
                  ? t === 'prime'
                    ? 'bg-yellow-500 text-black font-bold shadow-md'
                    : 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{tier.label}</span>
              <span className="text-[8px] opacity-75">{tier.multiplier}x</span>
            </button>
          );
        })}
      </div>

      {/* Mandatory Certifications */}
      {srv.certifications && srv.certifications.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {srv.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider"
            >
              <Award className="w-2.5 h-2.5" />
              <span>{cert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Protocol Checklist Divider */}
      <div className="h-[1px] bg-zinc-800 my-3" />

      {/* Checklist Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-yellow-500" />
          Protocolo Obrigatório ({checked.length}/{srv.checklist.length})
        </span>
        <span className={`text-[9px] font-mono ${isReady ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
          {isReady ? 'PROTOCOLO VERIFICADO' : 'CHECKLIST PENDENTE'}
        </span>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2 mb-4">
        {srv.checklist.map((item, idx) => {
          const isChecked = checked.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-center gap-2.5 p-2 rounded cursor-pointer transition-all border ${
                isChecked
                  ? 'bg-yellow-500/10 border-yellow-500/40 text-white'
                  : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  isChecked ? 'bg-yellow-500 border-yellow-500' : 'border-zinc-700 bg-zinc-800'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 text-black stroke-[3]" />}
              </div>
              <span className="text-xs select-none tracking-wide">{item}</span>
            </div>
          );
        })}
      </div>

      {/* Action Request Button */}
      <button
        disabled={!isReady}
        onClick={() => {
          sound.playDispatch();
          onRequest(srv, selectedTier, finalPrice);
        }}
        className={`w-full py-3 rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
          isReady
            ? 'bg-white hover:bg-zinc-200 text-black active:scale-[0.99] cursor-pointer'
            : 'bg-zinc-800/60 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60'
        }`}
      >
        {isReady ? (
          <>
            <span>SOLICITAR AGORA</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </>
        ) : (
          <>
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span>BLOQUEADO (COMPLETE O PROTOCOLO)</span>
          </>
        )}
      </button>
    </div>
  );
};
