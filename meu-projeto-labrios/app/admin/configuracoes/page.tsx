import { supabase } from '../../../lib/supabase';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';

export default async function ConfigAdminPage() {
  const { data: config } = await supabase.from('configuracoes_labrios').select('*').eq('chave', 'geral').single();
  const dados = config?.valor || {};

  async function salvarConfig(formData: FormData) {
    'use server';
    const logoFile = formData.get('logo_file') as File;
    let logo_url = dados.logo_url || '';

    if (logoFile && logoFile.size > 0) {
      const ext = logoFile.name.split('.').pop();
      const fileName = `logo-labrios.${ext}`;
      const { data: uploadData } = await supabase.storage
        .from('labrios-files')
        .upload(fileName, logoFile, { cacheControl: '3600', upsert: true });
      if (uploadData) {
        logo_url = supabase.storage.from('labrios-files').getPublicUrl(fileName).data.publicUrl;
      }
    }

    const regimentoFile = formData.get('regimento_pdf') as File;
    let arquivo_regimento_url = dados.arquivo_regimento_url || '';
    if (regimentoFile && regimentoFile.size > 0) {
      const fileName = `regimento-${Date.now()}.pdf`;
      const { data: uploadData } = await supabase.storage
        .from('labrios-files')
        .upload(fileName, regimentoFile, { cacheControl: '3600', upsert: true });
      if (uploadData) {
        arquivo_regimento_url = supabase.storage.from('labrios-files').getPublicUrl(fileName).data.publicUrl;
      }
    }

    // Parcerias como lista separada por linha
    const parceriasRaw = (formData.get('parcerias') as string) || '';
    const parcerias = parceriasRaw.split('\n').map(l => l.trim()).filter(Boolean);

    const novoValor = {
      logo_url,
      nome_oficial: formData.get('nome_oficial'),
      texto_institucional: formData.get('texto_institucional'),
      missao: formData.get('missao'),
      visao: formData.get('visao'),
      objetivos: formData.get('objetivos'),
      link_formulario_externo: formData.get('link_formulario_externo'),
      link_portaria_gestor: formData.get('link_portaria_gestor'),
      link_portaria_usuarios: formData.get('link_portaria_usuarios'),
      arquivo_regimento_url,
      // Rodapé / contato
      endereco: formData.get('endereco'),
      dias_funcionamento: formData.get('dias_funcionamento'),
      horario_funcionamento: formData.get('horario_funcionamento'),
      telefone: formData.get('telefone'),
      email_contato: formData.get('email_contato'),
      parcerias,
    };

    await supabase.from('configuracoes_labrios').upsert({ chave: 'geral', valor: novoValor });
    revalidatePath('/'); revalidatePath('/como-utilizar'); revalidatePath('/admin/configuracoes');
  }

  async function removerLogo(_formData: FormData) {
    'use server';
    const { data: cfg } = await supabase.from('configuracoes_labrios').select('valor').eq('chave','geral').single();
    const val = { ...(cfg?.valor || {}), logo_url: '' };
    await supabase.from('configuracoes_labrios').upsert({ chave: 'geral', valor: val });
    revalidatePath('/'); revalidatePath('/admin/configuracoes');
  }

  const parcerias: string[] = Array.isArray(dados.parcerias) ? dados.parcerias : [];

  const cardStyle = { background: 'white', padding: 28, borderRadius: 12, border: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 } as const;
  const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)', fontSize: '14px', width: '100%' } as const;
  const labelStyle = { fontWeight: 700, fontSize: 13, color: 'var(--navy)', marginBottom: 4, display: 'block' } as const;

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ color: 'var(--navy)', fontSize: 24, marginBottom: 28 }}>⚙️ Configurações Gerais do Portal</h1>

      <form action={salvarConfig} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* LOGO */}
        <div style={cardStyle}>
          <h2 style={{ color: 'var(--navy)', fontSize: 16, fontWeight: 700, borderBottom: '2px solid var(--green)', paddingBottom: 8 }}>🖼️ Logo do Laboratório</h2>
          {dados.logo_url && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
              <img src={dados.logo_url} alt="Logo atual" style={{ height: 50, width: 'auto', borderRadius: 4 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>✓ Logo atual carregada</p>
                <p style={{ fontSize: 11, color: 'var(--gray-600)', marginTop: 2, wordBreak: 'break-all' }}>{dados.logo_url}</p>
              </div>
              <form action={removerLogo}>
                <button type="submit" style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Remover</button>
              </form>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>{dados.logo_url ? 'Substituir Logo (PNG, JPG, SVG)' : 'Enviar Logo do Laboratório (PNG, JPG, SVG)'}</label>
            <input type="file" name="logo_file" accept=".png,.jpg,.jpeg,.svg,.webp" style={{ fontSize: 14 }} />
            <small style={{ color: 'var(--gray-600)' }}>A logo será exibida no canto superior esquerdo da barra de navegação.</small>
          </div>
        </div>

        {/* IDENTIDADE */}
        <div style={cardStyle}>
          <h2 style={{ color: 'var(--navy)', fontSize: 16, fontWeight: 700, borderBottom: '2px solid var(--green)', paddingBottom: 8 }}>🏛️ Identidade Institucional</h2>
          <div>
            <label style={labelStyle}>Nome Oficial do Laboratório</label>
            <input type="text" name="nome_oficial" defaultValue={dados.nome_oficial} placeholder="Ex: LABRIOS" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Texto de Apresentação (Home)</label>
            <textarea name="texto_institucional" rows={4} defaultValue={dados.texto_institucional} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Missão</label>
            <textarea name="missao" rows={3} defaultValue={dados.missao} placeholder="A missão do laboratório..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Visão</label>
            <textarea name="visao" rows={3} defaultValue={dados.visao} placeholder="A visão do laboratório..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Objetivos</label>
            <textarea name="objetivos" rows={4} defaultValue={dados.objetivos} placeholder="Os objetivos do laboratório..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* CONTATO E FUNCIONAMENTO */}
        <div style={cardStyle}>
          <h2 style={{ color: 'var(--navy)', fontSize: 16, fontWeight: 700, borderBottom: '2px solid var(--green)', paddingBottom: 8 }}>📞 Contato & Funcionamento (Rodapé)</h2>
          <div>
            <label style={labelStyle}>Endereço Completo</label>
            <input type="text" name="endereco" defaultValue={dados.endereco} placeholder="Ex: Rua do Laboratório, 100 – Manaus, AM" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Dias de Funcionamento</label>
              <input type="text" name="dias_funcionamento" defaultValue={dados.dias_funcionamento} placeholder="Ex: Segunda a Sexta" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Horário de Funcionamento</label>
              <input type="text" name="horario_funcionamento" defaultValue={dados.horario_funcionamento} placeholder="Ex: 08h – 17h" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Telefone / WhatsApp</label>
              <input type="text" name="telefone" defaultValue={dados.telefone} placeholder="(92) 99999-9999" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>E-mail de Contato</label>
              <input type="email" name="email_contato" defaultValue={dados.email_contato} placeholder="contato@labrios.org" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Parcerias Institucionais (uma por linha)</label>
            <textarea name="parcerias" rows={4} defaultValue={parcerias.join('\n')} placeholder={"UFAM\nINPA\nFAPEAM"} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
            <small style={{ color: 'var(--gray-600)', fontSize: 12 }}>Cada linha vira um badge de parceria no rodapé do site.</small>
          </div>
        </div>

        {/* LINKS E DOCUMENTOS */}
        <div style={cardStyle}>
          <h2 style={{ color: 'var(--navy)', fontSize: 16, fontWeight: 700, borderBottom: '2px solid var(--green)', paddingBottom: 8 }}>🔗 Links e Documentos</h2>
          <div>
            <label style={labelStyle}>Link do Formulário Externo de Reserva (Foorms/Google Forms)</label>
            <input type="url" name="link_formulario_externo" defaultValue={dados.link_formulario_externo} placeholder="https://..." style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Portaria Comitê Gestor</label>
              <input type="url" name="link_portaria_gestor" defaultValue={dados.link_portaria_gestor} placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Portaria Comitê de Usuários</label>
              <input type="url" name="link_portaria_usuarios" defaultValue={dados.link_portaria_usuarios} placeholder="https://..." style={inputStyle} />
            </div>
          </div>
          <div style={{ background: 'var(--gray-50)', padding: 16, borderRadius: 8, border: '1px solid var(--gray-200)' }}>
            <label style={labelStyle}>Substituir PDF do Regimento Interno</label>
            <input type="file" name="regimento_pdf" accept=".pdf" style={{ fontSize: 14, marginTop: 4 }} />
            {dados.arquivo_regimento_url && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--green)', fontSize: 13 }}>✓ Regimento anexado.</span>
                <a href={dados.arquivo_regimento_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', fontSize: 12 }}>📄 Ver atual</a>
              </div>
            )}
          </div>
        </div>

        <button type="submit" style={{ background: 'var(--navy)', color: 'white', padding: '14px', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', fontSize: 15 }}>
          💾 Salvar Todas as Configurações
        </button>
      </form>
    </div>
  );
}
