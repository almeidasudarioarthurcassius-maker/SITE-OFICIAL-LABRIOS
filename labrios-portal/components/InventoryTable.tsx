'use client';
import { Equipamento } from '../lib/supabase';

type Props = { items: Equipamento[] };

export default function InventoryTable({ items }: Props) {
  return (
    <div>
      <div className="section-label">Inventário</div>
      <h2 className="section-title">Equipamentos e Infraestrutura</h2>
      <div className="divider" />
      
      {items.length === 0 ? (
        <p style={{ color: 'var(--gray-600)' }}>Nenhum equipamento cadastrado no momento.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tombo / Identificador</th>
                <th>Equipamento</th>
                <th>Funcionalidade / Aplicação</th>
                <th>Qtd</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{item.tombo || 'N/A'}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.nome_equipamento}</div>
                    {item.especificacoes && (
                      <div style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '2px' }}>
                        {item.especificacoes}
                      </div>
                    )}
                  </td>
                  <td>{item.funcionalidade || '—'}</td>
                  <td>{item.quantidade}</td>
                  <td>
                    <span className={`status-badge status-${item.status}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="status-dot" />
                      {item.status === 'disponivel' && 'Disponível'}
                      {item.status === 'reservado' && 'Reservado'}
                      {item.status === 'manutencao' && 'Manutenção'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
