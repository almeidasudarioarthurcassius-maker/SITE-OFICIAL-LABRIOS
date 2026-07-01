'use client';
// app/admin/documentos/page.tsx
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Documento } from '../../../lib/supabase';
import Toast from '../../../components/Toast';
import { sanitizeFileName } from '../../../lib/sanitize';

type FormState = { titulo: string; categoria: string };
const EMPTY: FormState = { titulo: '', categoria: 'Relatório Mensal' };

const CATEGORIAS = ['Relatório Mensal', 'Relatório Anual', 'Regimento Interno', 'Ata de Reunião', 'Manual de Uso', 'Outro'];

export default function AdminDocumentosPage() {
  const [docs, setDocs] = useState<Documento[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'error') =>
    setToast({ msg, type });

  async function load() {
    const { data } = await supabase.from('documentos').select('*').order('data_upload', { ascending: false });
    setDocs(data ?? []);
  }

  useEffect(() => { load(); }, []);

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { showToast('Apenas arquivos PDF são aceitos.'); return; }
    if (file.size > 50 * 1024 * 1024) { showToast('Arquivo muito grande. Máximo 50MB.'); return; }
    setPdfFile(file);
  }

  async function upload() {
    if (!form.titulo.trim()) { showToast('Informe o título do documento.'); return; }
    if (!pdfFile) { showToast('Selecione um arquivo PDF.'); return; }

    setLoading(true);
    try {
      // Upload para Supabase Storage
      const path = `documentos/${Date.now()}-${sanitizeFileName(pdfFile.name)}`;
      const { error: uploadErr } = await supabase.storage
        .from('ltip-public')
        .upload(path, pdfFile, { contentType: 'application/pdf' });
      if (uploadErr) throw new Error('Upload falhou: ' + uploadErr.message);

      // URL pública
      const { data: urlData } = supabase.storage.from('ltip-public').getPublicUrl(path);

      // Salvar registro no banco
      const { error: dbErr } = await supabase.from('documentos').insert([{
        titulo: form.titulo,
        categoria: form.categoria,
        arquivo_url: urlData.publicUrl,
        data_upload: new Date().toISOString(),
      }]);
      if (dbErr) throw dbErr;

      showToast('Documento publicado!', 'success');
      setForm(EMPTY);
      setPdfFile(null);
      if (fileRef.current) fileRef.current.value = '';
      await load();
    } catch (err: any) {
      showToast('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function remove(doc: Documento) {
    if (!confirm(`Excluir "${doc.titulo}"?`)) return;

    // Tentar remover do Storage (extrai path a partir da URL pública)
    try {
      const url = new URL(doc.arquivo_url);
      const parts = url.pathname.split('/ltip-public/');
      if (parts[1]) {
        await supabase.storage.from('ltip-public').remove([decodeURIComponent(parts[1])]);
      }
    } catch {
      // Ignora falhas de remoção de storage (o banco ainda será limpo)
    }

    const { error } = await supabase.from('documentos').delete().eq('id', doc.id);
    if (error) { showToast('Erro ao excluir: ' + error.message); return; }
    showToast('Documento removido.', 'success');
    await load();
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      <div className="admin-topbar">
        <h1>📄 Gerenciar Documentos</h1>
      </div>

      <div className="admin-content">
        {/* ── Upload ── */}
        <div className="admin-card">
          <h3>📤 Publicar Novo Documento</h3>

          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Título do documento *</label>
              <input name="titulo" placeholder="Ex: Relatório Mensal Junho 2025" value={form.titulo} onChange={handle} />
            </div>
            <div className="admin-input-group">
              <label>Categoria</label>
              <select name="categoria" value={form.categoria} onChange={handle}>
                {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-input-group">
            <label>Arquivo PDF *</label>
            <div
              className="upload-zone"
              onClick={() => fileRef.current?.click()}
              style={pdfFile ? { borderStyle: 'solid', borderColor: 'var(--navy)' } : {}}
            >
              <div className="upload-zone-icon">📄</div>
              <p>
                {pdfFile
                  ? <><strong>✅ {pdfFile.name}</strong> ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</>
                  : <><strong>Clique para selecionar</strong> ou arraste o PDF aqui</>}
              </p>
              <p style={{ marginTop: 6, fontSize: 12, color: 'var(--gray-400)' }}>
                Apenas PDF, até 50MB • Armazenado no Supabase Storage
              </p>
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={onFileChange} />
            </div>
          </div>

          <button className="btn-primary-admin" onClick={upload} disabled={loading}>
            {loading ? 'Enviando...' : '📤 Publicar Documento'}
          </button>
        </div>

        {/* ── Tabela ── */}
        <div className="admin-card">
          <h3>📁 Documentos Publicados ({docs.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Data</th>
                  <th>Link</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-600)' }}>Nenhum documento publicado.</td></tr>
                )}
                {docs.map((doc) => (
                  <tr key={doc.id}>
                    <td><strong>{doc.titulo}</strong></td>
                    <td>{doc.categoria ?? '—'}</td>
                    <td>{new Date(doc.data_upload).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <a href={doc.arquivo_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', fontWeight: 600, fontSize: 13 }}>
                        👁️ Ver PDF
                      </a>
                    </td>
                    <td>
                      <button className="btn-danger-admin" onClick={() => remove(doc)}>🗑️ Excluir</button>
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
