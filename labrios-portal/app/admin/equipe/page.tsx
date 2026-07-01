'use client';
// app/admin/equipe/page.tsx
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import type { MembroEquipe } from '../../../lib/supabase';
import { sanitizeFileName } from '../../../lib/sanitize';
import Toast from '../../../components/Toast';

type FormState = {
  nome: string;
  cargo: string;
  lattes_url: string;
  ordem: string;
};

const EMPTY: FormState = { nome: '', cargo: '', lattes_url: '', ordem: '0' };

export default function AdminEquipePage() {
  const [membros, setMembros] = useState<MembroEquipe[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'error') =>
    setToast({ msg, type });

  async function load() {
    const { data } = await supabase.from('equipe').select('*').order('ordem');
    setMembros(data ?? []);
  }

  useEffect(() => { load(); }, []);

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function uploadFoto(id: number): Promise<string | null> {
    if (!fotoFile) return null;
    const path = `equipe/${id}-${Date.now()}-${sanitizeFileName(fotoFile.name)}`;
    const { error } = await supabase.storage.from('ltip-public').upload(path, fotoFile, { upsert: true });
    if (error) { showToast('Erro no upload da foto: ' + error.message); return null; }
    const { data } = supabase.storage.from('ltip-public').getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    if (!form.nome.trim()) { showToast('Informe o nome do membro.'); return; }
    setLoading(true);
    try {
      if (editingId) {
        // Atualizar
        let fotoUrl: string | null = null;
        if (fotoFile) fotoUrl = await uploadFoto(editingId);

        const payload: Partial<MembroEquipe> = {
          nome: form.nome,
          cargo: form.cargo,
          lattes_url: form.lattes_url || null,
          ordem: Number(form.ordem),
          ...(fotoUrl ? { imagem_url: fotoUrl } : {}),
        };
        const { error } = await supabase.from('equipe').update(payload).eq('id', editingId);
        if (error) throw error;
        showToast('Membro atualizado!', 'success');
      } else {
        // Inserir
        const { data: inserted, error: insertErr } = await supabase
          .from('equipe')
          .insert([{ nome: form.nome, cargo: form.cargo, lattes_url: form.lattes_url || null, ordem: Number(form.ordem), imagem_url: null }])
          .select()
          .single();
        if (insertErr) throw insertErr;

        if (fotoFile && inserted) {
          const fotoUrl = await uploadFoto(inserted.id);
          if (fotoUrl) {
            await supabase.from('equipe').update({ imagem_url: fotoUrl }).eq('id', inserted.id);
          }
        }
        showToast('Membro cadastrado!', 'success');
      }
      resetForm();
      await load();
    } catch (err: any) {
      showToast('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function edit(m: MembroEquipe) {
    setEditingId(m.id);
    setForm({ nome: m.nome, cargo: m.cargo, lattes_url: m.lattes_url ?? '', ordem: String(m.ordem) });
    setFotoFile(null);
    setFotoPreview(m.imagem_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: number) {
    if (!confirm('Remover este membro?')) return;
    const { error } = await supabase.from('equipe').delete().eq('id', id);
    if (error) { showToast('Erro ao remover: ' + error.message); return; }
    showToast('Membro removido.', 'success');
    await load();
  }

  function resetForm() {
    setForm(EMPTY);
    setEditingId(null);
    setFotoFile(null);
    setFotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="admin-topbar">
        <h1>{editingId ? '✏️ Editar Membro' : '➕ Cadastrar Membro'}</h1>
      </div>

      <div className="admin-content">
        {/* ── Formulário ── */}
        <div className="admin-card">
          <h3>{editingId ? 'Editar Membro' : 'Novo Membro'}</h3>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Nome completo *</label>
              <input name="nome" placeholder="Nome do pesquisador" value={form.nome} onChange={handle} />
            </div>
            <div className="admin-input-group">
              <label>Função / Cargo</label>
              <input name="cargo" placeholder="Ex: Pesquisador Principal" value={form.cargo} onChange={handle} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Link do Currículo Lattes</label>
              <input name="lattes_url" type="url" placeholder="http://lattes.cnpq.br/..." value={form.lattes_url} onChange={handle} />
            </div>
            <div className="admin-input-group">
              <label>Ordem de exibição</label>
              <input name="ordem" type="number" placeholder="0" value={form.ordem} onChange={handle} />
            </div>
          </div>

          {/* Upload de foto */}
          <div className="admin-input-group">
            <label>Foto do membro</label>
            <div
              className="upload-zone"
              onClick={() => fileRef.current?.click()}
              style={fotoPreview ? { borderStyle: 'solid', borderColor: 'var(--navy)' } : {}}
            >
              {fotoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoPreview} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px' }} />
              ) : (
                <div className="upload-zone-icon">📸</div>
              )}
              <p><strong>Clique para selecionar</strong> ou arraste a foto aqui</p>
              <p style={{ marginTop: 6, fontSize: 12, color: 'var(--gray-400)' }}>PNG, JPG até 5MB</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFotoChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-primary-admin" onClick={save} disabled={loading}>
              {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Cadastrar Membro'}
            </button>
            {editingId && (
              <button className="btn-secondary-admin" onClick={resetForm}>Cancelar</button>
            )}
          </div>
        </div>

        {/* ── Tabela ── */}
        <div className="admin-card">
          <h3>👥 Membros Cadastrados ({membros.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Função</th>
                  <th>Ordem</th>
                  <th>Lattes</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {membros.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-600)' }}>Nenhum membro cadastrado.</td></tr>
                )}
                {membros.map((m) => {
                  const initials = m.nome?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="team-avatar" style={{ width: 40, height: 40, fontSize: 14, margin: 0 }}>
                          {m.imagem_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.imagem_url} alt={m.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          ) : initials}
                        </div>
                      </td>
                      <td><strong>{m.nome}</strong></td>
                      <td>{m.cargo}</td>
                      <td style={{ textAlign: 'center' }}>{m.ordem}</td>
                      <td>
                        {m.lattes_url
                          ? <a href={m.lattes_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)' }}>Ver Lattes</a>
                          : <span style={{ color: 'var(--gray-400)' }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-secondary-admin" onClick={() => edit(m)}>✏️ Editar</button>
                          <button className="btn-danger-admin" onClick={() => remove(m.id)}>🗑️ Excluir</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
