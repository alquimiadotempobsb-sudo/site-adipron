# Adipron Informática — Website Institucional & Sistema Web

Sistema web profissional, moderno, responsivo e seguro desenvolvido para a **ADIPRON INFORMÁTICA** (Tecnologia, software de automação comercial e suporte tecnológico).

---

## 1. Visão Geral da Arquitetura

O projeto foi construído utilizando uma arquitetura **Full Stack robusta e desacoplada**:

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS.
  - Paleta visual clara e tecnológica (branco, azul-claro, azul corporativo e cinza suave).
  - Componentes modulares com UX fluida, tipografia *Plus Jakarta Sans*, sem poluição visual ou clichês de IA.
  - Design totalmente responsivo (testado de 320px a 1440px+).
  - SEO completo: meta tags, OpenGraph, Twitter Cards, Schema.org JSON-LD para serviços profissionais, `robots.txt` e `sitemap.xml`.
- **Backend:** Node.js + Express (`server.ts`).
  - Autenticação segura no backend para a área de Downloads. A senha **151621** reside exclusivamente no servidor (variável de ambiente `DOWNLOADS_ACCESS_KEY`) e nunca é exposta no código frontend ou avaliada no navegador.
  - Tokens de sessão criptografados via HMAC-SHA256 com expiração e comparação em tempo constante (`crypto.timingSafeEqual`).
  - Endpoint de download protegido (`/api/downloads/:id/file`) que valida o token de autorização antes de entregar o arquivo.
  - Formulário de contato com validação, sanitização, honeypot anti-spam, controle de taxa (rate limiting) e registro com encaminhamento para `adipron@gmail.com`.
  - Painel Administrativo completo para gestão dinâmica de Downloads, Parceiros, Planos, Suporte, Conteúdo Institucional e Mensagens.

---

## 2. Estrutura de Pastas

```text
/
├── public/
│   ├── robots.txt              # Diretrizes para indexadores de busca
│   └── sitemap.xml             # Mapa XML das páginas e âncoras
├── data/
│   ├── database.json           # Armazenamento persistente de dados
│   └── files/                  # Diretório de armazenamento de arquivos de download
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Menu superior fixo com drawer mobile
│   │   ├── Hero.tsx            # Apresentação principal e terminal visual de automação
│   │   ├── About.tsx           # Seção "Quem somos" com pilares institucionais
│   │   ├── Solutions.tsx       # Cards modernos de soluções em automação comercial
│   │   ├── Partners.tsx        # Parceiros (com mensagem padrão caso vazio)
│   │   ├── Plans.tsx           # Cards de planos com observação mandatória de não-venda
│   │   ├── Downloads.tsx       # Área protegida por senha de acesso e repositório dinâmico
│   │   ├── Support.tsx         # Central de recursos e ferramenta de suporte remoto
│   │   ├── Contact.tsx         # Formulário com validação, WhatsApp e e-mail
│   │   ├── Footer.tsx          # Rodapé institucional e link do painel administrativo
│   │   ├── FloatingWhatsapp.tsx# Botão flutuante com mensagem pré-definida
│   │   └── AdminModal.tsx      # Painel de gestão administrativa
│   ├── services/
│   │   └── api.ts              # Cliente HTTP desacoplado com gestão de tokens
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript rigorosas
│   ├── index.css               # Configurações de Tailwind CSS e tipografia
│   ├── main.tsx                # Entrada React
│   └── App.tsx                 # Composição principal e scrollspy
├── .env.example                # Modelo de variáveis de ambiente
├── metadata.json               # Configurações do applet
├── package.json                # Dependências e scripts de execução
├── server.ts                   # Servidor Express Full Stack e middleware do Vite
└── tsconfig.json               # Configuração TypeScript
```

---

## 3. Segurança e Regras Implementadas

1. **Proteção da Área de Downloads:**
   - Senha inicial fornecida pelo administrador: **`151621`**.
   - A senha **não existe** no código JavaScript do cliente.
   - O usuário digita a senha no portal de segurança, o formulário envia para `POST /api/auth/downloads/login`. O servidor faz a validação em tempo constante contra `process.env.DOWNLOADS_ACCESS_KEY` e devolve um token assinado por HMAC.
   - Qualquer tentativa de baixar arquivos sem o token válido resulta em `HTTP 401 Unauthorized`.

2. **Formulário de Contato e E-mail:**
   - Mensagens enviadas são processadas em `POST /api/contact` e registradas para encaminhamento a **`adipron@gmail.com`**.
   - Campo *honeypot* transparente para captura de robôs maliciosos.
   - Limite de taxa (Rate Limit) de no máximo 5 mensagens por IP a cada 10 minutos.

3. **Canais Telefônicos e WhatsApp:**
   - Telefone: **(61) 98441-8195**
   - Formato Internacional: **+55 61 98441-8195**
   - Botão flutuante e botão na página de contato configurados com a mensagem padrão:
     *"Olá! Gostaria de obter informações sobre as soluções da Adipron Informática."*

4. **Observação Mandatória sobre Planos:**
   - A seção de Planos contém o aviso destacado:
     > **Observação:** A Adipron Informática não realiza a venda do software. As informações apresentadas sobre planos e assinaturas têm caráter informativo. Para contratação, valores e condições comerciais, entre em contato com a empresa responsável pela comercialização.

5. **Parceiros:**
   - Inicialmente a lista de parceiros está vazia. O sistema apresenta a mensagem sutil requerida:
     *"Em breve apresentaremos nossos parceiros."*
   - O administrador pode cadastrar e remover parceiros a qualquer momento através do Painel Administrativo.

---

## 4. Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Iniciar servidor em desenvolvimento (Express + Vite)
npm run dev
```

O site estará acessível em `http://localhost:3000`.

---

## 5. Instruções para Publicação (Deploy)

### Opção A: Google Cloud Run / Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/types ./src/types
EXPOSE 3000
CMD ["npm", "start"]
```

### Opção B: VPS (Ubuntu / Debian com PM2)
```bash
# No servidor
git clone <url-do-repositorio> adipron-site
cd adipron-site
npm install
npm run build
pm2 start server.ts --name "adipron-web" --interpreter "tsx"
```

### Opção C: Domínio Próprio
Para associar a um domínio próprio (ex: `adipron.com.br` ou `adiproninformatica.com.br`):
1. No painel DNS do seu registrador (ex: Registro.br), crie um registro do tipo `A` apontando para o IP do seu servidor/Cloud Run.
2. Crie um registro `CNAME` para `www` apontando para o domínio principal.
3. Configure o certificado SSL gratuito via Let's Encrypt / Certbot ou utilize o gerenciamento automático de certificados do Cloud Run / Cloudflare.

---

## 6. Credenciais Administrativas Padrão

- **Acesso aos Downloads:** `151621`
- **Painel Administrativo:** `adipron.admin.2026` (ou `151621`)
- O administrador pode alterar as credenciais definindo as variáveis `DOWNLOADS_ACCESS_KEY` e `ADMIN_PIN` no arquivo `.env`.
