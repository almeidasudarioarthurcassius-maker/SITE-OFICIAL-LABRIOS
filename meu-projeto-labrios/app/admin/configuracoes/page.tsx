import { supabase } from '../../../lib/supabase';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function ConfigAdminPage() {
  const { data: config } = await supabase.from('configuracoes_labrios').select('*').eq('chave', 'geral').single();
  const dados = config?.valor || {};

  async function salvarConfig(formData: FormData) {
    'use server';
    
    const nome_oficial = formData.get('nome_oficial');
    const texto_institucional = formData.get('texto_institucional');
    const link_formulario_externo = formData.get('link_formulario_externo');
    const link_portaria_gestor = formData.get('link_portaria_gestor');
    const link_portaria_usuarios = formData.get('link_portaria_usuarios');
    const regimentoFile = formData.get('regimento_pdf') as File;

    let arquivo_regimento_url = dados.arquivo_regimento_url || '';

    // Lógica de Upload usando Supabase Storage se houver arquivo enviado
    if (regimentoFile && regimentoFile.size > 0) {
      const fileName = `regimento-${Date.now()}.pdf`;
      const { data: uploadData } = await supabase.storage
        .from('labrios-files')
        .upload(fileName, regimentoFile, { cacheControl: '3600', upsert: true });
      
      if (uploadData) {
        arquivo_regimento_url = supabase.storage.from('labrios-files').getPublicUrl(fileName).data.publicUrl;
      }
    }

    const novoValor = {
      nome_oficial,
      texto_institucional,
      link_formulario_externo,
      link_portaria_gestor,
      link_portaria_usuarios,
      arquivo_regimento_url
    };

    await supabase.from('configuracoes_labrios').update({ valor: novoValor }).eq('chave', 'geral');
    revalidatePath('/');
    revalidatePath('/como-utilizar');
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ color: 'var(--navy)', fontSize: '24px', marginBottom: '24px' }}>Configurações Gerais do LABRIOS</h1>

      <form action={salvarConfig} style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold' }}>Nome Oficial do Laboratório</label>
          <input type="text" name="nome_oficial" defaultValue={dados.nome_oficial} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold' }}>Texto de Apresentação Institucional</label>
          <textarea name="texto_institucional" rows={4} defaultValue={dados.texto_institucional} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold' }}>Link para Formulário Externo (Forms)</label>
          <input type="url" name="link_formulario_externo" defaultValue={dados.link_formulario_externo} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: 'bold' }}>Portaria Comitê Gestor</label>
            <input type="url" name="link_portaria_gestor" defaultValue={dados.link_portaria_gestor} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: 'bold' }}>Portaria Comitê de Usuários</label>
            <input type="url" name="link_portaria_usuarios" defaultValue={dados.link_portaria_usuarios} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--gray-50)', padding: '16px', borderRadius: '8px' }}>
          <label style={{ fontWeight: 'bold' }}>Substituir PDF do Regimento Interno</label>
          <input type="file" name="regimento_pdf" accept=".pdf" style={{ marginTop: '6px' }} />
          {dados.arquivo_regimento_url && <small style={{ color: 'var(--green)', marginTop: '4px' }}>✓ Já existe um arquivo anexado ao sistema.</small>}
        </div>

        <button type="submit" style={{ background: 'var(--navy)', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Salvar Modificações do Portal
        </button>
      </form>
    </div>
  );
}