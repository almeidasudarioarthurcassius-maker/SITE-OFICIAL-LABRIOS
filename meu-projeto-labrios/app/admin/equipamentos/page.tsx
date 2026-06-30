import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminEquipamentosPage() {
  const { data: equipamentos } = await supabase.from('equipamentos').select('*').order('nome');

  async function adicionarEquipamento(formData: FormData) {
    'use server';
    const nome = formData.get('nome');
    const marca = formData.get('marca');
    const modelo = formData.get('modelo');
    const finalidade = formData.get('finalidade');
    const quantidade = parseInt(formData.get('quantidade') as string || '1');
    const imagem_url = formData.get('imagem_url');

    await supabase.from('equipamentos').insert([{
      nome, marca, modelo, finalidade, quantidade, imagem_url
    }]);

    revalidatePath('/admin/equipamentos');
    revalidatePath('/');
  }

  async function removerEquipamento(formData: FormData) {
    'use server';
    const id = formData.get('id');
    await supabase.from('equipamentos').delete().eq('id', id);
    revalidatePath('/admin/equipamentos');
    revalidatePath('/');
  }

  return (
    <div>
      <h1 style={{ color: 'var(--navy)', fontSize: '24px', marginBottom: '24px' }}>Gerenciar Equipamentos</h1>
      
      {/* Formulário de Criação */}
      <form action={adicionarEquipamento} style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--gray-200)', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ color: 'var(--navy-light)' }}>Novo Equipamento</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
          <input required type="text" name="nome" placeholder="Nome do Equipamento (Ex: Microscópio Estereoscópico)" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          <input required type="text" name="marca" placeholder="Marca" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          <input required type="text" name="modelo" placeholder="Modelo" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px' }}>
          <input type="url" name="imagem_url" placeholder="URL da Imagem (Opcional)" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          <input required type="number" name="quantidade" defaultValue="1" min="1" placeholder="Qtd" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <textarea required name="finalidade" rows={3} placeholder="Descrição da finalidade analítica do equipamento..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        <button type="submit" style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
          ➕ Cadastrar Equipamento
        </button>
      </form>

      {/* Tabela de Listagem */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--gray-200)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--navy)', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Nome</th>
              <th style={{ padding: '12px' }}>Especificação</th>
              <th style={{ padding: '12px' }}>Quantidade</th>
              <th style={{ padding: '12px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipamentos?.map((eq: any) => (
              <tr key={eq.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{eq.nome}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: 'var(--gray-600)' }}>{eq.marca} / {eq.modelo}</td>
                <td style={{ padding: '12px' }}>{eq.quantidade} u.</td>
                <td style={{ padding: '12px' }}>
                  <form action={removerEquipamento}>
                    <input type="hidden" name="id" value={eq.id} />
                    <button type="submit" style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      Excluir
                    </button>
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
