'use client';

interface FooterProps {
  contato?: any;
  parcerias?: any[];
}

export default function Footer({ contato, parcerias = [] }: FooterProps) {
  return (
    <footer style={{ background: 'var(--navy)', color: 'white', padding: '40px 0', marginTop: '60px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
        
        {/* Bloco de Localização */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px' }}>📍 Localização e Contato</h4>
          {contato ? (
            <div style={{ fontSize: '14px', color: 'var(--gray-300)', lineHeight: '1.6' }}>
              <p>{contato.endereco_linha1}</p>
              <p>{contato.endereco_linha2}</p>
              <p>CEP: {contato.cep} - {contato.cidade}</p>
              <p style={{ marginTop: '10px' }}>📞 {contato.telefone}</p>
              <p>✉️ {contato.email}</p>
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--gray-400)' }}>Informações de contato não cadastradas.</p>
          )}
        </div>

        {/* Bloco de Horários */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px' }}>🕒 Atendimento</h4>
          {contato?.horarios && contato.horarios.length > 0 ? (
            contato.horarios.map((h: any, idx: number) => (
              <div key={idx} style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--gray-300)' }}>
                <strong>{h.dias}:</strong> {h.horario}
              </div>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--gray-400)' }}>Nenhum horário definido.</p>
          )}
        </div>

        {/* Bloco de Parceiros */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px' }}>🤝 Parceiros Institucionais</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {!parcerias || parcerias.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--gray-400)' }}>Nenhum apoiador listado.</p>
            ) : (
              parcerias.map((p: any, idx: number) => (
                <a 
                  key={idx} 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  {p.nome} ↗
                </a>
              ))
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
