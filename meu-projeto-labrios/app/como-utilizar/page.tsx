import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function ComoUtilizarPage() {
  const { data: regras } = await supabase.from('regras').select('*').order('ordem');
  const { data: config } = await supabase.from('configuracoes_labrios').select('valor').eq('chave', 'geral').single();

  return (
    <section style={{ marginTop: 68, background: 'var(--gray-50)' }}>
      <div className="container">
        <div className="section-label">Normativas e Diretrizes</div>
        <h1 className="section-title">Como Utilizar o LABRIOS</h1>
        <div className="divider" />

        <div className="rules-wrapper" style={{ marginBottom: '40px' }}>
          {regras?.map((regra: any) => (
            <div key={regra.id} className="rule-item rich-text">
              {regra.texto}
            </div>
          ))}
        </div>

        {config?.valor?.arquivo_regimento_url ? (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--gray-200)' }}>
            <h3 style={{ color: 'var(--navy)', marginBottom: '8px' }}>Regimento Interno Oficial</h3>
            <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '16px' }}>Consulte as diretrizes e deveres completos no documento homologado.</p>
            <a href={config.valor.arquivo_regimento_url} download className="slide-cta" style={{ fontSize: '14px', padding: '10px 20px' }}>
              ⬇️ Baixar Regimento Interno (PDF)
            </a>
          </div>
        ) : (
          <p style={{ color: 'var(--gray-600)' }}>Regimento interno indisponível para download no momento.</p>
        )}
      </div>
    </section>
  );
}