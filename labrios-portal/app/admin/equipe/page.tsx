'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { sanitizeFileName } from '../../../lib/sanitize';
import Toast from '../../../components/Toast';

type FormState = {
  nome: string;
  cargo: string;
  lattes_url: string;
  ordem: string;
  tipo: string;
};

const EMPTY: FormState = { nome: '', cargo: '', lattes_url: '', ordem: '0', tipo: 'laboratorio' };

export default function AdminEquipePage() {
  const [membros, setMembros] = useState<any[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'error') => setToast({ msg, type });

  async function load() {
    const { data } = await supabase.from('equipe').select('*').order('tipo').order('ordem');
    setMembros(data ?? []);
  }

  useEffect(() => { load(); }, []);

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
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
        let fotoUrl: string | null = null;
        if (fotoFile) fotoUrl = await uploadFoto(editingId);

        const payload = {
          nome: form.nome,
          cargo: form.cargo,
          lattes_url: form.lattes_url || null,
          ordem: Number(form.ordem),
          tipo: form.tipo,
          ...(fotoUrl ? { imagem_url: fotoUrl } : {}),
        };
        const { error } = await supabase.from('equipe').update(payload).eq('id', editingId);
        if (error) throw error;
        showToast('Membro atualizado com sucesso!', 'success');
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('equipe')
          .insert([{ nome: form.nome, cargo: form.cargo, lattes_url: form.lattes_url || null, ordem: Number(form.ordem), tipo: form.tipo, imagem_url: null }])
          .select()
          .single();
        if (insertErr) throw insertErr;

        if (fotoFile && inserted) {
          const fotoUrl = await uploadFoto(inserted.id);
          if (fotoUrl) {
            await supabase.from('equipe').update({ imagem_url: fotoUrl }).eq('id', inserted.id);
          }
        }
        showToast('Membro cadastrado com sucesso!', 'success');
      }
      resetForm();
      await load();
    } catch (err: any) {
      showToast('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function edit(m: any) {
    setEditingId(m.id);
    setForm({ nome: m.nome, cargo: m.cargo, lattes_url: m.lattes_url ?? '', ordem: String(m.ordem), tipo: m.tipo || 'laboratorio' });
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

  const getTipoLabel = (tipo: string) => {
    if (tipo === 'gestor') return 'Comitê Gestor';
    if (tipo === 'usuarios') return 'Comitê de Usuários';
    return 'Membro do Laboratório';
  };

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="admin-topbar">
        <h1>👥 Gerenciamento de Membros e Comitês</h1>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <h3>{editingId ? '✏️ Editar Membro' : '➕ Novo Membro / Conselheiro'}</h3>
          
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Nome Completo *</label>
              <input name="nome" placeholder="Nome do membro" value={form.nome} onChange={handle} />
            </div>
            <div className="admin-input-group">
              <label>Vínculo / Função / Cargo</label>
              <input name="cargo" placeholder="Ex: Coordenador / Representante Técnico" value={form.cargo} onChange={handle} />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Tipo / Categoria de Membro</label>
              <select name="tipo" value={form.tipo} onChange={handle}>
                <option value="laboratorio">Membro Efetivo do Laboratório</option>
                <option value="gestor">Membro do Comitê Gestor</option>
                <option value="usuarios">Membro do Comitê de Usuários</option>
              </select>
            </div>
            <div className="admin-input-group">
              <label>Link do Currículo Lattes (Opcional)</label>
              <input name="lattes_url" type="url" placeholder="http://lattes.cnpq.br/..." value={form.lattes_url} onChange={handle} />
            </div>
            <div className="admin-input-group" style={{ maxWidth: '150px' }}>
              <label>Ordem de Exibição</label>
              <input name="ordem" type="number" value={form.ordem} onChange={handle} />
            </div>
          </div>

          <div className="admin-input-group">
            <label>Foto de Identificação</label>
            <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ maxWidth: 350 }}>
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />
              ) : (
                <div className="upload-zone-icon">📸</div>
              )}
              <p><strong>Clique para carregar</strong> a imagem de perfil</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFotoChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn-primary-admin" onClick={save} disabled={loading} style={{ padding: '12px 28px' }}>
              {loading ? 'Processando...' : editingId ? 'Salvar Alterações' : 'Cadastrar Integrante'}
            </button>
            {editingId && <button className="btn-secondary-admin" onClick={resetForm}>Cancelar</button>}
          </div>
        </div>

        <div className="admin-card">
          <h3>👥 Corpo Técnico e Comitês Registrados ({membros.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Função / Vínculo</th>
                  <th>Ordem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {membros.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-600)' }}>Nenhum membro cadastrado.</td></tr>
                ) : (
                  membros.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <img 
                          src={m.imagem_url || '/avatar-placeholder.png'} 
                          alt={m.nome} 
                          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e)=>{(e.target as HTMLImageElement).src='https://via.placeholder.com/150'}}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{m.nome}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: 600,
                          background: m.tipo === 'gestor' ? '#E3F2FD' : m.tipo === 'usuarios' ? '#E8F5E9' : '#ECEFF1',
                          color: m.tipo === 'gestor' ? '#1565C0' : m.tipo === 'usuarios' ? '#2E7D32' : '#37474F'
                        }}>
                          {getTipoLabel(m.tipo)}
                        </span>
                      </td>
                      <td>{m.cargo || '—'}</td>
                      <td>{m.ordem}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-action" onClick={() => edit(m)}>✏️ Editar</button>
                          <button className="btn-danger-admin" style={{ padding: '6px 12px' }} onClick={() => remove(m.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
