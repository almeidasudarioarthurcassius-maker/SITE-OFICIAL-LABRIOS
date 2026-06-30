// app/admin/dashboard/page.tsx
import { supabase } from '../../../lib/supabase';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: reservas } = await supabase
    .from('reservas').select('*, equipamentos(nome)').order('created_at', { ascending: false });

  async function aprovar(formData: FormData) {
    'use server';
    await supabase.from('reservas').update({ status: 'Aprovado' }).eq('id', formData.get('id'));
    revalidatePath('/admin/dashboard'); revalidatePath('/agenda');
  }
  async function recusar(formData: FormData) {
    'use server';
    await supabase.from('reservas').delete().eq('id', formData.get('id'));
    revalidatePath('/admin/dashboard');
  }

  return (
    <>
      <div className="admin-topbar"><h1>📊 Moderação de Reservas</h1></div>
      <div className="admin-content">
        <div className="admin-card">
          <h3>Todas as Solicitações</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr>
                <th>Equipamento</th><th>Solicitante</th><th>Instituição</th>
                <th>Data / Horário</th><th>Situação</th><th>Ações</th>
              </tr></thead>
              <tbody>
                {(!reservas || reservas.length === 0) && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-600)' }}>Nenhuma solicitação.</td></tr>
                )}
                {reservas?.map((res: any) => (
                  <tr key={res.id}>
                    <td><strong>{res.equipamentos?.nome}</strong></td>
                    <td>
                      {res.solicitante_nome}
                      {res.lattes_url && <><br /><a href={res.lattes_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--navy-light)' }}>🎓 Lattes</a></>}
                    </td>
                    <td>{res.institicao}<br /><small style={{ color: 'var(--gray-600)' }}>{res.funcao}</small></td>
                    <td>{new Date(res.data_reserva + 'T00:00:00').toLocaleDateString('pt-BR')}<br />
                      <small>{res.horario_inicial} – {res.horario_final}</small></td>
                    <td>
                      <span className={`badge-status ${res.status === 'Pendente' ? 'badge-maintenance' : 'badge-available'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {res.status === 'Pendente' && (
                          <form action={aprovar}>
                            <input type="hidden" name="id" value={res.id} />
                            <button type="submit" className="btn-primary-admin" style={{ padding: '6px 12px', fontSize: 12 }}>✅ Aprovar</button>
                          </form>
                        )}
                        <form action={recusar}>
                          <input type="hidden" name="id" value={res.id} />
                          <button type="submit" className="btn-danger-admin">🗑️ Excluir</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
