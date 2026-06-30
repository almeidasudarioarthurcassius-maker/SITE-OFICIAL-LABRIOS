import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AgendaPage() {
  const { data: aprovadas } = await supabase
    .from('reservas')
    .select('*, equipamentos(nome)')
    .eq('status', 'Aprovado')
    .order('data_reserva', { ascending: true });

  return (
    <section style={{ marginTop: 68, background: 'white' }}>
      <div className="container">
        <div className="section-label">Ocupação de Recursos</div>
        <h1 className="section-title">Agenda Pública de Equipamentos</h1>
        <div className="divider" />

        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--gray-200)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--navy)', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Equipamento</th>
                <th style={{ padding: '12px' }}>Data</th>
                <th style={{ padding: '12px' }}>Horário</th>
                <th style={{ padding: '12px' }}>Responsável</th>
                <th style={{ padding: '12px' }}>Instituição</th>
              </tr>
            </thead>
            <tbody>
              {aprovadas?.map((res: any) => (
                <tr key={res.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--navy)' }}>{res.equipamentos?.nome}</td>
                  <td style={{ padding: '12px' }}>{new Date(res.data_reserva).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '12px' }}>{res.horario_inicial} até {res.horario_final}</td>
                  <td style={{ padding: '12px' }}>{res.solicitante_nome}</td>
                  <td style={{ padding: '12px' }}>{res.institicao}</td>
                </tr>
              ))}
              {aprovadas?.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-600)' }}>
                    Nenhuma reserva agendada ou aprovada na planilha pública.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}