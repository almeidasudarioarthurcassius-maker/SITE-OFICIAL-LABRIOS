# LTIP Portal — Next.js 14 + Supabase

Portal do **Laboratório de Tecnologia da Informação do PROFÁGUA — LTIP**.

---

## Stack
- **Next.js 14** (App Router, Server Components)
- **Supabase** (Postgres + Storage)
- **TypeScript**
- CSS puro (variáveis CSS, sem Tailwind — mantém fidelidade 100% ao design original)

---

## Estrutura de Pastas

```
ltip-portal/
├── app/
│   ├── layout.tsx              ← Layout raiz (Navbar + Footer)
│   ├── page.tsx                ← Página inicial completa
│   ├── globals.css             ← Design original preservado
│   ├── equipe/page.tsx         ← Página pública da equipe
│   ├── inventario/page.tsx     ← Inventário público
│   ├── documentos/page.tsx     ← Repositório de documentos
│   └── admin/
│       ├── layout.tsx          ← Sidebar do painel admin
│       ├── page.tsx            ← Dashboard com estatísticas
│       ├── equipe/page.tsx     ← CRUD da equipe + upload de foto
│       ├── inventario/page.tsx ← CRUD do inventário + upload de imagem
│       └── documentos/page.tsx ← Upload e gestão de PDFs
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroSlider.tsx
│   ├── InventoryTable.tsx      ← Tabela com filtros de status
│   ├── SchedulingForm.tsx      ← Formulário de agendamento
│   └── Toast.tsx               ← Notificações
├── lib/
│   └── supabase.ts             ← Cliente Supabase + tipos TypeScript
├── supabase-migration.sql      ← Script SQL completo para configurar o banco
├── .env.local.example
└── next.config.js
```

---

## Configuração — Passo a Passo

### 1. Clone e instale dependências

```bash
git clone https://github.com/seu-usuario/ltip-portal.git
cd ltip-portal
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase (encontre em **Settings → API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### 3. Configure o banco de dados

No painel Supabase, acesse **SQL Editor** e execute o arquivo `supabase-migration.sql`.

Isso irá criar:
- Tabelas: `equipe`, `inventario`, `documentos`
- Políticas RLS de leitura pública
- Bucket de Storage `ltip-public`
- Dados iniciais de exemplo

### 4. Crie o bucket de Storage (se o SQL não criou)

No painel Supabase → **Storage → New Bucket**:
- Nome: `ltip-public`
- Marque: **Public bucket** ✅

### 5. Rode em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 6. Deploy na Vercel

```bash
# Ou conecte o repositório GitHub diretamente no painel Vercel
vercel --prod
```

Configure as mesmas variáveis de ambiente nas **Environment Variables** da Vercel.

---

## Tabelas do Banco

### `equipe`
| Campo       | Tipo    | Descrição                        |
|-------------|---------|----------------------------------|
| id          | bigint  | PK auto-incremental              |
| nome        | text    | Nome completo do membro          |
| cargo       | text    | Função/cargo                     |
| imagem_url  | text    | URL da foto (Supabase Storage)   |
| lattes_url  | text    | Link do Currículo Lattes         |
| ordem       | integer | Ordem de exibição na página      |

### `inventario`
| Campo            | Tipo   | Descrição                            |
|------------------|--------|--------------------------------------|
| id               | bigint | PK auto-incremental                  |
| nome_equipamento | text   | Nome do equipamento                  |
| quantidade       | int    | Quantidade disponível                |
| imagem_url       | text   | Foto do equipamento (Storage)        |
| funcionalidade   | text   | Descrição de uso nas pesquisas       |
| status           | enum   | disponivel / reservado / manutencao  |
| tombo            | text   | Número de patrimônio                 |
| especificacoes   | text   | Specs técnicas separadas por vírgula |

### `documentos`
| Campo       | Tipo        | Descrição                          |
|-------------|-------------|------------------------------------|
| id          | bigint      | PK auto-incremental                |
| titulo      | text        | Título do documento                |
| arquivo_url | text        | URL do PDF (Supabase Storage)      |
| categoria   | text        | Relatório / Regimento / Ata etc.   |
| data_upload | timestamptz | Data de publicação                 |

---

## Painel Administrativo

Acesse `/admin` — sem autenticação neste protótipo. Para produção, adicione Supabase Auth:

```typescript
// Exemplo com Supabase Auth no middleware
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
```

---

## Logo

Coloque o arquivo da logo em `public/images/logo-ltip.png`.
Se não encontrar o arquivo, o componente exibirá automaticamente o texto "LTIP".
