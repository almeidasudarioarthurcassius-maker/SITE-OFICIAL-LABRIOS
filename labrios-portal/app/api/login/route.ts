import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '../../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Campos em branco.' }, { status: 400 });
    }

    const supabaseService = createServiceClient();
    
    // Busca usuário admin
    const { data: user, error } = await supabaseService
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return NextResponse.json({ message: 'Usuário ou senha incorretos.' }, { status: 401 });
    }

    // Valida o hash da senha usando RPC estrito do postgres crypt pgcrypto
    const { data: valid, error: rpcError } = await supabaseService
      .rpc('verify_admin_password', { 
        input_username: username, 
        input_password: password 
      });

    if (rpcError || !valid) {
      return NextResponse.json({ message: 'Usuário ou senha incorretos.' }, { status: 401 });
    }

    // Cria resposta e injeta cookie de sessão criptografada simples para o Middleware
    const res = NextResponse.json({ success: true });
    res.cookies.set('labrios_admin_session', 'authenticated_token_active', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 3, // 3 horas
      path: '/',
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ message: 'Erro interno.' }, { status: 500 });
  }
}
