// app/page.tsx  (Server Component)
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
      { data: inventario, error: errInv },
      { data: documentos, error: errDoc },
      { data: equipe, error: errEq },
      { data: configRows, error: errConf },
    ] = await Promise.all([
      supabase.from('inventario').select('*').order('nome_equipamento'),
      supabase.from('documentos').select('*').order('data_upload', { ascending: false }).limit(6),
      supabase.from('equipe').select('*').order('ordem'),
      supabase.from('configuracoes_site').select('*').in('chave', ['slides', 'sobre']),
    ]);

    if (errInv) console.error('Erro ao buscar inventario:', errInv.message);
    if (errDoc) console.error('Erro ao buscar documentos:', errDoc.message);
    if (errEq) console.error('Erro ao buscar equipe:', errEq.message);
    if (errConf) console.error('Erro ao buscar configuracoes_site:', errConf.message);

    const config: Record<string, any> = {};
    configRows?.forEach((row) => { config[row.chave] = row.valor; });

    // Validação defensiva: slides deve ser um array de objetos simples
    const slidesRaw = Array.isArray(config.slides) ? config.slides : [];
    const slides: Slide[] = slidesRaw
      .filter((s: any) => s && typeof s === 'object')
      .map((s: any) => ({
        tag: typeof s.tag === 'string' ? s.tag : '',
        title: typeof s.title === 'string' ? s.title : '',
        desc: typeof s.desc === 'string' ? s.desc : '',
        img: typeof s.img === 'string' ? s.img : '',
        ctaLabel: typeof s.ctaLabel === 'string' ? s.ctaLabel : 'Saiba mais →',
        ctaHref: typeof s.ctaHref === 'string' ? s.ctaHref : '/#sobre',
      }));

    const sobreDefault = {
      titulo: 'Sobre o LTIP',
      descricao: 'Laboratório de referência em pesquisa tecnológica e inovação.',
      missao: '',
      visao: '',
      regras: '',
    };
    const sobre =
      config.sobre && typeof config.sobre === 'object' && !Array.isArray(config.sobre)
        ? { ...sobreDefault, ...config.sobre }
        : sobreDefault;

    return {
      inventario: inventario ?? [],
      documentos: documentos ?? [],
      equipe: equipe ?? [],
      slides,
      sobre,
    };
  } catch (err) {
    console.error('Falha inesperada ao carregar dados da home:', err);
    return {
      inventario: [],
      documentos: [],
      equipe: [],
      slides: [],
      sobre: {
        titulo: 'Sobre o LTIP',
        descricao: 'Laboratório de referência em pesquisa tecnológica e inovação.',
        missao: '',
        visao: '',
        regras: '',
      },
    };
  }
}

export default async function HomePage() {
  const { inventario, documentos, equipe, slides, sobre } = await getData();

  return (
    <>
      {/* ── HERO ── */}
      <HeroSlider slides={slides} />

      {/* ── ACESSO RÁPIDO ── */}
      <section className="quick-access" id="acesso">
        <div className="container">
          <div className="section-label">Acesso Rápido</div>
          <h2 className="section-title">O que você precisa hoje?</h2>
          <div className="divider" />
          <div className="cards-grid">
            {[
              { href: '#agendamento', icon: '📅', color: 'blue',   title: 'Agendamento',  desc: 'Reserve equipamentos e espaços do laboratório de forma rápida e prática.',             cta: 'Agendar →'       },
              { href: '#inventario',  icon: '🖥️',  color: 'green',  title: 'Equipamentos', desc: 'Consulte o inventário completo e verifique a disponibilidade dos recursos.',           cta: 'Ver inventário →' },
              { href: '/documentos', icon: '📄', color: 'amber',  title: 'Documentos',   desc: 'Acesse o repositório de relatórios, regimentos e documentos institucionais.',           cta: 'Acessar →'        },
              { href: '/equipe',     icon: '👥', color: 'purple', title: 'Equipe',        desc: 'Conheça os pesquisadores, técnicos e coordenadores do laboratório.',                   cta: 'Conhecer →'       },
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

      {/* ── INVENTÁRIO ── */}
      <section className="inventory" id="inventario" style={{ background: 'white' }}>
        <div className="container">
          <InventoryTable items={inventario} />
        </div>
      </section>

      {/* ── AGENDAMENTO ── */}
      <section className="scheduling" id="agendamento">
        <div className="container">
          <div className="scheduling-grid">
            <div>
              <div className="section-label">Reservas</div>
              <h2 className="section-title">Agendamento de Equipamentos</h2>
              <div className="divider" />
              <p className="section-desc">
                Preencha o formulário para solicitar a reserva de um equipamento.
                Nossa equipe confirmará a disponibilidade em até 24 horas.
              </p>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { n: '1', title: 'Selecione o equipamento',    sub: 'Escolha o recurso desejado no formulário', color: 'var(--navy)'  },
                  { n: '2', title: 'Informe período e finalidade', sub: 'Descreva brevemente o objetivo de uso',   color: 'var(--navy)'  },
                  { n: '✓', title: 'Aguarde a confirmação',       sub: 'Você receberá confirmação por e-mail',    color: 'var(--green)' },
                ].map((step) => (
                  <div key={step.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, background: step.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>
                      {step.n}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--navy)' }}>{step.title}</strong>
                      <br />
                      <span style={{ fontSize: 14, color: 'var(--gray-600)' }}>{step.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <SchedulingForm equipamentos={inventario} />
          </div>
        </div>
      </section>

      {/* ── DOCUMENTOS (preview) ── */}
      <section className="documents" id="documentos" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="section-label">Repositório Institucional</div>
          <h2 className="section-title">Documentos e Relatórios</h2>
          <div className="divider" />
          <div className="docs-grid">
            {documentos.map((doc: any) => (
              <div key={doc.id} className="doc-card">
                <div className="doc-icon">📄</div>
                <div>
                  <div className="doc-name">{doc.titulo}</div>
                  <div className="doc-meta">
                    📁 {doc.categoria ?? 'Documento'} &nbsp;•&nbsp;
                    🗓️ {new Date(doc.data_upload).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="doc-actions">
                  <a href={doc.arquivo_url} className="btn-doc primary" target="_blank" rel="noopener noreferrer">👁️ Visualizar</a>
                  <a href={doc.arquivo_url} className="btn-doc" download>⬇️ Baixar</a>
                </div>
              </div>
            ))}
          </div>
          {documentos.length === 0 && (
            <p style={{ color: 'var(--gray-600)', textAlign: 'center', padding: 32 }}>
              Nenhum documento publicado ainda.
            </p>
          )}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/documentos" className="btn-action">Ver todos os documentos →</Link>
          </div>
        </div>
      </section>

      {/* ── EQUIPE (preview) ── */}
      <section className="team" id="equipe" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-label">Nossos Profissionais</div>
          <h2 className="section-title">Equipe do Laboratório</h2>
          <div className="divider" />
          <div className="team-grid">
            {equipe.slice(0, 8).map((m: any) => {
              const initials = m.nome?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() ?? '??';
              return (
                <div key={m.id} className="team-card">
                  <div className="team-avatar">
                    {m.imagem_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.imagem_url} alt={m.nome} />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="team-name">{m.nome}</div>
                  <div className="team-role">{m.cargo}</div>
                  {m.lattes_url && (
                    <a href={m.lattes_url} className="btn-lattes" target="_blank" rel="noopener noreferrer">
                      🎓 Currículo Lattes
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          {equipe.length > 8 && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <Link href="/equipe" className="btn-action">Ver toda a equipe →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── SOBRE (dinâmico) ── */}
      <section className="about" id="sobre">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ color: 'var(--green-accent)' }}>Quem Somos</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12 }}>
              {sobre.titulo}
            </h2>
            <p className="rich-text" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 600, margin: '0 auto', fontSize: 17 }}>
              {sobre.descricao}
            </p>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-card-icon">🎯</div>
              <h3>Missão</h3>
              <p className="rich-text">{sobre.missao}</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">🔭</div>
              <h3>Visão</h3>
              <p className="rich-text">{sobre.visao}</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon">📋</div>
              <h3>Regras de Uso</h3>
              <p className="rich-text">{sobre.regras}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
