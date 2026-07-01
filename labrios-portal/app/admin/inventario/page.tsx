'use client';
// app/admin/inventario/page.tsx
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Equipamento } from '../../../lib/supabase';
import { sanitizeFileName } from '../../../lib/sanitize';
import Toast from '../../../components/Toast';

type FormState = {
  nome_equipamento: string;
  quantidade: string;
  funcionalidade: string;
  status: 'disponivel' | 'manutencao' | 'reservado';
  tombo: string;
  especificacoes: string;
};

const EMPTY: FormState = {
  nome_equipamento: '', quantidade: '1', funcionalidade: '',
  status: 'disponivel', tombo: '', especificacoes: '',
};

const STATUS_LABELS: Record<string, string> = {
  disponivel: 'Disponível', manutencao: 'Manutenção', reservado: 'Reservado',
};

export default function AdminInventarioPage() {
  const [items, setItems] = useState<Equipamento[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'error') =>
    setToast({ msg, type });

  async function load() {
    const { data } = await supabase.from('inventario').select('*').order('nome_equipamento');
    setItems(data ?? []);
  }

  useEffect(() => { load(); }, []);

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value } as FormState);
  }

  function onImgChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  }

  async function uploadImg(id: number): Promise<string | null> {
    if (!imgFile) return null;
    const path = `inventario/${id}-${Date.now()}-${sanitizeFileName(imgFile.name)}`;
    const { error } = await supabase.storage.from('ltip-public').upload(path, imgFile, { upsert: true });
    if (error) { showToast('Erro no upload da imagem: ' + error.message); return null; }
    const { data } = supabase.storage.from('ltip-public').getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    if (!form.nome_equipamento.trim()) { showToast('Informe o nome do equipamento.'); return; }
    setLoading(true);
    try {
      if (editingId) {
        let imgUrl: string | null = null;
        if (imgFile) imgUrl = await uploadImg(editingId);

        const payload: Partial<Equipamento> = {
          nome_equipamento: form.nome_equipamento,
          quantidade: Number(form.quantidade),
          funcionalidade: form.funcionalidade || null,
          status: form.status,
          tombo: form.tombo || null,
          especificacoes: form.especificacoes || null,
          ...(imgUrl ? { imagem_url: imgUrl } : {}),
        };
        const { error } = await supabase.from('inventario').update(payload).eq('id', editingId);
        if (error) throw error;
        showToast('Equipamento atualizado!', 'success');
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('inventario')
          .insert([{
            nome_equipamento: form.nome_equipamento,
            quantidade: Number(form.quantidade),
            funcionalidade: form.funcionalidade || null,
            status: form.status,
            tombo: form.tombo || null,
            especificacoes: form.especificacoes || null,
            imagem_url: null,
          }])
          .select()
          .single();
        if (insertErr) throw insertErr;

        if (imgFile && inserted) {
          const imgUrl = await uploadImg(inserted.id);
          if (imgUrl) {
            await supabase.from('inventario').update({ imagem_url: imgUrl }).eq('id', inserted.id);
          }
        }
        showToast('Equipamento adicionado!', 'success');
      }
      resetForm();
      await load();
    } catch (err: any) {
      showToast('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function edit(item: Equipamento) {
    setEditingId(item.id);
    setForm({
      nome_equipamento: item.nome_equipamento,
      quantidade: String(item.quantidade),
      funcionalidade: item.funcionalidade ?? '',
      status: item.status,
      tombo: item.tombo ?? '',
      especificacoes: item.especificacoes ?? '',
    });
    setImgFile(null);
    setImgPreview(item.imagem_url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: number) {
    if (!confirm('Excluir este equipamento?')) return;
    const { error } = await supabase.from('inventario').delete().eq('id', id);
    if (error) { showToast('Erro ao excluir: ' + error.message); return; }
    showToast('Equipamento removido.', 'success');
    await load();
  }

  async function quickStatus(id: number, status: string) {
    const { error } = await supabase.from('inventario').update({ status }).eq('id', id);
    if (error) { showToast('Erro: ' + error.message); return; }
    showToast('Status atualizado!', 'success');
    await load();
  }

  function resetForm() {
    setForm(EMPTY);
    setEditingId(null);
    setImgFile(null);
    setImgPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  const badgeClass = (s: string) =>
    s === 'disponivel' ? 'badge-status badge-available'
    : s === 'reservado' ? 'badge-status badge-reserved'
    : 'badge-status badge-maintenance';

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="admin-topbar">
        <h1>{editingId ? '✏️ Editar Equipamento' : '➕ Novo Equipamento'}</h1>
      </div>

      <div className="admin-content">
        {/* ── Formulário ── */}
        <div className="admin-card">
          <h3>{editingId ? 'Editar Equipamento' : 'Cadastrar Equipamento'}</h3>

          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Nome do equipamento *</label>
              <input name="nome_equipamento" placeholder="Ex: Workstation Dell Precision" value={form.nome_equipamento} onChange={handle} />
            </div>
            <div className="admin-input-group">
              <label>Quantidade</label>
              <input name="quantidade" type="number" min={1} placeholder="1" value={form.quantidade} onChange={handle} />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Patrimônio / Tombo</label>
              <input name="tombo" placeholder="Ex: LTIP-2025-001" value={form.tombo} onChange={handle} />
            </div>
            <div className="admin-input-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option value="disponivel">Disponível</option>
                <option value="reservado">Reservado</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>
          </div>

          <div className="admin-input-group">
            <label>Especificações técnicas</label>
            <input name="especificacoes" placeholder="Ex: Intel i9, 64GB RAM, RTX 4090 (separadas por vírgula)" value={form.especificacoes} onChange={handle} />
          </div>

          <div className="admin-input-group">
            <label>Funcionalidade / Descrição de uso</label>
            <textarea
              name="funcionalidade" rows={3}
              placeholder="Descreva para que serve este equipamento e como pode ser utilizado nas pesquisas..."
              value={form.funcionalidade} onChange={handle}
            />
          </div>

          {/* Upload de imagem */}
          <div className="admin-input-group">
            <label>Imagem do equipamento</label>
            <div
              className="upload-zone"
              onClick={() => fileRef.current?.click()}
              style={imgPreview ? { borderStyle: 'solid', borderColor: 'var(--navy)', padding: 16 } : {}}
            >
              {imgPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgPreview} alt="Preview" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', margin: '0 auto 12px', display: 'block' }} />
              ) : (
                <div className="upload-zone-icon">🖼️</div>
              )}
              <p><strong>Clique para selecionar</strong> ou arraste a imagem aqui</p>
              <p style={{ marginTop: 6, fontSize: 12, color: 'var(--gray-400)' }}>PNG, JPG até 10MB</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onImgChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-primary-admin" onClick={save} disabled={loading}>
              {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Adicionar Equipamento'}
            </button>
            {editingId && (
              <button className="btn-secondary-admin" onClick={resetForm}>Cancelar</button>
            )}
          </div>
        </div>

        {/* ── Tabela ── */}
        <div className="admin-card">
          <h3>📋 Equipamentos Cadastrados ({items.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Qtd.</th>
                  <th>Tombo</th>
                  <th>Status</th>
                  <th>Alterar Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-600)' }}>Nenhum equipamento cadastrado.</td></tr>
                )}
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.imagem_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imagem_url} alt={item.nome_equipamento} className="equip-img" />
                      ) : (
                        <div style={{ width: 56, height: 44, background: 'var(--gray-100)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🖥️</div>
                      )}
                    </td>
                    <td>
                      <strong>{item.nome_equipamento}</strong>
                      {item.tombo && <><br /><span className="tombo">{item.tombo}</span></>}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.quantidade}</td>
                    <td><span className="tombo">{item.tombo ?? '—'}</span></td>
                    <td><span className={badgeClass(item.status)}>{STATUS_LABELS[item.status]}</span></td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) => quickStatus(item.id, e.target.value)}
                        style={{ padding: '5px 8px', border: '1px solid var(--gray-200)', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}
                      >
                        <option value="disponivel">Disponível</option>
                        <option value="reservado">Reservado</option>
                        <option value="manutencao">Manutenção</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-secondary-admin" onClick={() => edit(item)}>✏️ Editar</button>
                        <button className="btn-danger-admin" onClick={() => remove(item.id)}>🗑️ Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
