import { supabase } from '../../../lib/supabase';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';

export default async function AdminComitePage() {
  const [{ data: gestor }, { data: usuarios }] = await Promise.all([
    supabase.from('comite_gestor').select('*').order('nome'),
    supabase.from('comite_usuarios').select('*').order('nome'),
  ]);

  async function addGestor(formData: FormData) {
    'use server';
    await supabase.from('comite_gestor').insert([{
      nome: formData.get('nome'), cargo: formData.get('cargo'),
      lattes_url: formData.get('lattes_url'), imagem_url: formData.get('imagem_url'),
    }]);
    revalidatePath('/admin/comitegeral'); revalidatePath('/comite-gestor');
  }
  async function removeGestor(formData: FormData) {
    'use server';
    await supabase.from('comite_gestor').delete().eq('id', formData.get('id'));
    revalidatePath('/admin/comitegeral'); revalidatePath('/comite-gestor');
  }
  async function addUsuario(formData: FormData) {
    'use server';
    await supabase.from('comite_usuarios').insert([{
      nome: formData.get('nome'), cargo: formData.get('cargo'),
      lattes_url: formData.get('lattes_url'), imagem_url: formData.get('imagem_url'),
    }]);
    revalidatePath('/admin/comitegeral'); revalidatePath('/comite-usuarios');
  }
  async function removeUsuario(formData: FormData) {
    'use server';
    await supabase.from('comite_usuarios').delete().eq('id', formData.get('id'));
    revalidatePath('/admin/comitegeral'); revalidatePath('/comite-usuarios');
  }

  const formStyle = { background: 'white', padding: 24, borderRadius: 12, border: '1px solid var(--gray-200)', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 } as const;
  const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)', fontSize: '14px' } as const;

  function MemberTable({ members, removeAction, prefix }: { members: any[], removeAction: any, prefix: string }) {
    return (
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)', overflow: 'hidden', marginBottom: 40 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--navy)', color: 'white' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Cargo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Lattes</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {(!members || members.length === 0) && (
              <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: 'var(--gray-600)' }}>Nenhum membro cadastrado.</td></tr>
            )}
            {members?.map((m: any) => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{m.nome}</td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)', fontSize: 14 }}>{m.cargo}</td>
                <td style={{ padding: '12px 16px' }}>
                  {m.lattes_url ? <a href={m.lattes_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', fontSize: 12 }}>🎓 Ver</a> : <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <form action={removeAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '5px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Excluir</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ color: 'var(--navy)', fontSize: 24, marginBottom: 32 }}>🏛️ Comitês do LABRIOS</h1>

      {/* COMITÊ GESTOR */}
      <h2 style={{ color: 'var(--navy)', fontSize: 18, marginBottom: 16, paddingBottom: 8, borderBottom: '3px solid var(--green)' }}>Comitê Gestor</h2>
      <form action={addGestor} style={formStyle}>
        <h3 style={{ color: 'var(--navy-light)', fontSize: 14, fontWeight: 700 }}>Adicionar Membro ao Comitê Gestor</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input required name="nome" placeholder="Nome Completo" style={inputStyle} />
          <input required name="cargo" placeholder="Cargo / Função" style={inputStyle} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input name="lattes_url" type="url" placeholder="Link Currículo Lattes" style={inputStyle} />
          <input name="imagem_url" type="url" placeholder="URL da Foto" style={inputStyle} />
        </div>
        <button type="submit" style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start', fontSize: 14 }}>
          ➕ Adicionar ao Comitê Gestor
        </button>
      </form>
      <MemberTable members={gestor || []} removeAction={removeGestor} prefix="g" />

      {/* COMITÊ DE USUÁRIOS */}
      <h2 style={{ color: 'var(--navy)', fontSize: 18, marginBottom: 16, paddingBottom: 8, borderBottom: '3px solid var(--green)' }}>Comitê de Usuários</h2>
      <form action={addUsuario} style={formStyle}>
        <h3 style={{ color: 'var(--navy-light)', fontSize: 14, fontWeight: 700 }}>Adicionar Membro ao Comitê de Usuários</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input required name="nome" placeholder="Nome Completo" style={inputStyle} />
          <input required name="cargo" placeholder="Cargo / Função" style={inputStyle} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input name="lattes_url" type="url" placeholder="Link Currículo Lattes" style={inputStyle} />
          <input name="imagem_url" type="url" placeholder="URL da Foto" style={inputStyle} />
        </div>
        <button type="submit" style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start', fontSize: 14 }}>
          ➕ Adicionar ao Comitê de Usuários
        </button>
      </form>
      <MemberTable members={usuarios || []} removeAction={removeUsuario} prefix="u" />
    </div>
  );
}
