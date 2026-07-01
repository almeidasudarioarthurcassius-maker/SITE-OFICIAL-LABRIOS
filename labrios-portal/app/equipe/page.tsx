import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getEquipe() {
  const { data } = await supabase.from('equipe').select('*').order('ordem');
  return data || [];
}

export default async function EquipePage() {
  const membros = await getEquipe();

  return (
    <section style={{ marginTop: '68px', minHeight: 'calc(100vh - 300px)' }}>
      <div className="container">
        <div className="section-label">Corpo Científico</div>
        <h1 className="section-title">Pesquisadores e Técnicos</h1>
        <div className="divider" />

        {membros.length === 0 ? (
          <p style={{ color: 'var(--gray-600)' }}>Nenhum membro listado na equipe institucional.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '32px' }}>
            {membros.map((membro) => (
              <div key={membro.id} style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'white', boxShadow: 'var(--shadow)' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gray-100)', margin: '0 auto 16px', backgroundImage: membro.imagem_url ? `url(${membro.imagem_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '32px', color: 'var(--gray-400)' }}>
                  {!membro.imagem_url && '🔬'}
                </div>
                <h3 style={{ color: 'var(--navy)', marginBottom: '4px' }}>{membro.nome}</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '14px', marginBottom: '16px' }}>{membro.cargo || 'Pesquisador'}</p>
                {membro.lattes_url && (
                  <a href={membro.lattes_url} target="_blank" rel="noopener noreferrer" className="btn-action" style={{ fontSize: '12px' }}>
                    Currículo Lattes ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
