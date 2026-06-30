// app/agenda/page.tsx
import { supabase } from '../../lib/supabase';
export const dynamic = 'force-dynamic';

export default async function AgendaPage() {
  const { data: aprovadas } = await supabase
    .from('reservas')
    .select('*, equipamentos(nome)')
    .eq('status', 'Aprovado')
    .order('data_reserva', { ascending: true });

  return (
    <section style={{ marginTop: 68, background: 'white', padding: '72px 0', minHeight: '70vh' }}>
      <div className="container">
        <div className="section-label">Ocupação de Recursos</div>
        <h1 className="section-title">Agenda Pública de Equipamentos</h1>
        <div className="divider" />

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Equipamento</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Responsável</th>
                <th>Instituição</th>
              </tr>
            </thead>
            <tbody>
              {(!aprovadas || aprovadas.length === 0) ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-600)' }}>
                  Nenhuma reserva aprovada no momento.
                </td></tr>
              ) : aprovadas.map((res: any) => (
                <tr key={res.id}>
                  <td><strong style={{ color: 'var(--navy)' }}>{res.equipamentos?.nome}</strong></td>
                  <td>{new Date(res.data_reserva + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  <td>{res.horario_inicial} – {res.horario_final}</td>
                  <td>{res.solicitante_nome}</td>
                  <td>{res.institicao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
