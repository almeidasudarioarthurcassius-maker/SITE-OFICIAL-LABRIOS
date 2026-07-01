"use client";
import React from "react";
import { Layers, Calendar, CheckSquare, Clock } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalEquipments: number;
    totalReservations: number;
    approvedReservations: number;
    pendingReservations: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      icon: <Layers className="w-5 h-5 text-[#003366]" />,
      title: "Equipamentos",
      value: stats.totalEquipments,
      desc: "Dispositivos ativos no patrimônio",
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#2E7D32]" />,
      title: "Total de Reservas",
      value: stats.totalReservations,
      desc: "Solicitações registradas no banco",
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-blue-600" />,
      title: "Aprovadas",
      value: stats.approvedReservations,
      desc: "Agendamentos homologados na agenda",
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      title: "Pendentes",
      value: stats.pendingReservations,
      desc: "Aguardando análise da coordenação",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
