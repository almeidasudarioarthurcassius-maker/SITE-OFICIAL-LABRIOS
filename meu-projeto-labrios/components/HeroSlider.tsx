'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function HeroSlider({ slides }: { slides: any[] }) {
  const [current, setCurrent] = useState(0);
  const data = slides.length > 0 ? slides : [{
    tag: 'LABRIOS',
    title: 'Infraestrutura de Pesquisa',
    desc: 'Sistema moderno de reservas de equipamentos.',
    img: '',
    ctaLabel: 'Ver Equipamentos',
    ctaHref: '#equipamentos'
  }];

  const next = useCallback(() => setCurrent((c) => (c + 1) % data.length), [data.length]);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="hero">
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {data.map((slide: any, i: number) => (
          <div
            key={i}
            className={`slide${i === current ? ' active' : ''}`}
            style={{
              backgroundColor: '#001833',
              backgroundImage: slide.img ? `url('${slide.img}')` : undefined,
            }}
          >
            <div className="slide-overlay" />
            <div className="slide-content">
              <span className="slide-tag">{slide.tag}</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-desc">{slide.desc}</p>
              <Link href={slide.ctaHref || '#'} className="slide-cta">
                {slide.ctaLabel || 'Acessar Recursos'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}