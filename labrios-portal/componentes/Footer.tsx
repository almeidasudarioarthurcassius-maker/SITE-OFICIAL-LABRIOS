'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [endereco, setEndereco] = useState('Carregando endereço...');
  const [horario, setHorario] = useState('Segunda a Sexta — 08h às 18h');

  useEffect(() => {
    async function loadConfig() {
      const { data } = await supabase.from('configuracoes_site').select('*');
      if (data) {
        const endItem = data.find(c => c.chave === 'endereco_laboratorio');
        const horItem = data.find(c => c.chave === 'horario_funcionamento');
        if (endItem) setEndereco(endItem.valor);
        if (horItem) setHorario(horItem.valor);
      }
    }
    loadConfig();
  }, []);

  return (
    <footer className="bg-navy-dark text-gray-300 py-8 border-t-4 border-ltip-green mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-bold text-base mb-3">Laboratório de Tecnologia da Informação do Prof. Água</h3>
          <p className="text-gray-400">Promovendo inovação, pesquisa aplicada e capacitação para a comunidade acadêmica.</p>
        </div>
        <div>
          <h3 className="text-white font-bold text-base mb-3">Funcionamento e Localização</h3>
          <p>{endereco}</p>
          <p className="mt-2 text-ltip-green-accent font-medium">{horario}</p>
        </div>
        <div>
          <h3 className="text-white font-bold text-base mb-3">Desenvolvimento</h3>
          <p>Desenvolvido e mantido pelo próprio laboratório.</p>
          <p className="mt-4 text-xs text-gray-500">© {new Date().getFullYear()} Laboratório de Tecnologia da Informação do Prof. Água. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}