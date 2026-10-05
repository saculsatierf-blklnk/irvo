import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, SwitchCamera, Search, ChevronRight, DollarSign, Bell, CheckCircle, 
  Sparkles, Radio, Activity, X, User, Briefcase, Filter
} from 'lucide-react';
import { UserRole, OperationMode, ServiceCategory, ServiceItem, ServiceTier, ActiveMission } from '../types';
import { MODES, getSortedCategories, DATA_STORE } from '../constants/data';
import { TelemetryHUD } from './TelemetryHUD';
import { ObsidianMap } from './ObsidianMap';
import { ServiceCard } from './ServiceCard';
import { KYCModal } from './KYCModal';
import { MissionTrackerModal } from './MissionTrackerModal';
import { ReactorModal } from './ReactorModal';
import { sound } from '../utils/audio';

interface CockpitScreenProps {
  userRole: UserRole;
  onLogout: () => void;
  onRoleChange?: (role: UserRole) => void;
}

export const CockpitScreen: React.FC<CockpitScreenProps> = ({ userRole, onLogout, onRoleChange }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(userRole);
  const [mode, setMode] = useState<'client' | 'provider'>(userRole.startsWith('provider') ? 'provider' : 'client');
  const [currentRegion, setCurrentRegion] = useState('SP');

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showReactor, setShowReactor] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [providerStatus, setProviderStatus] = useState<'unverified' | 'verified'>('unverified');
  const [isOnline, setIsOnline] = useState(false);
  const [providerEarnings, setProviderEarnings] = useState(1850);

  // Navigation states
  const [viewState, setViewState] = useState<'MODES' | 'CATS' | 'SERVS'>('MODES');
  const [selectedMode, setSelectedMode] = useState<OperationMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  // Active mission
  const [activeMission, setActiveMission] = useState<ActiveMission | null>(null);

  const isBusiness = currentRole.includes('pj');
  const creditBalance = isBusiness ? "R$ 5.500,00" : "R$ 0,00";
  const sortedCategories = useMemo(() => getSortedCategories(currentRegion), [currentRegion]);

  // Quick switch role
  const handleRoleSelect = (r: UserRole) => {
    sound.playClick(750);
    setCurrentRole(r);
    if (r.startsWith('provider')) {
      setMode('provider');
    } else {
      setMode('client');
    }
    if (onRoleChange) onRoleChange(r);
  };

  const handleSwitchMode = () => {
    sound.playClick(650);
    if (mode === 'provider') {
      setMode('client');
      return;
    }
    if (providerStatus === 'verified') {
      setMode('provider');
    } else {
      setShowKYC(true);
    }
  };

  const handleModeSelect = (modeId: OperationMode) => {
    sound.playClick(800);
    setSelectedMode(modeId);
    setViewState('CATS');
  };

  const handleCatSelect = (cat: ServiceCategory) => {
    sound.playClick(800);
    setSelectedCategory(cat);
    setViewState('SERVS');
  };

  const handleBack = () => {
    sound.playClick(400);
    if (viewState === 'SERVS') {
      setViewState('CATS');
    } else if (viewState === 'CATS') {
      setViewState('MODES');
      setSelectedMode(null);
    }
  };

  const handleRequestService = (srv: ServiceItem, tier: ServiceTier, price: number) => {
    sound.playDispatch();

    const operatives = [
      { name: 'Cmdte. Roberto Valente', badge: 'IRVO-TAC-091', rating: 4.98, certs: ['GEB/DEIC', 'DIREÇÃO DEFENSIVA', 'NR-10'] },
      { name: 'Dra. Helena Moretti', badge: 'IRVO-BIO-442', rating: 5.0, certs: ['COREN/CRM', 'SUPORTE AVANÇADO'] },
      { name: 'Eng. Rafael Prado', badge: 'IRVO-ENG-881', rating: 4.96, certs: ['CREA CIVIL', 'PMOC ANVISA'] },
      { name: 'Espec. Daniel Koslov', badge: 'IRVO-SEC-721', rating: 4.99, certs: ['CISSP', 'AWS ARCHITECT'] }
    ];

    const op = operatives[Math.floor(Math.random() * operatives.length)];

    const mission: ActiveMission = {
      id: `TAC-${Math.floor(Math.random() * 89999 + 10000)}`,
      serviceName: srv.name,
      categoryLabel: selectedCategory?.label || 'TÁTICA',
      mode: selectedMode || 'site',
      tier,
      price,
      region: currentRegion,
      operativeName: op.name,
      operativeBadge: op.badge,
      operativeRating: op.rating,
      operativeCerts: srv.certifications.length > 0 ? srv.certifications : op.certs,
      etaMinutes: Math.floor(Math.random() * 12) + 8,
      status: 'dispatching',
      createdAt: new Date().toLocaleTimeString()
    };

    setActiveMission(mission);
  };

  // Filtered services when searching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: Array<{ srv: ServiceItem; cat: ServiceCategory }> = [];
    Object.values(DATA_STORE).forEach(cat => {
      cat.services.forEach(srv => {
        if (
          srv.name.toLowerCase().includes(q) ||
          cat.label.toLowerCase().includes(q) ||
          srv.certifications.some(c => c.toLowerCase().includes(q))
        ) {
          results.push({ srv, cat });
        }
      });
    });
    return results;
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col overflow-hidden select-none">
      {/* Background Obsidian Map */}
      <div className="absolute inset-0 opacity-15">
        <ObsidianMap region={currentRegion} activeMarker={activeMission ? { label: activeMission.operativeName } : null} />
      </div>

      {/* Top Telemetry HUD */}
      <TelemetryHUD
        region={currentRegion}
        setRegion={setCurrentRegion}
        onLogout={onLogout}
      />

      {/* Cockpit Navigation Header */}
      <header className="relative z-30 px-6 py-3.5 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {mode === 'client' && viewState !== 'MODES' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 bg-zinc-900/80 hover:bg-zinc-800 text-white px-3 py-1 rounded-full border border-zinc-700/80 text-[10px] font-mono font-bold tracking-wider"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>VOLTAR</span>
            </button>
          )}

          <h2 className="text-xl font-black tracking-tight font-mono">
            {mode === 'client' ? (
              <span className="text-white">IRVO<span className="text-zinc-500">.</span></span>
            ) : (
              <span className="text-yellow-500">PRO<span className="text-zinc-400">.</span></span>
            )}
          </h2>

          {/* Role badge pill */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 rounded-full px-2.5 py-0.5 text-[9px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <span className="uppercase font-bold">
              {currentRole === 'client_pf' && 'CLIENTE (PF)'}
              {currentRole === 'client_pj' && 'BUSINESS (PJ)'}
              {currentRole === 'provider_pf' && 'PRO AUTÔNOMO'}
              {currentRole === 'provider_pj' && 'PRO PARCEIRO'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tactical Reactor Diagnostic Button (Build 4.1 Feature) */}
          <button
            onClick={() => {
              sound.playRadarPing();
              setShowReactor(true);
            }}
            title="Diagnóstico do Reator Tático"
            className="flex items-center gap-1.5 p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 text-xs font-mono font-bold transition-all"
          >
            <Activity className="w-4 h-4 text-yellow-500" />
            <span className="hidden md:inline">REATOR</span>
          </button>

          {/* Active Mission Pill */}
          {activeMission && (
            <button
              onClick={() => setActiveMission(activeMission)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono animate-pulse"
            >
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>MISSÃO ATIVA</span>
            </button>
          )}

          {/* Mode Switch Toggle Button */}
          <button
            onClick={handleSwitchMode}
            title={mode === 'client' ? 'Alternar para Modo Prestador PRO' : 'Alternar para Modo Cliente'}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono ${
              mode === 'client'
                ? 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-700'
                : 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500 font-bold'
            }`}
          >
            <SwitchCamera className="w-4 h-4" />
            <span className="hidden sm:inline">{mode === 'client' ? 'IR PRO' : 'CLIENTE'}</span>
          </button>
        </div>
      </header>

      {/* Sub-bar: Quick Role Inspector for Developer Testing */}
      <div className="relative z-20 bg-zinc-950/80 border-b border-zinc-850 px-6 py-2 flex items-center justify-between text-[10px] font-mono text-zinc-400 overflow-x-auto gap-2">
        <span className="text-zinc-500 uppercase tracking-wider shrink-0">TESTAR PERFIS:</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {(['client_pf', 'client_pj', 'provider_pf', 'provider_pj'] as UserRole[]).map(r => (
            <button
              key={r}
              onClick={() => handleRoleSelect(r)}
              className={`px-2 py-0.5 rounded border transition-all ${
                currentRole === r
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {r === 'client_pf' && 'PF'}
              {r === 'client_pj' && 'PJ (Business)'}
              {r === 'provider_pf' && 'PRO (PF)'}
              {r === 'provider_pj' && 'PRO (PJ)'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Cockpit Content Area */}
      <main className="relative z-20 flex-1 overflow-y-auto px-6 py-6 max-w-4xl mx-auto w-full">
        {/* Tactical Search Bar (Available in Client Mode) */}
        {mode === 'client' && (
          <div className="relative mb-6">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Pesquisar serviços, certificações ou categorias..."
                className="w-full bg-[#111116]/90 border border-zinc-800 focus:border-yellow-500/50 rounded-xl pl-11 pr-10 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Overlay */}
            {searchQuery && (
              <div className="mt-3 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl space-y-3 animate-fade-in max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-850">
                  <span>RESULTADOS ENCONTRADOS: {searchResults.length}</span>
                  <span>SETOR: {currentRegion}</span>
                </div>
                {searchResults.length === 0 ? (
                  <p className="text-zinc-500 text-xs font-mono text-center py-4">Nenhum protocolo compatível localizado.</p>
                ) : (
                  searchResults.map(({ srv, cat }) => (
                    <ServiceCard
                      key={srv.id}
                      srv={srv}
                      region={currentRegion}
                      onRequest={handleRequestService}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* CLIENT MODE */}
        {/* ============================================================ */}
        {mode === 'client' && !searchQuery && (
          <div className="space-y-6">
            {/* VIEW 1: SELECT OPERATION MODE */}
            {viewState === 'MODES' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase block mb-1">
                      BEM-VINDO, LUCAS SILVA
                    </span>
                    <h1 className="text-3xl font-light text-white tracking-tight leading-tight">
                      Como deseja ser<br />
                      <strong className="font-bold text-white">atendido hoje?</strong>
                    </h1>
                  </div>

                  {isBusiness && (
                    <div className="bg-yellow-500 text-black px-4 py-2.5 rounded-xl font-mono shadow-lg shrink-0">
                      <span className="text-[9px] font-black uppercase tracking-wider block opacity-75">
                        SALDO CORPORATIVO IRVO COIN
                      </span>
                      <span className="text-base font-bold tracking-tight">{creditBalance}</span>
                    </div>
                  )}
                </div>

                {/* Modes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {(Object.keys(MODES) as OperationMode[]).map(key => {
                    const m = MODES[key];
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleModeSelect(m.id)}
                        className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-white/40 transition-all text-left flex flex-col justify-between group shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div 
                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: m.bg, border: `1px solid ${m.border}` }}
                          >
                            <span className="text-xs font-mono font-bold" style={{ color: m.color }}>
                              {m.id.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>

                        <div>
                          <h3 className="text-white font-bold text-sm tracking-wide mb-1 font-mono">
                            {m.label}
                          </h3>
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            {m.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Tactical Shield Banner */}
                <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-yellow-500" />
                    <span>PROTOCOLOS COM VALIDAÇÃO BIOMÉTRICA & SEGURO R$ 50K POR MISSÃO</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 hidden sm:inline">SETOR: {currentRegion}</span>
                </div>
              </div>
            )}

            {/* VIEW 2: SELECT CATEGORY */}
            {viewState === 'CATS' && selectedMode && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-0.5">
                      CATÁLOGO FILTRADO POR MODO
                    </span>
                    <h2 className="text-xl font-bold font-mono text-white tracking-wide">
                      {MODES[selectedMode].label}
                    </h2>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-2.5 py-1 rounded text-[10px] font-mono font-bold">
                    RADAR GEOPOLÍTICO: {currentRegion}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-16">
                  {sortedCategories
                    .filter(cat => cat.services.some(s => s.modes.includes(selectedMode)))
                    .map(cat => {
                      const Icon = cat.icon;
                      const validCount = cat.services.filter(s => s.modes.includes(selectedMode)).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCatSelect(cat)}
                          className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-yellow-500/50 transition-all flex items-center justify-between text-left group shadow-md"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-yellow-500 transition-colors">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-white font-semibold text-sm tracking-wide block">
                                {cat.label}
                              </span>
                              <span className="text-zinc-500 font-mono text-[10px]">
                                {validCount} {validCount === 1 ? 'SERVIÇO DISPONÍVEL' : 'SERVIÇOS DISPONÍVEIS'}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* VIEW 3: SERVICES LIST */}
            {viewState === 'SERVS' && selectedCategory && selectedMode && (
              <div className="space-y-6 animate-fade-in pb-16">
                <div className="border-b border-zinc-800 pb-3">
                  <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest block mb-0.5">
                    {selectedCategory.label}
                  </span>
                  <h2 className="text-xl font-light text-white">
                    Selecione o Serviço Especializado
                  </h2>
                </div>

                <div className="space-y-4">
                  {selectedCategory.services
                    .filter(s => s.modes.includes(selectedMode))
                    .map(srv => (
                      <ServiceCard
                        key={srv.id}
                        srv={srv}
                        region={currentRegion}
                        onRequest={handleRequestService}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* PROVIDER PRO MODE */}
        {/* ============================================================ */}
        {mode === 'provider' && (
          <div className="space-y-6 animate-fade-in pb-16">
            {/* Operational Status Card */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase">
                STATUS OPERACIONAL
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
                <span className={`font-mono text-xs font-bold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isOnline ? 'DISPONÍVEL NO RADAR' : 'INDISPONÍVEL'}
                </span>
              </div>
            </div>

            {/* Big Action Toggle */}
            <button
              onClick={() => {
                sound.playClick(isOnline ? 400 : 900);
                setIsOnline(!isOnline);
              }}
              className={`w-full py-6 rounded-2xl border-2 font-mono font-black text-xl tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center gap-3 ${
                isOnline
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'border-red-500/60 bg-red-500/10 text-red-400 hover:bg-red-500/20'
              }`}
            >
              <Radio className={`w-6 h-6 ${isOnline ? 'animate-pulse' : ''}`} />
              <span>{isOnline ? 'FICAR OFFLINE' : 'FICAR ONLINE'}</span>
            </button>

            {/* Financial Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
                <DollarSign className="w-6 h-6 text-yellow-500 mb-2" />
                <div>
                  <span className="text-2xl font-black text-yellow-500 font-mono tracking-tight block">
                    R$ {providerEarnings.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    GANHOS (24H)
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col justify-between">
                <Bell className="w-6 h-6 text-white mb-2" />
                <div>
                  <span className="text-2xl font-black text-white font-mono tracking-tight block">
                    {isOnline ? '2' : '0'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    PEDIDOS EM ABERTO
                  </span>
                </div>
              </div>
            </div>

            {/* Active Certifications */}
            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-3">
                CERTIFICAÇÕES TÁTICAS VINCULADAS
              </span>
              <div className="flex flex-wrap gap-2">
                {['BIOSSEGURANÇA', 'CREA CIVIL', 'ANAC DRONE', 'CISSP SECURITY', 'GEB/DEIC'].map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-white"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Nearby Opportunity when Online */}
            {isOnline && (
              <div className="p-5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-mono font-bold text-yellow-400">NOVA DEMANDA DETECTADA</span>
                  </div>
                  <span className="text-[10px] font-mono text-yellow-500">2.1 km de distância</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Integridade Estrutural (CREA)</h4>
                  <p className="text-zinc-400 text-xs mt-0.5">Vila Olímpia, São Paulo - R$ 450,00</p>
                </div>
                <button
                  onClick={() => {
                    sound.playDispatch();
                    setProviderEarnings(prev => prev + 450);
                    alert("Demanda aceita! Rota segura gerada no terminal.");
                  }}
                  className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-bold text-xs rounded-xl tracking-wider uppercase transition-all"
                >
                  ACEITAR DEMANDA TÁTICA
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* KYC Security Modal */}
      <KYCModal
        visible={showKYC}
        onClose={() => setShowKYC(false)}
        onVerified={() => {
          setShowKYC(false);
          setProviderStatus('verified');
          setMode('provider');
        }}
      />

      {/* Mission Tracker Modal */}
      <MissionTrackerModal
        mission={activeMission}
        onClose={() => setActiveMission(null)}
      />

      {/* Reactor Telemetry Modal */}
      <ReactorModal
        visible={showReactor}
        onClose={() => setShowReactor(false)}
        region={currentRegion}
      />
    </div>
  );
};
