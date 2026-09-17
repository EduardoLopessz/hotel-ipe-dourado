# Prompt: Site do Hotel Ipê Dourado

2026-09-17 · @Someone

Este documento reúne um prompt completo para gerar, com uma ferramenta de código, o site fictício do Hotel Ipê Dourado — hospedado na Vercel com banco de dados Firebase.

## 1. Visão geral do projeto

O objetivo é criar o site institucional e de reservas do **Hotel Ipê Dourado**, um resort fictício de padrão internacional (praia + montanha, posicionamento de luxo acessível). O site deve funcionar como vitrine da marca e como plataforma funcional de reservas, com cadastro de usuários, consulta de CEP e um fluxo de reserva de quartos completo — do jeito que um hóspede real usaria em produção, mesmo sendo um projeto fictício.

Hospedagem: **Vercel**. Banco de dados, autenticação e armazenamento: **Firebase** (Firestore + Firebase Auth + Firebase Storage).

## 2. Stack tecnológica (mercado de set/2026)

| Camada | Tecnologia | Por quê |
| --- | --- | --- |
| Linguagem principal | TypeScript | Padrão de mercado sobre JavaScript puro, tipagem reduz bugs em produção |
| Framework frontend/full-stack | Next.js 15+ (App Router, React 19, Server Components + Server Actions) | Combina frontend e backend, integração nativa com Vercel |
| Estilização | Tailwind CSS + shadcn/ui | Agilidade e consistência visual, fácil de animar |
| Animações | Framer Motion (motion/react) | Padrão de mercado para microinterações e transições |
| Backend/API | Route Handlers do Next.js (Node.js runtime) | Evita servidor separado |
| Banco de dados, autenticação e storage | Firebase (Firestore + Firebase Auth + Firebase Storage) | Tudo em um único serviço, plano gratuito (Spark) generoso |
| Pagamentos | Mercado Pago, em modo de teste (sandbox) | Nunca processar cobranças reais de um negócio fictício |
| Cache e rate limiting | Upstash Redis | Protege login e reservas contra brute-force/bots, free tier serverless |
| Analytics de produto | PostHog | Free tier de até 1M eventos/mês |
| DNS, CDN e segurança de borda | Cloudflare | WAF e proteção DDoS grátis, esconde o IP de origem |
| Hospedagem | Vercel (plano Hobby) | Já em uso, sem limite real de projetos no free tier |
| Domínio | Registro.br (.com.br) ou Namecheap (.com) | Ativar 2FA e travamento de transferência (registry lock) |
| Versionamento | Git + GitHub | Repositório do projeto, 2FA ativado |

Essa combinação (TypeScript + Next.js + Firebase + Vercel) roda majoritariamente em camadas gratuitas — o único custo praticamente inevitável é o registro do domínio. Python segue liderando IA/dados no mercado, mas não é o foco deste projeto.

## 3. Design, animações e experiência do usuário

- Hero em vídeo/imagem full-screen com parallax sutil e scroll animado (fade-in, slide-up por seção).
- Barra de busca de reserva fixa (datas, hóspedes, quartos) com efeito "sticky" ao rolar a página.
- Galeria de fotos com transições suaves (lightbox animado) — usar bancos de imagens livres (Unsplash/Pexels) de hotéis, quartos, piscinas e spa.
- Microinterações em botões, cards de quartos e formulários (hover, loading skeletons, toasts de confirmação).
- Design responsivo mobile-first, com dark/light mode opcional.
- Acessibilidade básica (contraste, foco de teclado, textos alternativos nas imagens).

## 4. Funcionalidades e páginas

**Páginas públicas**

- Home (hero, destaques, tipos de quarto, comodidades, depoimentos, mapa/localização)
- Quartos e Suítes (lista com filtros: capacidade, preço, vista)
- Página de detalhe do quarto (galeria, comodidades, política de cancelamento)
- Comodidades/Lazer (piscina, spa, restaurante, academia)
- Sobre o hotel / Contato

**Conta do usuário**

- Cadastro (nome, e-mail, senha, telefone, endereço com CEP)
- Login/logout (Firebase Auth: e-mail+senha e login social opcional, ex. Google)
- Recuperação de senha
- Painel "Minha conta": dados pessoais, histórico e status das reservas

**Motor de reservas** (o termo técnico é **booking engine**, ou "sistema de reservas")

- Seleção de datas de check-in/check-out (calendário com bloqueio de datas indisponíveis)
- Seleção de número de hóspedes e quarto
- Verificação de disponibilidade em tempo real (consulta ao Firestore)
- Resumo do pedido com preço total, taxas e política de cancelamento
- Pagamento via Mercado Pago, em modo de teste (sandbox)
- Confirmação de reserva (e-mail de confirmação simulado) e geração de um código/localizador de reserva
- **Importante:** usar uma transação atômica do Firestore ao criar a reserva, verificando e travando a disponibilidade do quarto na mesma operação — evita que dois usuários reservem o mesmo quarto na mesma data (overbooking)
- Cancelamento/edição de reserva pelo painel do usuário

**Painel administrativo (opcional, recomendado)**

- Login restrito para gestão de quartos, preços e reservas recebidas

## 5. Integração com API de CEP

Os Correios não oferecem uma API pública gratuita e simples para consulta de CEP; na prática, o mercado usa APIs que consultam essa base, como **ViaCEP** (viacep.com.br, gratuita) ou **BrasilAPI**. O prompt deve pedir explicitamente:

- No formulário de cadastro e no formulário de endereço de cobrança, o usuário digita o CEP e o sistema preenche automaticamente rua, bairro, cidade e estado via requisição a `https://viacep.com.br/ws/{cep}/json/`.
- Validação de CEP inválido/inexistente com mensagem de erro amigável.
- Loading state (spinner) durante a busca.
- **Importante:** fazer essa busca diretamente do navegador (client-side), nunca dentro de uma Cloud Function do Firebase — chamadas de rede externas em Cloud Functions exigem o plano pago Blaze, mesmo havendo camada gratuita.

## 6. Modelagem de dados no Firebase (Firestore)

| Coleção | Documentos / principais campos |
| --- | --- |
| `users` (espelha o Firebase Auth) | uid, nome, e-mail, telefone |
| `addresses` (subcoleção de `users`) | cep, rua, bairro, cidade, estado, número, complemento |
| `roomTypes` | nome, descrição, capacidade, preçoDiaria, fotos\[\] |
| `rooms` | roomTypeId, número, andar |
| `reservations` | userId, roomTypeId, checkIn, checkOut, hóspedes, status, valorTotal, códigoLocalizador, paymentId (Mercado Pago) |
| `amenities` | nome, ícone, descrição |

Usar Firebase Security Rules restritivas: cada usuário só lê/edita seus próprios documentos em `users`, `addresses` e `reservations`; `roomTypes` e `amenities` ficam com leitura pública e escrita restrita a administradores.

## 7. Repositório GitHub e deploy na Vercel

- Criar repositório no GitHub (ex.: `hotel-ipe-dourado`), com `.gitignore` para Node/Next.js, README explicando o projeto e as variáveis de ambiente necessárias (`.env.example`).
- Estrutura de commits organizada (ex.: setup inicial, autenticação, motor de reservas, integração CEP, pagamentos, estilização/animações).
- Conectar o repositório à Vercel para deploy automático a cada push na branch principal.
- Variáveis de ambiente configuradas tanto localmente (`.env.local`) quanto no painel da Vercel — nunca commitadas: chaves do Firebase, do Mercado Pago (sandbox), do Upstash Redis e do PostHog.
- Ativar autenticação de dois fatores (2FA) no GitHub, na Vercel, no Mercado Pago e no registrador de domínio.

## 8. Referências visuais

Usar como inspiração de layout, hierarquia visual e fluxo de reserva sites como Belmond, Four Seasons, Fasano e Booking.com/Airbnb (para o fluxo de busca e checkout), sem copiar identidade visual ou conteúdo — apenas o padrão de UX de mercado.

## 9. Prompt final (copiar e colar em uma ferramenta de código)

Crie um site completo para o "Hotel Ipê Dourado", um resort fictício de padrão internacional. Use a stack mais utilizada atualmente no mercado de desenvolvimento web: TypeScript, Next.js 15+ (App Router, React 19, Server Components e Server Actions), Tailwind CSS com shadcn/ui para os componentes, e Framer Motion para animações. Backend via Route Handlers do próprio Next.js.

Banco de dados, autenticação e armazenamento: Firebase (Firestore, Firebase Auth e Firebase Storage), no plano gratuito (Spark). Hospedagem: Vercel (plano Hobby).

O site deve ser animado, moderno e intuitivo, com:

- Hero em vídeo/imagem full-screen com parallax e animações de entrada por seção ao rolar a página.
- Fotos reais de hotéis, quartos, piscina e spa obtidas de bancos de imagens livres (Unsplash/Pexels).
- Barra de busca de reserva fixa (datas, hóspedes) e microinterações em botões e cards.
- Design responsivo mobile-first, com modo claro/escuro.

Páginas: Home, Quartos e Suítes (com filtros), detalhe do quarto, Comodidades, Sobre/Contato.

Funcionalidades de conta de usuário:

- Cadastro e login via Firebase Auth (e-mail/senha).
- Formulário de endereço com campo de CEP que, ao ser preenchido, busca automaticamente rua, bairro, cidade e estado através da API ViaCEP (https://viacep.com.br/ws/{cep}/json/), feita diretamente do navegador (client-side) — nunca dentro de uma Cloud Function, para não exigir o plano pago do Firebase — com tratamento de erro para CEP inválido.
- Painel "Minha conta" com dados pessoais e histórico de reservas.

Motor de reservas (booking engine):

- Calendário de check-in/check-out com bloqueio de datas indisponíveis.
- Seleção de número de hóspedes e tipo de quarto, com verificação de disponibilidade em tempo real no Firestore.
- Resumo do pedido com preço total e política de cancelamento.
- Pagamento via Mercado Pago, em modo de teste (sandbox) — nunca processar cobranças reais, já que o hotel é fictício.
- Ao confirmar a reserva, use uma transação atômica do Firestore para checar e travar a disponibilidade do quarto na mesma operação, evitando que duas pessoas reservem o mesmo quarto na mesma data (overbooking).
- Geração de um código localizador de reserva, com opção de cancelar/editar a reserva depois.

Modele no Firestore as coleções: users (espelhando dados do Firebase Auth), addresses (subcoleção de users), roomTypes, rooms, reservations (incluindo o paymentId do Mercado Pago) e amenities. Escreva Firebase Security Rules restritivas: cada usuário só acessa seus próprios dados; roomTypes e amenities são de leitura pública.

Adicione também:

- Upstash Redis para rate limiting no login e no fluxo de reserva (evitar brute-force e bots).
- PostHog para analytics de produto, mascarando campos sensíveis (CEP, endereço, telefone) no session replay.
- Cloudflare como DNS/CDN na frente do domínio, para WAF e proteção contra DDoS.

Use como referência de UX e fluxo de reserva sites como Belmond, Four Seasons, Fasano e Booking.com, sem copiar identidade visual.

Por fim, crie um repositório no GitHub para o projeto (com README, .gitignore adequado para Next.js/Node e .env.example para as variáveis do Firebase, Mercado Pago, Upstash e PostHog), organize o histórico em commits lógicos por etapa (setup, autenticação, motor de reservas, integração de CEP, pagamentos, estilização) e envie (push) todo o código para esse repositório.

💡 Lembre-se de manter o Mercado Pago em modo de teste, usar o plano gratuito (Spark) do Firebase e ajustar o nome do hotel ou alguma funcionalidade antes de rodar — o prompt acima já está pronto para ser colado em uma ferramenta como Claude Code.
