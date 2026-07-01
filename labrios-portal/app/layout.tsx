// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export const metadata: Metadata = {
  title: 'LTIP — Laboratório de Tecnologia da Informação do PROFÁGUA',
  description:
    'Portal do Laboratório de Tecnologia da Informação do PROFÁGUA — LTIP. Inventário de equipamentos, agendamentos, documentos e equipe.',
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

    if (error) {
      console.error('Erro ao buscar configuracoes_site:', error.message);
      return { logoUrl: null, contato: undefined, parcerias: undefined };
    }

    const config: Record<string, any> = {};
    data?.forEach((row) => { config[row.chave] = row.valor; });

    // Validação defensiva: garante que parcerias seja sempre um array de objetos simples
    let parcerias: any[] | undefined = undefined;
    if (Array.isArray(config.parcerias)) {
      parcerias = config.parcerias
        .filter((p: any) => p && (typeof p === 'string' || typeof p === 'object'))
        .map((p: any) =>
          typeof p === 'string'
            ? { nome: p, link: undefined }
            : { nome: typeof p.nome === 'string' ? p.nome : '', link: typeof p.link === 'string' ? p.link : undefined }
        )
        .filter((p: any) => p.nome.length > 0);
    }

    // Validação defensiva: contato deve ser um objeto plano (não função/array)
    const contato =
      config.contato && typeof config.contato === 'object' && !Array.isArray(config.contato)
        ? config.contato
        : undefined;

    const logoUrl = typeof config.logo?.url === 'string' ? config.logo.url : null;

    return { logoUrl, contato, parcerias };
  } catch (err) {
    console.error('Falha inesperada ao carregar configuração do site:', err);
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
