import { supabase } from '../lib/supabase';
import HeroSlider, { Slide } from '../components/HeroSlider';
import InventoryTable from '../components/InventoryTable';
import SchedulingForm from '../components/SchedulingForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

async function getData() {
  try {
    const [
      { data: inventario },
      { data: documentos },
      { data: equipe },
      { data: configRows },
    ] = await Promise.all([
      supabase.from('inventario').select('*').order('nome_equipamento'),
      supabase.from('documentos').select('*').order('data_upload', { ascending: false }).limit(6),
      supabase.from('equipe').select('*').order('ordem'),
      supabase.from('configuracoes_site').select('*').in('chave', ['slides', 'sobre']),
    ]);

    const config: Record<string, any> = {};
    configRows?.forEach((row) => { config[row.chave] = row.valor; });

    const slidesRaw = Array.isArray(config.slides) ? config.slides : [];
    const slides: Slide[] = slidesRaw.map((s: any) => ({
      tag: s.tag || '',
      title: s.title || '',
      desc: s.desc || '',
      img: s.img || '',
      ctaLabel: s.ctaLabel || 'Saber mais →',
      ctaHref: s.ctaHref || '/#sobre',
    }));

    const sobreDefault = {
      titulo: 'Sobre o LabRios',
      descricao: 'Laboratório especializado no monitoramento e análise de qualidade físico-química e microbiológica da água na região Amazônica.',
      missao: '',
      visao: '',
      regras: '',
    };
    const sobre = config.sobre ? { ...sobreDefault, ...config.sobre } : sobreDefault;

    return { inventario: inventario || [], documentos: documentos || [], equipe: equipe || [], slides, sobre };
  } catch (err) {
    return {
      inventario: [], documentos: [], equipe: [], slides: [],
      sobre: { titulo: 'Sobre o LabRios', descricao: 'Laboratório especializado na análise de água.', missao: '', visao: '', regras: '' }
    };
  }
}

export default async function HomePage() {
  const { inventario, documentos, equipe, slides, sobre } = await getData();

  return (
    <>
      <HeroSlider slides={slides} />

      <section className="quick-access" id="acesso">
        <div className="container">
          <div className="section-label">Acesso Rápido</div>
          <h2 className="section-title">Serviços e Consultas</h2>
          <div className="divider" />
          <div className="cards-grid">
            {[
              { href: '#agendamento', icon: '🔬', color: 'blue', title: 'Análises & Reservas', desc: 'Solicite reservas de bancadas ou equipamentos para análises limnológicas.', cta: 'Solicitar →' },
              { href: '#inventario', icon: '🌡️', color: 'green', title: 'Infraestrutura', desc: 'Veja a lista completa de equipamentos ativos de medição e amostragem.', cta: 'Ver Lista →' },
              { href: '/documentos', icon: '📊', color: 'amber', title: 'Laudos & Notas', desc: 'Acesse repositórios de relatórios de balneabilidade e relatórios técnicos.', cta: 'Acessar →' },
              { href: '/equipe', icon: '👥', color: 'purple', title: 'Corpo Técnico', desc: 'Conheça os analistas, químicos e pesquisadores responsáveis.', cta: 'Ver Equipe →' },
            ].map((card) => (
              <Link key={card.href} href={card.href} className="qcard">
                <div className={`qcard-icon ${card.color}`}>{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <span className="qcard-arrow">{card.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="inventory" id="inventario" style={{ background: 'white' }}>
        <div className="container">
          <InventoryTable items={inventario} />
        </div>
      </section>

      <section className="scheduling" id="agendamento">
        <div className="container">
          <div className="scheduling-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div>
              <div className="section-label">Agendamentos</div>
              <h2 className="section-title">Uso de Infraestrutura</h2>
              <div className="divider" />
              <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
                Pesquisadores e alunos vinculados podem submeter pedidos de uso do espaço para triagem de amostras de água ou calibração de sondas multiparamétricas.
              </p>
            </div>
            <SchedulingForm equipamentos={inventario} />
          </div>
        </div>
      </section>

      <section className="about" id="sobre">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', color: 'white' }}>{sobre.titulo}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '16px auto 0' }}>{sobre.descricao}</p>
          </div>
          <div className="about-grid">
            <div className="about-card"><h3>🎯 Missão</h3><p>{sobre.missao}</p></div>
            <div className="about-card"><h3>🔭 Visão</h3><p>{sobre.visao}</p></div>
            <div className="about-card"><h3>📋 Diretrizes de Segurança</h3><p>{sobre.regras}</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
