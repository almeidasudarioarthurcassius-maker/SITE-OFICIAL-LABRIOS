import React from "react";
import { Shield, Users, CalendarClock, BookOpen } from "lucide-react";

interface StatsProps {
  counts: { equipments: number; team: number; reservations: number; rules: number };
}

export function DashboardStats({ counts }: { counts: any }) {
  const cards = [
    { label: "Equipamentos Cadastrados", val: counts.equipments, icon: <Shield className="w-6 h-6 text-navy" /> },
    { label: "Membros da Equipe / Comitês", val: counts.team, icon: <Users className="w-6 h-6 text-green" /> },
    { label: "Solicitações de Reservas", val: counts.reservations, icon: <CalendarClock className="w-6 h-6 text-amber-600" /> },
    { label: "Regras Operacionais", val: counts.rules, icon: <BookOpen className="w-6 h-6 text-purple-600" /> },
  ];

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, i) => (
        <div key={i} class="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm">
          <div class="p-3 bg-gray-50 rounded-xl shrink-0">{c.icon}</div>
          <div>
            <div class="text-2xl font-black text-navy">{c.val}</div>
            <div class="text-xs text-gray-500 font-medium mt-0.5">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}