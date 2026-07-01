'use client';
// components/Navbar.tsx
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Navegação principal">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="LTIP" style={{ height: 40, width: 'auto', display: 'block' }} />
            ) : (
              'LTIP'
            )}
          </div>
          <div className="navbar-title">
            <strong>LTIP</strong>
            Laboratório de Tecnologia da Informação do PROFÁGUA
          </div>
        </Link>

        <div className="navbar-nav">
          <Link href="/#inventario">Inventário</Link>
          <Link href="/#agendamento">Agendamento</Link>
          <Link href="/documentos">Documentos</Link>
          <Link href="/equipe">Equipe</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link href="/admin/login" className="btn-login">🔒 Área Restrita</Link>
        </div>

        <button
          className="hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Menu mobile (dropdown) */}
      <div className={`navbar-mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link href="/#inventario" onClick={() => setMenuOpen(false)}>Inventário</Link>
        <Link href="/#agendamento" onClick={() => setMenuOpen(false)}>Agendamento</Link>
        <Link href="/documentos" onClick={() => setMenuOpen(false)}>Documentos</Link>
        <Link href="/equipe" onClick={() => setMenuOpen(false)}>Equipe</Link>
        <Link href="/#sobre" onClick={() => setMenuOpen(false)}>Sobre</Link>
        <Link href="/admin/login" className="btn-login" onClick={() => setMenuOpen(false)}>🔒 Área Restrita</Link>
      </div>
    </nav>
  );
}
