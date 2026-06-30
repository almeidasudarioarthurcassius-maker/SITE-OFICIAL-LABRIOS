'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Credenciais inválidas: ' + error.message);
    } else {
      router.push('/admin/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '20px', marginTop: '68px' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid var(--gray-200)', width: '100%', maxWidth: '420px', boxShadow: 'var(--shadow)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ background: 'var(--navy)', color: 'white', display: 'inline-block', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '20px', marginBottom: '12px' }}>LAB</div>
          <h2 style={{ color: 'var(--navy)', fontSize: '22px' }}>Acesso Restrito</h2>
          <p style={{ color: 'var(--gray-600)', fontSize: '13px', marginTop: '4px' }}>Painel Institucional do LABRIOS</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>E-mail Institucional</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@labrios.org" style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Senha de Acesso</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ padding: '12px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          </div>

          <button type="submit" disabled={loading} style={{ background: 'var(--navy)', color: 'white', padding: '14px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', marginTop: '8px' }}>
            {loading ? 'Validando Acesso...' : 'Entrar no Sistema'}
          </button>
        </div>
      </form>
    </div>
  );
}