"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    tag: "Pesquisa & Desenvolvimento",
    title: "Análise de Água do Baixo Amazonas",
    desc: "Laboratório vinculado ao ProfÁgua/UEA voltado para análises físico-químicas e microbiológicas servindo de apoio a dissertações e projetos de inovação regional.",
  },
  {
    tag: "Qualidade Ambiental",
    title: "Monitoramento e Planejamento Sustentável",
    desc: "Atividades essenciais na formação de recursos humanos e na amostragem estruturada de parâmetros ambientais para proteção dos recursos hídricos.",
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="inicio" class="mt-[68px] relative h-[520px] overflow-hidden bg-navy-dark text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          class="absolute inset-0 flex items-center bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(0,33,68,0.92) 0%, rgba(0,33,68,0.5) 70%, transparent 100%)` }}
        >
          <div class="max-w-[1280px] w-full mx-auto px-6">
            <span class="inline-block bg-green text-[11px] font-bold tracking-[1.5px] uppercase px-3 py-1 rounded-full mb-4">
              {slides[current].tag}
            </span>
            <h1 class="text-3xl sm:text-5xl font-extrabold max-w-[650px] leading-tight mb-4">
              {slides[current].title}
            </h1>
            <p class="text-base sm:text-lg max-w-[540px] text-white/85 mb-8 leading-relaxed">
              {slides[current].desc}
            </p>
            <a href="#equipamentos" class="inline-flex items-center gap-2 bg-green hover:bg-green-light px-7 py-3 rounded-lg font-semibold text-sm transition-all shadow-md">
              Visualizar Equipamentos
            </a>
          </div>
        </motion.div>
      </AnimatePresence>

      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            class={`h-2 rounded-full transition-all ${idx === current ? "bg-white w-6" : "bg-white/40 w-2"}`}
          />
        ))}
      </div>
    </div>
  );
}