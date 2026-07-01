// app/admin/page.tsx  (Server Component)
import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function AdminDashboard() {
  const [
    { count: totalEquip },
    { count: disponiveis },
    { count: totalDocs },
    { count: totalEquipe },
    { count: pendentes },
  ] = await Promise.all([
    supabase.from('inventario').select('*', { count: 'exact', head: true }),
    supabase.from('inventario').select('*', { count: 'exact', head: true }).eq('status', 'disponivel'),
    supabase.from('documentos').select('*', { count: 'exact', head: true }),
    supabase.from('equipe').select('*', { count: 'exact', head: true }),
    supabase.from('solicitacoes').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
  ]);

  const stats = [
    { icon: '📥', number: pendentes ?? 0,     label: 'Solicitações Pendentes' },
    { icon: '🖥️', number: totalEquip ?? 0,   label: 'Equipamentos'  },
    { icon: '✅', number: disponiveis ?? 0,   label: 'Disponíveis'   },
    { icon: '📄', number: totalDocs ?? 0,     label: 'Documentos'    },
    { icon: '👥', number: totalEquipe ?? 0,   label: 'Membros'       },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h1>Dashboard</h1>
      </div>
      <div className="admin-content">
        <div className="stats-row">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h3>Navegação Rápida</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { href: '/admin/solicitacoes', label: '📥 Ver Solicitações'    },
              { href: '/admin/equipe',     label: '👥 Gerenciar Equipe'     },
              { href: '/admin/inventario', label: '🖥️ Gerenciar Inventário'  },
              { href: '/admin/documentos', label: '📄 Gerenciar Documentos'  },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="btn-primary-admin"
                style={{ textAlign: 'center', textDecoration: 'none', padding: '14px 20px', borderRadius: 'var(--radius)', display: 'block' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
