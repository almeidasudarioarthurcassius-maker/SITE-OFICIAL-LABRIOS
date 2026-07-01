'use client';
// app/admin/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();
      if (!data.ok) {
        setErro(data.message || 'E-mail ou senha incorretos.');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setErro('Erro de conexão. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--gray-50)', marginTop: 0,
      }}
    >
      <form onSubmit={doLogin} className="login-modal" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <h2>🔒 Área Restrita</h2>
        <p>Acesso exclusivo para técnicos e coordenadores do LTIP.</p>

        <div className="admin-input-group">
          <label>E-mail institucional</label>
          <input
            type="email" placeholder="seu@email.edu.br" value={email}
            onChange={(e) => setEmail(e.target.value)} required autoFocus
          />
        </div>
        <div className="admin-input-group">
          <label>Senha</label>
          <input
            type="password" placeholder="••••••••" value={senha}
            onChange={(e) => setSenha(e.target.value)} required
          />
        </div>

        {erro && (
          <p style={{ color: '#C62828', fontSize: 13, marginBottom: 12 }}>⚠️ {erro}</p>
        )}

        <button className="btn-submit" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="modal-footer">
          <a href="/" style={{ color: 'var(--navy)' }}>← Voltar ao site</a>
        </div>
      </form>
    </div>
  );
}
