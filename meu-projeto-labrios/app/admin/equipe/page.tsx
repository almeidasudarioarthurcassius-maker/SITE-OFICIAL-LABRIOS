import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminEquipePage() {
  const { data: membros } = await supabase.from('equipe').select('*').order('nome');

  async function adicionarMembro(formData: FormData) {
    'use server';
    const nome = formData.get('nome');
    const cargo = formData.get('cargo');
    const lattes_url = formData.get('lattes_url');
    const imagem_url = formData.get('imagem_url');

    await supabase.from('equipe').insert([{ nome, cargo, lattes_url, imagem_url }]);
    revalidatePath('/admin/equipe');
    revalidatePath('/equipe');
  }

  async function removerMembro(formData: FormData) {
    'use server';
    const id = formData.get('id');
    await supabase.from('equipe').delete().eq('id', id);
    revalidatePath('/admin/equipe');
    revalidatePath('/equipe');
  }

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', fontSize: '24px', marginBottom: '24px' }}>Gerenciar Membros da Equipe</h1>

      <form action={adicionarMembro} style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--gray-200)', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ color: 'var(--navy-light)' }}>Adicionar Integrante</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <input required type="text" name="nome" placeholder="Nome Completo" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          <input required type="text" name="cargo" placeholder="Cargo ou Função (Ex: Pesquisador Coordenador)" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <input type="url" name="lattes_url" placeholder="Link do Currículo Lattes" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          <input type="url" name="imagem_url" placeholder="URL da Foto de Perfil" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <button type="submit" style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
          💼 Cadastrar na Equipe
        </button>
      </form>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--gray-200)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--navy)', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Nome</th>
              <th style={{ padding: '12px' }}>Função</th>
              <th style={{ padding: '12px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {membros?.map((m: any) => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{m.nome}</td>
                <td style={{ padding: '12px' }}>{m.cargo}</td>
                <td style={{ padding: '12px' }}>
                  <form action={removerMembro}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Excluir</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
