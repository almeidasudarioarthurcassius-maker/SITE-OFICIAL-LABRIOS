'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export type Slide = { tag: string; title: string; desc: string; img: string; ctaLabel: string; ctaHref: string };

const FALLBACK: Slide[] = [{
  tag: 'LABRIOS', title: 'Laboratório de Análise de Água do Médio Amazonas',
  desc: 'Infraestrutura científica de referência para análise de recursos hídricos na região amazônica.',
  img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1400&q=80',
  ctaLabel: 'Ver Equipamentos →', ctaHref: '/#equipamentos',
}];

export default function HeroSlider({ slides }: { slides?: Slide[] }) {
  const data = slides && slides.length > 0 ? slides : FALLBACK;
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => (c + 1) % data.length), [data.length]);
  const prev = () => setCurrent((c) => (c - 1 + data.length) % data.length);
  useEffect(() => { setCurrent(0); }, [data.length]);
  useEffect(() => { const t = setInterval(next, 5500); return () => clearInterval(t); }, [next]);

  return (
    <section className="hero" aria-label="Banner principal">
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {data.map((slide, i) => (
          <div key={i} className={`slide${i === current ? ' active' : ''}`}
            style={{ backgroundColor: '#001833', backgroundImage: slide.img ? `url('${slide.img}')` : undefined }}>
            <div className="slide-overlay" />
            <div className="slide-content">
              <span className="slide-tag">{slide.tag}</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-desc">{slide.desc}</p>
              <Link href={slide.ctaHref || '#'} className="slide-cta">{slide.ctaLabel || 'Saiba mais →'}</Link>
            </div>
          </div>
        ))}
        {data.length > 1 && (<>
          <button className="slider-arrow prev" onClick={prev} aria-label="Anterior">‹</button>
          <button className="slider-arrow next" onClick={next} aria-label="Próximo">›</button>
          <div className="slider-dots">
            {data.map((_, i) => (
              <button key={i} className={`dot${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>)}
      </div>
    </section>
  );
}
