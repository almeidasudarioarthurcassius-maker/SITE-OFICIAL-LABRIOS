// app/equipe/page.tsx  (Server Component)
import { supabase } from '../../lib/supabase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Equipe — LTIP',
  description: 'Conheça os pesquisadores, técnicos e coordenadores do Laboratório LTIP.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function EquipePage() {
  const { data: equipe, error } = await supabase
    .from('equipe')
    .select('*')
    .order('ordem');

  if (error) console.error('Erro ao carregar equipe:', error.message);

  const membros = equipe ?? [];

  return (
    <section className="team" id="equipe" style={{ marginTop: 68, paddingTop: 80, background: 'white', minHeight: '70vh' }}>
      <div className="container">
        <div className="section-label">Nossos Profissionais</div>
        <h1 className="section-title">Equipe do Laboratório</h1>
        <div className="divider" />

        {membros.length === 0 ? (
          <p style={{ color: 'var(--gray-600)', textAlign: 'center', padding: 48 }}>
            Nenhum membro cadastrado ainda.
          </p>
        ) : (
          <div className="team-grid">
            {membros.map((m: any) => {
              const initials = m.nome?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
              return (
                <div key={m.id} className="team-card">
                  <div className="team-avatar">
                    {m.imagem_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.imagem_url} alt={m.nome} />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="team-name">{m.nome}</div>
                  <div className="team-role">{m.cargo}</div>
                  {m.lattes_url ? (
                    <a href={m.lattes_url} className="btn-lattes" target="_blank" rel="noopener noreferrer">
                      🎓 Currículo Lattes
                    </a>
                  ) : (
                    <span className="btn-lattes" style={{ opacity: 0.4, cursor: 'default' }}>
                      🎓 Lattes não informado
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
