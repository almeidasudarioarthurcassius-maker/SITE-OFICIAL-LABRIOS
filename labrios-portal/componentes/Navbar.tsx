'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-navy-dark to-navy text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-lg tracking-wide flex items-center gap-2">
              <span className="bg-ltip-green px-2 py-1 rounded text-sm text-white">LTIP</span>
              Laboratório de Tecnologia da Informação do Prof. Água
            </Link>
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/" className="hover:bg-navy-light px-3 py-2 rounded-md text-sm font-medium transition">Início</Link>
            <Link href="/inventario" className="hover:bg-navy-light px-3 py-2 rounded-md text-sm font-medium transition">Inventário</Link>
            <Link href="/equipe" className="hover:bg-navy-light px-3 py-2 rounded-md text-sm font-medium transition">Equipe</Link>
            <Link href="/documentos" className="hover:bg-navy-light px-3 py-2 rounded-md text-sm font-medium transition">Documentos</Link>
            <Link href="/admin" className="bg-ltip-green hover:bg-ltip-green-light px-4 py-2 rounded-md text-sm font-medium transition shadow">Painel Admin</Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-navy-light">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-navy-dark px-2 pt-2 pb-3 space-y-1">
          <Link href="/" className="block hover:bg-navy-light px-3 py-2 rounded-md text-base font-medium">Início</Link>
          <Link href="/inventario" className="block hover:bg-navy-light px-3 py-2 rounded-md text-base font-medium">Inventário</Link>
          <Link href="/equipe" className="block hover:bg-navy-light px-3 py-2 rounded-md text-base font-medium">Equipe</Link>
          <Link href="/documentos" className="block hover:bg-navy-light px-3 py-2 rounded-md text-base font-medium">Documentos</Link>
          <Link href="/admin" className="block bg-ltip-green text-center mx-3 my-2 py-2 rounded-md text-base font-medium">Painel Admin</Link>
        </div>
      )}
    </nav>
  );
}