// app/como-utilizar/page.tsx
import { supabase } from '../../lib/supabase';
export const dynamic = 'force-dynamic';

export default async function ComoUtilizarPage() {
  const [{ data: regras }, { data: config }] = await Promise.all([
    supabase.from('regras').select('*').order('ordem'),
    supabase.from('configuracoes_labrios').select('valor').eq('chave', 'geral').single(),
  ]);

  return (
    <section style={{ marginTop: 68, background: 'var(--gray-50)', padding: '72px 0', minHeight: '70vh' }}>
      <div className="container">
        <div className="section-label">Normativas e Diretrizes</div>
        <h1 className="section-title">Como Utilizar o LABRIOS</h1>
        <div className="divider" />

        {(!regras || regras.length === 0) ? (
          <p style={{ color: 'var(--gray-600)', marginBottom: 32 }}>Nenhuma regra cadastrada ainda.</p>
        ) : (
          <div style={{ marginBottom: 48 }}>
            {regras.map((r: any) => (
              <div key={r.id} className="rule-item">
                <span style={{ background: 'var(--navy)', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700, marginRight: 10 }}>
                  {r.ordem}
                </span>
                {r.texto}
              </div>
            ))}
          </div>
        )}

        {config?.valor?.arquivo_regimento_url ? (
          <div style={{ background: 'white', padding: 28, borderRadius: 12, border: '1px solid var(--gray-200)', maxWidth: 520 }}>
            <h3 style={{ color: 'var(--navy)', marginBottom: 8 }}>📄 Regimento Interno Oficial</h3>
            <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 16 }}>
              Consulte as diretrizes e deveres completos no documento homologado.
            </p>
            <a href={config.valor.arquivo_regimento_url} download className="slide-cta"
              style={{ fontSize: 14, padding: '10px 20px' }}>
              ⬇️ Baixar Regimento Interno (PDF)
            </a>
          </div>
        ) : (
          <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Regimento interno não disponível para download no momento.</p>
        )}
      </div>
    </section>
  );
}
