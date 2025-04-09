# Basketball Betting Dashboard

Dashboard para acompanhamento de apostas de basquete.

## Funcionalidades

- Visualização de apostas por categoria.
- Análise de apostas por jogador
- Ranking geral de jogadores
- Relatórios detalhados
- Suporte a PWA para uso em dispositivos móveis

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/basketball-betting-dashboard.git

# Entre no diretório
cd basketball-betting-dashboard

# Instale as dependências
npm install

# Prepare os ícones para o PWA
npm run prepare-pwa

# Inicie o servidor de desenvolvimento
npm run dev
```

## Uso como PWA

O aplicativo pode ser instalado como um Progressive Web App (PWA) em dispositivos móveis e desktop:

1. Acesse o aplicativo em um navegador compatível (Chrome, Edge, Safari)
2. Um prompt de instalação aparecerá automaticamente ou você pode usar o menu do navegador para instalar
3. O aplicativo será instalado e poderá ser acessado como um aplicativo nativo

### Benefícios do PWA

- Acesso offline a funcionalidades básicas
- Experiência de aplicativo nativo
- Notificações push (quando implementadas)
- Atualizações automáticas

## Tecnologias utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Chart.js
- PWA

## Estrutura do projeto

```
basketball-betting-dashboard/
├── public/              # Arquivos estáticos
│   ├── icons/           # Ícones do PWA
│   ├── manifest.json    # Manifesto do PWA
│   ├── service-worker.js # Service Worker para funcionalidades offline
│   └── sw-register.js   # Script para registrar o Service Worker
├── src/
│   ├── app/             # Páginas da aplicação
│   ├── components/      # Componentes React
│   └── services/        # Serviços e APIs
└── scripts/             # Scripts utilitários
    ├── generate-icons.js # Gera ícones para o PWA
    └── svg-to-png.js    # Converte SVG para PNG
```

## Licença

MIT
