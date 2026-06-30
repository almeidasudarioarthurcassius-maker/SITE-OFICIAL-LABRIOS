'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ nomeLab }: { nomeLab: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo">LAB</div>
          <div className="navbar-title">
            <strong>{nomeLab || 'LABRIOS'}</strong>
            Portal de Gerenciamento e Reservas
          </div>
        </Link>

        <div className="navbar-nav">
          <Link href="/">Início</Link>
          <Link href="/equipe">Equipe</Link>
          <Link href="/como-utilizar">Como Utilizar</Link>
          <Link href="/#equipamentos">Equipamentos</Link>
          <Link href="/agenda">Agenda</Link>
          <Link href="/comite-gestor">Comitê Gestor</Link>
          <Link href="/comite-usuarios">Comitê Usuários</Link>
          <Link href="/admin/dashboard" className="btn-login">🔒 Login</Link>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Início</Link>
        <Link href="/equipe" onClick={() => setMenuOpen(false)}>Equipe</Link>
        <Link href="/como-utilizar" onClick={() => setMenuOpen(false)}>Como Utilizar</Link>
        <Link href="/#equipamentos" onClick={() => setMenuOpen(false)}>Equipamentos</Link>
        <Link href="/agenda" onClick={() => setMenuOpen(false)}>Agenda</Link>
        <Link href="/admin/dashboard" className="btn-login" onClick={() => setMenuOpen(false)}>🔒 Login</Link>
      </div>
    </nav>
  );
}