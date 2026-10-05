import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Animated, Easing, TextInput, KeyboardAvoidingView, Platform, Modal, ScrollView, ActivityIndicator, Alert, BackHandler, Keyboard, TouchableWithoutFeedback, Image, Vibration, SafeAreaView
} from 'react-native';
import { 
  User, Sparkles, Briefcase, ChevronLeft, ArrowRight, Lock, 
  Smartphone, Fingerprint, ScanFace, Mail, Check, Building, X, Key, ShieldCheck, Calendar, Briefcase as WorkIcon, Search, Eye, EyeOff, MapPin, Menu, Bell, DollarSign, SwitchCamera, Navigation, Camera, FileText,
  // --- ICONES TATICOS & ESFERAS (FASE 6 - OMEGA TOTALITY) ---
  Activity, Wifi, Battery, Crosshair, Power, Zap, Layers, Home, Video, GraduationCap, Scissors, Star, ChevronRight, CheckCircle, Database, Shield, Hammer, HeartPulse, Globe, Server, Cpu, HardHat, Stethoscope, Plane, Code, Leaf, Coins, Anchor, Droplets, Flame, Signal, Eye as EyeIcon, Wine, Brain, Truck, Ship, Mountain, ChevronDown, Lock as LockIcon, Unlock, FileBadge
} from 'lucide-react-native';


const { width, height } = Dimensions.get('window');


// ============================================================================
// 1. CONFIGURAÇÕES VISUAIS & DADOS (BASE PRESERVADA)
// ============================================================================


const THEME = {
  bg: '#09090b',
  zinc900: '#18181b',
  zinc800: '#27272a',
  zinc700: '#3f3f46',
  text: '#ffffff',
  textDim: '#71717a',
  gold: '#eab308',
  white: '#ffffff',
  green: '#22c55e',
  red: '#ef4444',
  blue: '#3b82f6', 
  inputBg: '#1e1e1e',
  border: 'rgba(255, 255, 255, 0.1)',
};


const SLOGANS = [
  "Conectando serviços a pessoas",
  "Connecting services to people",
  "Relier les services aux personnes",
  "Verbindet Dienste mit Menschen",
  "サービスと人々をつなぐ"
];


// DOCUMENTAÇÃO JURÍDICA COMPLETA (SEM RESUMOS)
const LEGAL_DOCS = {
  TERMS_CLIENT: `TERMOS DE CONTRATAÇÃO - IRVO INC.


1. MODALIDADES DE CONTRATAÇÃO
A Irvo permite a contratação de serviços por Pessoas Físicas (PF) e Jurídicas (PJ/Business).


2. IRVO BUSINESS (PJ) & CRÉDITOS
2.1. Natureza dos Créditos: A modalidade Business opera via "Irvo Coin". Os valores depositados constituem compra antecipada de créditos de uso (Utility Tokens) para consumo exclusivo na plataforma, não configurando depósito bancário ou investimento.
2.2. Bônus por Volume: Depósitos acima de R$ 1.000,00 podem gerar bônus em créditos promocionais (ex: 10%), não resgatáveis em dinheiro.
2.3. Gestão de Equipe: A empresa titular é solidariamente responsável por todas as solicitações de serviços realizadas pelos funcionários autorizados (Rede Corporativa).


3. PAGAMENTOS
O pagamento é processado via gateway parceiro. A Irvo emite nota fiscal apenas sobre a taxa de intermediação tecnológica.`,


  TERMS_PROVIDER: `TERMOS DE PRESTAÇÃO - IRVO INC.


1. RELAÇÃO DE TRABALHO
1.1. Prestador Autônomo (PF): Atua sem vínculo empregatício, com total autonomia de horários e recusa de serviços.
1.2. Empresa Parceira (PJ): Ao cadastrar sua empresa para prestar serviços (ex: T.I., Limpeza), VOCÊ declara que os profissionais enviados possuem vínculo formal (CLT ou Societário) com a SUA empresa. A Irvo isenta-se de qualquer responsabilidade trabalhista perante a equipe da Parceira PJ.


2. SEGURANÇA E QUALIDADE
Todos os prestadores (PF ou equipe PJ) estão sujeitos a verificação de antecedentes e biometria para segurança dos clientes.`,


  PRIVACY: `POLÍTICA DE PRIVACIDADE E DADOS (LGPD)
Coletamos dados de identificação, fiscais (CPF/CNPJ) e biométricos para validação de segurança e prevenção a fraudes. Seus dados não são vendidos a terceiros.`
};


// ============================================================================
// 2. CÉREBRO SOBERANO (DATA_STORE MASSIVO - PARTE A)
// ============================================================================


// GEOPOLÍTICA DE PREÇOS (BASE 2026)
const REGIONAL_MULTIPLIERS = {
  SP: 1.5,   // Cidadela (Vila Olímpia/Itaim)
  RJ: 1.4,   // Alerta Máximo (Zona Sul)
  BSB: 1.45, // Eixo de Poder (Lago Sul)
  NE: 1.8,   // Sazonal Elite (Trancoso/Maceió)
  SUL: 1.2,  // Polo Tecnológico/Agro Civil
  CO: 1.4,   // Agro Power (Goiânia/Cuiabá)
  NO: 1.3,   // Fronteira Logística (AM/PA)
  OTHER: 0.8 // Deflator Regional
};


// MODOS DE OPERAÇÃO
const MODES = {
  HOME: { id: 'home', label: 'DELIVERY (EM CASA)', icon: Home, desc: 'O profissional vai até sua residência.', color: '#60a5fa', bg: 'rgba(30, 58, 138, 0.2)', border: '#1e3a8a' },
  SITE: { id: 'site', label: 'LOCAL (IR AO LOCAL)', icon: MapPin, desc: 'Você se desloca até o estabelecimento.', color: '#c084fc', bg: 'rgba(88, 28, 135, 0.2)', border: '#581c87' },
  ONLINE: { id: 'online', label: 'REMOTO (ONLINE)', icon: Video, desc: 'Atendimento via link seguro criptografado.', color: '#34d399', bg: 'rgba(6, 78, 59, 0.2)', border: '#064e3b' }
};


// NÍVEIS DE SERVIÇO (TIERS)
const TIERS = {
  STANDARD: { id: 'standard', label: 'STANDARD', multiplier: 1.0, desc: 'Profissional verificado. Protocolo padrão.', color: '#a1a1aa', borderColor: '#27272a' },
  PLUS: { id: 'plus', label: 'PLUS', multiplier: 1.25, desc: 'Alta avaliação (4.8+). Prioridade de agenda.', color: '#ffffff', borderColor: '#ffffff' },
  PRIME: { id: 'prime', label: 'PRIME ELITE', multiplier: 1.6, desc: 'Seguro R$ 50k + Curadoria Manual + NDA.', color: '#eab308', borderColor: '#eab308' }
};


// DATA STORE PARTE A (CORE URBANO)
const DATA_STORE_CORE = {
  CARE_AESTHETICS: {
    id: 'CARE_AESTHETICS',
    label: 'CUIDADOS & ESTÉTICA',
    icon: Scissors,
    services: [
      { 
        id: 'SRV_NAIL_ARCH', name: 'Arquitetura Ungueal (Manicure)', basePrice: 120, unit: 'SESSÃO', modes: ['home', 'site'], 
        certifications: ['BIOSSEGURANÇA'], checklist: ['Desinfecção Tática (Autoclave)', 'Triagem de Estilo & Saúde', 'Execução Técnica de Precisão', 'Selagem de Proteção'] 
      },
      { 
        id: 'SRV_HAIR_ENG', name: 'Engenharia Capilar', basePrice: 350, unit: 'CORTE', modes: ['home', 'site'], 
        certifications: ['TRICOLOGIA'], checklist: ['Diagnóstico Tricológico', 'Blindagem Química (Plex)', 'Corte de Aço Japonês', 'Finalização pH Controlado'] 
      },
      { 
        id: 'SRV_FACE_CALIB', name: 'Calibração Facial (Barber)', basePrice: 250, unit: 'SESSÃO', modes: ['home', 'site'], 
        certifications: ['BARBER ELITE'], checklist: ['Preparação Térmica (Ozônio)', 'Lâmina Inviolada (Selo)', 'Hemostasia Tática', 'Crio-Finalização'] 
      },
      {
        id: 'SRV_MAKEUP_TAC', name: 'Maquiagem de Alta Resistência', basePrice: 400, unit: 'FACE', modes: ['home', 'site'],
        certifications: ['COLORIMETRIA'], checklist: ['Primer de Blindagem', 'Colorimetria Avançada', 'Fixação 24h (Spray)', 'Cílios de Seda']
      }
    ]
  },
  TECH_DEV: {
    id: 'TECH_DEV',
    label: 'TECNOLOGIA & DESENV.',
    icon: Code,
    services: [
      { 
        id: 'SRV_CODE_SOV', name: 'Soberania de Código (Full-Stack)', basePrice: 300, unit: 'HORA', modes: ['online'], 
        certifications: ['AWS ARCHITECT'], checklist: ['Ambiente Docker Seguro', 'Git Semântico', 'Documentação Brutalista', 'Transferência via PGP'] 
      },
      { 
        id: 'SRV_CYBER_FORT', name: 'Fortaleza Digital (Cybersec)', basePrice: 4500, unit: 'PROJETO', modes: ['online', 'site'], 
        certifications: ['CISSP'], checklist: ['Segmentação VLAN', 'Hardening de Firewall', 'Análise de Tráfego', 'Relatório Zero-Trust'] 
      },
      { 
        id: 'SRV_DATA_MINING', name: 'Mineração de Inteligência', basePrice: 5000, unit: 'SPRINT', modes: ['online'], 
        certifications: ['DATA SCIENCE PRO'], checklist: ['Sanitização de Dados', 'Anonimização PII', 'Modelagem Preditiva', 'Visualização Tática'] 
      },
      {
        id: 'SRV_SYS_ADMIN', name: 'Suporte Tático de Infra', basePrice: 250, unit: 'HORA', modes: ['online', 'site'],
        certifications: ['LINUX LPI'], checklist: ['Auditoria de Logs', 'Patch Management', 'Recuperação de Desastre', 'Otimização de Kernel']
      }
    ]
  },
  INFRA_MAINT: {
    id: 'INFRA_MAINT',
    label: 'INFRA & MANUTENÇÃO',
    icon: Hammer,
    services: [
      { 
        id: 'SRV_HVAC_CTRL', name: 'Controle Atmosférico (HVAC)', basePrice: 350, unit: 'UNIDADE', modes: ['site'], 
        certifications: ['PMOC ANVISA'], checklist: ['Análise de Filtros', 'Esterilização UV-C', 'Teste de Legionella', 'Torqueamento Elétrico'] 
      },
      { 
        id: 'SRV_STRUC_INT', name: 'Integridade Estrutural', basePrice: 150, unit: 'M²', modes: ['site'], 
        certifications: ['CREA CIVIL'], checklist: ['Remoção Detritos', 'Neutralização Química', 'Auditoria Termográfica', 'Acabamento Fino'] 
      },
      { 
        id: 'SRV_CROP_GUARANTY', name: 'Garantia de Colheita (Agro)', basePrice: 400, unit: 'HORA', modes: ['site'], 
        certifications: ['JOHN DEERE'], checklist: ['Análise de Fluidos', 'Filtragem de Combustível', 'Arrefecimento Radiador', 'Lubrificação de Pivôs'] 
      },
      {
        id: 'SRV_ELEC_GRID', name: 'Rede Elétrica Industrial', basePrice: 280, unit: 'HORA', modes: ['site'],
        certifications: ['NR-10'], checklist: ['Balanceamento de Fases', 'Teste de Aterramento', 'Termografia de Quadros', 'Certificação NR-10']
      }
    ]
  },
  EDU_CONSULT: {
    id: 'EDU_CONSULT',
    label: 'EDUCAÇÃO & CONSULTORIA',
    icon: GraduationCap,
    services: [
      { 
        id: 'SRV_LANG_SUP', name: 'Supremacia Linguística', basePrice: 250, unit: 'HORA', modes: ['online', 'home', 'site'], 
        certifications: ['CEFRL C2'], checklist: ['Avaliação CEFRL', 'Vocabulário Tático', 'Imersão Cultural', 'Simulação de Negociação'] 
      },
      { 
        id: 'SRV_ASSET_ARCH', name: 'Arquitetura de Ativos', basePrice: 15000, unit: 'PROJETO', modes: ['online', 'site'], 
        certifications: ['CFA'], checklist: ['Inventário Patrimonial', 'Modelagem de Risco', 'Due Diligence', 'Implementação Holding'] 
      },
      {
        id: 'SRV_CRYPTO_SUC', name: 'Cripto-Sucessão', basePrice: 8000, unit: 'CONSULTA', modes: ['site', 'online'],
        certifications: ['BLOCKCHAIN'], checklist: ['Configuração Multisig', 'Herança Digital', 'Auditoria de Wallets', 'Treinamento OpSec']
      }
    ]
  }
};
// --- DATA STORE PARTE B: EXPANSÃO OMEGA (ELITE & INFRAESTRUTURA PESADA) ---
const DATA_STORE_OMEGA = {
  // 5. SAÚDE & BIO-OTIMIZAÇÃO (REBOOT BIOLÓGICO)
  BIO_OPT: {
    id: 'BIO_OPT',
    label: 'SAÚDE & BIO-OTIMIZAÇÃO',
    icon: Stethoscope,
    services: [
      { 
        id: 'SRV_NAD_PROTO', 
        name: 'Protocolo NAD+ (Mitocondrial)', 
        basePrice: 3500, 
        unit: 'SESSÃO', 
        modes: ['home'], 
        certifications: ['COREN/CRM', 'SUPORTE AVANÇADO'],
        checklist: ['Cadeia de Frio (2-8°C) Garantida', 'Mapeamento Venoso NIR', 'Infusão Controlada (Bomba)', 'Telemetria Vital Contínua'] 
      },
      { 
        id: 'SRV_OXY_PRESS', 
        name: 'Saturação Pressurizada (HBOT)', 
        basePrice: 1200, 
        unit: 'SESSÃO', 
        modes: ['home'], 
        certifications: ['OPERADOR HIPERBÁRICO'],
        checklist: ['Pressurização 1.5 ATA Controlada', 'Monitoramento Saturação O2', 'Protocolo Descompressão Gradual', 'Avaliação Pós-Dive'] 
      },
      { 
        id: 'SRV_META_CALIB', 
        name: 'Calibração Metabólica (Nutro)', 
        basePrice: 500, 
        unit: 'CONSULTA', 
        modes: ['online', 'home'], 
        certifications: ['CRN NUTROLOGIA', 'GENÉTICA'],
        checklist: ['Análise Bio-Dados (Exames)', 'Periodização Nutricional', 'Sourcing Biodinâmico', 'Ajuste de Macros em Tempo Real'] 
      },
      {
        id: 'SRV_SORO_IV',
        name: 'Soroterapia de Performance',
        basePrice: 800,
        unit: 'BAG',
        modes: ['home'],
        certifications: ['COREN ENFERMAGEM'],
        checklist: ['Anamnese Express', 'Blend Vitamínico Personalizado', 'Acesso Venoso Indolor', 'Monitoramento Pós-Infusão']
      }
    ]
  },


  // 6. TÁTICA & ELITE (DEFESA E ESTILO DE VIDA)
  TACTICAL_ELITE: {
    id: 'TACTICAL_ELITE',
    label: 'TÁTICA & ELITE',
    icon: Shield,
    services: [
      { 
        id: 'SRV_KINETIC_DEF', 
        name: 'Defesa Cinética (Segurança)', 
        basePrice: 2500, 
        unit: 'TURNO', 
        modes: ['site'], 
        certifications: ['GEB/DEIC', 'DIREÇÃO EVASIVA'],
        checklist: ['Planejamento de Rota Primária/Secundária', 'Verificação Veicular (Varredura)', 'Direção Evasiva Defensiva', 'Varredura Perímetro de Chegada'] 
      },
      { 
        id: 'SRV_TSCM_SWEEP', 
        name: 'Varredura TSCM (Anti-Grampo)', 
        basePrice: 5000, 
        unit: 'OPERAÇÃO', 
        modes: ['site', 'home'], 
        certifications: ['INTELIGENCE OFFICER', 'RF ENGINEER'],
        checklist: ['Análise de Espectro RF (10kHz-24GHz)', 'Detector de Junção Não-Linear (NLJD)', 'Termografia Tática FLIR', 'Selagem de Áreas Verificadas'] 
      },
      { 
        id: 'SRV_LIFESTYLE_ARCH', 
        name: 'Arquitetura de Estilo de Vida', 
        basePrice: 5000, 
        unit: 'MÊS', 
        modes: ['home', 'online'], 
        certifications: ['HOTELARIA DE LUXO', 'LOGÍSTICA'],
        checklist: ['Gestão de Acervo Pessoal', 'Logística de Viagem Complexa', 'Auditoria de Adega', 'Gestão de Agenda Blindada'] 
      },
      {
        id: 'SRV_CIGAR_SOMM',
        name: 'Sommelier de Charutos',
        basePrice: 1500,
        unit: 'EVENTO',
        modes: ['site', 'home'],
        certifications: ['HABANOS SOMMELIER'],
        checklist: ['Seleção de Vitolas Premium', 'Corte e Acendimento Ritualístico', 'Harmonização (Spirits/Coffee)', 'Gestão de Umidade do Humidor']
      },
      {
        id: 'SRV_ARMORED_TRANS',
        name: 'Transporte Executivo Blindado',
        basePrice: 450,
        unit: 'TRECHO',
        modes: ['site'],
        certifications: ['DIREÇÃO DEFENSIVA', 'CNH EAR'],
        checklist: ['Veículo Nível III-A Certificado', 'Motorista Tático Treinado', 'Rota Monitorada via Satélite', 'Kit Primeiros Socorros Tático']
      }
    ]
  },


  // 7. SAÚDE MENTAL & PERFORMANCE (ELITE MIND)
  MENTAL_ELITE: {
    id: 'MENTAL_ELITE',
    label: 'MENTAL & PERFORMANCE',
    icon: Brain,
    services: [
      {
        id: 'SRV_HIGH_PERF_PSY', 
        name: 'Psicologia de Alta Performance', 
        basePrice: 600, 
        unit: 'SESSÃO', 
        modes: ['online', 'site'],
        certifications: ['CRP', 'NEUROCIÊNCIA'],
        checklist: ['Análise de Bloqueios Cognitivos', 'Protocolo de Foco Profundo', 'Gestão de Estresse Agudo', 'De-briefing Operacional']
      },
      {
        id: 'SRV_SLEEP_ARCH', 
        name: 'Arquitetura do Sono', 
        basePrice: 2000, 
        unit: 'CONSULTA', 
        modes: ['home', 'online'],
        certifications: ['MEDICINA DO SONO'],
        checklist: ['Análise do Ambiente (Luz/Som)', 'Monitoramento de Ciclos Circadianos', 'Protocolo de Higiene do Sono', 'Suplementação Melatonérgica']
      },
      {
        id: 'SRV_BURNOUT_CRISIS', 
        name: 'Gestão de Crise (Burnout)', 
        basePrice: 800, 
        unit: 'SESSÃO', 
        modes: ['online', 'home'],
        certifications: ['TERAPIA COGNITIVA'],
        checklist: ['Intervenção Imediata', 'Recalibração de Agenda', 'Técnicas de Regulação Vagal', 'Plano de Retorno Gradual']
      }
    ]
  },


  // 8. LOGÍSTICA INDUSTRIAL (NORTE/FLUXO)
  LOGISTICS_IND: {
    id: 'LOGISTICS_IND',
    label: 'LOGÍSTICA INDUSTRIAL',
    icon: Truck,
    services: [
      {
        id: 'SRV_SUPPLY_AUDIT', 
        name: 'Auditoria de Supply Chain', 
        basePrice: 3000, 
        unit: 'DIA', 
        modes: ['site'],
        certifications: ['LEAN SIX SIGMA', 'ISO 9001'],
        checklist: ['Rastreabilidade de Insumos', 'Verificação de Conformidade ESG', 'Análise de Gargalos Logísticos', 'Relatório de Eficiência']
      },
      {
        id: 'SRV_LAST_MILE', 
        name: 'Last Mile Seguro (Norte)', 
        basePrice: 500, 
        unit: 'ENTREGA', 
        modes: ['site'],
        certifications: ['GESTÃO DE RISCO', 'SEGURANÇA'],
        checklist: ['Escolta Armada Dedicada', 'Rastreamento Satelital Redundante', 'Protocolo de Entrega Sem Contato', 'Seguro de Carga Premium']
      },
      {
        id: 'SRV_RIVER_LOG', 
        name: 'Logística Fluvial Tática', 
        basePrice: 2000, 
        unit: 'FRETE', 
        modes: ['site'],
        certifications: ['ARRAIS AMADOR', 'MOÇO CONVÉS'],
        checklist: ['Inspeção de Casco', 'Verificação de Calado', 'Plano de Navegação Noturna', 'Segurança Embarcada']
      }
    ]
  },


  // 9. MANUTENÇÃO DE ASSETS (IATES & JATOS)
  ASSET_MAINT: {
    id: 'ASSET_MAINT',
    label: 'ASSETS (IATES & JATOS)',
    icon: Anchor,
    services: [
      {
        id: 'SRV_MARINE_MECH', 
        name: 'Mecânica Naval (Diesel)', 
        basePrice: 450, 
        unit: 'HORA', 
        modes: ['site'],
        certifications: ['VOLVO PENTA', 'MAN MARINE'],
        checklist: ['Análise de Óleo do Cárter', 'Verificação de Bombas de Porão', 'Teste de Sistemas de Governo', 'Limpeza de Filtros de Água']
      },
      {
        id: 'SRV_AVIONICS', 
        name: 'Aviônica & Sistemas (Aero)', 
        basePrice: 800, 
        unit: 'HORA', 
        modes: ['site'],
        certifications: ['ANAC MMA', 'GARMIN AVIONICS'],
        checklist: ['Calibração de Altímetro', 'Teste de Transponder', 'Verificação de Radar Meteorológico', 'Atualização de Database GPS']
      },
      {
        id: 'SRV_DETAILING_ELITE', 
        name: 'Detalhamento de Interiores', 
        basePrice: 2000, 
        unit: 'SERVIÇO', 
        modes: ['site'],
        certifications: ['ESTÉTICA AVANÇADA'],
        checklist: ['Higienização de Couro Aeronáutico', 'Polimento de Metais Preciosos', 'Esterilização de Galley', 'Tratamento de Madeira Naval']
      }
    ]
  },


  // 10. SUPORTE TÁTICO AGRO (CENTRO-OESTE)
  AGRO_TACTICAL: {
    id: 'AGRO_TACTICAL',
    label: 'AGRO TÁTICO (MT/GO)',
    icon: Leaf,
    services: [
      {
        id: 'SRV_PRECISION_AG', 
        name: 'Agricultura de Precisão (GPS)', 
        basePrice: 600, 
        unit: 'VISITA', 
        modes: ['site'],
        certifications: ['CREA AGRONOMIA', 'GPS TECH'],
        checklist: ['Calibração de Antena RTK', 'Mapeamento de Talhões', 'Ajuste de Piloto Automático', 'Sincronização de Telemetria']
      },
      {
        id: 'SRV_SOIL_ANALYSIS', 
        name: 'Análise de Solo (Espectro)', 
        basePrice: 300, 
        unit: 'AMOSTRA', 
        modes: ['site'],
        certifications: ['LABORATÓRIO SOLO'],
        checklist: ['Coleta Georreferenciada', 'Espectrometria de Solo', 'Análise de Micronutrientes', 'Recomendação de Correção']
      },
      {
        id: 'SRV_DRONE_SPRAY', 
        name: 'Pulverização por Drone', 
        basePrice: 80, 
        unit: 'HECTARE', 
        modes: ['site'],
        certifications: ['CAAR DRONE', 'ANAC DRONE'],
        checklist: ['Plano de Voo Automatizado', 'Mistura de Calda Controlada', 'Monitoramento de Deriva', 'Relatório de Cobertura']
      }
    ]
  }
};


// --- FUSÃO TOTAL DO CÉREBRO ---
const DATA_STORE = { ...DATA_STORE_CORE, ...DATA_STORE_OMEGA };


// ============================================================================
// 3. LÓGICA DE NEGÓCIO & HELPERS (SISTEMA NERVOSO)
// ============================================================================


const calculateSovereignPrice = (base: number, region: string, tierMultiplier: number = 1.0) => {
    // Deflator Regional: Se não for uma região Core, aplica 20% de desconto (0.8)
    const isCoreRegion = Object.keys(REGIONAL_MULTIPLIERS).includes(region);
    const regionKey = (isCoreRegion ? region : 'OTHER') as keyof typeof REGIONAL_MULTIPLIERS;
    const regionMult = REGIONAL_MULTIPLIERS[regionKey];
    
    const final = base * regionMult * tierMultiplier;
    return final;
};


const formatCurrency = (val: number) => {
    return 'R$ ' + val.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};


// RADAR DE CONTEXTO: ORDENAÇÃO GEOPOLÍTICA
const getSortedCategories = (region: string) => {
    const categories = Object.values(DATA_STORE);
    
    // Matriz de Prioridade Regional
    const weights: Record<string, string[]> = {
        SP: ['TECH_DEV', 'BIO_OPT', 'EDU_CONSULT', 'MENTAL_ELITE'],
        BSB: ['EDU_CONSULT', 'TACTICAL_ELITE', 'TECH_DEV'],
        RJ: ['CARE_AESTHETICS', 'TACTICAL_ELITE', 'ASSET_MAINT'],
        NE: ['ASSET_MAINT', 'CARE_AESTHETICS', 'INFRA_MAINT'],
        CO: ['AGRO_TACTICAL', 'INFRA_MAINT', 'LOGISTICS_IND'],
        SUL: ['TECH_DEV', 'INFRA_MAINT', 'AGRO_TACTICAL'],
        NO: ['LOGISTICS_IND', 'INFRA_MAINT']
    };


    const regionalPriority = weights[region] || weights['SP'];


    return categories.sort((a, b) => {
        const scoreA = regionalPriority.indexOf(a.id) !== -1 ? regionalPriority.indexOf(a.id) : 99;
        const scoreB = regionalPriority.indexOf(b.id) !== -1 ? regionalPriority.indexOf(b.id) : 99;
        return scoreA - scoreB;
    });
};


const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, "");
  if (v.length > 11) v = v.substring(0, 11);
  if (v.length > 10) return v.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  else if (v.length > 6) return v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  else if (v.length > 2) return v.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2");
  else return v.replace(/^(\d*)/, "($1");
};


const maskDate = (value: string) => value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{4})\d+?$/, "$1");
const maskCPF = (value: string) => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");
const maskCNPJ = (value: string) => value.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");


const isAdult = (dateString: string) => {
  if (dateString.length !== 10) return false;
  const [day, month, year] = dateString.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age >= 18;
};


const isValidName = (t: string) => t.length >= 3;
const isValidPhone = (t: string) => t.replace(/\D/g, '').length >= 11;
const isValidDoc = (t: string, isPj: boolean) => t.replace(/\D/g, '').length >= (isPj ? 14 : 11);
const isValidDate = (t: string) => t.length === 10 && isAdult(t);
// ============================================================================
// 4. COMPONENTES VISUAIS (ATOMS & MOLECULES)
// ============================================================================


const AuthToggle = ({ mode, setMode, color }: any) => (
  <View style={styles.toggleContainer}>
    <TouchableOpacity onPress={() => setMode('login')} style={[styles.toggleBtn, mode === 'login' && { backgroundColor: color }]}>
       <Text style={[styles.toggleText, { color: mode === 'login' ? THEME.bg : THEME.textDim }]}>ENTRAR</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setMode('register')} style={[styles.toggleBtn, mode === 'register' && { backgroundColor: color }]}>
       <Text style={[styles.toggleText, { color: mode === 'register' ? THEME.bg : THEME.textDim }]}>CRIAR CONTA</Text>
    </TouchableOpacity>
  </View>
);


const TerminalInput = React.forwardRef(({ label, placeholder, color, keyboardType = 'default', icon, isPassword, value, onChangeText, maxLength, returnKeyType, onSubmitEditing, isValid, autoCapitalize = 'none' }: any, ref: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const borderColor = isValid ? color : (value.length > 0 ? THEME.zinc800 : THEME.border);
  const showCheck = isValid && !isPassword && !label.includes('TOKEN');


  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.inputLabel, { color: isValid ? color : THEME.textDim }]}>{label}</Text>
      <View style={[styles.inputContainer, { borderColor: borderColor, backgroundColor: isValid ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)' }]}>
        {icon}
        <TextInput 
          ref={ref}
          style={[styles.input, { color: THEME.white }]} 
          placeholder={placeholder}
          placeholderTextColor={THEME.textDim}
          keyboardType={keyboardType}
          selectionColor={color}
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={!returnKeyType || returnKeyType === 'done'}
          autoCapitalize={autoCapitalize}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{padding: 5}}>
             {showPassword ? <EyeOff size={18} color={THEME.textDim} /> : <Eye size={18} color={THEME.textDim} />}
          </TouchableOpacity>
        ) : (
           showCheck ? <Check size={18} color={color} /> : (label.includes('TOKEN') ? <Lock size={16} color={THEME.textDim} /> : null)
        )}
      </View>
    </View>
  );
});


const SocialButton = ({ label, icon, onPress, loading }: any) => (
  <TouchableOpacity style={styles.socialBtn} onPress={onPress} disabled={loading}>
    {loading ? <ActivityIndicator size="small" color={THEME.white}/> : icon}
    <Text style={styles.socialBtnText}>{label}</Text>
  </TouchableOpacity>
);


const MacroButton = ({ title, subtitle, icon, onClick, color = THEME.white }: any) => (
  <TouchableOpacity onPress={onClick} style={[styles.macroBtn, { borderColor: color }]}>
    <View style={[styles.macroIcon, { backgroundColor: color }]}>
      {icon}
    </View>
    <View style={{flex: 1}}>
      <Text style={styles.macroTitle}>{title}</Text>
      <Text style={styles.macroSubtitle}>{subtitle}</Text>
    </View>
    <ArrowRight size={20} color={THEME.textDim} />
  </TouchableOpacity>
);


const MinimalButton = ({ children, onClick, variant = 'glass', style }: any) => {
  let bg = 'rgba(255,255,255,0.05)';
  let border = THEME.border;
  if (variant === 'solid') { bg = THEME.white; border = THEME.white; }
  if (variant === 'gold') { bg = 'rgba(234, 179, 8, 0.1)'; border = THEME.gold; }
  if (variant === 'outline') { bg = 'transparent'; border = THEME.green; }


  return (
    <TouchableOpacity onPress={onClick} style={[styles.btn, { backgroundColor: bg, borderColor: border }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>{children}</View>
    </TouchableOpacity>
  );
};


// ============================================================================
// 5. EFEITOS VISUAIS & COMPONENTES TÁTICOS
// ============================================================================


const RadarBackground = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(spinValue, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })).start();
  }, []);
  const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });


  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: THEME.bg }]} />
      <View style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
        {[...Array(6)].map((_, i) => <View key={`v-${i}`} style={{ position: 'absolute', left: i * (width / 5), width: 1, height: height, backgroundColor: THEME.white }} />)}
        {[...Array(8)].map((_, i) => <View key={`h-${i}`} style={{ position: 'absolute', top: i * (height / 6), width: width, height: 1, backgroundColor: THEME.white }} />)}
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={[styles.radarCircle, { width: 300, height: 300, opacity: 0.2 }]} />
        <Animated.View style={{ width: 600, height: 600, position: 'absolute', transform: [{ rotate: spin }] }}>
          <View style={{ width: '50%', height: '50%', borderRightWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(234, 179, 8, 0.3)', borderBottomRightRadius: 300, backgroundColor: 'rgba(234, 179, 8, 0.02)' }} />
        </Animated.View>
      </View>
    </View>
  );
};


const SplashBigBang = ({ onComplete }: any) => {
  const [textIndex, setTextIndex] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(1)).current;  
  const opacityAnim = useRef(new Animated.Value(1)).current; 
  const textOpacity = useRef(new Animated.Value(1)).current; 


  useEffect(() => {
    const textInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(textOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 1, duration: 150, useNativeDriver: true })
      ]).start();
      setTimeout(() => setTextIndex((prev) => (prev + 1) % SLOGANS.length), 150);
    }, 800);


    const spinLoop = Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.cubic), useNativeDriver: true })
    );
    spinLoop.start();


    setTimeout(() => {
      spinLoop.stop(); clearInterval(textInterval);
      rotateAnim.setValue(0); setTextIndex(0); textOpacity.setValue(1); 
    }, 3200);


    setTimeout(() => {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 60, duration: 800, useNativeDriver: true, easing: Easing.in(Easing.exp) }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 500, useNativeDriver: true }) 
      ]).start(() => onComplete());
    }, 3700);
  }, []);


  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });


  return (
    <View style={styles.splashContainer}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />
      <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }, { rotate: spin }] }}>
        <View style={styles.logoContainer}><Text style={styles.logoText}>I</Text></View>
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: opacityAnim }]}>
        <Animated.Text style={[styles.slogan, { opacity: textOpacity }]}>{SLOGANS[textIndex].toUpperCase()}</Animated.Text>
      </Animated.View>
    </View>
  );
};


// TELEMETRIA REAL (HOOK DE LATÊNCIA)
const useTelemetry = () => {
    const [latency, setLatency] = useState(24); // Start with typical value
    useEffect(() => {
        const ping = async () => {
            const start = Date.now();
            // Simulação de handshake de rede assíncrono com jitter natural
            await new Promise(r => setTimeout(r, Math.random() * 50 + 20)); 
            setLatency(Date.now() - start);
        };
        const interval = setInterval(ping, 2000);
        return () => clearInterval(interval);
    }, []);
    return latency;
};


// HUD TÁTICO (TOPO DA TELA)
const TelemetryHUD = ({ onLogout, region, setRegion }: { onLogout: () => void, region: string, setRegion: (r: string) => void }) => {
  const latency = useTelemetry();
  const [blink, setBlink] = useState(1);
  useEffect(() => { const interval = setInterval(() => setBlink(b => b === 1 ? 0.3 : 1), 800); return () => clearInterval(interval); }, []);
  const regions = Object.keys(REGIONAL_MULTIPLIERS);
  const nextRegion = () => { const idx = regions.indexOf(region); setRegion(regions[(idx + 1) % regions.length]); };


  return (
    <View style={styles.hudContainer}>
      <View style={styles.hudLeft}>
        <TouchableOpacity onPress={nextRegion} style={styles.regionBadge}>
            <Globe size={12} color={THEME.gold} />
            <Text style={styles.regionText}>{region}</Text>
        </TouchableOpacity>
        <Wifi size={14} color={latency < 100 ? THEME.green : THEME.gold} />
        <Text style={[styles.hudText, { color: latency < 100 ? THEME.green : THEME.gold }]}>{latency}ms</Text>
      </View>
      <View style={styles.hudCenter}>
        <View style={[styles.statusDot, { opacity: blink }]} />
        <Text style={styles.hudText}>SISTEMA ONLINE</Text>
      </View>
      <View style={styles.hudRight}>
        <Battery size={14} color={THEME.white} />
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
             <Text style={styles.logoutText}>OFF</Text>
             <Power size={10} color={THEME.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
};


// MAPA VETORIAL (OBSIDIAN MODE)
const ObsidianMap = () => (
  <View style={StyleSheet.absoluteFill}>
    <View style={{flex:1, backgroundColor: '#000000'}}>
      {[...Array(12)].map((_, i) => (
        <View key={`v-${i}`} style={{position: 'absolute', left: i * (width/8) - 20, width: 1, height: height, backgroundColor: '#1a1a1a'}} />
      ))}
      {[...Array(15)].map((_, i) => (
        <View key={`h-${i}`} style={{position: 'absolute', top: i * (height/10), width: width, height: 1, backgroundColor: '#1a1a1a'}} />
      ))}
      {/* POIS & LOCATIONS */}
      <View style={{position: 'absolute', top: height*0.3, left: width*0.2, width: 6, height: 6, backgroundColor: THEME.gold}} />
      <View style={{position: 'absolute', top: height*0.6, left: width*0.7, width: 6, height: 6, backgroundColor: THEME.gold}} />
      <View style={{position: 'absolute', top: height*0.15, left: width*0.5, width: 6, height: 6, backgroundColor: THEME.gold}} />
      <View style={{position: 'absolute', top: height*0.4, left: width*0.9, width: 6, height: 6, backgroundColor: THEME.gold}} />
      
      {/* CENTRO TÁTICO */}
      <View style={{position: 'absolute', top: height/2 - 40, left: width/2 - 40, width: 80, height: 80, alignItems: 'center', justifyContent: 'center'}}>
         <View style={{position: 'absolute', width: 80, height: 80, backgroundColor: 'rgba(234, 179, 8, 0.05)', borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.2)'}} />
         <View style={{width: 8, height: 8, backgroundColor: THEME.gold, transform: [{ rotate: '45deg'}]}} />
      </View>
    </View>
  </View>
);


// SERVICE CARD (INTERATIVO COM CHECKLIST & CERTIFICAÇÃO)
const ServiceCard = ({ srv, region, onRequest }: { srv: any, region: string, onRequest: (name: string, price: number) => void }) => {
    const [checked, setChecked] = useState<number[]>([]);
    const finalPrice = calculateSovereignPrice(srv.basePrice, region, TIERS.STANDARD.multiplier);
    const isReady = checked.length === srv.checklist.length;


    const toggleCheck = (idx: number) => {
        if (checked.includes(idx)) setChecked(checked.filter(i => i !== idx));
        else {
            setChecked([...checked, idx]);
            Vibration.vibrate(10); // Haptic feedback
        }
    };


    return (
        <View style={styles.serviceCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12}}>
                <View style={{flex: 1}}>
                    <Text style={styles.serviceName}>{srv.name}</Text>
                    <Text style={styles.serviceUnit}>{srv.unit}</Text>
                </View>
                <View>
                    <Text style={styles.servicePriceLabel}>estimado ({region})</Text>
                    <Text style={styles.servicePrice}>{formatCurrency(finalPrice)}</Text>
                </View>
            </View>
            {srv.certifications && (
                <View style={{flexDirection: 'row', gap: 6, marginBottom: 12, flexWrap: 'wrap'}}>
                    {srv.certifications.map((cert: string, i: number) => (
                        <View key={i} style={styles.certBadge}>
                            <FileBadge size={10} color={THEME.bg} fill={THEME.gold}/>
                            <Text style={styles.certText}>{cert}</Text>
                        </View>
                    ))}
                </View>
            )}
            <View style={styles.dividerLine} />
            <Text style={{color: THEME.textDim, fontSize: 9, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1}}>Protocolo Obrigatório ({checked.length}/{srv.checklist.length})</Text>
            <View style={{gap: 8}}>
                {srv.checklist.map((item: string, idx: number) => {
                    const isChecked = checked.includes(idx);
                    return (
                        <TouchableOpacity key={idx} onPress={() => toggleCheck(idx)} style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                            <View style={{width: 16, height: 16, borderRadius: 4, borderWidth: 1, borderColor: isChecked ? THEME.gold : THEME.zinc700, alignItems: 'center', justifyContent: 'center', backgroundColor: isChecked ? 'rgba(234, 179, 8, 0.2)' : 'transparent'}}>
                                {isChecked && <Check size={10} color={THEME.gold} />}
                            </View>
                            <Text style={[styles.checklistText, { color: isChecked ? THEME.white : THEME.textDim }]}>{item}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <TouchableOpacity 
                style={[styles.requestBtnSmall, { backgroundColor: isReady ? THEME.white : '#27272a', opacity: isReady ? 1 : 0.5 }]}
                disabled={!isReady}
                onPress={() => onRequest(srv.name, finalPrice)}
            >
                {isReady ? <Text style={styles.requestBtnTextSmall}>SOLICITAR AGORA</Text> : <View style={{flexDirection:'row', gap: 6, alignItems:'center', justifyContent: 'center'}}><LockIcon size={12} color={THEME.textDim}/><Text style={[styles.requestBtnTextSmall, {color: THEME.textDim}]}>BLOQUEADO</Text></View>}
            </TouchableOpacity>
        </View>
    );
};
// ============================================================================
// 6. TELAS PRINCIPAIS (COCKPIT SCREEN: DUAL-MODE ENGINE)
// ============================================================================


const handleRequestService = (name: string, price: number, region: string) => {
  Alert.alert(
    "MISSÃO TÁTICA ATIVADA",
    `Serviço: ${name}\nValor Soberano: ${formatCurrency(price)}\nSetor Regional: ${region}\n\nOperativo credenciado alocado. Protocolo de segurança e telemetria satelital em andamento.`
  );
};

const CockpitScreen = ({ userRole, onLogout }: { userRole: string, onLogout: () => void }) => {
  // --- ESTADOS GLOBAIS DO COCKPIT ---
  const [mode, setMode] = useState<'client' | 'provider'>('client');
  const [currentRegion, setCurrentRegion] = useState('SP'); // Radar Geopolítico
  
  // --- ESTADOS DO PRESTADOR (PROVIDER) ---
  const [providerStatus, setProviderStatus] = useState<'unverified' | 'analyzing' | 'verified'>('unverified');
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  
  // --- ESTADOS DO CLIENTE (NAVEGAÇÃO TÁTICA) ---
  const [viewState, setViewState] = useState<'MODES' | 'CATS' | 'SERVS'>('MODES');
  const [selectedMode, setSelectedMode] = useState<'home' | 'site' | 'online' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);


  // --- DADOS COMPUTADOS ---
  const isBusiness = userRole.includes('pj');
  const creditBalance = isBusiness ? "R$ 5.500,00" : "R$ 0,00";
  const sortedCategories = useMemo(() => getSortedCategories(currentRegion), [currentRegion]);


  // --- HANDLERS DE ALTERNÂNCIA DE MODO (SWITCH PRO) ---
  const handleSwitchMode = () => {
    if (mode === 'provider') {
        setMode('client');
        return;
    }
    // Protocolo de Segurança: Só permite acesso Provider se verificado
    if (providerStatus === 'verified') {
        setMode('provider');
    } else {
        setShowDocUpload(true); // Aciona KYC
    }
  };


  // --- HANDLERS DE KYC (SIMULAÇÃO DE BIOMETRIA) ---
  const handleDocUpload = () => {
      setProviderStatus('analyzing');
      // Simula latência de análise de IA
      setTimeout(() => {
          setProviderStatus('verified');
          setShowDocUpload(false);
          setMode('provider');
          Alert.alert("ACESSO CONCEDIDO", "Identidade Tática Confirmada.\nBem-vindo à Rede Operacional.");
      }, 3000);
  };


  // --- HANDLERS DE NAVEGAÇÃO DO CATÁLOGO ---
  const handleModeSelect = (modeId: any) => { setSelectedMode(modeId); setViewState('CATS'); };
  const handleCatSelect = (cat: any) => { setSelectedCategory(cat); setViewState('SERVS'); };
  const handleBack = () => {
      if (viewState === 'SERVS') setViewState('CATS');
      else if (viewState === 'CATS') { setViewState('MODES'); setSelectedMode(null); }
  };


  // --- HANDLER DE EXECUÇÃO DE SERVIÇO ---
  const handleRequest = (name: string, price: number) => {
      handleRequestService(name, price, currentRegion);
  };


  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* LAYER 0: MAPA VETORIAL (FUNDO COM OPACIDADE) */}
      <View style={{...StyleSheet.absoluteFillObject, opacity: 0.05}}>
          <ObsidianMap />
      </View>


      {/* LAYER 1: HUD DE TELEMETRIA (TOPO) */}
      <TelemetryHUD onLogout={onLogout} region={currentRegion} setRegion={setCurrentRegion} />


      {/* LAYER 2: HEADER DE NAVEGAÇÃO */}
      <View style={styles.cockpitHeaderNew}>
         <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
             {mode === 'client' && viewState !== 'MODES' && (
                 <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                     <ChevronLeft size={20} color={THEME.white} />
                     <Text style={styles.backBtnText}>VOLTAR</Text>
                 </TouchableOpacity>
             )}
             {/* Logo muda conforme o contexto */}
             {mode === 'client' && viewState === 'MODES' && <Text style={styles.headerLogo}>IRVO.</Text>}
             {mode === 'provider' && <Text style={[styles.headerLogo, { color: THEME.gold }]}>PRO.</Text>}
         </View>
         
         <View style={{flexDirection: 'row', gap: 12}}>
            {/* Botão de Switch Tático */}
            <TouchableOpacity 
                onPress={handleSwitchMode} 
                style={[styles.iconBtn, { borderColor: mode === 'client' ? THEME.zinc800 : THEME.green }]}
            >
                <SwitchCamera size={20} color={mode === 'client' ? THEME.textDim : THEME.green} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
                <Menu size={20} color={THEME.white} />
            </TouchableOpacity>
         </View>
      </View>


      {/* LAYER 3: CONTEÚDO PRINCIPAL (SCROLLABLE) */}
      <View style={styles.cockpitContent}>
         
         {/* === MODO CLIENTE (CONTRATANTE) === */}
         {mode === 'client' && (
             <>
                 {/* VIEW 1: SELEÇÃO DE MODO (DELIVERY / LOCAL / ONLINE) */}
                 {viewState === 'MODES' && (
                     <>
                        <View style={{marginBottom: 40}}>
                            <Text style={styles.welcomeSubtitle}>BEM-VINDO, LUCAS</Text>
                            <Text style={styles.welcomeTitle}>Como deseja ser{'\n'}atendido hoje?</Text>
                            
                            {isBusiness && (
                                <View style={styles.businessBadge}>
                                    <Text style={{color: THEME.bg, fontWeight: '900', fontSize: 10}}>SALDO CORPORATIVO</Text>
                                    <Text style={{color: THEME.bg, fontWeight: 'bold', fontSize: 16}}>{creditBalance}</Text>
                                </View>
                            )}
                        </View>


                        <View style={styles.modesGrid}>
                            {Object.values(MODES).map((m) => {
                                const Icon = m.icon;
                                return (
                                    <TouchableOpacity 
                                        key={m.id} 
                                        style={styles.modeCard} 
                                        onPress={() => handleModeSelect(m.id)}
                                    >
                                        <View style={styles.modeHeader}>
                                            <View style={[styles.modeIconBox, { backgroundColor: '#18181b' }]}>
                                                <Icon size={24} color={THEME.textDim} />
                                            </View>
                                            <View>
                                                <Text style={[styles.modeLabel, { color: THEME.white }]}>{m.label}</Text>
                                                <Text style={styles.modeDesc}>{m.desc}</Text>
                                            </View>
                                        </View>
                                        <ChevronRight size={16} color={THEME.zinc800} />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                     </>
                 )}


                 {/* VIEW 2: SELEÇÃO DE CATEGORIA (FILTRADA PELO MODO) */}
                 {viewState === 'CATS' && selectedMode && (
                     <View style={{flex: 1}}>
                         <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32}}>
                             <Text style={styles.sectionTitle}>CATÁLOGO: {MODES[selectedMode.toUpperCase() as keyof typeof MODES].label}</Text>
                             <View style={styles.tag}><Text style={styles.tagText}>RADAR: {currentRegion}</Text></View>
                         </View>


                         <ScrollView contentContainerStyle={{gap: 16, paddingBottom: 100}}>
                             {sortedCategories
                                .filter(cat => cat.services.some((s: any) => s.modes.includes(selectedMode)))
                                .map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <TouchableOpacity key={cat.id} style={styles.catCard} onPress={() => handleCatSelect(cat)}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                                                <Icon size={24} color={THEME.textDim} />
                                                <Text style={styles.catLabel}>{cat.label}</Text>
                                            </View>
                                            <ChevronRight size={20} color={THEME.zinc800} />
                                        </TouchableOpacity>
                                    )
                                })
                             }
                         </ScrollView>
                     </View>
                 )}


                 {/* VIEW 3: LISTA DE SERVIÇOS (PREÇO DINÂMICO & CHECKLIST) */}
                 {viewState === 'SERVS' && selectedCategory && (
                     <View style={{flex: 1}}>
                         <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>{selectedCategory.label}</Text>
                         <Text style={styles.subTitle}>Selecione o Serviço</Text>


                         <ScrollView contentContainerStyle={{gap: 20, paddingTop: 32, paddingBottom: 100}}>
                             {selectedCategory.services
                                .filter((s: any) => s.modes.includes(selectedMode))
                                .map((srv: any) => (
                                    <ServiceCard 
                                        key={srv.id} 
                                        srv={srv} 
                                        region={currentRegion} 
                                        onRequest={handleRequest} 
                                    />
                                ))
                             }
                         </ScrollView>
                     </View>
                 )}
             </>
         )}


         {/* === MODO PRESTADOR (DASHBOARD FINANCEIRO/OPERACIONAL) === */}
         {mode === 'provider' && (
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                    <Text style={{color: THEME.textDim, fontSize: 12, letterSpacing: 2}}>STATUS OPERACIONAL</Text>
                    <View style={{flexDirection:'row', alignItems:'center', gap:6}}>
                        <View style={{width:8, height:8, borderRadius:4, backgroundColor: isOnline ? THEME.green : THEME.red}} />
                        <Text style={{color: isOnline ? THEME.green : THEME.red, fontWeight:'bold'}}>{isOnline ? 'ATIVO' : 'INATIVO'}</Text>
                    </View>
                </View>


                <TouchableOpacity 
                    onPress={() => setIsOnline(!isOnline)} 
                    style={[styles.onlineBtn, { borderColor: isOnline ? THEME.green : THEME.red, backgroundColor: isOnline ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}
                >
                    <Text style={{color: isOnline ? THEME.green : THEME.red, fontWeight: '900', fontSize: 24, letterSpacing: 2}}>
                        {isOnline ? 'FICAR OFFLINE' : 'FICAR ONLINE'}
                    </Text>
                </TouchableOpacity>


                <View style={{flexDirection: 'row', gap: 16, marginTop: 24}}>
                    <View style={styles.statCard}>
                        <DollarSign size={24} color={THEME.gold} />
                        <Text style={styles.statValue}>R$ 0</Text>
                        <Text style={styles.statLabel}>GANHOS (24H)</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Bell size={24} color={THEME.white} />
                        <Text style={[styles.statValue, {color: THEME.white}]}>0</Text>
                        <Text style={styles.statLabel}>PEDIDOS</Text>
                    </View>
                </View>
                
                {/* Exibição de Certificações Ativas */}
                <View style={{marginTop: 32}}>
                    <Text style={{color: THEME.textDim, fontSize: 10, letterSpacing: 2, marginBottom: 12}}>CERTIFICAÇÕES ATIVAS</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                        {['BIOSSEGURANÇA', 'CREA CIVIL', 'ANAC DRONE'].map((cert, i) => (
                            <View key={i} style={{flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#18181b', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: THEME.zinc800}}>
                                <CheckCircle size={12} color={THEME.green} />
                                <Text style={{color: THEME.white, fontSize: 10, fontWeight: 'bold'}}>{cert}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
         )}
      </View>


      {/* --- MODAL DE SEGURANÇA (KYC) --- */}
      <Modal visible={showDocUpload} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { height: 'auto', paddingBottom: 40 }]}>
                  {providerStatus === 'unverified' && (
                      <>
                        <View style={{alignItems: 'center', marginBottom: 24}}>
                            <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(34, 197, 94, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16}}>
                                <ScanFace size={32} color={THEME.green} />
                            </View>
                            <Text style={styles.modalTitle}>Verificação de Identidade</Text>
                            <Text style={[styles.legalBody, {textAlign: 'center', marginTop: 8}]}>
                                Olá, Lucas. Para ativar seu perfil profissional Elite, precisamos validar suas credenciais técnicas e biometria.
                            </Text>
                        </View>


                        <TouchableOpacity style={styles.docOption} onPress={handleDocUpload}>
                            <FileText size={24} color={THEME.white} />
                            <View style={{flex: 1}}>
                                <Text style={{color: THEME.white, fontWeight: 'bold'}}>Anexar Documento Digital</Text>
                                <Text style={{color: THEME.textDim, fontSize: 12}}>PDF do CRM, CREA, OAB ou Certificação Técnica</Text>
                            </View>
                            <ArrowRight size={20} color={THEME.textDim} />
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.docOption} onPress={handleDocUpload}>
                            <Camera size={24} color={THEME.white} />
                            <View style={{flex: 1}}>
                                <Text style={{color: THEME.white, fontWeight: 'bold'}}>Biometria Facial (Liveness)</Text>
                                <Text style={{color: THEME.textDim, fontSize: 12}}>Validação de prova de vida em tempo real</Text>
                            </View>
                            <ArrowRight size={20} color={THEME.textDim} />
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => setShowDocUpload(false)} style={{marginTop: 24, alignSelf: 'center'}}>
                            <Text style={{color: THEME.red, fontWeight: 'bold'}}>CANCELAR</Text>
                        </TouchableOpacity>
                      </>
                  )}


                  {providerStatus === 'analyzing' && (
                      <View style={{alignItems: 'center', paddingVertical: 40}}>
                          <ActivityIndicator size="large" color={THEME.green} />
                          <Text style={{color: THEME.green, fontWeight: 'bold', marginTop: 24, fontSize: 18}}>IA ANALISANDO...</Text>
                          <Text style={{color: THEME.textDim, marginTop: 8}}>Validando autenticidade junto aos órgãos federais...</Text>
                      </View>
                  )}
              </View>
          </View>
      </Modal>


    </View>
  );
};


// --- LANDING SCREEN (FLUXO DE ENTRADA & AUTH) ---
// ============================================================================
// 7. LANDING SCREEN (PORTAL DE ENTRADA BLINDADO)
// ============================================================================


const LandingScreen = ({ onLoginSuccess }: { onLoginSuccess: (role: string) => void }) => {
  // Navigation State
  const [navLevel, setNavLevel] = useState<'root' | 'sub_hire' | 'sub_work' | 'form'>('root');
  const [selectedRole, setSelectedRole] = useState<string | null>(null); 
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', document: '', phone: '', birthDate: '', password: '', confirmPassword: '', token: ''
  });


  // Refs
  const nameRef = useRef<TextInput>(null);
  const docRef = useRef<TextInput>(null);
  const birthRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmPassRef = useRef<TextInput>(null);


  // Logic State
  const [authStep, setAuthStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Animation
  const sheetTranslateY = useRef(new Animated.Value(height)).current; 
  const contentOpacity = useRef(new Animated.Value(1)).current;


  // Handlers
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


  useEffect(() => {
    // Intro Animation
    setTimeout(() => {
      Animated.timing(sheetTranslateY, { toValue: height * 0.42, duration: 800, easing: Easing.out(Easing.exp), useNativeDriver: true }).start();
    }, 1200); 
  }, []);


  const transitionTo = (newLevel: typeof navLevel, callback?: () => void) => {
    Animated.timing(contentOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setNavLevel(newLevel);
      if (callback) callback();
      
      let targetHeight = height * 0.42;
      if (newLevel === 'form') targetHeight = height * 0.08; // Expand sheet for form
      
      Animated.parallel([
        Animated.timing(sheetTranslateY, { toValue: targetHeight, duration: 400, easing: Easing.out(Easing.exp), useNativeDriver: true }),
        Animated.timing(contentOpacity, { toValue: 1, duration: 250, useNativeDriver: true })
      ]).start();
    });
  };


  const handleSelectRole = (role: string) => {
    transitionTo('form', () => {
        setSelectedRole(role);
        setAuthMode('login');
        setAuthStep(1);
        setFormData({ name: '', document: '', phone: '', birthDate: '', password: '', confirmPassword: '', token: '' });
    });
  };


  const handleBack = () => {
    if (authStep > 1) { setAuthStep(authStep - 1); return; }
    if (navLevel === 'form') {
        const isClient = selectedRole?.startsWith('client');
        const prevLevel = isClient ? 'sub_hire' : 'sub_work';
        transitionTo(prevLevel, () => { 
            setSelectedRole(null); 
            setAuthStep(0); 
            setFormData({ name: '', document: '', phone: '', birthDate: '', password: '', confirmPassword: '', token: '' });
        });
        return;
    }
    if (navLevel === 'sub_hire' || navLevel === 'sub_work') { transitionTo('root'); return; }
  };


  useEffect(() => {
    const backAction = () => { if (navLevel !== 'root') { handleBack(); return true; } return false; };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navLevel, authStep, selectedRole]);


  const handleSocialLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (authMode === 'login') { 
          onLoginSuccess(selectedRole || 'client_pf');
      } else { setShowTermsModal(true); }
    }, 1500);
  };


  const checkValidity = () => {
    if (authMode === 'login') return true; 
    const { name, document, phone, birthDate } = formData;
    const isPj = selectedRole?.includes('pj');
    const isAdultValid = birthDate.length === 10 && isAdult(birthDate);
    const okName = isValidName(name);
    const okDoc = isValidDoc(document, !!isPj);
    const okPhone = isValidPhone(phone);


    if (selectedRole === 'client_pf') return okName && isAdultValid && okPhone;
    if (selectedRole === 'client_pj') return okDoc && okPhone; 
    if (selectedRole === 'provider_pf') return okName && okDoc && isAdultValid && okPhone;
    if (selectedRole === 'provider_pj') return okDoc && okPhone; 
    return false;
  };


  const handleNextStep = () => {
    if (!checkValidity() && authMode === 'register') {
        Alert.alert("DADOS INCOMPLETOS", "Por favor, preencha todos os campos corretamente.");
        return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (authMode === 'login') {
          if (formData.password.length < 3) { Alert.alert("ERRO", "Senha inválida."); return; }
          onLoginSuccess(selectedRole || 'client_pf');
      } else {
        if (authStep === 1) setAuthStep(2); 
        else if (authStep === 2) {
            if (formData.token.length < 6) { Alert.alert("ERRO", "Token inválido."); return; }
            setAuthStep(3); 
        } 
        else if (authStep === 3) {
            if (formData.password.length < 6) { Alert.alert("ERRO", "Senha muito curta."); return; }
            if (formData.password !== formData.confirmPassword) { Alert.alert("ERRO", "Senhas não conferem."); return; }
            setShowTermsModal(true); 
        }
      }
    }, 1000);
  };


  // Sub-Renderers
  const renderRoot = () => (
    <View style={{ gap: 16 }}>
      <Text style={styles.sheetTitle}>O QUE VOCÊ DESEJA?</Text>
      <MacroButton title="CONTRATAR SERVIÇOS" subtitle="Para mim ou minha empresa" icon={<Search size={24} color={THEME.bg} />} color={THEME.white} onClick={() => transitionTo('sub_hire')}/>
      <MacroButton title="PRESTAR SERVIÇOS" subtitle="Sou profissional ou empresa" icon={<WorkIcon size={24} color={THEME.bg} />} color={THEME.green} onClick={() => transitionTo('sub_work')}/>
      <Text style={styles.footerText}>IRVO INC. GLOBAL © 2026</Text>
    </View>
  );


  const renderSubHire = () => (
    <View style={{ gap: 16 }}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, zIndex: 10}}>
            <TouchableOpacity onPress={handleBack} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} style={{padding: 10}}><ChevronLeft size={32} color={THEME.white} style={{marginRight: 10}}/></TouchableOpacity>
            <Text style={styles.sheetTitle}>QUAL O SEU PERFIL?</Text>
        </View>
        <MinimalButton variant="solid" onClick={() => handleSelectRole('client_pf')}><User size={20} color={THEME.bg} /><Text style={[styles.btnText, { color: THEME.bg }]}>PARA MIM (PF)</Text></MinimalButton>
        <MinimalButton variant="gold" onClick={() => handleSelectRole('client_pj')}><Sparkles size={20} color={THEME.gold} /><View><Text style={[styles.btnText, { color: THEME.gold }]}>IRVO BUSINESS (PJ)</Text><Text style={{color: THEME.gold, fontSize: 9, opacity: 0.8}}>Bônus de 10% + Gestão de Equipe</Text></View></MinimalButton>
    </View>
  );


  const renderSubWork = () => (
    <View style={{ gap: 16 }}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, zIndex: 10}}>
            <TouchableOpacity onPress={handleBack} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} style={{padding: 10}}><ChevronLeft size={32} color={THEME.white} style={{marginRight: 10}}/></TouchableOpacity>
            <Text style={styles.sheetTitle}>COMO VAI ATUAR?</Text>
        </View>
        <MinimalButton variant="outline" onClick={() => handleSelectRole('provider_pf')}><User size={20} color={THEME.green} /><Text style={[styles.btnText, { color: THEME.green }]}>SOU AUTÔNOMO (PF)</Text></MinimalButton>
        <MinimalButton variant="gold" onClick={() => handleSelectRole('provider_pj')}><Sparkles size={20} color={THEME.gold} /><View><Text style={[styles.btnText, { color: THEME.gold }]}>IRVO BUSINESS (PARCEIRO)</Text><Text style={{color: THEME.gold, fontSize: 9, opacity: 0.8}}>Disponibilizar minha equipe</Text></View></MinimalButton>
    </View>
  );


  const renderForm = () => {
    const config = {
      client_pf: { title: 'CONTRATANTE PESSOAL', color: THEME.white },
      client_pj: { title: 'IRVO BUSINESS', color: THEME.gold },
      provider_pf: { title: 'PRESTADOR AUTÔNOMO', color: THEME.green },
      provider_pj: { title: 'BUSINESS PARCEIRO', color: THEME.gold },
    };
    const current = config[selectedRole as keyof typeof config] || config.client_pf;
    const isValid = checkValidity();


    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, zIndex: 10 }}>
          <TouchableOpacity onPress={handleBack} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} style={{ padding: 8, marginRight: 16, borderWidth: 1, borderColor: THEME.zinc800, borderRadius: 12 }}>
            <ChevronLeft size={24} color={current.color} />
          </TouchableOpacity>
          <Text style={[styles.formTitle, { color: current.color }]}>
             {authStep === 1 ? current.title : authStep === 2 ? 'VALIDAÇÃO' : 'BLINDAGEM'}
          </Text>
        </View>


        {authStep === 1 && (
          <View style={{ flex: 1 }}>
            <AuthToggle mode={authMode} setMode={setAuthMode} color={current.color} />
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              <SocialButton label="GOOGLE" icon={<Mail size={18} color={THEME.white} />} onPress={handleSocialLogin} loading={loading}/>
              <SocialButton label="APPLE" icon={<ScanFace size={18} color={THEME.white} />} onPress={handleSocialLogin} loading={loading}/>
            </View>
            <View style={styles.divider}><View style={styles.dividerLine}/><Text style={styles.dividerText}>OU VIA CREDENCIAIS</Text><View style={styles.dividerLine}/></View>


            <ScrollView contentContainerStyle={{paddingBottom: 80}}>
                {selectedRole?.includes('pf') && authMode === 'register' && (
                    <>
                        <TerminalInput ref={nameRef} label="NOME COMPLETO" placeholder="Ex: Lucas Silva" color={current.color} icon={<User size={18} color={THEME.textDim} style={{marginRight: 10}}/>} value={formData.name} onChangeText={(t: string) => updateForm('name', t)} returnKeyType="next" onSubmitEditing={() => (selectedRole === 'provider_pf' ? docRef : birthRef).current?.focus()} autoCapitalize="words" isValid={isValidName(formData.name)} />
                        {selectedRole === 'provider_pf' && <TerminalInput ref={docRef} label="CPF" placeholder="000.000.000-00" color={current.color} keyboardType="numeric" maxLength={14} icon={<Fingerprint size={18} color={THEME.green} style={{marginRight: 10}}/>} value={formData.document} onChangeText={(t: string) => updateForm('document', t)} returnKeyType="next" onSubmitEditing={() => birthRef.current?.focus()} isValid={isValidDoc(formData.document, false)} />}
                        <TerminalInput ref={birthRef} label="NASCIMENTO (DD/MM/AAAA)" placeholder="01/01/2000" color={current.color} keyboardType="numeric" maxLength={10} value={formData.birthDate} onChangeText={(t: string) => updateForm('birthDate', t)} icon={<Calendar size={18} color={THEME.textDim} style={{marginRight: 10}}/>} returnKeyType="next" onSubmitEditing={() => phoneRef.current?.focus()} isValid={isValidDate(formData.birthDate)} />
                        {formData.birthDate.length === 10 && !isAdult(formData.birthDate) && <Text style={{color: THEME.red, fontSize: 10, marginTop: -10, marginBottom: 10}}>* Proibido para menores de 18 anos.</Text>}
                    </>
                )}
                {selectedRole?.includes('pj') && (
                    <TerminalInput ref={docRef} label="CNPJ" placeholder="00.000.000/0001-00" color={current.color} keyboardType="numeric" maxLength={18} icon={<Building size={18} color={current.color} style={{marginRight: 10}}/>} value={formData.document} onChangeText={(t: string) => updateForm('document', t)} returnKeyType="next" onSubmitEditing={() => phoneRef.current?.focus()} isValid={isValidDoc(formData.document, true)} />
                )}
                {authMode === 'register' && (
                    <TerminalInput ref={phoneRef} label="CELULAR (PARA TOKEN)" placeholder="(11) 99999-9999" color={current.color} keyboardType="numeric" maxLength={15} icon={<Smartphone size={18} color={current.color} style={{marginRight: 10}}/>} value={formData.phone} onChangeText={(t: string) => updateForm('phone', t)} isValid={isValidPhone(formData.phone)} />
                )}
                {authMode === 'login' && (
                    <>
                        {selectedRole?.includes('pf') && <TerminalInput ref={phoneRef} label={selectedRole === 'client_pf' ? "CELULAR" : "CPF"} placeholder="..." color={current.color} value={selectedRole === 'client_pf' ? formData.phone : formData.document} onChangeText={(t: string) => updateForm(selectedRole === 'client_pf' ? 'phone' : 'document', t)} returnKeyType="next" onSubmitEditing={() => passRef.current?.focus()} keyboardType="numeric" />}
                        <TerminalInput ref={passRef} label="SENHA" placeholder="••••••••" color={current.color} isPassword icon={<Key size={18} color={THEME.textDim} style={{marginRight: 10}}/>} value={formData.password} onChangeText={(t: string) => updateForm('password', t)} returnKeyType="done" onSubmitEditing={handleNextStep} />
                        <TouchableOpacity onPress={() => Alert.alert("SUPORTE IRVO", "Para redefinir sua senha, entre em contato com o suporte.")} style={{alignSelf: 'flex-end', marginTop: -10, marginBottom: 20}}>
                            <Text style={{color: current.color, fontSize: 12, fontWeight: 'bold'}}>ESQUECI A SENHA</Text>
                        </TouchableOpacity>
                    </>
                )}
                
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: current.color, marginTop: 24, opacity: (authMode === 'login' || isValid) ? 1 : 0.5 }]} 
                  onPress={handleNextStep} 
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color={THEME.bg} /> : (<><Text style={[styles.actionBtnText, { color: THEME.bg }]}>{authMode === 'login' ? 'ACESSAR CONTA' : 'SOLICITAR TOKEN'}</Text><ArrowRight size={20} color={THEME.bg} /></>)}
                </TouchableOpacity>
            </ScrollView>
          </View>
        )}


        {authStep === 2 && (
          <View style={{ flex: 1 }}>
            <View style={styles.securityBadge}><ShieldCheck size={24} color={current.color} /><Text style={styles.securityText}>Token enviado para o celular cadastrado.</Text></View>
            <TerminalInput label="CÓDIGO DE 6 DÍGITOS" placeholder="000-000" color={current.color} keyboardType="numeric" icon={<Lock size={18} color={THEME.textDim} style={{marginRight: 10}}/>} value={formData.token} onChangeText={(t: string) => updateForm('token', t)} />
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: current.color }]} onPress={handleNextStep} disabled={loading}>
              {loading ? <ActivityIndicator color={THEME.bg} /> : (<><Text style={[styles.actionBtnText, { color: THEME.bg }]}>VALIDAR TOKEN</Text><Check size={20} color={THEME.bg} /></>)}
            </TouchableOpacity>
          </View>
        )}


        {authStep === 3 && (
          <View style={{ flex: 1 }}>
            <Text style={{color: THEME.textDim, marginBottom: 20}}>Defina sua senha de acesso.</Text>
            <TerminalInput ref={passRef} label="CRIAR SENHA" placeholder="••••••••" color={current.color} isPassword icon={<Key size={18} color={THEME.textDim} style={{marginRight: 10}}/>} value={formData.password} onChangeText={(t: string) => updateForm('password', t)} returnKeyType="next" onSubmitEditing={() => confirmPassRef.current?.focus()} />
            <TerminalInput ref={confirmPassRef} label="CONFIRMAR SENHA" placeholder="••••••••" color={current.color} isPassword icon={<Key size={18} color={THEME.textDim} style={{marginRight: 10}}/>} value={formData.confirmPassword} onChangeText={(t: string) => updateForm('confirmPassword', t)} returnKeyType="done" onSubmitEditing={handleNextStep} />
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: current.color }]} onPress={handleNextStep}>
              <Text style={[styles.actionBtnText, { color: THEME.bg }]}>FINALIZAR</Text><ShieldCheck size={20} color={THEME.bg} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* FIX ANDROID: behavior="padding" pode causar tela branca se não tiver height definido. */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: THEME.bg }}>
            <RadarBackground />
            <View style={styles.landingHeader} pointerEvents="box-none"><Text style={styles.landingLogo}>IRVO.</Text><View style={[styles.statusTag, { borderColor: navLevel === 'root' ? 'rgba(255,255,255,0.1)' : THEME.gold }]}><View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: navLevel === 'root' ? THEME.green : THEME.gold }} /><Text style={styles.statusText}>{navLevel === 'root' ? 'SISTEMA OPERACIONAL' : 'TERMINAL SEGURO'}</Text></View></View>
            <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: sheetTranslateY }] }]}>
                {navLevel === 'root' && <Animated.View style={{opacity: contentOpacity}}>{renderRoot()}</Animated.View>}
                {navLevel === 'sub_hire' && <Animated.View style={{opacity: contentOpacity}}>{renderSubHire()}</Animated.View>}
                {navLevel === 'sub_work' && <Animated.View style={{opacity: contentOpacity}}>{renderSubWork()}</Animated.View>}
                {navLevel === 'form' && <Animated.View style={{opacity: contentOpacity, flex: 1}}>{renderForm()}</Animated.View>}
            </Animated.View>
            <Modal visible={showTermsModal} animationType="slide" transparent={true}><View style={styles.modalOverlay}><View style={styles.modalContent}><Text style={styles.modalTitle}>Protocolo de Adesão</Text><ScrollView style={{ flex: 1 }}><Text style={styles.legalBody}>{selectedRole?.includes('client') ? LEGAL_DOCS.TERMS_CLIENT : LEGAL_DOCS.TERMS_PROVIDER}{'\n\n'}{LEGAL_DOCS.PRIVACY}</Text></ScrollView><TouchableOpacity onPress={()=>onLoginSuccess(selectedRole||'client_pf')} style={[styles.modalCloseBtn, {backgroundColor: selectedRole?.includes('provider') ? THEME.green : THEME.white}]}><Text style={styles.modalCloseText}>LI E ACEITO</Text></TouchableOpacity></View></View></Modal>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};


// ============================================================================
// 8. COMPONENTE PRINCIPAL (ROOT)
// ============================================================================


export default function App() {
  const [appState, setAppState] = useState<'splash' | 'auth' | 'cockpit'>('splash');
  const [userRole, setUserRole] = useState(''); 


  const handleLoginSuccess = (role: string) => {
    setUserRole(role);
    setAppState('cockpit');
  };


  if (appState === 'splash') return <SplashBigBang onComplete={() => setAppState('auth')} />;
  
  if (appState === 'cockpit') return <CockpitScreen userRole={userRole} onLogout={() => setAppState('auth')} />;
  
  return <LandingScreen onLoginSuccess={handleLoginSuccess} />;
}


// ============================================================================
// 9. ESTILOS GLOBAIS (ESTÉTICA LUXO BRUTALISTA - FULL SET)
// ============================================================================


const styles = StyleSheet.create({
  // --- ESTILOS ORIGINAIS (PRESERVADOS) ---
  splashContainer: { flex: 1, backgroundColor: THEME.bg, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { width: 100, height: 100, borderRadius: 35, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1.5, borderColor: THEME.white, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 60, fontWeight: '900', color: THEME.white },
  textContainer: { position: 'absolute', bottom: height * 0.15, height: 40, justifyContent: 'center', alignItems: 'center', width: '100%' },
  slogan: { color: THEME.gold, fontSize: 11, letterSpacing: 3, fontWeight: 'bold', textAlign: 'center' },


  landingHeader: { position: 'absolute', top: 60, width: '100%', alignItems: 'center', zIndex: 10 },
  landingLogo: { fontSize: 32, fontWeight: '900', color: THEME.white, letterSpacing: -1 },
  statusTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1 },
  statusText: { color: THEME.textDim, fontSize: 8, letterSpacing: 2, fontWeight: 'bold' },
  
  radarCircle: { position: 'absolute', borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },


  // IMPORTANTE: Elevation para Android não ficar branco
  bottomSheet: { 
    position: 'absolute', top: 0, left: 0, right: 0, height: height, 
    backgroundColor: THEME.zinc900, 
    borderTopLeftRadius: 40, borderTopRightRadius: 40, 
    padding: 32,
    borderTopWidth: 1, borderColor: THEME.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.5, shadowRadius: 30, 
    elevation: 20, // CRÍTICO PARA ANDROID
    zIndex: 50 
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: THEME.zinc800, borderRadius: 2, alignSelf: 'center', marginBottom: 24, marginTop: 10 },
  sheetTitle: { color: THEME.white, fontSize: 20, fontWeight: '900', letterSpacing: 2, marginBottom: 24, textAlign: 'center' },
  footerText: { color: THEME.zinc800, fontSize: 10, letterSpacing: 2, fontWeight: 'bold', textAlign: 'center', marginTop: 32 },


  btn: { height: 64, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '900', letterSpacing: 1 },
  
  macroBtn: { height: 80, borderRadius: 24, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 16, backgroundColor: 'rgba(255,255,255,0.05)' },
  macroIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  macroTitle: { color: THEME.white, fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  macroSubtitle: { color: THEME.textDim, fontSize: 12 },


  toggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  toggleText: { fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },


  socialBtn: { flex: 1, height: 50, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1, borderColor: THEME.border },
  socialBtnText: { color: THEME.white, fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },


  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: THEME.zinc800 },
  dividerText: { color: THEME.textDim, fontSize: 10, fontWeight: 'bold', marginHorizontal: 10 },


  formTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  inputLabel: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', height: 60, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, borderWidth: 1, paddingHorizontal: 20 },
  input: { flex: 1, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  
  actionBtn: { height: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  actionBtnText: { fontWeight: '900', letterSpacing: 1, fontSize: 16 },


  securityBadge: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, marginBottom: 24 },
  securityText: { color: THEME.textDim, fontSize: 12, flex: 1, lineHeight: 18 },


  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContent: { height: '60%', backgroundColor: THEME.zinc900, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: THEME.border, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justify: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.white },
  legalBody: { color: THEME.textDim, fontSize: 14, lineHeight: 22 },
  modalCloseBtn: { marginTop: 20, backgroundColor: THEME.white, padding: 16, borderRadius: 12, alignItems: 'center' },
  modalCloseText: { color: THEME.bg, fontWeight: 'bold', fontSize: 16 },
  
  // ESTILOS LEGADOS (MANTIDOS PARA COMPATIBILIDADE COM CÓDIGO MORTO/LEGADO)
  cockpitHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, paddingTop: 50, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 1, zIndex: 90 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.white, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  searchBar: { position: 'absolute', top: 140, width: width - 48, alignSelf: 'center', height: 50, backgroundColor: THEME.zinc900, borderRadius: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  bottomDock: { position: 'absolute', bottom: 40, width: width - 48, alignSelf: 'center', height: 80, alignItems: 'center', justifyContent: 'center' },
  mainActionBtn: { width: '100%', height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  businessBadge: { position: 'absolute', top: 200, right: 24, padding: 12, backgroundColor: THEME.gold, borderRadius: 12, alignItems: 'flex-end', shadowColor: THEME.gold, shadowOpacity: 0.3, shadowRadius: 10 },
  onlineBtn: { width: '100%', height: 80, borderRadius: 24, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  statCard: { flex: 1, height: 100, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statValue: { color: THEME.gold, fontSize: 24, fontWeight: '900', marginTop: 8 },
  statLabel: { color: THEME.textDim, fontSize: 10, letterSpacing: 1 },
  docOption: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: THEME.border },


  // --- NOVOS ESTILOS FASE 4/5 (BRUTALIST / TÁTICO) ---
  hudContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: 90, paddingTop: 45, backgroundColor: 'rgba(0,0,0,0.95)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, justifyContent: 'space-between', zIndex: 100, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  hudLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hudCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hudRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  hudText: { color: THEME.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.green },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: THEME.red, paddingHorizontal: 8, paddingVertical: 4 },
  logoutText: { color: THEME.red, fontSize: 10, fontWeight: 'bold' },
  regionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: THEME.gold },
  regionText: { color: THEME.gold, fontSize: 9, fontWeight: '900' },


  reactorContainer: { backgroundColor: 'rgba(10, 10, 10, 0.95)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', padding: 0 },
  rankHeader: { backgroundColor: THEME.gold, paddingVertical: 8, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankLabel: { color: '#000', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  rankValue: { color: '#000', fontSize: 14, fontWeight: '900', letterSpacing: 1 },


  reactorMatrix: { padding: 20, gap: 16 },
  metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  metricLabel: { color: THEME.textDim, fontSize: 10, width: 100, fontWeight: 'bold' },
  metricLine: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.1)' },
  metricValue: { color: THEME.white, fontSize: 12, fontWeight: 'bold', width: 40, textAlign: 'right' },


  scoreTotalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 20, paddingVertical: 16 },
  scoreTotalLabel: { color: THEME.textDim, fontSize: 10, letterSpacing: 2 },
  scoreTotalValue: { color: THEME.gold, fontSize: 32, fontWeight: '900', letterSpacing: -2 },


  scanBtn: { backgroundColor: THEME.white, height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 0 },
  scanBtnText: { color: '#000', fontSize: 14, fontWeight: '900', letterSpacing: 2 },


  cockpitHeaderNew: { position: 'absolute', top: 90, left: 0, right: 0, paddingVertical: 20, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, backgroundColor: 'transparent' },
  headerLogo: { fontSize: 24, fontWeight: '900', letterSpacing: 3, color: THEME.white },
  menuBtn: { padding: 8 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  backBtnText: { color: THEME.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },


  cockpitContent: { flex: 1, paddingHorizontal: 24, paddingTop: 160 },
  welcomeSubtitle: { fontSize: 10, color: THEME.textDim, letterSpacing: 3, marginBottom: 8, fontWeight: 'bold' },
  welcomeTitle: { fontSize: 32, fontWeight: '300', color: THEME.white, lineHeight: 38 },
  
  sectionTitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 3, color: THEME.gold, textTransform: 'uppercase' },
  subTitle: { fontSize: 24, fontWeight: '300', color: THEME.white, marginBottom: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a' },
  tagText: { fontSize: 8, color: THEME.textDim, fontWeight: 'bold' },


  modesGrid: { gap: 12 },
  modeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderWidth: 1, borderColor: '#27272a', backgroundColor: 'rgba(9, 9, 11, 0.6)' },
  modeHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  modeIconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  modeLabel: { fontSize: 14, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  modeDesc: { fontSize: 12, color: THEME.textDim },
  
  catCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderWidth: 1, borderColor: '#27272a', backgroundColor: 'rgba(9, 9, 11, 0.6)' },
  catLabel: { fontSize: 14, fontWeight: '300', color: THEME.white, letterSpacing: 1 },


  serviceCard: { padding: 20, borderWidth: 1, borderColor: '#27272a', backgroundColor: 'rgba(9, 9, 11, 0.95)' },
  serviceName: { fontSize: 16, fontWeight: '500', color: THEME.white },
  serviceUnit: { fontSize: 10, color: THEME.textDim, marginTop: 4, textTransform: 'uppercase' },
  servicePriceLabel: { fontSize: 10, color: THEME.textDim, textAlign: 'right' },
  servicePrice: { fontSize: 14, color: THEME.white, fontWeight: 'bold', textAlign: 'right' },
  dividerLine: { height: 1, backgroundColor: '#27272a', marginVertical: 12 },
  checklistText: { fontSize: 10, color: THEME.textDim },
  requestBtnSmall: { marginTop: 16, backgroundColor: THEME.white, paddingVertical: 10, alignItems: 'center' },
  requestBtnTextSmall: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  certBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.3)' },
  certText: { color: THEME.gold, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 }
});