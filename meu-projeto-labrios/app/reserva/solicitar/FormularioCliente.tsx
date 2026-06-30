'use client';
// app/reserva/solicitar/FormularioCliente.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import Toast from '../../../components/Toast';

export default function FormularioCliente({
  equipamentos, idSelecionado,
}: { equipamentos: { id: number; nome: string }[]; idSelecionado?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({
    equipamento_id: idSelecionado || '',
    solicitante_nome: '', institicao: '', funcao: '',
    lattes_url: '', data_reserva: '', horario_inicial: '', horario_final: '',
  });

  const h = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('reservas').insert([{ ...form, status: 'Pendente' }]);
    if (error) {
      setToast({ msg: 'Erro ao enviar: ' + error.message, type: 'error' });
    } else {
      setToast({ msg: 'Solicitação enviada! Aguarde aprovação.', type: 'success' });
      setTimeout(() => router.push('/agenda'), 2000);
    }
    setLoading(false);
  }

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <form onSubmit={submit} style={{ background: 'white', padding: 32, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--gray-200)' }}>
        <div className="form-group">
          <label className="form-label">Equipamento Desejado *</label>
          <select required name="equipamento_id" value={form.equipamento_id} onChange={h}
            style={{ padding: 10, borderRadius: 6, border: '1px solid var(--gray-200)', fontSize: 14 }}>
            <option value="">Selecione...</option>
            {equipamentos.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nome Completo *</label>
            <input required name="solicitante_nome" type="text" value={form.solicitante_nome} onChange={h} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Instituição de Vínculo *</label>
            <input required name="institicao" type="text" value={form.institicao} onChange={h} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Função / Cargo *</label>
            <input required name="funcao" type="text" value={form.funcao} onChange={h} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Currículo Lattes (URL) *</label>
            <input required name="lattes_url" type="url" value={form.lattes_url} onChange={h} placeholder="http://lattes.cnpq.br/..." style={{ padding: 10, borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Data *</label>
            <input required name="data_reserva" type="date" value={form.data_reserva} onChange={h} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Horário Inicial *</label>
            <input required name="horario_inicial" type="time" value={form.horario_inicial} onChange={h} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Horário Final *</label>
            <input required name="horario_final" type="time" value={form.horario_final} onChange={h} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Enviando...' : 'Enviar Solicitação de Reserva'}
        </button>
      </form>
    </>
  );
}
