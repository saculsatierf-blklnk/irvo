import {
  Scissors, Code, Hammer, GraduationCap, Stethoscope, Shield, Brain, Truck, Anchor, Leaf
} from 'lucide-react';
import { ServiceCategory } from '../types';

export const THEME = {
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

export const SLOGANS = [
  "Conectando serviços a pessoas",
  "Connecting services to people",
  "Relier les services aux personnes",
  "Verbindet Dienste mit Menschen",
  "サービスと人々をつなぐ"
];

export const LEGAL_DOCS = {
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

export const REGIONAL_MULTIPLIERS = {
  SP: 1.5,   // Cidadela (Vila Olímpia/Itaim)
  RJ: 1.4,   // Alerta Máximo (Zona Sul)
  BSB: 1.45, // Eixo de Poder (Lago Sul)
  NE: 1.8,   // Sazonal Elite (Trancoso/Maceió)
  SUL: 1.2,  // Polo Tecnológico/Agro Civil
  CO: 1.4,   // Agro Power (Goiânia/Cuiabá)
  NO: 1.3,   // Fronteira Logística (AM/PA)
  OTHER: 0.8 // Deflator Regional
};

export const MODES = {
  home: { id: 'home' as const, label: 'DELIVERY (EM CASA)', desc: 'O profissional vai até sua residência.', color: '#60a5fa', bg: 'rgba(30, 58, 138, 0.2)', border: '#1e3a8a' },
  site: { id: 'site' as const, label: 'LOCAL (IR AO LOCAL)', desc: 'Você se desloca até o estabelecimento.', color: '#c084fc', bg: 'rgba(88, 28, 135, 0.2)', border: '#581c87' },
  online: { id: 'online' as const, label: 'REMOTO (ONLINE)', desc: 'Atendimento via link seguro criptografado.', color: '#34d399', bg: 'rgba(6, 78, 59, 0.2)', border: '#064e3b' }
};

export const TIERS = {
  standard: { id: 'standard' as const, label: 'STANDARD', multiplier: 1.0, desc: 'Profissional verificado. Protocolo padrão.', color: '#a1a1aa', borderColor: '#27272a' },
  plus: { id: 'plus' as const, label: 'PLUS', multiplier: 1.25, desc: 'Alta avaliação (4.8+). Prioridade de agenda.', color: '#ffffff', borderColor: '#ffffff' },
  prime: { id: 'prime' as const, label: 'PRIME ELITE', multiplier: 1.6, desc: 'Seguro R$ 50k + Curadoria Manual + NDA.', color: '#eab308', borderColor: '#eab308' }
};

export const DATA_STORE_CORE: Record<string, ServiceCategory> = {
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

export const DATA_STORE_OMEGA: Record<string, ServiceCategory> = {
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

export const DATA_STORE: Record<string, ServiceCategory> = { ...DATA_STORE_CORE, ...DATA_STORE_OMEGA };

export const calculateSovereignPrice = (base: number, region: string, tierMultiplier: number = 1.0) => {
  const isCoreRegion = Object.keys(REGIONAL_MULTIPLIERS).includes(region);
  const regionKey = (isCoreRegion ? region : 'OTHER') as keyof typeof REGIONAL_MULTIPLIERS;
  const regionMult = REGIONAL_MULTIPLIERS[regionKey];
  return base * regionMult * tierMultiplier;
};

export const formatCurrency = (val: number) => {
  return 'R$ ' + val.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const getSortedCategories = (region: string): ServiceCategory[] => {
  const categories = Object.values(DATA_STORE);
  
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

  return [...categories].sort((a, b) => {
    const scoreA = regionalPriority.indexOf(a.id) !== -1 ? regionalPriority.indexOf(a.id) : 99;
    const scoreB = regionalPriority.indexOf(b.id) !== -1 ? regionalPriority.indexOf(b.id) : 99;
    return scoreA - scoreB;
  });
};
