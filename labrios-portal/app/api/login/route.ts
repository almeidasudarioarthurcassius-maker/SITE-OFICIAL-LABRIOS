// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();
    if (!email || !senha) {
      return NextResponse.json({ ok: false, message: 'Informe e-mail e senha.' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase.rpc('verificar_login', {
      p_email: email,
      p_senha: senha,
    });

    if (error) {
      return NextResponse.json({ ok: false, message: 'Erro ao validar login.' }, { status: 500 });
    }

    const sucesso = data && data.length > 0 && data[0].ok;
    if (!sucesso) {
      return NextResponse.json({ ok: false, message: 'E-mail ou senha incorretos.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, nome: data[0].nome });
    // Cookie de sessão simples — válido por 8 horas
    response.cookies.set('ltip_admin_session', email, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: 'Requisição inválida.' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('ltip_admin_session');
  return response;
}
