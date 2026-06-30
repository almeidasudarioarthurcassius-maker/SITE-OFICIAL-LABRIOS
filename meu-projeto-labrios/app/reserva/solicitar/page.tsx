import { supabase } from '../../../lib/supabase';
import FormularioCliente from './FormularioCliente';

export const dynamic = 'force-dynamic';

export default async function SolicitarReservaPage({ searchParams }: { searchParams: Promise<{ equipamentoId?: string }> }) {
  const { equipamentoId } = await searchParams;
  
  const [equipsRes, configRes] = await Promise.all([
    supabase.from('equipamentos').select('id, nome'),
    supabase.from('configuracoes_labrios').select('valor').eq('chave', 'geral').single()
  ]);

  return (
    <section style={{ marginTop: 68, background: 'var(--gray-50)' }}>
      <div className="container" style={{ maxWidth: '650px' }}>
        <div className="section-label">Solicitação</div>
        <h1 className="section-title">Formulário de Reserva</h1>
        <div className="divider" />

        {configRes.data?.valor?.link_formulario_externo && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#E8F0F8', borderLeft: '4px solid var(--navy)', borderRadius: '4px' }}>
            <p style={{ fontSize: '14px', color: 'var(--navy-dark)' }}>
              ⚠️ <strong>Atenção:</strong> Além deste formulário, preencha também o{' '}
              <a href={configRes.data.valor.link_formulario_externo} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                Formulário Externo Complementar (Forms)
              </a>.
            </p>
          </div>
        )}

        <FormularioCliente equipamentos={equipsRes.data || []} idSelecionado={equipamentoId} />
      </div>
    </section>
  );
}