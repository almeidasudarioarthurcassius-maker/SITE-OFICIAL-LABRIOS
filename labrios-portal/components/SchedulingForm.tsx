'use client';
import { useState, FormEvent } from 'react';
import { Equipamento, supabase } from '../lib/supabase';

type Props = { equipamentos: Equipamento[] };

export default function SchedulingForm({ equipamentos }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [finalidade, setFinalidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!nome || !email || !equipamento || !dataInicio || !dataFim) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios.' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('solicitacoes').insert([
        {
          nome,
          email,
          equipamento,
          data_inicio: dataInicio,
          data_fim: dataFim,
          finalidade,
          status: 'pendente',
        },
      ]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Solicitação enviada com sucesso! Aguarde a análise por e-mail.' });
      setNome(''); setEmail(''); setEquipamento(''); setDataInicio(''); setDataFim(''); setFinalidade('');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao enviar solicitação: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow)' }}>
      <h3 style={{ marginBottom: '20px', color: 'var(--navy)' }}>Formulário de Solicitação</h3>
      
      {message && (
        <div style={{ padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', background: message.type === 'success' ? '#E8F5E9' : '#FFEBEE', color: message.type === 'success' ? '#2E7D32' : '#C62828' }}>
          {message.text}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Nome Completo *</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-400)' }} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>E-mail Institucional *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-400)' }} />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Equipamento / Espaço Solicitado *</label>
        <select value={equipamento} onChange={(e) => setEquipamento(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-400)', background: 'white' }}>
          <option value="">Selecione...</option>
          <option value="Espaço Físico / Bancada de Triagem">Espaço Físico / Bancada de Triagem</option>
          {equipamentos.filter(e => e.status === 'disponivel').map(e => (
            <option key={e.id} value={e.nome_equipamento}>{e.nome_equipamento}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Data Início *</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-400)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Data Fim *</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-400)' }} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Projeto de Pesquisa / Finalidade</label>
        <textarea value={finalidade} onChange={(e) => setFinalidade(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-400)', resize: 'vertical' }} />
      </div>

      <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '6px', background: 'var(--navy)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Enviando...' : 'Submeter Solicitação'}
      </button>
    </form>
  );
}
