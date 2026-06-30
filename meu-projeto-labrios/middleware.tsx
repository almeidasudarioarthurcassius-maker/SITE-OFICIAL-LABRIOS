import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Captura as chaves diretamente para evitar falha se o processo atrasar para injetar
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Middleware: Chaves do Supabase não encontradas no ambiente.");
    return res;
  }

  try {
    const supabase = createMiddlewareClient({ req, res }, {
      supabaseUrl,
      supabaseKey
    });
    
    // Atualiza a sessão se ela existir
    await supabase.auth.getSession();
  } catch (error) {
    console.error("Erro no middleware de autenticação:", error);
  }

  return res;
}

// Garante que o middleware rode apenas nas rotas de admin
export const config = {
  matcher: ['/admin/:path*'],
};
