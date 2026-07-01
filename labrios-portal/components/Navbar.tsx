'use client';
import Link from 'next/link';

interface NavbarProps {
  logoUrl?: string | null;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  // Define uma imagem padrão caso nenhuma logo tenha sido salva ainda
  const imagemLogo = logoUrl || '/logo-placeholder.png'; 

  return (
    <nav style={{ position: 'fixed', top: 0, width: '100%', height: '68px', background: 'white', borderBottom: '1px solid var(--gray-200)', zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Link href="/">
          <img 
            src={imagemLogo} 
            alt="Logo LabRios" 
            style={{ height: '45px', maxWidth: '200px', objectFit: 'contain', cursor: 'pointer' }} 
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo-placeholder.png'; }}
          />
        </Link>
        {/* Seus links de navegação continuam aqui abaixo sem alterações */}
      </div>
    </nav>
  );
}
