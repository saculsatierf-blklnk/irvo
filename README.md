# IRVO — Centro de Comando (Build 4.1 Estável)

> **Ecossistema Tático de Intermediação de Serviços de Alto Padrão & Luxo Brutalista**  
> *Conectando serviços a pessoas • Connecting services to people • サービスと人々をつなぐ*

---

## 🚀 Links de Deploy & Acesso Imediato

* **🌐 Deploy Online (Vercel):** [https://temporary-instant-sirocco-xdm95ro.vercel.app](https://temporary-instant-sirocco-xdm95ro.vercel.app)
* **🔑 Link de Reivindicação Permanente:** [Reivindicar Projeto no Vercel](https://vercel.com/claim-deployment?code=50720b89-9d3b-4838-b9f0-a4305a3f3c18)
* **💻 Acesso Local:** `http://localhost:3001` (ou `http://localhost:3000`)

---

## ⚡ Guia para o Desenvolvedor do Projeto

Este repositório contém a reconstrução fiel, completa e sem erros da especificação original **IRVO (Build 4.1 - Estável)**. Ele serve como o protótipo funcional de referência ("Gold Master") para orientar o desenvolvimento mobile nativo e web.

### O que foi corrigido em relação ao documento fonte:
1. **Eliminação do erro fatal de sintaxe (`Identifier 'LandingScreen' has already been declared`)**: O documento original concatenava pedaços de código com duas declarações da mesma tela.
2. **Implementação de `handleRequestService`**: A chamada que antes disparava erro agora abre a central completa de despacho e rastreamento de missão tática.
3. **Inclusão do Reator Tático (`ReactorModal`)**: Implementação dos estilos e métricas do Reator Soberano (Rank OMEGA-1, Score 988, Varredura Tática).
4. **Barra de Pesquisa e Filtro Instantâneo**: Localiza qualquer um dos 38 serviços e 10 categorias em tempo real.
5. **Seletor Rápido de Perfis no Topo**: Permite ao dev testar com 1 clique os 4 perfis de usuário (`PF`, `PJ Business`, `PRO Autônomo`, `PRO Parceiro`) sem precisar relogar.

---

## 🛠️ Arquitetura das Duas Versões

### 1. Versão Web de Demonstração ([`src/`](file:///Users/blacklink.com.br/.gemini/antigravity/scratch/irvo-app/src))
- **Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Lucide React + Web Audio API.
- **Alternador de Moldura:**
  - `📱 iPhone 16 Pro Frame`: Renderiza o chassi completo com Ilha Dinâmica, botões laterais e indicador inferior.
  - `🖥️ Fullscreen`: Expande para 100% da viewport para monitoramento de centro de comando.
- **Áudio Tático:** Efeitos sonoros gerados matematicamente por osciladores no navegador (cliques, pings de radar, alertas e despacho).

### 2. Versão Mobile Nativa ([`mobile/`](file:///Users/blacklink.com.br/.gemini/antigravity/scratch/irvo-app/mobile))
- **Stack:** React Native 0.76 + Expo 52 + Lucide React Native.
- Arquivo principal: [`mobile/App.tsx`](file:///Users/blacklink.com.br/.gemini/antigravity/scratch/irvo-app/mobile/App.tsx)
- Como rodar no dispositivo físico:
  ```bash
  cd mobile
  npm install
  npx expo start
  ```

---

## 🛰️ Módulos e Fluxos do Sistema

### 1. Splash Screen Big Bang
- Logo monograma `I` com rotação cúbica.
- Slogans multilíngues rotacionando a cada 750ms:
  - *Conectando serviços a pessoas* (PT)
  - *Connecting services to people* (EN)
  - *Relier les services aux personnes* (FR)
  - *Verbindet Dienste mit Menschen* (DE)
  - *サービスと人々をつなぐ* (JA)
- Zoom Big Bang ao finalizar ou tocar na tela.

### 2. Portal de Entrada & Onboarding (`LandingScreen`)
- Seleção de Perfil:
  - **CONTRATAR**: Para Mim (`client_pf`) ou IRVO Business (`client_pj` com saldo R$ 5.500,00 e bônus de 10%).
  - **PRESTAR**: Sou Autônomo (`provider_pf`) ou Empresa Parceira (`provider_pj`).
- Validação com máscaras de CPF, CNPJ, Telefone e checagem de maioridade (+18 anos).
- Verificação de token SMS de 6 dígitos.
- Definição e confirmação de senha mestra.
- Modal dos Termos Jurídicos e LGPD.

### 3. Cockpit Dual-Mode Engine (`CockpitScreen`)
- **Modo Contratante**:
  - Seleção do modo de operação:
    - `DELIVERY (EM CASA)`
    - `LOCAL (IR AO LOCAL)`
    - `REMOTO (ONLINE)`
  - Categorias ordenadas pela matriz de peso geopolítico da região ativa:
    - `SP` (1.5x), `RJ` (1.4x), `BSB` (1.45x), `NE` (1.8x), `SUL` (1.2x), `CO` (1.4x), `NO` (1.3x), `OTHER` (0.8x).
  - Tiers de serviço: Standard (1.0x), Plus (1.25x), Prime Elite (1.6x).
  - Checklists obrigatórios: Padlock bloqueia o pedido até 100% dos itens serem marcados.
- **Modo Prestador (IRVO PRO)**:
  - Verificação de identidade KYC (Biometria Facial Liveness + Upload de licença CRM/CREA/OAB).
  - Botão gigante `FICAR ONLINE` / `FICAR OFFLINE`.
  - Dashboard de Ganhos (24h) e chamados ativos.
  - Radar de demandas de perímetro em tempo real.

### 4. Central de Despacho & Rastreamento (`MissionTrackerModal`)
- Operador alocado com badge, certificações e avaliação.
- ETA regressivo e rastreamento tático no mapa de obsidiana.
- Canal de comunicação criptografado P2P (PGP 4096-bit).
- Botão de emergência SOS.

### 5. Reator Soberano (`ReactorModal`)
- Diagnóstico de telemetria, integridade do protocolo, latência de enclave, operadores conectados e botão de varredura tática.

---

## 📦 Como Subir para o GitHub do Dev

```bash
cd /Users/blacklink.com.br/.gemini/antigravity/scratch/irvo-app
git remote add origin <URL_DO_REPOSITORIO_GITHUB>
git branch -M main
git push -u origin main
```
