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
      .eq('chave', 'geral')
      .single();

    const geral = data?.valor ?? {};

    // parcerias: array of strings ["UFAM", "INPA", ...]
    const parceirasRaw: any[] = Array.isArray(geral.parcerias) ? geral.parcerias : [];
    const parcerias = parceirasRaw
      .map((p: any) => typeof p === 'string' ? { nome: p } : (p?.nome ? { nome: p.nome, link: p.link } : null))
      .filter(Boolean);

    return {
      logoUrl: typeof geral.logo_url === 'string' && geral.logo_url ? geral.logo_url : null,
      nomeLab: typeof geral.nome_oficial === 'string' ? geral.nome_oficial : undefined,
      rodape: {
        ...geral,
        parcerias,
      },
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
