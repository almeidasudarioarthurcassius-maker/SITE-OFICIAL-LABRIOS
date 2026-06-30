import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada.');
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
}

export type Equipamento = {
  id: number; nome: string; marca: string; modelo: string;
  finalidade: string | null; imagem_url: string | null; quantidade: number;
};
export type MembroEquipe = {
  id: number; nome: string; cargo: string;
  imagem_url: string | null; lattes_url: string | null; ordem: number;
};
export type MembroComite = {
  id: number; nome: string; funcao: string;
  imagem_url: string | null; lattes_url: string | null;
};
export type Reserva = {
  id: number; equipamento_id: number; solicitante_nome: string;
  institicao: string; funcao: string; lattes_url: string;
  data_reserva: string; horario_inicial: string; horario_final: string;
  status: 'Pendente' | 'Aprovado'; created_at: string;
};
