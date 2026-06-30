import { supabase } from '../../lib/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ComitePage({ params }: { params: Promise<{ comite: string }> }) {
  const { comite } = await params;
  
  let tabela = '';
  let titulo = '';

  if (comite === 'comite-gestor') {
    tabela = 'comite_gestor';
    titulo = 'Comitê Gestor';
  } else if (comite === 'comite-usuarios') {
    tabela = 'comite_usuarios';
    titulo = 'Comitê de Usuários';
  } else {
    notFound();
  }

  const { data: membros } = await supabase.from(tabela).select('*').order('nome');
  const { data: config } = await supabase.from('configuracoes_labrios').select('valor').eq('chave', 'geral').single();

  const portariaUrl = comite === 'comite-gestor' 
    ? config?.valor?.link_portaria_gestor 
    : config?.valor?.link_portaria_usuarios;

  return (
    <section style={{ marginTop: 68, background: 'white' }}>
      <div className="container">
        <div className="section-label">Estrutura Organizacional</div>
        <h1 className="section-title">{titulo}</h1>
        <div className="divider" />

        {portariaUrl && (
          <a href={portariaUrl} target="_blank" rel="noopener noreferrer" className="btn-lattes" style={{ marginBottom: '32px' }}>
            📜 Visualizar Portaria Oficial
          </a>
        )}

        <div className="cards-grid">
          {membros?.map((m: any) => (
            <div key={m.id} className="team-card">
              <div className="team-avatar">
                {m.imagem_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.imagem_url} alt={m.nome} />
                ) : (
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--navy)' }}>{m.nome[0]}</span>
                )}
              </div>
              <h3 className="team-name">{m.nome}</h3>
              <p className="team-role">{m.funcao}</p>
              {m.lattes_url && (
                <a href={m.lattes_url} target="_blank" rel="noopener noreferrer" className="btn-lattes">
                  🎓 Currículo Lattes
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}