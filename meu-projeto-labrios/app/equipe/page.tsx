import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function EquipePublicaPage() {
  const { data: membros } = await supabase.from('equipe').select('*').order('nome');

  return (
    <section style={{ marginTop: 68, background: 'white' }}>
      <div className="container">
        <div className="section-label">Pesquisadores e Técnicos</div>
        <h1 className="section-title">Equipe LABRIOS</h1>
        <div className="divider" />
        <div className="cards-grid">
          {membros?.map((m: any) => (
            <div key={m.id} className="team-card">
              <div className="team-avatar">
                {m.imagem_url ? <img src={m.imagem_url} alt={m.nome} /> : <span>{m.nome[0]}</span>}
              </div>
              <h3>{m.nome}</h3>
              <p style={{color: 'var(--gray-600)', fontSize: '14px'}}>{m.cargo}</p>
              {m.lattes_url && <a href={m.lattes_url} target="_blank" rel="noreferrer" className="btn-lattes">Currículo Lattes</a>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}