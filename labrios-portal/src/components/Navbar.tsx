"use client";
import React from "react";
import Link from "next/link";
import { FlaskConical } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#002244] text-white fixed top-0 left-0 right-0 h-[68px] flex items-center z-50 shadow-md border-b border-white/5">
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Identidade Visual */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <div className="bg-white/10 rounded-xl p-2 font-black text-sm tracking-tight text-white group-hover:bg-white/15 transition-all flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-[#66BB6A]" />
            <span>LABRIOS</span>
          </div>
          <span className="text-[11px] text-white/70 font-semibold tracking-wide uppercase hidden sm:block">
            Laboratório de Análise de Água
          </span>
        </Link>

        {/* Links Internos de Navegação */}
        <div className="flex items-center gap-6 text-xs font-bold text-white/80">
          <a href="#sobre" className="hover:text-white transition-colors no-underline">O Laboratório</a>
          <a href="#atuacao" className="hover:text-white transition-colors no-underline hidden md:block">Áreas</a>
          <a href="#equipamentos" className="hover:text-white transition-colors no-underline">Equipamentos</a>
          <a href="#equipe" className="hover:text-white transition-colors no-underline hidden sm:block">Equipe</a>
          <a href="#agenda" className="hover:text-white transition-colors no-underline">Agenda</a>
          
          <Link 
            href="/login" 
            className="bg-[#2E7D32] hover:bg-[#43A047] text-white px-3.5 py-2 rounded-xl transition-all font-bold shadow-md shadow-green-900/20 no-underline"
          >
            Acesso Restrito
          </Link>
        </div>
      </div>
    </nav>
  );
}
