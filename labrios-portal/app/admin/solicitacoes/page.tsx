'use client';
// app/admin/solicitacoes/page.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Solicitacao } from '../../../lib/supabase';
import Toast from '../../../components/Toast';

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  negado: 'Negado',
};

const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'aprovado', label: 'Aprovadas' },
  { key: 'negado', label: 'Negadas' },
];

function fmtData(d: string | null) {
  if (!d) return '—';
  // d vem como 'YYYY-MM-DD' (coluna DATE) — evita problema de fuso na conversão
  const [ano, mes, dia] = d.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function AdminSolicitacoesPage() {
  const [items, setItems] = useState<Solicitacao[]>([]);
  const [filter, setFilter] = useState<string>('pendente');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'error') =>
    setToast({ msg, type });

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('solicitacoes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) showToast('Erro ao carregar solicitações: ' + error.message);
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: number, status: 'aprovado' | 'negado' | 'pendente') {
    const { error } = await supabase.from('solicitacoes').update({ status }).eq('id', id);
    if (error) { showToast('Erro: ' + error.message); return; }
    showToast(
      status === 'aprovado' ? 'Solicitação aprovada!' : status === 'negado' ? 'Solicitação negada.' : 'Status revertido para pendente.',
      'success'
    );
    await load();
  }

  async function remove(id: number) {
    if (!confirm('Excluir esta solicitação do histórico? Esta ação não pode ser desfeita.')) return;
    const { error } = await supabase.from('solicitacoes').delete().eq('id', id);
    if (error) { showToast('Erro: ' + error.message); return; }
    showToast('Solicitação excluída.', 'success');
    await load();
  }

  const visible = filter === 'todas' ? items : items.filter((i) => i.status === filter);
  const pendentesCount = items.filter((i) => i.status === 'pendente').length;

  const badgeClass = (s: string) =>
    s === 'aprovado' ? 'badge-status badge-available'
    : s === 'negado' ? 'badge-status badge-reserved'
    : 'badge-status badge-maintenance';

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="admin-topbar">
        <h1>📥 Solicitações de Reserva</h1>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>
              📋 Solicitações recebidas ({items.length})
              {pendentesCount > 0 && (
                <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 700, color: '#F57F17' }}>
                  · {pendentesCount} pendente{pendentesCount > 1 ? 's' : ''}
                </span>
              )}
            </h3>
            <div className="inv-filters">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`filter-btn${filter === f.key ? ' active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading && <p style={{ color: 'var(--gray-600)' }}>Carregando...</p>}

          {!loading && visible.length === 0 && (
            <p style={{ textAlign: 'center', padding: 32, color: 'var(--gray-600)' }}>
              Nenhuma solicitação {filter !== 'todas' ? `com status "${STATUS_LABELS[filter] ?? filter}"` : ''} encontrada.
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {visible.map((s) => (
              <div
                key={s.id}
                style={{
                  border: '1px solid var(--gray-200)', borderRadius: 12, padding: 20,
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <strong style={{ fontSize: 16, color: 'var(--navy)' }}>{s.nome}</strong>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 2 }}>
                      ✉️ <a href={`mailto:${s.email}`} style={{ color: 'var(--navy)' }}>{s.email}</a>
                    </div>
                  </div>
                  <span className={badgeClass(s.status)}>{STATUS_LABELS[s.status] ?? s.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: 13 }}>
                  <div>
                    <div style={{ color: 'var(--gray-600)', marginBottom: 2 }}>Equipamento</div>
                    <div style={{ fontWeight: 600 }}>🖥️ {s.equipamento}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--gray-600)', marginBottom: 2 }}>Período solicitado</div>
                    <div style={{ fontWeight: 600 }}>📅 {fmtData(s.data_inicio)} — {fmtData(s.data_fim)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--gray-600)', marginBottom: 2 }}>Enviada em</div>
                    <div style={{ fontWeight: 600 }}>
                      🕓 {s.created_at ? new Date(s.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </div>
                </div>

                {s.finalidade && (
                  <div style={{ fontSize: 13, background: 'var(--gray-50)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ color: 'var(--gray-600)', marginBottom: 4 }}>Finalidade de uso</div>
                    <p className="rich-text" style={{ fontSize: 13, color: 'var(--gray-800)' }}>{s.finalidade}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {s.status !== 'aprovado' && (
                    <button className="btn-primary-admin" onClick={() => updateStatus(s.id, 'aprovado')}>
                      ✅ Aprovar
                    </button>
                  )}
                  {s.status !== 'negado' && (
                    <button className="btn-danger-admin" onClick={() => updateStatus(s.id, 'negado')}>
                      ❌ Negar
                    </button>
                  )}
                  {s.status !== 'pendente' && (
                    <button className="btn-secondary-admin" onClick={() => updateStatus(s.id, 'pendente')}>
                      ↩️ Marcar como pendente
                    </button>
                  )}
                  <button className="btn-secondary-admin" onClick={() => remove(s.id)}>
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
