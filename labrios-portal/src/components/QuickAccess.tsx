"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Calendar, FileText, ShieldAlert } from "lucide-react";

export default function QuickAccess() {
  const router = useRouter();

  const cards = [
    {
      icon: <Calendar className="w-6 h-6 text-[#2E7D32]" />,
      title: "Reserva de Equipamentos",
      desc: "Solicite agendamento de bancadas e dispositivos para suas análises analíticas.",
      action: () => {
        const el = document.getElementById("agenda");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-[#2E7D32]" />,
      title: "Infraestrutura Técnica",
      desc: "Consulte o catálogo de maquinários e especificações analíticas do patrimônio.",
      action: () => {
        const el = document.getElementById("equipamentos");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      icon: <FileText className="w-6 h-6 text-[#2E7D32]" />,
      title: "Regimento Interno",
      desc: "Consulte os direitos, deveres e as resoluções de regulação técnica do laboratório.",
      action: () => {
        const el = document.getElementById("regimento");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-[#2E7D32]" />,
      title: "Área de Governança",
      desc: "Acesso restrito para homologação de chamados, relatórios e gestão de dados.",
      action: () => router.push("/login")
    }
  ];

  return (
    <section className="bg-gray-50 border-t border-gray-200 py-16">
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              onClick={c.action}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#2E7D32]/5 flex items-center justify-center transition-all group-hover:bg-[#2E7D32]/10">
                  {c.icon}
                </div>
                <h3 className="text-sm font-black text-[#003366] tracking-tight">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {c.desc}
                </p>
              </div>
              <div className="mt-4 pt-2 text-[11px] font-bold text-[#2E7D32] flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                Acessar Módulo →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
