'use client';
// app/admin/configuracoes/page.tsx
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
        // Migração automática do formato antigo (horario_semana/horario_sabado) para o novo (horarios[])
        let horarios: HorarioItem[] = v.horarios;
        if (!horarios && (v.horario_semana || v.horario_sabado)) {
          horarios = [
            ...(v.horario_semana ? [{ dias: 'Segunda a Sexta', horario: v.horario_semana }] : []),
            ...(v.horario_sabado ? [{ dias: 'Sábado', horario: v.horario_sabado }] : []),
          ];
        }
        setContato({ ...CONTATO_EMPTY, ...v, horarios: horarios ?? [] });
      }

      if (row.chave === 'logo') setLogoUrl(row.valor?.url ?? null);

      if (row.chave === 'parcerias') {
        const v = row.valor ?? [];
        // Migração automática do formato antigo (array de strings) para o novo (array de {nome, link})
        const normalizado: Parceria[] = v.map((p: any) =>
          typeof p === 'string' ? { nome: p, link: '' } : { nome: p.nome ?? '', link: p.link ?? '' }
        );
        setParcerias(normalizado);
      }
    });
  }

  useEffect(() => { load(); }, []);

  async function uploadLogo(): Promise<string | null> {
    if (!logoFile) return logoUrl;
    const path = `logo/logo-ltip-${Date.now()}-${sanitizeFileName(logoFile.name)}`;
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

  // ── Parcerias ──
  function addParceria() {
    setParcerias((prev) => [...prev, { nome: '', link: '' }]);
  }
  function updateParceria(idx: number, field: keyof Parceria, value: string) {
    setParcerias((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  }
  function removeParceria(idx: number) {
    setParcerias((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── Horários ──
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

      // Limpa parcerias vazias antes de salvar
      const parceriasLimpa = parcerias
        .map((p) => ({ nome: p.nome.trim(), link: p.link.trim() }))
        .filter((p) => p.nome.length > 0);

      const horariosLimpo = contato.horarios
        .map((h) => ({ dias: h.dias.trim(), horario: h.horario.trim() }))
        .filter((h) => h.dias.length > 0 || h.horario.length > 0);

      const contatoFinal = { ...contato, horarios: horariosLimpo };

      const upserts: { chave: string; valor: any }[] = [
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
        <h1>⚙️ Sobre / Contato / Logo</h1>
      </div>

      <div className="admin-content">

        {/* ── LOGO ── */}
        <div className="admin-card">
          <h3>🖼️ Logo do Laboratório</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>
            Envie a logo oficial do LTIP. Ela aparecerá no cabeçalho do site, substituindo o texto "LTIP".
          </p>
          <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ maxWidth: 320 }}>
            {(logoPreview || logoUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview || logoUrl || ''}
                alt="Logo atual"
                style={{ height: 60, maxWidth: '100%', objectFit: 'contain', margin: '0 auto 12px' }}
              />
            ) : (
              <div className="upload-zone-icon">🖼️</div>
            )}
            <p><strong>Clique para selecionar</strong> a logo (PNG com fundo transparente)</p>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onLogoChange} />
          </div>
        </div>

        {/* ── SOBRE ── */}
        <div className="admin-card">
          <h3>✏️ Textos da Seção "Sobre"</h3>
          <div className="admin-input-group">
            <label>Título da Seção</label>
            <input value={sobre.titulo} onChange={(e) => setSobre({ ...sobre, titulo: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Descrição geral</label>
            <textarea rows={3} value={sobre.descricao} onChange={(e) => setSobre({ ...sobre, descricao: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Missão</label>
            <textarea rows={4} value={sobre.missao} onChange={(e) => setSobre({ ...sobre, missao: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Visão</label>
            <textarea rows={4} value={sobre.visao} onChange={(e) => setSobre({ ...sobre, visao: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <label>Regras de Uso</label>
            <textarea rows={4} value={sobre.regras} onChange={(e) => setSobre({ ...sobre, regras: e.target.value })} />
          </div>
        </div>

        {/* ── CONTATO / ENDEREÇO ── */}
        <div className="admin-card">
          <h3>📍 Endereço e Contato</h3>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Endereço — linha 1</label>
              <input
                placeholder="Ex: Av. General Rodrigo Octávio, 6200"
                value={contato.endereco_linha1}
                onChange={(e) => setContato({ ...contato, endereco_linha1: e.target.value })}
              />
            </div>
            <div className="admin-input-group">
              <label>Endereço — linha 2</label>
              <input
                placeholder="Ex: Campus Universitário, Setor Sul"
                value={contato.endereco_linha2}
                onChange={(e) => setContato({ ...contato, endereco_linha2: e.target.value })}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>CEP</label>
              <input value={contato.cep} onChange={(e) => setContato({ ...contato, cep: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label>Cidade / UF</label>
              <input
                placeholder="Ex: Manaus – AM"
                value={contato.cidade}
                onChange={(e) => setContato({ ...contato, cidade: e.target.value })}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-input-group">
              <label>Telefone</label>
              <input value={contato.telefone} onChange={(e) => setContato({ ...contato, telefone: e.target.value })} />
            </div>
            <div className="admin-input-group">
              <label>E-mail</label>
              <input value={contato.email} onChange={(e) => setContato({ ...contato, email: e.target.value })} />
            </div>
          </div>
          <div className="admin-input-group">
            <label>Observação sobre horário</label>
            <input
              placeholder="Ex: Atendimento fora do horário mediante agendamento prévio"
              value={contato.observacao}
              onChange={(e) => setContato({ ...contato, observacao: e.target.value })}
            />
          </div>
        </div>

        {/* ── HORÁRIOS DE FUNCIONAMENTO ── */}
        <div className="admin-card">
          <h3>🕒 Horário de Funcionamento</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>
            Cadastre os dias e horários exatos de funcionamento do laboratório. Adicione quantas linhas precisar
            (ex: "Terça e Quinta" — "13h00 às 17h00").
          </p>

          {contato.horarios.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 12 }}>
              Nenhum horário cadastrado ainda. Clique em "Adicionar Horário" abaixo.
            </p>
          )}

          {contato.horarios.map((h, i) => (
            <div key={i} className="admin-form-row" style={{ alignItems: 'flex-end' }}>
              <div className="admin-input-group">
                <label>Dias</label>
                <input
                  placeholder="Ex: Terça e Quinta"
                  value={h.dias}
                  onChange={(e) => updateHorario(i, 'dias', e.target.value)}
                />
              </div>
              <div className="admin-input-group" style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Horário</label>
                  <input
                    placeholder="Ex: 13h00 – 17h00"
                    value={h.horario}
                    onChange={(e) => updateHorario(i, 'horario', e.target.value)}
                  />
                </div>
                <button
                  className="btn-danger-admin"
                  onClick={() => removeHorario(i)}
                  style={{ marginBottom: 0, height: 41 }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <button className="btn-secondary-admin" onClick={addHorario}>➕ Adicionar Horário</button>
        </div>

        {/* ── PARCERIAS ── */}
        <div className="admin-card">
          <h3>🤝 Parcerias</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>
            Cadastre o nome de cada instituição parceira e, se quiser, o link do site dela.
            Quando houver link, o nome aparece como um botão clicável no rodapé do site.
          </p>

          {parcerias.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 12 }}>
              Nenhuma parceria cadastrada ainda. Clique em "Adicionar Parceria" abaixo.
            </p>
          )}

          {parcerias.map((p, i) => (
            <div key={i} className="admin-form-row" style={{ alignItems: 'flex-end' }}>
              <div className="admin-input-group">
                <label>Nome da instituição</label>
                <input
                  placeholder="Ex: FINEP"
                  value={p.nome}
                  onChange={(e) => updateParceria(i, 'nome', e.target.value)}
                />
              </div>
              <div className="admin-input-group" style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Link do site (opcional)</label>
                  <input
                    placeholder="https://www.finep.gov.br"
                    value={p.link}
                    onChange={(e) => updateParceria(i, 'link', e.target.value)}
                  />
                </div>
                <button
                  className="btn-danger-admin"
                  onClick={() => removeParceria(i)}
                  style={{ marginBottom: 0, height: 41 }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <button className="btn-secondary-admin" onClick={addParceria}>➕ Adicionar Parceria</button>
        </div>

        <button className="btn-primary-admin" onClick={saveAll} disabled={loading} style={{ padding: '12px 32px' }}>
          {loading ? 'Salvando...' : '💾 Salvar Todas as Configurações'}
        </button>
      </div>
    </>
  );
}
