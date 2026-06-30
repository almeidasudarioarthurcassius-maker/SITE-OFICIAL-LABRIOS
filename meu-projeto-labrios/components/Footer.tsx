// components/Footer.tsx
import Link from 'next/link';

export type Parceria = { nome: string; link?: string };
export type HorarioItem = { dias: string; horario: string };

type Rodape = {
  sobre?: string; endereco_linha1?: string; endereco_linha2?: string;
  cep?: string; cidade?: string; telefone?: string; email?: string;
  missao?: string; visao?: string;
  horarios?: HorarioItem[]; observacao?: string;
  parcerias?: Parceria[];
};

const PADRAO: Rodape = {
  sobre: 'Laboratório de Análise de Água do Médio Amazonas — LABRIOS/CESP',
  endereco_linha1: 'Odovaldo Novo, s/n',
  endereco_linha2: 'Djard Vieira',
  cep: '69152-470',
  cidade: 'Parintins – AM',
  telefone: '(92) 99433-5554',
  email: 'rjovito@uea.edu.br',
  horarios: [{ dias: 'Segunda a Sexta', horario: '08h00 – 18h00' }],
  parcerias: [],
};

export default function Footer({ config }: { config?: Rodape }) {
  const c = { ...PADRAO, ...(config ?? {}) };

  // Sanitiza parcerias
  const parceiros: Parceria[] = (c.parcerias ?? [])
    .filter((p: any) => p && typeof p === 'object')
    .map((p: any) => ({
      nome: typeof p.nome === 'string' ? p.nome : String(p.nome ?? ''),
      link: typeof p.link === 'string' && p.link.trim() ? p.link : undefined,
    }))
    .filter((p) => p.nome.length > 0);

  const horarios: HorarioItem[] = Array.isArray(c.horarios) ? c.horarios : [];

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* Identidade */}
          <div className="footer-col">
            <h4>LABRIOS</h4>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{c.sobre}</p>
            <br />
            <p>📍 {c.endereco_linha1}<br />{c.endereco_linha2}<br />CEP {c.cep}<br />{c.cidade}</p>
            <br />
            <p>📞 {c.telefone}<br />✉️ {c.email}</p>
          </div>

          {/* Links rápidos */}
          <div className="footer-col">
            <h4>Links Rápidos</h4>
            <ul>
              <li><Link href="/#equipamentos">→ Equipamentos</Link></li>
              <li><Link href="/reserva/solicitar">→ Solicitar Reserva</Link></li>
              <li><Link href="/agenda">→ Agenda de Reservas</Link></li>
              <li><Link href="/como-utilizar">→ Como Utilizar</Link></li>
              <li><Link href="/equipe">→ Equipe</Link></li>
              <li><Link href="/comite-gestor">→ Comitê Gestor</Link></li>
              <li><Link href="/comite-usuarios">→ Comitê de Usuários</Link></li>
              <li><Link href="/admin/login">→ Área Restrita</Link></li>
            </ul>
          </div>

          {/* Parcerias */}
          <div className="footer-col">
            <h4>Parcerias</h4>
            {parceiros.length > 0 ? (
              <div className="partner-logos">
                {parceiros.map((p) =>
                  p.link ? (
                    <a key={p.nome} href={p.link} target="_blank" rel="noopener noreferrer"
                      className="partner-logo partner-logo-link" title={`Acessar ${p.nome}`}>
                      {p.nome} ↗
                    </a>
                  ) : (
                    <div key={p.nome} className="partner-logo">{p.nome}</div>
                  )
                )}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Nenhuma parceria cadastrada.</p>
            )}
          </div>

          {/* Horário */}
          <div className="footer-col">
            <h4>Horário de Funcionamento</h4>
            <ul>
              {horarios.map((h, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <span>📅 {h.dias}</span><br />
                  <span style={{ paddingLeft: 22, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>⏰ {h.horario}</span>
                </li>
              ))}
            </ul>
            {c.observacao && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 10 }}>*{c.observacao}</p>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LABRIOS/CESP — Universidade do Estado do Amazonas. Todos os direitos reservados.</p>
          <p>Desenvolvido com Next.js + Supabase</p>
        </div>
      </div>
    </footer>
  );
}
