import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export const metadata: Metadata = {
  title: 'LabRios — Laboratório de Análise de Água do Baixo/Médio Amazonas',
  description: 'Portal institucional do LabRios/CESP. Gestão de inventário laboratorial, solicitações de análises, documentos técnicos e equipe científica.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

async function getSiteConfig() {
  try {
    const { data, error } = await supabase
      .from('configuracoes_site')
      .select('*')
      .in('chave', ['logo', 'contato', 'parcerias']);

    if (error) return { logoUrl: null, contato: undefined, parcerias: undefined };

    const config: Record<string, any> = {};
    data?.forEach((row) => { config[row.chave] = row.valor; });

    let parcerias: any[] | undefined = undefined;
    if (Array.isArray(config.parcerias)) {
      parcerias = config.parcerias
        .filter((p: any) => p)
        .map((p: any) => typeof p === 'string' ? { nome: p, link: undefined } : { nome: p.nome || '', link: p.link || undefined });
    }

    const contato = config.contato && typeof config.contato === 'object' && !Array.isArray(config.contato) ? config.contato : undefined;
    const logoUrl = typeof config.logo?.url === 'string' ? config.logo.url : null;

    return { logoUrl, contato, parcerias };
  } catch (err) {
    return { logoUrl: null, contato: undefined, parcerias: undefined };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, contato, parcerias } = await getSiteConfig();

  return (
    <html lang="pt-BR">
      <body>
        <Navbar logoUrl={logoUrl} />
        <main>{children}</main>
        <Footer contato={contato} parcerias={parcerias} />
      </body>
    </html>
  );
}
