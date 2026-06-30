import { supabase } from '../../../lib/supabase';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminRegrasPage() {
  const { data: regras } = await supabase.from('regras').select('*').order('ordem');

  async function adicionarRegra(formData: FormData) {
    'use server';
    const texto = formData.get('texto');
    const ordem = parseInt(formData.get('ordem') as string || '0');

    await supabase.from('regras').insert([{ texto, ordem }]);
    revalidatePath('/admin/regras');
    revalidatePath('/como-utilizar');
  }

  async function removerRegra(formData: FormData) {
    'use server';
    const id = formData.get('id');
    await supabase.from('regras').delete().eq('id', id);
    revalidatePath('/admin/regras');
    revalidatePath('/como-utilizar');
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ color: 'var(--navy)', fontSize: '24px', marginBottom: '24px' }}>Diretrizes de Uso (Como Utilizar)</h1>

      <form action={adicionarRegra} style={{ background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid var(--gray-200)', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ color: 'var(--navy-light)' }}>Nova Diretriz / Norma</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Ordem de Exibição</label>
          <input required type="number" name="ordem" defaultValue={(regras?.length || 0) + 1} style={{ width: '100px', padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Texto Normativo</label>
          <textarea required name="texto" rows={4} placeholder="Ex: É obrigatória a citação do LABRIOS em todas as publicações científicas decorrentes do uso desta infraestrutura..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <button type="submit" style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
          📌 Publicar Norma
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {regras?.map((r: any) => (
          <div key={r.id} style={{ background: 'white', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <span style={{ background: 'var(--navy)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', marginRight: '10px' }}>#{r.ordem}</span>
              <p style={{ display: 'inline', fontSize: '14px' }}>{r.texto}</p>
            </div>
            <form action={removerRegra}>
              <input type="hidden" name="id" value={r.id} />
              <button type="submit" style={{ background: 'none', border: 'none', color: '#C62828', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Excluir</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
