import { supabase } from '../../../lib/supabase';
import { revalidatePath } from 'next/cache';
export const dynamic = 'force-dynamic';

export default async function AdminBannerPage() {
  const { data: config } = await supabase
    .from('configuracoes_labrios').select('valor').eq('chave', 'slides').single();
  const slides: any[] = Array.isArray(config?.valor) ? config.valor : [];

  async function adicionarSlide(formData: FormData) {
    'use server';
    const novoSlide = {
      tag: formData.get('tag') || 'LABRIOS',
      title: formData.get('title'),
      desc: formData.get('desc'),
      img: formData.get('img') || '',
      ctaLabel: formData.get('ctaLabel') || 'Saiba mais →',
      ctaHref: formData.get('ctaHref') || '/#equipamentos',
    };
    const atuais = slides;
    const novos = [...atuais, novoSlide];
    await supabase.from('configuracoes_labrios').upsert({ chave: 'slides', valor: novos });
    revalidatePath('/'); revalidatePath('/admin/banner');
  }

  async function removerSlide(formData: FormData) {
    'use server';
    const idx = Number(formData.get('idx'));
    const { data: cfg } = await supabase.from('configuracoes_labrios').select('valor').eq('chave','slides').single();
    const lista: any[] = Array.isArray(cfg?.valor) ? cfg.valor : [];
    lista.splice(idx, 1);
    await supabase.from('configuracoes_labrios').upsert({ chave: 'slides', valor: lista });
    revalidatePath('/'); revalidatePath('/admin/banner');
  }

  const inp = 'padding:10px;border-radius:6px;border:1px solid var(--gray-200);width:100%;font-size:14px;';

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ color: 'var(--navy)', fontSize: 24, marginBottom: 24 }}>🖼️ Banner / Slides do Hero</h1>

      {/* FORM ADICIONAR */}
      <form action={adicionarSlide} style={{ background: 'white', padding: 28, borderRadius: 12, border: '1px solid var(--gray-200)', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ color: 'var(--navy-light)', marginBottom: 4 }}>Adicionar Slide</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 700 }}>Tag (ex: DESTAQUE)</label>
            <input name="tag" placeholder="LABRIOS" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 700 }}>Título do Slide *</label>
            <input required name="title" placeholder="Título principal do banner" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 700 }}>Descrição</label>
          <textarea name="desc" rows={2} placeholder="Texto complementar do banner..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)', resize: 'vertical' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 700 }}>URL da Imagem de Fundo</label>
            <input name="img" type="url" placeholder="https://..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 700 }}>Link do Botão CTA</label>
            <input name="ctaHref" placeholder="/#equipamentos" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 12, fontWeight: 700 }}>Texto do Botão CTA</label>
          <input name="ctaLabel" placeholder="Saiba mais →" style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)', maxWidth: 260 }} />
        </div>
        <button type="submit" style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
          ➕ Adicionar Slide
        </button>
      </form>

      {/* LISTA DE SLIDES */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--navy)' }}>Slides Cadastrados ({slides.length})</h3>
        </div>
        {slides.length === 0 ? (
          <p style={{ padding: 32, color: 'var(--gray-600)', textAlign: 'center' }}>Nenhum slide cadastrado. Adicione o primeiro banner acima.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {slides.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 24px', borderBottom: i < slides.length-1 ? '1px solid var(--gray-200)' : 'none' }}>
                {s.img && <img src={s.img} alt={s.title} style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />}
                {!s.img && <div style={{ width: 100, height: 60, background: 'var(--gray-100)', borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🖼️</div>}
                <div style={{ flex: 1 }}>
                  <span style={{ background: 'var(--green)', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{s.tag}</span>
                  <p style={{ fontWeight: 700, color: 'var(--navy)', marginTop: 4 }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 2 }}>{s.desc}</p>
                </div>
                <form action={removerSlide}>
                  <input type="hidden" name="idx" value={i} />
                  <button type="submit" style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}>🗑️ Remover</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
