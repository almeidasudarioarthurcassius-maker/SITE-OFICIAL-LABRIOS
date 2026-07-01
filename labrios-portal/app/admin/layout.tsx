'use client';
// app/admin/layout.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin',             icon: '📊', label: 'Dashboard'      },
  { href: '/admin/solicitacoes', icon: '📥', label: 'Solicitações'  },
  { href: '/admin/equipe',      icon: '👥', label: 'Equipe'         },
  { href: '/admin/inventario',  icon: '🖥️',  label: 'Inventário'    },
  { href: '/admin/documentos',  icon: '📄', label: 'Documentos'     },
  { href: '/admin/banner',      icon: '🖼️',  label: 'Banner / Slides' },
  { href: '/admin/configuracoes', icon: '⚙️', label: 'Sobre / Contato / Logo' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="admin-layout" style={{ paddingTop: 0 }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>⚙️ Painel Gestor</h2>
          <p>LTIP Administração</p>
        </div>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-item">
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/"
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            ← Voltar ao site
          </Link>
          <button
            onClick={logout}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13,
              cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
