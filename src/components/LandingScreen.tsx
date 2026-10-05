import React, { useState, useRef } from 'react';
import { 
  User, Sparkles, Briefcase, ChevronLeft, ArrowRight, Lock, 
  Smartphone, Fingerprint, ScanFace, Mail, Check, Building, Key, ShieldCheck, Calendar, Search, Eye, EyeOff
} from 'lucide-react';
import { UserRole } from '../types';
import { THEME, LEGAL_DOCS } from '../constants/data';
import { RadarBackground } from './RadarBackground';
import { sound } from '../utils/audio';

interface LandingScreenProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onLoginSuccess }) => {
  const [navLevel, setNavLevel] = useState<'root' | 'sub_hire' | 'sub_work' | 'form'>('root');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [formData, setFormData] = useState({
    name: '', document: '', phone: '', birthDate: '', password: '', confirmPassword: '', token: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authStep, setAuthStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Mask helpers
  const maskPhone = (val: string) => {
    let v = val.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 10) return v.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    if (v.length > 6) return v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    if (v.length > 2) return v.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2");
    return v ? `(${v}` : "";
  };

  const maskDate = (v: string) => {
    return v.replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .substring(0, 10);
  };

  const maskCPF = (v: string) => {
    return v.replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .substring(0, 14);
  };

  const maskCNPJ = (v: string) => {
    return v.replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  const isAdult = (dateStr: string) => {
    if (dateStr.length !== 10) return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return false;
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const updateForm = (key: string, value: string) => {
    let formatted = value;
    if (key === 'phone') formatted = maskPhone(value);
    if (key === 'birthDate') formatted = maskDate(value);
    if (key === 'document') {
      if (selectedRole?.includes('pj')) formatted = maskCNPJ(value);
      else formatted = maskCPF(value);
    }
    setFormData(prev => ({ ...prev, [key]: formatted }));
  };

  const handleSelectRole = (role: UserRole) => {
    sound.playClick(750);
    setSelectedRole(role);
    setAuthMode('login');
    setAuthStep(1);
    setNavLevel('form');
  };

  const handleBack = () => {
    sound.playClick(400);
    if (authStep > 1) {
      setAuthStep(authStep - 1);
      return;
    }
    if (navLevel === 'form') {
      const isClient = selectedRole?.startsWith('client');
      setNavLevel(isClient ? 'sub_hire' : 'sub_work');
      setSelectedRole(null);
      setAuthStep(1);
      return;
    }
    if (navLevel === 'sub_hire' || navLevel === 'sub_work') {
      setNavLevel('root');
    }
  };

  const checkValidity = () => {
    if (authMode === 'login') return true;
    const { name, document, phone, birthDate } = formData;
    const isPj = selectedRole?.includes('pj');
    const isAdultValid = birthDate.length === 10 && isAdult(birthDate);
    const okName = name.trim().length >= 3;
    const okDoc = document.replace(/\D/g, '').length >= (isPj ? 14 : 11);
    const okPhone = phone.replace(/\D/g, '').length >= 10;

    if (selectedRole === 'client_pf') return okName && isAdultValid && okPhone;
    if (selectedRole === 'client_pj') return okDoc && okPhone;
    if (selectedRole === 'provider_pf') return okName && okDoc && isAdultValid && okPhone;
    if (selectedRole === 'provider_pj') return okDoc && okPhone;
    return false;
  };

  const handleNextStep = () => {
    if (!checkValidity() && authMode === 'register') {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    sound.playClick(800);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (authMode === 'login') {
        if (formData.password.length < 3) {
          alert("Senha deve ter no mínimo 3 caracteres.");
          return;
        }
        sound.playDispatch();
        onLoginSuccess(selectedRole || 'client_pf');
      } else {
        if (authStep === 1) {
          sound.playRadarPing();
          setAuthStep(2);
        } else if (authStep === 2) {
          if (formData.token.replace(/\D/g, '').length < 4) {
            alert("Token inválido. Digite ao menos 4 dígitos para teste.");
            return;
          }
          sound.playRadarPing();
          setAuthStep(3);
        } else if (authStep === 3) {
          if (formData.password.length < 4) {
            alert("A senha deve ter no mínimo 4 caracteres.");
            return;
          }
          if (formData.password !== formData.confirmPassword) {
            alert("As senhas informadas não coincidem.");
            return;
          }
          setShowTermsModal(true);
        }
      }
    }, 700);
  };

  const handleSocialLogin = () => {
    sound.playClick(900);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      sound.playDispatch();
      onLoginSuccess(selectedRole || 'client_pf');
    }, 1000);
  };

  const config = {
    client_pf: { title: 'CONTRATANTE PESSOAL', color: 'text-white', border: 'border-white', bg: 'bg-white' },
    client_pj: { title: 'IRVO BUSINESS', color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500' },
    provider_pf: { title: 'PRESTADOR AUTÔNOMO', color: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-500' },
    provider_pj: { title: 'BUSINESS PARCEIRO', color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500' },
  };

  const currentTheme = selectedRole ? config[selectedRole] : config.client_pf;

  return (
    <div className="relative min-h-screen w-full bg-[#09090b] text-white flex flex-col justify-between overflow-hidden select-none">
      <RadarBackground />

      {/* Top Header */}
      <header className="relative z-10 pt-10 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-black tracking-tighter text-white">IRVO.</h1>
        <div className={`mt-2 flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest ${
          navLevel === 'root' ? 'border-white/10 bg-white/5 text-zinc-400' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${navLevel === 'root' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
          <span>{navLevel === 'root' ? 'SISTEMA OPERACIONAL' : 'TERMINAL SEGURO'}</span>
        </div>
      </header>

      {/* Bottom Sheet Card */}
      <main className="relative z-20 w-full max-w-lg mx-auto bg-[#131317]/95 backdrop-blur-xl border-t border-x border-white/10 rounded-t-[36px] p-6 shadow-2xl transition-all duration-500 mt-auto">
        <div className="w-10 h-1 bg-zinc-700/80 rounded-full mx-auto mb-6" />

        {/* 1. ROOT VIEW */}
        {navLevel === 'root' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-center font-mono font-bold text-sm tracking-widest text-zinc-300 uppercase mb-2">
              O QUE VOCÊ DESEJA?
            </h2>

            {/* Macro Button: CONTRATAR */}
            <button
              onClick={() => {
                sound.playClick(600);
                setNavLevel('sub_hire');
              }}
              className="w-full p-4 rounded-2xl bg-zinc-900/80 border border-white/20 hover:border-white transition-all flex items-center gap-4 text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-black shrink-0">
                <Search className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <span className="text-white font-black text-base tracking-wide block">CONTRATAR SERVIÇOS</span>
                <span className="text-zinc-400 text-xs block">Para mim ou minha empresa</span>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>

            {/* Macro Button: PRESTAR */}
            <button
              onClick={() => {
                sound.playClick(600);
                setNavLevel('sub_work');
              }}
              className="w-full p-4 rounded-2xl bg-zinc-900/80 border border-emerald-500/40 hover:border-emerald-500 transition-all flex items-center gap-4 text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-black shrink-0">
                <Briefcase className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex-1">
                <span className="text-white font-black text-base tracking-wide block">PRESTAR SERVIÇOS</span>
                <span className="text-zinc-400 text-xs block">Sou profissional ou empresa parceira</span>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>

            <div className="text-center pt-4">
              <span className="text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
                IRVO INC. GLOBAL © 2026
              </span>
            </div>
          </div>
        )}

        {/* 2. SUB-HIRE VIEW */}
        {navLevel === 'sub_hire' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-mono font-bold text-sm tracking-widest text-white uppercase">
                QUAL O SEU PERFIL?
              </h2>
            </div>

            <button
              onClick={() => handleSelectRole('client_pf')}
              className="w-full p-4 rounded-2xl bg-white text-black font-bold flex items-center gap-3 hover:bg-zinc-200 transition-all"
            >
              <User className="w-5 h-5" />
              <span className="text-sm tracking-wider uppercase">PARA MIM (PF)</span>
            </button>

            <button
              onClick={() => handleSelectRole('client_pj')}
              className="w-full p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 text-left hover:bg-yellow-500/20 transition-all flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <span className="text-yellow-400 font-bold text-sm tracking-wider block">IRVO BUSINESS (PJ)</span>
                <span className="text-yellow-500/80 text-[11px] block">Bônus de 10% + Gestão de Equipe Corporativa</span>
              </div>
            </button>
          </div>
        )}

        {/* 3. SUB-WORK VIEW */}
        {navLevel === 'sub_work' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-mono font-bold text-sm tracking-widest text-white uppercase">
                COMO VAI ATUAR?
              </h2>
            </div>

            <button
              onClick={() => handleSelectRole('provider_pf')}
              className="w-full p-4 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold flex items-center gap-3 hover:bg-emerald-500/20 transition-all"
            >
              <User className="w-5 h-5" />
              <span className="text-sm tracking-wider uppercase">SOU AUTÔNOMO (PF)</span>
            </button>

            <button
              onClick={() => handleSelectRole('provider_pj')}
              className="w-full p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/40 text-left hover:bg-yellow-500/20 transition-all flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <span className="text-yellow-400 font-bold text-sm tracking-wider block">IRVO BUSINESS (PARCEIRO)</span>
                <span className="text-yellow-500/80 text-[11px] block">Disponibilizar minha equipe técnica cadastrada</span>
              </div>
            </button>
          </div>
        )}

        {/* 4. FORM VIEW */}
        {navLevel === 'form' && (
          <div className="animate-fade-in max-h-[75vh] overflow-y-auto pr-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <span className={`font-mono font-bold text-xs tracking-widest uppercase block ${currentTheme.color}`}>
                  {authStep === 1 ? currentTheme.title : authStep === 2 ? 'VALIDAÇÃO TÁTICA' : 'BLINDAGEM DE SENHA'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">ETAPA {authStep} DE 3</span>
              </div>
            </div>

            {/* STEP 1: CREDENTIALS */}
            {authStep === 1 && (
              <div>
                {/* Toggle Login vs Register */}
                <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 mb-4">
                  <button
                    onClick={() => {
                      sound.playClick(500);
                      setAuthMode('login');
                    }}
                    className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                      authMode === 'login' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    ENTRAR
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick(500);
                      setAuthMode('register');
                    }}
                    className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                      authMode === 'register' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    CRIAR CONTA
                  </button>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={handleSocialLogin}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-200"
                  >
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span>GOOGLE</span>
                  </button>
                  <button
                    onClick={handleSocialLogin}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-200"
                  >
                    <ScanFace className="w-4 h-4 text-zinc-400" />
                    <span>APPLE</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 my-4">
                  <div className="h-[1px] bg-zinc-800 flex-1" />
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider">OU VIA CREDENCIAIS</span>
                  <div className="h-[1px] bg-zinc-800 flex-1" />
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  {selectedRole?.includes('pf') && authMode === 'register' && (
                    <>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">NOME COMPLETO</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => updateForm('name', e.target.value)}
                          placeholder="Ex: Lucas Silva"
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all"
                        />
                      </div>

                      {selectedRole === 'provider_pf' && (
                        <div>
                          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">CPF DO PRESTADOR</label>
                          <input
                            type="text"
                            value={formData.document}
                            onChange={e => updateForm('document', e.target.value)}
                            placeholder="000.000.000-00"
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">DATA DE NASCIMENTO</label>
                        <input
                          type="text"
                          value={formData.birthDate}
                          onChange={e => updateForm('birthDate', e.target.value)}
                          placeholder="DD/MM/AAAA"
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                        />
                        {formData.birthDate.length === 10 && !isAdult(formData.birthDate) && (
                          <span className="text-[10px] text-red-500 mt-1 block">
                            * Proibido cadastro para menores de 18 anos.
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {selectedRole?.includes('pj') && (
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">CNPJ DA EMPRESA</label>
                      <input
                        type="text"
                        value={formData.document}
                        onChange={e => updateForm('document', e.target.value)}
                        placeholder="00.000.000/0001-00"
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                      />
                    </div>
                  )}

                  {authMode === 'register' && (
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">CELULAR (PARA TOKEN SMS)</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={e => updateForm('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                      />
                    </div>
                  )}

                  {authMode === 'login' && (
                    <>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                          {selectedRole?.includes('pj') ? 'CNPJ' : selectedRole === 'client_pf' ? 'CELULAR' : 'CPF'}
                        </label>
                        <input
                          type="text"
                          value={selectedRole?.includes('pj') ? formData.document : selectedRole === 'client_pf' ? formData.phone : formData.document}
                          onChange={e => updateForm(selectedRole?.includes('pj') ? 'document' : selectedRole === 'client_pf' ? 'phone' : 'document', e.target.value)}
                          placeholder="..."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">SENHA</label>
                          <button
                            type="button"
                            onClick={() => alert("Para recuperação tática de acesso, contate o Cérebro Suporte.")}
                            className="text-[10px] font-mono text-yellow-500 font-bold hover:underline"
                          >
                            ESQUECI A SENHA
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={e => updateForm('password', e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all font-mono pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className={`w-full mt-6 py-3.5 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                    currentTheme.bg
                  } text-black hover:opacity-90 active:scale-[0.99]`}
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>{authMode === 'login' ? 'ACESSAR CONTA' : 'SOLICITAR TOKEN'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STEP 2: TOKEN */}
            {authStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-yellow-500 shrink-0" />
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    Token de segurança enviado para o celular {formData.phone || 'cadastrado'}.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                    CÓDIGO DE 6 DÍGITOS
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.token}
                    onChange={e => updateForm('token', e.target.value)}
                    placeholder="000000"
                    className="w-full text-center tracking-[0.5em] text-xl font-mono bg-zinc-900 border border-zinc-800 rounded-xl py-3 text-white focus:outline-none focus:border-white transition-all"
                  />
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                    currentTheme.bg
                  } text-black hover:opacity-90 active:scale-[0.99]`}
                >
                  <span>VALIDAR TOKEN</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 3: BLINDAGEM DE SENHA */}
            {authStep === 3 && (
              <div className="space-y-4">
                <p className="text-zinc-400 text-xs">Defina sua senha mestra de acesso criptografado.</p>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">CRIAR SENHA</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => updateForm('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">CONFIRMAR SENHA</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => updateForm('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all font-mono"
                  />
                </div>

                <button
                  onClick={handleNextStep}
                  className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                    currentTheme.bg
                  } text-black hover:opacity-90 active:scale-[0.99]`}
                >
                  <span>FINALIZAR CADASTRO</span>
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Legal Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#111116] border border-zinc-700 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[80vh]">
            <h3 className="text-white font-bold text-base mb-3 font-mono tracking-wider">
              PROTOCOLO DE ADESÃO & TERMOS JURÍDICOS
            </h3>
            <div className="flex-1 overflow-y-auto text-xs text-zinc-400 font-mono leading-relaxed pr-2 space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <pre className="whitespace-pre-wrap font-sans text-xs">
                {selectedRole?.includes('client') ? LEGAL_DOCS.TERMS_CLIENT : LEGAL_DOCS.TERMS_PROVIDER}
                {'\n\n'}
                {LEGAL_DOCS.PRIVACY}
              </pre>
            </div>
            <button
              onClick={() => {
                setShowTermsModal(false);
                sound.playDispatch();
                onLoginSuccess(selectedRole || 'client_pf');
              }}
              className="mt-4 w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs rounded-xl tracking-widest uppercase transition-all shadow-lg"
            >
              LI E ACEITO OS TERMOS SOBERANOS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
