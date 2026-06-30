// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, senha } = await req.json();
    if (!email || !senha)
      return NextResponse.json({ ok: false, message: 'Informe e-mail e senha.' }, { status: 400 });

    const sb = createServiceClient();
    const { data, error } = await sb.rpc('verificar_login', { p_email: email, p_senha: senha });

    if (error || !data?.length || !data[0].ok)
      return NextResponse.json({ ok: false, message: 'E-mail ou senha incorretos.' }, { status: 401 });

    const response = NextResponse.json({ ok: true, nome: data[0].nome });
    response.cookies.set('labrios_admin_session', email, {
      httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 8, path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: 'Erro interno.' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('labrios_admin_session');
  return response;
}