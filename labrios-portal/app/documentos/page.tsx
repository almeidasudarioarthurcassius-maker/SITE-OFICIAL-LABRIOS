// app/documentos/page.tsx  (Server Component)
import { supabase } from '../../lib/supabase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentos e Relatórios — LTIP',
  description: 'Acesse o repositório de relatórios, regimentos e documentos institucionais do Laboratório LTIP.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function DocumentosPage() {
  const { data, error } = await supabase
    .from('documentos')
    .select('*')
    .order('data_upload', { ascending: false });

  if (error) console.error('Erro ao carregar documentos:', error.message);

  const docs = data ?? [];

  return (
    <section
      className="documents"
      style={{ marginTop: 68, paddingTop: 80, background: 'var(--gray-50)', minHeight: '70vh' }}
    >
      <div className="container">
        <div className="section-label">Repositório Institucional</div>
        <h1 className="section-title">Documentos e Relatórios</h1>
        <div className="divider" />

        {docs.length === 0 ? (
          <p style={{ color: 'var(--gray-600)', textAlign: 'center', padding: 48 }}>
            Nenhum documento publicado ainda.
          </p>
        ) : (
          <div className="docs-grid">
            {docs.map((doc: any) => (
              <div key={doc.id} className="doc-card">
                <div className="doc-icon">📄</div>
                <div>
                  <div className="doc-name">{doc.titulo}</div>
                  <div className="doc-meta">
                    📁 {doc.categoria ?? 'Documento'} &nbsp;•&nbsp;
                    🗓️ {new Date(doc.data_upload).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="doc-actions">
                  <a
                    href={doc.arquivo_url}
                    className="btn-doc primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    👁️ Visualizar
                  </a>
                  <a href={doc.arquivo_url} className="btn-doc" download>
                    ⬇️ Baixar
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
