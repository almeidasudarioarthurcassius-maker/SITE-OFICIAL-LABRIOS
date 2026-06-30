import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout" style={{ marginTop: '68px' }}>
      <aside className="admin-sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '16px' }}>Painel LABRIOS</h2>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Modo Administrador</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
          <Link href="/admin/dashboard" className="admin-nav-item">📊 Moderação de Reservas</Link>
          <Link href="/admin/configuracoes" className="admin-nav-item">⚙️ Configurações Gerais</Link>
          <Link href="/admin/equipe" className="admin-nav-item">👥 Gerenciar Equipe</Link>
          <Link href="/admin/equipamentos" className="admin-nav-item">🔬 Gerenciar Equipamentos</Link>
          <Link href="/admin/regras" className="admin-nav-item">📋 Gerenciar Regras</Link>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}