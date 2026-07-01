import { supabase } from '../../lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getDocumentos() {
  const { data } = await supabase.from('documentos').select('*').order('data_upload', { ascending: false });
  return data || [];
}

export default async function DocumentosPage() {
  const documentos = await getDocumentos();

  return (
    <section style={{ marginTop: '68px', minHeight: 'calc(100vh - 300px)' }}>
      <div className="container">
        <div className="section-label">Repositório Digital</div>
        <h1 className="section-title">Documentos Técnicos e Laudos</h1>
        <div className="divider" />
        <p style={{ color: 'var(--gray-600)', marginBottom: '40px', maxWidth: '800px' }}>
          Consulte as Notas Técnicas, Relatórios de Monitoramento Hidroquímico, Planilhas de Balneabilidade e Atas Emitidas pelo corpo técnico do LabRios.
        </p>

        {documentos.length === 0 ? (
          <p style={{ color: 'var(--gray-600)' }}>Nenhum documento ou laudo publicado até o momento.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Título do Documento</th>
                  <th>Categoria</th>
                  <th>Data de Publicação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600, color: 'var(--navy)' }}>{doc.titulo}</td>
                    <td><span style={{ background: 'var(--gray-100)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>{doc.categoria || 'Geral'}</span></td>
                    <td>{new Date(doc.data_upload).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <a href={doc.arquivo_url} target="_blank" rel="noopener noreferrer" className="btn-action">
                        Download / Visualizar ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
