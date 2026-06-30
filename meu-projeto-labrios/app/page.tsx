// app/page.tsx
import { supabase } from '../lib/supabase';
import HeroSlider, { Slide } from '../components/HeroSlider';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    const [slidesRes, equipsRes, configRes] = await Promise.all([
      supabase.from('configuracoes_labrios').select('valor').eq('chave', 'slides').single(),
      supabase.from('equipamentos').select('*').order('nome'),
      supabase.from('configuracoes_labrios').select('valor').eq('chave', 'geral').single(),
    ]);
    const rawSlides: any[] = Array.isArray(slidesRes.data?.valor) ? slidesRes.data.valor : [];
    const slides: Slide[] = rawSlides
      .filter((s) => s && typeof s === 'object')
      .map((s) => ({
        tag: typeof s.tag === 'string' ? s.tag : 'LABRIOS',
        title: typeof s.title === 'string' ? s.title : '',
        desc: typeof s.desc === 'string' ? s.desc : '',
        img: typeof s.img === 'string' ? s.img : '',
        ctaLabel: typeof s.ctaLabel === 'string' ? s.ctaLabel : 'Saiba mais →',
        ctaHref: typeof s.ctaHref === 'string' ? s.ctaHref : '/#equipamentos',
      }));
    return {
      slides,
      equipamentos: equipsRes.data ?? [],
      geral: configRes.data?.valor ?? {},
    };
  } catch {
    return { slides: [], equipamentos: [], geral: {} };
  }
}

export default async function HomePage() {
  const { slides, equipamentos, geral } = await getData();

  return (
    <>
      <HeroSlider slides={slides} />

      {/* APRESENTAÇÃO INSTITUCIONAL */}
      <section style={{ background: 'var(--gray-50)', padding: '72px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label">Apresentação</div>
          <h1 className="section-title">{geral.nome_oficial || 'LABRIOS'}</h1>
          <div className="divider" style={{ margin: '16px auto' }} />
          {geral.texto_institucional && (
            <p className="rich-text section-desc" style={{ maxWidth: 820, margin: '0 auto', fontSize: 17 }}>
              {geral.texto_institucional}
            </p>
          )}

          {/* Acesso Rápido */}
          <div className="cards-grid" style={{ marginTop: 48, textAlign: 'left' }}>
            {[
              { href: '/#equipamentos', icon: '🔬', color: 'green', title: 'Equipamentos', desc: 'Consulte a lista de equipamentos disponíveis para reserva no laboratório.', cta: 'Ver equipamentos →' },
              { href: '/reserva/solicitar', icon: '📅', color: 'blue', title: 'Solicitar Reserva', desc: 'Preencha o formulário e solicite o uso de um equipamento do laboratório.', cta: 'Solicitar →' },
              { href: '/agenda', icon: '📋', color: 'amber', title: 'Agenda', desc: 'Consulte o calendário de reservas aprovadas dos equipamentos.', cta: 'Ver agenda →' },
              { href: '/como-utilizar', icon: '📖', color: 'purple', title: 'Como Utilizar', desc: 'Leia as normas e baixe o regimento interno do laboratório.', cta: 'Acessar →' },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="qcard">
                <div className={`qcard-icon ${c.color}`}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className="qcard-arrow">{c.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPAMENTOS */}
      <section id="equipamentos" style={{ background: 'white', padding: '72px 0' }}>
        <div className="container">
          <div className="section-label">Recursos Disponíveis</div>
          <h2 className="section-title">Equipamentos para Reserva</h2>
          <div className="divider" />

          {equipamentos.length === 0 ? (
            <p style={{ color: 'var(--gray-600)', textAlign: 'center', padding: 40 }}>
              Nenhum equipamento cadastrado ainda.
            </p>
          ) : (
            <div className="cards-grid">
              {equipamentos.map((eq: any) => (
                <div key={eq.id} className="equip-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  {eq.imagem_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={eq.imagem_url} alt={eq.nome}
                      style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
                  )}
                  <h3 style={{ color: 'var(--navy)', fontSize: 17, fontWeight: 700 }}>{eq.nome}</h3>
                  <p style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 4 }}>
                    {eq.marca} — {eq.modelo}
                  </p>
                  {eq.finalidade && (
                    <p className="rich-text" style={{ fontSize: 14, margin: '12px 0', flexGrow: 1, color: 'var(--gray-600)' }}>
                      {eq.finalidade}
                    </p>
                  )}
                  <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: 'var(--navy)' }}>
                    Quantidade: {eq.quantidade}
                  </p>
                  <Link href={`/reserva/solicitar?equipamentoId=${eq.id}`} className="slide-cta"
                    style={{ justifyContent: 'center', fontSize: 14, padding: '10px 16px' }}>
                    📅 Reservar Equipamento
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
