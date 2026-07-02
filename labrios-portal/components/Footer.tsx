'use client';

interface HorarioItem {
  dias: string;
  horario: string;
}

interface ContatoData {
  endereco_linha1?: string;
  endereco_linha2?: string;
  cep?: string;
  cidade?: string;
  telefone?: string;
  email?: string;
  observacao?: string;
  horarios?: HorarioItem[];
}

interface PartnerItem {
  nome: string;
  link?: string;
}

interface FooterProps {
  contato?: ContatoData;
  parcerias?: PartnerItem[];
}

export default function Footer({ contato, parcerias = [] }: FooterProps) {
  return (
    <footer style={{ background: 'var(--navy, #0B192C)', color: 'white', padding: '60px 0 30px', marginTop: '80px', borderTop: '4px solid var(--primary, #008DDA)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Coluna 1: Sobre / Identificação Breve */}
        <div>
          <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>LabRios</h3>
          <p style={{ fontSize: '14px', color: 'var(--gray-300, #E0E0E0)', lineHeight: '1.6', marginBottom: '16px' }}>
            Laboratório de Análise de Água do Baixo/Médio Amazonas.
          </p>
          <span style={{ fontSize: '12px', color: 'var(--gray-400, #9E9E9E)', display: 'block' }}>
            {contato?.observacao || 'Campus Estudos Superiores de Parintins'}
          </span>
        </div>

        {/* Coluna 2: Localização e Contato Dinâmico */}
        <div>
          <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Contato e Localização</h4>
          {contato ? (
            <div style={{ fontSize: '14px', color: 'var(--gray-300, #E0E0E0)', lineHeight: '1.8' }}>
              {contato.endereco_linha1 && <p>{contato.endereco_linha1}</p>}
              {contato.endereco_linha2 && <p>{contato.endereco_linha2}</p>}
              {(contato.cep || contato.cidade) && (
                <p>CEP: {contato.cep} {contato.cidade ? `— ${contato.cidade}` : ''}</p>
              )}
              {contato.telefone && <p style={{ marginTop: '12px', fontWeight: 500 }}>📞 {contato.telefone}</p>}
              {contato.email && <p>✉️ {contato.email}</p>}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--gray-400, #9E9E9E)', fontStyle: 'italic' }}>Informações de contato não configuradas.</p>
          )}
        </div>

        {/* Coluna 3: Horários de Atendimento */}
        <div>
          <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🕒 Atendimento</h4>
          {contato?.horarios && contato.horarios.length > 0 ? (
            contato.horarios.map((h, idx) => (
              <div key={idx} style={{ fontSize: '14px', marginBottom: '10px', color: 'var(--gray-300, #E0E0E0)', background: 'rgba(255, 255, 255, 0.05)', padding: '8px 12px', borderRadius: '6px' }}>
                <strong style={{ color: '#008DDA', display: 'block', marginBottom: '2px' }}>{h.dias}</strong>
                {h.horario}
              </div>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--gray-400, #9E9E9E)' }}>Nenhum horário registrado.</p>
          )}
        </div>

        {/* Coluna 4: Parceiros e Apoiadores com Links */}
        <div>
          <h4 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🤝 Apoio Institucional</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {!parcerias || parcerias.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--gray-400, #9E9E9E)' }}>Nenhum parceiro listado.</p>
            ) : (
              parcerias.map((p, idx) => (
                p.link ? (
                  <a 
                    key={idx} 
                    href={p.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', fontWeight: 500, border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block', transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#008DDA';
                      e.currentTarget.style.borderColor = '#008DDA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    {p.nome} ↗
                  </a>
                ) : (
                  <span 
                    key={idx} 
                    style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--gray-300, #E0E0E0)', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-block' }}
                  >
                    {p.nome}
                  </span>
                )
              ))
            )}
          </div>
        </div>

      </div>

      {/* Barra de Direitos Autorais inferior */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '50px', paddingTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--gray-400, #9E9E9E)' }}>
        <div className="container">
          <p>© {new Date().getFullYear()} LabRios. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
