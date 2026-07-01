'use client';
// app/admin/banner/page.tsx
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Toast from '../../../components/Toast';
import { sanitizeFileName } from '../../../lib/sanitize';

type Slide = { tag: string; title: string; desc: string; img: string; ctaLabel: string; ctaHref: string };

const NOVO_SLIDE: Slide = {
  tag: 'Novidade', title: '', desc: '', img: '', ctaLabel: 'Saiba mais →', ctaHref: '/#sobre',
};

export default function AdminBannerPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const showToast = (msg: string, type: 'success' | 'error' = 'error') => setToast({ msg, type });

  async function load() {
    const { data } = await supabase.from('configuracoes_site').select('valor').eq('chave', 'slides').single();
    setSlides(data?.valor ?? []);
  }

  useEffect(() => { load(); }, []);

  function update(idx: number, field: keyof Slide, value: string) {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  }

  function addSlide() {
    setSlides((prev) => [...prev, { ...NOVO_SLIDE }]);
  }

  function removeSlide(idx: number) {
    if (!confirm('Remover este slide?')) return;
    setSlides((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onImageChange(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const path = `slides/slide-${Date.now()}-${sanitizeFileName(file.name)}`;
      const { error } = await supabase.storage.from('ltip-public').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('ltip-public').getPublicUrl(path);
      update(idx, 'img', data.publicUrl);
      showToast('Imagem do slide enviada!', 'success');
    } catch (err: any) {
      showToast('Erro no upload: ' + err.message);
    } finally {
      setUploadingIdx(null);
    }
  }

  async function saveSlides() {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('configuracoes_site')
        .upsert({ chave: 'slides', valor: slides }, { onConflict: 'chave' });
      if (error) throw error;
      showToast('Slides salvos com sucesso!', 'success');
    } catch (err: any) {
      showToast('Erro ao salvar: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="admin-topbar">
        <h1>🖼️ Banner / Slides</h1>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <h3>🖼️ Gerenciar Slides do Banner Inicial</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 20 }}>
            Cadastre imagens de cursos, eventos e avisos. Eles aparecem em rotação na página inicial.
          </p>

          {slides.map((s, i) => (
            <div key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Slide {i + 1}</div>
                <button className="btn-danger-admin" onClick={() => removeSlide(i)}>🗑️ Remover</button>
              </div>

              <div className="admin-input-group">
                <label>Imagem do slide</label>
                <div
                  className="upload-zone"
                  onClick={() => fileRefs.current[i]?.click()}
                  style={{ padding: 20 }}
                >
                  {s.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.img} alt={`Slide ${i + 1}`} style={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                  ) : (
                    <div className="upload-zone-icon">🖼️</div>
                  )}
                  <p>
                    {uploadingIdx === i ? 'Enviando...' : <><strong>Clique para selecionar</strong> a imagem</>}
                  </p>
                  <input
                    ref={(el) => { fileRefs.current[i] = el; }}
                    type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={(e) => onImageChange(i, e)}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-input-group">
                  <label>Tag / Categoria</label>
                  <input value={s.tag} onChange={(e) => update(i, 'tag', e.target.value)} />
                </div>
                <div className="admin-input-group">
                  <label>Título</label>
                  <input value={s.title} onChange={(e) => update(i, 'title', e.target.value)} />
                </div>
              </div>

              <div className="admin-input-group">
                <label>Descrição</label>
                <textarea rows={2} value={s.desc} onChange={(e) => update(i, 'desc', e.target.value)} />
              </div>

              <div className="admin-form-row">
                <div className="admin-input-group">
                  <label>Texto do botão</label>
                  <input value={s.ctaLabel} onChange={(e) => update(i, 'ctaLabel', e.target.value)} />
                </div>
                <div className="admin-input-group">
                  <label>Link do botão</label>
                  <input value={s.ctaHref} onChange={(e) => update(i, 'ctaHref', e.target.value)} placeholder="/#agendamento" />
                </div>
              </div>
            </div>
          ))}

          <button className="btn-secondary-admin" onClick={addSlide} style={{ marginBottom: 16 }}>
            ➕ Adicionar Novo Slide
          </button>

          <div>
            <button className="btn-primary-admin" onClick={saveSlides} disabled={loading}>
              {loading ? 'Salvando...' : '💾 Salvar Slides'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
