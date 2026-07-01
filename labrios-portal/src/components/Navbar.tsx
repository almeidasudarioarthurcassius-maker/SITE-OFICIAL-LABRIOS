"use client";
import React, { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav class="navbar bg-navy text-white fixed top-0 left-0 right-0 h-[68px] flex items-center z-40 shadow-md">
      <div class="max-w-[1280px] w-full mx-auto px-6 flex justify-between items-center">
        <Link href="/" class="flex items-center gap-3 decoration-none">
          <div class="bg-white/15 rounded-md px-3 py-1 font-extrabold text-lg tracking-wider text-white">
            LABRIOS
          </div>
          <div class="text-xs leading-tight font-medium hidden sm:block">
            <span class="block text-sm font-bold">LABRIOS / CESP</span>
            Laboratório de Análise de Água do Baixo Amazonas
          </div>
        </Link>

        <button onClick={() => setIsOpen(!isOpen)} class="sm:hidden flex flex-col gap-1.5 bg-none border-none cursor-pointer">
          <span class="w-6 h-0.5 bg-white block rounded-sm" />
          <span class="w-6 h-0.5 bg-white block rounded-sm" />
          <span class="w-6 h-0.5 bg-white block rounded-sm" />
        </button>

        <div class={`${isOpen ? "flex" : "hidden"} sm:flex absolute sm:static top-[68px] left-0 right-0 bg-navy flex-col sm:flex-row p-6 sm:p-0 gap-1 sm:gap-2 shadow-lg sm:shadow-none border-t border-white/10 sm:border-none`}>
          <a href="#inicio" class="text-white/85 hover:bg-white/12 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">Início</a>
          <a href="#equipe" class="text-white/85 hover:bg-white/12 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">Equipe</a>
          <a href="#regras" class="text-white/85 hover:bg-white/12 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">Como Utilizar</a>
          <a href="#equipamentos" class="text-white/85 hover:bg-white/12 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">Equipamentos</a>
          <a href="#agenda" class="text-white/85 hover:bg-white/12 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">Agenda</a>
          <a href="#comites" class="text-white/85 hover:bg-white/12 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all">Comitês</a>
          <Link href="/login" class="bg-green hover:bg-green-light text-white px-4 py-2 rounded-lg text-sm font-semibold ml-0 sm:ml-2 text-center transition-all">Login</Link>
        </div>
      </div>
    </nav>
  );
}