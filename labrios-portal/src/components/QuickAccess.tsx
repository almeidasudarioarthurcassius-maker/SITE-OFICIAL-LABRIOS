import React from "react";
import { ShieldCheck, Calendar, Activity, Info } from "lucide-react";

export function QuickAccess() {
  const cards = [
    { icon: <Activity className="text-blue-600 w-8 h-8" />, title: "Análise e Técnicas", desc: "Coliformes termotolerantes e parâmetros físico-químicos.", link: "#inicio" },
    { icon: <ShieldCheck className="text-green-600 w-8 h-8" />, title: "Regimento Interno", desc: "Consulte as normas e diretrizes regulamentares de uso.", link: "#regras" },
    { icon: <Calendar className="text-amber-600 w-8 h-8" />, title: "Reserva de Equipamentos", desc: "Solicite agendamento prévio estruturado para sua pesquisa.", link: "#equipamentos" },
    { icon: <Info className="text-purple-600 w-8 h-8" />, title: "Comitês Gestores", desc: "Conheça o comitê de usuários e o conselho gestor.", link: "#comites" },
  ];

  return (
    <section class="bg-gray-50 border-t-4 border-navy py-16">
      <div class="max-w-[1280px] w-full mx-auto px-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <a key={i} href={c.link} class="bg-white rounded-xl border border-gray-200 p-8 text-center block hover:shadow-xl hover:border-navy hover:-translate-y-1 transition-all group">
              <div class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-all">
                {c.icon}
              </div>
              <h3 class="text-base font-bold text-navy mb-2">{c.title}</h3>
              <p class="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              <div class="text-xs font-semibold text-green mt-4 inline-flex items-center gap-1">Acessar Seção &rarr;</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}