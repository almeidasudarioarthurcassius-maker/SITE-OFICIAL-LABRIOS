import { supabase } from '../../../lib/supabase';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: reservas } = await supabase
    .from('reservas')
    .select('*, equipamentos(nome)')
    .order('created_at', { ascending: false });

  async function aprovarReserva(formData: FormData) {
    'use server';
    const id = formData.get('id');
    await supabase.from('reservas').update({ status: 'Aprovado' }).eq('id', id);
    revalidatePath('/admin/dashboard');
    revalidatePath('/agenda');
  }

  async function recusarReserva(formData: FormData) {
    'use server';
    const id = formData.get('id');
    await supabase.from('reservas').delete().eq('id', id);
    revalidatePath('/admin/dashboard');
  }

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', fontSize: '24px', marginBottom: '24px' }}>Moderação de Reservas Pendentes</h1>
      
      <div style={{ overflowX: 'auto', background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--navy)', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Equipamento</th>
              <th style={{ padding: '12px' }}>Solicitante</th>
              <th style={{ padding: '12px' }}>Instituição</th>
              <th style={{ padding: '12px' }}>Data/Horário</th>
              <th style={{ padding: '12px' }}>Situação</th>
              <th style={{ padding: '12px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas?.map((res: any) => (
              <tr key={res.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{res.equipamentos?.nome}</td>
                <td style={{ padding: '12px' }}>
                  {res.solicitante_nome}
                  <a href={res.lattes_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '11px', color: 'var(--navy-light)' }}>🎓 Lattes</a>
                </td>
                <td style={{ padding: '12px' }}>{res.institicao} ({res.funcao})</td>
                <td style={{ padding: '12px' }}>{res.data_reserva} <br/><small>{res.horario_inicial} - {res.horario_final}</small></td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: res.status === 'Pendente' ? '#FFF8E6' : '#E8F4E8', color: res.status === 'Pendente' ? '#F57F17' : '#2E7D32' }}>
                    {res.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {res.status === 'Pendente' && (
                      <form action={aprovarReserva}>
                        <input type="hidden" name="id" value={res.id} />
                        <button type="submit" style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Aprovar</button>
                      </form>
                    )}
                    <form action={recusarReserva}>
                      <input type="hidden" name="id" value={res.id} />
                      <button type="submit" style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Excluir</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}