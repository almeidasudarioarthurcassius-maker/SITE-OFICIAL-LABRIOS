import Link from 'next/link';

export type Parceria = { nome: string; link?: string };
export type HorarioItem = { dias: string; horario: string };
type Contato = {
  endereco_linha1?: string;
  endereco_linha2?: string;
  cep?: string;
  cidade?: string;
  telefone?: string;
  email?: string;
  observacao?: string;
  horarios?: HorarioItem[];
};

type Props = { contato?: Contato; parcerias?: Parceria[] };

export default function Footer({ contato, parcerias }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#00252E', color: 'white', padding: '60px 0 30px', fontSize: '14px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        <div>
          <h4 style={{ color: '#B2DFDB', marginBottom: '16px', fontSize: '16px' }}>LabRios / CESP</h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            Laboratório de Análise de Água do Baixo e Médio Amazonas. Centro de Estudos Superiores de Parintins.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#B2DFDB', marginBottom: '16px', fontSize: '16px' }}>Contato & Localização</h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
            {contato?.endereco_linha1 || 'Estrada Odovaldo Novo, s/n'}<br />
            {contato?.endereco_linha2 || 'Djard Vieira'}<br />
            CEP: {contato?.cep || '69152-470'} — {contato?.cidade || 'Parintins – AM'}<br />
            Email: {contato?.email || 'labrios.cesp@uea.edu.br'}
          </p>
        </div>
        <div>
          <h4 style={{ color: '#B2DFDB', marginBottom: '16px', fontSize: '16px' }}>Links Rápidos</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/#inventario" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Equipamentos</Link>
            <Link href="/#agendamento" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Solicitar Reserva</Link>
            <Link href="/documentos" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Relatórios Técnicos</Link>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
        <p>&copy; {currentYear} LabRios/CESP. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
