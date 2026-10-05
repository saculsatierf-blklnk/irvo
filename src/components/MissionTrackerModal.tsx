import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, ShieldCheck, MapPin, Radio, Send, PhoneCall, AlertTriangle, 
  Clock, Award, ChevronRight, UserCheck
} from 'lucide-react';
import { ActiveMission } from '../types';
import { formatCurrency, TIERS } from '../constants/data';
import { sound } from '../utils/audio';

interface MissionTrackerModalProps {
  mission: ActiveMission | null;
  onClose: () => void;
}

export const MissionTrackerModal: React.FC<MissionTrackerModalProps> = ({ mission, onClose }) => {
  const [eta, setEta] = useState(14);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'op' | 'user'; text: string; time: string }>>([
    { sender: 'op', text: 'Operador em rota. Procedimento padrão iniciado com sucesso.', time: '09:28' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [stepIndex, setStepIndex] = useState(2);

  useEffect(() => {
    if (mission) {
      setEta(mission.etaMinutes);
      setMessages([
        { 
          sender: 'op', 
          text: `Saudações. Aqui é o ${mission.operativeName}. Protocolo de ${mission.serviceName} ativado em ${mission.region}. Estimativa de chegada: ${mission.etaMinutes} minutos.`, 
          time: 'Agora' 
        }
      ]);
    }
  }, [mission]);

  if (!mission) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sound.playClick(800);
    const newMsg = { sender: 'user' as const, text: inputMsg, time: 'Agora' };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    setTimeout(() => {
      sound.playRadarPing();
      setMessages(prev => [
        ...prev, 
        { sender: 'op' as const, text: 'Mensagem recebida e confirmada no radar de bordo. Câmbio.', time: 'Agora' }
      ]);
    }, 1200);
  };

  const steps = [
    { title: 'Cérebro Soberano', desc: 'Demanda processada e precificação regional fixada' },
    { title: 'Operativo Certificado', desc: `${mission.operativeName} (${mission.operativeBadge}) alocado` },
    { title: 'Deslocamento Tático', desc: `ETA atual: ${eta} min via rota prioritária criptografada` },
    { title: 'Execução do Protocolo', desc: 'Checagem de biometria e entrega do serviço no perímetro' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#111116] border border-zinc-700/80 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Tactical Gold Header Strip */}
        <div className="h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />

        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase">
                MISSÃO TÁTICA ATIVA // {mission.id}
              </span>
            </div>
            <h2 className="text-white text-base font-bold mt-1 tracking-wide">
              {mission.serviceName}
            </h2>
          </div>

          <button
            onClick={() => {
              sound.playClick(300);
              onClose();
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Operative Card */}
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center shrink-0">
              <UserCheck className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm tracking-wide">{mission.operativeName}</span>
                <span className="text-yellow-500 text-xs font-mono font-bold">★ {mission.operativeRating.toFixed(2)}</span>
              </div>
              <span className="text-zinc-500 font-mono text-[10px] block mt-0.5">
                BADGE: {mission.operativeBadge} • SETOR: {mission.region}
              </span>
              <div className="flex flex-wrap gap-1 mt-2">
                {mission.operativeCerts.map((c, i) => (
                  <span key={i} className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Tier Breakdown */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80 font-mono text-xs">
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">NÍVEL SELECIONADO</span>
              <span className="text-white font-bold tracking-wider">{TIERS[mission.tier].label}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 text-[10px] block uppercase">VALOR SOBERANO</span>
              <span className="text-yellow-500 font-bold text-sm">{formatCurrency(mission.price)}</span>
            </div>
          </div>

          {/* Tactical Progress Timeline */}
          <div>
            <h4 className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase mb-3 flex items-center gap-2">
              <Clock className="w-3 h-3 text-yellow-500" />
              STATUS DA OPERAÇÃO EM TEMPO REAL
            </h4>
            
            <div className="space-y-3">
              {steps.map((st, i) => {
                const isPassed = i < stepIndex;
                const isCurrent = i === stepIndex;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-mono ${
                        isPassed 
                          ? 'bg-emerald-500 border-emerald-500 text-black font-bold' 
                          : isCurrent 
                            ? 'bg-yellow-500 border-yellow-500 text-black font-bold animate-pulse' 
                            : 'border-zinc-700 bg-zinc-900 text-zinc-500'
                      }`}>
                        {isPassed ? '✓' : i + 1}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 h-6 my-1 ${isPassed ? 'bg-emerald-500/50' : 'bg-zinc-800'}`} />
                      )}
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <span className={`text-xs font-bold tracking-wide block ${
                        isCurrent ? 'text-yellow-400' : isPassed ? 'text-white' : 'text-zinc-500'
                      }`}>
                        {st.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 leading-tight block mt-0.5">
                        {st.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Encrypted Comms Drawer */}
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-black/60">
            <button
              onClick={() => {
                sound.playClick(600);
                setChatOpen(!chatOpen);
              }}
              className="w-full p-3 flex items-center justify-between text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-900/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">CANAL CRIPTOGRAFADO P2P (PGP 4096-BIT)</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${chatOpen ? 'rotate-90' : ''}`} />
            </button>

            {chatOpen && (
              <div className="p-3 border-t border-zinc-800 space-y-3">
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-2 rounded-lg max-w-[85%] ${
                        m.sender === 'user' 
                          ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300' 
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                      }`}>
                        <p>{m.text}</p>
                      </div>
                      <span className="text-[9px] text-zinc-600 mt-0.5 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={e => setInputMsg(e.target.value)}
                    placeholder="Mensagem tática..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500/50 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded-lg font-bold text-xs flex items-center justify-center transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playTacticalAlert();
              alert("PROTOCOLO SOS ATIVADO: Telemetria prioritária enviada para central de contingência.");
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-red-500/40 text-red-500 hover:bg-red-500/10 text-xs font-mono font-bold tracking-wider transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>

          <button
            onClick={() => {
              sound.playDispatch();
              alert("Missão concluída com sucesso e protocolada na blockchain privada da IRVO.");
              onClose();
            }}
            className="flex-1 py-2.5 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs rounded-lg tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CONFIRMAR RECEBIMENTO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
