"use client";
import React from "react";
import { LayoutDashboard, FileText, Shield, Users, CalendarCheck, HelpCircle } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onLogout: () => void;
}

export function AdminSidebar({ currentTab, setTab, onLogout }: SidebarProps) {
  const menus = [
    { id: "dashboard", label: "Painel Geral", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "equipments", label: "Equipamentos", icon: <Shield className="w-4 h-4" /> },
    { id: "team", label: "Membros e Equipe", icon: <Users className="w-4 h-4" /> },
    { id: "reservations", label: "Reservas", icon: <CalendarCheck className="w-4 h-4" /> },
    { id: "rules", label: "Regras de Uso", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "config", label: "Regimento Interno", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full md:w-64 bg-navy text-white flex flex-col md:min-h-screen py-6 border-r border-white/5 shrink-0">
      <div className="px-6 pb-6 border-b border-white/10">
        <h2 className="text-sm font-extrabold tracking-wider uppercase">LABRIOS Admin</h2>
        <p className="text-[11px] text-white/60 mt-0.5 font-medium">Coordenador: Rafael Jovito</p>
      </div>
      <nav className="flex-1 py-4 space-y-0.5">
        {menus.map((m) => (
          <button
            key={m.id}
            onClick={() => setTab(m.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all text-left border-l-4 ${
              currentTab === m.id 
                ? "bg-white/12 text-white border-green-accent" 
                : "border-transparent text-white/75 hover:bg-white/8 hover:text-white"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </nav>
      <div className="px-6 pt-4 border-t border-white/10">
        <button 
          onClick={onLogout} 
          className="w-full text-center text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg py-2 hover:bg-red-950/20 transition-all"
        >
          Sair do Painel
        </button>
      </div>
    </div>
  );
}
