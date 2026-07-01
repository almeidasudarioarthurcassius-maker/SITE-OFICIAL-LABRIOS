import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas. ' +
    'Copie .env.local.example para .env.local e preencha com seus valores do Supabase.'
  );
}

// Cliente público — usado em Client Components e páginas públicas
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente com service role — usado APENAS em Route Handlers do servidor (nunca exposto ao browser)
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada.');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

// ─── Tipos TypeScript mapeando as tabelas do Supabase ───────────────────────

export type MembroEquipe = {
  id: number;
  nome: string;
  cargo: string;
  imagem_url: string | null;
  lattes_url: string | null;
  ordem: number;
  created_at?: string;
};

export type Equipamento = {
  id: number;
  nome_equipamento: string;
  quantidade: number;
  imagem_url: string | null;
  funcionalidade: string | null;
  status: 'disponivel' | 'manutencao' | 'reservado';
  tombo: string | null;
  especificacoes: string | null;
  created_at?: string;
};

export type Documento = {
  id: number;
  titulo: string;
  arquivo_url: string;
  categoria: string | null;
  data_upload: string;
  created_at?: string;
};

export type Solicitacao = {
  id: number;
  nome: string;
  email: string;
  equipamento: string;
  data_inicio: string | null;
  data_fim: string | null;
  finalidade: string | null;
  status: 'pendente' | 'aprovado' | 'negado';
  created_at?: string;
};
