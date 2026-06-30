import { supabase } from '../lib/supabase';
import HeroSlider from '../components/HeroSlider';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function fetchHomeData() {
  const [slidesRes, equipsRes, configRes] = await Promise.all([
    supabase.from('configuracoes_labrios').select('valor').eq('chave', 'slides').single(),
    supabase.from('equipamentos').select('*').order('nome'),
    supabase.from('configuracoes_labrios').select('valor').eq('chave', 'geral').single()
  ]);

  return {
    slides: slidesRes.data?.valor || [],
    equipamentos: equipsRes.data || [],
    geral: configRes.data?.valor || {}
  };
}

export default async function HomePage() {
  const { slides, equipamentos, geral } = await fetchHomeData();

  return (
    <>
      <HeroSlider slides={slides} />

      {/* TEXTO INSTITUCIONAL */}
      <section style={{ background: 'var(--gray-50)' }}>
        <div className="container text-center" style={{ textAlign: 'center' }}>
          <div className="section-label">Apresentação</div>
          <h1 className="section-title">{geral.nome_oficial || 'LABRIOS'}</h1>
          <div className="divider" style={{ margin: '16px auto' }} />
          <p className="rich-text" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '18px', color: 'var(--gray-600)' }}>
            {geral.texto_institucional}
          </p>
        </div>
      </section>

      {/* GALERIA DE EQUIPAMENTOS */}
      <section id="equipamentos" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-label">Recursos Disponíveis</div>
          <h2 className="section-title">Equipamentos para Reserva</h2>
          <div className="divider" />

          <div className="cards-grid">
            {equipamentos.map((eq: any) => (
              <div key={eq.id} className="equip-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                {eq.imagem_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={eq.imagem_url} alt={eq.nome} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
                )}
                <h3 style={{ color: 'var(--navy)', fontSize: '18px', fontWeight: 700 }}>{eq.nome}</h3>
                <p style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{eq.marca} - {eq.modelo}</p>
                <p className="rich-text" style={{ fontSize: '14px', margin: '12px 0', flexGrow: 1 }}>{eq.finalidade}</p>
                <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '14px' }}>Quantidade: {eq.quantidade}</div>
                
                <Link href={`/reserva/solicitar?equipamentoId=${eq.id}`} className="slide-cta" style={{ justifyContent: 'center', fontSize: '14px', padding: '10px' }}>
                  Reservar Equipamento
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}