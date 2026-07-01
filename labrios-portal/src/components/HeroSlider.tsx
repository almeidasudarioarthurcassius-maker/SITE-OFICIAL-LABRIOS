"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, FlaskConical, ShieldCheck, Activity } from "lucide-react";

const slides = [
  {
    icon: <FlaskConical className="w-12 h-12 text-[#66BB6A]" />,
    title: "Monitoramento Hídrico na Amazônia",
    desc: "Análises físico-químicas e microbiológicas avançadas servindo de suporte estratégico para o desenvolvimento regional do Baixo Amazonas.",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-[#66BB6A]" />,
    title: "Infraestrutura de Apoio ao ProfÁgua",
    desc: "Espaço tecnológico dedicado à formação científica de alta qualidade e à execução de dissertações voltadas à regulação de recursos hídricos.",
  },
  {
    icon: <Activity className="w-12 h-12 text-[#66BB6A]" />,
    title: "Segurança Analítica e Rigor Técnico",
    desc: "Exatidão laboratorial na amostragem e dosagem de coliformes termotolerantes com foco em saneamento e planejamento ambiental.",
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div id="inicio" className="relative h-[480px] overflow-hidden bg-gradient-to-br from-[#002244] via-[#003366] to-[#004488] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,125,50,0.08),transparent_60%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center relative z-10">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="inline-block p-3 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                {slides[current].icon}
              </div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                {slides[current].title}
              </h2>
              <p className="text-sm md:text-base text-white/80 leading-relaxed font-medium">
                {slides[current].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-6 mt-8">
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current ? "w-6 bg-[#66BB6A]" : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Ir para o slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botões Laterais de Navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all z-20 hidden md:block"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all z-20 hidden md:block"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
