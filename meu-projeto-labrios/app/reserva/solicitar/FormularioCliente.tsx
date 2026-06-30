'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function FormularioCliente({ equipamentos, idSelecionado }: { equipamentos: any[], idSelecionado?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    equipamento_id: idSelecionado || '',
    solicitante_nome: '',
    institicao: '',
    funcao: '',
    lattes_url: '',
    data_reserva: '',
    horario_inicial: '',
    horario_final: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('reservas').insert([formData]);

    if (error) {
      alert('Erro ao enviar solicitação: ' + error.message);
    } else {
      alert('Solicitação realizada com sucesso! Status: Pendente de aprovação.');
      router.push('/agenda');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '32px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--gray-200)' }}>
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Equipamento Desejado *</label>
        <select required value={formData.equipamento_id} onChange={e => setFormData({...formData, equipamento_id: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }}>
          <option value="">Selecione...</option>
          {equipamentos.map(e => <option key={e.id} value={e.id}>{e.name || e.nome}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Nome Completo *</label>
          <input required type="text" value={formData.solicitante_nome} onChange={e => setFormData({...formData, solicitante_nome: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Instituição de Vínculo *</label>
          <input required type="text" value={formData.institicao} onChange={e => setFormData({...formData, institicao: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Função/Cargo *</label>
          <input required type="text" value={formData.funcao} onChange={e => setFormData({...formData, funcao: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Currículo Lattes (URL) *</label>
          <input required type="url" value={formData.lattes_url} onChange={e => setFormData({...formData, lattes_url: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Data *</label>
          <input required type="date" value={formData.data_reserva} onChange={e => setFormData({...formData, data_reserva: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Início *</label>
          <input required type="time" value={formData.horario_inicial} onChange={e => setFormData({...formData, horario_inicial: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Término *</label>
          <input required type="time" value={formData.horario_final} onChange={e => setFormData({...formData, horario_final: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-200)' }} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-submit" style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '12px' }}>
        {loading ? 'Processando...' : 'Enviar Solicitação de Reserva'}
      </button>
    </form>
  );
}