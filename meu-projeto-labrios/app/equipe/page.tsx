// app/equipe/page.tsx
import { supabase } from '../../lib/supabase';
export const dynamic = 'force-dynamic';

export default async function EquipePage() {
  const { data: membros } = await supabase.from('equipe').select('*').order('ordem');
  return (
    <section style={{ marginTop: 68, background: 'white', padding: '72px 0', minHeight: '70vh' }}>
      <div className="container">
        <div className="section-label">Nossos Profissionais</div>
        <h1 className="section-title">Equipe do Laboratório</h1>
        <div className="divider" />
        {(!membros || membros.length === 0) ? (
          <p style={{ color: 'var(--gray-600)', textAlign: 'center', padding: 48 }}>Nenhum membro cadastrado ainda.</p>
        ) : (
          <div className="team-grid">
            {membros.map((m: any) => {
              const initials = m.nome?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() ?? '?';
              return (
                <div key={m.id} className="team-card">
                  <div className="team-avatar">
                    {m.imagem_url
                      ? <img src={m.imagem_url} alt={m.nome} />
                      : initials}
                  </div>
                  <div className="team-name">{m.nome}</div>
                  <div className="team-role">{m.cargo}</div>
                  {m.lattes_url && (
                    <a href={m.lattes_url} className="btn-lattes" target="_blank" rel="noopener noreferrer">
                      🎓 Currículo Lattes
                    </a>
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
