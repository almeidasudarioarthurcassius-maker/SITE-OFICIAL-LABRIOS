// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export const metadata: Metadata = {
  title: 'LABRIOS — Laboratório de Análise de Água do Médio Amazonas',
  description: 'Portal de gestão e reservas de equipamentos do LABRIOS/CESP — UEA.',
};

export const dynamic = 'force-dynamic';

async function getSiteConfig() {
  try {
    const { data } = await supabase
      .from('configuracoes_labrios')
      .select('chave, valor')
      .in('chave', ['geral', 'rodape']);

    const config: Record<string, any> = {};
    data?.forEach((r) => { config[r.chave] = r.valor; });

    // Sanitiza rodape.parcerias
    const rodape = config.rodape ?? {};
    if (Array.isArray(rodape.parcerias)) {
      rodape.parcerias = rodape.parcerias
        .filter((p: any) => p && typeof p === 'object')
        .map((p: any) => ({
          nome: typeof p.nome === 'string' ? p.nome : '',
          link: typeof p.link === 'string' ? p.link : undefined,
        }))
        .filter((p: any) => p.nome.length > 0);
    }

    return {
      logoUrl: typeof config.geral?.logo_url === 'string' ? config.geral.logo_url : null,
      nomeLab: typeof config.geral?.nome_oficial === 'string' ? config.geral.nome_oficial : undefined,
      rodape,
    };
  } catch {
    return { logoUrl: null, nomeLab: undefined, rodape: {} };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, nomeLab, rodape } = await getSiteConfig();
  return (
    <html lang="pt-BR">
      <body>
        <Navbar logoUrl={logoUrl} nomeLab={nomeLab} />
        <main>{children}</main>
        <Footer config={rodape} />
      </body>
    </html>
  );
}
