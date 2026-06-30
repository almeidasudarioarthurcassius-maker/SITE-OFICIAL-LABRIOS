import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Portal LABRIOS — Sistema de Gestão Institucional',
  description: 'Portal Integrado Interativo para Reservas de Equipamentos e Gestão de Comitês.',
};

export const dynamic = 'force-dynamic';

async function getLabConfig() {
  const { data: geral } = await supabase.from('configuracoes_labrios').select('*').eq('chave', 'geral').single();
  const { data: rodape } = await supabase.from('configuracoes_labrios').select('*').eq('chave', 'rodape').single();
  return {
    geral: geral?.valor || {},
    rodape: rodape?.valor || {}
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getLabConfig();

  return (
    <html lang="pt-BR">
      <body>
        <Navbar nomeLab={config.geral.nome_oficial} />
        <main style={{ minHeight: '80vh' }}>{children}</main>
        <Footer config={config.rodape} />
      </body>
    </html>
  );
}
