import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getEquipe() {
  // Busca todos os membros ordenados pela ordem definida no painel administrativo
  const { data } = await supabase.from('equipe').select('*').order('ordem');
  return data || [];
}

export default async function EquipePage() {
  const todosMembros = await getEquipe();

  // Separa os integrantes por categoria com base no campo 'tipo'
  const laboratorio = todosMembros.filter((m) => !m.tipo || m.tipo === 'laboratorio');
  const comiteGestor = todosMembros.filter((m) => m.tipo === 'gestor');
  const comiteUsuarios = todosMembros.filter((m) => m.tipo === 'usuarios');

  // Função auxiliar para renderizar o grid de cartões de cada comitê/grupo
  const renderGrid = (membrosLista: any[], iconePadrao: string) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '24px', marginBottom: '48px' }}>
      {membrosLista.map((membro) => (
        <div key={membro.id} style={{ border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'white', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', justifyContent: 'between', alignItems: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gray-100)', margin: '0 auto 16px', backgroundImage: membro.imagem_url ? `url(${membro.imagem_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'var(--gray-400)' }}>
            {!membro.imagem_url && iconePadrao}
          </div>
          <h3 style={{ color: 'var(--navy)', marginBottom: '4px', fontSize: '18px', fontWeight: 700 }}>{membro.nome}</h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '14px', marginBottom: '16px', flexGrow: 1 }}>{membro.cargo || 'Membro Integrante'}</p>
          {membro.lattes_url && (
            <a href={membro.lattes_url} target="_blank" rel="noopener noreferrer" className="btn-action" style={{ fontSize: '12px', width: 'fit-content' }}>
              Currículo Lattes ↗
            </a>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section style={{ marginTop: '68px', minHeight: 'calc(100vh - 300px)', padding: '60px 0' }}>
      <div className="container">
        
        {/* === SEÇÃO 1: CORPO CIENTÍFICO E TÉCNICO === */}
        <div className="section-label">Equipe do Laboratório</div>
        <h1 className="section-title">Corpo Científico e Técnico</h1>
        <div className="divider" />
        
        {laboratorio.length === 0 ? (
          <p style={{ color: 'var(--gray-600)', marginBottom: '48px' }}>Nenhum membro listado no corpo científico básico.</p>
        ) : (
          renderGrid(laboratorio, '🔬')
        )}


        {/* === SEÇÃO 2: COMITÊ GESTOR === */}
        <div className="section-label">Estrutura de Governança</div>
        <h1 className="section-title">Comitê Gestor</h1>
        <div className="divider" />
        
        {comiteGestor.length === 0 ? (
          <p style={{ color: 'var(--gray-600)', marginBottom: '48px' }}>Nenhum membro associado ao Comitê Gestor até o momento.</p>
        ) : (
          renderGrid(comiteGestor, '💼')
        )}


        {/* === SEÇÃO 3: COMITÊ DE USUÁRIOS === */}
        <div className="section-label">Conselho Consultivo</div>
        <h1 className="section-title">Comitê de Usuários</h1>
        <div className="divider" />
        
        {comiteUsuarios.length === 0 ? (
          <p style={{ color: 'var(--gray-600)', marginBottom: '48px' }}>Nenhum membro associado ao Comitê de Usuários até o momento.</p>
        ) : (
          renderGrid(comiteUsuarios, '👥')
        )}

      </div>
    </section>
  );
}
