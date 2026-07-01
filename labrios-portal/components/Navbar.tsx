'use client';
import { useState } from 'react';
import Link from 'next/link';

type Props = { logoUrl: string | null };

export default function Navbar({ logoUrl }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo">
            {logoUrl ? <img src={logoUrl} alt="LabRios" style={{ height: '40px' }} /> : 'LabRios'}
          </div>
          <div className="navbar-title">
            <strong>LabRios / CESP</strong>
            <span>Análise de Água do Amazonas</span>
          </div>
        </Link>

        <div className="navbar-nav">
          <Link href="/#inventario">Equipamentos</Link>
          <Link href="/#agendamento">Agendamento</Link>
          <Link href="/documentos">Documentos</Link>
          <Link href="/equipe">Equipe</Link>
          <Link href="/#sobre">Sobre</Link>
          <Link href="/admin/login" className="btn-login">🔒 Área Administrativa</Link>
        </div>
      </div>
    </nav>
  );
}
