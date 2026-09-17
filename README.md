# Hotel Ipê Dourado

Site institucional e motor de reservas do **Hotel Ipê Dourado**, um resort fictício de padrão
internacional (praia + montanha). Projeto de demonstração: nenhuma cobrança real é processada e
nenhum hóspede é real.

🔗 Deploy: `https://hotel-ipe-dourado.vercel.app` (via Vercel, deploy automático a cada push em `main`)

## Stack

| Camada | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| Framework | Next.js 16 (App Router, React 19, Server Components + Server Actions) |
| Estilização | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Animações | Framer Motion (`motion/react`) + carrossel 3D do [Aceternity UI](https://ui.aceternity.com/components/carousel) |
| Banco de dados / Auth / Storage | Firebase (Firestore + Firebase Auth + Firebase Storage) |
| Pagamentos | Mercado Pago — **modo sandbox/teste** |
| Rate limiting | Upstash Redis |
| Analytics | PostHog |
| Hospedagem | Vercel |

## Funcionalidades

- Home animada (hero com parallax, busca de reserva fixa, quartos em destaque, comodidades,
  galeria com carrossel 3D, depoimentos, localização).
- Quartos e Suítes: listagem com filtros (vista, capacidade, preço), página de detalhe com
  galeria em lightbox, política de cancelamento e widget de reserva.
- Conta do usuário: cadastro, login (e-mail/senha + Google), recuperação de senha, painel "Minha
  conta" com dados pessoais, endereço (com busca automática de CEP via ViaCEP) e histórico de
  reservas.
- Motor de reservas: verificação de disponibilidade em tempo real e **transação atômica do
  Firestore** ao criar a reserva (evita overbooking), geração de código localizador,
  cancelamento pelo painel do usuário.
- Pagamentos via Mercado Pago (Checkout Pro, sandbox) com webhook de confirmação.
- Painel administrativo (`/admin`, protegido por custom claim) para gerenciar reservas e preços.
- Rate limiting (Upstash) no login e na criação de reservas.
- Analytics de produto (PostHog) com mascaramento de campos sensíveis no session replay.

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha com suas credenciais (veja abaixo)
npm run dev
```

Sem nenhuma credencial configurada, o site sobe normalmente e é totalmente navegável — os
recursos que dependem de serviços externos (login, reservas, pagamento) exibem um aviso
explicando o que falta configurar, em vez de quebrar.

### Variáveis de ambiente

Veja [`.env.example`](./.env.example) para a lista completa. Resumo de onde obter cada uma:

| Variável | Onde obter |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Console do Firebase → Configurações do projeto → Seus apps → Web app |
| `FIREBASE_ADMIN_*` | Console do Firebase → Configurações do projeto → Contas de serviço → Gerar nova chave privada |
| `MERCADOPAGO_ACCESS_TOKEN` | [developers.mercadopago.com](https://developers.mercadopago.com) → Suas integrações → **Credenciais de teste** |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | [console.upstash.com](https://console.upstash.com) → Redis → Create database → REST API |
| `NEXT_PUBLIC_POSTHOG_KEY` | [app.posthog.com](https://app.posthog.com) → Project Settings → Project API Key |

Configure as mesmas variáveis no painel da Vercel (Project Settings → Environment Variables) para
o deploy em produção. **Nunca** commite `.env.local` — apenas `.env.example` fica versionado.

### Populando o Firestore com dados de exemplo

Depois de configurar as variáveis `FIREBASE_ADMIN_*`:

```bash
npm run seed
```

Isso cria as coleções `roomTypes` e `amenities` a partir dos dados em `src/lib/constants.ts`.

### Publicando as Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase use <seu-project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
```

As regras (`firestore.rules`, `storage.rules`) garantem que cada usuário só acessa seus próprios
dados (`users`, `addresses`, `reservations`) e que `roomTypes`/`amenities` têm leitura pública e
escrita restrita a administradores.

### Liberando o painel administrativo

O painel `/admin` exige uma custom claim `admin` no token do Firebase Auth. Depois que o usuário
já tiver feito cadastro no site:

```bash
npm run set-admin -- usuario@email.com
```

O usuário precisa sair e entrar novamente para o token ser atualizado com a nova claim.

### Testando pagamentos (Mercado Pago sandbox)

Com `MERCADOPAGO_ACCESS_TOKEN` configurado (credenciais de **teste**), use os [cartões de teste
do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/cards)
para simular aprovação/recusa. Sem essa variável configurada, o fluxo de reserva simula a
aprovação automaticamente para permitir testar a experiência completa ponta a ponta.

## Estrutura do projeto

```
src/
  app/            rotas do App Router (páginas, layouts, Server Actions, Route Handlers)
  components/     componentes React organizados por domínio (layout, home, rooms, booking, auth,
                  account, admin, contato, providers, shared, ui)
  hooks/          hooks compartilhados (use-cep, use-auth via provider, use-reservations...)
  lib/            integrações e lógica de servidor (firebase, mercadopago, upstash, posthog,
                  validações Zod, tipos, dados de exemplo)
scripts/          scripts utilitários (seed, set-admin)
firestore.rules, firestore.indexes.json, storage.rules
```

## Deploy e integração contínua

O repositório está conectado a um projeto na Vercel: todo push na branch `main` dispara um novo
deploy automaticamente. Pull requests geram deploys de preview.

## Domínio próprio e Cloudflare (opcional)

O projeto roda no domínio gratuito da Vercel. Para usar um domínio próprio com Cloudflare na
frente (WAF, proteção DDoS, DNS):

1. Registre o domínio (Registro.br para `.com.br`, Namecheap para `.com`) e ative 2FA + travamento
   de transferência (registry lock).
2. Adicione o domínio à Vercel (Project Settings → Domains).
3. Crie uma zona no Cloudflare para o domínio, aponte o DNS conforme instruído pela Vercel e
   ative o proxy (nuvem laranja) para esconder o IP de origem.
4. Configure SSL/TLS como "Full (strict)" no Cloudflare.

## Segurança

- Ative 2FA no GitHub, na Vercel, no Mercado Pago e no registrador de domínio.
- Nunca use credenciais de produção do Mercado Pago neste projeto — apenas sandbox/teste.
- Firestore/Storage Security Rules restritivas (ver acima).
