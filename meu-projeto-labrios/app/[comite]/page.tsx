// app/[comite]/page.tsx
import { supabase } from '../../lib/supabase';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';

const MAP: Record<string, { tabela: string; titulo: string; portariaKey: string }> = {
  'comite-gestor':   { tabela: 'comite_gestor',   titulo: 'Comitê Gestor',       portariaKey: 'link_portaria_gestor' },
  'comite-usuarios': { tabela: 'comite_usuarios',  titulo: 'Comitê de Usuários',  portariaKey: 'link_portaria_usuarios' },
};

export default async function ComitePage({ params }: { params: Promise<{ comite: string }> }) {
  const { comite } = await params;
  const info = MAP[comite];
  if (!info) notFound();

  const [{ data: membros }, { data: config }] = await Promise.all([
    supabase.from(info.tabela).select('*').order('nome'),
    supabase.from('configuracoes_labrios').select('valor').eq('chave', 'geral').single(),
  ]);

  const portariaUrl: string | null = config?.valor?.[info.portariaKey] ?? null;

  return (
    <section style={{ marginTop: 68, background: 'white', padding: '72px 0', minHeight: '70vh' }}>
      <div className="container">
        <div className="section-label">Estrutura Organizacional</div>
        <h1 className="section-title">{info.titulo}</h1>
        <div className="divider" />

        {portariaUrl && (
          <div style={{ marginBottom: 32 }}>
            <a href={portariaUrl} target="_blank" rel="noopener noreferrer" className="btn-lattes">
              📜 Visualizar Portaria Oficial
            </a>
          </div>
        )}

        {(!membros || membros.length === 0) ? (
          <p style={{ color: 'var(--gray-600)', textAlign: 'center', padding: 48 }}>Nenhum membro cadastrado ainda.</p>
        ) : (
          <div className="team-grid">
            {membros.map((m: any) => {
              const initials = m.nome?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() ?? '?';
              return (
                <div key={m.id} className="team-card">
                  <div className="team-avatar">
                    {m.imagem_url ? <img src={m.imagem_url} alt={m.nome} /> : initials}
                  </div>
                  <div className="team-name">{m.nome}</div>
                  <div className="team-role">{m.funcao}</div>
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
