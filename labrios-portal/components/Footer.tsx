// components/Footer.tsx
import Link from 'next/link';

export type Parceria = { nome: string; link?: string };
export type HorarioItem = { dias: string; horario: string };

type Contato = {
  endereco_linha1?: string; endereco_linha2?: string; cep?: string; cidade?: string;
  telefone?: string; email?: string; observacao?: string;
  horarios?: HorarioItem[];
};

type Props = {
  contato?: Contato;
  parcerias?: Parceria[];
};

const CONTATO_PADRAO: Contato = {
  endereco_linha1: 'Bloco C, Sala 205',
  endereco_linha2: 'Campus Universitário',
  cep: '69000-000',
  cidade: 'Manaus – AM',
  telefone: '(92) 3000-0000',
  email: 'ltip@universidade.edu.br',
  observacao: 'Atendimento fora do horário mediante agendamento prévio',
  horarios: [
    { dias: 'Segunda a Sexta', horario: '08h00 – 18h00' },
    { dias: 'Sábado', horario: '08h00 – 12h00' },
  ],
};

const PARCERIAS_PADRAO: Parceria[] = [
  { nome: 'CNPq' }, { nome: 'FAPEAM' }, { nome: 'CAPES' }, { nome: 'FINEP' }, { nome: 'MCTI' },
];

export default function Footer({ contato, parcerias }: Props) {
  const c = { ...CONTATO_PADRAO, ...(contato ?? {}) };
  const horarios = c.horarios && c.horarios.length > 0 ? c.horarios : CONTATO_PADRAO.horarios!;

  // Sanitiza os dados vindos do Supabase: garante que nome/link sejam sempre strings,
  // nunca funções, objetos ou outros tipos inesperados que quebrariam a serialização RSC.
  const parceirosBrutos = parcerias && parcerias.length > 0 ? parcerias : PARCERIAS_PADRAO;
  const parceiros: Parceria[] = parceirosBrutos
    .filter((p) => p && typeof p === 'object')
    .map((p) => ({
      nome: typeof p.nome === 'string' ? p.nome : String(p.nome ?? ''),
      link: typeof p.link === 'string' && p.link.trim().length > 0 ? p.link : undefined,
    }))
    .filter((p) => p.nome.length > 0);

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>LTIP</h4>
            <p>Laboratório de Tecnologia da Informação do PROFÁGUA</p>
            <br />
            <p>
              📍 {c.endereco_linha1}<br />
              {c.endereco_linha2}<br />
              CEP {c.cep}<br />
              {c.cidade}
            </p>
            <br />
            <p>
              📞 {c.telefone}<br />
              ✉️ {c.email}
            </p>
          </div>

          <div className="footer-col">
            <h4>Links Rápidos</h4>
            <ul>
              <li><Link href="/#inventario">→ Inventário de Equipamentos</Link></li>
              <li><Link href="/#agendamento">→ Solicitar Agendamento</Link></li>
              <li><Link href="/documentos">→ Documentos e Relatórios</Link></li>
              <li><Link href="/equipe">→ Equipe do Laboratório</Link></li>
              <li><Link href="/#sobre">→ Missão e Visão</Link></li>
              <li><Link href="/admin/login">→ Área Restrita</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Parcerias</h4>
            <p style={{ marginBottom: 14, fontSize: 13 }}>
              Desenvolvido em parceria com instituições de excelência:
            </p>
            <div className="partner-logos">
              {parceiros.map((p) =>
                p.link ? (
                  <a
                    key={p.nome}
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-logo partner-logo-link"
                    title={`Acessar ${p.nome}`}
                  >
                    {p.nome} ↗
                  </a>
                ) : (
                  <div key={p.nome} className="partner-logo">{p.nome}</div>
                )
              )}
            </div>
          </div>

          <div className="footer-col">
            <h4>Horário de Funcionamento</h4>
            <ul>
              {horarios.map((h, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <a href="#" style={{ display: 'flex', flexDirection: 'column', gap: 2, cursor: 'default' }}>
                    <span>📅 {h.dias}</span>
                    <span style={{ paddingLeft: 22, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>⏰ {h.horario}</span>
                  </a>
                </li>
              ))}
            </ul>
            <br />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>*{c.observacao}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LTIP — Laboratório de Tecnologia da Informação do PROFÁGUA. Todos os direitos reservados.</p>
          <p>Desenvolvido com Next.js + Supabase</p>
        </div>
      </div>
    </footer>
  );
}
