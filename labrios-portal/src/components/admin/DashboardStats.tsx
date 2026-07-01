"use client";
import React from "react";
import { Layers, Calendar, Users } from "lucide-react";

interface DashboardStatsProps {
  counts: {
    equipments: number;
    team: number;
    reservations: number;
  };
}

export function DashboardStats({ counts }: DashboardStatsProps) {
  const cards = [
    {
      icon: <Layers className="w-5 h-5 text-[#003366]" />,
      title: "Equipamentos",
      value: counts?.equipments || 0,
      desc: "Dispositivos ativos no patrimônio",
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#2E7D32]" />,
      title: "Total de Reservas",
      value: counts?.reservations || 0,
      desc: "Solicitações registradas no sistema",
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      title: "Equipe Técnico-Científica",
      value: counts?.team || 0,
      desc: "Pesquisadores e colaboradores ativos",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((c, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-gray-50 rounded-xl shrink-0">
            {c.icon}
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{c.title}</p>
            <p className="text-xl font-black text-[#003366] mt-0.5">{c.value}</p>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-none">{c.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
