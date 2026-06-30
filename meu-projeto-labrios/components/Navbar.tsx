'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ logoUrl, nomeLab }: { logoUrl?: string | null; nomeLab?: string }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <nav className="navbar" role="navigation" aria-label="Navegação principal">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo">
            {logoUrl
              ? <img
                  src={logoUrl}
                  alt="LABRIOS"
                  style={{ height: 40, width: 'auto', display: 'block' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.textContent = nomeLab || 'LABRIOS';
                  }}
                />
              : (nomeLab || 'LABRIOS')}
          </div>
          <div className="navbar-title">
            <strong>{nomeLab || 'LABRIOS'}</strong>
            Laboratório de Análise de Água do Médio Amazonas
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
          <Link href="/admin/login" className="btn-login">🔒 Área Restrita</Link>
        </div>

        <button className="hamburger" aria-label="Menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar-mobile-menu${open ? ' open' : ''}`}>
        <Link href="/" onClick={close}>Início</Link>
        <Link href="/equipe" onClick={close}>Equipe</Link>
        <Link href="/como-utilizar" onClick={close}>Como Utilizar</Link>
        <Link href="/#equipamentos" onClick={close}>Equipamentos</Link>
        <Link href="/agenda" onClick={close}>Agenda</Link>
        <Link href="/comite-gestor" onClick={close}>Comitê Gestor</Link>
        <Link href="/comite-usuarios" onClick={close}>Comitê Usuários</Link>
        <Link href="/admin/login" className="btn-login" onClick={close}>🔒 Área Restrita</Link>
      </div>
    </nav>
  );
}
