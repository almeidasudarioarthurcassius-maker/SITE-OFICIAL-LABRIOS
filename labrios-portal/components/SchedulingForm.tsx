'use client';
// components/SchedulingForm.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Equipamento } from '../lib/supabase';
import Toast from './Toast';

type Props = { equipamentos: Equipamento[] };

export default function SchedulingForm({ equipamentos }: Props) {
  const [form, setForm] = useState({
    nome: '', email: '', equipamento: '', dataInicio: '', dataFim: '', finalidade: '',
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function submit() {
    if (!form.nome || !form.email || !form.equipamento) {
      setToast({ msg: 'Preencha todos os campos obrigatórios.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('solicitacoes').insert([{
        nome: form.nome,
        email: form.email,
        equipamento: form.equipamento,
        data_inicio: form.dataInicio || null,
        data_fim: form.dataFim || null,
        finalidade: form.finalidade || null,
        status: 'pendente',
      }]);
      if (error) throw error;
      setToast({ msg: 'Solicitação enviada! O laboratório entrará em contato pelo seu e-mail.', type: 'success' });
      setForm({ nome: '', email: '', equipamento: '', dataInicio: '', dataFim: '', finalidade: '' });
    } catch (err: any) {
      setToast({ msg: 'Erro ao enviar solicitação: ' + (err.message ?? 'tente novamente.'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const disponíveis = equipamentos.filter((e) => e.status === 'disponivel');

  return (
    <>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
      <div className="schedule-form">
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 24 }}>
          Solicitar Reserva
        </h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sched-nome">Nome completo</label>
            <input id="sched-nome" name="nome" type="text" placeholder="Seu nome" value={form.nome} onChange={handle} />
          </div>
          <div className="form-group">
            <label htmlFor="sched-email">E-mail institucional</label>
            <input id="sched-email" name="email" type="email" placeholder="nome@instituicao.edu.br" value={form.email} onChange={handle} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sched-equip">Equipamento desejado</label>
          <select id="sched-equip" name="equipamento" value={form.equipamento} onChange={handle}>
            <option value="">Selecione um equipamento...</option>
            {disponíveis.map((e) => (
              <option key={e.id} value={e.nome_equipamento}>{e.nome_equipamento}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sched-start">Data de início</label>
            <input id="sched-start" name="dataInicio" type="date" value={form.dataInicio} onChange={handle} />
          </div>
          <div className="form-group">
            <label htmlFor="sched-end">Data de término</label>
            <input id="sched-end" name="dataFim" type="date" value={form.dataFim} onChange={handle} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sched-purpose">Finalidade de uso</label>
          <textarea
            id="sched-purpose" name="finalidade" rows={3}
            placeholder="Descreva brevemente o objetivo do uso do equipamento..."
            value={form.finalidade} onChange={handle}
          />
        </div>

        <button className="btn-submit" onClick={submit} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Solicitação'}
        </button>
      </div>
    </>
  );
}
