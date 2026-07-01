'use client';
// components/InventoryTable.tsx
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Equipamento } from '../lib/supabase';

function DetailModal({ item, onClose }: { item: Equipamento; onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.imagem_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imagem_url} alt={item.nome_equipamento} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
        )}
        <h3 style={{ color: 'var(--navy)', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{item.nome_equipamento}</h3>
        <p className="rich-text" style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 16 }}>
          {item.funcionalidade || 'Sem descrição cadastrada.'}
        </p>
        {item.especificacoes && (
          <div style={{ marginBottom: 16 }}>
            {item.especificacoes.split(',').map((s, i) => (
              <span key={i} className="spec-tag">{s.trim()}</span>
            ))}
          </div>
        )}
        <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4 }}>
          <strong>Quantidade:</strong> {item.quantidade}
        </p>
        <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 20 }}>
          <strong>Patrimônio:</strong> {item.tombo ?? '—'}
        </p>
        <button className="btn-submit" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

type Props = { items: Equipamento[] };

const STATUS_LABEL: Record<string, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  manutencao: 'Manutenção',
};

export default function InventoryTable({ items }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Equipamento | null>(null);

  const visible = filter === 'all' ? items : items.filter((i) => i.status === filter);

  return (
    <>
      <div className="inv-header">
        <div>
          <div className="section-label">Recursos do Laboratório</div>
          <h2 className="section-title">Inventário de Equipamentos</h2>
          <div className="divider" style={{ marginBottom: 0 }} />
        </div>
        <div className="inv-filters">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'disponivel', label: 'Disponível' },
            { key: 'reservado', label: 'Reservado' },
            { key: 'manutencao', label: 'Manutenção' },
          ].map((f) => (
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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Equipamento</th>
              <th>Qtd.</th>
              <th>Funcionalidade</th>
              <th>Patrimônio / Tombo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-600)' }}>
                  Nenhum equipamento encontrado.
                </td>
              </tr>
            )}
            {visible.map((item) => (
              <tr key={item.id} data-status={item.status}>
                <td>
                  <div className={`status-cell status-${item.status}`}>
                    <span className="status-dot" />
                    {STATUS_LABEL[item.status] ?? item.status}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.imagem_url && (
                      <Image
                        src={item.imagem_url}
                        alt={item.nome_equipamento}
                        width={56}
                        height={44}
                        className="equip-img"
                      />
                    )}
                    <div>
                      <div className="equip-name">{item.nome_equipamento}</div>
                      {item.especificacoes && (
                        <div style={{ marginTop: 4 }}>
                          {item.especificacoes.split(',').map((s, i) => (
                            <span key={i} className="spec-tag">{s.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.quantidade}</td>
                <td style={{ maxWidth: 260, fontSize: 13, color: 'var(--gray-600)' }}>
                  {item.funcionalidade ?? '—'}
                </td>
                <td>
                  <span className="tombo">{item.tombo ?? '—'}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {item.status === 'disponivel' && (
                      <Link href={`/#agendamento`} className="btn-action">
                        📅 Reservar
                      </Link>
                    )}
                    <button className="btn-action" onClick={() => setSelected(item)}>
                      🔍 Detalhes
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
