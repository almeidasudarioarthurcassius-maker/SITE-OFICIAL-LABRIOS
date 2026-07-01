'use client';
import { useState, useEffect } from 'react';

export type Slide = {
  tag: string;
  title: string;
  desc: string;
  img: string;
  ctaLabel: string;
  ctaHref: string;
};

type Props = { slides: Slide[] };

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="hero-slider">
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === current ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="slide-overlay" />
            <div className="slide-content">
              {slide.tag && <span className="slide-tag">{slide.tag}</span>}
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-desc">{slide.desc}</p>
              <a href={slide.ctaHref} className="btn-action" style={{ background: 'var(--green)', color: 'white', border: 'none', padding: '12px 24px', fontSize: '15px' }}>
                {slide.ctaLabel}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
