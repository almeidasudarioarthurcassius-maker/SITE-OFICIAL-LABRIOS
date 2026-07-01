'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Toast from '../../../components/Toast';
import { sanitizeFileName } from '../../../lib/sanitize';

type Sobre = { titulo: string; descricao: string; missao: string; visao: string; regras: string };
type Parceria = { nome: string; link: string };
type HorarioItem = { dias: string; horario: string };
type Contato = {
  endereco_linha1: string; endereco_linha2: string; cep: string; cidade: string;
  telefone: string; email: string; observacao: string;
  horarios: HorarioItem[];
};

const SOBRE_EMPTY: Sobre = { titulo: '', descricao: '', missao: '', visao: '', regras: '' };
const CONTATO_EMPTY: Contato = {
  endereco_linha1: '', endereco_linha2: '', cep: '', cidade: '',
  telefone: '', email: '', observacao: '', horarios: [],
};

export default function AdminConfiguracoesPage() {
  const [sobre, setSobre] = useState<Sobre>(SOBRE_EMPTY);
  const [contato, setContato] = useState<Contato>(CONTATO_EMPTY);
  const [parcerias, setParcerias] = useState<Parceria[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'error') => setToast({ msg, type });

  async function load() {
    const { data } = await supabase
      .from('configuracoes_site')
      .select('*')
      .in('chave', ['sobre', 'contato', 'logo', 'parcerias']);

    data?.forEach((row) => {
      if (row.chave === 'sobre') setSobre(row.valor);
      if (row.chave === 'contato') {
        const v = row.valor ?? {};
        let horarios: HorarioItem[] = v.horarios;
        setContato({ ...CONTATO_EMPTY, ...v, horarios: horarios ?? [] });
      }
      if (row.chave === 'logo') setLogoUrl(row.valor?.url ?? null);
      if (row.chave === 'parcerias') {
        setParcerias(row.valor ?? []);
      }
    });
  }

  useEffect(() => { load(); }, []);

  async function uploadLogo(): Promise<string | null> {
    if (!logoFile) return logoUrl;
    const path = `logo/logo-labrios-${Date.now()}-${sanitizeFileName(logoFile.name)}`;
    const { error } = await supabase.storage.from('ltip-public').upload(path, logoFile, { upsert: true });
    if (error) { showToast('Erro no upload da logo: ' + error.message); return logoUrl; }
    const { data } = supabase.storage.from('ltip-public').getPublicUrl(path);
    return data.publicUrl;
  }

  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function addParceria() { setParcerias((prev) => [...prev, { nome: '', link: '' }]); }
  function updateParceria(idx: number, field: keyof Parceria, value: string) {
    setParcerias((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  }
  function removeParceria(idx: number) { setParcerias((prev) => prev.filter((_, i) => i !== idx)); }

  function addHorario() {
    setContato((prev) => ({ ...prev, horarios: [...prev.horarios, { dias: '', horario: '' }] }));
  }
  function updateHorario(idx: number, field: keyof HorarioItem, value: string) {
    setContato((prev) => ({
      ...prev,
      horarios: prev.horarios.map((h, i) => (i === idx ? { ...h, [field]: value } : h)),
    }));
  }
  function removeHorario(idx: number) {
    setContato((prev) => ({ ...prev, horarios: prev.horarios.filter((_, i) => i !== idx) }));
  }

  async function saveAll() {
    setLoading(true);
    try {
      const novaLogoUrl = await uploadLogo();
      const parceriasLimpa = parcerias.filter((p) => p.nome.trim().length > 0);
      const horariosLimpo = contato.horarios.filter((h) => h.dias.trim().length > 0 || h.horario.trim().length > 0);
      const contatoFinal = { ...contato, horarios: horariosLimpo };

      const upserts = [
        { chave: 'sobre', valor: sobre },
        { chave: 'contato', valor: contatoFinal },
        { chave: 'logo', valor: { url: novaLogoUrl } },
        { chave: 'parcerias', valor: parceriasLimpa },
      ];

      for (const item of upserts) {
        const { error } = await supabase.from('configuracoes_site').upsert(item, { onConflict: 'chave' });
        if (error) throw error;
      }

      setLogoUrl(novaLogoUrl);
      setLogoFile(null);
      setContato(contatoFinal);
      setParcerias(parceriasLimpa);
      showToast('Configurações salvas com sucesso!', 'success');
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
        <h1>⚙️ Configurações do Portal</h1>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <h3>🖼️ Logo do Laboratório</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>
            Envie a logo oficial. Ela será inserida perfeitamente no menu superior.
          </p>
          <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ maxWidth: 400 }}>
            {(logoPreview || logoUrl) ? (
              <img
                src={logoPreview || logoUrl || ''}
                alt="Logo atual"
                style={{ height: 60, maxWidth: '100%', objectFit: 'contain', marginBottom: 12 }}
              />
            ) : (
              <div className="upload-zone-icon">🖼️</div>
            )}
            <p><strong>Clique aqui para escolher</strong> o arquivo da logo (Fundo transparente)</p>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onLogoChange} />
          </div>
        </div>

        <div className="admin-card">
          <h3>✏️ Missão, Visão e Textos Institucionais</h3>
          <div className="admin-input-group">
            <label>Título Principal</label>
            <input value={sobre.titulo} onChange={(e) => setSobre({ ...sobre, titulo: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Descrição Geral do Laboratório</label>
            <textarea rows={3} value={sobre.descricao} onChange={(e) => setSobre({ ...sobre, descricao: e.target.value })} />
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Missão</label>
              <textarea rows={4} value={sobre.missao} onChange={(e) => setSobre({ ...sobre, missao: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label>Visão</label>
              <textarea rows={4} value={sobre.visao} onChange={(e) => setSobre({ ...sobre, visao: e.target.value })} />
            </div>
          </div>
          <div className="admin-input-group">
            <label>Regras de Uso e Diretrizes</label>
            <textarea rows={4} value={sobre.regras} onChange={(e) => setSobre({ ...sobre, regras: e.target.value })} />
          </div>
        </div>

        <div className="admin-card">
          <h3>📍 Endereço e Informações de Contato</h3>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Endereço (Linha 1)</label>
              <input value={contato.endereco_linha1} onChange={(e) => setContato({ ...contato, endereco_linha1: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label>Endereço (Linha 2)</label>
              <input value={contato.endereco_linha2} onChange={(e) => setContato({ ...contato, endereco_linha2: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>CEP</label>
              <input value={contato.cep} onChange={(e) => setContato({ ...contato, cep: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label>Cidade / Estado</label>
              <input value={contato.cidade} onChange={(e) => setContato({ ...contato, cidade: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Telefone Comercial</label>
              <input value={contato.telefone} onChange={(e) => setContato({ ...contato, telefone: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label>E-mail de Contato</label>
              <input type="email" value={contato.email} onChange={(e) => setContato({ ...contato, email: e.target.value })} />
            </div>
          </div>
          <div className="admin-input-group">
            <label>Observações Adicionais</label>
            <input value={contato.observacao} onChange={(e) => setContato({ ...contato, observacao: e.target.value })} />
          </div>
        </div>

        <div className="admin-card">
          <h3>🕒 Horários de Atendimento</h3>
          {contato.horarios.map((h, i) => (
            <div key={i} className="admin-form-row" style={{ alignItems: 'flex-end' }}>
              <div className="admin-input-group">
                <label>Dias das Semana</label>
                <input placeholder="Ex: Segunda a Sexta" value={h.dias} onChange={(e) => updateHorario(i, 'dias', e.target.value)} />
              </div>
              <div className="admin-input-group" style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ marginBottom: 6 }}>Horário</label>
                  <input placeholder="Ex: 08:00 às 12:00" value={h.horario} onChange={(e) => updateHorario(i, 'horario', e.target.value)} />
                </div>
                <button className="btn-danger-admin" onClick={() => removeHorario(i)} style={{ height: 42, marginBottom: 0 }}>🗑️</button>
              </div>
            </div>
          ))}
          <button className="btn-secondary-admin" onClick={addHorario} style={{ marginTop: 8 }}>➕ Adicionar Horário</button>
        </div>

        <div className="admin-card">
          <h3>🤝 Parceiros e Apoiadores</h3>
          {parcerias.map((p, i) => (
            <div key={i} className="admin-form-row" style={{ alignItems: 'flex-end' }}>
              <div className="admin-input-group">
                <label>Instituição</label>
                <input placeholder="Ex: UEA / FAPEAM" value={p.nome} onChange={(e) => updateParceria(i, 'nome', e.target.value)} />
              </div>
              <div className="admin-input-group" style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ marginBottom: 6 }}>Link URL</label>
                  <input placeholder="https://..." value={p.link} onChange={(e) => updateParceria(i, 'link', e.target.value)} />
                </div>
                <button className="btn-danger-admin" onClick={() => removeParceria(i)} style={{ height: 42, marginBottom: 0 }}>🗑️</button>
              </div>
            </div>
          ))}
          <button className="btn-secondary-admin" onClick={addParceria} style={{ marginTop: 8 }}>➕ Adicionar Parceria</button>
        </div>

        <button className="btn-primary-admin" onClick={saveAll} disabled={loading} style={{ padding: '14px 40px', fontSize: 15, borderRadius: 6 }}>
          {loading ? 'Processando...' : '💾 Salvar Alterações'}
        </button>
      </div>
    </>
  );
}
