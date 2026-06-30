export default function Footer({ config }: { config: any }) {
  const parcerias = config?.parcerias || [];

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>LABRIOS</h4>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{config.sobre || 'Laboratório Institucional de Pesquisa Científica.'}</p>
            <br />
            <p>📍 {config.endereco || 'Endereço não parametrizado.'}</p>
            <p>📞 Telefone: {config.telefone}</p>
            <p>✉️ Email: {config.email}</p>
          </div>

          <div className="footer-col">
            <h4>Nossa Filosofia</h4>
            <p><strong>Missão:</strong> {config.missao}</p>
            <br />
            <p><strong>Visão:</strong> {config.visao}</p>
          </div>

          <div className="footer-col">
            <h4>Funcionamento</h4>
            <p>📅 {config.dias_funcionamento || 'Segunda a Sexta'}</p>
            <p>⏰ Horário: {config.horario_funcionamento || '08h às 18h'}</p>
          </div>

          <div className="footer-col">
            <h4>Parcerias</h4>
            <div className="partner-logos">
              {parcerias.map((p: any, idx: number) => (
                <a key={idx} href={p.link || '#'} target="_blank" rel="noopener noreferrer" className="partner-logo">
                  {p.nome} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LABRIOS. Todos os direitos reservados conforme regimento interno.</p>
          <p>Infraestrutura tecnológica espelhada no padrão LTIP.</p>
        </div>
      </div>
    </footer>
  );
}