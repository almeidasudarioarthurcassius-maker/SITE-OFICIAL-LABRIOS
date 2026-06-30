// components/Footer.tsx
import Link from 'next/link';

export type Parceria = { nome: string; link?: string };

type Config = Record<string, any>;

const PADRAO = {
  nome_oficial: 'LABRIOS',
  texto_institucional: 'Laboratório de Análise de Água do Médio Amazonas — LABRIOS/CESP',
  endereco: 'Odovaldo Novo, s/n — Djard Vieira, CEP 69152-470 — Parintins, AM',
  dias_funcionamento: 'Segunda a Sexta',
  horario_funcionamento: '08h00 – 18h00',
  telefone: '(92) 99433-5554',
  email_contato: 'rjovito@uea.edu.br',
  parcerias: [] as Parceria[],
};

export default function Footer({ config }: { config?: Config }) {
  const c = { ...PADRAO, ...(config ?? {}) };

  // parcerias pode ser array de strings ou objetos
  const parceiros: Parceria[] = (Array.isArray(c.parcerias) ? c.parcerias : [])
    .map((p: any) => {
      if (typeof p === 'string') return { nome: p };
      if (p && typeof p === 'object' && p.nome) return { nome: p.nome, link: p.link };
      return null;
    })
    .filter((p): p is Parceria => !!p && p.nome.length > 0);

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* Identidade */}
          <div className="footer-col">
            <h4>{c.nome_oficial || 'LABRIOS'}</h4>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}>{c.texto_institucional}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>📍 {c.endereco}</p>
            <br />
            {c.telefone && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>📞 {c.telefone}</p>}
            {c.email_contato && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>✉️ {c.email_contato}</p>}
          </div>

          {/* Links rápidos */}
          <div className="footer-col">
            <h4>Links Rápidos</h4>
            <ul>
              <li><Link href="/#equipamentos">→ Equipamentos</Link></li>
              <li><Link href="/reserva/solicitar">→ Solicitar Reserva</Link></li>
              <li><Link href="/agenda">→ Agenda</Link></li>
              <li><Link href="/como-utilizar">→ Como Utilizar</Link></li>
              <li><Link href="/equipe">→ Equipe</Link></li>
              <li><Link href="/comite-gestor">→ Comitê Gestor</Link></li>
              <li><Link href="/comite-usuarios">→ Comitê de Usuários</Link></li>
            </ul>
          </div>

          {/* Horário */}
          <div className="footer-col">
            <h4>Funcionamento</h4>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>
              🗓️ {c.dias_funcionamento}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
              🕐 {c.horario_funcionamento}
            </p>
          </div>

          {/* Parcerias */}
          {parceiros.length > 0 && (
            <div className="footer-col">
              <h4>Parcerias</h4>
              <div className="partner-logos">
                {parceiros.map((p) =>
                  p.link
                    ? <a key={p.nome} href={p.link} target="_blank" rel="noopener noreferrer" className="partner-logo">{p.nome}</a>
                    : <span key={p.nome} className="partner-logo">{p.nome}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>© {new Date().getFullYear()} {c.nome_oficial || 'LABRIOS'} — Todos os direitos reservados.</span>
          <span>Desenvolvido com 💙 para o avanço da ciência na Amazônia.</span>
        </div>
      </div>
    </footer>
  );
}
