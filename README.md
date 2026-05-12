💧 AquaControl - Sistema de Gestão de Água
Sistema completo para gestão de leituras de hidrômetros, faturamento e controle de unidades.

🏗️ Arquitetura e Deploy
O projeto está dividido em três componentes principais, cada um operando em um ambiente específico para garantir escalabilidade e gratuidade no deploy.

💻 2. Frontend Web (Dashboard Administrativo)
Interface para administradores gerenciarem proprietários, unidades, realizarem leituras e gerarem faturas.

Tecnologias: React.js, Tailwind CSS, Axios, Lucide React.

Onde está sendo executado: Vercel

Configuração de Rotas: Utiliza um arquivo vercel.json para garantir que o roteamento SPA (React Router) funcione sem erros 404.

Integração: Conecta-se ao Backend via URL configurada no VITE_API_URL.

🚀 Como Rodar Localmente
 1. Clonar este repositório!
 2. Configurar o Frontend:
    
    a) Rode npm install.
    
    b) Crie um arquivo .env apontando para o seu backend local: VITE_API_URL=http://localhost:PORTA.
    
    c) Inicie com npm run dev.
